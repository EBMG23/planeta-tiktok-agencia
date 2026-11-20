// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    const isActive = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

    // Open clicked if it was closed
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// Form submission (demo)
document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const btn = this.querySelector('button[type="submit"]');
  const originalText = btn.textContent;

  btn.textContent = 'Enviando...';
  btn.disabled = true;

  // Simulate sending
  setTimeout(() => {
    btn.textContent = '¡Registro enviado! ✓';
    btn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';

    // Show success message
    const successMsg = document.createElement('div');
    successMsg.style.cssText = `
      margin-top: 20px;
      padding: 16px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 12px;
      text-align: center;
      color: #34d399;
      font-weight: 500;
    `;
    successMsg.innerHTML = '¡Gracias! Un reclutador de Agencia Planeta te contactará pronto por WhatsApp.';
    this.appendChild(successMsg);

    // Reset form after delay
    setTimeout(() => {
      this.reset();
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.background = '';
      successMsg.remove();
    }, 5000);
  }, 1200);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===== PLANETABOT - ASISTENTE IA ===== */
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatBadge = document.querySelector('.chat-badge');

// Knowledge base responses
const botResponses = [
  {
    keywords: ['comision', 'comisión', 'porcentaje', 'quitan', 'diamante', 'ganancia', 'regalo', 'cobran', 'pagan'],
    answer: `✅ <strong>Cero comisiones.</strong><br><br>
    Agencia Planeta <strong>NO</strong> te quita ningún porcentaje de tus diamantes, regalos o ganancias. El <strong>100%</strong> de lo que generas es tuyo.<br><br>
    A nosotros nos paga directamente la plataforma por bonos de rendimiento del equipo. Unirte es 100% gratis.`
  },
  {
    keywords: ['contraseña', 'clave', 'password', 'acceso', 'cuenta', 'propiedad', 'dueño', 'adueña'],
    answer: `🔑 <strong>Tu cuenta es 100% tuya.</strong><br><br>
    Nunca pedimos contraseñas ni accesos privados. La agencia no se adueña de tu perfil.<br><br>
    Si decides irte en el futuro, te vas con tu cuenta sin penalizaciones ni problemas.`
  },
  {
    keywords: ['horario', 'hora', 'obligatorio', 'jefe', 'tiempo', 'libertad', 'cuando'],
    answer: `⏱️ <strong>Total libertad de horarios.</strong><br><br>
    No hay horarios obligatorios ni jefes. Tú manejas tu tiempo como quieras.<br><br>
    Solo recomendamos constancia (mínimo 10-15 horas al mes para ver resultados), pero la decisión final siempre es tuya.`
  },
  {
    keywords: ['costo', 'precio', 'cuanto', 'cuánto', 'gratis', 'pagar', 'inscripcion', 'inscripción', 'mensual'],
    answer: `💰 <strong>Es 100% gratis unirse.</strong><br><br>
    No hay costo de inscripción, ni mensualidades, ni cargos ocultos. Unirte a Agencia Planeta no te cuesta nada.`
  },
  {
    keywords: ['soporte', 'ayuda', 'baneo', 'shadowban', 'problema', 'tecnico', 'técnico', '24'],
    answer: `🛡️ <strong>Soporte Técnico 24/7.</strong><br><br>
    Te ayudamos con baneos injustos, shadowban, problemas de cobro o cualquier incidencia técnica. Estamos disponibles las 24 horas.`
  },
  {
    keywords: ['academia', 'capacitacion', 'capacitación', 'aprender', 'mejorar', 'iluminacion', 'iluminación', 'contenido', 'retencion'],
    answer: `🎓 <strong>Academia Planeta.</strong><br><br>
    Ofrecemos asesoría personalizada para mejorar iluminación, contenido, retención de audiencia y estrategias de live. Todo orientado a que crezcas más rápido.`
  },
  {
    keywords: ['evento', 'reto', 'batalla', 'graduacion', 'graduación', 'bono'],
    answer: `🏆 <strong>Eventos y Retos de Graduación.</strong><br><br>
    Tienes acceso a batallas oficiales, eventos globales de la plataforma y bonos extra de dinero/tráfico por cumplir retos internos de la agencia.`
  },
  {
    keywords: ['unir', 'registro', 'registrar', 'inscribir', 'como me uno', 'cómo me uno', 'empezar', 'unirme'],
    answer: `🚀 <strong>¡Muy fácil!</strong><br><br>
    Solo completa el formulario de registro que está en esta misma página (sección "¿Listo para crecer?").<br><br>
    Un reclutador te contactará por WhatsApp para darte la bienvenida y guiarte en el proceso de vinculación oficial. Es gratis y toma menos de 2 minutos.`
  },
  {
    keywords: ['estafa', 'real', 'confianza', 'seguro', 'legitimo', 'legítimo', 'falso'],
    answer: `🛡️ <strong>Somos 100% transparentes.</strong><br><br>
    No pedimos contraseñas, no cobramos nada de tus ganancias y no hay contratos trampa. Todo está explicado en esta página oficial.<br><br>
    Puedes revisar los beneficios, el FAQ y registrarte con total seguridad. Si tienes más dudas, pregúntame lo que necesites.`
  },
  {
    keywords: ['hola', 'buenas', 'buenos', 'hey', 'saludos', 'qué tal', 'que tal'],
    answer: `¡Hola! 👋 Bienvenido/a a Agencia Planeta.<br><br>
    Soy PlanetaBot, tu asistente. Puedo responderte sobre comisiones, horarios, soporte, cómo unirte y cualquier duda sobre la agencia.<br><br>
    ¿Qué te gustaría saber?`
  }
];

const defaultAnswer = `Gracias por tu pregunta. 😊<br><br>
Puedo ayudarte con información sobre:<br>
• Comisiones y ganancias (0%)<br>
• Propiedad de tu cuenta<br>
• Horarios y libertad<br>
• Soporte 24/7<br>
• Academia y eventos<br>
• Cómo unirte gratis<br><br>
¿Sobre cuál de estos temas te gustaría saber más? O escribe tu duda con otras palabras.`;

function getBotResponse(userText) {
  const text = userText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  for (const item of botResponses) {
    for (const kw of item.keywords) {
      const normalizedKw = kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (text.includes(normalizedKw)) {
        return item.answer;
      }
    }
  }
  return defaultAnswer;
}

function addMessage(text, isUser = false) {
  const msg = document.createElement('div');
  msg.className = `message ${isUser ? 'user' : 'bot'}`;
  msg.innerHTML = `<div class="bubble">${text}</div>`;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage(text) {
  if (!text.trim()) return;
  
  addMessage(text, true);
  chatInput.value = '';
  
  // Hide suggestions after first message
  const suggestions = document.querySelector('.chat-suggestions');
  if (suggestions) suggestions.style.display = 'none';
  
  // Simulate thinking
  setTimeout(() => {
    const response = getBotResponse(text);
    addMessage(response, false);
  }, 600 + Math.random() * 400);
}

// Toggle chat
chatToggle.addEventListener('click', () => {
  chatWindow.classList.toggle('hidden');
  if (!chatWindow.classList.contains('hidden')) {
    chatBadge.style.display = 'none';
    chatInput.focus();
  }
});

chatClose.addEventListener('click', () => {
  chatWindow.classList.add('hidden');
});

chatSend.addEventListener('click', () => {
  sendMessage(chatInput.value);
});

chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage(chatInput.value);
  }
});

// Suggestion buttons
document.querySelectorAll('.suggestion').forEach(btn => {
  btn.addEventListener('click', () => {
    const question = btn.getAttribute('data-question');
    sendMessage(question);
  });
});
