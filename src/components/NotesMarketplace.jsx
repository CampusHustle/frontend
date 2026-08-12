import React from 'react';
import NoteCard from "./NoteCard";

export default function NotesMarketplace() {
  

  const dummyNotes = [
    {
      id: 1, 
      courseCode: "CS101",
      price: "$15",
      rating: 4.9,
      reviewCount: 120,
      title: "Intro to Data Structures: Comprehensive Study Guide",
      authorName: "Alex Chen",
      authorAvatar: "https://i.pravatar.cc/150?u=alex",
      isVerified: true
    },
    {
      id: 2,
      courseCode: "MATH220",
      price: "$25",
      rating: 4.7,
      reviewCount: 85,
      title: "Linear Algebra Complete Lecture Notes",
      authorName: "Sarah Jenkins",
      authorAvatar: "https://i.pravatar.cc/150?u=sarah",
      isVerified: true
    },
    {
      id: 3,
      courseCode: "ECON101",
      price: "Free",
      rating: 4.5,
      reviewCount: 210,
      title: "Microeconomics Cheat sheet Finals- Prep",
      authorName: "Sarah Jenkins",
      authorAvatar: "https://i.pravatar.cc/150?u=sarah",
      isVerified: true
    }
  ];

  return(
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      
      {dummyNotes.map((note) => (
        <NoteCard 
          key={note.id} 
          courseCode={note.courseCode}
          price={note.price}
          rating={note.rating}
          reviewCount={note.reviewCount}
          title={note.title}
          authorName={note.authorName}
          authorAvatar={note.authorAvatar}
          isVerified={note.isVerified}
        />
      ))}
      
    </div>
  );
}