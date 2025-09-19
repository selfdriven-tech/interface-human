# selfdriven Human Interface Tech Kit - Cardano Geofence System – Design Overview

## Goal
Allow users to **create and unlock UTxOs** on Cardano **based on GPS location**, without revealing raw GPS data:
- **Place**: only ≥ 250 m away from current location.
- **Unlock**: only if ≤ 10 m from a chosen target point.
- Runs on **mobile devices**; GPS never leaves the device.

---

## Components

### 1. On-Device Prover (Browser / Mobile App)
- **Circuit**: Noir (compiled once → JSON/ACIR).
- **Proving**: runs in WebView/JS (WASM) with `@noir-lang/noir_js`.
- **Inputs**:
  - Private: current GPS (fixed-point), target lat/lon, cos(lat_target).
  - Public: radius (10 or 250), relation (≤ or ≥).
- **Output**: Zero-Knowledge Proof (ZK proof).
- **Privacy**: GPS never transmitted; only proof leaves device.

### 2. Location Oracle (Stateless Service)
- Receives: `{proof, publicInputs}`.
- Verifies ZK proof with Noir verifier.
- Signs a **digest** binding:
  - Action (`"place"` / `"unlock"`).
  - Target commitment (`blake2b_256(lat_t || lon_t || salt)`).
  - Device pubkey (and UTxO ref for unlock).
  - Expiry and radius.
  - Nonce.
- Returns `{payloadDigest, oracleSig}`.
- Learns nothing about user’s location.

### 3. Aiken On-Chain Scripts
- **Datum**: `{ target_commitment, oracle_pubkey, radius_unlock_m, expires_at? }`.
- **Place Policy**:
  - Requires oracle signature proving `dist(me,target) ≥ 250 m`.
  - Mint marker NFT / create geofence UTxO.
- **Unlock Validator**:
  - Requires oracle signature proving `dist(me,target) ≤ 10 m`.
  - Binds to specific UTxO (`utxo_ref`).
  - Requires device pubkey to also sign the tx.
  - Enforces expiry via validity interval.

### 4. Lucid SDK (Tx Builders)
- **MintPlaceAndCreateUtxo**: mints NFT + creates UTxO with datum.
- **SpendUnlock**: spends geofence UTxO using oracle signature.
- Redeemers built from oracle’s `{payloadDigest, oracleSig}`.

---

## Data Flow

**Place UTxO (≥250 m)**  
1. Phone gets GPS → runs ZK proof (`≥250 m`).  
2. Oracle verifies → returns `payloadDigest+sig`.  
3. Tx: mint NFT, create UTxO with datum, include PlaceRedeemer.

**Unlock UTxO (≤10 m)**  
1. Phone gets GPS → runs ZK proof (`≤10 m`).  
2. Oracle verifies → returns `payloadDigest+sig`.  
3. Tx: spend geofence UTxO with UnlockRedeemer.

---

## Security & UX
- **Privacy**: GPS stays local; oracle only sees proofs.
- **Anti-replay**: signature binds to UTxO ref + nonce + expiry.
- **Validity window**: short (60–120 s) enforced by tx `validTo`.
- **Spoofing**: mitigated by optional device attestation (Play Integrity / DeviceCheck).
- **UX**: proof generation runs in-browser (sub-second to few seconds).

---

## Summary
This design combines:
- **ZK proofs** (location conditions checked without revealing GPS),
- **Oracle signatures** (trusted anchor, lightweight),
- **Aiken scripts** (strict on-chain enforcement),
- **Browser/mobile prover** (simple deployment).

