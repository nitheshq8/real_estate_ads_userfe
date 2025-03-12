// "use client"
// import PropertiesPage from '@/components/PropertyPage/PropertyListing';
// import { fetchAllCities } from '@/services/api';
// import axios from 'axios';
// import { useParams, useRouter } from 'next/navigation';
// import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// export const getAdsByCompany = async (params:any) => {
//   try {
//     console.log("getCompanydetails",params);

//     const response = await axios.post(`http://localhost:8080/api/compnayads`, {
//       // jsonrpc: "2.0",
//       params:params
//     },

//   );
//     // Adjust this if your API response structure differs.
//     return response;

//   } catch (error) {
//     console.error("API Error (Get Profile):", error);
//   }
// };
// export default function CompanyPage() {
//   const [filters, setFilters] = useState({
//     property_type: "",
//     city: "",
//     reason: "",
//     price_min: "",
//     price_max: "",
//   });

//   const [properties, setProperties] = useState([]);
//   const params = useParams();
//   const router = useRouter();
//   const companyname = useMemo(() => params.companyname, [params.companyname]); // Memoize adId to prevent unnecessary re-renders

//   const fetchcompanydetails = useCallback(async () => {
//     const accessToken = localStorage.getItem("accessToken");
//     const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
// console.log("userData",userData);

//     const response:any = await getAdsByCompany({
//         //  "company_id": "1",
//        "company_name": "My Company"
//       }
//   );
//     console.log("responsegetCompanydetails",response.data.result);

//     if (response?.data.result.success) {
//       setProperties(response.data.result.data)
//     }else {
//       console.log("-------responsegetCompanydetails",response);
//     }

// }, []);

// const isFetched = useRef(false);
//   // useEffect(() => {
//   //   if (!isFetched.current) {
//   //        fetchcompanydetails();
//   //     isFetched.current = true;
//   //   }
//   // }, [fetchcompanydetails]);
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
//   useEffect(() => {
//     // if (!isFetched.current) {
//          Promise.all([fetchcompanydetails(),fetchcompanydetails(), fetchCities(),]);
//     //   isFetched.current = true;
//     // }
//   }, [fetchcompanydetails, fetchCities,filters]);

//   const handleAdChange = useCallback(() => {
//     fetchcompanydetails();
//   }, [fetchcompanydetails]);
//   return (
//     <div>
//       <h1>Company: {companyname}</h1>
//       <PropertiesPage
//         filters={filters} setFilters={setFilters}
//         properties={properties} cities={cities}
//         handleAdChange={handleAdChange}
//         // toggleSelectAd={toggleSelectAd}
//          selectedAds={selectedAds}
//       />
//     </div>
//   );
// }

"use client";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import MYLayout from "@/components/PropertyPage/MYLayout";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";
import {
  fetchAllCities,
  fetchAllProperties,
  getAdsByCompany,
  getCompanydetails,
  getCompanydetailsByName,
} from "@/services/api";
import PropertiesPage from "@/components/PropertyPage/PropertyListing";
import axios from "axios";


export default function Home() {
  const searchParams = useSearchParams();
  const companyParam = searchParams.get("company");
  const companyName = companyParam
    ? decodeURIComponent(companyParam)
    : "Not provided";
  const paramsRoute = useParams();
  const companyname = useMemo(
    () => paramsRoute.companyname,
    [paramsRoute.companyname]
  );
  const router = useRouter();
  console.log("companyName=====", companyName);
  // const searchParams = useSearchParams();
  // const companyParam = searchParams.get("company");
  //   // Decode the parameter (if necessary) to remove URL encoding
  //   const companyName = companyParam ? decodeURIComponent(companyParam) : "Not provided";
  // console.log("companyName",companyName);
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
  const [error, setError] = useState<any>(null);
  const [SubscriptionPlan, setMySubscriptionPlan] = useState<any>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalItems, setTotalItems] = useState(0);
  const [companydata, setCompanyData] = useState({
    name: "-",
    email: "-",
    phone: "-",
    website: "N/A",
    address: "-",
    logo: "-",
  });

  const isFetched = useRef(false);

  // Fetch properties with pagination and filter parameters
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const apiParams = {
        company_name: companyName, // or use companyname from params if needed
        limit: pageSize,
        offset: (page - 1) * pageSize,
        ...filters,
      };
      const response = await getAdsByCompany(apiParams);
      if (response?.data.result.success) {
        setProperties(response.data.result.data);
        setTotalItems(response.data.result.total || 0);
      } else {
        console.log("No success in response", response?.data?.result);
        setError(response?.data?.result?.message);
      }
    } catch (error) {
      console.error("API Error (Properties):", error);
      setError("Error fetching properties.");
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
        throw new Error(
          response?.data?.error?.message || "Failed to fetch cities."
        );
      }
    } catch (error) {
      setError("Error fetching cities.");
      console.error("API Error (Cities):", error);
    }
  }, []);

  const fetchcompanydetails = useCallback(async () => {
    try {
      const response = await getCompanydetailsByName({
        company_name: "my company",
      });
      console.log("getCompanydetailsByName", response?.data?.result?.company);
      if (response?.data.result.success) {
        setCompanyData(response?.data?.result?.company);
        setMySubscriptionPlan(response?.data?.result?.subscription_details);
      } else {
        console.log("-------responsegetCompanydetails", response);
      }
    } catch (err) {
      console.error("Error fetching company details:", err);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchcompanydetails(), fetchProperties(), fetchCities()]);
  }, [fetchProperties, fetchCities, filters]);

  const handleAdChange = useCallback(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Calculate total pages for pagination controls
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <MYLayout
      properties={properties}
      cities={cities}
      // selectedAds={selectedAds}
      companydata={companydata}
    >
      {loading && (
        <p className="text-center text-blue-500 mt-4">
          <Loader />
        </p>
      )}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      {!SubscriptionPlan?.is_active ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
          <div className="bg-white h-auto overflow-auto p-4 md:p-6 rounded-lg shadow-lg w-full max-w-2xl">
            {error}{" "}
          </div>
        </div>
      ) : (
        <></>
      )}
      <PropertiesPage
        filters={filters}
        setFilters={setFilters}
        properties={properties}
        cities={cities}
        handleAdChange={handleAdChange}
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
          onClick={() =>
            setPage((prev) => (prev < totalPages ? prev + 1 : prev))
          }
          disabled={page >= totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </MYLayout>
  );
}
