import ImageUploadPopover from "@/components/functions/upload-image";
import Navbar from "@/components/ui/navbar";

export default function Home() {
  return (
    <>
      <div className="flex justify-center">
        <Navbar />
      </div>

      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl font-bold">Home Page</h1>
        <ImageUploadPopover />
      </div>
    </>
  );
}
