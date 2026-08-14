import React from 'react';
import AuthNoteCard from './AuthNoteCard';

export default function AuthNotesMarketplace() {
    {/*The fake database for authenticated users*/}
    const authDummyNotes = [
        {
            id: 1,
            contentType: "PDF NOTES",
            price: "$24.00",
            title: "Advanced Data Structures & Algorithms",
            course: "CS 301",
            authorName: "Prof. John Doe",
            authorAvatar: "https://i.pravatar.cc/150?u=john",
            coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80"
        },
        {
            id: 2,
            contentType: "PDF NOTES",
            price: "$15.00",
            title: "Macroeconomics Midterm Master Notes",
            course: "ECON 201",
            authorName: "Sarah Jenkins",
            authorAvatar: "https://i.pravatar.cc/150?u=sarah",
            coverImage: "https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?w=400&q=80"
        },
        {
            id: 3,
            contentType: "PDF + QUIZ",
            price: "$18.50",
            title: "Organic Chemistry 101: Reaction Mechanisms",
            course: "CHEM 101",
            authorName: "Michael Chang",
            authorAvatar: "https://i.pravatar.cc/150?u=michael",
            coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80"
        }
    ];

    return (
        <div className="flex flex-col flex-1">
            {/* The Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {authDummyNotes.map((note) => (
                    <AuthNoteCard
                        key={note.id}
                        contentType={note.contentType}
                        price={note.price}
                        title={note.title}
                        course={note.course}
                        authorName={note.authorName}
                        authorAvatar={note.authorAvatar}
                        coverImage={note.coverImage}
                    />
                ))}
            </div>

            {/* Load More Button */}
            <div className="mt-10 flex justify-center">
                <button className="px-6 py-2.5 bg-amber-500 text-gray-900 font-bold rounded-lg hover:bg-amber-600 transition-colors shadow-sm">
                    Load More Resources
                </button>
            </div>
        </div>
    );
}