import "../app/globals.css";
export default function Home() {
  return (
    <nav>
      <h1 className="text-xl font-heading">
        This text uses the custom pilcrow font!
      </h1>
      <div className="text-xl font-sans">
        This text uses the custom archivo font!
      </div>
      <div className="text-xl">
        This text uses the custom archivo italic font!
      </div>
    </nav>
  );
}