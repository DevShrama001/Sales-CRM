function editStaff(id) {
    fetch(`/api/staff/${id}`)
        .then(response => response.json())
        .then(staff => {
            document.getElementById('staffId').value = staff.id;
            document.getElementById('username').value = staff.username;
            document.getElementById('email').value = staff.email;
            document.getElementById('isAdmin').checked = staff.is_admin;
            document.getElementById('password').value = '';
            
            const modal = new bootstrap.Modal(document.getElementById('staffModal'));
            modal.show();
        });
}

function saveStaff() {
    const id = document.getElementById('staffId').value;
    const data = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        is_admin: document.getElementById('isAdmin').checked
    };

    fetch(`/api/staff/${id || ''}`, {
        method: id ? 'PUT' : 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(() => {
        location.reload();
    });
}

function deleteStaff(id) {
    if (confirm('Are you sure you want to delete this staff member?')) {
        fetch(`/api/staff/${id}`, {
            method: 'DELETE'
        }).then(() => {
            location.reload();
        });
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Show modal when Add Staff button is clicked
    const addStaffBtn = document.querySelector('[data-bs-target="#staffModal"]');
    if (addStaffBtn) {
        addStaffBtn.addEventListener('click', function() {
            document.getElementById('staffForm').reset();
            document.getElementById('staffId').value = '';
        });
    }
});
