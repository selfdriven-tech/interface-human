cardano-cli conway transaction witness \
	--mainnet \	
    --tx-body-file transaction-1.unsigned \
    --signing-key-file key-mb.skey \
    --out-file transaction-1-mb.witness

cardano-cli transaction txid --tx-file transaction-1.unsigned > transaction-1..hash
