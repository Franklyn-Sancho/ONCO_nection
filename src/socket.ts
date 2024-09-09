
import { Server as SocketIOServer } from 'socket.io';
import { IMessageService } from './service/MessageService';

// Função para configurar o Socket.IO
export function setupSocket(io: SocketIOServer, messageService: IMessageService) {
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Escuta por eventos de envio de mensagens
    socket.on('sendMessage', async (messageData) => {
      try {
        // Mensagem deve ser um objeto com as propriedades necessárias
        const { content, senderId, recipientId, chatId } = messageData;
        const newMessage = await messageService.createMessage(content, senderId, recipientId, chatId);

        // Emite a nova mensagem para todos os clientes conectados
        io.emit('message', newMessage);
      } catch (error) {
        console.error('Error creating message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Escuta por eventos de desconexão
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
}

