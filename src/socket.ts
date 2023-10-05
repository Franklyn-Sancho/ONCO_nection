import * as socketIo from "socket.io";
import { MessageService } from "./service/MessageService";
import { ChatService } from "./service/ChatService";

export function setupSocket(
  io: socketIo.Server,
  messageService: MessageService,
  chatService: ChatService
) {
  io.on("connection", (socket) => {
    console.log("Um usuário se conectou");

    socket.on("new message", async (message) => {
      const newMessage = await messageService.createMessage(
        message.content,
        message.senderId,
        message.recipientId,
        message.chatId
      );

      io.emit("message", newMessage);
    });

    socket.on("new chat", async (chat) => {
      const newChat = await chatService.createChat(
        chat.initiatorId,
        chat.participantId
      );

      io.emit("chat", newChat);
    });
  });
}
