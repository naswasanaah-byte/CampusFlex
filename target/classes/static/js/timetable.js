/* Timetable System Visualizer & Schedule Conflict Handler */

async function renderTimetableGrid(container) {
  try {
    const res = await fetch('/api/student/timetable');
    const entries = await res.json();

    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    let gridHtml = '';

    days.forEach(day => {
      const dayEntries = entries.filter(e => e.dayOfWeek === day);
      let slotsHtml = '';
      if (dayEntries.length === 0) {
        slotsHtml = `<div style="font-size: 11px; color: var(--text-muted); font-style: italic; padding: 6px 0;">No lectures scheduled</div>`;
      } else {
        dayEntries.forEach(slot => {
          slotsHtml += `
            <div class="lecture-slot">
              <div style="font-weight: 700;">${slot.subjectName}</div>
              <div style="color: var(--text-muted); font-size: 11px;">⏰ ${slot.startTime.substring(0,5)} - ${slot.endTime.substring(0,5)}</div>
              <div style="display: flex; justify-content: space-between; margin-top: 4px;">
                <span style="font-size: 10px; background: white; padding: 1px 6px; border-radius: 4px;">${slot.type || 'Lecture'}</span>
                <button onclick="deleteLectureSlot(${slot.id})" style="background: none; border: none; color: var(--danger-red); font-size: 11px; cursor: pointer;">✕ Delete</button>
              </div>
            </div>
          `;
        });
      }

      gridHtml += `
        <div class="day-column">
          <div class="day-title">${day.substring(0,3)}</div>
          ${slotsHtml}
        </div>
      `;
    });

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div>
          <h3 style="font-size: 18px; font-weight: 800;">My Weekly Lecture Timetable</h3>
          <p style="font-size: 13px; color: var(--text-muted);">CampusFlex uses your lecture slots to prevent part-time job schedule conflicts.</p>
        </div>
        <button class="btn btn-primary" onclick="showAddLectureModal()">+ Add Lecture Slot</button>
      </div>

      <div class="timetable-grid">
        ${gridHtml}
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="card"><p style="color: var(--danger-red);">Failed to load timetable entries.</p></div>`;
  }
}

function showAddLectureModal() {
  const modalBody = document.getElementById('job-modal-body');
  showModal('job-modal');

  modalBody.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h3 style="font-size: 18px; font-weight: 800;">Add Lecture / Lab Slot</h3>
      <button onclick="closeModal('job-modal')" style="background: none; border: none; font-size: 18px; cursor: pointer;">✕</button>
    </div>

    <form onsubmit="handleAddLectureSubmit(event)">
      <div style="margin-bottom: 12px;">
        <label style="font-size: 12px; font-weight: 700;">Subject / Lecture Name</label>
        <input type="text" id="tt-subject" required placeholder="e.g. Data Structures & Algorithms" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
      </div>
      <div style="margin-bottom: 12px;">
        <label style="font-size: 12px; font-weight: 700;">Day of Week</label>
        <select id="tt-day" required style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
          <option value="MONDAY">Monday</option>
          <option value="TUESDAY">Tuesday</option>
          <option value="WEDNESDAY">Wednesday</option>
          <option value="THURSDAY">Thursday</option>
          <option value="FRIDAY">Friday</option>
          <option value="SATURDAY">Saturday</option>
        </select>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px;">
        <div>
          <label style="font-size: 12px; font-weight: 700;">Start Time</label>
          <input type="time" id="tt-start" required style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
        </div>
        <div>
          <label style="font-size: 12px; font-weight: 700;">End Time</label>
          <input type="time" id="tt-end" required style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
        </div>
      </div>
      <button type="submit" class="btn btn-primary" style="width: 100%;">Save Lecture Slot</button>
    </form>
  `;
}

async function handleAddLectureSubmit(e) {
  e.preventDefault();
  const payload = {
    subjectName: document.getElementById('tt-subject').value,
    dayOfWeek: document.getElementById('tt-day').value,
    startTime: document.getElementById('tt-start').value,
    endTime: document.getElementById('tt-end').value,
    type: 'Lecture'
  };

  try {
    const res = await fetch('/api/student/timetable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      closeModal('job-modal');
      showToast('Lecture added to timetable!', 'success');
      renderTimetableGrid(document.getElementById('main-view-container'));
    } else {
      const err = await res.json();
      showToast(err.message || 'Failed to add lecture', 'error');
    }
  } catch (err) {
    showToast('Error saving lecture', 'error');
  }
}

async function deleteLectureSlot(id) {
  if (!confirm("Are you sure you want to delete this lecture slot?")) return;
  try {
    const res = await fetch(`/api/student/timetable/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Lecture deleted.', 'info');
      renderTimetableGrid(document.getElementById('main-view-container'));
    }
  } catch (err) {
    showToast('Error deleting lecture slot', 'error');
  }
}
