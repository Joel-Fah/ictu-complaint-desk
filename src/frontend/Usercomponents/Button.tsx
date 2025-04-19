"use client";

import Image from 'next/image';


export default function Button() {
    const handleLogin = () => {
        window.location.href = 'http://localhost:8000/accounts/google/login/?process=login';
    }
    return (
        <button type={"submit"} onClick={handleLogin} className="flex items-center justify-center
        w-full lg:max-w-[40rem] max-w-[23rem] mx-auto
        px-6 py-4
        border-2 border-secondary-500 border-dashed
        rounded-[2rem]
        text-secondary-500 bg-orange-100 hover:bg-orange-200
        sm:px-10 sm:py-5
        md:px-20 md:py-6
        md:max-w-[40rem]
        lg:px-28 lg:py-8
      "
        >
            <Image src="/images/Google__G__logo logo.png" alt="Google Logo" width={24} height={24} className="mr-3"/>
            <span className="text-sm sm:text-base md:text-lg font-sans">
            Sign in with your <strong>ICT University Account</strong>
            </span>

        </button>
    )

}