const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function enviarMensaje() {
    const mensaje = userInput.value.trim();
    if(mensaje === '') return;
    
    agregarMensaje(mensaje, 'user');
    userInput.value = '';
    
    fetch('/enviar_mensaje', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mensaje: mensaje })
    })
    .then(response => response.json())
    .then(data => {
        setTimeout(() => {
            agregarMensaje(data.bot, 'bot');
        }, 500);
    });
}

function agregarMensaje(texto, tipo) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${tipo}-message`;
    
    const avatarIcon = tipo === 'user' ? 'fas fa-user' : 'fas fa-robot';
    
    messageDiv.innerHTML = `
        <div class="avatar">
            <i class="${avatarIcon}"></i>
        </div>
        <div class="content">
            ${texto}
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

sendBtn.addEventListener('click', enviarMensaje);
userInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') enviarMensaje();
});