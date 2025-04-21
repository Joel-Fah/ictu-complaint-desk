"use client";

import {withPublic} from "@/lib/withPublic";
import "@/app/globals.css"
import Image from 'next/image';
import Button from "@/Usercomponents/Button";


function LoginPage() {
    return (
        // <section>
        //     <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-50">
        //         <div className="flex justify-center mt-8">
        //             <Image src="/images/logo-text.png" alt="ICTU Complaint Desk Logo" width={175.31} height={75.94} />
        //         </div>
        //         <h1 className="text-center mt-10 text-h2 font-semibold font-heading mb-2">Welcome to sign in</h1>
        //     </div>
        // </section>
        <section>
            <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-50">
                <div className="flex justify-center mt-8">
                    <Image src="/images/logo-text.png" alt="ICTU Complaint Desk Logo" width={175.31} height={75.94}/>
                </div>
                <h1 className="text-center mt-10 md:text-[24px] text-[22px] font-semibold mb-2">Must be bad if you’re
                    here</h1>
                <p className="text-center text-body text-black font-sans mb-24">Well, sign in first and let’s see how we
                    can help.</p>

                <Button/>
            </div>
        </section>
    );
}

export default withPublic(LoginPage);
