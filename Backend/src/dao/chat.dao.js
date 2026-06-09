import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

//Chat creation
export async function createChat({ title, user }) {
    const chat = await chatModel.create({ title, user })
    return chat;
}

//Save Messages
export async function saveMessage({ chatId, sender, content }) {
    return await messageModel.create({
        chat: chatId,
        sender,
        content
    });
}

//get messages by chatID
export async function getChats(chatId) {
    const chat = await messageModel.find({ 
            chat: chatId, 
            isDeleted: false 
        })
        .sort({ timestamp: 1 });
    return chat;
}

//get all chats of a user
export async function getUserChatsList(userId) {
    return await chatModel.find({
        user: userId,
        isDeleted: false
    }).sort({ updatedAt: -1 });
}

//delete chat
export async function deleteChat(chatId) {
    const isChatDeleted = await chatModel.findByIdAndUpdate(chatId, { isDeleted: true });

    return isChatDeleted;
}