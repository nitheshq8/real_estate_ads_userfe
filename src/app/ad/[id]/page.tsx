"use client";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import MYLayout from "@/components/PropertyPage/MYLayout";
import PropertyListing from "@/components/PropertyPage/PropertyListing";
import AdDetailPage from "@/components/AdDetailPage/AdDetailPage";
import { fetchAllCities, fetchPropertiesById, fetchSubscriptionPlanByUserId } from "@/services/api";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
// import AdDetailWithEdit from "@/components/AdDetailPage/MyDetailpage";

export default function Home() {
  const [filters, setFilters] = useState({
    property_type: "",
    city: "",
    reason: "",
    price_min: "",
    price_max: "",
  });

  const [properties, setProperties] = useState([]);
  const [trendingProperties1, setTrendingProperties] = useState([]);
  const [cities, setCities] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAds, setSelectedAds] = useState([]);
  const [mysubscriptionPlan, setMySubscriptionPlan] = useState(null);
  
  /** Fetch Properties */
  const fetchProperties = async () => {
    const accessToken = localStorage.getItem("accessToken");
        const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
    
    try {
      const response = await fetchPropertiesById( { limit: 10, offset: 0, ...filters,user_id:userData.user_id  })
    

      if (response?.ads) {
        setProperties(response.ads);
        setTrendingProperties(response.ads);
      } else {
        throw new Error(response.data?.error?.message || "Failed to fetch properties");
      }
    } catch (error) {
      setError("Error fetching properties.");
      console.error("API Error (Properties):", error);
    }
  };

/** Fetch Cities */
const fetchCities = async () => {
  try {
    const response = await fetchAllCities();

    if (response?.success) {
      setCities(response.data);
    } else {
      throw new Error(
        response.data?.error?.message || "Failed to fetch cities."
      );
    }
  } catch (error) {
    setError("Error fetching cities.");
    console.error("API Error (Cities):", error);
  }
};

const fetchsubscriptionPlan = useCallback(async () => {
  try {
    const response:any = await fetchSubscriptionPlanByUserId();
   setMySubscriptionPlan(response?.data?.result)
      
   
  } catch (error) {
    setError("Error fetching cities.");
    console.error("API Error (Cities):", error);
  }
}, []);

  /** Fetch All Data in Parallel using `Promise.all` */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchProperties(), fetchCities(),fetchsubscriptionPlan()]);
    } catch (error) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  }, []);

  /** Run Fetch Once on Mount & when Filters Change */
  const isFetched = useRef(false);
  const fetchAdDetailsMemoized = useMemo(() => fetchData, []);
  

  useEffect(() => {
      if (!isFetched.current) {
        fetchAdDetailsMemoized();
          isFetched.current = true;
      }
      
  }, [filters]);
  const handleAdChange = useCallback(() => {
    fetchProperties();
  }, [fetchProperties]);

  const toggleSelectAd = (ad: { id: any; }) => {
    setSelectedAds((prev:any) => {
      const exists = prev.find((item: { id: any; }) => item.id === ad.id);
      return exists ? prev.filter((item: { id: any; }) => item.id !== ad.id) : [...prev, ad];
    });
  };
  const router = useRouter();
  return (
    <div>
      <MYLayout properties={trendingProperties1} cities={cities}  selectedAds={selectedAds} isdetailpage={false} handleAdChange={handleAdChange} mysubscriptionPlan={mysubscriptionPlan}>
        {loading && <Loader/>}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        <button
          onClick={() => router.push("/")}
          className="  mr-2 hover:bg-blue-900 min-w-fit hover:text-white p-2 rounded-md"
        >
         <ArrowLeft />
        </button>
        <AdDetailPage cities={cities} setFilters={setFilters} mysubscriptionPlan={mysubscriptionPlan}/> 
        
         {/* <AdDetailWithEdit cities={cities} setFilters={setFilters}/>  */}
         </MYLayout>
    </div>
  );
}
