"use server";

import { createSessionClient } from "../../config/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import checkAuth from "./checkAuth";

async function cancelBooking(bookingId) {
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
                error: "You are not logged in. Please log in to cancel a booking.",
            }
        }

        const userId = user.user.id;
        
        // Get the booking
        const booking = await databases.getDocument(
            databaseId,
            collectionId,
            bookingId
        );

        // Check if booking belongs to user
        if (booking.user_id !== userId) {
            return {
                error: "You are not the owner of this booking."
            };
        }

        // Delete the booking
        await databases.deleteDocument(
            databaseId,
            collectionId,
            bookingId
        );

        revalidatePath("/bookings", "layout");

        return{
            success: true
        };

    } catch (error) {
        console.error("Failed to cancel booking:", error.message);
        return {
            error: "Failed to cancel booking"
        };
    }
}

export default cancelBooking;