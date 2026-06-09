import { ChatMistralAI } from "@langchain/mistralai"
import config from "../config/config.js";
import { createAgent, toolStrategy, tool } from "langchain"
import z from "zod"
import { tavily } from "@tavily/core"
import { queryPinecone } from "./pinecone.service.js";

const mistralModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.MISTRAL_API_KEY,
})

const tvly = tavily({ apiKey: config.TAVILY_API_KEY });

async function search({ query }) {

    const response = await tvly.search(query, {
        searchDepth: "basic",
        maxResults: 3,
    })


    const results = response.results.map(r => r.content)


    return results.join("\n\n --- \n\n")

}

//search tool
const search_tool = tool(
    search,
    {
        name: "search_tool",
        description: "Use this tool to find latest information on the internet. Mandatory to use this tool if you don't have the information about user query.",
        schema: z.object({
            query: z.string().describe("The search query to find information about")
        })
    }
)

//knowledge base tool (RAG)
const knowledge_base_tool = tool(
    async ({ query }) => {
        return await queryPinecone(query);
    },
    {
        name: "knowledge_base_tool",
        description: "Use this tool to retrieve specific sections from uploaded documents or internal knowledge. ALWAYS use this tool first if the user asks about an uploaded PDF, internships, or specific document content.",
        schema: z.object({
            query: z.string().describe("The specific search query to find relevant sections in the document")
        })
    }
)

//Response
export const getAIresponse = async (messages) => {

    const formattedMessages = messages.map(msg => {
        if (msg.file) {
            if (msg.file.type.startsWith("image/")) {
                return {
                    role: msg.role,
                    content: [
                        { type: "text", text: msg.content || "Attached image" },
                        { type: "image_url", image_url: { url: msg.file.data } }
                    ]
                };
            } else {
                return {
                    role: msg.role,
                    content: `${msg.content}\n\n[Attached File: ${msg.file.name} (${msg.file.type})]`
                };
            }
        }
        return msg;
    });

    const agent = createAgent({
        systemPrompt: "You are an AI assistant and your name is Quill Ai. When a user asks about an uploaded document or specific knowledge, use the knowledge_base_tool to retrieve relevant sections. Provide short, concise answers based ONLY on the retrieved information. If the information is not in the knowledge base, say you don't know. Keep your response under 200 words.",
        model: mistralModel,
        tools: [search_tool, knowledge_base_tool]
    })

    const stream = await agent.stream({
        messages: formattedMessages
    }, { streamMode: "messages" })

    return stream;
}

//Title
export async function getTitle({ message }) {

    const titleAgent = createAgent({
        model: mistralModel,
        tools: [],
        responseFormat: toolStrategy(z.object({
            chatTitle: z.string().describe("A concise title for the given message")
        }))
    })

    const response = await titleAgent.invoke({
        messages: [
            {
                role: "user",
                content: `Generate a concise title for the following message: ${message}`
            }
        ],
    })

    return response.structuredResponse

}