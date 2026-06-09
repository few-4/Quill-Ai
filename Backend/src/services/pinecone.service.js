import { MistralAIEmbeddings } from "@langchain/mistralai";
import config from "../config/config.js";
import { Pinecone } from "@pinecone-database/pinecone";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { v4 as uuidv4 } from 'uuid';

const embeddings = new MistralAIEmbeddings({
    model: "mistral-embed",
    apiKey: config.MISTRAL_API_KEY
});

const pinecone = new Pinecone({ apiKey: config.PINECONE_KEY });

const index = pinecone.Index("kodr-rag-learn");

export async function upsertPDF(pdfPath) {
    try {
        const loader = new PDFLoader(pdfPath, {
            splitPages: true,
        });

        const docs = await loader.load();
        
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1024,
            chunkOverlap: 200,
        });

        const splitDocs = await textSplitter.splitDocuments(docs);
        const vectors = await embeddings.embedDocuments(splitDocs.map((doc) => doc.pageContent));

        const records = vectors.map((vector, index) => ({
            id: uuidv4(),
            values: vector,
            metadata: {
                text: splitDocs[index].pageContent,
                page: splitDocs[index].metadata.loc.pageNumber || 1,
            },
        }));

        await index.upsert(records);
        console.log(`Successfully indexed ${docs.length} pages from ${pdfPath}`);
        return true;
    } catch (error) {
        console.error("Error upserting PDF to Pinecone:", error);
        return false;
    }
}

export async function queryPinecone(query, topK = 2) {
    try {
        const vector = await embeddings.embedQuery(query);
        const queryResult = await index.query({
            vector,
            topK,
            includeMetadata: true,
        });

        return queryResult.matches.map(match => match.metadata?.text || "").join("\n\n---\n\n");
    } catch (error) {
        console.error("Error querying Pinecone:", error);
        return "Failed to retrieve information from internal knowledge base.";
    }
}
