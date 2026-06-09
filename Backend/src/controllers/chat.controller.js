import { getAIresponse, getTitle } from "../services/ai.service.js";
import * as chatDao from "../dao/chat.dao.js";
import config from "../config/config.js";
import { upsertPDF } from "../services/pinecone.service.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const handleMessage = async (req, res) => {
    console.log("Received chat request:", { chatId: req.body.chatId, messageCount: req.body.messages?.length });

    const { chatId, messages, file } = req.body;

    if (!messages || messages.length === 0) {
        return res.status(400).json({ message: "Message cannot be empty" })
    }

    if (file && file.type !== "application/pdf") {
        return res.status(400).json({ message: "Only PDF files are allowed" })
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Index PDF if uploaded
    if (file && file.type === "application/pdf") {
        try {
            res.write(`data: ${JSON.stringify({ status: "Uploading document..." })}\n\n`);
            const base64Data = file.data.split(",")[1];
            const buffer = Buffer.from(base64Data, "base64");
            const tempFilePath = path.join(__dirname, `../../temp_${Date.now()}.pdf`);
            
            fs.writeFileSync(tempFilePath, buffer);
            await upsertPDF(tempFilePath);
            fs.unlinkSync(tempFilePath); // Cleanup
            res.write(`data: ${JSON.stringify({ status: "" })}\n\n`);
            console.log("PDF indexed successfully");
        } catch (error) {
            console.error("Failed to index PDF:", error);
            res.write(`data: ${JSON.stringify({ status: "Failed to index document" })}\n\n`);
            setTimeout(() => res.write(`data: ${JSON.stringify({ status: "" })}\n\n`), 2000);
        }
    }

    const generateTitle = async () => {
        try {
            if (!chatId) {
                const data = await getTitle({ message: "Generate a title for this chat: " + messages[0].content })

                const chat = await chatDao.createChat({ title: data.chatTitle, user: req.user.id })
                res.write(`title: ${JSON.stringify({ title: data.chatTitle, chatId: chat._id })}\n\n`)
                return chat
            }
        } catch (e) {
            console.error("Error in generateTitle:", e);
            throw e;
        }
    }

    const aiStream = async () => {
        const stream = await getAIresponse(messages);

        let AiMessage = "";

        for await (const chunk of stream) {
            const message = chunk[0];
            const textChunk = message?.content || "";

            if (textChunk && message._getType() === "ai") {
                AiMessage += textChunk;
                res.write(`data: ${JSON.stringify({ text: textChunk })}\n\n`);
            }
        }
        return AiMessage;
    }

    const [chat, AIMessage] = await Promise.all([generateTitle(), aiStream()])

    const actualChatId = chatId || chat?._id;
    const userMessageContent = messages[messages.length - 1].content;

    try {
        await Promise.all([
            chatDao.saveMessage({ 
                chatId: actualChatId, 
                sender: "user", 
                content: userMessageContent,
                file: file ? { name: file.name, type: file.type, data: file.data } : null
            }),
            chatDao.saveMessage({ chatId: actualChatId, sender: "ai", content: AIMessage })
        ]);
    } catch (error) {
        console.error("Failed to save messages to DB:", error);
    }

    res.end();
}

export const getChatMessages = async (req, res) => {

    const chatId = req.params.chatId;

    const chats = await chatDao.getChats(chatId);

    if (!chats) {
        return res.status(404).json({ message: "Chat not found" });
    }

    return res.status(200).json({
        success: true,
        chats
    })
}

export const createChat = async (req, res) => {

    const { id } = req.user;
    const { title } = req.body;

    const chat = await chatDao.createChat({ title, user: id })

    return res.status(200).json({
        success: true,
        chat
    })
}

export const getUserChats = async (req, res) => {
    const { id } = req.user;
    const chats = await chatDao.getUserChatsList(id);

    return res.status(200).json({
        success: true,
        chats
    });
}

export const deleteChat = async (req, res) => {

    const { chatId } = req.params;

    const isChatDeleted = await chatDao.deleteChat(chatId);
    console.log(isChatDeleted)

    return res.status(200).json({
        success: true,
        message: "Chat deleted successfully"
    });
}