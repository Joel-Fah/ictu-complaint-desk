'use client'

import React, { useEffect, useState } from 'react';
import Button from '@/Usercomponents/Button';
import Image from 'next/image';
import RichTextEditor from "@/Usercomponents/RichTextEditor";
import FileUploadPreview from "@/Usercomponents/FileUploadPreview";
import { useUserStore } from '@/stores/userStore';
import { useCategoryStore } from "@/stores/categoryStore";
import { useCourseStore } from "@/stores/useCourseStore";
import { getUserById, createComplaint } from "@/lib/api";
import { toast } from "sonner";
import ToastNotification from "@/Usercomponents/ToastNotifications";
import { useRouter } from "next/navigation";
import {withAuth} from "@/lib/withAuth";

interface FormData {
    category: string;
    semester: string;
    complaintTitle: string;
    courseCode: string;
    description: string;
    attachments: File[];
}

const ComplaintForm: React.FC = () => {
    const { categories, fetchCategories } = useCategoryStore();
    const { courses, fetchCourses } = useCourseStore();
    const [attachments, setAttachments] = useState<File[]>([]);
    const [formData, setFormData] = useState<FormData>({
        category: '',
        semester: '',
        complaintTitle: '',
        courseCode: '',
        description: '',
        attachments: []
    });

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [lecturerName, setLecturerName] = useState("");
    const [semester, setSemester] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [hasMounted, setHasMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const user = useUserStore((s) => s.user);
    const currentYear = new Date().getFullYear();
    const router = useRouter();

    const selectedCourse = courses.find(c => c.id === Number(selectedCourseId));
    const studentProfile = user?.profiles?.find(p => p.type === "student");
    const studentNumber = studentProfile?.data?.student_number;
    const isFormValid = Boolean(selectedCategory && selectedCourseId && semester && formData.complaintTitle.trim() && formData.description.trim());

    useEffect(() => {
        setHasMounted(true);
        setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', () => setIsMobile(window.innerWidth < 768));
        fetchCategories();
        fetchCourses();
        return () => window.removeEventListener('resize', () => null);
    }, [fetchCategories, fetchCourses]);


    const lecturerUserId = selectedCourse?.lecturer?.user;

    useEffect(() => {
        if (typeof lecturerUserId !== 'number') {
            setLecturerName("");
            return;
        }

        getUserById(lecturerUserId)
            .then((lect) => {
                const name = `${lect.firstName} ${lect.lastName}`;
                setLecturerName(name);
            })
            .catch((err) => {
                console.error("Error fetching lecturer:", err);
                setLecturerName("Unknown");
            });
    }, [lecturerUserId]);




    const goBack = () => router.back();

    const handleInputChange = <K extends keyof FormData>(
        field: K,
        value: FormData[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!isFormValid || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await createComplaint({
                category: selectedCategory,
                semester,
                title: formData.complaintTitle,
                course: parseInt(selectedCourseId),
                description: formData.description,
                student: user?.id,
                attachments,
            });
            toast.custom(t => <ToastNotification type="success" title="Complaint filed!" subtitle="One step closer to peace of mind" onClose={() => toast.dismiss(t)} showClose />, { duration: 4000 });
            goBack();
        } catch {
            toast.custom(t => <ToastNotification type="error" title="Something went wrong!" subtitle="Please try again." onClose={() => toast.dismiss(t)} showClose />, { duration: 4000 });
            goBack();
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!hasMounted) return null;

    return (
        <div className="h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden relative">
            {/* Left Sidebar */}
            <div className={`
        bg-primary-950 text-white p-4 sm:p-5 md:p-6 flex-shrink-0
              w-full md:w-[400px] ${showForm ? "hidden md:block" : "block"}
            `}>
                <div className="mb-6 sm:mb-7 md:mb-8">
                    <Image src="/icons/arrow-left-03.svg" width={24} height={24} alt="Back icon" onClick={goBack} />
                    <h1 className="text-xl sm:text-2xl md:text-h1 font-bold mb-2 font-heading text-whiteColor">
                        You are submitting a new complaint
                    </h1>
                    <p className="text-xs sm:text-sm text-primary-50 leading-relaxed">
                        This form is for you to get in touch with us. Briefly and clearly express your complaint or concern. If you have any supporting evidence/documents, please include them.
                    </p>
                </div>

                <div className="flex flex-col items-start justify-center rounded-[20px] border border-primary-800 gap-2 px-4 sm:px-5 py-3 sm:py-4">
                    <div className="text-xs sm:text-sm text-primary-50">Submitting as:</div>
                    <div className="text-lg sm:text-xl font-heading font-semibold">
                        {user?.fullName?.split(" ").slice(0, 2).join(" ") ?? "User"} ({studentNumber})
                    </div>
                </div>

                <div className="mt-10 sm:mt-12 md:mt-16">
                    <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Useful Resources</h3>
                    <hr className="border-primary-50 mb-3 sm:mb-4" />
                    <ul className="text-xs sm:text-sm text-indigo-200 space-y-1.5 sm:space-y-2">
                        <li className="flex items-start space-x-2">
                            <Image src="/icons/help-circle.svg" height={16} width={16} alt="?" />
                            <p>How to properly submit complaints at ICTU</p>
                        </li>
                        <li className="flex items-start space-x-2">
                            <Image src="/icons/help-circle.svg" height={16} width={16} alt="?" />
                            <p>Get to know the ICTU administration</p>
                        </li>
                    </ul>
                </div>
            </div>

            {!showForm && (
                <button
                    className="md:hidden fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-primary-800 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full shadow-lg text-sm sm:text-base"
                    onClick={() => setShowForm(true)}
                >
                    Next
                </button>
            )}

            {showForm && (
                <button
                    className="md:hidden fixed bottom-4 left-4 sm:bottom-6 sm:left-6 bg-primary-800 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-md border z-10 text-sm sm:text-base"
                    onClick={() => setShowForm(false)}
                >
                    Back
                </button>
            )}

            {/* Right Form Area */}
            <div className={`flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 ${!showForm && isMobile ? "hidden" : "block w-full"}`}>
                <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
                    <h2 className="text-xl sm:text-2xl md:text-h1 font-semibold text-primary-950 mb-6 sm:mb-7 md:mb-8">General Information</h2>

                    <div className="space-y-5 sm:space-y-6">
                        {/* Category + Semester */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                            <div>
                                <label className="text-xs sm:text-sm text-primary-950 block mb-1">Category</label>
                                <div className="relative">
                                    <select
                                        className="appearance-none w-full bg-transparent text-lg sm:text-xl text-primary-950 border-0 border-b border-primary-950 focus:ring-0 focus:outline-none pr-6"
                                        value={selectedCategory}
                                        onChange={e => setSelectedCategory(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>What type of complaint is it?</option>
                                        {Object.values(categories).map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <Image src="/icons/arrow-down-01.svg" width={24} height={24} alt="▼" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs sm:text-sm text-primary-950 block mb-1">Semester</label>
                                <div className="relative border-b border-primary-950">
                                    <select
                                        className="appearance-none bg-transparent w-full text-lg sm:text-xl text-primary-950 focus:outline-none pr-6"
                                        value={semester}
                                        onChange={e => setSemester(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Select from list</option>
                                        <option value="Spring">Spring</option>
                                        <option value="Fall">Fall</option>
                                        <option value="Summer">Summer</option>
                                    </select>
                                    <span className="absolute right-8 top-1 text-xs sm:text-sm text-orange-600 bg-orange-100 rounded-full px-2.5 py-0.5">{currentYear}</span>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <Image src="/icons/arrow-down-01.svg" width={24} height={24} alt="▼" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Course */}
                        <div>
                            <label className="block text-xs sm:text-sm text-primary-950 mb-1.5 sm:mb-2">Course concerned</label>
                            <div className="relative">
                                <select
                                    className="appearance-none w-full bg-transparent text-lg sm:text-xl text-primary-950 border-0 border-b border-primary-950 focus:ring-0 focus:outline-none pr-6"
                                    value={selectedCourseId}
                                    onChange={e => setSelectedCourseId(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>For what course are you complaining?</option>
                                    {courses.map(c => (
                                        <option key={c.id} value={c.id}>{c.code} {c.title}</option>
                                    ))}
                                </select>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Image src="/icons/arrow-down-01.svg" width={24} height={24} alt="▼" />
                                </div>
                            </div>
                            {selectedCourse && (
                                <p className="text-[10px] sm:text-xs text-orange-500 bg-orange-100 rounded-xl w-40 sm:w-48 mt-2 py-1.5 px-2">Taught by: {lecturerName}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-lg sm:text-xl md:text-h1 font-semibold text-primary-950 mb-6 sm:mb-8">Description</label>
                            <RichTextEditor
                                value={formData.description}
                                onChange={val => handleInputChange('description', val.slice(0, 500))}
                            />
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-2 leading-relaxed">
                                Kindly ensure that all complaint details are clearly explained, because resolving a complaint quickly depends on how clear it is. For this reason, Please ensure that all of required details related to the complaint are adequately provided above. Ensure that your complaint is adequately described. Use simple English to make your complaint easy to understand. Avoid using abbreviations that may not be understood by everyone. Use full sentences and proper punctuation. Spell out numbers less than ten (except when used in statistics, dates, or technical contexts). This will help in ensuring that your complaint is understood and resolved quickly.
                            </p>
                        </div>

                        {/* Attachments + Submit */}
                        <label className="block text-lg sm:text-xl font-semibold text-primary-950 mb-6 sm:mb-8">
                            Attachment(s)
                            <span className="text-primary-950 ml-1 text-[10px] sm:text-sm bg-primary-50 px-1 rounded">{attachments.length}</span>
                        </label>
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <FileUploadPreview onFilesChange={setAttachments} />
                            <Button
                                type="submit"
                                bgColor="bg-primary-800"
                                textColor="text-primary-50 text-base sm:text-xl font-medium"
                                onClick={handleSubmit}
                                text="Submit complaint"
                                border="border-none"
                                rightImageSrc="icons/arrow-down-01-white.svg"
                                rightImageWidth={18}
                                rightImageHeight={19}
                                rightImageAlt=">"
                                showRightSeparator
                                width="w-full sm:w-[200px]"
                                padding="px-3 sm:px-[12px] py-2.5 sm:py-[10px]"
                                borderRadius="rounded-xl"
                                disabled={!isFormValid || isSubmitting}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withAuth(ComplaintForm);
