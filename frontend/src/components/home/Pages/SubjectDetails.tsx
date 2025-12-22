import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Phone, Clock, ShareNetwork, PencilSimple, Star } from '@phosphor-icons/react';
import axiosClient from '../../api/axiosClient';
import type { Subject } from '../types';
const SubjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axiosClient.get(`/api/subjects/${id}`);
        setSubject(res.data);
      } catch (err) {
        console.error("Error loading details", err);
      }
    };
    fetchDetails();
  }, [id]);

  if (!subject) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 pt-6 pb-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
              <div className="flex items-center gap-3 mt-2 text-sm">
                <span className="bg-green-700 text-white px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                  4.7 <Star size={14} weight="fill" />
                </span>
                <span className="text-blue-600 font-semibold underline cursor-pointer">252 Ratings</span>
                <span className="text-green-600 font-bold">✓ Verified</span>
              </div>
              <div className="flex gap-4 mt-3 text-gray-600 text-sm">
                <span className="flex items-center gap-1"><MapPin size={18} /> {subject.location || "Location not set"}</span>
                <span className="text-green-600 font-semibold italic">Open 24 Hrs</span>
              </div>
            </div>
            <div className="flex gap-2">
               <button className="p-2 border rounded-md hover:bg-gray-50"><ShareNetwork size={20} /></button>
               <button className="p-2 border rounded-md hover:bg-gray-50"><PencilSimple size={20} /></button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button className="bg-[#008a00] text-white px-6 py-2 rounded-md font-bold flex items-center gap-2">
              <Phone weight="fill" /> 09845452359
            </button>
            <button className="bg-[#0073e6] text-white px-6 py-2 rounded-md font-bold">Enquire Now</button>
            <button className="border border-green-600 text-green-700 px-6 py-2 rounded-md font-bold">WhatsApp</button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-8 mt-8 border-b border-transparent">
            {['Overview', 'Photos', 'Price List', 'Reviews'].map((tab) => (
              <span key={tab} className={`pb-2 text-sm font-semibold cursor-pointer ${tab === 'Overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
                {tab}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details & Photos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Photos</h2>
            <div className="grid grid-cols-3 gap-2">
             
              <div className="bg-gray-100 rounded h-40 flex items-center justify-center text-gray-400">No Image</div>
              <div className="bg-gray-100 rounded h-40 flex items-center justify-center text-gray-400">No Image</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Course Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Category:</span> <p className="font-medium">{subject.category}</p></div>
              <div><span className="text-gray-500">Level:</span> <p className="font-medium capitalize">{subject.level}</p></div>
              <div><span className="text-gray-500">Availability:</span> 
                <p className="font-medium">{subject.availability?.days.join(", ") || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Sidebar */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-blue-600 mt-1" />
                <span className="text-blue-600 font-bold">09845452359</span>
              </div>
              <hr />
              <div className="flex items-start gap-3">
                <MapPin size={24} className="text-gray-400 mt-1" />
                <div>
                  <h4 className="font-bold text-sm">Address</h4>
                  <p className="text-sm text-gray-600">{subject.location || "Address not provided"}</p>
                  <button className="text-blue-600 text-xs font-bold mt-2 uppercase tracking-wide">Get Directions</button>
                </div>
              </div>
              <hr />
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-gray-400" />
                <div className="flex justify-between w-full">
                  <span className="text-green-600 font-bold text-sm">Open 24 Hrs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SubjectDetails;