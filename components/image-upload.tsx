"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CldUploadButton } from "next-cloudinary";

import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";

interface ImageUploadProps {
    value: string;
    onChange: (src: string) => void;
    disabled?: boolean;
}


//This component will allow for an image to be uploaded to represent the AI character
export const ImageUpload = ({
    value,
    onChange,
    disabled,
}: ImageUploadProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    //This will execute only if the server side has not finished loading.
    if (!isMounted) {
        return false;
    }

    //An svg of an empty image will be placed and it will be clickable using the CldUploadButton
    //Once image is uploaded and populates the value variable, it will display on the screen
    return (
        <div className="space-y-4 w-full flex flex-col justify-center items-center">

            <CldUploadButton options={{ maxFiles: 1 }} onUpload={(result: any) => onChange(result.info.secure_url)} uploadPreset="yvoencrq">
                <div
                    className="
                        p-4 
                        border-4 
                        border-dashed
                        border-primary/10 
                        rounded-lg 
                        hover:opacity-75 
                        transition 
                        flex 
                        flex-col 
                        space-y-2 
                        items-center 
                        justify-center
                    "
                >
                    <div className="relative h-40 w-40">
                        <Image
                            fill
                            alt="Upload"
                            src={value || "/placeholder.svg"}
                            className="rounded-lg object-cover"
                        />
                    </div>
                </div>
            </CldUploadButton>
        </div>
    );
};