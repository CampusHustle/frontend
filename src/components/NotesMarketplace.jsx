import NoteCard from "./NoteCard";

export default function NotesMarketplace() {
    return(
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <NoteCard 
           courseCode="CS101"
           price="$15"
           rating={4.9}
           reviewCount={120}
           title="Intro to Data Structures: Comprehensive Study Guide"
           authorName="Alex Chen"
           authorAvatar="https://i.pravatar.cc/150?u=alex"
           isVerified={true}
   />
  
         <NoteCard 
          courseCode="MATH220"
          price="$25"
          rating={4.7}
          reviewCount={85}
          title="Linear Algebra Complete Lecture Notes"
          authorName="Sarah Jenkins"
          authorAvatar="https://i.pravatar.cc/150?u=sarah"
          isVerified={true}
  />
        <NoteCard 
          courseCode="ECON101"
          price="Free"
          rating={4.5}
          reviewCount={210}
          title="Microeconomics Cheat sheet Finals- Prep"
          authorName="Sarah Jenkins"
          authorAvatar="https://i.pravatar.cc/150?u=sarah"
          isVerified={true}
  />
        </div>
    )
}