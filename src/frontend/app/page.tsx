import "../app/globals.css";
export default function Home() {
  return (
    <nav>
      <div className="text-xl font-heading">
        This text uses the custom pilcrow font!
      </div>
      <div className="text-xl font-sans">
        This text uses the custom archivo font!
      </div>
      <div className="text-xl">
        This text uses the custom archivo italic font!
      </div>
    </nav>
  );
}
