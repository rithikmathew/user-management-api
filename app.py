import os
import logging
from flask import Flask, request, jsonify, render_template
import sqlite3
from dotenv import load_dotenv
from database import get_db_connection, init_db

# Load environment variables
load_dotenv()

# Configure simple logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/users', methods=['GET', 'POST'])
def manage_users():
    conn = get_db_connection()
    cursor = conn.cursor()

    if request.method == 'POST':
        data = request.get_json()
        if not data or not data.get('name') or not data.get('email'):
            logging.warning("Failed POST /users - Missing fields")
            return jsonify({"error": "Missing required fields"}), 400
        try:
            cursor.execute('INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
                           (data['name'], data['email'], data.get('age')))
            conn.commit()
            user_id = cursor.lastrowid
            logging.info(f"User created successfully with ID: {user_id}")
            return jsonify({"id": user_id, "message": "User created"}), 201
        except sqlite3.IntegrityError:
            logging.error(f"Failed POST /users - Email {data['email']} already exists")
            return jsonify({"error": "Email already exists"}), 409
        finally:
            conn.close()

    if request.method == 'GET':
        users = cursor.execute('SELECT * FROM users').fetchall()
        conn.close()
        logging.info(f"Fetched {len(users)} users")
        return jsonify([dict(u) for u in users]), 200

@app.route('/users/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
def manage_single_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    if request.method == 'GET':
        user = cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
        conn.close()
        if user is None:
            logging.warning(f"Failed GET /users/{user_id} - User not found")
            return jsonify({"error": "User not found"}), 404
        logging.info(f"Fetched user ID: {user_id}")
        return jsonify(dict(user)), 200

    if request.method == 'PUT':
        data = request.get_json()
        if not data or not data.get('name') or not data.get('email'):
            conn.close()
            logging.warning(f"Failed PUT /users/{user_id} - Missing fields")
            return jsonify({"error": "Missing required fields"}), 400
        
        cursor.execute('UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
                       (data['name'], data['email'], data.get('age'), user_id))
        conn.commit()
        rows_affected = cursor.rowcount
        conn.close()
        
        if rows_affected == 0:
            logging.warning(f"Failed PUT /users/{user_id} - User not found")
            return jsonify({"error": "User not found"}), 404
            
        logging.info(f"Updated user ID: {user_id}")
        return jsonify({"message": "User updated successfully"}), 200

    if request.method == 'DELETE':
        cursor.execute('DELETE FROM users WHERE id = ?', (user_id,))
        conn.commit()
        rows_affected = cursor.rowcount
        conn.close()
        
        if rows_affected == 0:
            logging.warning(f"Failed DELETE /users/{user_id} - User not found")
            return jsonify({"error": "User not found"}), 404
            
        logging.info(f"Deleted user ID: {user_id}")
        return jsonify({"message": "User deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True)