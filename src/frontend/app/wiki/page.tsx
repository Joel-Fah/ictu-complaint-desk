"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";

const steps = [
    {
        title: "Step 1: Login In",
        description: "Register using your ICT university email address to get started.",
        mediaType: "video",
        mediaSrc: "/videos/how-to-login.mp4",
    },
    {
        title: "Step 2: How to submit a complaint",
        description: "Click the New Complaint button on the bottom right of the dashboard, fill the form correctly and completely, you are good to go.",
        mediaType: "video",
        mediaSrc: "/videos/how-to-submit-a-complaint.mp4",
    },
    {
        title: "Step 3: How to check your complaint status",
        description: "Select a complaint and under you will see its complaint status at the right most part of the dashboard.",
        mediaType: "image",
        mediaSrc: "/images/status.png",
    },
    {
        title: "Where your complaints go?",
        description: "They are sent to people and/or entities in charge of that particular category like lecturer, administrators and so on.",
        mediaType: "image",
        mediaSrc: "/images/dummy.jpg",
    },
    {
        title: "What happens after submission?",
        description: "They move from person to person, entity to entity until your complaint is resolved.",
        mediaType: "image",
        mediaSrc: "/images/dummy.jpg",
    },
];

const Wiki = () => {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    return (
        <>
            <div className="px-6 py-12 max-w-5xl mx-auto space-y-10">
                <h2 className="text-3xl font-bold text-center">How It Works</h2>

                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="flex flex-col md:flex-row items-center gap-6 md:gap-12"
                        data-aos="fade-up"
                        data-aos-delay={index * 200}
                    >
                        <div className="flex-1 space-y-2">
                            <h3 className="text-xl font-semibold">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                        </div>

                        <div className="flex-1 max-w-md w-full">
                            {step.mediaType === "image" ? (
                                <Image
                                    src={step.mediaSrc}
                                    alt={step.title}
                                    width={575}
                                    height={348}
                                    className="rounded-xl shadow-md w-full object-cover"
                                />
                            ) : (
                                <video
                                    src={step.mediaSrc}
                                    controls={false}
                                    className="rounded-xl shadow-md w-full"
                                    loop={true}
                                    autoPlay={true}
                                    muted={true}
                                    playsInline={true}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
export default Wiki