Claude 3.7:

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Dashboard</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f5f5f0;
            font-family: Arial, sans-serif;
        }
        
        .dashboard-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
        }
        
        .dashboard-title {
            color: #5a5a5a;
            font-size: 2rem;
            font-weight: 600;
        }
        
        .plus-button {
            background-color: #5d3b6d;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: bold;
            text-decoration: none;
        }
        
        .plus-button:hover {
            background-color: #4d2f5d;
            color: white;
        }
        
        .profile-section {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
        }
        
        .avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background-color: #fff;
            border: 2px solid #e07a51;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 20px;
        }
        
        .initials {
            color: #e07a51;
            font-size: 2rem;
            font-weight: bold;
        }
        
        .user-info h2 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 600;
        }
        
        .profile-link {
            color: #e07a51;
            text-decoration: none;
            font-size: 1.2rem;
        }
        
        .stats-section {
            display: flex;
            justify-content: space-between;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
        }
        
        .stat-label {
            color: #727272;
            font-size: 1.2rem;
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <div class="dashboard-header">
            <h1 class="dashboard-title">Dashboard</h1>
            <a href="#" class="plus-button">+</a>
        </div>
        
        <div class="profile-section">
            <div class="avatar">
                <span class="initials">MH</span>
            </div>
            <div class="user-info">
                <h2>Milan Houter</h2>
                <a href="#" class="profile-link">Profile</a>
            </div>
        </div>
        
        <div class="stats-section">
            <div class="stat-item">
                <div class="stat-number">1</div>
                <div class="stat-label">Project</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">0</div>
                <div class="stat-label">Challenges</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">0</div>
                <div class="stat-label">Connections</div>
            </div>
        </div>
    </div>

    <!-- Bootstrap 5 JS Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

---

Claude 3.7 thinking:

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard</title>
  <!-- Bootstrap 5 CSS -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body {
      background-color: #f8f7f2;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    
    .dashboard-container {
      padding: 20px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    
    .header h1 {
      color: #5a5a5a;
      font-size: 2.2rem;
      font-weight: 500;
      margin: 0;
    }
    
    .add-button {
      background-color: #6d3562;
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 5px;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .profile-section {
      display: flex;
      align-items: center;
      margin-bottom: 40px;
    }
    
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 2px solid #e07a5f;
      color: #e07a5f;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      font-weight: 500;
      margin-right: 20px;
      background-color: white;
    }
    
    .profile-info h2 {
      color: #222;
      font-size: 1.5rem;
      margin: 0;
      font-weight: 500;
    }
    
    .profile-link {
      color: #e07a5f;
      text-decoration: none;
      font-size: 1.1rem;
    }
    
    .stats-section {
      display: flex;
      justify-content: space-between;
      max-width: 500px;
    }
    
    .stat-item {
      text-align: center;
      padding: 0 15px;
    }
    
    .stat-number {
      font-size: 1.8rem;
      font-weight: bold;
      color: #222;
    }
    
    .stat-label {
      color: #5a5a5a;
      font-size: 1.1rem;
    }
  </style>
</head>
<body>
  <div class="dashboard-container">
    <!-- Header -->
    <div class="header">
      <h1>Dashboard</h1>
      <button class="add-button">+</button>
    </div>
    
    <!-- Profile Section -->
    <div class="profile-section">
      <div class="avatar">
        MH
      </div>
      <div class="profile-info">
        <h2>Milan Houter</h2>
        <a href="#" class="profile-link">Profile</a>
      </div>
    </div>
    
    <!-- Stats Section -->
    <div class="stats-section">
      <div class="stat-item">
        <div class="stat-number">1</div>
        <div class="stat-label">Project</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">0</div>
        <div class="stat-label">Challenges</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">0</div>
        <div class="stat-label">Connections</div>
      </div>
    </div>
  </div>
  
  <!-- Bootstrap 5 JS Bundle with Popper -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
</body>
</html>

---

ChatGPT4o

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Dashboard</title>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
    rel="stylesheet"
  />
  <style>
    body {
      background-color: #f9f9f3;
      font-family: 'Segoe UI', sans-serif;
    }

    .dashboard-card {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      border-radius: 1rem;
      background-color: #ffffff;
    }

    .avatar {
      width: 64px;
      height: 64px;
      border: 2px solid #e07236;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #e07236;
      font-size: 1.25rem;
    }

    .profile-name {
      font-weight: 600;
    }

    .profile-link {
      color: #e07236;
      text-decoration: none;
    }

    .plus-btn {
      background-color: #512e5f;
      border: none;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat {
      text-align: center;
    }

    .stat-number {
      font-weight: 500;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #6c6c6c;
    }
  </style>
</head>
<body>

  <div class="container dashboard-card shadow-sm">
    <div class="d-flex justify-content-between align-items-start mb-4">
      <h4 class="mb-0">Dashboard</h4>
      <button class="plus-btn">+</button>
    </div>

    <div class="d-flex align-items-center mb-4">
      <div class="avatar me-3">MH</div>
      <div>
        <div class="profile-name">Milan Houter</div>
        <a href="#" class="profile-link">Profile</a>
      </div>
    </div>

    <div class="d-flex justify-content-between">
      <div class="stat">
        <div class="stat-number">1</div>
        <div class="stat-label">Project</div>
      </div>
      <div class="stat">
        <div class="stat-number">0</div>
        <div class="stat-label">Challenges</div>
      </div>
      <div class="stat">
        <div class="stat-number">0</div>
        <div class="stat-label">Connections</div>
      </div>
    </div>
  </div>

</body>
</html>


Dashboard - progress bar
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Projects Interface</title>
  <!-- Bootstrap 5 CSS -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body {
      background-color: #f8f7f2;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      padding: 20px;
    }
    
    .nav-tabs-container {
      background-color: #edece6;
      border-radius: 15px;
      padding: 15px 25px;
      display: inline-flex;
      margin-bottom: 40px;
    }
    
    .nav-item {
      font-size: 1.8rem;
      font-weight: 400;
    }
    
    .nav-inactive {
      color: #9a9a94;
      margin-right: 15px;
    }
    
    .nav-divider {
      color: #d0cfca;
      margin: 0 15px;
      font-weight: 200;
    }
    
    .nav-active {
      color: #000;
      font-weight: 500;
    }
    
    .project-card {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .project-icon {
      width: 80px;
      height: 80px;
      background-color: #e2704a;
      border-radius: 12px;
      margin-right: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .icon-shape {
      width: 40px;
      height: 40px;
    }
    
    .project-info {
      flex-grow: 1;
    }
    
    .project-title {
      font-size: 1.8rem;
      font-weight: 500;
      margin-bottom: 15px;
    }
    
    .progress {
      height: 8px;
      background-color: #e5e4df;
      border-radius: 4px;
    }
    
    .progress-bar {
      background-color: #8e4566;
      width: 0%;
    }
    
    .progress-text {
      color: #9a9a94;
      font-size: 1.4rem;
      margin-left: 10px;
    }
    
    .chevron-icon {
      color: #d0cfca;
      font-size: 1.8rem;
      margin-left: 20px;
    }
    
    .divider {
      height: 1px;
      background-color: #e5e4df;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <!-- Navigation Tabs -->
  <div class="nav-tabs-container">
    <div class="nav-item nav-inactive">What's up</div>
    <div class="nav-divider">|</div>
    <div class="nav-item nav-active">Projects</div>
  </div>
  
  <!-- Project Card -->
  <div class="project-card">
    <div class="project-icon">
      <svg class="icon-shape" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <path fill="#42204d" d="M10,10 L20,0 L30,10 Z"></path>
        <path fill="#42204d" d="M0,20 L10,10 L20,20 Z"></path>
        <path fill="#42204d" d="M20,20 L30,10 L40,20 Z"></path>
      </svg>
    </div>
    
    <div class="project-info">
      <div class="project-title">Onboarding project</div>
      <div class="d-flex align-items-center">
        <div class="progress flex-grow-1">
          <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <span class="progress-text">0%</span>
      </div>
    </div>
    
    <div class="chevron-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
      </svg>
    </div>
  </div>
  
  <div class="divider"></div>
  
  <!-- Bootstrap 5 JS Bundle with Popper -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
</body>
</html>