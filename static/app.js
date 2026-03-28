document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    const userList = document.getElementById('userList');
    const formMessage = document.getElementById('formMessage');
    const formTitle = document.querySelector('.card-title'); 
    const submitBtn = document.querySelector('#userForm button');
    
    let editingUserId = null; 

    // 1. FETCH ALL USERS (Runs on startup)
    window.fetchUsers = async () => {
        try {
            const response = await fetch('/users');
            const users = await response.json();
            
            userList.innerHTML = ''; 
            users.forEach(user => appendUserToTable(user));
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Run immediately when page loads
    fetchUsers();

    // 2. FETCH USER BY ID (The new Search functionality)
    window.searchUser = async () => {
        const searchInput = document.getElementById('searchId').value;
        
        // If search is empty, just fetch all users
        if (!searchInput) {
            fetchUsers();
            return;
        }

        try {
            const response = await fetch(`/users/${searchInput}`);
            userList.innerHTML = ''; // Clear the table first
            
            if (response.ok) {
                const user = await response.json();
                appendUserToTable(user); // Show just this one user
            } else {
                // If ID doesn't exist, show a clean message inside the table
                userList.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 2rem; color: #6b7280;">
                            No user found with ID #${searchInput}
                        </td>
                    </tr>`;
            }
        } catch (error) {
            console.error('Error searching user:', error);
        }
    };

    // Helper to reset the search bar and view all
    window.resetSearch = () => {
        document.getElementById('searchId').value = '';
        fetchUsers();
    };

    // Handle Form Submission (Add & Update)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            age: document.getElementById('age').value ? parseInt(document.getElementById('age').value) : null
        };

        try {
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
                resetSearch(); // Refresh table to show everyone
            } else {
                showMessage(result.error || 'Failed to process request', 'red');
            }
        } catch (error) {
            showMessage('Server connection error', 'red');
        }
    });

    // Helper to draw a user row on the screen
    function appendUserToTable(user) {
        const tr = document.createElement('tr');
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
    }

    // Populate form for updating
    window.editUser = (id, name, email, age) => {
        document.getElementById('name').value = name;
        document.getElementById('email').value = email;
        document.getElementById('age').value = age;
        
        editingUserId = id;
        formTitle.textContent = "Update User Details";
        submitBtn.textContent = "Save Changes";
    };

    // Delete user
    window.deleteUser = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`/users/${id}`, { method: 'DELETE' });
            if (response.ok) {
                resetSearch(); // Refresh table
                if (editingUserId === id) resetForm(); 
            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    // Reset form back to "Add Mode"
    function resetForm() {
        form.reset();
        editingUserId = null;
        formTitle.textContent = "Add New User";
        submitBtn.textContent = "Add User";
    }

    // Show messages under the form
    function showMessage(text, color) {
        formMessage.textContent = text;
        formMessage.style.color = color;
        setTimeout(() => { formMessage.textContent = ''; }, 3000);
    }
});