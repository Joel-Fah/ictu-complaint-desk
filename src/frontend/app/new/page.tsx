'use client'
import React, { useState } from 'react';
import Button from '@/Usercomponents/Button'
import Image from 'next/image';
import RichTextEditor from "@/Usercomponents/RichTextEditor";
import FileUploadPreview from "@/Usercomponents/FileUploadPreview";

interface FormData {
    category: string;
    semester: string;
    complaintTitle: string;
    courseCode: string;
    description: string;
    attachments: File[];
}

const ComplaintForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        category: 'Missing grade',
        semester: 'Spring',
        complaintTitle: 'No grade for computational maths',
        courseCode: 'MTH2222 Computational Maths',
        description: '',
        attachments: []
    });

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileUpload = (files: FileList | null) => {
        if (files) {
            setFormData(prev => ({
                ...prev,
                attachments: [...prev.attachments, ...Array.from(files)]
            }));
        }
    };

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
                        Dajen Fah Joel (ICT20240004)
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
                                        className="appearance-none w-full bg-transparent text-xl text-primary-950 border-0 border-b border-primary-950 focus:ring-0 focus:outline-none pr-6"
                                    >
                                        <option>Missing grade</option>
                                        <option>Course registration</option>
                                        <option>Library fines</option>
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
                                                className="appearance-none bg-transparent w-full text-xl text-primary-950 focus:outline-none"
                                            >
                                                <option value="spring">Spring</option>
                                                <option value="fall">Fall</option>
                                                <option value="spring">Summer</option>
                                            </select>
                                            <span className="text-sm text-orange-600 bg-orange-100 rounded-full px-2.5 py-0.5 mr-8">
                                             2025
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
                                    className="appearance-none w-full bg-transparent text-xl text-primary-950 border-0 border-b border-primary-950 focus:ring-0 focus:outline-none pr-6"
                                >
                                    <option>MTH2222 Computational Maths</option>
                                    <option>CSC2112 Computational Object Oriented Programming with Python</option>
                                    <option>BMS2244 Civics and Ethics</option>
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
                            <p className="text-xs text-orange-500 bg-orange-100 rounded-xl w-48 mt-2 py-2 px-2">
                                Taught by: Engr. Andrew Agbor
                            </p>
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
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintForm;