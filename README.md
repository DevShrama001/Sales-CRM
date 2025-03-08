# Sales CRM

A web-based Customer Relationship Management (CRM) system built with Flask, featuring lead management, staff management, and follow-up tracking.

## Features

- User Authentication (Admin and Staff roles)
- Dashboard with lead statistics and upcoming follow-ups
- Lead Management
  - Add, edit, and delete leads
  - Kanban board view with drag-and-drop functionality
  - Custom lead stages/pipeline
  - Advanced filtering and search
- Follow-up Management
  - Schedule follow-ups with leads
  - Calendar view of follow-ups
  - Email notifications (coming soon)
- Staff Management (Admin only)
  - Add, edit, and delete staff members
  - Role-based access control

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sales-crm
```

2. Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Initialize the database:
```bash
# Start Python shell
python
```
```python
from app import app, db
from models import User
with app.app_context():
    db.create_all()
    # Create admin user
    admin = User(username='admin', email='admin@example.com', is_admin=True)
    admin.set_password('admin123')  # Change this password
    db.session.add(admin)
    db.session.commit()
```

5. Run the application:
```bash
python app.py
```

The application will be available at `http://localhost:5000`

## Default Login

- Username: admin
- Password: admin123 (change this after first login)

## Project Structure

```
sales-crm/
├── app.py              # Main application file
├── models.py           # Database models
├── requirements.txt    # Python dependencies
├── static/
│   ├── js/
│   │   ├── manage_leads.js
│   │   ├── manage_staff.js
│   │   └── followup_leads.js
│   └── css/           # Custom CSS (if needed)
└── templates/
    ├── base.html      # Base template
    ├── login.html
    ├── dashboard.html
    ├── add_lead.html
    ├── manage_leads.html
    ├── followup_leads.html
    └── manage_staff.html
```

## Usage

1. **Login**: Access the system using your credentials
2. **Dashboard**: View lead statistics and upcoming follow-ups
3. **Add Lead**: Create new leads with contact information and status
4. **Manage Leads**: 
   - View leads in a Kanban board
   - Drag and drop to change lead status
   - Filter leads by various criteria
5. **Follow-ups**:
   - Schedule follow-ups with leads
   - View in calendar or list format
   - Mark follow-ups as completed
6. **Staff Management** (Admin only):
   - Add new staff members
   - Manage roles and permissions
   - View staff activity

## Security Features

- Password hashing using Werkzeug
- CSRF protection
- Role-based access control
- Session management
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
