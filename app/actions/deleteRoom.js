'use server';

import { createSessionClient } from "../../config/appwrite";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function deleteRoom(roomId) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("appwrite-session");

    if (!sessionCookie) {
        redirect("/login");
    }

    try {
        const { account, databases } = await createSessionClient(sessionCookie.value);
        
        const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
        const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS;

        // Get user ID
        const user = await account.get();
        const userId = user.$id;
        
        // Fetch users rooms
        const { documents: rooms } = await databases.listDocuments(
            databaseId,
            collectionId,
            [Query.equal("user_id", userId)]
        );
        
        // Find the room to delete
        const roomToDelete = rooms.find((room) => room.$id === roomId);
        
        if (roomToDelete) {
            await databases.deleteDocument(databaseId, collectionId, roomToDelete.$id);

        // Revalidate my rooms and all rooms
        revalidatePath('/Rooms/my', 'layout');
        revalidatePath('/', 'layout');

            return {
                success: true,
            };
        } else {
            return {
                error: 'Room not found',
            };
        }
    } catch (error) {
        console.error("Failed to delete room:", error.message);
        return {
                error: 'Failed to delete room',
        };
    }
}

export default deleteRoom;