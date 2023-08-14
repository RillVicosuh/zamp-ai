import { redirect } from "next/navigation";
import { auth, redirectToSignIn } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
//import { checkSubscription } from "@/lib/subscription";

import { CharacterForm } from "./components/character-form";

interface CharacterIdPageProps {
    params: {
        companionId: string;
    };
};

const CharacterIdPage = async ({
    params
}: CharacterIdPageProps) => {
    const { userId } = auth();

    if (!userId) {
        return redirectToSignIn();
    }

    /*const validSubscription = await checkSubscription();
  
    if (!validSubscription) {
      return redirect("/");
    }*/

    const character = await prismadb.character.findUnique({
        where: {
            id: params.companionId,
            userId,
        }
    });

    const categories = await prismadb.category.findMany();

    return (
        <CharacterForm initialData={character} categories={categories} />
    );
}

export default CharacterIdPage;