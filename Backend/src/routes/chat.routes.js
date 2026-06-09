import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createChat, deleteChat, getChatMessages, getUserChats, handleMessage } from "../controllers/chat.controller.js";

const chatRouter = Router();

//chat with AI - send message and get response in stream
chatRouter.post("/", authMiddleware, handleMessage)

//create a new Chat
chatRouter.post("/create", authMiddleware, createChat)

//get all user chats
chatRouter.get("/", authMiddleware, getUserChats)

//get User messages for a chat
chatRouter.get("/messages/:chatId", authMiddleware, getChatMessages)

//delete a chat
chatRouter.delete("/delete/:chatId", authMiddleware, deleteChat)

export default chatRouter;