"use client"
import { Key, useEffect, useState } from "react";
import PropertyFilters from "./PropertyFilters";
import PropertyCard from "./PropertyCard";
import ShareAdsModal from "./ShareAdsModal";

// filters,setFilters,properties,
const PropertiesPage = ({cities,filters, setFilters, selectedAds,properties,handleAdChange,fetchPropertiesWithFilter}:any) => {
  // const [filters, setFilters] = useState({
  //   property_type: "",
  //   city: "",
  //   reason: "",
  //   price_min: "",
  //   price_max: "",
  // });

  // const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);


  // const toggleSelectAd = (adId) => {
  //   setSelectedAds((prev) =>
  //     prev.includes(adId) ? prev.filter((id) => id !== adId) : [...prev, adId]
  //   );
  // };
 
  const [selectAll, setSelectAll] = useState(false);
  
 
  // const handleSelectAll = () => {
  //   if (selectedAds.length === properties.length) {
  //     toggleSelectAd([]); // Deselect all ads
  //     setSelectAll(false);
  //   } else {
  //     toggleSelectAd(properties); // Select all ads
  //     setSelectAll(true);
  //   }
  // };
  
 

  return (
    <div className="p-6 ">
      <h1 className="text-2xl font-bold mb-4">Real Estate Listings</h1>

      <PropertyFilters filters={filters} setFilters={setFilters} cities={cities} handleAdChange={handleAdChange} fetchPropertiesWithFilter={fetchPropertiesWithFilter}/>
<div className="m-2">
  

{/* <div className="flex justify-around mb-2">
<ShareAdsModal selectedAds={selectedAds} />
        <button
          className="bg-gray-400 w-full ml-2 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
          onClick={handleSelectAll}
        >
          {selectAll ? "Deselect All" : "Select All"}
        </button>
      </div> */}

</div>
      <div className="">
        {properties&&properties?.map((property: { id: Key | null | undefined; }) => (
          <div key={property.id} className="border p-4 m-1 rounded  hover:shadow-2xl ">
            {/* <input
              type="checkbox"
             
      // checked={selectedAds.some((ad: { id: Key | null | undefined; }) => ad.id === property.id)}
      checked={selectedAds.some((ad: any) => ad.id === property.id)}
      onChange={() => toggleSelectAd(property)}
              className="mr-2"
            /> */}
            <PropertyCard property={property} cities={cities} handleAdChange={handleAdChange} />
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default PropertiesPage;

