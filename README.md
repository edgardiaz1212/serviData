# ServiData

ServiData is a full-stack web application that provides a backend API built with Flask and a frontend user interface built with React. The backend API manages data models, user authentication, and serves data to the frontend, while the React frontend offers an interactive and dynamic user experience with charts, routing, and styled components.

## Project Overview

- **Backend:** Flask API server with SQLAlchemy ORM, database migrations using Flask-Migrate, JWT authentication, CORS support, and an admin interface. The backend serves API endpoints under `/api` and also serves the frontend static files from the `public` directory.
- **Frontend:** React application created with Create React App, using React 19, react-router-dom for routing, chart.js for data visualization, styled-components for styling, and other libraries to enhance the user interface.

## Installation and Setup

### Prerequisites

- Python 3.11
- Node.js and npm
- PostgreSQL (optional, can use SQLite for development)

### Backend Setup

1. Create and activate a Python virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

2. Install backend dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Set environment variables (create a `.env` file or set them in your environment):

   - `FLASK_DEBUG=1` for development mode
   - `DATABASE_URL` with your database connection string (e.g., PostgreSQL URI). If not set, SQLite will be used by default.

4. Run database migrations and create tables:

   ```bash
   flask db upgrade
   ```

5. Start the Flask backend server:

   ```bash
   python src/app.py
   ```

   The backend server will run on `http://localhost:3001`.

### Frontend Setup

1. Navigate to the frontend directory (if applicable) or project root.

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:

   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`.

4. To create a production build of the frontend:

   ```bash
   npm run build
   ```

   The build output will be placed in the `build` folder and served by the backend.

## Running the Full Application

- Start the backend server (`python src/app.py`), which serves the API and frontend static files.
- Start the frontend development server (`npm start`) for development with hot reloading.
- Access the application via the frontend URL (`http://localhost:3000`) or backend URL (`http://localhost:3002/servidata`).

## Using the Custom Flask CLI Commands

This project includes custom Flask CLI commands to help manage users and other tasks.

### Create Admin User

To create a new admin user, use the following command in your terminal:

```bash
flask create-admin
```

This command will prompt you to enter a username and password for the new admin user. The password must be at least 6 characters long.

Make sure you have set the `FLASK_APP` environment variable to `src/app.py` before running the command:

- On Windows (cmd):

  ```cmd
  set FLASK_APP=src/app.py
  ```

- On Unix/Linux/macOS:

  ```bash
  export FLASK_APP=src/app.py
  ```

### List Users

To list all registered users, run:

```bash
flask list-users
```

This will display a table of users with their IDs, usernames, and roles.

## Additional Information

- The backend automatically creates an admin user with username `admin` and password `administrator` on first run.
- The backend uses Flask-Migrate for database schema migrations.
- The frontend uses React Router for client-side routing and Chart.js for data visualization.

## Author

Edgar Diaz - [GitHub](https://github.com/edgargdiaz1212)
