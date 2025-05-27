"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "@/Usercomponents/Navbar";

const steps = [
    {
        title: "Step 1: Sign Up",
        description: "Register using your university email address to create an account.",
        mediaType: "image",
        mediaSrc: "/images/dummy.jpg",
    },
    {
        title: "Step 2: Log In",
        description: "Use your credentials to log in and access your dashboard.",
        mediaType: "image",
        mediaSrc: "/images/dummy.jpg",
    },
    {
        title: "Step 3: Submit a Complaint",
        description: "Select a complaint category, describe your issue, and hit submit.",
        mediaType: "image",
        mediaSrc: "/images/dummy.jpg",
    },
    {
        title: "Step 4: Track Progress",
        description: "Follow the progress of your complaint and receive feedback from staff.",
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
            <Navbar />
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
                                <img
                                    src={step.mediaSrc}
                                    alt={step.title}
                                    className="rounded-xl shadow-md w-full object-cover"
                                />
                            ) : (
                                <video
                                    src={step.mediaSrc}
                                    controls
                                    className="rounded-xl shadow-md w-full"
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