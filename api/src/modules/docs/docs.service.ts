import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DocsService {
  constructor(private readonly configService: ConfigService) {}

  getDocsHtml(): string {
    const apiPrefix = this.configService.get<string>('app.apiPrefix') || 'api/v1';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Creator Stack API Docs</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fira+Code:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0d1117;
      --card-bg: #161b22;
      --card-border: #30363d;
      --text-main: #c9d1d9;
      --text-heading: #f0f6fc;
      --text-muted: #8b949e;
      --accent-blue: #388bfd;
      --accent-blue-bg: rgba(56, 139, 253, 0.15);
      --accent-green: #3fb950;
      --accent-green-bg: rgba(63, 185, 80, 0.15);
      --accent-orange: #d29922;
      --accent-orange-bg: rgba(210, 153, 34, 0.15);
      --accent-red: #f85149;
      --accent-red-bg: rgba(248, 81, 73, 0.15);
      --code-chip: #21262d;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg);
      color: var(--text-main);
      line-height: 1.6;
      font-size: 15px;
    }
    /* Top Navbar */
    .navbar {
      background: var(--bg);
      border-bottom: 1px solid var(--card-border);
      padding: 0.85rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-brand {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-heading);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }
    .nav-btn {
      text-decoration: none;
      font-size: 0.825rem;
      font-weight: 500;
      padding: 0.4rem 0.85rem;
      border-radius: 6px;
      border: 1px solid var(--card-border);
      color: var(--text-main);
      background: transparent;
      transition: all 0.15s ease;
    }
    .nav-btn:hover {
      background: var(--code-chip);
      border-color: #8b949e;
      color: var(--text-heading);
    }
    .nav-btn.active {
      background: var(--accent-blue-bg);
      border-color: var(--accent-blue);
      color: #58a6ff;
    }
    /* Main Content Container */
    .main-container {
      max-width: 960px;
      margin: 2.5rem auto;
      padding: 0 1.5rem;
    }
    h1.doc-title {
      font-size: 2.25rem;
      font-weight: 800;
      color: var(--text-heading);
      margin-bottom: 1.25rem;
      letter-spacing: -0.02em;
    }
    p.doc-subtitle {
      font-size: 1rem;
      color: var(--text-muted);
      margin-bottom: 1rem;
    }
    .code-inline {
      font-family: 'Fira Code', monospace;
      background: var(--code-chip);
      color: #58a6ff;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-size: 0.875rem;
      border: 1px solid rgba(240, 246, 252, 0.1);
    }
    ul.summary-list {
      list-style-type: disc;
      padding-left: 1.5rem;
      margin-bottom: 2.5rem;
    }
    ul.summary-list li {
      margin-bottom: 0.5rem;
      color: var(--text-main);
    }
    h2.section-heading {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-heading);
      margin: 2.5rem 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--card-border);
    }
    /* Code Box Container */
    .code-box {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 1.25rem;
      font-family: 'Fira Code', monospace;
      font-size: 0.875rem;
      color: #e6edf3;
      overflow-x: auto;
      margin-bottom: 2rem;
    }
    .code-box pre {
      margin: 0;
    }
    .json-key { color: #79c0ff; }
    .json-string { color: #a5d6ff; }
    .json-number { color: #d2a8ff; }
    .json-boolean { color: #ff7b72; }

    /* Module Endpoint Section */
    .module-group {
      margin-bottom: 2.5rem;
    }
    .module-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-heading);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .endpoint-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin-bottom: 0.75rem;
    }
    .endpoint-header {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      margin-bottom: 0.35rem;
    }
    .method {
      font-family: 'Fira Code', monospace;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .method.get { background: var(--accent-blue-bg); color: #58a6ff; border: 1px solid rgba(56, 139, 253, 0.4); }
    .method.post { background: var(--accent-green-bg); color: #56d364; border: 1px solid rgba(63, 185, 80, 0.4); }
    .method.patch { background: var(--accent-orange-bg); color: #e3b341; border: 1px solid rgba(210, 153, 34, 0.4); }
    .method.delete { background: var(--accent-red-bg); color: #ff7b72; border: 1px solid rgba(248, 81, 73, 0.4); }

    .path {
      font-family: 'Fira Code', monospace;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-heading);
    }
    .desc {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .footer {
      text-align: center;
      padding: 2.5rem 0;
      color: var(--text-muted);
      border-top: 1px solid var(--card-border);
      font-size: 0.85rem;
      margin-top: 4rem;
    }
  </style>
</head>
<body>
  <!-- Top Navigation Bar -->
  <nav class="navbar">
    <div class="nav-brand">
      <span>Creator Stack API Docs</span>
    </div>
    <div class="nav-links">
      <a href="#reference" class="nav-btn active">Full API Reference</a>
      <a href="#mobile" class="nav-btn">Mobile App Guide</a>
      <a href="#postman" class="nav-btn">Download Postman (full)</a>
      <a href="#postman-mobile" class="nav-btn">Download Postman (mobile)</a>
    </div>
  </nav>

  <!-- Main Container -->
  <div class="main-container" id="reference">
    <h1 class="doc-title">Creator Stack API Reference</h1>
    <p class="doc-subtitle">
      Complete reference for the Creator Stack mobile/website <strong>v1 REST API</strong> ( <span class="code-inline">src/modules/</span> ).
    </p>

    <ul class="summary-list">
      <li><strong>Base URL:</strong> <span class="code-inline">{{base_url}}/${apiPrefix}</span> (e.g. <span class="code-inline">http://localhost:3000/${apiPrefix}</span>)</li>
      <li><strong>One public status endpoint lives outside <span class="code-inline">/${apiPrefix}</span>:</strong> <span class="code-inline">GET {{base_url}}/</span></li>
      <li><strong>Auth:</strong> JWT Bearer Tokens. Send <span class="code-inline">Authorization: Bearer {{token}}</span> on protected endpoints.</li>
      <li><strong>Content types:</strong> <span class="code-inline">application/json</span> for normal requests; <span class="code-inline">multipart/form-data</span> where a file/image/video upload is noted.</li>
    </ul>

    <!-- Response envelope Section -->
    <h2 class="section-heading">Response envelope</h2>
    <p style="margin-bottom: 1rem; color: var(--text-muted);">Almost every endpoint returns a consistent envelope:</p>

    <div class="code-box">
      <pre>{
  <span class="json-key">"success"</span>: <span class="json-boolean">true</span>,
  <span class="json-key">"statusCode"</span>: <span class="json-number">200</span>,
  <span class="json-key">"message"</span>: <span class="json-string">"Human readable message."</span>,
  <span class="json-key">"data"</span>: {},
  <span class="json-key">"timestamp"</span>: <span class="json-string">"2026-08-07T12:45:00.000Z"</span>
}</pre>
    </div>

    <!-- Endpoint Sections -->
    <h2 class="section-heading">Modules & Endpoints Reference</h2>

    <!-- Auth Module -->
    <div class="module-group">
      <div class="module-title">🔐 Auth Module</div>
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method post">POST</span>
          <span class="path">/${apiPrefix}/auth/register</span>
        </div>
        <div class="desc">Register a new user account with strong password requirements.</div>
      </div>
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method post">POST</span>
          <span class="path">/${apiPrefix}/auth/login</span>
        </div>
        <div class="desc">Authenticate user and obtain JWT access token.</div>
      </div>
    </div>

    <!-- Users Module -->
    <div class="module-group">
      <div class="module-title">👤 Users Module</div>
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method get">GET</span>
          <span class="path">/${apiPrefix}/users</span>
        </div>
        <div class="desc">Get paginated list of active users (Admin only).</div>
      </div>
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method get">GET</span>
          <span class="path">/${apiPrefix}/users/:id</span>
        </div>
        <div class="desc">Retrieve user details by ID.</div>
      </div>
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method patch">PATCH</span>
          <span class="path">/${apiPrefix}/users/:id</span>
        </div>
        <div class="desc">Update user profile information.</div>
      </div>
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method delete">DELETE</span>
          <span class="path">/${apiPrefix}/users/:id</span>
        </div>
        <div class="desc">Soft-delete user account (Admin only).</div>
      </div>
    </div>

    <!-- Roles & Permissions -->
    <div class="module-group">
      <div class="module-title">🛡️ Roles & Permissions</div>
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method get">GET</span>
          <span class="path">/${apiPrefix}/roles</span>
        </div>
        <div class="desc">List all RBAC roles.</div>
      </div>
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method post">POST</span>
          <span class="path">/${apiPrefix}/roles</span>
        </div>
        <div class="desc">Create a new RBAC role with permissions.</div>
      </div>
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method get">GET</span>
          <span class="path">/${apiPrefix}/permissions</span>
        </div>
        <div class="desc">List all available permissions in the system.</div>
      </div>
    </div>

    <!-- Products & Categories -->
    <div class="module-group">
      <div class="module-title">📦 Products & Categories</div>
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method get">GET</span>
          <span class="path">/${apiPrefix}/products</span>
        </div>
        <div class="desc">Public catalog listing with pagination and search.</div>
      </div>
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method post">POST</span>
          <span class="path">/${apiPrefix}/products</span>
        </div>
        <div class="desc">Create product entry.</div>
      </div>
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method get">GET</span>
          <span class="path">/${apiPrefix}/categories</span>
        </div>
        <div class="desc">List product categories.</div>
      </div>
    </div>

    <!-- Uploads -->
    <div class="module-group">
      <div class="module-title">📁 File Uploads</div>
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method post">POST</span>
          <span class="path">/${apiPrefix}/uploads</span>
        </div>
        <div class="desc">Upload image/document (<span class="code-inline">multipart/form-data</span>). Renames with UUID and validates MIME type.</div>
      </div>
    </div>

    <!-- Health & Audit Logs -->
    <div class="module-group">
      <div class="module-title">📊 Health Check & Audit Logs</div>
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method get">GET</span>
          <span class="path">/${apiPrefix}/health</span>
        </div>
        <div class="desc">Terminus health indicators checking Mongo connection & Memory heap.</div>
      </div>
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method get">GET</span>
          <span class="path">/${apiPrefix}/audit-logs</span>
        </div>
        <div class="desc">System activity and security audit trail (Admin only).</div>
      </div>
    </div>

    <div class="footer">
      Creator Stack API Documentation • Built with NestJS Engine
    </div>
  </div>
</body>
</html>`;
  }
}
