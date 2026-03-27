import unittest
import json
import os
from app import app
from database import init_db

class UserAPITestCase(unittest.TestCase):
    def setUp(self):
        # Configure a test database
        os.environ['DATABASE_NAME'] = 'test_users.db'
        self.app = app.test_client()
        self.app.testing = True
        init_db()

    def tearDown(self):
        # Remove test database after tests finish
        if os.path.exists('test_users.db'):
            os.remove('test_users.db')

    def test_create_user(self):
        payload = {"name": "John Doe", "email": "john@test.com", "age": 30}
        response = self.app.post('/users', json=payload)
        self.assertEqual(response.status_code, 201)

    def test_get_all_users(self):
        self.app.post('/users', json={"name": "Alice", "email": "alice@test.com"})
        response = self.app.get('/users')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.get_data(as_text=True))
        self.assertTrue(len(data) >= 1)

    def test_get_single_user(self):
        # Create user first
        post_res = self.app.post('/users', json={"name": "Bob", "email": "bob@test.com"})
        user_id = json.loads(post_res.get_data(as_text=True))['id']
        
        # Fetch that user
        response = self.app.get(f'/users/{user_id}')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(data['name'], "Bob")

    def test_update_user(self):
        post_res = self.app.post('/users', json={"name": "Charlie", "email": "charlie@test.com"})
        user_id = json.loads(post_res.get_data(as_text=True))['id']
        
        # Update user
        update_payload = {"name": "Charlie Updated", "email": "charlie@test.com", "age": 25}
        response = self.app.put(f'/users/{user_id}', json=update_payload)
        self.assertEqual(response.status_code, 200)

    def test_delete_user(self):
        post_res = self.app.post('/users', json={"name": "Dave", "email": "dave@test.com"})
        user_id = json.loads(post_res.get_data(as_text=True))['id']
        
        # Delete user
        response = self.app.delete(f'/users/{user_id}')
        self.assertEqual(response.status_code, 200)
        
        # Verify deletion
        get_response = self.app.get(f'/users/{user_id}')
        self.assertEqual(get_response.status_code, 404)

if __name__ == '__main__':
    unittest.main()