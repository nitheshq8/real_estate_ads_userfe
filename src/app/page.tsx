// "use client";
// import { useEffect, useState, useCallback, useRef } from "react";
// import MYLayout from "@/components/PropertyPage/MYLayout";
// import { useRouter, useSearchParams } from "next/navigation";
// import Loader from "@/components/Loader";
// import {  fetchAllCities, fetchAllProperties, getCompanydetails, } from "@/services/api";
// import PropertiesPage from "@/components/PropertyPage/PropertyListing";

// export default function Home() {
//   const searchParams = useSearchParams();
//   const companyParam = searchParams.get("company");
//   // Decode the parameter (if necessary) to remove URL encoding
//   const companyName = companyParam ? decodeURIComponent(companyParam) : "Not provided";
// console.log("companyName",companyName);

//   const [filters, setFilters] = useState({
//     property_type: "",
//     city: "",
//     reason: "",
//     price_min: "",
//     price_max: "",
//   });

//   const [properties, setProperties] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedAds, setSelectedAds] = useState([]);
//   const [page, setPage] = useState(1);
//   const pageSize = 10;
//   const [totalItems, setTotalItems] = useState(0);
  
//   const[companydata,setCompanyData]=useState({
//     "name": "-",
//     "email": "-",
//     "phone": "-",
//     "website": "N/A",
//     "address": "-",
//     "logo": "-"
// })
//   const router = useRouter();
//   const isFetched = useRef(false);

//   const fetchProperties = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await fetchAllProperties(page, pageSize, filters);
//       if (response) {
//         setProperties(response.ads);
//         setTotalItems(response.total || 0);
//       } else {
//         throw new Error(response?.data?.error?.message || "Failed to fetch properties");
//       }
//     } catch (error) {
//     //   setError("Error fetching properties.");
//       console.error("API Error (Properties):", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, filters]);

//   const fetchCities = useCallback(async () => {
//     try {
//       const response = await fetchAllCities();
//       if (response?.success) {
//         setCities(response.data);
//       } else {
//         throw new Error(response?.data?.error?.message || "Failed to fetch cities.");
//       }
//     } catch (error) {
//       setError("Error fetching cities.");
//       console.error("API Error (Cities):", error);
//     }
//   }, []);
//   const fetchcompanydetails = useCallback(async () => {
  
//     const response:any = await getCompanydetails('');
//     console.log("responsegetCompanydetails",response?.data?.result);
    
//     if (response?.data.result.success) {
//       setCompanyData(response.data.result.data)
//     }else {
//       console.log("-------responsegetCompanydetails",response);
//     }
 
// }, []);

//   useEffect(() => {
//     // if (!isFetched.current) {
//          Promise.all([fetchcompanydetails(),fetchProperties(), fetchCities(),]);
//     //   isFetched.current = true;
//     // }
//   }, [fetchProperties, fetchCities,filters]);

//   const handleAdChange = useCallback(() => {
//     fetchProperties();
//   }, [fetchProperties]);

//   // const toggleSelectAd = (ad: { id: any; }) => {
//   //   setSelectedAds((prev:any) => prev.some((item:any) => item.id === ad.id)
//   //     ? prev.filter((item:any) => item.id !== ad.id)
//   //     : [...prev, ad]
//   //   );
//   //   console.log("________",selectedAds);
    
//   // };
//   // const toggleSelectAd = (adOrArray: { id: any } | { id: any }[]) => {
//   //   setSelectedAds((prev: any) => {
//   //     if (Array.isArray(adOrArray)) {
//   //       // Check if all properties are already selected
//   //       const allSelected = properties.length === prev.length;
  
//   //       return allSelected ? [] : properties.map((property: any) => ({ id: property.id }));
//   //     }
  
//   //     // Toggle individual selection
//   //     return prev.some((item: any) => item.id === adOrArray.id)
//   //       ? prev.filter((item: any) => item.id !== adOrArray.id)
//   //       : [...prev, adOrArray];
//   //   });
//   // };
  
//   return (
//     <MYLayout properties={properties} cities={cities} selectedAds={selectedAds} companydata={companydata}>
//       {loading && <p className="text-center text-blue-500 mt-4"><Loader /></p>}
//       {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      
//       <PropertiesPage
//         filters={filters} setFilters={setFilters}
//         properties={properties} cities={cities}
//         handleAdChange={handleAdChange}
//         // toggleSelectAd={toggleSelectAd}
//          selectedAds={selectedAds}
//       />
//         <div className="flex justify-center items-center gap-4 mt-6">
//         {/* Previous Button */}
//         <button
//           onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//           disabled={page <= 1}
//           className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
//         >
//           Previous
//         </button>

//         <span>
//           Page <strong>{page}</strong>
//         </span>

