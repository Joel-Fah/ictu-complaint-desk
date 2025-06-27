'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Skill {
    label: string;
    value: number;
}

interface TeamMember {
    id: number;
    name: string;
    role: string;
    bgColor: string;
    hoverColor: string;
    image: string;
    skills?: Skill[];
}

const skillCategories = [
    { title: 'Overall Programming Skill', key: 'PROGRAMMING SKILL' },
    { title: 'Backend Development', key: 'BACKEND' },
    { title: 'Frontend Development', key: 'FRONTEND' },
    { title: 'Leadership', key: 'LEADERSHIP' },
    { title: 'Creativity', key: 'CREATIVITY' },
    { title: 'Debugging Skill', key: 'DEBUGGING' },
    { title: 'Confidence', key: 'CONFIDENCE' },
    { title: 'Curiosity', key: 'CURIOSITY' },
    { title: 'Database Deletion', key: 'DATABASE DELETION' },
    { title: 'Bug Summoning', key: 'BUG SUMMONING' },
    { title: 'Sleep Deprivation', key: 'SLEEP' },
    { title: 'Bad Message Response Time', key: 'MESSAGE RESPONSE TIME' },
    { title: 'Avoiding Tests', key: 'AVOIDING TESTS' },
    { title: 'Overthinking Quotient', key: 'OVERTHINKING' },
    { title: 'Violence Potential', key: 'VIOLENCE' },
    { title: 'Bad Electricity', key: 'ELECTRICITY' },
];

const teamMembers: TeamMember[] = [
    {
        id: 1,
        name: 'DEJON JOEL XAVIER FAH',
        role: 'SCRUM MASTER',
        bgColor: 'bg-cyan-400',
        hoverColor: 'hover:bg-cyan-500',
        image: '/images/DEJON_JOEL_XAVIER_FAH.jpg',
        skills: [
            { label: 'DESIGN SKILL', value: 70 },
            { label: 'PROGRAMMING SKILL', value: 75 },
            { label: 'BACKEND', value: 85 },
            { label: 'DEBUGGING', value: 80 },
            { label: 'CREATIVITY', value: 60 },
            { label: 'DATABASE DELETION', value: 70 },
            { label: 'SLEEP DEPRIVATION', value: 85 },
            { label: 'OVERTHINKING', value: 60 },
        ]
    },
    {
        id: 2,
        name: 'EGBE MICHEL TAMBE',
        role: 'PRODUCT OWNER',
        bgColor: 'bg-purple-600',
        hoverColor: 'hover:bg-purple-700',
        image: '/images/EGBE_MICHEL_TAMBE.jpg',
        skills: [
            { label: 'DESIGN SKILL', value: 70 },
            { label: 'PROGRAMMING SKILL', value: 75 },
            { label: 'LEADERSHIP', value: 90 },
            { label: 'SLEEP', value: 10 },
            { label: 'DEBUGGING', value: 85 },
            { label: 'OVERTHINKING', value: 100 },
            { label: 'FRONTEND', value: 90 }
        ]
    },
    {
        id: 3,
        name: 'NNAMU RADIANCE KINGA',
        role: 'BACKEND DEVELOPER',
        bgColor: 'bg-lime-400',
        hoverColor: 'hover:bg-lime-500',
        image: '/images/NNAMU_RADIANCE_KINGA.jpg',
        skills: [
            { label: 'BACKEND', value: 70 },
            { label: 'PROGRAMMING SKILL', value: 65 },
            { label: 'API INTEGRATION', value: 80 },
            { label: 'COOKING', value: 80 },
            { label: 'VIOLENCE', value: 100 },
            { label: 'AVOIDING TESTS', value: 90 }
        ]
    },
    {
        id: 4,
        name: 'TIM CHANTAL NEWUH',
        role: 'FRONTEND DEVELOPER',
        bgColor: 'bg-orange-500',
        hoverColor: 'hover:bg-orange-600',
        image: '/images/TIM_CHANTAL_NEWUH.jpg',
        skills: [
            { label: 'WILLING TO LEARN', value: 100 },
            { label: 'CONFIDENCE', value: 50 },
            { label: 'PROGRAMMING SKILL', value: 62 },
            { label: 'CURIOSITY', value: 100 },
            { label: 'MAKING DEADLINES', value: 50 },
            { label: 'FRONTEND', value: 85 },
        ]
    },
    {
        id: 5,
        name: 'BUMA GLORY LEINA YETTY',
        role: 'FRONTEND DEVELOPER',
        bgColor: 'bg-pink-500',
        hoverColor: 'hover:bg-pink-600',
        image: '/images/BUMA__GLORY_LEINA_YETTY.jpg',
        skills: [
            { label: 'TASK COMPLETION', value: 60 },
            { label: 'PROGRAMMING SKILL', value: 30 },
            { label: 'CONFIDENCE', value: 35 },
            { label: 'CREATIVITY', value: 80 },
            { label: 'ELECTRICITY', value: 90 },
            { label: 'FRONTEND', value: 60 }
        ]
    },
    {
        id: 6,
        name: 'TAMBI TAMBI EMMANUEL',
        role: 'FRONTEND DEVELOPER',
        bgColor: 'bg-purple-600',
        hoverColor: 'hover:bg-purple-700',
        image: '/images/TAMBI_TAMBI_EMMANUEL.jpg',
        skills: [
            { label: 'WILLING TO LEARN', value: 100 },
            { label: 'PROGRAMMING SKILL', value: 60 },
            { label: 'MESSAGE RESPONSE TIME', value: 0.5 },
            { label: 'HUMBLE', value: 100 },
            { label: 'BUG SUMMONING', value: 99 },
            { label: 'FRONTEND', value: 65 }
        ]
    }
];

