# 📌 Contacts API

A simple RESTful API for managing contacts using **Node.js, Express, PostgreSQL, and Sequelize**.  
Includes **unit tests** using **Jest & Supertest**.

---

## 📖 Table of Contents
- [📌 Installation](#installation)
- [⚙️ Environment Variables](#environment-variables)
- [🚀 Running the Server](#running-the-server)
- [🧪 Running Tests](#running-tests)
- [📂 Project Structure](#project-structure)
- [🔗 API Endpoints](#api-endpoints)

---

## 📌 Installation

**Clone the repository**:
```sh
git clone https://github.com/justpragmaticoder/goit-node-rest-api.git
cd goit-node-rest-api.git
git checkout 03-postgresql
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
│   ├── 📂 config/      # Database configuration
│   │   ├── db.js       # Sequelize instance
├── 📂 routes/          # Express routes
│   ├── contactsRouter.js
├── 📂 controllers/     # API controllers
│   ├── contactsControllers.js
├── 📂 services/        # Business logic & DB operations
│   ├── contactsServices.js
├── 📂 tests/           # Jest tests
│   ├── contactsControllers.spec.js
├── 📜 .env.example     # Example environment file
├── 📜 .gitignore       # Ignore sensitive files
├── 📜 app.js           # Express app configuration
├── 📜 server.js        # Starts the server
├── 📜 package.json     # Project dependencies
├── 📜 README.md        # Documentation
```

## 🔗 API Endpoints

| Method   | Endpoint                          | Description                   |
|----------|----------------------------------|-------------------------------|
| `GET`    | `/api/contacts`                  | Get all contacts              |
| `GET`    | `/api/contacts/:id`              | Get a contact by ID           |
| `POST`   | `/api/contacts`                  | Create a new contact          |
| `PUT`    | `/api/contacts/:id`              | Update a contact              |
| `DELETE` | `/api/contacts/:id`              | Delete a contact              |
| `PATCH`  | `/api/contacts/:id/favorite`     | Update the “favorite” status  |