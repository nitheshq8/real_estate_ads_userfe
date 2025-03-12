"use client"
import { Key, useEffect, useState } from "react";
import PropertyFilters from "./PropertyFilters";
import PropertyCard from "./PropertyCard";
import ShareAdsModal from "./ShareAdsModal";

const PropertiesPage = ({cities,filters, setFilters, toggleSelectAd,properties,handleAdChange,fetchPropertiesWithFilter,mysubscriptionPlan}:any) => {

  
 
 

  return (
    <div className="p-6 ">
      <h1 className="text-2xl font-bold mb-4">Real Estate Listings</h1>

      <PropertyFilters filters={filters} setFilters={setFilters} cities={cities} handleAdChange={handleAdChange} fetchPropertiesWithFilter={fetchPropertiesWithFilter}/>

      <div className="">
        {properties&&properties?.map((property: { id: Key | null | undefined; }) => (
          <div key={property.id} className="border p-4 m-1 rounded  hover:border-blue-600  hover:shadow-2xl ">
            
            <PropertyCard property={property} cities={cities} handleAdChange={handleAdChange} />
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default PropertiesPage;

