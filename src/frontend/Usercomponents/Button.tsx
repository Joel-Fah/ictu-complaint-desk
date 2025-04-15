import Image from 'next/image';
export default function Button () {
    return (
        <button className="flex flex-row items-center justify-center mt-20 px-36 py-8 border-2 border-secondary-500 border-dashed rounded-[37px] text-secondary-500 bg-orange-100">
            <Image src="/images/Google__G__logo logo.png" alt="Google Logo" width={24} height={24} className="mx-4"/>
            <span className="text-body font-sans">Sign in with your</span> <span className="text-body font-bold font-sans">&nbsp;ICT University Account</span>
        </button>
    )

}