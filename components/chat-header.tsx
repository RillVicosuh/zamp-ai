"use client"

import { Character, Message } from "@prisma/client";

interface ChatHeaderProps {
    character: Character & {
        messages: Message[];
        _count: {
            messages: number;
        };
    };
};

export const ChatHeader = ({
    character,
}: ChatHeaderProps) => {

    return (
        <div>
            Chat Header
        </div>
    )
}