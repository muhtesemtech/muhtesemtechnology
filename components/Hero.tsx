import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/id/4/1920/1080" 
          alt="Office Work" 
          className="w-full h-full object-cover"
        />
        {/* Strong dark gradient overlay to match the Vivid branding */}
        <div className="absolute inset-0 bg-gradient-to-r from-vivid-darker/95 via-vivid-darker/80 to-vivid-darker/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-vivid-darker via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex items-center">
        <div className="max-w-4xl pt-20">
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
            Worldwide leaders in <br />
            <span className="text-gray-200">technical recruitment</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mb-10 hidden md:block">
            Connecting exceptional talent with world-class organizations across the globe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;