//         {/* Next Button */}
//         <button
//           onClick={() => setPage((prev) => prev + 1)}
//           // disable if we've reached or surpassed total
//           // disabled={(page - 1) * pageSize + adDetails.ad_details.length >= adDetails.total}
//           className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </MYLayout>
//   );
// }


"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import MYLayout from "@/components/PropertyPage/MYLayout";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";
import { 
  fetchadminProperties, 
  fetchadmintredningProperties, 
  fetchAllCities, 
  fetchAllProperties, 
  fetchSubscriptionPlanByUserId 
} from "@/services/api";
import PropertiesPage from "@/components/PropertyPage/PropertyListing";

export default function Home() {
  const [filters, setFilters] = useState({
    property_type: "",
    city: "",
    reason: "",
    price_min: "",
    price_max: "",
  });

  const [properties, setProperties] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAds, setSelectedAds] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalItems, setTotalItems] = useState(0);
  const [mysubscriptionPlan, setMySubscriptionPlan] = useState<any>(null);
  const [tredningProperties, setTredningProperties] = useState([]);
  const[companydata,setCompanyData]=useState({
    "name": "q8coders",
    "email": "",
    "phone": "",
    "website": "N/A",
    "address": "",
    "logo": ""
})
  const router = useRouter();
  const isFetched = useRef(false);

 

  const fetchProperties = useCallback(async () => {
    
    try {
      setLoading(true);
      const response = await fetchAllProperties(page, pageSize, filters);
      if (response) {
        setProperties(response.ads);
        setTredningProperties(response.ads);
        setTotalItems(response.total || 0);
      } else {
        throw new Error(response.data?.error?.message || "Failed to fetch properties");
      }
    } catch (error) {
      console.error("API Error (Properties):", error);
      setError("Error fetching properties.");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  const fetchAdmintredning = useCallback(async () => {
    
    try {
      setLoading(true);
      const response = await fetchadmintredningProperties();
      if (response) {
        setTredningProperties(response.data);
        // Optionally update totalItems if needed for tredning properties pagination
        // setTotalItems(response.total || 0);
      } else {
        throw new Error(response.data?.error?.message || "Failed to fetch properties");
      }
    } catch (error) {
      console.error("API Error (Properties):", error);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  const fetchCities = useCallback(async () => {
    try {
      const response = await fetchAllCities();
      if (response?.success) {
        setCities(response.data);
      } else {
        throw new Error(response.data?.error?.message || "Failed to fetch cities.");
      }
    } catch (error) {
      setError("Error fetching cities.");
      console.error("API Error (Cities):", error);
    }
  }, []);

  const fetchsubscriptionPlan = useCallback(async () => {
    try {
      const response: any = await fetchSubscriptionPlanByUserId();
      setMySubscriptionPlan(response?.data?.result);
    } catch (error) {
      setError("Error fetching subscription plan.");
      console.error("API Error (Subscription Plan):", error);
    }
  }, []);

  useEffect(() => {
    Promise.all([
      fetchProperties(),
      fetchCities(),
      fetchsubscriptionPlan(),
      fetchAdmintredning()
    ]);
  }, [fetchProperties, fetchCities, filters]);

  const handleAdChange = useCallback(() => {
    fetchProperties();
  }, [fetchProperties]);

  const toggleSelectAd = (adOrArray: { id: any, [key: string]: any } | { id: any, [key: string]: any }[]) => {
    setSelectedAds((prev: any) => {
      if (Array.isArray(adOrArray)) {
        const allSelected = properties.length === prev.length;
        return allSelected ? [] : properties.map((property: any) => ({ ...property }));
      }
      return prev.some((item: any) => item.id === adOrArray.id)
        ? prev.filter((item: any) => item.id !== adOrArray.id)
        : [...prev, adOrArray];
    });
  };

  // Calculate total pages based on totalItems and pageSize
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <MYLayout 
    companydata={companydata}
      properties={tredningProperties} 
      cities={cities} 
      selectedAds={selectedAds} 
      // handleAdChange={handleAdChange} 
      // mysubscriptionPlan={mysubscriptionPlan}
    >
      {loading && <p className="text-center text-blue-500 mt-4"><Loader /></p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      
      <PropertiesPage
        filters={filters} 
        setFilters={setFilters}
        properties={properties} 
        cities={cities}
        handleAdChange={handleAdChange}
        toggleSelectAd={toggleSelectAd} 
        selectedAds={selectedAds}
        mysubscriptionPlan={mysubscriptionPlan}
      />

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page <= 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page <strong>{page}</strong> of <strong>{totalPages || 1}</strong>
        </span>
        <button
          onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
          disabled={page >= totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </MYLayout>
  );
}
