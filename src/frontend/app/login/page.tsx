import "@/app/globals.css"
import Image from 'next/image';


export default function Home() {
    return (
        <section>
            <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-50">
                <div className="flex justify-center mt-8">
                    <Image src="/images/logo-text.png" alt="ICTU Complaint Desk Logo" width={175.31} height={75.94} />
                </div>
                <h1 className="text-center mt-10 text-h2 font-semibold font-heading mb-2">Welcome to sign in</h1>
            </div>
        </section>
    );
}
