"use server";

import { createSessionClient } from "../../config/appwrite";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { redirect } from "next/navigation";
import checkAuth from "../actions/checkAuth";
import { revalidatePath } from "next/cache";
import checkRoomAvailability from "./checkRoomAvailability";

async function bookRoom(previousState, formData) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("appwrite-session");

    if (!sessionCookie) {
        redirect("/login");
    }

    try {
        const { databases } = await createSessionClient(sessionCookie.value);
        
        const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
        const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS;

        // Get user ID
        const user = await checkAuth();
        if (!user) {
            return {
                error: "You are not logged in. Please log in to book a room.",
            }
        }

        const userId = user.user.id;

        // Extract the date and time from the form data
        const checkInDate = formData.get("check_in_date");
        const checkInTime = formData.get("check_in_time");
        const checkOutDate = formData.get("check_out_date");
        const checkOutTime = formData.get("check_out_time");
        const roomId = formData.get("room_id");

        // Combine date and time into a standard time format (e.g., ISO string)
        const checkInDateTime = `${checkInDate}T${checkInTime}`;
        const checkOutDateTime =`${checkOutDate}T${checkOutTime}`;

        // Check room availability
        const isAvailable = await checkRoomAvailability(roomId, checkInDateTime, checkOutDateTime);
        if (!isAvailable) {
            return {
                error: "Room is not available for the selected dates."
            };
        }

        const bookingDate = {
            check_in: checkInDateTime,
            check_out: checkOutDateTime,
            user_id: userId,
            room_id: roomId,
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