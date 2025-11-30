import React, { useState } from 'react';
import { Mail, MapPin, Globe, ArrowRight, CheckCircle2, Loader2, Navigation, ExternalLink, Building2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const OFFICE_CITIES = ['London', 'Berlin', 'Brussels', 'Amsterdam', 'New York', 'Austin', 'Miami', 'Singapore', 'Dubai'];

interface LocationData {
  address: string;
  mapLink: string;
  sourceTitle?: string;
}

const ContactSection: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [role, setRole] = useState<'candidate' | 'client'>('candidate');

  const handleCityClick = async (city: string) => {
    if (city === selectedCity) return;
    
    setSelectedCity(city);
    setLocationData(null);
    setIsLoadingMap(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Find the address of a prime technology business center or tech hub in ${city}. 
                   Return the address and ensuring the Google Maps tool is used to get the link. 
                   If multiple, pick the most prestigious one suitable for a headquarters.`,
        config: {
          tools: [{ googleMaps: {} }],
        }
      });

      // Extract text for address (simplified approach)
      const text = response.text || `Located in the heart of ${city}'s technology district.`;
      
      // Extract Google Maps URI from grounding metadata
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      let mapUri = `https://www.google.com/maps/search/${encodeURIComponent(city + ' tech hub')}`;
      let title = "Technology District";

      if (groundingChunks) {
        // Look for a map chunk
        const mapChunk = groundingChunks.find((c: any) => c.web?.uri?.includes('google.com/maps') || c.web?.uri?.includes('maps.google.com'));
        if (mapChunk && mapChunk.web) {
            mapUri = mapChunk.web.uri;
            title = mapChunk.web.title || title;
        }
      }

      setLocationData({
        address: text.replace(/\*/g, '').split('\n')[0].substring(0, 100) + '...', // Clean up generic AI text
        mapLink: mapUri,
        sourceTitle: title
      });

    } catch (error) {
      console.error("Failed to fetch map data", error);
      setLocationData({
        address: `Central Business District, ${city}`,
        mapLink: `https://www.google.com/maps/search/${encodeURIComponent(city)}`,
      });
    } finally {
      setIsLoadingMap(false);
    }
  };

  return (
    <section id="contact" className="bg-vivid-darker py-24 relative overflow-hidden">
       {/* Decorative subtle grid background */}
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
       
       {/* Red glow effect */}
       <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-vivid-red/5 blur-[100px] rounded-full pointer-events-none"></div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
             
             {/* Left Column: Information */}
             <div className="flex flex-col h-full">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vivid-red/10 text-vivid-red text-xs font-bold uppercase tracking-wider mb-6 border border-vivid-red/20 w-fit">
                   Get in touch
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Let's build something <span className="text-vivid-red">Muhteşem</span> together.
                </h2>
                <p className="text-gray-400 text-lg mb-12 leading-relaxed">
                  Whether you're a candidate looking for your next career move or a client seeking top-tier technical talent, our global team is ready to assist you.
                </p>
                
                <div className="space-y-8 flex-grow">
                   {/* Contact Cards Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-800/50 border border-gray-700 p-5 rounded-2xl hover:border-vivid-red/30 transition-colors group">
                             <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-vivid-red mb-4 border border-gray-700 group-hover:scale-110 transition-transform">
                                <Mail className="w-5 h-5" />
                             </div>
                             <h3 className="text-white font-bold mb-1">Email Us</h3>
                             <a href="mailto:hello@muhtesem-tech.com" className="text-gray-400 text-sm hover:text-white transition-colors">hello@muhtesem-tech.com</a>
                        </div>
                        
                        <div className="bg-gray-800/50 border border-gray-700 p-5 rounded-2xl hover:border-vivid-red/30 transition-colors group">
                             <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-vivid-red mb-4 border border-gray-700 group-hover:scale-110 transition-transform">
                                <MapPin className="w-5 h-5" />
                             </div>
                             <h3 className="text-white font-bold mb-1">Global HQ</h3>
                             <p className="text-gray-400 text-sm">123 Tech Drive, London</p>
                        </div>
                   </div>

                   {/* Interactive Office Locator */}
                   <div className="mt-8">
                       <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                           <Globe className="w-5 h-5 text-vivid-red" /> 
                           Find an Office
                       </h3>
                       <p className="text-sm text-gray-500 mb-4">Select a city to view location details via Google Maps.</p>
                       
                       <div className="flex flex-wrap gap-2 mb-6">
                            {OFFICE_CITIES.map(city => (
                               <button 
                                  key={city}
                                  onClick={() => handleCityClick(city)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                      selectedCity === city 
                                      ? 'bg-vivid-red text-white border-vivid-red shadow-lg shadow-red-900/20' 
                                      : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                                  }`}
                               >
                                  {city}
                               </button>
                            ))}
                       </div>

                       {/* Dynamic Location Card */}
                       <div className={`transition-all duration-500 overflow-hidden ${selectedCity ? 'opacity-100 max-h-64' : 'opacity-0 max-h-0'}`}>
                           <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-5 relative group">
                                {isLoadingMap ? (
                                    <div className="flex items-center justify-center py-8 gap-3 text-gray-400">
                                        <Loader2 className="w-5 h-5 animate-spin text-vivid-red" />
                                        <span className="text-sm font-medium">Locating nearest hub...</span>
                                    </div>
                                ) : locationData ? (
                                    <div className="flex gap-4 items-start">
                                        <div className="w-12 h-12 bg-vivid-red/10 rounded-xl flex items-center justify-center text-vivid-red shrink-0 border border-vivid-red/20">
                                            <Building2 className="w-6 h-6" />
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="text-white font-bold text-lg mb-1">{selectedCity} Office</h4>
                                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{locationData.address}</p>
                                            
                                            <a 
                                                href={locationData.mapLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-xs font-bold text-vivid-red hover:text-white transition-colors uppercase tracking-wider bg-vivid-red/5 px-3 py-2 rounded-lg hover:bg-vivid-red border border-vivid-red/10 hover:border-vivid-red"
                                            >
                                                <Navigation className="w-3 h-3" />
                                                Get Directions
                                                <ExternalLink className="w-3 h-3 ml-0.5 opacity-50" />
                                            </a>
                                        </div>
                                    </div>
                                ) : null}
                           </div>
                       </div>
                   </div>
                </div>
             </div>

             {/* Right Column: Form */}
             <div className="relative">
                <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl h-full flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                       Send us a message
                       <span className="w-2 h-2 rounded-full bg-vivid-red animate-pulse"></span>
                    </h3>
                    
                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">First Name</label>
                             <input 
                                type="text" 
                                className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-vivid-red focus:ring-1 focus:ring-vivid-red transition-all placeholder-gray-600" 
                                placeholder="Jane" 
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Name</label>
                             <input 
                                type="text" 
                                className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-vivid-red focus:ring-1 focus:ring-vivid-red transition-all placeholder-gray-600" 
                                placeholder="Doe" 
                             />
                          </div>
                       </div>
                       
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                          <input 
                             type="email" 
                             className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-vivid-red focus:ring-1 focus:ring-vivid-red transition-all placeholder-gray-600" 
                             placeholder="jane.doe@company.com" 
                          />
                       </div>

                       <div className="space-y-3">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">I am interested as a...</label>
                          <div className="grid grid-cols-2 gap-4">
                             <label className="relative cursor-pointer group">
                                <input 
                                    type="radio" 
                                    name="role" 
                                    className="peer sr-only" 
                                    checked={role === 'candidate'}
                                    onChange={() => setRole('candidate')}
                                />
                                <div className="p-3 rounded-xl border border-gray-700 bg-black/20 peer-checked:bg-vivid-red peer-checked:border-vivid-red peer-checked:text-white text-gray-400 transition-all text-center font-semibold text-sm group-hover:border-gray-500">
                                   Candidate
                                </div>
                                <CheckCircle2 className="w-4 h-4 text-white absolute top-3 right-3 opacity-0 peer-checked:opacity-100 transition-opacity" />
                             </label>
                             <label className="relative cursor-pointer group">
                                <input 
                                    type="radio" 
                                    name="role" 
                                    className="peer sr-only" 
                                    checked={role === 'client'}
                                    onChange={() => setRole('client')}
                                />
                                <div className="p-3 rounded-xl border border-gray-700 bg-black/20 peer-checked:bg-vivid-red peer-checked:border-vivid-red peer-checked:text-white text-gray-400 transition-all text-center font-semibold text-sm group-hover:border-gray-500">
                                   Client
                                </div>
                                <CheckCircle2 className="w-4 h-4 text-white absolute top-3 right-3 opacity-0 peer-checked:opacity-100 transition-opacity" />
                             </label>
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Message</label>
                          <textarea 
                             rows={4} 
                             className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-vivid-red focus:ring-1 focus:ring-vivid-red transition-all resize-none placeholder-gray-600" 
                             placeholder={
                                role === 'candidate' 
                                ? "Tell us about your experience, key skills, and what you're looking for in your next role..." 
                                : "How can we help you build your team? Tell us about your hiring requirements..."
                             }
                          ></textarea>
                       </div>

                       <button 
                          type="submit" 
                          className="w-full bg-white text-vivid-darker font-bold py-4 rounded-xl hover:bg-gray-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 group mt-2"
                       >
                          {role === 'candidate' ? 'Submit Application' : 'Request Talent'}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                       </button>
                    </form>
                </div>
             </div>
          </div>
       </div>
    </section>
  );
};

export default ContactSection;