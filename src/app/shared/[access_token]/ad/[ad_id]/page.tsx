// "use client";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { FiArrowLeft } from "react-icons/fi";
// import { fetchPropertiesDetailsById } from "@/services/api";
// import Image from "next/image";

// const PropertyDetailPage = () => {
//   const { access_token, ad_id } = useParams();
//   const router = useRouter();

//   const [property, setProperty] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedImage, setSelectedImage] = useState<string | null>('');
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
//   const images = useMemo(() => {
//     if (!property) return [];
//     return [
//       property.image,
//       ...(property?.additional_images?.map((img: any) => img.image_url) || []),
//     ];
//   }, [property]);

//   // Image navigation handlers (memoized)
//   const nextImage = useCallback(() => {
//     setCurrentImageIndex((prev) => (prev + 1) % images.length);
//   }, [images.length]);

//   const prevImage = useCallback(() => {
//     setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
//   }, [images.length]);

//   useEffect(() => {
//     if (access_token && ad_id) {
//         fetchPropertiesDetailsById(ad_id)
//         .then(({ details }) => {
//           const detailsData = details.result?.result;
//           setProperty(detailsData?.data || null);
//           const myf = {
//             property_type: detailsData?.property_type,
//             reason: detailsData?.reason,
//             city: detailsData?.city,
//           };
//         })

//         // fetchPropertiesDetailsById();
//     }
//   }, [access_token, ad_id]);

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//         {/* Back Button */}
//         <button 
//              onClick={() => router.push(`/shared/${access_token}`)}
//         className="bg-gray-500 text-white px-4 py-2 rounded mb-4">
//             ← Back to List
//         </button>

//         <div className="bg-white shadow-lg p-6 rounded-lg">
//             {/* Property Title */}
//             <h2 className="text-2xl font-bold mb-4">{property?.name}</h2>

//             {/* Image Gallery & Carousel */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Main Image Section */}
//                 <div className="relative">
//                     <Image 
//                     // src={selectedImage} 
//                     src={`data:image/jpeg;base64,${selectedImage}`}
//                     // src={`data:image/jpeg;base64,${images[currentImageIndex]}`}
//                     //            
//                       //  src={`data:image/jpeg;base64,${selectedImage}`}
                           
//                     alt={property?.name}width={600} height={400} className="w-full h-96 object-cover rounded" />
//                 </div>

//                 {/* Thumbnail Gallery */}
//                 <div className="grid grid-cols-4 gap-2">
//                     {images.map((img, index) => (
//                         <Image
//                             key={index}
//                             src={`data:image/jpeg;base64,${img}`}
//                             //                 
//                             alt="Thumbnail"
//                             width={100}
//                             height={80}
//                             className={`cursor-pointer rounded ${selectedImage === img ? "border-4 border-blue-500" : "border"}`}
//                             onClick={() => setSelectedImage(img)}
//                         />
//                     ))}
//                 </div>
//             </div>

//             {/* Property Details */}
//             <div className="mt-6">
//                 <p><strong>Type:</strong> {property?.propertyType}</p>
//                 <p><strong>Location:</strong> {property?.city}</p>
//                 <p><strong>Price:</strong> {property?.price}</p>
//                 <p className="mt-4"><strong>Description:</strong> {property?.description}</p>
//             </div>
//         </div>
//     </div>
// );


// };

// export default PropertyDetailPage;

"use client";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { fetchPropertiesDetailsById } from "@/services/api";
import Image from "next/image";

