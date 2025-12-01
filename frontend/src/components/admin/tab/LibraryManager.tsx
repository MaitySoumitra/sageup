import React, { useState } from 'react';
import { UploadSimple, DownloadSimple } from '@phosphor-icons/react';
// Interfaces imported from useSampleData.ts (simplified here)
interface LibraryItem {
  _id: string;
  title: string;
  description: string;
  type: 'question' | 'solution' | 'note';
  category?: string;
  fileUrl: string;
  uploadedBy?: { name: string };
}
interface User { name: string; }

interface LibraryManagerProps {
  user: User;
  libraries: LibraryItem[];
}

const LibraryManager: React.FC<LibraryManagerProps> = ({ user, libraries }) => {
  const [showUploadForm, setShowUploadForm] = useState(false);

  const handleUploadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate file upload logic here
    console.log('Simulating file upload...');
    setShowUploadForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="top-section flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          📚 Hello, {user.name}!
        </h3>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gray-100 rounded-lg text-sm font-medium">
            Total Items: <strong className="text-indigo-600">{libraries.length}</strong>
          </div>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition" 
            onClick={() => setShowUploadForm(!showUploadForm)}
          >
            <UploadSimple size={20} weight="bold" />
            Upload PDF
          </button>
        </div>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="form-container bg-gray-50 p-6 rounded-xl mb-6">
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-700">Upload New Resource</h4>
            
            <label className="block font-medium">Title:</label>
            <input type="text" name="title" required className="w-full p-2 border rounded-md" />

            {/* ... other form fields (Description, Type, Category) */}
            
            <label className="block font-medium">Upload PDF File:</label>
            <input type="file" name="pdf" accept=".pdf" required className="w-full p-2 border rounded-md bg-white" />

            <button type="submit" className="mt-2 px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
              Upload
            </button>
          </form>
        </div>
      )}

      {/* Library Table */}
      <table className="w-full border-collapse bg-white shadow-md">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">#</th>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Uploaded By</th>
            <th className="p-3 text-center">Download</th>
          </tr>
        </thead>
        <tbody>
          {libraries.map((item, index) => (
            <tr key={item._id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-bold text-indigo-600">#LIB{(index + 1).toString().padStart(2, '0')}</td>
              <td className="p-3">{item.title}</td>
              <td className="p-3">{item.type}</td>
              <td className="p-3">{item.category || 'N/A'}</td>
              <td className="p-3">{item.uploadedBy?.name || 'Unknown'}</td>
              <td className="p-3 text-center">
                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800">
                  <DownloadSimple size={20} />
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LibraryManager;