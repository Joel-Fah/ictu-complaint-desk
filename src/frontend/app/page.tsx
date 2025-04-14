import "../app/globals.css";
import Button from "../Usercomponents/Button";
import Image from 'next/image';


export default function Home() {
  return (
    <section>
        <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-50">
            <div className="flex justify-center mt-8">
                <Image src="/images/logo-text.png" alt="ICTU Complaint Desk Logo" width={175.31} height={75.94} />
            </div>
            <h1 className="text-center mt-10 text-h2 font-semibold font-heading mb-2">Must be bad if you’re here</h1>
            <p className="text-center text-body text-black font-sans">Well, sign in first and let’s see how we can help.</p>
            <Button />
        </div>
    </section>
  );
}
