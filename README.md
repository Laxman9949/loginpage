It includes user authentication (signup & login), MySQL database integration, and a modern responsive UI using Tailwind CSS.

---

## 🚀 Features

- User Signup & Login with password hashing
- Session-based authentication
- MySQL database integration
- Clean and responsive UI (Tailwind CSS)
- Modular Flask routing
- Ready for extension (dashboards, exams, analytics)

---

## 🛠️ Tech Stack

**Frontend**
- HTML5
- Tailwind CSS
- javascript

**Backend**
- Python (Flask)
  

**Database**
- MySQL

---

## 📁 Project Structure

codevocado/
│
├── app.py # Flask application
├── templates/
│ ├── home.html # Landing page
│ ├── signup.html # Signup page
│ └── login.html # Login page
│
├── static/
│ ├── style.css # Custom styles
│ ├── script.js # JavaScript
│ ├── logo.png # App logo
│ └── talent.png # Landing page image
│
└── README.md

## 🗄️ Database Setup

### 1. Create Database & Table

CREATE DATABASE codevocado_db;
USE codevocado_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

⚙️ Installation & Setup

1. Clone the Repository
git clone https://github.com/your-username/codevocado.git
cd codevocado
2. Create Virtual Environment (Optional but Recommended)
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
3. Install Dependencies
pip install flask mysql-connector-python werkzeug
4. Configure Database
Update database credentials in app.py if needed:

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="codevocado_db"
)

▶️ Run the Application
python app.py
Open your browser and go to:
http://127.0.0.1:5000/
