"use server";
import { createAdminClient } from "../../config/appwrite";
import checkAuth from "./checkAuth";
import { ID } from "node-appwrite";
import { revalidatePath } from "next/cache";

async function createRoom (previousState, formData) {
    // Get databases instance
    const { databases, storage } = await createAdminClient();

    try{
        const user = await checkAuth();
        if (!user) {
            return {
                error: "You must be logged in to create a room."
            }
        }

        const userId = user.user.id;

        console.log("Creating room for user:", userId);

        // Uploading image to storage
        let imageID;
        
        const image = formData.get("image");

        if (image && image.size >0 && image.name !== "undefined") {
            try{
                // Upload
                const response = await storage.createFile("rooms", ID.unique(), image);
                imageID = response.$id;
            } catch (error) {
                console.log ("Error uploading image", error);
                return {
                    error: "Error uploading image. Please try again."
                };
            }
        } else {
            console.log("No image provided or invalid image.");
        }

        //Create room
        const newRoom = await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
            ID.unique(),
            {
                user_id: userId,
                name: formData.get("name"),
                description: formData.get("description"),
                sqft: formData.get("sqft"),
                capacity: formData.get("capacity"),
                address: formData.get("address"),
                location: formData.get("location"),
                availability: formData.get("availability"),
                amenities: formData.get("amenities"),
                image: imageID
            }
        );

        revalidatePath("/", "layout");

        return {
            success: true
        }
    } catch (error) {
        console.log(error);
        const errorMessage = error.response.message || "An error occurred while creating the room.";
        return {
            error: errorMessage,
        }
    }
}

export default createRoom;