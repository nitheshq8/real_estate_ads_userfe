import Image from "next/image";
import { useRouter } from "next/navigation";

const TrendingPropertyCard = ({ property }:any) => {
  console.log("property=",property);
  const router = useRouter();

  const url =property?.image
  ? `${`data:image/png;base64,${property?.image}`}` : `https://placehold.co/600x400.png?text=${property.name}`
  const handleCardClick = () => {
    router.push(`/ad/${property.id}`); // Navigate to dynamic route
  };
  return (
    <div className="bg-white shadow-md border rounded-xl   hover:border-blue-600 overflow-hidden p-4">
      {/* Property Image */}
      <div className="relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
         <img
          src={url}
         
          alt={property.name}
          className="rounded-t-lg h-60 w-full"
        />
        
      </div>

      {/* Property Details */}
      <div className="mt-3">
        <h3 className="font-bold text-lg">{property.name}</h3>
        <p className="text-gray-500 flex justify-end">
            View's 👀 :{property?.total_visits}
          </p>
        {/* <p className="text-gray-500 text-sm">{property.location}</p> */}
        {/* <p className="text-blue-600 font-semibold text-lg mt-1">
          ${property.price.toLocaleString()}
        </p>
        <p className="text-gray-500 text-sm">
          {property.beds} beds • {property.baths} baths
        </p> */}
           <button
          className="w-full bg-blue-700 hover:bg-blue-950 text-white px-4 py-2 rounded-lg w-full md:w-auto"
          onClick={handleCardClick}
        >
          View more
        </button>
      </div>
    </div>
  );
};

export default TrendingPropertyCard;
