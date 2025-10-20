import React, { useState, useEffect } from 'react';
import {
  Home,
  History,
  TrendingUp,
  Activity,
  Settings,
  LogOut,
  ChevronRight,
  X,
  Menu,
  ArrowLeft,
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const [openMenus, setOpenMenus] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setOpenMenus({});
  };

  const menuItems = [
    {
      label: 'Home',
      icon: Home,
      href: '/dashboard',
    },
    {
      label: 'SIG Team',
      icon: History,
      href: '/team',
    },
    {
      label: 'Leads',
      icon: TrendingUp,
      href: '/leads',
    },
    {
      label: 'Role Management',
      icon: Activity,
      href: '/role-management',
    },
  ];

  const bottomMenuItems = [
    {
      label: 'Settings',
      icon: Settings,
      href: '/settings',
    },
    {
      label: 'Logout',
      icon: LogOut,
      href: '/logout',
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden transition-all duration-300 overflow-hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-[#BBA473] text-black rounded-md shadow-lg hover:bg-[#d4bc89] transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        style={{backgroundColor: '#BBA473'}}
        className={`fixed inset-y-0 left-0 bg-[#BBA473] text-black p-3 border-r border-[#8E7D5A]/30
        overflow-y-auto flex flex-col h-screen transform transition-all duration-500 ease-in-out z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Close Button (Mobile Only) */}
        <button
          onClick={toggleSidebar}
          className="absolute top-1 -right-0.5 lg:hidden p-2 hover:bg-[#685A3D] rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <X className="text-white" size={24} />
        </button>

        {/* Logo with Animation */}
        <div className={`mb-12 transition-all duration-700 delay-150 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-9 h-9 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <div className="absolute inset-0 bg-[#a38239] rounded transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#BBA473]/50"></div>
              <div className="absolute bottom-0 left-0 w-5 h-5 bg-[#1A1A1A] rounded-tl-lg transition-all duration-300"></div>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-medium text-white transition-all duration-300 group-hover:text-[#E8D5A3]">Save In GOLD</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li 
                key={index} 
                className={`space-y-1 transition-all duration-700 ${
                  isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                {item.submenu ? (
                  <>
                    {/* Menu with Submenu */}
                    <button
                      onClick={() => !isCollapsed && toggleMenu(item.label)}
                      className="w-full flex justify-between cursor-pointer items-center py-2 px-4 rounded transition-all duration-300
                        hover:bg-gradient-to-r hover:from-[#685A3D] hover:to-[#8E7D5A] hover:text-white
                        hover:shadow-md group"
                      title={isCollapsed ? item.label : ''}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon size={18} className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                        {!isCollapsed && <span>{item.label}</span>}
                      </div>
                      {!isCollapsed && (
                        <ChevronRight
                          size={16}
                          className={`transition-all duration-300 ${
                            openMenus[item.label] ? 'rotate-90' : ''
                          } group-hover:scale-110`}
                        />
                      )}
                    </button>

                    {/* Submenu */}
                    {!isCollapsed && (
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          openMenus[item.label]
                            ? 'max-h-96 opacity-100'
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <ul className="pl-6 space-y-1 py-1">
                          {item.submenu.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <a
                                href={subItem.href}
                                className="block py-1.5 px-4 rounded transition-all duration-300
                                  hover:bg-gradient-to-r hover:from-[#685A3D] hover:to-[#8E7D5A] hover:text-white
                                  hover:shadow-md hover:translate-x-1 group"
                              >
                                <div className="flex items-center gap-2">
                                  <subItem.icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
                                  <span>{subItem.label}</span>
                                </div>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  // Regular Menu Item
                  <a
                    href={item.href}
                    className="flex items-center py-2 px-4 rounded transition-all duration-300
                      hover:bg-gradient-to-r hover:from-[#685A3D] hover:to-[#8E7D5A]
                      hover:shadow-md group"
                    title={isCollapsed ? item.label : ''}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon size={18} className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Menu Items (Settings & Logout) */}
        <div className="mt-auto pt-4 border-t border-[#685A3D]/30 space-y-1">
          {bottomMenuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`flex items-center py-2 px-4 rounded transition-all duration-500
                hover:bg-gradient-to-r hover:from-[#685A3D] hover:to-[#8E7D5A]
                hover:shadow-md group
                ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: `${(menuItems.length + index + 1) * 100}ms` }}
              title={isCollapsed ? item.label : ''}
            >
              <div className="flex items-center gap-2">
                <item.icon size={18} className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                {!isCollapsed && <span>{item.label}</span>}
              </div>
            </a>
          ))}

          {/* Collapse Button */}
          <button
            onClick={toggleCollapse}
            className={`w-full flex items-center justify-center py-2 px-4 bg-[#685A3D] hover:bg-[#5A4D35] 
              text-white rounded transition-all duration-500 hover:shadow-md group cursor-pointer
              ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: `${(menuItems.length + bottomMenuItems.length + 1) * 100}ms` }}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <div className="flex items-center gap-2">
              <ArrowLeft
                size={16}
                className={`transform transition-all duration-500 ${
                  isCollapsed ? 'rotate-180' : 'rotate-0'
                } group-hover:scale-110`}
              />
              {!isCollapsed && <span className="text-sm font-medium">Collapse</span>}
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;