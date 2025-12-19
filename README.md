# Ethno Tech App - Backend

Backend server for the Ethno Tech Application built with Node.js and Express.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your environment variables:
   ```
   PORT=5000
   ```

### Running the Application

- Development mode (with nodemon):
  ```bash
  npm run dev
  ```
- Production mode:
  ```bash
  npm start
  ```

The server will start on `http://localhost:5000` by default.

## API Endpoints

- `GET /` - Welcome message

## Project Structure

```
.
├── index.js          # Application entry point
├── package.json     # Project configuration
└── .env             # Environment variables (create this file)
```

## License

This project is licensed under the ISC License.
