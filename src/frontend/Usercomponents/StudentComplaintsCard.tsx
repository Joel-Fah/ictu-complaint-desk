'use client';

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Load odometer dynamically to avoid SSR issues
const Odometer = dynamic(() => import('react-odometerjs'), { ssr: false });

export default function StudentComplaintsCard() {
    const [hasAnimated, setHasAnimated] = useState(false);
    const [typedText, setTypedText] = useState("");
    const fullText = "Top Complaints";
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Observer for animation trigger
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    observer.disconnect();
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.4,
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [hasAnimated]);

    // Typewriter effect for heading
    useEffect(() => {
        if (hasAnimated) {
            let index = 0;
            const interval = setInterval(() => {
                setTypedText(fullText.slice(0, index + 1));
                index++;
                if (index === fullText.length) clearInterval(interval);
            }, 100); // speed of typing

            return () => clearInterval(interval);
        }
    }, [hasAnimated]);

    return (
        <section
            ref={containerRef}
            className="w-full px-4 sm:px-8 md:px-16 lg:px-24 py-10 font-heading"
        >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-10">
                {/* Left - Image */}
                <div className="w-full md:w-1/2">
                    <div className="relative w-full aspect-[3/4] rounded-[2rem] overflow-hidden">
                        <Image
                            src="/images/students.jpg"
                            alt="Students discussing complaints"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Right - Text and Stats */}
                <div className="w-full md:w-1/2 space-y-6 text-primary-950">
                    <div>
                        <h2 className="text-5xl sm:text-6xl font-medium">
                            <Odometer
                                value={hasAnimated ? 46.32 : 0}
                                format="(,ddd).dd"
                                duration={3000}
                            />
                            %
                        </h2>
                        <p className="text-body sm:text-base mt-1 text-darkColor">
                            Of students file complaints and feel they vanish into thin air.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-5xl sm:text-6xl font-medium">
                            <Odometer
                                value={hasAnimated ? 2 : 0}
                                format="d"
                                duration={3000}
                            />{" "}
                            out of 5
                        </h2>
                        <p className="text-body sm:text-base mt-1 text-darkColor">
                            Students have never gotten feedback after reporting an issue and
                            find it difficult later on to keep track of the resolution status.
                        </p>
                    </div>

                    {/* Top Complaints */}
                    <div>
                        <h2 className="text-5xl sm:text-6xl font-medium whitespace-nowrap">
                            {typedText}
                        </h2>

                        <motion.ul
                            className="list-disc pl-5 mt-2 text-darkColor text-body sm:text-base space-y-1"
                            initial="hidden"
                            animate={hasAnimated ? "visible" : "hidden"}
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.15,
                                    },
                                },
                                hidden: {},
                            }}
                        >
                            {[
                                "Missing grades",
                                "No CA mark",
                                "Unsatisfied with final grade",
                                "Grade not updated after review",
                                "Delay in grade publication",
                            ].map((item, index) => (
                                <motion.li
                                    key={index}
                                    variants={{
                                        hidden: { opacity: 0, x: 50 },
                                        visible: { opacity: 1, x: 0 },
                                    }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                >
                                    {item}
                                </motion.li>
                            ))}
                        </motion.ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
