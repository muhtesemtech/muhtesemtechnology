import React from 'react';

const Banner: React.FC = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-[400px] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://picsum.photos/id/101/1920/1080" 
          alt="Conversation" 
          className="w-full h-full object-cover grayscale opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-vivid-darker via-vivid-darker/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Start a <br/>
            conversation...
          </h2>
          <button 
            onClick={scrollToContact}
            className="bg-vivid-red text-white px-8 py-3 rounded-sm text-sm font-bold uppercase hover:bg-red-700 transition-colors shadow-lg hover:shadow-red-900/20"
          >
            Reach out
          </button>
        </div>
      </div>
      
      {/* Decorative SVG line pattern from screenshot */}
      <svg className="absolute bottom-0 right-0 w-1/2 h-full opacity-20 text-vivid-red pointer-events-none hidden lg:block" viewBox="0 0 400 200" fill="none" stroke="currentColor">
         <path d="M0,200 Q100,50 200,150 T400,100" strokeWidth="2" />
         <path d="M50,200 Q150,50 250,150 T450,100" strokeWidth="2" />
      </svg>
    </section>
  );
};

export default Banner;