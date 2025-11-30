import React from 'react';
import { Mail, MapPin, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="bg-vivid-darker py-24 relative overflow-hidden">
       {/* Decorative subtle grid background */}
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
       
       {/* Red glow effect */}
       <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-vivid-red/5 blur-[100px] rounded-full pointer-events-none"></div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
             
             {/* Left Column: Information */}
             <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vivid-red/10 text-vivid-red text-xs font-bold uppercase tracking-wider mb-6 border border-vivid-red/20">
                   Get in touch
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Let's build something <span className="text-vivid-red">Muhteşem</span> together.
                </h2>
                <p className="text-gray-400 text-lg mb-12 leading-relaxed">
                  Whether you're a candidate looking for your next career move or a client seeking top-tier technical talent, our global team is ready to assist you.
                </p>
                
                <div className="space-y-10">
                   {/* HQ */}
                   <div className="flex items-start gap-5 group">
                      <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center text-vivid-red shrink-0 border border-gray-700 group-hover:border-vivid-red/50 transition-colors shadow-lg">
                         <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="text-white font-bold text-xl mb-2">Global HQ</h3>
                         <p className="text-gray-400 leading-relaxed">
                            123 Technology Drive, Shoreditch<br/>
                            London, EC2A 4NE<br/>
                            United Kingdom
                         </p>
                      </div>
                   </div>

                   {/* Email */}
                   <div className="flex items-start gap-5 group">
                      <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center text-vivid-red shrink-0 border border-gray-700 group-hover:border-vivid-red/50 transition-colors shadow-lg">
                         <Mail className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="text-white font-bold text-xl mb-2">Email Us</h3>
                         <a href="mailto:hello@muhtesem-tech.com" className="text-gray-400 hover:text-white transition-colors text-lg">hello@muhtesem-tech.com</a>
                         <p className="text-gray-500 text-sm mt-1">Our team typically replies within 24 hours.</p>
                      </div>
                   </div>
                   
                   {/* Offices */}
                   <div className="flex items-start gap-5 group">
                      <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center text-vivid-red shrink-0 border border-gray-700 group-hover:border-vivid-red/50 transition-colors shadow-lg">
                         <Globe className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="text-white font-bold text-xl mb-3">Global Offices</h3>
                         <div className="flex flex-wrap gap-2">
                            {['London', 'Berlin', 'Brussels', 'Amsterdam', 'New York', 'Austin', 'Miami', 'Singapore', 'Dubai'].map(city => (
                               <span key={city} className="px-3 py-1 bg-white/5 rounded-md text-xs font-medium text-gray-300 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                                  {city}
                               </span>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right Column: Form */}
             <div className="relative">
                <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                       Send us a message
                       <span className="w-2 h-2 rounded-full bg-vivid-red animate-pulse"></span>
                    </h3>
                    
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">First Name</label>
                             <input 
                                type="text" 
                                className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-vivid-red focus:ring-1 focus:ring-vivid-red transition-all placeholder-gray-600" 
                                placeholder="Jane" 
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Name</label>
                             <input 
                                type="text" 
                                className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-vivid-red focus:ring-1 focus:ring-vivid-red transition-all placeholder-gray-600" 
                                placeholder="Doe" 
                             />
                          </div>
                       </div>
                       
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                          <input 
                             type="email" 
                             className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-vivid-red focus:ring-1 focus:ring-vivid-red transition-all placeholder-gray-600" 
                             placeholder="jane.doe@company.com" 
                          />
                       </div>

                       <div className="space-y-3">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">I am interested as a...</label>
                          <div className="grid grid-cols-2 gap-4">
                             <label className="relative cursor-pointer group">
                                <input type="radio" name="role" className="peer sr-only" defaultChecked />
                                <div className="p-4 rounded-xl border border-gray-700 bg-black/20 peer-checked:bg-vivid-red peer-checked:border-vivid-red peer-checked:text-white text-gray-400 transition-all text-center font-semibold text-sm group-hover:border-gray-500">
                                   Candidate
                                </div>
                                <CheckCircle2 className="w-5 h-5 text-white absolute top-3 right-3 opacity-0 peer-checked:opacity-100 transition-opacity" />
                             </label>
                             <label className="relative cursor-pointer group">
                                <input type="radio" name="role" className="peer sr-only" />
                                <div className="p-4 rounded-xl border border-gray-700 bg-black/20 peer-checked:bg-vivid-red peer-checked:border-vivid-red peer-checked:text-white text-gray-400 transition-all text-center font-semibold text-sm group-hover:border-gray-500">
                                   Client
                                </div>
                                <CheckCircle2 className="w-5 h-5 text-white absolute top-3 right-3 opacity-0 peer-checked:opacity-100 transition-opacity" />
                             </label>
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Message</label>
                          <textarea 
                             rows={4} 
                             className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-vivid-red focus:ring-1 focus:ring-vivid-red transition-all resize-none placeholder-gray-600" 
                             placeholder="How can we help you achieve your goals?"
                          ></textarea>
                       </div>

                       <button 
                          type="submit" 
                          className="w-full bg-white text-vivid-darker font-bold py-4 rounded-xl hover:bg-gray-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 group"
                       >
                          Send Message
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