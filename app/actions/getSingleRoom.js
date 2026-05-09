'use server';

import { createAdminClient } from "@/config/appwrite";

async function getSingleRoom(id) {
    try {
        const { databases } = await createAdminClient();
        
        const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
        const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS;
        
        // Fetch the specific room
        const room = await databases.getDocument(
            databaseId,
            collectionId,
            id
        );
        
        return room;
        
    } catch (error) {
        console.error("Failed to get room:", error.message);
        return null;
    }
}

export default getSingleRoom;