import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
    console.error("Please provide the port number");
    process.exit(1);
}

if (!process.env.MONGO_URI) {
    console.error("Please provide MONGO_URI");
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error("Please provide JWT_SECRET");
    process.exit(1);
}

if(!process.env.MISTRAL_API_KEY) {
    console.error("Please provide MISTRAL_API_KEY");
}

if(!process.env.TAVILY_API_KEY) {
    console.error("Please provide TAVILY_API_KEY");
}

if(!process.env.PINECONE_KEY) {
    console.error("Please provide PINECONE_KEY");
}

const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
    TAVILY_API_KEY: process.env.TAVILY_API_KEY,
    PINECONE_KEY: process.env.PINECONE_KEY
}

export default config;