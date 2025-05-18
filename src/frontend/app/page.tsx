'use client';
import "../app/globals.css";
import {withPublic} from "@/lib/withPublic";
import Navbar from "@/Usercomponents/Navbar";


function Home() {
  return (
    <section>
        <Navbar />
    </section>
  );
}
export default withPublic(Home);
