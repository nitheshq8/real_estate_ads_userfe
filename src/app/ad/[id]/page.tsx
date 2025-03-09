// "use client";
// import { useEffect, useState, useCallback, useRef, useMemo } from "react";
// import MYLayout from "@/components/PropertyPage/MYLayout";
// import PropertyListing from "@/components/PropertyPage/PropertyListing";
// import AdDetailPage from "@/components/AdDetailPage/AdDetailPage";
// import { fetchAllCities, fetchAllProperties, fetchPropertiesById, getCompanydetails } from "@/services/api";
// import Loader from "@/components/Loader";
// import { useRouter } from "next/navigation";
// import { ArrowLeft } from "lucide-react";

// export default function Home() {
//   const [filters, setFilters] = useState({
//     property_type: "",
//     city: "",
//     reason: "",
//     price_min: "",
//     price_max: "",
//   });

//   const [properties, setProperties] = useState([]);
//   const [trendingProperties1, setTrendingProperties] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [propertyTypes, setPropertyTypes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedAds, setSelectedAds] = useState([]);
//   const [page, setPage] = useState(1);
//   const pageSize = 10;
//   const[companydata,setCompanyData]=useState({
//     "name": "-",
//     "email": "-",
//     "phone": "-",
//     "website": "N/A",
//     "address": "-",
//     "logo": "-"
// })
//   /** Fetch Properties */
//   const fetchProperties = async () => {
//     const accessToken = localStorage.getItem("accessToken");
//         const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
    
//     try {
//       const response = await fetchAllProperties(page, pageSize, filters);
    

//       if (response?.ads) {
//         setProperties(response.ads);
//         setTrendingProperties(response.ads);
//       } else {
//         throw new Error(response.data?.error?.message || "Failed to fetch properties");
//       }
//     } catch (error) {
//       setError("Error fetching properties.");
//       console.error("API Error (Properties):", error);
//     }
//   };

// /** Fetch Cities */
// const fetchCities = async () => {
//   try {
//     const response = await fetchAllCities();

//     if (response?.success) {
//       setCities(response.data);
//     } else {
//       throw new Error(
//         response.data?.error?.message || "Failed to fetch cities."
//       );
//     }
//   } catch (error) {
//     setError("Error fetching cities.");
//     console.error("API Error (Cities):", error);
//   }
// };

// const fetchcompanydetails = useCallback(async () => {
  
//   const response:any = await getCompanydetails('');
//   console.log("responsegetCompanydetails",response.data.result);
  
//   if (response?.data.result.success) {
//     setCompanyData(response.data.result.data)
//   }else {
//     console.log("-------responsegetCompanydetails",response);
//   }

// }, []);

//   /** Fetch All Data in Parallel using `Promise.all` */
//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       await Promise.all([fetchProperties(),fetchcompanydetails(), fetchCities()]);
//     } catch (error) {
//       setError("Error fetching data.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   /** Run Fetch Once on Mount & when Filters Change */
//   const isFetched = useRef(false);
//   const fetchAdDetailsMemoized = useMemo(() => fetchData, []);
  

//   useEffect(() => {
//     console.log("");
    
//       if (!isFetched.current) {
//         fetchAdDetailsMemoized();
//           isFetched.current = true;
//       }
      
//   }, [filters]);
//   const handleAdChange = useCallback(() => {
//     fetchProperties();
//   }, [fetchProperties]);

//   const toggleSelectAd = (ad: { id: any; }) => {
//     setSelectedAds((prev:any) => {
//       const exists = prev.find((item: { id: any; }) => item.id === ad.id);
//       return exists ? prev.filter((item: { id: any; }) => item.id !== ad.id) : [...prev, ad];
//     });
//   };
//   const router = useRouter();
//   return (
//     <div>
//       <MYLayout properties={trendingProperties1} cities={cities}  selectedAds={selectedAds} isdetailpage={false} handleAdChange={handleAdChange} companydata={companydata}>
//         {loading && <Loader/>}
//         {error && <p className="text-center text-red-500 mt-4">{error}</p>}
//         <button
//           onClick={() => router.push("/")}
//           className="  mr-2 hover:bg-green-900 min-w-fit hover:text-white p-2 rounded-md"
//         >
//          <ArrowLeft />
//         </button>
//         <AdDetailPage cities={cities} setFilters={setFilters} fetchProperties={fetchProperties}/> 
//          </MYLayout>
//     </div>
//   );
// }
"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import MYLayout from "@/components/PropertyPage/MYLayout";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import {  fetchAllCities, fetchAllProperties, getCompanydetails, getCompanydetailsBytoken, } from "@/services/api";
import PropertiesPage from "@/components/PropertyPage/PropertyListing";
import AdDetailPage from "@/components/AdDetailPage/AdDetailPage";

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
  
  const[companydata,setCompanyData]=useState({
    "name": "-",
    "email": "-",
    "phone": "-",
    "website": "N/A",
    "address": "-",
    "logo": "-"
})
  const router = useRouter();
  const isFetched = useRef(false);

  const fetchProperties = useCallback(async () => {
   

    try {
      setLoading(true);
      const response = await fetchAllProperties(page, pageSize, filters);
      if (response) {
        setProperties(response.ads);
        setTotalItems(response.total || 0);
      } else {
        throw new Error(response.data?.error?.message || "Failed to fetch properties");
      }
    } catch (error) {
    //   setError("Error fetching properties.");
      console.error("API Error (Properties):", error);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);


  const fetchcompanydetails = useCallback(async () => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
console.log("userData",userData);

    const response:any = await getCompanydetailsBytoken({
      "user_id": userData?.user_id |1,
  });
    console.log("responsegetCompanydetails",response.data.result);
    
    if (response?.data.result.success) {
      setCompanyData(response.data.result.data)
    }else {
      console.log("-------responsegetCompanydetails",response);
    }
 
}, []);

  useEffect(() => {
    if (!isFetched.current) {
         fetchcompanydetails();
      isFetched.current = true;
    }
  }, [fetchcompanydetails]);
 
  useEffect(() => {
    if(filters.property_type){

      fetchProperties();
    }
  }, [filters]);
 

  // const toggleSelectAd = (ad: { id: any; }) => {
  //   setSelectedAds((prev:any) => prev.some((item:any) => item.id === ad.id)
  //     ? prev.filter((item:any) => item.id !== ad.id)
  //     : [...prev, ad]
  //   );
  //   console.log("________",selectedAds);
    
  // };
  // const toggleSelectAd = (adOrArray: { id: any } | { id: any }[]) => {
  //   setSelectedAds((prev: any) => {
  //     if (Array.isArray(adOrArray)) {
  //       // Check if all properties are already selected
  //       const allSelected = properties.length === prev.length;
  
  //       return allSelected ? [] : properties.map((property: any) => ({ id: property.id }));
  //     }
  
  //     // Toggle individual selection
  //     return prev.some((item: any) => item.id === adOrArray.id)
  //       ? prev.filter((item: any) => item.id !== adOrArray.id)
  //       : [...prev, adOrArray];
  //   });
  // };
  
  return (
    <MYLayout properties={properties} cities={cities} selectedAds={selectedAds} companydata={companydata}>
      {/* {loading && <p className="text-center text-blue-500 mt-4"><Loader /></p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
       */}
             <AdDetailPage cities={cities} setFilters={setFilters} fetchProperties={fetchProperties}/> 
              
    </MYLayout>
  );
}
