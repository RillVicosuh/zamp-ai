import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
//import { checkSubscription } from "@/lib/subscription";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const user = await currentUser();
        //retrieve theses elements of the AI character
        const { src, name, description, instructions, seed, categoryId } = body;

        //Can only continue if the user is a valid user
        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        //All the fields of the A.I character must be filled
        if (!src || !name || !description || !instructions || !seed || !categoryId) {
            return new NextResponse("Missing required fields", { status: 400 });
        };

        /*const isPro = await checkSubscription();
    
        if (!isPro) {
          return new NextResponse("Pro subscription required", { status: 403 });
        }*/

        //Create the actual character in the database
        const character = await prismadb.character.create({
            data: {
                categoryId,
                userId: user.id,
                userName: user.firstName,
                src,
                name,
                description,
                instructions,
                seed,
            }
        });

        return NextResponse.json(character);
    } catch (error) {
        console.log("[CHARACTER_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};