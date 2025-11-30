import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SectorLinks from './components/SectorLinks';
import InfoSection from './components/InfoSection';
import LiveJobs from './components/LiveJobs';
import Banner from './components/Banner';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Testimonials from './components/Testimonials';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-vivid-darker relative">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <SectorLinks />
        <InfoSection />
        <LiveJobs />
        <Banner />
        <Testimonials />
        <ContactSection />
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;