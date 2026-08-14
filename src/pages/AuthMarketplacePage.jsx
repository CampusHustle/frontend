import React from 'react';
import AuthFiltersSidebar from '../components/AuthFiltersSidebar';
import AuthNotesMarketplace from '../components/AuthNotesMarketplace';

export default function AuthMarketplacePage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans bg-gray-50 min-h-screen">

            {/* Top Header Section */}
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    Browse the Marketplace
                </h1>
                <p className="text-gray-600 mt-3 text-lg max-w-2xl">
                    Discover top-tier tutorials, peer-reviewed notes, and premium study materials curated for academic excellence.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">

                {/* Left Sidebar Placed Here */}
                <AuthFiltersSidebar />

                {/* Right Content Area */}
                <div className="flex-1 flex flex-col min-w-0">

                    {/* Results Count & Sort Dropdown */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <span className="text-gray-600 font-medium mb-4 sm:mb-0">Showing 24 results</span>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-sm text-gray-500">Sort by:</span>
                            <select className="border border-gray-200 rounded-lg py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white shadow-sm font-medium w-full sm:w-auto min-w-0">
                                <option>Recommended</option>
                                <option>Newest</option>
                            </select>
                        </div>
                    </div>

                    {/* Independent Grid Component Placed Here! */}
                    <AuthNotesMarketplace />

                </div>
            </div>
        </div>
    );
}