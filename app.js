// ─── Configuração ───────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '5511986755485';
const STORAGE_KEY = 'rsvp_bruna_rodrigo';

// ─── Helpers ────────────────────────────────────────────────────────────────
function loadRSVPs() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveRSVP(entry) {
  const list = loadRSVPs();
  list.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function buildWhatsAppURL(entry) {
  const { name, guests, guestNames, message, confirmed } = entry;

  let text;

  if (confirmed) {
    const companions =
      guests === 0
        ? 'Vai sozinho(a).'
        : `Vai com ${guests} acompanhante${guests > 1 ? 's' : ''}${guestNames ? ': ' + guestNames : ''}.`;

    text = `Oi Bruna! 💛 ${name} confirmou presença no casamento!\n${companions}`;
    if (message) text += `\n\nMensagem: "${message}"`;
  } else {
    text = `Oi Bruna, ${name} não poderá comparecer ao casamento. 💛`;
    if (message) text += `\n\nMensagem: "${message}"`;
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

// ─── Página de formulário (index.html) ──────────────────────────────────────
const form = document.getElementById('rsvpForm');
if (form) {
  const selectGuests    = document.getElementById('inputGuests');
  const groupGuestNames = document.getElementById('groupGuestNames');
  const inputGuestNames = document.getElementById('inputGuestNames');

  selectGuests.addEventListener('change', function () {
    const hasGuests = parseInt(this.value) > 0;
    groupGuestNames.style.display = hasGuests ? 'block' : 'none';
    if (!hasGuests) inputGuestNames.value = '';
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    submitRSVP(true);
  });

  const btnDecline = document.getElementById('btnDecline');
  if (btnDecline) {
    btnDecline.addEventListener('click', function () {
      submitRSVP(false);
    });
  }

  function submitRSVP(confirmed) {
    const name       = document.getElementById('inputName').value.trim();
    const guests     = parseInt(selectGuests.value, 10);
    const guestNames = guests > 0 ? inputGuestNames.value.trim() : '';
    const message    = document.getElementById('inputMsg').value.trim();

    if (!name) {
      document.getElementById('inputName').focus();
      return;
    }

    if (guests > 0 && !guestNames) {
      inputGuestNames.focus();
      return;
    }

    const entry = {
      id:        Date.now(),
      name,
      guests,
      guestNames,
      message,
      confirmed,
      createdAt: new Date().toISOString(),
    };

    saveRSVP(entry);
    sessionStorage.setItem('last_rsvp', JSON.stringify(entry));
    window.location.href = 'obrigado.html';
  }
}

// ─── Página de obrigado (obrigado.html) ─────────────────────────────────────
const guestNameEl  = document.getElementById('guestName');
const thanksLineEl = document.getElementById('thanksLine');
const thanksMsgEl  = document.getElementById('thanksMsg');
const statusLabel  = document.getElementById('statusLabel');
const notifyStatus = document.getElementById('notifyStatus');

if (guestNameEl) {
  let entry = null;
  try { entry = JSON.parse(sessionStorage.getItem('last_rsvp')); } catch { /* ignore */ }

  if (entry) {
    guestNameEl.textContent  = entry.name;
    thanksLineEl.textContent = entry.confirmed ? 'Obrigada,' : 'Sentiremos sua falta,';

    if (entry.confirmed) {
      statusLabel.textContent = '✓ Presença Confirmada';
      thanksMsgEl.innerHTML   = 'Não vemos a hora de celebrar<br>este dia especial com você.';
    } else {
      statusLabel.textContent = 'Resposta Recebida';
      thanksMsgEl.innerHTML   = 'Obrigada por nos avisar.<br>Estaremos pensando em você.';
    }

    // Abre o WhatsApp automaticamente após 1.5s para notificar a Bruna
    setTimeout(() => {
      window.open(buildWhatsAppURL(entry), '_blank');
      if (notifyStatus) {
        notifyStatus.textContent = 'A Bruna foi notificada via WhatsApp 💛';
      }
    }, 1500);

  } else {
    window.location.href = 'index.html';
  }
}
