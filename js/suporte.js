const socket = new WebSocket('ws://localhost:8765');

// Evento de abertura da conexão WebSocket
socket.onopen = function (event) {
    console.log('Conexão aberta com o servidor');
};

// Evento de recebimento de mensagem do servidor
socket.onmessage = function (event) {
    console.log('Mensagem recebida do servidor:', event.data);
};

// Função para enviar mensagem para o servidor
function sendMessage(message) {
    socket.send(message);
}

// Exemplo de uso: enviar uma mensagem para o servidor
sendMessage('Olá, servidor!');