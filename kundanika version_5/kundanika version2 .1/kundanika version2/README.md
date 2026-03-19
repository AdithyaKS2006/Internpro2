# InternPro - Internship Management Platform

This is a comprehensive platform for managing the internship process for students, faculty, placement staff, and employers.

## 🚀 Quick Start

1.  **Backend**:
    ```bash
    cd backend && python3 -m venv venv && source venv/bin/activate
    pip install -r requirements.txt
    uvicorn server:app --reload
    ```
2.  **Frontend**:
    ```bash
    cd frontend && npm install
    npm start
    ```
3.  **Database**: Ensure **MongoDB** is running locally on port 27017.

---

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js and npm**: [Download & Install Node.js](https://nodejs.org/)
- **Python 3.7+ and pip**: [Download & Install Python](https://www.python.org/)
- **MongoDB**: [Download & Install MongoDB Community Server](https://www.mongodb.com/try/download/community)

## Setup & Installation

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    # For Windows
    python -m venv venv
    .\venv\Scripts\activate

    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

## How to Run the Application

You will need two separate terminals to run the application.

1.  **Start the Backend Server:**
    - Make sure your MongoDB server is running.
    - In your first terminal, navigate to the `backend` directory and run:
      ```bash
      uvicorn server:app --reload
      ```
    - The backend will be running on `http://127.0.0.1:8000`.

2.  **Start the Frontend Server:**
    - In your second terminal, navigate to the `frontend` directory and run:
      ```bash
      npm start
      ```
    - This will automatically open `http://localhost:3000` in your web browser.

## Using ngrok for Sharing Your Local Development Server

To share your local development server with others using ngrok:

1. **Set up ngrok tunnels:**
   - Create an ngrok tunnel for your frontend (port 3000):
     ```bash
     ngrok http 3000
     ```
   - Create an ngrok tunnel for your backend (port 8000):
     ```bash
     ngrok http 8000
     ```

2. **Update environment variables:**
   - Copy the ngrok URLs from the ngrok dashboard
   - In `frontend/.env`, uncomment and update the ngrok variables:
     ```
     REACT_APP_BACKEND_NGROK_URL=https://your-backend-ngrok-url.ngrok-free.app
     REACT_APP_FRONTEND_NGROK_URL=https://your-frontend-ngrok-url.ngrok-free.app
     ```
   - In `backend/.env`, update the CORS_ORIGINS to include your frontend ngrok URL:
     ```
     CORS_ORIGINS=http://localhost:3000,https://localhost:3000,...,https://your-frontend-ngrok-url.ngrok-free.app
     ```

3. **Restart both servers** for the changes to take effect.

You can now share your ngrok URLs with others to access your local development server.

## Ubuntu Specific Setup Guide

If you are setting up this project on Ubuntu, follow these specific steps to ensure all dependencies are correctly installed.

### 1. System Dependencies
Ensure you have Python 3.12+ and Node.js installed. You may also need to install the python venv package manually:

```bash
sudo apt update
sudo apt install python3.12-venv -y
```

### 2. Backend Setup
Navigate to the `backend` directory and run:

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install python-multipart PyJWT email-validator
```

*Note: `python-multipart`, `PyJWT`, and `email-validator` might be missing from standard requirements, so we install them explicitly.*

### 3. Frontend Setup
Navigate to the `frontend` directory and run:

```bash
# Install dependencies with legacy peer deps to avoid conflicts
npm install --legacy-peer-deps

# Fix permissions for craco (if needed)
chmod +x node_modules/.bin/craco
```

### 4. Running the Project
Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
source venv/bin/activate
uvicorn server:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```
