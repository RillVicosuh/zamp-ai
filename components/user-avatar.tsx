"use client";

import { useUser } from "@clerk/nextjs";

import { Avatar, AvatarImage } from "@/components/ui/avatar"

//Creating an user image component to display users image in the chat feed with the A.I. character
export const UserAvatar = () => {
    const { user } = useUser();

    return (
        <Avatar className="h-12 w-12">
            <AvatarImage src={user?.imageUrl} />
        </Avatar>
    );
};