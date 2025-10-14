import React, { useState } from 'react';
import {
  House,
  PackageSearch,
  PackagePlus,
  ShoppingCart,
  MapPinHouse,
  History,
  FileBox,
  TrendingUp,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  TrendingDown,
  CirclePlus,
  Activity,
  GitPullRequest,
  CreditCard,
  DollarSign,
  UserCheck,
  Logs,
  WalletCards,
  ShoppingBasket,
  FileClock,
  FileChartColumn,
  ChartCandlestick,
  Users,
  WalletMinimal,
  UserRoundPlus,
  AlignHorizontalDistributeCenter,
  Omega,
  Wrench,
  TreePalm,
  Newspaper,
  Clock,
  Landmark,
  Globe,
  Settings,
  Headphones,
  Gift,
  BellRing,
  Rocket,
  ShieldUser,
  ChevronRight,
  X,
  MoveLeft,
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const [openMenus, setOpenMenus] = useState({});

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
      icon: House,
      href: '/dashboard',
    },
    // {
    //   label: 'E-Souq Manager',
    //   icon: PackageSearch,
    //   submenu: [
    //     { label: 'Products', icon: PackagePlus, href: '/e-souq-manager/products' },
    //     { label: 'Orders', icon: ShoppingCart, href: '/e-souq-manager/orders' },
    //     { label: 'Branches', icon: MapPinHouse, href: '/e-souq-manager/branches' },
    //   ],
    // },
    {
      label: 'Clients',
      icon: History,
      href: '/clients',
    },
    // {
    //   label: 'Positions',
    //   icon: FileBox,
    //   submenu: [
    //     { label: 'Open Positions', icon: TrendingUp, href: '/positions/open-positions-summary' },
    //     { label: 'Buy At Price', icon: ArrowDownNarrowWide, href: '/positions/buy-at-price' },
    //     { label: 'Take Profit', icon: ArrowUpNarrowWide, href: '/positions/take-profit' },
    //     { label: 'Closed Positions', icon: TrendingDown, href: '/positions/closed-positions-summary' },
    //     { label: 'Add Position', icon: CirclePlus, href: '/positions/create-position' },
    //   ],
    // },
    {
      label: 'Role Management',
      icon: Activity,
      href: '/role-management',
    },
    // {
    //   label: 'Requests',
    //   icon: GitPullRequest,
    //   submenu: [
    //     { label: 'Withdrawal Request', icon: CreditCard, href: '/requests/pending-withdrawal-requests' },
    //     { label: 'Loan Request', icon: DollarSign, href: '/requests/pending-loan-requests' },
    //     { label: 'User Change Requests', icon: UserCheck, href: '/requests/user-change-requests' },
    //   ],
    // },
    // {
    //   label: 'Reports',
    //   icon: Logs,
    //   submenu: [
    //     { label: 'Money Transactions', icon: WalletCards, href: '/reports/money-transactions' },
    //     { label: 'Esouq Orders', icon: ShoppingBasket, href: '/reports/esouq-orders' },
    //     { label: 'Statements', icon: FileClock, href: '/reports/statements' },
    //     { label: 'Demo Statements', icon: FileClock, href: '/reports/demo-users-statements' },
    //     { label: 'Users Statement', icon: FileChartColumn, href: '/reports/users-statement' },
    //   ],
    // },
    {
      label: 'Settings',
      icon: ChartCandlestick,
      href: '/settings',
    },
    {
      label: 'Logout',
      icon: Users,
      href: '/logout',
    },
    // {
    //   label: 'Neo Financials',
    //   icon: WalletMinimal,
    //   submenu: [
    //     { label: 'Accounts Mapping', icon: UserRoundPlus, href: '/neo-financials/accounts-mapping' },
    //     { label: 'Credit/Debit', icon: WalletCards, href: '/neo-financials/credit-debit-accounts-mapping' },
    //     { label: 'Fixing Mapping', icon: AlignHorizontalDistributeCenter, href: '/neo-financials/fixing-mapping' },
    //     { label: 'Physical Mapping', icon: Omega, href: '/neo-financials/physical-mapping' },
    //   ],
    // },
    // {
    //   label: 'Controls',
    //   icon: Wrench,
    //   submenu: [
    //     { label: 'Gold Products', icon: TreePalm, href: '/controls/gold-products' },
    //     { label: 'News', icon: Newspaper, href: '/controls/news' },
    //     { label: 'Market Hours', icon: Clock, href: '/controls/change-market-hours' },
    //     { label: 'Banks', icon: Landmark, href: '/controls/banks' },
    //     { label: 'Countries', icon: Globe, href: '/controls/countries' },
    //   ],
    // },
    // {
    //   label: 'Settings',
    //   icon: Settings,
    //   submenu: [
    //     { label: 'Support Teams', icon: Headphones, href: '/settings/support-teams' },
    //     { label: 'Offers', icon: Gift, href: '/settings/offers' },
    //     { label: 'Notifications', icon: BellRing, href: '/settings/push-notifications' },
    //     { label: 'App Version', icon: Rocket, href: '/settings/app-version-controls' },
    //     { label: 'Admin', icon: ShieldUser, href: '/settings/admin-settings' },
    //   ],
    // },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-[#BBA473] text-black rounded-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-[#BBA473] text-black p-3 border-r border-gray-700 
        overflow-y-auto flex flex-col h-screen transform transition-all duration-300 ease-in-out z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0
        ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Close Button (Mobile Only) */}
        <button
          onClick={toggleSidebar}
          className="absolute top-1 -right-0.5 lg:hidden p-2"
        >
          <X className="text-white" size={24} />
        </button>

        {/* Logo */}
        <a
          href="/"
          className={`text-xl font-medium mb-2 block transition-all ${
            isCollapsed ? 'text-center' : ''
          }`}
        >
          {isCollapsed ? (
            <div className="flex justify-center">
              <span className="text-xs text-white bg-[#685A3D] px-2 py-1 rounded-full font-medium">
                SIG
              </span>
            </div>
          ) : (
            <div className="flex justify-center gap-2">
              <span>Save In Gold</span>
              {/* <span className="text-xs text-white bg-[#685A3D] px-2 py-1 rounded-full font-medium">
                v1.4.8
              </span> */}
            </div>
          )}
        </a>

        {/* Navigation */}
        <nav className="flex-grow">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index} className="space-y-1">
                {item.submenu ? (
                  <>
                    {/* Menu with Submenu */}
                    <button
                      onClick={() => !isCollapsed && toggleMenu(item.label)}
                      className="w-full flex justify-between cursor-pointer items-center py-2 px-4 rounded transition-all duration-300
                        hover:bg-gradient-to-r hover:from-[#685A3D] hover:to-[#BBA473] hover:text-white"
                      title={isCollapsed ? item.label : ''}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon size={18} className="flex-shrink-0" />
                        {!isCollapsed && <span>{item.label}</span>}
                      </div>
                      {!isCollapsed && (
                        <ChevronRight
                          size={16}
                          className={`transition-transform duration-300 ${
                            openMenus[item.label] ? 'rotate-90' : ''
                          }`}
                        />
                      )}
                    </button>

                    {/* Submenu */}
                    {!isCollapsed && (
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
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
                                  hover:bg-gradient-to-r hover:from-[#685A3D] hover:to-[#BBA473] hover:text-white"
                              >
                                <div className="flex items-center gap-2">
                                  <subItem.icon size={18} />
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
                    className="flex items-center py-2 px-4 rounded border-none transition-all duration-300 justify-start 
                      hover:bg-gradient-to-r hover:from-[#685A3D] hover:to-[#BBA473] hover:text-white"
                    title={isCollapsed ? item.label : ''}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon size={18} className="flex-shrink-0" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Collapse Button */}
        <div className="mt-auto pt-4 border-t border-[#685A3D]/30">
          <button
            onClick={toggleCollapse}
            className="w-full flex items-center justify-center py-2 px-4 bg-[#685A3D] hover:bg-[#5A4D35] 
              text-white rounded transition-all duration-300"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <div className="flex items-center gap-2">
              <MoveLeft
                size={16}
                className={`transform transition-transform duration-300 ${
                  isCollapsed ? 'rotate-180' : 'rotate-0'
                }`}
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