"use server";

import { createAdminClient } from "../../config/appwrite";

async function getAllRooms() {
    try {
        const { databases } = await createAdminClient();
        
        const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
        const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS;
        
        // Fetch all rooms
        const { documents: rooms } = await databases.listDocuments(
            databaseId,
            collectionId
        );
        
        return rooms;
        
    } catch (error) {
        console.error("Failed to get rooms:", error.message);
        return [];
    }
}

export default getAllRooms;