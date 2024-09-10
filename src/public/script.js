document.addEventListener('DOMContentLoaded', () => {
    let token = '';
    let userId = '';
    let recipientId = ''; // Armazena o ID do destinatário
    let socket;

    // Inicializa o Socket.IO
    function initSocket() {
      socket = io('http://localhost:3333');

      // Escuta o evento de nova mensagem
      socket.on('newMessage', (data) => {
        if (data.chatId === document.getElementById('current-chat-id').value) {
          // Adiciona a nova mensagem à interface
          const div = document.createElement('div');
          div.innerText = `${data.senderId}: ${data.message}`;
          document.getElementById('chat-list').appendChild(div);
        }
      });
    }

    // Função para realizar o login
    async function login() {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('http://localhost:3333/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          throw new Error('Invalid email or password');
        }

        const result = await response.json();
        token = result.token;
        userId = result.id;

        document.getElementById('login-form').style.display = 'none';
        document.getElementById('chat-container').style.display = 'block';

        loadChats();
        initSocket(); // Inicializa o Socket.IO após o login
      } catch (error) {
        document.getElementById('login-error').innerText = error.message;
      }
    }

    // Função para carregar os chats do usuário
    async function loadChats() {
      try {
        const response = await fetch(`http://localhost:3333/chats/${userId}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to load chats');
        }

        const chats = await response.json();
        const chatList = document.getElementById('chat-list');

        chatList.innerHTML = ''; // Limpa a lista atual
        chats.content.forEach(chat => {
          const div = document.createElement('div');
          div.innerText = `${chat.initiator.name} - ${chat.participant.name}`;
          div.onclick = () => openChat(chat.id, chat.participant.id); // Passa o ID do destinatário
          chatList.appendChild(div);
        });
      } catch (error) {
        console.error(error);
      }
    }

    // Função para abrir um chat específico e carregar mensagens
    async function openChat(chatId, recipient) {
      try {
        const response = await fetch(`http://localhost:3333/chat/${chatId}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to load chat messages');
        }

        const chat = await response.json();
        displayMessages(chat.content.messages); // Assumindo que `chat.content.messages` contém as mensagens

        // Atualiza o ID do chat atual e do destinatário
        const chatIdElement = document.getElementById('current-chat-id');
        if (chatIdElement) {
          chatIdElement.value = chatId;
        } else {
          console.error('Element with ID "current-chat-id" not found');
        }
        
        recipientId = recipient; // Armazena o ID do destinatário

      } catch (error) {
        console.error(error);
      }
    }

    // Função para exibir mensagens na interface
    function displayMessages(messages) {
        const chatList = document.getElementById('chat-list');
        chatList.innerHTML = ''; // Limpa a lista atual
      
        if (Array.isArray(messages)) {
          messages.forEach(message => {
            const div = document.createElement('div');
            div.innerText = `${message.senderId}: ${message.content}`;
            chatList.appendChild(div);
          });
        } else {
          console.error('Expected messages to be an array, but got:', messages);
        }
      }

      async function loadMessages(chatId) {
        try {
          const response = await fetch(`http://localhost:3333/chat/${chatId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          });
      
          if (!response.ok) {
            throw new Error('Failed to load messages');
          }
      
          const chat = await response.json();
          console.log('Loaded chat:', chat); // Adiciona log para verificar o formato da resposta
      
          if (chat && chat.content && Array.isArray(chat.content.messages)) {
            displayMessages(chat.content.messages); // Corrigido para acessar chat.content.messages
          } else {
            console.error('Invalid chat format or messages are not an array:', chat);
          }
        } catch (error) {
          console.error(error);
        }
      }

    // Função para enviar uma mensagem
    async function sendMessage() {
        const content = document.getElementById('message-content').value;
        const chatId = document.getElementById('current-chat-id').value;
        
        if (!chatId) {
          console.error('Chat ID is not set');
          return;
        }
      
        try {
          const response = await fetch(`http://localhost:3333/chat/${chatId}/message`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
          });
      
          if (!response.ok) {
            throw new Error('Failed to send message');
          }
      
          document.getElementById('message-content').value = ''; // Limpa o campo de mensagem
          // Recarrega as mensagens do chat
          loadMessages(chatId);
        } catch (error) {
          console.error(error);
        }
      }
      

    // Exporta as funções para uso global
    window.login = login;
    window.sendMessage = sendMessage;
  });


  


