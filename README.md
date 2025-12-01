# 🎯 Assistant Attendance System

## Overview
A premium, GPS‑based attendance tracking system for educational assistants. It features real‑time location validation, a sleek admin dashboard, and a PWA assistant interface..

---

## 📦 Prerequisites (Windows)
- **Node.js** (v14 or higher) – [Download](https://nodejs.org/)
- **MySQL** (v5.7 or higher) – [Download](https://dev.mysql.com/downloads/mysql/)
- **Git** (optional, for cloning) – [Download](https://git-scm.com/)
- **OpenSSL** (optional, for generating self‑signed certificates) – included with Git‑Bash or can be installed separately.

---

## ⚙️ Environment Setup
1. **Create an `.env` file** in the `backend/` folder.
   ```bash
   cp backend/.env.example backend/.env   # if an example exists
   ```
   If no example is present, create the file manually with the following keys:
   ```dotenv
   PORT=5000                # Port for the server (default 5000)
   DB_HOST=localhost        # MySQL host
   DB_PORT=3306             # MySQL port
   DB_USER=root             # MySQL user (change as needed)
   DB_PASSWORD=your_password
   DB_NAME=assistant_attendance
   JWT_SECRET=your_jwt_secret   # long random string
   NODE_ENV=development
   ```
   > **Tip:** Use a password manager to generate a strong `JWT_SECRET`.

---

## 🗄️ Database Initialization
The project ships with a schema, migration scripts, and seed data.

1. **Run the batch script** – this will create the database, apply migrations, and insert seed data:
   ```batch
   setup-database.bat
   ```
   The script internally executes the following SQL files (found in `database/`):
   - `schema.sql` – creates the initial tables.
   - `migrations/*.sql` – incremental schema changes.
   - `seed.sql` – sample data for quick testing.
2. **Verify** the database was created:
   ```sql
   SELECT * FROM assistants LIMIT 5;
   ```
   You should see a few rows from the seed file.

---

## 🔐 HTTPS (Optional but recommended for production)
1. Generate a self‑signed certificate (or use your own):
   ```bash
   openssl req -nodes -new -x509 -keyout backend/key.pem -out backend/cert.pem -days 365
   ```
2. Place `key.pem` and `cert.pem` in `backend/`. The server will automatically start in HTTPS mode when the files are present; otherwise it falls back to HTTP.

---

## ▶️ Running the Application
Two convenient batch scripts are provided:

| Script | Description |
|--------|-------------|
| `start-app.bat` | Starts the MySQL service (if needed), launches the backend server and serves the frontend files. |
| `stop-app.bat`  | Gracefully stops the backend server and any related processes. |

```batch
start-app.bat   # launch everything
```

Once running, open your browser:
- **Admin Dashboard:** `http://localhost:5000/admin/`
- **Assistant PWA:** `http://localhost:5000/assistant/`

---

## 🛠️ Development & Testing
- **Hot‑reload** – The backend uses `nodemon` (installed via `npm install`). Run manually with `npm run dev` inside `backend/` if you prefer.
- **Run unit tests** (if any):
  ```bash
  cd backend && npm test
  ```
- **Linting** – `npm run lint` will check code style.

---

## 🐞 Troubleshooting
| Issue | Fix |
|-------|-----|
| **Database connection error** | Ensure MySQL is running, the credentials in `.env` are correct, and the `assistant_attendance` database exists. |
| **SSL certificate not found** | Either generate `key.pem`/`cert.pem` as described above or ignore – the server will start over HTTP. |
| **Port already in use** | Change `PORT` in `.env` or stop the conflicting process. |
| **Missing environment variables** | Double‑check the `.env` file; all keys listed in the **Environment Setup** section are required. |

---

## 📞 Support & Contributions
- **Issues:** Open a GitHub issue with a clear description and steps to reproduce.
- **Pull Requests:** Fork the repo, make your changes, and submit a PR. Ensure the CI pipeline passes.
- **Documentation:** The project no longer relies on a separate `docs/` folder; all essential information is now in this README.

---

## 📄 License
This project is licensed under the MIT License.

---

## 🎓 Next Steps (Zero‑to‑Hero)
1. **Configure production environment** – set `NODE_ENV=production`, obtain a valid SSL certificate, and configure a reverse proxy (e.g., Nginx).
2. **Deploy to a cloud provider** – Dockerize the app or use a PaaS like Heroku, Render, or Azure App Service.
3. **Enable CI/CD** – automate tests, linting, and deployments.
4. **Extend functionality** – add role‑based dashboards, email notifications, or mobile‑native wrappers.

---

*Built with ❤️ using HTML, CSS, JavaScript, Node.js, Express, MySQL, and OpenStreetMap.*

A GPS-based attendance tracking system for educational assistants with real-time location validation.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Platform](https://img.shields.io/badge/platform-Windows-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 🚀 Quick Start (Windows)

### Option 1: Use Batch Scripts (Recommended)

1. **Setup Database:**
   ```batch
   setup-database.bat
   ```

2. **Start Application:**
   ```batch
   start-app.bat
   ```

3. **Access the System:**
   - Admin Dashboard: http://localhost:5000/frontend/admin/
   - Assistant PWA: http://localhost:5000/frontend/assistant/

4. **Stop Application:**
   ```batch
   stop-app.bat
   ```

- ✅ Real-time location tracking with OpenStreetMap
- ✅ Installable as Progressive Web App (PWA)
- ✅ Offline support with service worker

### 👨‍💼 For Admins
- ✅ Dashboard with statistics
- ✅ Manage centers (CRUD with map)
- ✅ Manage assistants and sessions
- ✅ View attendance reports
- ✅ Export data to CSV

### 🔧 Technical
- ✅ RESTful API with JWT authentication
- ✅ MySQL database with proper relationships
- ✅ Role-based access control
- ✅ Haversine formula for distance calculation
- ✅ OpenStreetMap (free, no API key needed)

---

## 🏗️ Project Structure

```
asist web/
├── backend/              # Node.js + Express API
│   ├── config/          # Database & JWT config
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & role checking
│   ├── models/          # Database queries
│   ├── routes/          # API routes
│   └── server.js        # Main server file
│
├── frontend/
│   ├── admin/           # Admin dashboard
│   ├── assistant/       # Assistant PWA
│   └── shared/          # Shared resources
│
├── database/
│   ├── schema.sql       # Database structure
│   └── seed.sql         # Sample data
│
├── docs/                # 📚 All documentation
│
├── setup-database.bat   # Database setup script
├── start-app.bat        # Start all servers
└── stop-app.bat         # Stop all servers
```

---

## 🔐 Test Credentials

### Admin Account
```
Email:    admin@attendance.com
Password: Admin@2024
```

### Assistant Account
```
Email:    assistant1@attendance.com
Password: Assistant@2024
```

See [docs/CREDENTIALS.md](docs/CREDENTIALS.md) for all test accounts.

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | Node.js, Express.js |
| **Database** | MySQL |
| **Authentication** | JWT (JSON Web Tokens) |
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) |
| **Maps** | Leaflet.js + OpenStreetMap |
| **PWA** | Service Workers, Web Manifest |
| **GPS** | Geolocation API + Haversine Formula |

---

## 📋 Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)

---

## 🐛 Troubleshooting

Having issues? Check the **[Troubleshooting Guide](docs/TROUBLESHOOTING.md)** for common problems and solutions.

Common issues:
- Database connection errors
- CORS issues
- GPS not working
- Server startup problems

---

## 📞 Support

- 📖 **Documentation**: [docs/](docs/)
- 🐛 **Issues**: Check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- 📧 **Questions**: See documentation files for detailed guides

---

## 📄 License

This project is licensed under the MIT License.

---

## 🎓 Next Steps

1. ✅ Run `setup-database.bat` to create the database
2. ✅ Edit `backend\.env` with your MySQL password
3. ✅ Run `start-app.bat` to start the application
4. ✅ Login with test credentials
5. ✅ Explore the system!

**For detailed instructions, see [docs/BATCH_SCRIPTS_GUIDE.md](docs/BATCH_SCRIPTS_GUIDE.md)**

---

**Built with ❤️ using HTML, CSS, JavaScript, Node.js, Express, MySQL, and OpenStreetMap**
