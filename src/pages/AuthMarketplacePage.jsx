import React from 'react';
import AuthFiltersSidebar from '../components/AuthFiltersSidebar';
import AuthNotesMarketplace from '../components/AuthNotesMarketplace';

export default function AuthMarketplacePage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans bg-gray-50 min-h-screen max-[240px]:px-3 max-[240px]:py-6">

            {/* Top Header Section */}
            <div className="mb-10 text-center md:text-left max-[240px]:mb-6">
                <h1 className="text-4xl font-extrabold text-yellow-600 tracking-tight max-[240px]:text-2xl max-[240px]:leading-tight">
                    Browse the Marketplace
                </h1>
                <p className="text-gray-600 mt-3 text-lg max-w-2xl max-[240px]:mt-2 max-[240px]:text-sm max-[240px]:leading-relaxed">
                    Discover top-tier tutorials, peer-reviewed notes, and premium study materials curated for academic excellence.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 max-[240px]:gap-5">

                {/* Left Sidebar Placed Here */}
                <AuthFiltersSidebar />

                {/* Right Content Area */}
                <div className="flex-1 flex flex-col min-w-0">

                    {/* Results Count & Sort Dropdown */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 max-[240px]:mb-4">
                        <span className="text-gray-700 font-medium mb-4 sm:mb-0 max-[240px]:text-sm max-[240px]:mb-3">Showing 24 results</span>

                        <div className="flex items-center gap-2 w-full sm:w-auto max-[240px]:flex-col max-[240px]:items-stretch">
                            <span className="text-sm text-gray-500 max-[240px]:text-xs">Sort by:</span>
                            <select className="border border-gray-200 rounded-lg py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white shadow-sm font-medium w-full sm:w-auto max-[240px]:text-xs max-[240px]:py-1.5 max-[240px]:px-2 min-w-0">
                                <option>Recommended</option>
                                <option>Highest Rated</option>
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