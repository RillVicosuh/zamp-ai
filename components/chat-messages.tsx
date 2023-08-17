"use client";

import { ElementRef, useEffect, useRef, useState } from "react";
import { Character } from "@prisma/client";

import { ChatMessage, ChatMessageProps } from "@/components/chat-message";

interface ChatMessagesProps {
    messages: ChatMessageProps[];
    isLoading: boolean;
    character: Character
}

export const ChatMessages = ({
    messages = [],
    isLoading,
    character,
}: ChatMessagesProps) => {
    const scrollRef = useRef<ElementRef<"div">>(null);

    //Creates a fake loading signal if the A.I. character is generating it's first message
    const [fakeLoading, setFakeLoading] = useState(messages.length === 0 ? true : false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFakeLoading(false);
        }, 1000);

        return () => {
            clearTimeout(timeout);
        }
    }, []);

    //Everytime a new message is generated, this executes and scrolls down to the message.
    useEffect(() => {
        scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    //Generates the initial message for the A.I. character, which is the introduction message
    //Then, all the messages between the A.I. character and the user are displayed
    //Also, while the A.I. character is generating a message and it is loading, a loading signal wil display
    return (
        <div className="flex-1 overflow-y-auto pr-4">
            <ChatMessage
                isLoading={fakeLoading}
                src={character.src}
                role="system"
                content={`Hello, I am ${character.name}, ${character.description}`}
            />
            {messages.map((message) => (
                <ChatMessage
                    key={message.content}
                    src={character.src}
                    content={message.content}
                    role={message.role}
                />
            ))}
            {isLoading && (
                <ChatMessage
                    src={character.src}
                    role="system"
                    isLoading
                />
            )}
            <div ref={scrollRef} />
        </div>
    );
};