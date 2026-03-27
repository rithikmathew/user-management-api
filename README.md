# User Management REST API & Dashboard

A robust, full-stack User Management application built with Python, Flask, and SQLite. This project fulfills the requirements of a backend REST API while providing a seamless, responsive frontend interface for easy testing and interaction.

## ✨ Features Implemented

* **Complete RESTful API:** Endpoints for creating, reading, updating, and deleting users.
* **Database Persistence:** Utilizes SQLite for lightweight, reliable data storage.
* **Data Validation:** Backend checks for required fields and prevents duplicate email registrations.
* **Robust Error Handling:** Returns appropriate HTTP status codes (200, 201, 400, 404, 409, 500) and clear JSON error messages.
* **Application Logging:** Tracks server activity, user creation, and potential errors in the console.
* **Environment Configuration:** Uses `.env` variables to manage configurations securely.
* **Automated Testing:** Includes a suite of unit tests utilizing a temporary test database.
* **Clean Architecture:** Separation of concerns between routing (`app.py`), database logic (`database.py`), and frontend assets.
* **Bonus UI:** A clean, responsive Single Page Application (SPA) built with HTML, CSS, and Vanilla JavaScript to interact with the API visually.

## 🛠️ Tech Stack

* **Backend:** Python 3, Flask
* **Database:** SQLite3
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (Fetch API)
* **Testing:** Python `unittest`

### Project Structure ##
user-management/
├── static/
│   ├── app.js             # Frontend logic & API calls
│   └── style.css          # UI styling
├── templates/
│   └── index.html         # Main application dashboard
├── app.py                 # Flask server and API routes
├── database.py            # SQLite connection and table initialization
├── test_app.py            # Unit testing suite
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables
└── README.md              # Project documentation

## 🚀 Setup Instructions

Follow these steps to run the project locally.

**1. Clone the repository**
```bash
git clone <your-repository-url>
cd user-management

## 2. Create and activate a virtual environment

Windows:

Bash
python -m venv venv
.\venv\Scripts\activate
Mac/Linux:

Bash
python3 -m venv venv
source venv/bin/activate

3. Install dependencies

Bash
pip install -r requirements.txt
4. Set up environment variables
Create a file named .env in the root directory and add the following:

Code snippet
FLASK_APP=app.py
FLASK_ENV=development
DATABASE_NAME=users.db
5. Run the application

Bash
python app.py
The database file (users.db) will be created automatically upon the first run.

6. Access the Dashboard
Open your web browser and navigate to: http://127.0.0.1:5000

🧪 Running Unit Tests
To verify the API endpoints, run the included test suite. This will use a temporary test database that cleans itself up automatically.

Bash
python -m unittest test_app.py

***

### Final Checklist for Submission:
1. Ensure all your files (`app.py`, `database.py`, `test_app.py`, `requirements.txt`, `.env`, the `static/` folder, and the `templates/` folder) are saved.
2. If you haven't already, run `pip freeze > requirements.txt` one last time while your `venv` is active to make sure Flask and python-dotenv are listed.
3. Commit everything to your GitHub repository and send them the link!

You have built a fantastic, complete project that hits every single requirement and goes the extra mile. Would you like me to review how to push this to GitHub if you need a quick refresher?