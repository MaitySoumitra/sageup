import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DownloadSimple, FilePdf, MagnifyingGlass } from '@phosphor-icons/react';
import axiosClient from '../../api/axiosClient';

const ResourceCategoryPage = () => {
  const { category } = useParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchResources = async () => {
    setLoading(true);
    try {
      // Pass the category as a query parameter
      const res = await axiosClient.get(`/api/libraries?category=${category}`);
      setResources(res.data); // No need to .filter() here now!
    } catch (err) {
      console.error("Error fetching resources", err);
    } finally {
      setLoading(false);
    }
  };
  if (category) fetchResources();
}, [category]);

  return (
    <div className="min-h-screen bg-[#0e1a1a] text-white p-8 md:p-16">
      <header className="mb-12">
        <h1 className="text-4xl font-bold capitalize border-b-2 border-[#1cd99d] inline-block pb-2">
          {category?.replace('-', ' ')}
        </h1>
        <p className="text-gray-400 mt-4">Browse and download verified academic materials.</p>
      </header>

      {loading ? (
        <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#1cd99d]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.length > 0 ? resources.map((item: any) => (
            <div key={item._id} className="bg-[#162626] border border-gray-800 rounded-2xl p-6 hover:border-[#1cd99d] transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-800 rounded-lg text-[#1cd99d]">
                  <FilePdf size={32} weight="duotone" />
                </div>
                <a 
                  href={`http://localhost:5000${item.fileUrl}`} 
                  download 
                  className="p-2 hover:bg-[#1cd99d] hover:text-black rounded-full transition-all"
                >
                  <DownloadSimple size={24} />
                </a>
              </div>
              
              <h3 className="text-xl font-semibold mb-2 group-hover:text-[#1cd99d] transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-800 pt-4">
                <span>By {item.uploadedBy?.name || 'Admin'}</span>
                <span className="bg-gray-800 px-2 py-1 rounded">{item.type}</span>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-20 bg-[#162626] rounded-2xl">
              <MagnifyingGlass size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-xl text-gray-500">No resources found in this category.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceCategoryPage;