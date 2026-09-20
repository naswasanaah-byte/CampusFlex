/* In-App Employer-Student Messaging Interface */

async function renderChatView(container) {
  try {
    const res = await fetch('/api/messages/inbox');
    const data = await res.json();
    const messages = data.messages || [];

    let msgListHtml = '';
    if (messages.length === 0) {
      msgListHtml = `<div class="card"><p style="text-align: center; color: var(--text-muted);">No message conversations yet.</p></div>`;
    } else {
      messages.forEach(msg => {
        msgListHtml += `
          <div class="card" style="margin-bottom: 10px; padding: 14px; cursor: pointer;" onclick="openChatConversation(${msg.senderId === state.currentUser.id ? msg.receiverId : msg.senderId})">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-weight: 700; font-size: 13px;">${msg.senderId === state.currentUser.id ? 'To: ' + msg.receiverName : 'From: ' + msg.senderName}</span>
              <span style="font-size: 11px; color: var(--text-muted);">${msg.sentAt ? msg.sentAt.substring(11,16) : ''}</span>
            </div>
            <p style="font-size: 13px; color: var(--text-muted); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${msg.content}</p>
          </div>
        `;
      });
    }

    container.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 18px; font-weight: 800;">In-App Messages</h3>
      </div>
      <div>${msgListHtml}</div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="card"><p style="color: var(--danger-red);">Error loading messages.</p></div>`;
  }
}

async function openChatConversation(otherUserId) {
  const modalBody = document.getElementById('job-modal-body');
  showModal('job-modal');

  try {
    const res = await fetch(`/api/messages/conversation?otherUserId=${otherUserId}`);
    const messages = await res.json();

    let chatHtml = messages.map(m => `
      <div style="display: flex; justify-content: ${m.senderId === state.currentUser.id ? 'flex-end' : 'flex-start'}; margin-bottom: 8px;">
        <div style="background: ${m.senderId === state.currentUser.id ? 'var(--purple-gradient)' : '#F1F5F9'}; color: ${m.senderId === state.currentUser.id ? 'white' : 'var(--text-main)'}; padding: 10px 14px; border-radius: 14px; max-width: 80%; font-size: 13px;">
          ${m.content}
        </div>
      </div>
    `).join('');

    modalBody.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <h3 style="font-size: 16px; font-weight: 800;">Chat Conversation</h3>
        <button onclick="closeModal('job-modal')" style="background: none; border: none; font-size: 16px; cursor: pointer;">✕</button>
      </div>
      <div style="height: 300px; overflow-y: auto; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 12px;" id="chat-messages-box">
        ${chatHtml || '<p style="text-align: center; color: var(--text-muted); font-size: 12px;">Start a conversation below.</p>'}
      </div>
      <form onsubmit="handleSendChatMessage(event, ${otherUserId})" style="display: flex; gap: 8px;">
        <input type="text" id="chat-input" required placeholder="Type your message..." style="flex: 1; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
        <button type="submit" class="btn btn-primary">Send</button>
      </form>
    `;

    const box = document.getElementById('chat-messages-box');
    box.scrollTop = box.scrollHeight;
  } catch (err) {
    showToast('Failed to load chat conversation', 'error');
  }
}

async function handleSendChatMessage(e, receiverId) {
  e.preventDefault();
  const input = document.getElementById('chat-input');
  const content = input.value;

  try {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId, content })
    });
    if (res.ok) {
      input.value = '';
      openChatConversation(receiverId);
    }
  } catch (err) {
    showToast('Error sending message', 'error');
  }
}
