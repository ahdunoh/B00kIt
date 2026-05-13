"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { redirect } from "next/navigation";
import checkAuth from "../actions/checkAuth";
import { revalidatePath } from "next/cache";

async function bookRoom(previousState, formData) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("appwrite-session");

    if (!sessionCookie) {
        redirect("/login");
    }

    try {
        const { databases } = await createSessionClient(sessionCookie.value);
        
        const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
        const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS;

        // Get user ID
        const user = await checkAuth();

        if (!user) {
            return {
                error: "You are not logged in. Please log in to book a room.",
            }
        }

        // Extract the date and time from the form data
        const checkInDate = formData.get("check_in_date");
        const checkInTime = formData.get("check_in_time");
        const checkOutDate = formData.get("check_out_date");
        const checkOutTime = formData.get("check_out_time");

        // Combine date and time into a standard time format (e.g., ISO string)
        const checkInDateTime = `${checkInDate}T${checkInTime}`;
        const checkOutDateTime =`${checkOutDate}T${checkOutTime}`;

        const bookingDate = {
            check_in: checkInDateTime,
            check_out: checkOutDateTime,
            user_id: user.$id,
            room_id: formData.get("room_id")
        }

        // Create Booking
        const newBooking = await databases.createDocument(
            databaseId,
            collectionId,
            ID.unique(),
            bookingDate
        );
        
        // Revalidate cache
        revalidatePath("/bookings", "layout");

        return{
            success: true
        };

    } catch (error) {
        console.error("Failed to book room:", error.message);
        return {
            error: "Failed to book room. Please try again."
        };
    }
}

export default bookRoom;