Result: A privacy-preserving geofence UTxO system deployable today on Cardano.
---
flowchart TD
  %% Cardano Geofence – High-Level Design (Place ≥250 m & Unlock ≤10 m)

  subgraph Mobile[Mobile Device (Browser/WebView – Noir WASM)]
    A1[Select Target (lat_t, lon_t)]:::ui
    A2[Compute Fixed-Point<br/>lat/lon & cos(lat_t)]:::calc
    A3P[Prove: dist(me, target) ≥ 250m<br/>(Noir ZK Proof)]:::prove
    A3U[Prove: dist(me, target) ≤ 10m<br/>(Noir ZK Proof)]:::prove
    A4P[Send to Oracle:<br/>{proof, action:'place', targetCommit, radius:250, expiry, creatorPub, nonce}]:::send
    A4U[Send to Oracle:<br/>{proof, action:'unlock', targetCommit, utxoRef, radius:10, expiry, devicePub, nonce}]:::send
    A5P[Receive Oracle Attestation:<br/>{payloadDigest, oracleSig}]:::recv
    A5U[Receive Oracle Attestation:<br/>{payloadDigest, oracleSig}]:::recv
    A6P[Build Mint Tx (Lucid):<br/>PlaceRedeemer(payloadDigest, oracleSig,…)]:::tx
    A6U[Build Spend Tx (Lucid):<br/>UnlockRedeemer(payloadDigest, oracleSig,…)]:::tx
  end

  subgraph Oracle[Location Oracle (Stateless)]
    O1[Verify ZK Proof (Noir verifier)]:::verify
    O2P[Digest = blake2b_256(<br/>'place' || targetCommit || creatorPub || expiry || 250 || nonce)]:::hash
    O2U[Digest = blake2b_256(<br/>'unlock' || targetCommit || utxoRef || devicePub || expiry || 10 || nonce)]:::hash
    O3[Sign Digest (Ed25519)<br/>→ oracleSig]:::sign
  end

  subgraph Chain[Cardano Chain (Aiken)]
    C0[Datum:<br/>{ target_commitment,<br/>  oracle_pubkey,<br/>  radius_unlock_m=10,<br/>  expires_at? }]:::datum

    C1[Minting Policy: geofence_place_policy]:::policy
    C1R[Checks:<br/> radius=250,<br/> digest matches,<br/> oracleSig valid,<br/> creator tx-sig,<br/> validTo ≤ expiry]:::rule

    C2[Spending Validator: geofence_unlock]:::validator
    C2R[Checks:<br/> radius=10 = datum.radius,<br/> utxoRef binds input,<br/> digest matches,<br/> oracleSig valid,<br/> device tx-sig,<br/> validTo ≤ expiry]:::rule

    C3[Create Geofence UTxO<br/>(inline datum) + Marker NFT]:::utxo
    C4[Spend Geofence UTxO<br/>(funds released)]:::spend
  end

  %% PLACE FLOW (≥250 m)
  A1 --> A2 --> A3P --> A4P --> O1 --> O2P --> O3 --> A5P --> A6P --> C1
  C1 --> C1R --> C3
  C3 --> C0

  %% UNLOCK FLOW (≤10 m)
  C3 -. contains .-> C0
  A1 --> A2 --> A3U --> A4U --> O1 --> O2U --> O3 --> A5U --> A6U --> C2
  C2 --> C2R --> C4

  %% Styles
  classDef ui fill:#eef,stroke:#88f,stroke-width:1px,color:#223;
  classDef calc fill:#f6faff,stroke:#6aa,stroke-width:1px,color:#234;
  classDef prove fill:#efe,stroke:#2a4,stroke-width:1px,color:#142;
  classDef send fill:#fff7e6,stroke:#e6a23c,stroke-width:1px,color:#5c3b00;
  classDef recv fill:#fff7e6,stroke:#e6a23c,stroke-width:1px,color:#5c3b00,stroke-dasharray: 3 3;
  classDef tx fill:#f0f9ff,stroke:#3aa,stroke-width:1px,color:#033;
  classDef verify fill:#fef,stroke:#a3a,stroke-width:1px,color:#402;
  classDef hash fill:#fef,stroke:#a3a,stroke-width:1px,color:#402,stroke-dasharray: 3 3;
  classDef sign fill:#fef,stroke:#a3a,stroke-width:1px,color:#402;
  classDef datum fill:#f9f9f9,stroke:#999,color:#222;
  classDef policy fill:#eef9f0,stroke:#2a4,color:#142;
  classDef validator fill:#eef9f0,stroke:#2a4,color:#142;
  classDef rule fill:#f6fff6,stroke:#2a4,color:#142,stroke-dasharray: 4 3;
  classDef utxo fill:#f0fff6,stroke:#2a4,color:#142;
  classDef spend fill:#f0fff6,stroke:#2a4,color:#142;

  %% Notes (implicit):
  %% - GPS never leaves Mobile; only ZK proof + public inputs go to Oracle.
  %% - Oracle learns only (relation true/false), signs digest bound to nonce/expiry/keys.
  %% - On-chain scripts verify oracleSig + tx signatures + validity windows.
--
https://chatgpt.com/share/68c7c8e2-1f28-800d-b13c-e824bada5a16