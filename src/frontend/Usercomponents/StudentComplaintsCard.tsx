import Image from "next/image";

export default function StudentComplaintsCard() {
    return (
        <section className="w-full px-4 sm:px-8 md:px-16 lg:px-24 py-10 font-heading">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-10">

                {/* Left - Responsive Image */}
                <div className="w-full md:w-1/2">
                    <div className="relative w-full aspect-[3/4] rounded-[2rem] overflow-hidden">
                        <Image
                            src="/images/dummy.jpg" // Replace with your actual image path
                            alt="Students discussing complaints"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Right - Text */}
                <div className="w-full md:w-1/2 space-y-6 text-primary-950">
                    <div>
                        <h2 className="text-5xl sm:text-6xl font-medium">46.32%</h2>
                        <p className="text-body sm:text-base mt-1 text-darkColor">
                            Of students file complaints and feel they vanish into thin air.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-5xl sm:text-6xl font-medium">2 out of 5</h2>
                        <p className="text-body sm:text-base mt-1 text-darkColor">
                            Students have never gotten feedback after reporting an issue and
                            find it difficult later on to keep track the resolution status of it.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-5xl sm:text-6xl font-medium">Top complaints</h2>
                        <ul className="list-disc pl-5 mt-2 text-darkColor text-body sm:text-base space-y-1">
                            <li>Missing grades</li>
                            <li>No CA mark</li>
                            <li>Unsatisfied with final grade</li>
                            <li>Grade not updated after review</li>
                            <li>Delay in grade publication</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
