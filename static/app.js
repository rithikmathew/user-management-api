document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    const userList = document.getElementById('userList');
    const formMessage = document.getElementById('formMessage');
    const formTitle = document.querySelector('.card-title'); // Updated to match new CSS
    const submitBtn = document.querySelector('#userForm button');
    
    let editingUserId = null; // Tracks if we are adding or updating

    // Load users on startup
    fetchUsers();

    // Handle Form Submission (Both POST and PUT)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            age: document.getElementById('age').value ? parseInt(document.getElementById('age').value) : null
        };

        try {
            // Decide whether to POST (create) or PUT (update)
            const url = editingUserId ? `/users/${editingUserId}` : '/users';
            const method = editingUserId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (response.ok) {
                showMessage(editingUserId ? 'User updated successfully!' : 'User added successfully!', 'green');
                resetForm();
                fetchUsers(); // Refresh the table
            } else {
                showMessage(result.error || 'Failed to process request', 'red');
            }
        } catch (error) {
            showMessage('Server connection error', 'red');
        }
    });

    // Fetch and display all users
    async function fetchUsers() {
        try {
            const response = await fetch('/users');
            const users = await response.json();
            
            userList.innerHTML = ''; // Clear current list
            
            users.forEach(user => {
                const tr = document.createElement('tr');
                // THIS IS THE PART THAT CHANGED FOR THE NEW DESIGN:
                tr.innerHTML = `
                    <td>#${user.id}</td>
                    <td><strong>${user.name}</strong></td>
                    <td>${user.email}</td>
                    <td>${user.age || '—'}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-edit-small" onclick="editUser(${user.id}, '${user.name}', '${user.email}', '${user.age || ''}')">Edit</button>
                            <button class="btn-delete-small" onclick="deleteUser(${user.id})">Delete</button>
                        </div>
                    </td>
                `;
                userList.appendChild(tr);
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    // Function to populate the form when the Edit button is clicked
    window.editUser = (id, name, email, age) => {
        document.getElementById('name').value = name;
        document.getElementById('email').value = email;
        document.getElementById('age').value = age;
        
        editingUserId = id;
        formTitle.textContent = "Update User Details";
        submitBtn.textContent = "Save Changes";
    };

    // Delete a user
    window.deleteUser = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`/users/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchUsers(); // Refresh table
                if (editingUserId === id) resetForm(); // Clear form if they deleted the user they were editing
            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    // Helper to reset the form back to "Add" mode
    function resetForm() {
        form.reset();
        editingUserId = null;
        formTitle.textContent = "Add New User";
        submitBtn.textContent = "Add User";
    }

    // Helper to show success/error messages
    function showMessage(text, color) {
        formMessage.textContent = text;
        formMessage.style.color = color;
        setTimeout(() => { formMessage.textContent = ''; }, 3000); // Disappear after 3 seconds
    }
});