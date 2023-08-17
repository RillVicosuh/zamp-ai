import { Avatar, AvatarImage } from "@/components/ui/avatar"

interface BotAvatarProps {
    src: string;
};

//Creating an avatar image component to display avatar in the chat header, along with the messages
export const BotAvatar = ({
    src
}: BotAvatarProps) => {
    return (
        <Avatar className="h-12 w-12">
            <AvatarImage src={src} />
        </Avatar>
    );
};