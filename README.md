# 📌 Contacts API

A simple RESTful API for managing contacts using **Node.js, Express, PostgreSQL, and Sequelize**.  
Includes **unit tests** using **Jest & Supertest**.

---

## 📖 Table of Contents

-   [📌 Installation](#installation)
-   [⚙️ Environment Variables](#environment-variables)
-   [🚀 Running the Server](#running-the-server)
-   [🧪 Running Tests](#running-tests)
-   [📂 Project Structure](#project-structure)
-   [🔗 API Endpoints](#api-endpoints)

---

## 📌 Installation

**Clone the repository**:

```sh
git clone https://github.com/justpragmaticoder/goit-node-rest-api.git
cd goit-node-rest-api.git
git checkout 04-auth
```

**Install dependencies**:

```sh
npm install
```

**Create an .env file based on .env.example**:

```sh
cp .env.example .env
```

## ⚙️ Environment Variables

The project requires a .env file for configuration.
Ensure your .env file contains the correct database credentials before running the server.

## 🚀 Running the Server

**Run the server in development mode**:

```sh
npm start
```

## 🧪 Running Tests

IMPORTANT!!! We have something like integration tests in this project.
But they are described like a usual unit tests.
These tests work with a real app and DB connection which is using your .env credentials for connect, be careful.

**Run all tests**:

```sh
npm test
```

## 📂 Project Structure

```
📂 project-root
├── 📂 db/              # Database configuration & models
│   ├── 📂 models/      # Sequelize models
│   │   ├── contact.js  # Contact model
│   │   ├── user.js     # User model
│   ├── 📂 config/      # Database configuration
│   │   ├── db.js       # Sequelize instance
├── 📂 public/          # Express routes
│   ├── 📂 avatars/     # User avatars
├── 📂 routes/          # Express routes
│   ├── authRouter.js
│   ├── contactsRouter.js
├── 📂 controllers/     # API controllers
│   ├── authControllers.js
│   ├── contactsControllers.js
├── 📂 services/        # Business logic & DB operations
│   ├── authServices.js
│   ├── contactsServices.js
├── 📂 schemas/        # Joi validation schemas
│   ├── authSchemas.js
│   ├── contactsSchemas.js
├── 📂 tests/           # Jest tests
│   ├── authControllers.spec.js
│   ├── contactsControllers.spec.js
├── 📂 utils/           # Helper functions
│   ├── catch-async.util.js
│   ├── random-port.util.js
├── 📜 .env.example     # Example environment file
├── 📜 .gitignore       # Ignore sensitive files
├── 📜 app.js           # Express app configuration
├── 📜 server.js        # Starts the server
├── 📜 package.json     # Project dependencies
├── 📜 README.md        # Documentation
```

## 🔗 API Endpoints

# Contacts Endpoints

| Method | Endpoint                            | Description                  |
| ------ | ----------------------------------- | ---------------------------- |
| GET    | `/api/contacts`                     | Get all contacts             |
| GET    | `/api/contacts/:id`                 | Get a contact by ID          |
| POST   | `/api/contacts`                     | Create a new contact         |
| PUT    | `/api/contacts/:id`                 | Update a contact             |
| DELETE | `/api/contacts/:id`                 | Delete a contact             |
| PATCH  | `/api/contacts/:contactId/favorite` | Update the “favorite” status |

# Auth Endpoints

| Method | Endpoint                 | Description                                             |
| ------ | ------------------------ | ------------------------------------------------------- |
| POST   | `/api/auth/register`     | Register a new user                                     |
| POST   | `/api/auth/login`        | Login a user and return an authentication token         |
| POST   | `/api/auth/logout`       | Logout a user (requires a valid token)                  |
| GET    | `/api/auth/current`      | Get current authenticated user’s details                |
| GET    | `/api/auth/subscription` | Get/update user’s subscription (requires a valid token) |
| PATCH  | `/api/auth/avatars`      | Update the “avatar” URL                                 |
