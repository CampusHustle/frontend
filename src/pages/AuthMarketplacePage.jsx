// src/pages/AuthMarketplacePage.jsx
import React from 'react';
import AuthFiltersSidebar from '../components/AuthFiltersSidebar';
import AuthNotesMarketplace from '../components/AuthNotesMarketplace';

// Icons for the Navbar
const SearchIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5 text-gray-400 group-hover:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default function AuthMarketplacePage() {
    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 font-sans bg-gray-900 min-h-screen flex flex-col text-gray-100">

            {/* Soft gradient background at the top */}
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-yellow-500/10 via-gray-900/5 to-transparent pointer-events-none" />

            {/* Navbar */}
            <nav className="w-full bg-transparent relative z-10 mb-8 sm:mb-12">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="text-[1.35rem] font-extrabold text-white tracking-tight">
                            CampusHustle
                        </div>
                        <div className="relative hidden md:block w-72">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <SearchIcon />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search marketplace..." 
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-full text-[13px] font-medium text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-gray-400">
                        <a href="#" className="text-white relative">
                            Marketplace
                            <span className="absolute -bottom-1.5 left-0 w-full h-[3px] bg-yellow-500 rounded-t-full"></span>
                        </a>
                        <a href="#" className="hover:text-yellow-500 transition-colors">Tutors</a>
                        <a href="#" className="hover:text-yellow-500 transition-colors">Notes</a>
                        <a href="#" className="hover:text-yellow-500 transition-colors">Community</a>
                    </div>

                    <div className="flex items-center gap-5">
                        <button className="hidden md:block bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-sm font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm">
                            Post a Listing
                        </button>
                        <div className="flex items-center gap-3">
                            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors group">
                                <BellIcon />
                            </button>
                            <button className="p-1.5 hover:bg-gray-700 rounded-full transition-colors border border-gray-700 bg-gray-800">
                                <UserIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Top Header Section */}
            <div className="mb-8 sm:mb-10 text-center md:text-left break-words relative z-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    Browse the Marketplace
                </h1>
                <p className="text-gray-400 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg max-w-2xl mx-auto md:mx-0">
                    Discover top-tier tutorials, peer-reviewed notes, and premium study materials curated for academic excellence.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 relative z-10">

                {/* Left Sidebar Placed Here */}
                <AuthFiltersSidebar />

                {/* Right Content Area */}
                <div className="flex-1 flex flex-col min-w-0">

                    {/* Results Count & Sort Dropdown */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-4 w-full">
                        <span className="text-sm sm:text-base text-gray-300 font-medium break-words">Showing 24 results</span>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto min-w-0">
                            <span className="text-xs sm:text-sm text-gray-500 shrink-0">Sort by:</span>
                            <div className="relative">
                                <select className="w-full sm:w-auto appearance-none bg-gray-800 border border-gray-700 rounded-lg py-1.5 px-3 pr-8 sm:py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-sm font-medium max-w-full truncate cursor-pointer">
                                    <option>Recommended</option>
                                    <option>Highest Rated</option>
                                    <option>Newest</option>
                                </select>
                                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Independent Grid Component Placed Here! */}
                    <AuthNotesMarketplace />

                </div>
            </div>
            
            {/* Footer */}
            <footer className="bg-gray-950/50 rounded-2xl p-8 sm:p-12 mt-16 relative z-10 border border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-6 space-y-4">
                        <div className="text-yellow-500 font-extrabold text-xl tracking-tight">CampusHustle</div>
                        <p className="text-gray-400 text-[13px] font-medium max-w-sm">Empowering Academic Entrepreneurship.</p>
                        <p className="text-gray-600 text-[11px] pt-8 font-medium">© 2024 CampusHustle. Empowering Academic Entrepreneurship.</p>
                    </div>
                    
                    <div className="md:col-span-3">
                        <h4 className="font-bold text-sm mb-5 text-gray-200">Platform</h4>
                        <ul className="space-y-3.5 text-[13px] text-gray-400 font-medium">
                            <li><a href="#" className="hover:text-yellow-500 transition-colors">Honor Code</a></li>
                            <li><a href="#" className="hover:text-yellow-500 transition-colors">Academic Integrity</a></li>
                        </ul>
                    </div>

                    <div className="md:col-span-3">
                        <h4 className="font-bold text-sm mb-5 text-gray-200">Support</h4>
                        <ul className="space-y-3.5 text-[13px] text-gray-400 font-medium">
                            <li><a href="#" className="hover:text-yellow-500 transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-yellow-500 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-yellow-500 transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
}