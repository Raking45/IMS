# Inventory Management System (IMS)

[![Node.js CI](https://img.shields.io/github/workflow/status/your-org/ims/Node.js%20CI?logo=node.js)](https://github.com/your-org/ims/actions)
[![Angular CI](https://img.shields.io/github/workflow/status/your-org/ims/Angular%20CI?logo=angular)](https://github.com/your-org/ims/actions)
[![License](https://img.shields.io/badge/license-Educational-blue.svg)](#license)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> A full-stack inventory management system built with Node.js, Express, Angular, MongoDB, and JWT-based authentication.

---

## 🧭 Table of Contents

- [Features](#features)
- [Architecture Diagram](#architecture-diagram)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [ims-server (Backend)](#ims-server-backend)
  - [Running the Server](#running-the-server)
  - [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Error Handling](#error-handling)
  - [Running Tests](#running-tests)
- [ims-client (Frontend)](#ims-client-frontend)
  - [Running the Client](#running-the-client)
  - [Available Scripts](#available-scripts)
  - [Environment Configuration](#environment-configuration)
  - [Code Scaffolding](#code-scaffolding)
  - [Build](#build)
  - [Running Unit Tests](#running-unit-tests)
  - [Running E2E Tests](#running-e2e-tests)
  - [Further Help](#further-help)
- [Deployment Instructions](#deployment-instructions)
- [Development Notes](#development-notes)
- [License](#license)
- [Author](#author)

---

## 🚀 Features

- ✅ Express.js REST API for inventory CRUD operations
- 🌐 Angular v18 SPA frontend
- 🔄 CORS support for cross-origin API calls
- 📦 MongoDB database with Mongoose ODM
- 🔐 JWT-based authentication and role-based authorization
- ⚠️ Centralized backend error handling
- 🧪 Unit & integration testing with Jest, Supertest, and Angular TestBed

---

## 🧱 Architecture Diagram

```
+--------------------+         HTTP         +---------------------+
|    Angular Client  | <------------------> |  Node.js Express API |
|  (ims-client)      |                     |   (ims-server)       |
+--------------------+                     +---------------------+
         |                                            |
         |                                            |
         V                                            V
      Browser                               MongoDB (via Mongoose)
```

---

## 📁 Project Structure

```
IMS/
├── ims-client/       # Angular frontend
│   ├── src/
│   ├── e2e/
│   ├── angular.json
│   ├── package.json
│   └── ...
├── ims-server/       # Node.js/Express backend
│   ├── bin/
│   ├── src/
│   ├── test/
│   ├── package.json
│   └── ...
└── README.md         # This file
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.x recommended)
- [npm](https://www.npmjs.com/)
- [Angular CLI](https://angular.io/cli) (v18.x)
- [MongoDB](https://www.mongodb.com/) (local or cloud)

### 🛠 Installation

```bash
# Clone the repository
git clone <repository-url>
cd IMS

# Install backend dependencies
cd ims-server
npm install

# Install frontend dependencies
cd ../ims-client
npm install
```

---

## 🖥 ims-server (Backend)

The backend is built using:

- **Node.js v20**
- **Express.js**
- **MongoDB** with **Mongoose**
- **JWT Auth** (login, register, protected routes)

### Running the Server

```bash
cd ims-server

# Production mode
npm start

# Development mode (auto-reload)
npm run dev
```

> Default port: `3000`. Configurable via the `PORT` environment variable.

### API Endpoints

| Method | Endpoint     | Description                          |
|--------|--------------|--------------------------------------|
| GET    | `/api`       | Returns welcome message              |
| GET    | `/api/items` | List all inventory items (example)   |
| POST   | `/api/items` | Add a new inventory item (example)   |

**Example Root Response:**
```json
{
  "message": "Hello from the Inventory Management System server!"
}
```

### Authentication

| Method | Endpoint           | Description                     |
|--------|--------------------|---------------------------------|
| POST   | `/api/auth/register` | Register new user               |
| POST   | `/api/auth/login`    | Login and get JWT token         |

> Protected routes require a valid Bearer token in the `Authorization` header.

### Error Handling

- `404 Not Found`: Returned when an endpoint is undefined.
- `500 Internal Server Error`: For uncaught exceptions.

### Running Tests

```bash
# Inside ims-server
npm test
```

Uses **Jest** + **Supertest**.

---

## 🌐 ims-client (Frontend)

### Running the Client

1. Ensure backend (`ims-server`) is running.
2. Open a new terminal:

```bash
cd ims-client
ng serve
```

3. Visit [http://localhost:4200](http://localhost:4200)

### Available Scripts

```bash
ng serve     # Dev mode
ng build     # Production build
ng test      # Run unit tests
ng lint      # Code linting
```

### Environment Configuration

```ts
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Code Scaffolding

Generate components and services with Angular CLI:

```bash
ng generate component component-name
ng generate service my-service
```

You can also use:
```bash
ng generate directive|pipe|service|class|guard|interface|enum|module
```

### Build

To build the project for production:

```bash
ng build --configuration production
```

The compiled output will be in the `dist/` folder.

### Running Unit Tests

Run unit tests using Karma:

```bash
ng test
```

### Running E2E Tests

Run end-to-end tests (optional setup may be required):

```bash
ng e2e
```

> You may need to install a package like `@angular/e2e` to enable E2E testing.

### Further Help

For Angular CLI reference, run:

```bash
ng help
```

Or visit the [Angular CLI documentation](https://angular.dev/tools/cli).

---

## 🚀 Deployment Instructions
### Full Deployment on Render

You can fully deploy both the backend and frontend of the IMS app using [Render](https://render.com).

#### Backend (ims-server)

1. Go to [Render Dashboard](https://dashboard.render.com/) and create a new **Web Service**.
2. Connect your GitHub repo and select `ims-server` as the root directory.
3. Set the following:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `PORT=3000`
     - `MONGO_URI=<your MongoDB connection string>`
     - `JWT_SECRET=<your-secret-key>`

4. Deploy the service.

#### Frontend (ims-client)

1. Create a new **Static Site** in Render.
2. Select the same GitHub repo, but set `ims-client` as the root directory.
3. Set the following:
   - **Build Command**: `npm install && npm run build -- --configuration production`
   - **Publish Directory**: `dist/ims-client`

4. In `src/environments/environment.prod.ts`, update the `apiUrl` to your deployed backend URL:

```ts
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-service.onrender.com/api'
};
```

5. Redeploy the frontend after updating.



### Backend (ims-server)

You can deploy the backend using:

- **Heroku**, **Render**, or **Railway**
- **Docker** container
- Any **Node.js-capable VPS**

#### Example with Heroku

```bash
heroku create ims-server
git push heroku main
heroku config:set PORT=3000
```

### Frontend (ims-client)

You can deploy the frontend to:

- **Vercel**, **Netlify**, or **Firebase Hosting**

#### Example with Netlify

1. Run:
   ```bash
   ng build --configuration production
   ```
2. Deploy the `dist/` folder to Netlify.

> Make sure the `apiUrl` in `environment.prod.ts` points to your deployed backend.

---

## 💡 Development Notes

- All API routes are under `/api`
- CORS enabled (`*`) for development
- MongoDB schema management via Mongoose
- JWT-based access control for secure routes
- Modular Angular & Express architecture

---

## 📄 License

This project is provided for **educational purposes** and does not carry a commercial license.

---

## 👨‍💻 Authors

- **Professor Krasso**  
- **Caleb Goforth**  
- **Robert King**

---

## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📬 Feedback

For questions or suggestions, feel free to open an issue or reach out.
