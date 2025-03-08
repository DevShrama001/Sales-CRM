from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from models import db, User, Lead, Followup
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this to a secure secret key
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///crm.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/')
@login_required
def dashboard():
    leads_by_status = {}
    for status in ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Negotiation', 'Converted', 'Lost']:
        leads_by_status[status] = Lead.query.filter_by(status=status, user_id=current_user.id).count()
    
    recent_leads = Lead.query.filter_by(user_id=current_user.id).order_by(Lead.created_at.desc()).limit(5)
    upcoming_followups = Followup.query.join(Lead).filter(
        Lead.user_id == current_user.id,
        Followup.status == 'Pending',
        Followup.followup_date >= datetime.utcnow()
    ).order_by(Followup.followup_date).limit(5)
    
    return render_template('dashboard.html', 
                         leads_by_status=leads_by_status,
                         recent_leads=recent_leads,
                         upcoming_followups=upcoming_followups)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = User.query.filter_by(username=request.form['username']).first()
        if user and user.check_password(request.form['password']):
            login_user(user)
            return redirect(url_for('dashboard'))
        flash('Invalid username or password')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/add-lead', methods=['GET', 'POST'])
@login_required
def add_lead():
    if request.method == 'POST':
        lead = Lead(
            name=request.form['name'],
            email=request.form['email'],
            phone=request.form['phone'],
            company=request.form['company'],
            notes=request.form['notes'],
            user_id=current_user.id
        )
        db.session.add(lead)
        db.session.commit()
        flash('Lead added successfully')
        return redirect(url_for('manage_leads'))
    return render_template('add_lead.html')

@app.route('/manage-leads')
@login_required
def manage_leads():
    leads = Lead.query.filter_by(user_id=current_user.id).all()
    return render_template('manage_leads.html', leads=leads)

@app.route('/followup-leads')
@login_required
def followup_leads():
    followups = Followup.query.join(Lead).filter(
        Lead.user_id == current_user.id,
        Followup.status == 'Pending'
    ).order_by(Followup.followup_date).all()
    return render_template('followup_leads.html', followups=followups)

@app.route('/manage-staff')
@login_required
def manage_staff():
    if not current_user.is_admin:
        flash('Access denied')
        return redirect(url_for('dashboard'))
    staff = User.query.all()
    return render_template('manage_staff.html', staff=staff)

# API Routes
@app.route('/api/leads/<int:lead_id>', methods=['GET', 'PUT', 'DELETE'])
@login_required
def api_lead(lead_id):
    lead = Lead.query.filter_by(id=lead_id, user_id=current_user.id).first_or_404()
    
    if request.method == 'GET':
        return jsonify({
            'id': lead.id,
            'name': lead.name,
            'email': lead.email,
            'phone': lead.phone,
            'company': lead.company,
            'notes': lead.notes,
            'status': lead.status
        })
    
    elif request.method == 'PUT':
        data = request.get_json()
        lead.name = data.get('name', lead.name)
        lead.email = data.get('email', lead.email)
        lead.phone = data.get('phone', lead.phone)
        lead.company = data.get('company', lead.company)
        lead.notes = data.get('notes', lead.notes)
        db.session.commit()
        return jsonify({'message': 'Lead updated successfully'})
    
    elif request.method == 'DELETE':
        db.session.delete(lead)
        db.session.commit()
        return jsonify({'message': 'Lead deleted successfully'})

@app.route('/api/leads/update-status', methods=['POST'])
@login_required
def update_lead_status():
    data = request.get_json()
    lead = Lead.query.filter_by(id=data['lead_id'], user_id=current_user.id).first_or_404()
    lead.status = data['status']
    db.session.commit()
    return jsonify({'message': 'Status updated successfully'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
