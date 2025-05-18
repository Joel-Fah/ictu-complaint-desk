"use client";

import {withPublic} from "@/lib/withPublic";
import "@/app/globals.css"
import Image from 'next/image';
import Button from "@/Usercomponents/Button";

function LoginPage() {
    return (
        <section>
            <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-50">
                <div className="flex justify-center mt-8">
                    <Image src="/images/logo-text.png" alt="ICTU Complaint Desk Logo" width={175.31} height={75.94}/>
                </div>
                <h1 className="text-center mt-10 md:text-[24px] text-[22px] font-semibold mb-2">Must be bad if you’re
                    here</h1>
                <p className="text-center text-body text-black font-sans mb-24">Well, sign in first and let’s see how we
                    can help.</p>

                <Button
                    type="submit"
                    onClick={() => window.location.href = 'http://localhost:8000/accounts/google/login/?process=login'}
                    text="Sign in with your"
                    strongText="ICT University Account"
                    imageSrc="/images/Google__G__logo logo.png"
                    imageAlt="Google Logo"
                    imageWidth={24}
                    imageHeight={24}
                    border="border-2 border-secondary-500 border-dashed"
                    borderRadius="rounded-[2rem]"
                    textColor="text-secondary-500"
                    bgColor="bg-orange-100"
                    hoverBgColor="hover:bg-orange-200"
                    padding="px-6 py-4 sm:px-10 sm:py-5 md:px-20 md:py-6 lg:px-28 lg:py-8"
                    width="w-full lg:max-w-[40rem] max-w-[23rem] mx-auto"
                    fontSize="text-sm sm:text-base md:text-lg"
                    fontFamily="font-sans"
                />
            </div>
        </section>
    );
}

export default withPublic(LoginPage);
