"use client";
import { useUser } from "@clerk/nextjs";
import { Menu, Sparkles } from "lucide-react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { UserButton, redirectToSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { MobileSidebar } from "./mobile-sidebar";
import Image from "next/image";

const font = Poppins({
    weight: "600",
    subsets: ["latin"]

});

export const Navbar = () => {
    const { isSignedIn } = useUser();
    return (
        <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16">
            <div className="flex items-center">
                <MobileSidebar />
                <Link href="/">
                    {/*<h1 className={cn("hidden md:block text-xl md:text-3xl font-bold text-primary", font.className)}>
                        Zamp Ai
                    </h1>*/}
                    {/*<h1 className="hidden md:block">
                        <Image src="/logo.png" alt="Zamp Ai" width={300} height={70} />
                    </h1>*/}
                    <div className="hidden md:block cursor-pointer" role="link" tabIndex={0}>
                        <Image src="/logo.png" alt="ZampAi" width={250} height={50} className="align-middle" />
                    </div>
                </Link>
            </div>
            <div className="flex items-center gap-x-3">
                <Button variant="premium2" size="sm">
                    Premium
                    <Sparkles className="h-4 w-4 fill-white text-white ml-2" />
                </Button>
                <ModeToggle />
                {isSignedIn ? (
                    <UserButton afterSignOutUrl="/" /> // Display UserButton if the user is signed in
                ) : (
                    <Link href="/sign-in" passHref>
                        <Button as="a" variant="premium2" size="sm">
                            Sign In
                        </Button>
                    </Link> // Display Sign In button if the user is not signed in
                )}
            </div>
        </div>
    );
};
