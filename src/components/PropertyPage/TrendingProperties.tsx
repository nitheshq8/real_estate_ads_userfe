import { Key } from "react";
import TrendingPropertyCard from "./TrendingPropertyCard";
import { useRouter } from "next/navigation";

const TrendingProperties = ({ properties }: any) => {
  const router = useRouter();
  const handleCardClick = (property : any) => {

    router.push(`/ad/${property.id}`); // Navigate to dynamic route
  };
  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-3">Trending Properties</h2>
        <div className="space-y-4">
          {properties?.length > 0 ? (
            properties?.map((property: { id: Key | null | undefined }) => (
              <TrendingPropertyCard key={property.id} property={property} />
            ))
          ) : (
            <p className="text-gray-500">No trending properties found.</p>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="overflow-x-auto whitespace-nowrap p-4 bg-gray-100">
          <h2 className="text-lg font-bold mb-2">Trending Properties</h2>
          <div className="flex space-x-4">
            {properties?.length > 0 ? (
              properties?.map((property: any, index: Key | null | undefined) => (
                <div key={index}>
                <div
                  key={index}
                  className="inline-block min-w-[200px] p-3 bg-white shadow rounded-lg"
                >
                  <p className="font-semibold">{property?.name}</p>
                  {/* <p className="text-sm text-gray-500">$2,500,000</p> */}
                  <p className="text-gray-500 flex justify-end">
                    View's 👀 :{property?.total_visits}
                  </p>
                  <button
                    className="bg-blue-700 hover:bg-blue-950 text-white px-4 py-2 rounded-lg w-full md:w-auto"
                    onClick={() => handleCardClick(property)}
                  >
                    View more
                  </button>
                </div>
              </div>
              ))
            ) : (
              <p className="text-gray-500">No trending properties available.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TrendingProperties;
