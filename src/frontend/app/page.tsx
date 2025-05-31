'use client';
import "../app/globals.css";
import {withPublic} from "@/lib/withPublic";
import Navbar from "@/Usercomponents/Navbar";
import ComplaintBanner from "@/Usercomponents/ComplaintBanner";
import LayeredImageSection from "@/Usercomponents/LayeredImageSection";
import ProblemStatement from "@/Usercomponents/ProblemStatement";
import Image from "next/image";
import ComplaintsInsightsHeader from "@/Usercomponents/ComplaintsInsightsHeader";
import StudentComplaintsCard from "@/Usercomponents/StudentComplaintsCard";
import Footer from "@/Usercomponents/Footer";
import Sidebar from "@/Usercomponents/Sidebar";

function Home() {
  return (
    <section>
        <Navbar />
        <Sidebar />
        <ComplaintBanner
            smallText="You know what?"
            largeText="There's always a"
            largeTextHighlight="Complaint"
            buttonText='Get started'
            sideText="File in your complaints now"
            buttonHeight='h-[42px]'
            buttonWidth= 'w-[152px]'
            onButtonClick={() => console.log('Button clicked!')}
        />
       
    
        <LayeredImageSection
            mainImageSrc="/images/hero-bg.svg"
            mainImageAlt="Main graphic showing system"
        />

        <ProblemStatement
            // Text content
            labelText="Problem statement"
            titleText="Addressing the concern of student complaint at the ICT University"
            descriptionText="University students have a superpower: complaining (and rightfully so!). Whether it's about a missing grade, a Wi-Fi outage, or the legendary unavailability of a lecturer, complaints pile up faster than class assignments. But where do these complaints go? The WhatsApp group? Tech admin's desk, never to be seen again?"
            labelSize='20px'

            rightColumnRatio="medium"  // Options: "small", "medium", "large"
            stackOnMobile={true}       // Stack on mobile or keep side-by-side


            // Optional styling adjustments
            labelColor="text-secondary-500"
            titleColor="text-primary-950"
            descriptionColor="text-darkColor"

            // Optional right column content
            rightColumnClassName="bg-greyColor rounded-[55px]"
            rightColumnContent={
                <Image
                    src="/images/dummy.jpg"
                    alt="Students discussing concerns"
                    className="w-full h-full object-cover"
                    width={575}
                    height={348}
                />
            }
        />

        <ProblemStatement
            // Text content
            labelText="Problem statement"
            titleText="Addressing the concern of student complaint at the ICT University"
            descriptionText="University students have a superpower: complaining (and rightfully so!). Whether it's about a missing grade, a Wi-Fi outage, or the legendary unavailability of a lecturer, complaints pile up faster than class assignments. But where do these complaints go? The WhatsApp group? Tech admin's desk, never to be seen again?"
            labelSize='20px'

            rightColumnRatio="medium"  // Options: "small", "medium", "large"
            stackOnMobile={true}       // Stack on mobile or keep side-by-side


            // Optional styling adjustments
            labelColor="text-secondary-500"
            titleColor="text-primary-950"
            descriptionColor="text-darkColor"

            // Optional right column content
            rightColumnClassName="bg-greyColor rounded-[55px]"
            rightColumnContent={
                <Image
                    src="/images/dummy.jpg"
                    alt="Students discussing concerns"
                    className="w-full h-full object-cover"
                    width={575}
                    height={348}
                />
            }
        />

        <ComplaintsInsightsHeader
        labelText="Complaints Insights"
        labelColor="text-secondary-500"
        labelSize='20px'
        headingColor="text-primary-950"
        descriptionColor='text-darkColor'
        />

        <StudentComplaintsCard />

        <ComplaintBanner
            smallText="Happens that"
            largeText="There's always a"
            largeTextHighlight="Complaint"
            sideText="A better way"
            onButtonClick={() => console.log('Button clicked!')}
            buttonText='Start complaining right now'
            buttonHeight='h-[42px]'
            buttonWidth= 'w-[246px]'
            textSize='text-button-primary'
        />

        <Footer
        leftContent={
            <>
                <Image
                src='/images/logo-text.png'
                alt="ICTU Logo"
                width={87.66}
                height={37.97}
                />
            </>
        }
        rightContent={<p>© 2025 - ICTU Complaint Desk. All rights reserved.</p>}
        />
   </section>
  );
}
export default withPublic(Home);
