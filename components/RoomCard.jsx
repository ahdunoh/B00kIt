import Image from "next/image";

const RoomCard = ({ room }) => {
  const bucketID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
  
  const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;

    // Determine the image source
    let imageSrc;
    if (room.image) {
      // Use Appwrite storage URL for uploaded images
      imageSrc = `https://cloud.appwrite.io/v1/storage/buckets/${bucketID}/files/${room.image}/view?project=${projectID}`;
    } else {
      // Use local image from public folder with absolute path
      imageSrc = "/assets/images/no-image.jpg"; // ✅ Starts with / (absolute path)
    }

  return ( 
    <div className="bg-white shadow rounded-lg p-4 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="flex flex-col sm:flex-row sm:space-x-4">
        <Image
          src={imageSrc}
          alt={room.name}
          width = "128"
          height = "128"
          className="w-full sm:w-32 sm:h-32 mb-3 sm:mb-0 object-cover rounded-lg"/>
        <div className="space-y-1">
          <h4 className="text-lg font-semibold">{room.name}</h4>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800"> Address:</span> 555
              {room.address}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800"> Availability:</span>
              {room.availability}
            </p>
          </div>
        </div>
      <div className="flex flex-col sm:flex-row w-full sm:w-auto sm:space-x-2 mt-2 sm:mt-0">
        <a href={`/Rooms/${room.$id}`} className="bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-blue-700">View Room</a>
      </div>
    </div>);
};

export default RoomCard;