const PropertyDetailPage = () => {
  const { access_token, ad_id } = useParams();
  const router = useRouter();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false); // State to manage full-screen view
  const stripHtmlTags = useCallback((html: any): string => {
    if (typeof html !== "string") {
      console.warn("Expected a string, got:", html);
      return "";
    }
    return html.replace(/<[^>]*>/g, "");
  }, []);
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
          setSelectedImage(detailsData?.data?.image)
          const myf = {
            property_type: detailsData?.property_type,
            reason: detailsData?.reason,
            city: detailsData?.city,
          };
        });
    }
  }, [access_token, ad_id]);

  const handleImageClick = (img: any) => {
    setSelectedImage(img);
    setIsFullScreen(true); // Open full-screen view when image is clicked
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  return (
    <div className=" mx-auto p-6 mt-20">
      {/* Back Button */}
      <button onClick={() => router.push(`/shared/${access_token}`)} className="bg-gray-500 text-white px-4 py-2 rounded mb-4">
        ← Back to List
      </button>

      <div className="bg-white shadow-lg p-6 rounded-lg">
        {/* Property Title */}
        <h2 className="text-2xl font-bold mb-4">{property?.name}</h2>

        {/* Image Gallery & Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main Image Section */}
          <div className="relative">
            <Image
              src={`data:image/jpeg;base64,${selectedImage || images[currentImageIndex]}`}
              alt={property?.name}
              width={600}
              height={400}
              className="w-full h-96 object-cover rounded cursor-pointer"
              onClick={() => handleImageClick(selectedImage)} // Handle click to show image in full screen
            />
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, index) => (
              <Image
                key={index}
                src={`data:image/jpeg;base64,${img}`}
                alt="Thumbnail"
                width={100}
                height={80}
                className={`cursor-pointer rounded ${selectedImage === img ? "border-4 border-blue-500" : "border"}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className="mt-6">
          <p><strong>Location:</strong> {property?.city}</p>
          <p className=""><strong>Description:</strong> {stripHtmlTags(property?.description)}</p>
          {property?.kuwait_finder_link && (
                  <a href={property?.kuwait_finder_link} target="_blank" className="bg-gray-200 px-3 py-1 rounded text-sm">
                      📍 Location
                  </a>
              )}
        </div>
      </div>

      {/* Full-Screen Image Modal */}
      {isFullScreen && (
       <div className="fixed inset-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-96 h-auto">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white text-3xl"
              onClick={closeFullScreen}
            >
              &times;
            </button>
            <Image
              src={`data:image/jpeg;base64,${selectedImage}`}
              alt="Full Screen"
              width={1200} // Adjust width as needed
              height={800} // Adjust height as needed
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;



// "use client";
// import { useCallback, useEffect, useState, useMemo } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { FiArrowLeft } from "react-icons/fi";
// import { fetchPropertiesDetailsById } from "@/services/api";
// import Image from "next/image";

// const PropertyDetailPage = () => {
//   const { access_token, ad_id } = useParams();
//   const router = useRouter();

//   const [property, setProperty] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedImage, setSelectedImage] = useState<string | null>('');
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isFullScreen, setIsFullScreen] = useState(false); // State to manage full-screen view

//   const images = useMemo(() => {
//     if (!property) return [];
//     return [
//       property.image,
//       ...(property?.additional_images?.map((img: any) => img.image_url) || []),
//     ];
//   }, [property]);

//   // Image navigation handlers (memoized)
//   const nextImage = useCallback(() => {
//     setCurrentImageIndex((prev) => (prev + 1) % images.length);
//   }, [images.length]);

//   const prevImage = useCallback(() => {
//     setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
//   }, [images.length]);

//   useEffect(() => {
//     if (access_token && ad_id) {
//       fetchPropertiesDetailsById(ad_id)
//         .then(({ details }) => {
//           const detailsData = details.result?.result;
//           setProperty(detailsData?.data || null);
//           setSelectedImage(detailsData?.data?.image)
//         });
//     }
//   }, [access_token, ad_id]);

//   const handleImageClick = (img: any) => {
//     setSelectedImage(img);
//     setIsFullScreen(true); // Open full-screen view when image is clicked
//   };

//   const closeFullScreen = () => {
//     setIsFullScreen(false);
//   };

//   return (
//     <div className=" mx-auto p-6">
//       {/* Back Button */}
//       <button onClick={() => router.push(`/shared/${access_token}`)} className="bg-gray-500 text-white px-4 py-2 rounded mb-4">
//         ← Back to List
//       </button>

//       <div className="bg-white shadow-lg p-6 rounded-lg">
//         {/* Property Title */}
//         <h2 className="text-2xl font-bold mb-4">{property?.name}</h2>

//         {/* Image Gallery & Carousel */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Main Image Section */}
//           <div className="relative">
//             <Image
//               src={`data:image/jpeg;base64,${selectedImage || images[currentImageIndex]}`}
//               alt={property?.name}
//               width={600}
//               height={400}
//               className="w-full h-96 object-cover rounded cursor-pointer"
//               onClick={() =>handleImageClick(selectedImage)} // Handle click to show image in full screen
//             />
//           </div>

//           {/* Thumbnail Gallery */}
//           <div className="grid grid-cols-4 gap-2">
//             {images.map((img, index) => (
//               <Image
//                 key={index}
//                 src={`data:image/jpeg;base64,${img}`}
//                 alt="Thumbnail"
//                 width={100}
//                 height={80}
//                 className={`cursor-pointer rounded ${selectedImage === img ? "border-4 border-blue-500" : "border"}`}
//                 onClick={() => setSelectedImage(img)}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Property Details */}
//         <div className="mt-6">
//           <p><strong>Type:</strong> {property?.propertyType}</p>
//           <p><strong>Location:</strong> {property?.city}</p>
//           <p><strong>Price:</strong> {property?.price}</p>
//           <p className="mt-4"><strong>Description:</strong> {property?.description}</p>
//         </div>
//       </div>

//       {/* Full-Screen Image Modal */}
//       {isFullScreen && (
//         <div className="fixed inset-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50">
//           <div className="relative w-96 h-auto p-3 m-3">
//             {/* Close Button */}
//             <button
//               className="absolute top-4 right-4 text-white text-3xl"
//               onClick={closeFullScreen}
//             >
//               &times;
//             </button>
//             <Image
//               src={`data:image/jpeg;base64,${images[currentImageIndex]}`}
//               alt="Full Screen"
//               width={1200} // Adjust width as needed
//               height={800} // Adjust height as needed
//               className="w-full h-auto object-contain"
//             />
//             {/* Left/Right Arrows for Image Navigation */}
//             <button
//               className="absolute top-1/2 left-4 p-3 text-white text-3xl transform -translate-y-1/2"
//               onClick={prevImage}
//             >
//               &lt;
//             </button>
//             <button
//               className="absolute top-1/2 right-4 p-3 text-white text-3xl transform -translate-y-1/2"
//               onClick={nextImage}
//             >
//               &gt;
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PropertyDetailPage;
