"use client";
import { toast } from "react-toastify";
import cancelBooking from "../app/actions/cancelBookings";

const CancelBookingButton = ({ bookingId }) => {
    const handleCancelBooking = async () => {
        if (!confirm("Are you sure you want to cancel this booking?")) {
            return;
        }

        try {
            const result = await cancelBooking(bookingId);

            if (result.success) {
                toast.success("Booking cancelled successfully!");
            }
        } catch (error) {
            console.log("Failed to concel booking", error);
            return {
                error: "Failed to cancel booking",
            };
        }
    }

    return (
        <button onClick={handleCancelBooking} className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-red-700">
            Cancel Booking
        </button>
    );
}

export default CancelBookingButton;