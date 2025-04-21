import { VideoUpload } from '../components/VideoUpload';
import { PdfUpload } from '../components/PdfUpload'; // Import the new component

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VideoUpload />
        <PdfUpload /> {/* Add the PDF upload component */}
      </div>
      
      {/* Other dashboard elements... */}
    </div>
  );
}
