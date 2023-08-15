import { Categories } from "@/components/categories";
import { SearchInput } from "@/components/search-input";
import { Characters } from "@/components/characters";
import prismadb from "@/lib/prismadb";
import { UserButton } from "@clerk/nextjs";

interface RootPageProps {
    searchParams: {
        categoryId: string;
        name: string;
    }
}

//Getting the search parameters defined by the RootPageProps interface
const RootPage = async ({
    searchParams
}: RootPageProps) => {
    //Using the search parameters of categoryId and name, the database will be searched to return the A.I. characters that match
    //the category and the name that the user inserted
    //The AI characters will be ordered in descending order 
    //The amount of messages the A.I. has generated will also be counted and displayed to the users
    const data = await prismadb.character.findMany({
        where: {
            categoryId: searchParams.categoryId,
            name: {
                search: searchParams.name
            }
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            _count: {
                select: {
                    messages: true
                }
            }
        }
    })

    const categories = await prismadb.category.findMany();

    return (
        <div className="h-full p-4 space-y-2">
            <SearchInput />
            <Categories data={categories} />
            <Characters data={data} />
        </div>);
}

export default RootPage;