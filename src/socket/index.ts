import { Server as SocketIOServer, Socket } from "socket.io";
import { IMessageService } from "../service/MessageService";

interface MessageData {
  content: string;
  senderId: string;
  recipientId: string;
  chatId: string;
}

// Função para configurar o Socket.IO
export function setupSocket(io: SocketIOServer, messageService: IMessageService) {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected", socket.id);

    socket.on("joinChat", (chatId: string) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined chat ${chatId}`);
    });
    
    socket.on("sendMessage", async (messageData: MessageData) => {
      try {

        if (!messageData.content || !messageData.senderId || !messageData.chatId) {
          throw new Error('Invalid message data');
        }

        const { content, senderId, recipientId, chatId } = messageData;


        const newMessage = await messageService.createMessage(content, senderId, recipientId, chatId);


        io.to(chatId).emit("message", newMessage);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error creating message:", error);
          socket.emit("error", { message: "Failed to send message", error: error.message });
        }
      }
    });

    // Evento para quando o usuário se desconectar
    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });
}


