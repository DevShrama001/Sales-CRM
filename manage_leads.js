// Initialize Sortable on all kanban columns
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.kanban-column').forEach(function(column) {
        window.Sortable.create(column, {
            group: 'shared',
            animation: 150,
            ghostClass: 'sortable-ghost',
            dragClass: 'sortable-drag',
            onEnd: function(evt) {
                if (evt.item && evt.to) {
                    const leadId = evt.item.getAttribute('data-lead-id');
                    const newStatus = evt.to.getAttribute('data-status');
                    updateLeadStatus(leadId, newStatus);
                }
            }
        });
    });
});

// Filter functions
function applyFilters() {
    const searchText = document.getElementById('searchText').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const dateRange = document.getElementById('dateRange').value;

    document.querySelectorAll('.kanban-card').forEach(card => {
        let show = true;
        
        // Text search
        if (searchText) {
            const cardText = card.textContent.toLowerCase();
            show = cardText.includes(searchText);
        }

        // Status filter
        if (show && statusFilter) {
            const cardStatus = card.closest('.kanban-column').getAttribute('data-status');
            show = cardStatus === statusFilter;
        }

        // Date filter
        if (show && dateRange) {
            const cardDate = new Date(card.querySelector('.text-muted').textContent.replace('Created: ', ''));
            const today = new Date();
            
            switch(dateRange) {
                case 'today':
                    show = cardDate.toDateString() === today.toDateString();
                    break;
                case 'week':
                    const weekAgo = new Date(today.setDate(today.getDate() - 7));
                    show = cardDate >= weekAgo;
                    break;
                case 'month':
                    show = cardDate.getMonth() === today.getMonth() && 
                           cardDate.getFullYear() === today.getFullYear();
                    break;
                case 'quarter':
                    const quarterAgo = new Date(today.setMonth(today.getMonth() - 3));
                    show = cardDate >= quarterAgo;
                    break;
            }
        }

        card.style.display = show ? 'block' : 'none';
    });
}

function resetFilters() {
    document.getElementById('filterForm').reset();
    document.querySelectorAll('.kanban-card').forEach(card => {
        card.style.display = 'block';
    });
}

// Lead management functions
function updateLeadStatus(leadId, newStatus) {
    fetch('/api/leads/update-status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            lead_id: leadId,
            status: newStatus
        })
    });
}

function editLead(leadId) {
    fetch(`/api/leads/${leadId}`)
        .then(response => response.json())
        .then(lead => {
            document.getElementById('editLeadId').value = lead.id;
            document.getElementById('editName').value = lead.name;
            document.getElementById('editEmail').value = lead.email;
            document.getElementById('editPhone').value = lead.phone;
            document.getElementById('editCompany').value = lead.company;
            document.getElementById('editNotes').value = lead.notes;
            
            const modal = new bootstrap.Modal(document.getElementById('editLeadModal'));
            modal.show();
        });
}

function saveLeadChanges() {
    const leadId = document.getElementById('editLeadId').value;
    const data = {
        name: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        company: document.getElementById('editCompany').value,
        notes: document.getElementById('editNotes').value
    };

    fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(() => {
        location.reload();
    });
}

function deleteLead(leadId) {
    if (confirm('Are you sure you want to delete this lead?')) {
        fetch(`/api/leads/${leadId}`, {
            method: 'DELETE'
        }).then(() => {
            location.reload();
        });
    }
}
