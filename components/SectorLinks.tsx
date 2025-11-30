import React from 'react';
import { SECTORS } from '../constants';
import { ChevronDown, ArrowRight } from 'lucide-react';

const SectorLinks: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {SECTORS.map((sector) => (
          <div 
            key={sector.id}
            className="group bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all duration-300 rounded-md p-4 cursor-pointer flex flex-col justify-between h-32"
          >
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/10 rounded-full group-hover:bg-vivid-red transition-colors">
                {sector.icon}
              </div>
              <span className="font-semibold text-sm tracking-wide">{sector.title}</span>
            </div>
            
            <div className="flex justify-between items-center mt-4 border-t border-white/10 pt-3">
              <span className="text-xs text-gray-300 font-medium">Learn More</span>
              {/* This mimics the orange arrow button seen on hover in the screenshot for Engineering */}
              <div className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 bg-transparent group-hover:bg-vivid-red">
                 <ChevronDown className="w-3 h-3 text-white group-hover:hidden" />
                 <ArrowRight className="w-3 h-3 text-white hidden group-hover:block" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectorLinks;