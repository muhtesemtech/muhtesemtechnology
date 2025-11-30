import React from 'react';
import { ChevronDown } from 'lucide-react';

const InfoSection: React.FC = () => {
  return (
    <section className="bg-vivid-darker py-24 pt-32 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-8">
              Recruitment <br />
              solutions that <br />
              deliver results.
            </h2>
            <div className="w-12 h-1 bg-vivid-red mb-8"></div>
             <ChevronDown className="w-10 h-10 text-vivid-red animate-bounce" />
          </div>

          <div className="space-y-6 text-gray-300 text-sm md:text-base leading-relaxed">
            <p>
              Navigating recruitment can be a complex and resource-intensive task.
              As a specialist recruitment agency, our unique approach streamlines the 
              process for efficiency and success.
            </p>
            <p>
              We connect businesses with top talent across the Technology, 
              Engineering, Life Sciences, Government and Private Sectors. With 9 
              international offices and over £155m revenue generated in 2024, we 
              deliver fast, effective contract and permanent recruitment solutions 
              trusted by global brands.
            </p>
            
            <a href="#" className="inline-block mt-4 text-white font-semibold hover:text-vivid-red transition-colors flex items-center gap-2 group">
              Find out more 
              <span className="transform group-hover:translate-x-1 transition-transform">›</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default InfoSection;