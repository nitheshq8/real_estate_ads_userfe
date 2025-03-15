"use client";
import {
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useParams } from "next/navigation";
import UserMenu from "@/hooks/UserMenu";
import { getCompanydetailsBytoken } from "@/services/api";

const navItems = [
  { name: "Home", url: "/" },
  { name: "About Us", url: "/ads/about-us" },
  { name: "Contact Us", url: "/ads/contact-us" },
  { name: "Services", url: "/ads/services" },
];

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [companydata, setCompanyData] = useState<any>({ name: "A" });
  const userData = JSON.parse(localStorage.getItem("aiduser") || "{}");
  const { access_token } = useParams();

  // Fetch company details
  const getCompanyDetails = useCallback(async () => {
    if (!access_token) return;
    try {
      const response: any = await getCompanydetailsBytoken({ access_token });
      if (response?.data?.result?.success) {
        setCompanyData(response.data.result.data);
      }
    } catch (err) {
      console.error("Error fetching company details:", err);
    }
  }, [access_token]);

  useEffect(() => {
    getCompanyDetails();
  }, [getCompanyDetails]);

  return (
    <div className="relative flex flex-col h-screen ">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-around items-center fixed top-0 w-full z-50">
        <div className="flex items-center">
          <div
            className="flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden"
            style={{ width: "50px", height: "50px" }}
          >
            <img
               src={companydata?.logo ? `data:image/jpeg;base64,${companydata?.logo}` : "https://via.placeholder.com/600"}
            
              // src={companydata?.logo}
              alt={companydata?.name}
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-xl font-bold ml-2">{companydata?.name}</h1>
        </div>

        {/* Desktop View (Hidden on Mobile) */}
        <div className="hidden md:flex items-center min-w-fit justify-between">
          {/* <UserMenu userData={userData} companydata={companydata} /> */}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(true)} className="md:hidden text-2xl">
          <FiMenu />
        </button>
      </header>

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 mt-16">
        {/* Sidebar (Menu) */}
        <aside className="w-1/5 bg-white shadow-lg p-4 border-r fixed left-0 top-24 h-screen overflow-y-auto">
          <nav className="space-y-4">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.url}
                className="block p-2 rounded-lg hover:bg-gray-200"
              >
                {item.name}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 ml-[20%] overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
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
                <UserMenu userData={userData} companydata={companydata} />
                {navItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    className="block p-2 rounded-lg hover:bg-gray-200"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-white z-40">
        <footer className="bg-gray-800 text-white py-6">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="space-y-4">
                {navItems.map((item, index) => (
                  <a key={index} href={item.url} className="hover:underline p-1">
                    {item.name}
                  </a>
                ))}
              </div>
              <div>
                <p>
                  &copy; {new Date().getFullYear()} Your Company. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </footer>
    </div>
  );
}
