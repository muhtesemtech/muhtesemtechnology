import React from 'react';
import { BrainCircuit, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-vivid-red text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
             <div className="flex items-center gap-2 mb-6">
               <div className="relative">
                 <BrainCircuit className="w-8 h-8 text-white fill-none stroke-2" />
               </div>
               <div className="flex flex-col leading-none">
                 <span className="font-bold text-lg">Muhteşem</span>
                 <span className="text-xs opacity-80">Technology</span>
               </div>
             </div>
             <p className="text-xs leading-relaxed opacity-90 mb-6 max-w-xs">
               An elite technical recruitment agency for the Engineering, Technology, Life Sciences, and Government Sectors.
             </p>
             <a href="#" className="inline-block hover:opacity-80 transition-opacity">
               <Linkedin className="w-6 h-6 fill-current" />
             </a>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Services</h4>
            <ul className="space-y-3 text-sm opacity-90">
              <li><a href="#" className="hover:underline">Clients</a></li>
              <li><a href="#" className="hover:underline">Candidates</a></li>
            </ul>
          </div>

          {/* Our Sectors */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Our Sectors</h4>
            <ul className="space-y-3 text-sm opacity-90">
              <li><a href="#" className="hover:underline">Government</a></li>
              <li><a href="#" className="hover:underline">Life Sciences</a></li>
              <li><a href="#" className="hover:underline">Engineering</a></li>
              <li><a href="#" className="hover:underline">Tech</a></li>
              <li><a href="#" className="hover:underline">Tech USA</a></li>
            </ul>
          </div>

          {/* Careers */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Careers</h4>
            <ul className="space-y-3 text-sm opacity-90">
              <li><a href="#" className="hover:underline">Careers Home</a></li>
              <li><a href="#" className="hover:underline">About</a></li>
              <li><a href="#" className="hover:underline">FAQs</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Company</h4>
            <ul className="space-y-3 text-sm opacity-90">
              <li><a href="#" className="hover:underline">DBA Legislation</a></li>
              <li><a href="#" className="hover:underline">Guidance</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Scam Awareness</a></li>
              <li><a href="#" className="hover:underline">Modern Slavery Statement</a></li>
              <li><a href="#" className="hover:underline">Gender Pay Gap</a></li>
              <li><a href="#" className="hover:underline">Cookies</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/20 pt-8 text-xs text-center md:text-left opacity-70">
          © 2024 Muhteşem Technology. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;