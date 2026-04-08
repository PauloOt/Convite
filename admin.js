// ─── Config ─────────────────────────────────────────────────────────────────
const ADMIN_PIN    = '2027';
const STORAGE_KEY  = 'rsvp_bruna_rodrigo';
const SESSION_KEY  = 'admin_unlocked';

// ─── Elements ────────────────────────────────────────────────────────────────
const pinOverlay  = document.getElementById('pinOverlay');
const adminPanel  = document.getElementById('adminPanel');
const pinInput    = document.getElementById('pinInput');
const pinBtn      = document.getElementById('pinBtn');
const pinError    = document.getElementById('pinError');
const logoutBtn   = document.getElementById('logoutBtn');

// ─── PIN gate ────────────────────────────────────────────────────────────────
function unlock() {
  pinOverlay.classList.add('hidden');
  adminPanel.classList.remove('hidden');
  sessionStorage.setItem(SESSION_KEY, '1');
  renderRSVPs();
}

function tryUnlock() {
  if (pinInput.value === ADMIN_PIN) {
    unlock();
  } else {
    pinError.style.display = 'block';
    pinInput.value = '';
    pinInput.focus();
  }
}

pinBtn.addEventListener('click', tryUnlock);

pinInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') tryUnlock();
  pinError.style.display = 'none';
});

// Auto-unlock if already authenticated this session
if (sessionStorage.getItem(SESSION_KEY) === '1') unlock();

// ─── Logout ──────────────────────────────────────────────────────────────────
logoutBtn.addEventListener('click', function () {
  sessionStorage.removeItem(SESSION_KEY);
  adminPanel.classList.add('hidden');
  pinOverlay.classList.remove('hidden');
  pinInput.value = '';
});

// ─── Render RSVPs ────────────────────────────────────────────────────────────
function renderRSVPs() {
  let list = [];
  try { list = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { /* ignore */ }

  // Sort by newest first
  list.sort((a, b) => b.id - a.id);

  const confirmed = list.filter(r => r.confirmed);
  const declined  = list.filter(r => !r.confirmed);

  // Total people (sum of person + guests for confirmed)
  const totalPeople = confirmed.reduce((acc, r) => acc + 1 + (r.guests || 0), 0);

  document.getElementById('totalPeople').textContent = totalPeople;
  document.getElementById('countYes').textContent    = confirmed.length;
  document.getElementById('countNo').textContent     = declined.length;

  const listEl     = document.getElementById('rsvpList');
  const emptyState = document.getElementById('emptyState');

  // Remove old items (keep emptyState)
  listEl.querySelectorAll('.rsvp-item').forEach(el => el.remove());

  if (list.length === 0) {
    emptyState.style.display = 'block';
    return;
  }
  emptyState.style.display = 'none';

  list.forEach(entry => {
    const item = document.createElement('div');
    item.className = 'rsvp-item';

    const date = new Date(entry.createdAt);
    const dateStr = date.toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

    const statusClass = entry.confirmed ? 'tag-yes' : 'tag-no';
    const statusTxt   = entry.confirmed ? 'Confirmado' : 'Recusou';
    const guestTxt    = entry.guests === 0
      ? 'Sozinho(a)'
      : `+ ${entry.guests} acompanhante${entry.guests > 1 ? 's' : ''}`;

    item.innerHTML = `
      <div class="rsvp-name">${escapeHtml(entry.name)}</div>
      <div class="rsvp-meta">
        <span class="${statusClass}">${statusTxt}</span>
        &nbsp;·&nbsp; ${guestTxt}
        &nbsp;·&nbsp; ${dateStr}
      </div>
      ${entry.guestNames ? `<div class="rsvp-guest-names">Acompanhantes: ${escapeHtml(entry.guestNames)}</div>` : ''}
      ${entry.message ? `<div class="rsvp-msg">"${escapeHtml(entry.message)}"</div>` : ''}
    `;

    listEl.appendChild(item);
  });
}

// ─── Util ────────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
