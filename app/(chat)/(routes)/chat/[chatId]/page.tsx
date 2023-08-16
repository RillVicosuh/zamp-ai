import { redirect } from "next/navigation";
import { auth, redirectToSignIn } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

import { ChatClient } from "./components/client";

interface ChatIdPageProps {
    params: {
        chatId: string;
    }
}

const ChatIdPage = async ({
    params
}: ChatIdPageProps) => {
    const { userId } = auth();

    //If the user is not signed in or have an account, redirect them to sign in
    if (!userId) {
        return redirectToSignIn();
    }

    //Retrieve the A.I. character for the user to interact with and include only all the messages between the user and the A.I. character and put them in ascending order
    //It'll also get the total amount of messages that this A.I. has generated
    const character = await prismadb.character.findUnique({
        where: {
            id: params.chatId
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc"
                },
                where: {
                    userId,
                },
            },
            _count: {
                select: {
                    messages: true,
                }
            }
        }
    });


    //If the character does not exist, redirect to the home page
    if (!character) {
        return redirect("/");
    }

    return (
        <ChatClient character={character} />
    );
}

export default ChatIdPage;