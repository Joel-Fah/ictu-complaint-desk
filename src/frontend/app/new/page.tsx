'use client'
import React, {useEffect, useState} from 'react';
import Button from '@/Usercomponents/Button'
import Image from 'next/image';
import RichTextEditor from "@/Usercomponents/RichTextEditor";
import FileUploadPreview from "@/Usercomponents/FileUploadPreview";
import { useUserStore } from '@/stores/userStore';
import { useCategoryStore } from "@/stores/categoryStore";
import {useCourseStore} from "@/stores/useCourseStore";
import { getUserById } from "@/lib/api";
import { createComplaint } from "@/lib/api";
import {toast} from "sonner";
import ToastNotification from "@/Usercomponents/ToastNotifications";
import {useRouter} from "next/navigation";

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
    const [selectedCategory, setSelectedCategory] = useState("");
    const { courses, fetchCourses } = useCourseStore();
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [lecturerName, setLecturerName] = useState("");
    const [semester, setSemester] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        category: '',
        semester: '',
        complaintTitle: '',
        courseCode: '',
        description: '',
        attachments: []
    });

    const isFormValid = selectedCategory && selectedCourseId && semester &&
        formData.complaintTitle.trim() && formData.description.trim();

    const selectedCourse = courses.find((course) => course.id === Number(selectedCourseId));

    const user = useUserStore((state) => state.user);
    const currentYear = new Date().getFullYear();


    const studentProfile = user?.profiles?.find(p => p.type === "student");
    const studentNumber = studentProfile?.data?.student_number;

    useEffect(() => {
        if (!selectedCourse) return;
        const fetchLecturerName = async () => {
            if (selectedCourse?.lecturer) {
                try {
                    const lecturer = await getUserById(selectedCourse.lecturer);
                    setLecturerName(lecturer.first_name || `${lecturer.first_name} ${lecturer.last_name}`);
                } catch (error) {
                    console.error("Failed to fetch lecturer name:", error);
                    setLecturerName("Unknown");
                }
            } else {
                setLecturerName("");
            }

        };
        fetchLecturerName();

    }, [setLecturerName, selectedCourse]);

    useEffect(() => {
        fetchCourses();
        fetchCategories();
    }, [fetchCategories, fetchCourses]);

    const goBack = () => {
        router.back(); // Navigates to the previous page in history
    };

    const handleSubmit = async () => {
        if (!isFormValid || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const payload = {
                category: parseInt(selectedCategory),
                semester,
                title: formData.complaintTitle,
                course: parseInt(selectedCourseId),
                description: formData.description,
                student: user?.id
            };


            console.log("Complaint Payload:", payload);
            await createComplaint(payload);

            toast.custom((t) => (
                <ToastNotification
                    type="success"
                    title="Complaint filed!"
                    subtitle="Congratulations you are one step closer to peace of mind"
                    onClose={() => toast.dismiss(t)}
                    showClose
                />
            ), { duration: 4000 });
            goBack();
        } catch (err) {
            console.error("Submission error:", err);
            toast.custom((t) => (
                <ToastNotification
                    type="error"
                    title="Something went wrong!"
                    subtitle="There seems to be a problem. Please try again. Contact an admin if problem persists"
                    onClose={() => toast.dismiss(t)}
                    showClose
                />
            ), { duration: 4000 });
            goBack();
        } finally {
            setIsSubmitting(false);
        }
    };
    


    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    {/**
     const handleFileUpload = (files: FileList | null) => {
     if (files) {
     setFormData(prev => ({
     ...prev,
     attachments: [...prev.attachments, ...Array.from(files)]
     }));
     }
     };
     **/}

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-[400px] bg-primary-950 text-white p-6 flex-shrink-0">
                <div className="mb-8">
                    <Image
                        src="/icons/arrow-left-03.svg"
                        width={24}
                        height={24}
                        alt="Back icon"
                        onClick={goBack}
                    />

                    <h1 className="text-h1 font-bold mb-2 font-heading text-whiteColor">
                        You are submitting a new complaint
                    </h1>

                    <p className="text-sm text-primary-50 leading-relaxed">
                        This form is for you to get in touch with us.
                        Briefly and clearly express your complaint or
                        concern. If you have any supporting evidence/
                        document, please do not forget to include as
                        attached files.
                    </p>
                </div>

                <div className="flex flex-col items-start justify-center rounded-[20px] border border-primary-800 gap-2 px-5 py-4">
                    <div className="text-sm text-primary-50">Submitting as:</div>
                    <div className="text-xl font-heading font-semibold">
                        {user?.fullName ? user.fullName.split(" ").slice(0, 2).join(" ") : "User"} ({studentNumber})
                    </div>
                </div>

                <div className="mt-16">
                    <h3 className="font-medium mb-3">Useful Resources</h3>
                    <hr className="border-primary-50 mb-4" />
                    <ul className="text-sm text-indigo-200 space-y-2 ">
                        <li className="flex items-start space-x-2 gap-0.5">
                            <Image src="/icons/help-circle.svg" alt={"question-mark icon"} height={16} width={16}/>
                            <p>How to properly submit complaints at ICTU</p>
                        </li>
                        <li className="flex items-start space-x-2 gap-0.5">
                            <Image src="/icons/help-circle.svg" alt={"question-mark icon"} height={16} width={16}/>
                            <p>Get to know the ICTU administration</p>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Right Form Area */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-2xl mx-auto p-8">
                    <h2 className="text-h1 font-semibold text-primary-950 mb-8">General Information</h2>

                    <div className="space-y-6">
                        {/* Category and Semester Row */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-primary-950 block mb-1">
                                    Category
                                </label>
                                <div className="relative">
                                    <select
                                        id="category"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="appearance-none w-full bg-transparent text-xl text-primary-950 border-0 border-b border-primary-950 focus:ring-0 focus:outline-none pr-6"
                                        required={true}
                                    >
                                        <option value="" disabled>
                                            What type of complaint is it?
                                        </option>
                                        {Object.values(categories).map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <Image
                                        src="/icons/arrow-down-01.svg"
                                        width={24}
                                        height={24}
                                        alt="arrow-right-icon"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>

                                <div className="relative">
                                    <label className="block text-sm text-primary-950 mb-1">
                                        Semester
                                    </label>

                                    <div className="relative border-b border-primary-950">
                                        <div className="flex items-center">
                                            <select
                                                id="semester"
                                                value={semester}
                                                onChange={(e) => setSemester(e.target.value)}
                                                className="appearance-none bg-transparent w-full text-xl text-primary-950 focus:outline-none"
                                                required={true}
                                            >
                                                <option value="" disabled>
                                                    Select from list
                                                </option>
                                                <option value="Spring">Spring</option>
                                                <option value="Fall">Fall</option>
                                                <option value="Summer">Summer</option>
                                            </select>
                                            <span className="text-sm text-orange-600 bg-orange-100 rounded-full px-2.5 py-0.5 mr-8">
                                             {currentYear}
                                            </span>

                                            <div
                                                className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 z-10">
                                                <Image
                                                    src="/icons/arrow-down-01.svg"
                                                    width={24}
                                                    height={24}
                                                    alt="arrow-right-icon"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Complaint Title */}
                        <div>
                            <label className="block text-sm text-primary-950 mb-2">
                                Complaint title
                            </label>
                            <input
                                type="text"
                                className="border-b text-primary-950 font-sans text-xl border-primary-950 w-full p-3 appearance-none bg-transparent focus:ring-0 focus:outline-none"
                                value={formData.complaintTitle}
                                onChange={(e) => handleInputChange('complaintTitle', e.target.value)}
                                required={true}
                            />
                        </div>

                        {/* Course Code/Department */}
                        <div>
                            <label className="block text-sm text-primary-950 mb-2">
                                Course concerned
                            </label>
                            <div className="relative">
                                <select
                                    id="category"
                                    value={selectedCourseId}
                                    onChange={(e) => setSelectedCourseId(e.target.value)}
                                    className="appearance-none w-full bg-transparent text-xl text-primary-950 border-0 border-b border-primary-950 focus:ring-0 focus:outline-none pr-6"
                                    required={true}
                                >
                                    <option value="" disabled>
                                        For what course are you complaining?
                                    </option>
                                    {courses.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.code} {course.title}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Image
                                        src="/icons/arrow-down-01.svg"
                                        width={24}
                                        height={24}
                                        alt="arrow-right-icon"
                                    />
                                </div>
                            </div>
                            {selectedCourse && (
                                <p className="text-xs text-orange-500 bg-orange-100 rounded-xl w-48 mt-2 py-2 px-2">
                                    Taught by: {lecturerName}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xl font-semibold text-primary-950 mb-8">
                                Description
                            </label>
                            <RichTextEditor
                                value={formData.description}
                                onChange={(val) => handleInputChange("description", val)}
                            />
                            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                Kindly ensure that all complaint details are clearly explained, because resolving a complaint quickly depends on how clear it is. For this reason, Please ensure that all of required details related to the complaint are adequately provided above. Ensure that your complaint is adequately described. Use simple English to make your complaint easy to understand. Avoid using abbreviations that may not be understood by everyone. Use full sentences and proper punctuation. Spell out numbers less than ten (except when used in statistics, dates, or technical contexts). This will help in ensuring that your complaint is understood and resolved quickly.
                            </p>
                        </div>

                        {/* Attachments */}
                        <label className="block text-xl font-semibold text-primary-950 mb-8">
                            Attachment(s)
                            <span className="text-primary-950 ml-1 text-sm bg-primary-50 px-1 rounded">1</span>
                        </label>

                        <div className="flex flex-row justify-between items-start gap-4">
                            <FileUploadPreview />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                bgColor={"bg-primary-800"}
                                textColor={"text-primary-50 text-xl font-medium"}
                                onClick={handleSubmit}
                                text={"Submit complaint"}
                                border={"border-none"}
                                rightImageSrc={"icons/arrow-down-01-white.svg"}
                                rightImageWidth={18}
                                rightImageHeight={19}
                                rightImageAlt={"dropdown icon"}
                                showRightSeparator={true}
                                width={"w-[200px]"}
                                padding={"px-[12px] py-[10px]"}
                                borderRadius={"rounded-xl"}
                                disabled={!isFormValid || isSubmitting}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintForm;