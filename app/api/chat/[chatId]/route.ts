import dotenv from "dotenv";
import { StreamingTextResponse, LangChainStream } from "ai";
import { auth, currentUser } from "@clerk/nextjs";
import { Replicate } from "langchain/llms/replicate";
import { CallbackManager } from "langchain/callbacks";
import { NextResponse } from "next/server";

import { MemoryManager } from "@/lib/memory";
import { rateLimit } from "@/lib/rate-limit";
import prismadb from "@/lib/prismadb";

dotenv.config({ path: `.env` });

export async function POST(
    request: Request,
    { params }: { params: { chatId: string } }
) {
    try {
        //Retreiving the message and the user that sent submitted the message to the A.I. character
        const { prompt } = await request.json();
        const user = await currentUser();

        //Ensuring the user is valid
        if (!user || !user.firstName || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        //Creating a unique identifier for the user
        const identifier = request.url + "-" + user.id;
        //Seeing if the user exceeded the ratelimit
        const { success } = await rateLimit(identifier);

        //If the rate limit is exceeded, return this message
        if (!success) {
            return new NextResponse("Rate limit exceeded", { status: 429 });
        }

        //Inserting the message that was sent to the A.I. character in the database
        //Here we are storing the messages in the prisma database, but it is not the database that the A.I. will use to generate a message
        //This is just the database we use to store the messages to retrieve them and show to the user in the chat
        const character = await prismadb.character.update({
            where: {
                id: params.chatId
            },
            data: {
                messages: {
                    create: {
                        content: prompt,
                        role: "user",
                        userId: user.id,
                    },
                },
            }
        });

        if (!character) {
            return new NextResponse("Companion not found", { status: 404 });
        }

        const name = character.id;
        const character_file_name = name + ".txt";

        //Creating a character key using the name, id, and model
        const characterKey = {
            characterName: name!,
            userId: user.id,
            modelName: "llama2-13b",
        };

        //Using memory manager created with Redis and Pinecone
        const memoryManager = await MemoryManager.getInstance();

        //Getting the recent conversation history between the A.I. and the user
        const records = await memoryManager.readLatestHistory(characterKey);

        //If there is no conversation history between the A.I. and the user, update the seed chat history in the data base to include the seed that was used to create the character
        if (records.length === 0) {
            await memoryManager.seedChatHistory(character.seed, "\n\n", characterKey);
        }
        //Adding every message from the use into the history in the database
        await memoryManager.writeToHistory("User: " + prompt + "\n", characterKey);

        // Query Pinecone. The Pinecone database is what will be used to store the messages that the ai will use 

        const recentChatHistory = await memoryManager.readLatestHistory(characterKey);

        // The preamble is included in the similarity search, but that isn't an issue

        const similarDocs = await memoryManager.vectorSearch(
            recentChatHistory,
            character_file_name
        );

        //Creating the relevant history that will be used in the ai api call to generate the message
        let relevantHistory = "";
        if (!!similarDocs && similarDocs.length !== 0) {
            relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
        }
        const { handlers } = LangChainStream();

        // Call Replicate for inference. Creating the A.I. model
        const model = new Replicate({
            model:
                "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
            input: {
                max_length: 2048,
            },
            apiKey: process.env.REPLICATE_API_TOKEN,
            callbackManager: CallbackManager.fromHandlers(handlers),
        });

        // Turn verbose on for debugging purposes
        model.verbose = true;

        //Generating the response from the A.I. model
        const resp = String(
            await model
                .call(
                    `
        ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${character.name}: prefix. 

        ${character.instructions}

        Below are relevant details about ${character.name}'s past and the conversation you are in.
        ${relevantHistory}


        ${recentChatHistory}\n${character.name}:`
                )
                .catch(console.error)
        );

        //Cleaning up the response from the A.I.
        const cleaned = resp.replaceAll(",", "");
        const chunks = cleaned.split("\n");
        const response = chunks[0];

        //Writing the response to the Pinecone database
        await memoryManager.writeToHistory("" + response.trim(), characterKey);
        var Readable = require("stream").Readable;

        //Making the response readabale
        let s = new Readable();
        s.push(response);
        s.push(null);

        //Writing the response to the prisma database
        if (response !== undefined && response.length > 1) {
            memoryManager.writeToHistory("" + response.trim(), characterKey);

            await prismadb.character.update({
                where: {
                    id: params.chatId
                },
                data: {
                    messages: {
                        create: {
                            content: response.trim(),
                            role: "system",
                            userId: user.id,
                        },
                    },
                }
            });
        }

        return new StreamingTextResponse(s);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
};