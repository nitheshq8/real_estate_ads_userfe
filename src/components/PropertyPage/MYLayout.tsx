"use client";
import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useCallback,
  useEffect,
  useState,
} from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import TrendingProperties from "./TrendingProperties";
import { useRouter } from "next/navigation";
import UserMenu from "@/hooks/UserMenu";
import { getCompanydetails } from "@/services/api";
import UserAvatar from "@/hooks/UserAvatar";
import PropertyModal from "../PropertyType/PropertyTypeModal";
// import Footer from "../Footer";
const navItems = [
  { name: 'Home', url: '/' },
  { name: 'About Us', url: '/ads/about-us' },
  { name: 'Contact Us', url: '/ads/contact-us' },
  { name: 'Services', url: '/ads/services' },
];

const MYLayout = ({
  children,
  properties,
  isdetailpage,
  companydata
}: {
  children: ReactNode;
  properties?: any;
  cities?: any;
  selectedAds?:any
  isdetailpage?:boolean
  companydata:any
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData1: any = JSON.parse(
        localStorage.getItem("aiduser") || "{}"
      );
      setUserData(userData1);
    }
  }, []);
  console.log("companydata",companydata);
  
 return (
    <div className="relative flex flex-col h-screen ">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-around items-center fixed top-0 w-full z-50">
        <div className="flex items-center">
        {companydata.logo?
        <div
      className="flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden"
      style={{ width: 50, height: 50 }}
    >
    
        <img
           src={companydata?.logo ? `data:image/jpeg;base64,${companydata?.logo}` : "https://via.placeholder.com/600"}
           alt={''}
          className="object-cover w-full h-full"
          
        />
    </div>
    :''
  } 
        <h1 className="text-xl font-bold ml-2">{companydata?.name}</h1>
        </div>
       
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-2xl"
        >
          <FiMenu />
        </button>
      </header>

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 mt-16">
        {/* Sidebar (Menu) */}
        <aside className="w-1/5 bg-white shadow-lg p-4 border-r fixed left-0 top-24 h-screen overflow-y-auto">
          <nav className="space-y-4">
            {navItems.map(
              (item, index) => (
                <a
                  key={index}
                  href={item.url}
                  className="block p-2 rounded-lg hover:bg-gray-200"
                  
                >
                  {item.name}
                </a>
              )
            )}
       
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6  ml-[20%] mr-[25%] overflow-y-auto">
          {children}
        </main>

        {/* Sidebar (Trending Properties) */}
        {isdetailpage?'':  
        <aside className="w-1/4 bg-gray-100 p-4 fixed right-0 top-24 h-screen overflow-y-auto">
          {/* <h2 className="text-lg font-bold">Trending Properties</h2> */}
          <div className="space-y-4 overflow-y-auto">
            <TrendingProperties properties={properties} />
          </div>
        </aside>
}
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
      {isdetailpage?'':  
      <div className=" mt-24">

<TrendingProperties properties={properties} />
        </div>
      
} 
        <main className="p-6 relative">{children}</main>

        {menuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
            <div className="w-2/3 bg-white p-6 shadow-lg h-full">
              <button
                onClick={() => setMenuOpen(false)}
                className="text-2xl absolute top-4 ml-[50%]"
              >
                <IoMdClose />
              </button>
              <nav className="mt-8 space-y-4">
              
                {navItems.map(
                  (item, index) => (
                    <a
                      key={index}
                      href={item.url}
                      className="block p-2 rounded-lg hover:bg-gray-200"
                    >
                      {item.name}
                    </a>
                  )
                  
                )}
             
              </nav>
            </div>
          </div>
        )}
      </div>
     <footer className="bg-white  z-40">
     <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center"><div className="space-y-4">
            {navItems.map(
              (item, index) => (
                <a
                  key={index}
                  href={item.url}
                  className="hover:underline p-1"
                  
                >
                  {item.name}
                </a>
              )
            )}
            </div>
            <div>
              <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
     </footer>
    </div>
  );
};

export default MYLayout;
