import React, { useState } from 'react';
import { Images, Maximize2, X } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { GalleryPhoto } from '../types';

export const GallerySection: React.FC = () => {
  const { gallery } = useClinic();
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [showAllModal, setShowAllModal] = useState(false);

  return (
    <section id="gallery" className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 bg-purple-50 text-purple-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <Images className="w-3.5 h-3.5" />
              <span>Visual Tour</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545] tracking-tight">
              Facility & Diagnostic Gallery
            </h2>
          </div>

          <button
            onClick={() => setShowAllModal(true)}
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline"
          >
            View All Photos →
          </button>
        </div>

        {/* 4 Photo Cards Grid matching original board layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.slice(0, 4).map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group relative rounded-xl overflow-hidden shadow-xs hover:shadow-md cursor-pointer aspect-4/3 bg-slate-100 border border-slate-200"
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

              <div className="absolute bottom-2 left-2 right-2 text-white">
                <p className="text-[11px] sm:text-xs font-semibold truncate">
                  {photo.title}
                </p>
              </div>

              <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Single Photo Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={activePhoto.imageUrl}
              alt={activePhoto.title}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
            <p className="text-white text-sm font-semibold mt-3 text-center">
              {activePhoto.title}
            </p>
          </div>
        </div>
      )}

      {/* View All Modal */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#0B2545]">All Photos</h3>
              <button onClick={() => setShowAllModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {gallery.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => {
                    setActivePhoto(photo);
                    setShowAllModal(false);
                  }}
                  className="rounded-lg overflow-hidden border cursor-pointer aspect-4/3 relative group"
                >
                  <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 text-white text-xs font-semibold">
                    {photo.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
