'use client';
import "../app/globals.css";
import { withPublic } from "@/lib/withPublic";
import ComplaintBanner from "@/Usercomponents/ComplaintBanner";
import LayeredImageSection from "@/Usercomponents/LayeredImageSection";
import ProblemStatement from "@/Usercomponents/ProblemStatement";
import Image from "next/image";
import ComplaintsInsightsHeader from "@/Usercomponents/ComplaintsInsightsHeader";
import StudentComplaintsCard from "@/Usercomponents/StudentComplaintsCard";
import Footer from "@/Usercomponents/Footer";
import { getBaseUrl } from "@/app/utils/getBaseUrl";

const Home = () => {
  const handleLoginClick = () => {
    window.location.href = `${getBaseUrl()}/accounts/google/login/?process=login`;
  };

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <ComplaintBanner
          smallText="You know what?"
          largeText="There's always a"
          largeTextHighlight="Complaint"
          buttonText='Get started'
          sideText="File in your complaints now"
          buttonHeight='h-[42px]'
          buttonWidth='w-[152px]'
          onButtonClick={handleLoginClick}
        />
        
        <LayeredImageSection
          mainImageSrc="/images/hero-bg.svg"
          mainImageAlt="Main graphic showing system"
        />
      </section>

      {/* Problem Statement Section */}
      <section className="py-12">
        <ProblemStatement
          labelText="Problem statement"
          titleText="Addressing the concern of student complaint at the ICT University"
          descriptionText="University students have a superpower: complaining (and rightfully so!). Whether it's about a missing grade, a Wi-Fi outage, or the legendary unavailability of a lecturer, complaints pile up faster than class assignments. But where do these complaints go? The WhatsApp group? Tech admin's desk, never to be seen again?"
          labelSize='20px'
          rightColumnRatio="medium"
          stackOnMobile={true}
          labelColor="text-secondary-500"
          titleColor="text-primary-950"
          descriptionColor="text-darkColor"
          rightColumnClassName="rounded-[55px]"
          rightColumnContent={
            <Image
              src="/images/black-girl.jpg"
              alt="Students discussing concerns"
              className="w-full h-full object-cover"
              width={575}
              height={348}
              priority
            />
          }
        />
      </section>

      {/* Solution Section */}
      <section className="py-12 bg-gray-50">
        <ProblemStatement
          labelText="Solution Proposal"
          titleText="A Complaint Resolution System tailored for the ICT University"
          descriptionText='Enter our Complaint Resolution System (CRS) – a simple, structured way for students to submit, track, and resolve issues with real-time updates. No more "I sent an email, and no one replied!" frustrations. Just an efficient, no-nonsense complaint management system built for The ICT University.'
          labelSize='20px'
          rightColumnRatio="medium"
          stackOnMobile={true}
          labelColor="text-secondary-500"
          titleColor="text-primary-950"
          descriptionColor="text-darkColor"
          rightColumnClassName="rounded-[55px]"
          rightColumnContent={
            <Image
              src="/images/students-2.jpg"
              alt="Students discussing concerns"
              className="w-full h-full object-cover"
              width={575}
              height={348}
            />
          }
        />
      </section>

      {/* Insights Section */}
      <section className="py-12">
        <ComplaintsInsightsHeader
          labelText="Complaints Insights"
          labelColor="text-secondary-500"
          labelSize='20px'
          headingColor="text-primary-950"
          descriptionColor='text-darkColor'
        />
        <StudentComplaintsCard />
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary-50">
        <ComplaintBanner
          smallText="Happens that"
          largeText="There's always a"
          largeTextHighlight="Complaint"
          sideText="A better way"
          onButtonClick={handleLoginClick}
          buttonText='Start complaining right now'
          buttonHeight='h-[42px]'
          buttonWidth='w-[246px]'
          textSize='text-button-primary'
        />
      </section>

      {/* Footer */}
      <footer className="mt-auto">
        <Footer
          leftContent={
            <Image
              src='/images/logo-text.png'
              alt="ICTU Logo"
              width={87.66}
              height={37.97}
            />
          }
          rightContent={<p>© 2025 - ICTU Complaint Desk. All rights reserved.</p>}
        />
      </footer>
    </main>
  );
};

export default withPublic(Home);