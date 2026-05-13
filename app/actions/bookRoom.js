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

        // Validate all fields are present
        if (!checkInDate || !checkInTime || !checkOutDate || !checkOutTime || !roomId) {
            return { error: "All fields are required." };
        }

        // Create DateTime objects for validation
        const checkInDateTime = new Date(`${checkInDate}T${checkInTime}:00`);
        const checkOutDateTime = new Date(`${checkOutDate}T${checkOutTime}:00`);
        const now = new Date();

        // Server-side date validation
        if (checkInDateTime < now) {
            return { error: "Check-in date and time cannot be in the past." };
        }

        if (checkOutDateTime <= checkInDateTime) {
            return { error: "Check-out must be after check-in." };
        }

        // Check duration (max 30 days)
        const durationMs = checkOutDateTime - checkInDateTime;
        const maxDurationMs = 30 * 24 * 60 * 60 * 1000;
        if (durationMs > maxDurationMs) {
            return { error: "Booking duration cannot exceed 30 days." };
        }

        // Check room availability
        const isAvailable = await checkRoomAvailability(roomId, checkInDateTime.toISOString(), checkOutDateTime.toISOString());
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