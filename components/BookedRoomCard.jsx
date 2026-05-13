import Heading from "./Heading";
import CancelBookingButton from "./CancelBookingButton";

const BookedRoomCard = ({ booking }) => {
    const roomId = booking.room_id;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        
        const options = { month: "short"};
        const month = date.toLocaleString("en-MY", options, { timeZone: "UTC" });

        // Get day 
        const day = date.getUTCDate();

        // Format time in UTC 12-hour
        const timeOptions = {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
            timeZone: "Asia/Kuala_Lumpur"
        };

        const time = date.toLocaleString("en-MY", timeOptions);

        // Final formatted date
        return `${month} ${day} at ${time}`;
        }

    return (
        <div className="bg-white shadow rounded-lg p-4 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <h4 className="text-lg font-semibold">{booking.room_name || "Room"}</h4>
                <p className="text-sm text-gray-600">
                    <strong>Check In:</strong> {formatDate(booking.check_in)}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Check Out:</strong> {formatDate(booking.check_out)}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row w-full sm:w-auto sm:space-x-2 mt-2 sm:mt-0">
                <a href={`/Rooms/${roomId}`} className="bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-blue-700">
                    View Room
                </a>
                <CancelBookingButton bookingId={booking.$id} />
            </div>
        </div>
    );
}

export default BookedRoomCard;