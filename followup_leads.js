document.addEventListener('DOMContentLoaded', function() {
    // Initialize FullCalendar
    const calendarEl = document.getElementById('followupCalendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: '/api/followups/calendar',
        eventClick: function(info) {
            editFollowup(info.event.id);
        }
    });
    calendar.render();

    // Initialize datetime picker
    if (typeof flatpickr !== 'undefined') {
        flatpickr("#followupDate", {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            minDate: "today"
        });
    }
});

function editFollowup(id) {
    fetch(`/api/followups/${id}`)
        .then(response => response.json())
        .then(followup => {
            document.getElementById('followupId').value = followup.id;
            document.getElementById('leadSelect').value = followup.lead_id;
            document.getElementById('followupDate').value = followup.followup_date;
            document.getElementById('followupNotes').value = followup.notes;
            
            const modal = new bootstrap.Modal(document.getElementById('followupModal'));
            modal.show();
        });
}

function saveFollowup() {
    const id = document.getElementById('followupId').value;
    const data = {
        lead_id: document.getElementById('leadSelect').value,
        followup_date: document.getElementById('followupDate').value,
        notes: document.getElementById('followupNotes').value
    };

    fetch(`/api/followups/${id || ''}`, {
        method: id ? 'PUT' : 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(() => {
        location.reload();
    });
}

function completeFollowup(id) {
    if (confirm('Mark this follow-up as completed?')) {
        fetch(`/api/followups/${id}/complete`, {
            method: 'POST'
        }).then(() => {
            location.reload();
        });
    }
}

function deleteFollowup(id) {
    if (confirm('Are you sure you want to delete this follow-up?')) {
        fetch(`/api/followups/${id}`, {
            method: 'DELETE'
        }).then(() => {
            location.reload();
        });
    }
}
