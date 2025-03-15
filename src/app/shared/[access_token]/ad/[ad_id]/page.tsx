"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { fetchPropertiesDetailsById } from "@/services/api";

const PropertyDetailPage = () => {
  const { access_token, ad_id } = useParams();
  const router = useRouter();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = useMemo(() => {
    if (!property) return [];
    return [
      property.image,
      ...(property?.additional_images?.map((img: any) => img.image_url) || []),
    ];
  }, [property]);

  // Image navigation handlers (memoized)
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (access_token && ad_id) {
        fetchPropertiesDetailsById(ad_id)
        .then(({ details }) => {
          const detailsData = details.result?.result;
          setProperty(detailsData?.data || null);
          const myf = {
            property_type: detailsData?.property_type,
            reason: detailsData?.reason,
            city: detailsData?.city,
          };
        })

        // fetchPropertiesDetailsById();
    }
  }, [access_token, ad_id]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/shared/${access_token}`)}
        className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-md w-fit mb-4 hover:bg-gray-900"
      >
        <FiArrowLeft className="mr-2" /> Back to List
      </button>

      <h1 className="text-3xl font-bold mb-6 text-gray-900">Property Details</h1>

      {loading && <p className="text-blue-500">Loading details...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="max-w-4xl mx-auto p-2 mt-3 bg-white shadow-2xl rounded-lg">
      {/* Image Slider */}
      <div className="relative w-full h-[300px] rounded-lg overflow-hidden bg-gray-200">
        {images.length > 0 && images[0] ? (
          <>
            <img
              src={`data:image/jpeg;base64,${images[currentImageIndex]}`}
              alt={property?.name}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute top-1/2 left-2 bg-gray-700 hover:bg-slate-400 text-white p-2 rounded-full transform -translate-y-1/2"
                >
                  ◀
                </button>
                <button
                  onClick={nextImage}
                  className="absolute top-1/2 right-2 bg-gray-700 hover:bg-slate-400 text-white p-2 rounded-full transform -translate-y-1/2"
                >
                  ▶
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">
            📸 No Image Available
          </div>
        )}
      </div>

      {/* Additional Images */}
      {property?.additional_images?.length > 0 && (
        <div className="mt-4">
          <label className="block text-gray-700 font-semibold">
            Additional Images
          </label>
          <div className="flex overflow-x-auto mt-2 space-x-4 p-2 border border-gray-300 rounded-lg">
            {property.additional_images.map((img: any, index: number) => (
              <div key={index} className="relative">
                <img
                  src={`data:image/jpeg;base64,${img.image_url}`}
                  alt="Additional Image"
                  className="w-24 h-24 object-cover rounded-md"
                />
                {/* <p className="text-gray-500">
                  📧 <span className="font-semibold">{img.name}</span>
                </p> */}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ad Information */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold text-gray-900">{property?.name}</h1>
        <p className="text-gray-600 text-lg mt-2">
          {/* {property?.description.length>1 &&stripHtmlTags(property?.description)} */}
          {property?.description}
        </p>

        {/* Pricing & Location */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4">
          <p className="text-lg font-semibold text-gray-800">
            💰 Price:{" "}
            <span className="text-green-600">
              {property?.price} {property?.currency}
            </span>
          </p>
          <p className="text-gray-500">
            📍 Location:{" "}
            <span className="font-semibold">{property?.city}</span>
          </p>
          <p className="text-gray-500">
            👀 Views:{" "}
            <span className="font-semibold">{property?.total_visits}</span>
          </p>
        </div>

       

     
         
      </div>
    </div>
    </div>
  );
};

export default PropertyDetailPage;
