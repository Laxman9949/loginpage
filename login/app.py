from flask import Flask, render_template, request, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector

app = Flask(__name__)
app.secret_key = "secret123"

# -------- MYSQL CONNECTION --------
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",   # change if needed
    database="codevocado_db"
)
cursor = db.cursor(dictionary=True)

# -------- MAIN PAGE --------
@app.route("/")
def home():
    return render_template("home.html")

# -------- SIGNUP --------
@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        fullname = request.form["fullname"]
        email = request.form["email"]
        password = request.form["password"]

        # check if user exists
        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        if cursor.fetchone():
            return "User already exists"

        hashed_password = generate_password_hash(password)

        cursor.execute(
            "INSERT INTO users (fullname, email, password) VALUES (%s, %s, %s)",
            (fullname, email, hashed_password)
        )
        db.commit()

        return redirect(url_for("login"))

    return render_template("signup.html")

# -------- LOGIN --------
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()

        if not user or not check_password_hash(user["password"], password):
            return "Invalid login"

        session["user"] = user["email"]
        return redirect(url_for("mainpage"))

    return render_template("login.html")

# -------- LOGOUT --------
@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))

# -------- RUN --------
if __name__ == "__main__":
    app.run(debug=True)