const TeamAboutUs = () => {
    const [hoveredMember, setHoveredMember] = useState<number | null>(null);

    return (
        <div className="bg-gray-900 text-white min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Meet the Team</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                    <div
                        key={member.id}
                        className={`relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${member.bgColor} ${member.hoverColor}`}
                        onMouseEnter={() => setHoveredMember(member.id)}
                        onMouseLeave={() => setHoveredMember(null)}
                    >
                        {/* Normal State */}
                        <div className={`transition-all duration-500 ${hoveredMember === member.id ? 'opacity-0' : 'opacity-100'}`}>
                            <div className="aspect-square relative">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    width={100}
                                    height={100}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                            </div>
                            <div className="p-4 sm:p-6 text-white">
                                <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 tracking-wider">{member.name}</h3>
                                <p className="text-xs sm:text-sm font-medium opacity-90 tracking-wide">{member.role}</p>
                            </div>
                        </div>

                        {/* Hover State */}
                        <div className={`absolute inset-0 transition-all duration-500 ${hoveredMember === member.id ? 'opacity-100' : 'opacity-0'} flex flex-col justify-center items-center text-white p-4 sm:p-6`}>
                            <div className="text-center">
                                <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 tracking-wider">{member.name}</h3>
                                <p className="text-xs sm:text-sm font-medium mb-4 sm:mb-6 opacity-90 tracking-wide">{member.role}</p>
                                <div className="w-full space-y-2">
                                    {member.skills?.map((skill, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span>{skill.label}</span>
                                                <span>{skill.value}</span>
                                            </div>
                                            <div className="w-full bg-white bg-opacity-20 h-2 rounded-full">
                                                <div className="h-2 rounded-full bg-white transition-all duration-700" style={{ width: `${skill.value}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Overall Leaderboard */}
            <div className="flex justify-center mt-20 mb-6">
                <Image
                    src="/images/grp-pic.jpg"
                    alt="Leaderboard Banner"
                    width={800}
                    height={200}
                    className="rounded-xl shadow-md w-full max-w-4xl h-auto object-cover"
                />
            </div>

            <h2 className="text-2xl font-bold mt-16 mb-6 text-center">Team Leaderboard</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
                {[...teamMembers]
                    .map((m) => ({ ...m, total: m.skills?.reduce((sum, s) => sum + s.value, 0) || 0 }))
                    .sort((a, b) => b.total - a.total)
                    .map((m, index) => (
                        <div key={m.id} className="bg-white bg-opacity-10 p-4 rounded-lg">
                            <div className="flex justify-between">
                                <span>#{index + 1} {m.name}</span>
                                <span>{m.total} pts</span>
                            </div>
                            <div className="w-full h-2 bg-white bg-opacity-20 rounded-full mt-2">
                                <div className="h-2 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full" style={{ width: `${(m.total / 600) * 100}%` }}></div>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Category Rankings */}
            <h2 className="text-2xl font-bold mt-16 mb-6 text-center">Category Rankings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {skillCategories.map((cat) => {
                    const top = teamMembers
                        .map((member) => {
                            const skill = member.skills?.find((s) => s.label.toUpperCase() === cat.key.toUpperCase());
                            return { name: member.name, value: skill?.value || 0 };
                        })
                        .filter((s) => s.value > 0)
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 3);

                    if (top.length === 0) return null;

                    return (
                        <div key={cat.key} className="bg-white bg-opacity-5 p-4 rounded-xl">
                            <h3 className="text-lg font-bold mb-3">{cat.title}</h3>
                            {top.map((p, i) => (
                                <div key={p.name} className="mb-2">
                                    <div className="flex justify-between text-sm">
                                        <span>#{i + 1} {p.name}</span>
                                        <span>{p.value} pts</span>
                                    </div>
                                    <div className="w-full h-2 bg-white bg-opacity-20 rounded-full">
                                        <div className="h-2 bg-purple-500 rounded-full" style={{ width: `${p.value}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TeamAboutUs;
