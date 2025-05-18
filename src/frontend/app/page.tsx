'use client';
import "../app/globals.css";
import {withPublic} from "@/lib/withPublic";
import Navbar from "@/Usercomponents/Navbar";
import ComplaintBanner from "@/Usercomponents/ComplaintBanner";


function Home() {
  return (
    <section>
        <Navbar />
        <ComplaintBanner
            smallText="You know what?"
            largeText="There's always a"
            largeTextHighlight="Complaint"
            sideText="File in your complaints now"
            onButtonClick={() => console.log('Button clicked!')}
        />
    </section>
  );
}
export default withPublic(Home);
