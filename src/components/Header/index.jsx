import { useState } from "react";
import { Menu } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between py-2 px-4 bg-[#232323] z-25 relative">
      {/* Mobile Menu Button */}
      <button className="flex items-center space-x-2 text-white font-medium md:block lg:hidden">
        <Menu className="w-6 h-6" />
        <span>Menu</span>
      </button>

      {/* Right Section */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="hover:opacity-80 transition-opacity flex items-center space-x-2"
          >
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-[#BBA473] rounded-full cursor-pointer">
              <span className="font-medium text-black">MA</span>
            </div>
            <h4 className="text-gray-50">Muhammad Qasim</h4>
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
              <ul className="py-1 text-gray-700">
                <li>
                  <button
                    onClick={() => console.log("Change Password clicked")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Change Password
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => console.log("Logout clicked")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
