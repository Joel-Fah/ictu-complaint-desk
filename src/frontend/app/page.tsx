'use client';
import "../app/globals.css";
import {withPublic} from "@/lib/withPublic";
import Navbar from "@/Usercomponents/Navbar";
import ComplaintBanner from "@/Usercomponents/ComplaintBanner";
import LayeredImageSection from "@/Usercomponents/LayeredImageSection";



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

        <LayeredImageSection
            mainImageSrc="/images/Mask-group.png"
            mainImageAlt="Main graphic showing system"
            overlayImages={[
                {
                    src: "/images/paper-plane.png",
                    alt: "Plane 1",
                    position: "top-[20.25rem] left-[3.25rem]",
                    flip:"scale-x-[-1]",
                    rotate: "rotate-[-0.3deg]",
                },
                {
                    src: "/images/paper-plane.png",
                    alt: "Plane 2",
                    position: "bottom-[12rem] right-[3.25rem]",

                },
                {
                    src: "/images/Group-4.png",
                    alt: "Bolt ",
                    position: "bottom-[20rem] right-[65%]",

                },
                {
                    src: "/images/Lines.png",
                    alt: "Tornado",
                    position: "bottom-[22rem] right-[16rem]",

                },
            ]}
        />

    </section>
  );
}
export default withPublic(Home);
