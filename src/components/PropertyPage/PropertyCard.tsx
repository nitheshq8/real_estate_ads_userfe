

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteAds } from "@/services/api";

const PropertyCard = ({ property, cities ,handleAdChange}: any) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Get the "company" query parameter, if available
  const companyQuery = searchParams.get("company");

  const handleCardClick = () => {
    router.push(`/ad/${property.id}`);
    

    if (companyQuery) {
      // If on portal, append the ad id to the current query param
      // For example: /portal?company=my company/ad/123
      router.push(`/ad/${property.id}/portal?company=${encodeURIComponent(companyQuery)}`);
    } else {
      // Otherwise navigate to /ad/{id} directly
      router.push(`/ad/${property.id}`);
    }


    // Navigate to dynamic route
  };
  const stripHtmlTags = (html: string) => {
    return   html ? html?.replace(/<[^>]*>/g, ""):''// ✅ Removes all HTML tags
  };
 
  return (
    <div className="bg-white w-auto   rounded-lg overflow-hidden">
      {/* Image */}
      <div className="relative w-full h-64">
        <img
          src={
            property?.image
              ? `data:image/png;base64,${property?.image}`
              : `https://placehold.co/600x400.png?text=${property.name}`
          }
          alt={property.name}
          className="rounded-t-lg h-60 w-full"
        />
           <p className="text-gray-500 flex justify-end">
            View's 👀 :{property?.total_visits}
          </p>
      </div>

      {/* Property Info */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">{property.name}</h3>
       
        </div>
        <p className="text-gray-600">{property.location}</p>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-2">{stripHtmlTags(property.description)}</p>

        <p className="text-gray-600"> Created By: {property?.created_by?.company_id}
          </p>

        {/* Additional Info */}
        {/* <p className="text-sm text-gray-500 mt-2">
          City:{property.city} property: {property.property_type} {" "}
          reason:{property.reason} sq ft
        </p> */}

{/* Price and CTA */}
<div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 space-y-2 md:space-y-0 md:space-x-4">
  <p className="text-xl font-bold w-full md:w-auto">${property.price}</p>
  <button
    className="bg-blue-700 hover:bg-blue-950 text-white px-4 py-2 rounded-lg w-full md:w-auto"
    onClick={handleCardClick}
  >
    View more
  </button>
 
</div>


      </div>
    </div>
  );
};

export default PropertyCard;
