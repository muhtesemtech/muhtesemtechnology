import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_JOBS } from '../constants';
import { Job } from '../types';
import { ArrowLeft, ArrowRight, MapPin, Briefcase, Banknote, Clock, Search, Filter, X, Bell, CheckCircle, Loader2, Share2, Link as LinkIcon, Linkedin, Twitter, Mail, Check, Sparkles, Image as ImageIcon, Bookmark, ListChecks, GraduationCap, FileText } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const LiveJobs: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  
  // Alert Modal State
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertEmail, setAlertEmail] = useState('');
  const [isSubmittingAlert, setIsSubmittingAlert] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);

  // Share Modal State
  const [jobToShare, setJobToShare] = useState<Job | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Details Modal State
  const [viewingJob, setViewingJob] = useState<Job | null>(null);

  // AI Image State
  const [jobImages, setJobImages] = useState<Record<string, string>>({});
  const [generatingImages, setGeneratingImages] = useState<Record<string, boolean>>({});

  // Toast State
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  // Initialize saved jobs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('muhtesem_saved_jobs');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedJobIds(new Set(parsed));
        }
      } catch (e) {
        console.error("Failed to parse saved jobs", e);
      }
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSaveJob = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    setSavedJobIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
        showToast("Job removed from saved list", 'info');
      } else {
        newSet.add(jobId);
        showToast("Job saved successfully", 'success');
      }
      localStorage.setItem('muhtesem_saved_jobs', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  // Extract unique values for dropdowns
  const categories = useMemo(() => ['All', ...Array.from(new Set(MOCK_JOBS.map(job => job.category)))], []);
  const types = useMemo(() => ['All', ...Array.from(new Set(MOCK_JOBS.map(job => job.type)))], []);

  // Filter jobs based on state
  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        job.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
      const matchesType = selectedType === 'All' || job.type === selectedType;
      const matchesSaved = !showSavedOnly || savedJobIds.has(job.id);

      return matchesSearch && matchesCategory && matchesType && matchesSaved;
    });
  }, [searchQuery, selectedCategory, selectedType, showSavedOnly, savedJobIds]);

  // Reset carousel index when filters change
  useEffect(() => {
    setStartIndex(0);
  }, [filteredJobs.length]);

  const nextJob = () => {
    if (filteredJobs.length === 0) return;
    setStartIndex((prev) => (prev + 1) % filteredJobs.length);
  };

  const prevJob = () => {
    if (filteredJobs.length === 0) return;
    setStartIndex((prev) => (prev - 1 + filteredJobs.length) % filteredJobs.length);
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      // Accessibility enhancement: Focus the first input field for immediate typing
      setTimeout(() => {
        const firstInput = contactSection.querySelector('input');
        if (firstInput) {
            (firstInput as HTMLElement).focus();
        }
      }, 800);
    }
  };

  const handleApplyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewingJob) setViewingJob(null); // Close modal if open
    scrollToContact();
  };

  const handleAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertEmail) return;
    
    setIsSubmittingAlert(true);
    // Simulate API call
    setTimeout(() => {
        setIsSubmittingAlert(false);
        setAlertSuccess(true);
        setTimeout(() => {
            setIsAlertModalOpen(false);
            setAlertSuccess(false);
            setAlertEmail('');
        }, 2500);
    }, 1500);
  };

  const openShareModal = (job: Job, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setJobToShare(job);
    setIsCopied(false);
  };

  const copyShareLink = () => {
    if (!jobToShare) return;
    const dummyLink = `https://muhtesem-tech.com/jobs/${jobToShare.id}`;
    navigator.clipboard.writeText(dummyLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getSocialShareLink = (platform: 'linkedin' | 'twitter' | 'email') => {
    if (!jobToShare) return '#';
    const url = encodeURIComponent(`https://muhtesem-tech.com/jobs/${jobToShare.id}`);
    const text = encodeURIComponent(`Check out this ${jobToShare.title} role at Muhteşem Technology!`);
    
    switch (platform) {
        case 'linkedin':
            return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        case 'twitter':
            return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        case 'email':
            return `mailto:?subject=${encodeURIComponent(`Job Opportunity: ${jobToShare.title}`)}&body=${text}%0A%0A${url}`;
        default:
            return '#';
    }
  };

  const generateJobImage = async (job: Job, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (jobImages[job.id] || generatingImages[job.id]) return;

    setGeneratingImages(prev => ({ ...prev, [job.id]: true }));
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{
                    text: `Generate a professional, high-quality, modern, cinematic header image for a job posting. 
                    Job Title: ${job.title}. 
                    Industry Sector: ${job.category}. 
                    Visual style: Corporate, high-tech, clean, cinematic lighting, no text overlays.`
                }]
            },
            config: {
                imageConfig: {
                    aspectRatio: "16:9"
                }
            }
        });

        let imageUrl = '';
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                    break;
                }
            }
        }

        if (imageUrl) {
            setJobImages(prev => ({ ...prev, [job.id]: imageUrl }));
        }
    } catch (err) {
        console.error("Failed to generate image", err);
    } finally {
        setGeneratingImages(prev => ({ ...prev, [job.id]: false }));
    }
  };

  // Determine which jobs to show
  let visibleJobs = [];
  if (filteredJobs.length > 0) {
    if (filteredJobs.length < 3) {
      // If fewer than 3 jobs, just show what we have without looping
      visibleJobs = filteredJobs;
    } else {
      // Loop logic for 3+ jobs
      visibleJobs = [
        filteredJobs[startIndex % filteredJobs.length],
        filteredJobs[(startIndex + 1) % filteredJobs.length],
        filteredJobs[(startIndex + 2) % filteredJobs.length],
      ];
    }
  }

  return (
    <section className="bg-vivid-red py-24 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
            <div className="absolute top-10 right-10 w-96 h-96 bg-black rounded-full mix-blend-multiply blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-black rounded-full mix-blend-multiply blur-3xl"></div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col mb-10 gap-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">Live Jobs</h2>
                <p className="text-white/80 text-lg font-medium">Explore our latest opportunities across the globe.</p>
            </div>
            
            {/* Carousel Controls (only if enough jobs to scroll) */}
            {filteredJobs.length >= 3 && (
              <div className="flex gap-4">
                <button 
                  onClick={prevJob}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-vivid-red text-white transition-all duration-300 group shadow-lg"
                  aria-label="Previous jobs"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={nextJob}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-vivid-red text-white transition-all duration-300 group shadow-lg"
                  aria-label="Next jobs"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>

          {/* Filters Bar */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col md:flex-row gap-4 shadow-xl items-stretch md:items-center">
             {/* Search */}
             <div className="relative flex-grow w-full">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
               <input 
                 type="text" 
                 placeholder="Search by title or location..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-white/10 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/60 focus:outline-none focus:bg-white/20 focus:border-white/30 transition-all"
               />
               {searchQuery && (
                 <button 
                   onClick={() => setSearchQuery('')}
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                 >
                   <X className="w-3 h-3" />
                 </button>
               )}
             </div>

             {/* Category Select */}
             <div className="relative min-w-[180px] w-full md:w-auto">
               <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
               <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none bg-white/10 border border-white/10 rounded-xl pl-10 pr-8 py-2.5 text-sm text-white focus:outline-none focus:bg-white/20 focus:border-white/30 transition-all cursor-pointer [&>option]:text-gray-900"
               >
                 {categories.map(cat => (
                   <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                 ))}
               </select>
               <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/70 pointer-events-none" />
             </div>

             {/* Type Select */}
             <div className="relative min-w-[160px] w-full md:w-auto">
               <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
               <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full appearance-none bg-white/10 border border-white/10 rounded-xl pl-10 pr-8 py-2.5 text-sm text-white focus:outline-none focus:bg-white/20 focus:border-white/30 transition-all cursor-pointer [&>option]:text-gray-900"
               >
                 {types.map(type => (
                   <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
                 ))}
               </select>
               <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/70 pointer-events-none" />
             </div>
            
             {/* Actions Group */}
             <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0 md:overflow-visible">
                {/* Saved Toggle */}
                <button
                    onClick={() => setShowSavedOnly(!showSavedOnly)}
                    className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-bold text-sm transition-all shadow-md hover:shadow-lg whitespace-nowrap border ${
                        showSavedOnly 
                        ? 'bg-white text-vivid-red border-white' 
                        : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
                    }`}
                    title="View Saved Jobs"
                >
                    <Bookmark className={`w-4 h-4 ${showSavedOnly ? 'fill-current' : ''}`} />
                    <span className="hidden lg:inline">Saved ({savedJobIds.size})</span>
                    <span className="lg:hidden">{savedJobIds.size}</span>
                </button>

                {/* Result Count */}
                <div className="flex items-center justify-center bg-black/20 rounded-xl px-4 py-2.5 border border-white/5 whitespace-nowrap min-w-[80px]">
                    <span className="text-white font-bold text-sm">
                    {filteredJobs.length} <span className="opacity-70 font-normal ml-1 hidden lg:inline">{filteredJobs.length === 1 ? 'Job' : 'Jobs'}</span>
                    </span>
                </div>

                {/* Job Alert Button */}
                <button
                    onClick={() => setIsAlertModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-white text-vivid-red hover:bg-gray-100 rounded-xl px-4 py-2.5 font-bold text-sm transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                    title="Create Job Alert"
                >
                    <Bell className="w-4 h-4" />
                    <span className="hidden lg:inline">Create Alert</span>
                </button>
             </div>
          </div>
        </div>

        {/* Job Cards Display */}
        {filteredJobs.length > 0 ? (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ${filteredJobs.length < 3 ? 'justify-center lg:flex' : ''}`}>
            {visibleJobs.map((job, idx) => (
              <div 
                key={`${job.id}-${idx}-${startIndex}`} 
                onClick={() => setViewingJob(job)}
                className={`bg-white rounded-[1.25rem] flex flex-col items-start text-left shadow-xl shadow-black/10 transform transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-[0_20px_50px_-12px_rgba(213,0,28,0.5)] hover:border-vivid-red/50 group relative overflow-hidden h-[460px] border border-transparent cursor-pointer ${filteredJobs.length < 3 ? 'w-full md:max-w-md' : ''}`}
              >
                {/* Image Header Area */}
                <div className="w-full h-36 bg-gray-100 relative overflow-hidden group/image flex-shrink-0">
                    {jobImages[job.id] ? (
                        <img 
                            src={jobImages[job.id]} 
                            alt={job.title} 
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border-b border-gray-100 p-4 text-center relative z-0">
                            {/* Pattern */}
                            <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000),linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]"></div>
                            
                            {generatingImages[job.id] ? (
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="w-6 h-6 text-vivid-red animate-spin" />
                                    <span className="text-[10px] font-medium text-gray-500 animate-pulse">Creating Visual...</span>
                                </div>
                            ) : (
                                <button 
                                    onClick={(e) => generateJobImage(job, e)} 
                                    className="flex flex-col items-center gap-2 text-gray-400 hover:text-vivid-red transition-all duration-300 transform hover:scale-105 z-10"
                                >
                                    <div className="p-2 bg-white rounded-full shadow-sm border border-gray-200 group-hover/btn:border-vivid-red/30">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Generate AI Preview</span>
                                </button>
                            )}
                        </div>
                    )}
                    
                    {/* Top Accent Bar Overlay */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-vivid-red rounded-b-full shadow-lg z-20 transition-all duration-500 group-hover:w-24 group-hover:h-1.5"></div>

                    {/* Category Tag Overlay */}
                    <div className="absolute bottom-2 left-3 z-20">
                         <span className="inline-flex items-center px-2 py-0.5 bg-white/90 backdrop-blur-sm text-gray-800 text-[9px] font-extrabold uppercase tracking-widest rounded-md border border-white/50 shadow-sm">
                            {job.category}
                        </span>
                    </div>

                    {/* Save Button (Left Top) */}
                    <button
                        onClick={(e) => toggleSaveJob(e, job.id)}
                        className={`absolute top-2 left-2 p-1.5 rounded-full transition-all backdrop-blur-sm z-30 shadow-sm hover:scale-110 ${
                            savedJobIds.has(job.id)
                            ? 'bg-vivid-red text-white'
                            : 'bg-white/80 hover:bg-white text-gray-400 hover:text-vivid-red'
                        }`}
                        title={savedJobIds.has(job.id) ? "Unsave job" : "Save job"}
                    >
                        <Bookmark className={`w-3.5 h-3.5 ${savedJobIds.has(job.id) ? 'fill-current' : ''}`} />
                    </button>

                    {/* Share Button (Right Top) */}
                    <button
                        onClick={(e) => {
                            openShareModal(job, e);
                        }}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-500 hover:text-vivid-red p-1.5 rounded-full transition-all backdrop-blur-sm z-20 opacity-0 group-hover:opacity-100 shadow-sm"
                        title="Share this job"
                    >
                        <Share2 className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Content Container */}
                <div className="p-5 flex flex-col flex-grow w-full">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-vivid-red transition-colors line-clamp-2 min-h-[3rem]">
                    {job.title}
                    </h3>
                    
                    {/* Divider */}
                    <div className="w-full h-px bg-gray-100 mb-3 group-hover:bg-red-100 transition-colors duration-300"></div>

                    {/* Details Grid */}
                    <div className="mt-auto w-full space-y-2 mb-4">
                        <div className="flex items-center gap-2.5 text-gray-700">
                            <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-vivid-red shrink-0 border border-red-100 group-hover:scale-110 transition-transform duration-300">
                                <MapPin className="w-3 h-3" />
                            </div>
                            <div>
                                <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Location</p>
                                <span className="text-[10px] font-bold block leading-tight">{job.location}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 text-gray-700">
                            <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-vivid-red shrink-0 border border-red-100 group-hover:scale-110 transition-transform duration-300 delay-75">
                                <Banknote className="w-3 h-3" />
                            </div>
                            <div>
                                <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Compensation</p>
                                <span className="text-[10px] font-bold block leading-tight">{job.pay}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 text-gray-700">
                            <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-vivid-red shrink-0 border border-red-100 group-hover:scale-110 transition-transform duration-300 delay-150">
                                <Clock className="w-3 h-3" />
                            </div>
                            <div>
                                <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Contract Type</p>
                                <span className="text-[10px] font-bold block leading-tight">{job.type}</span>
                            </div>
                        </div>
                    </div>

                    {/* Button */}
                    <button 
                    onClick={handleApplyNow}
                    className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-vivid-red transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-vivid-red/30 mt-auto"
                    aria-label={`Apply for ${job.title}`}
                    >
                    Apply Now
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-white opacity-80">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
               <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">No jobs found</h3>
            <p className="text-sm">Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedType('All');
                setShowSavedOnly(false);
              }}
              className="mt-6 text-sm font-bold underline hover:text-white transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        <div className="flex justify-center mt-12">
          <button className="px-6 py-2.5 bg-white text-vivid-red rounded-full text-[10px] font-extrabold uppercase tracking-widest hover:bg-gray-50 transition-all shadow-xl hover:scale-105 flex items-center gap-2">
            View all jobs
            <Briefcase className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Job Details Modal */}
      {viewingJob && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setViewingJob(null)}
            ></div>
            <div className="bg-white w-full max-w-4xl h-full md:h-auto md:max-h-[90vh] rounded-3xl relative z-10 shadow-2xl animate-[fadeIn_0.3s_ease-out] flex flex-col md:flex-row overflow-hidden">
                <button 
                    onClick={() => setViewingJob(null)}
                    className="absolute top-4 right-4 z-20 bg-black/10 hover:bg-black/20 text-white md:text-gray-500 md:hover:text-gray-900 rounded-full p-2 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Left Side: Image & Key Info (Desktop) or Top (Mobile) */}
                <div className="w-full md:w-1/3 bg-gray-50 flex-shrink-0 flex flex-col">
                    <div className="relative h-48 md:h-64 bg-gray-200">
                        {jobImages[viewingJob.id] ? (
                            <img src={jobImages[viewingJob.id]} alt={viewingJob.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white/20">
                                <Briefcase className="w-16 h-16" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent md:hidden"></div>
                        <div className="absolute bottom-4 left-4 md:hidden text-white">
                             <span className="inline-block px-2 py-0.5 bg-vivid-red text-[10px] font-bold uppercase rounded mb-1">{viewingJob.category}</span>
                             <h2 className="text-xl font-bold leading-tight">{viewingJob.title}</h2>
                        </div>
                    </div>
                    
                    <div className="p-6 space-y-4 flex-grow">
                         <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-700">
                                <MapPin className="w-5 h-5 text-vivid-red" />
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Location</p>
                                    <p className="font-semibold text-sm">{viewingJob.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Banknote className="w-5 h-5 text-vivid-red" />
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Compensation</p>
                                    <p className="font-semibold text-sm">{viewingJob.pay}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Clock className="w-5 h-5 text-vivid-red" />
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Type</p>
                                    <p className="font-semibold text-sm">{viewingJob.type}</p>
                                </div>
                            </div>
                         </div>

                         <div className="pt-6 mt-auto space-y-3">
                             <button 
                                onClick={handleApplyNow}
                                className="w-full bg-vivid-red text-white py-3 rounded-xl font-bold uppercase tracking-wide hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2"
                             >
                                Apply Now <ArrowRight className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={(e) => openShareModal(viewingJob, e)}
                                className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold uppercase tracking-wide hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                             >
                                <Share2 className="w-4 h-4" /> Share Role
                             </button>
                         </div>
                    </div>
                </div>

                {/* Right Side: Detailed Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white">
                    <div className="hidden md:block mb-6">
                        <span className="inline-block px-2 py-0.5 bg-red-50 text-vivid-red border border-red-100 text-[10px] font-bold uppercase rounded mb-2">{viewingJob.category}</span>
                        <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-4">{viewingJob.title}</h2>
                    </div>

                    <div className="space-y-8">
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-vivid-red" /> Role Overview
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                {viewingJob.description || "No description available for this role."}
                            </p>
                        </section>

                        {viewingJob.responsibilities && (
                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <ListChecks className="w-5 h-5 text-vivid-red" /> Key Responsibilities
                                </h3>
                                <ul className="space-y-2">
                                    {viewingJob.responsibilities.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm md:text-base text-gray-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-vivid-red mt-2 shrink-0"></div>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {viewingJob.qualifications && (
                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5 text-vivid-red" /> Qualifications
                                </h3>
                                <ul className="space-y-2">
                                    {viewingJob.qualifications.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm md:text-base text-gray-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 shrink-0"></div>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                </div>
            </div>
         </div>
      )}

      {/* Job Alert Modal */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsAlertModalOpen(false)}
            ></div>

            {/* Modal Content */}
            <div className="bg-white w-full max-w-md rounded-3xl p-8 relative z-10 shadow-2xl animate-[fadeIn_0.3s_ease-out]">
                <button 
                    onClick={() => setIsAlertModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors p-2"
                >
                    <X className="w-5 h-5" />
                </button>

                {!alertSuccess ? (
                    <>
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-vivid-red mb-6">
                            <Bell className="w-6 h-6" />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Never miss a role</h3>
                        <p className="text-gray-500 mb-6 text-sm">
                            Get notified immediately when new jobs match your current search criteria.
                        </p>

                        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Selected Criteria</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-2 py-1 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700">
                                    {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
                                </span>
                                <span className="inline-flex items-center px-2 py-1 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700">
                                    {selectedType === 'All' ? 'All Types' : selectedType}
                                </span>
                                {searchQuery && (
                                    <span className="inline-flex items-center px-2 py-1 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700">
                                        "{searchQuery}"
                                    </span>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleAlertSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
                                <input 
                                    type="email" 
                                    required
                                    value={alertEmail}
                                    onChange={(e) => setAlertEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-vivid-red focus:border-transparent transition-all placeholder-gray-400 text-gray-900"
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={isSubmittingAlert}
                                className="w-full bg-vivid-red text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition-colors shadow-lg hover:shadow-red-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmittingAlert ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Setting up...
                                    </>
                                ) : (
                                    'Create Job Alert'
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">You're all set!</h3>
                        <p className="text-gray-500 text-sm">
                            We've sent a confirmation email to <span className="font-semibold text-gray-900">{alertEmail}</span>.
                            You'll start receiving updates soon.
                        </p>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* Share Job Modal */}
      {jobToShare && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setJobToShare(null)}
            ></div>
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative z-10 shadow-2xl animate-[fadeIn_0.3s_ease-out]">
                <button 
                    onClick={() => setJobToShare(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors p-2"
                >
                    <X className="w-5 h-5" />
                </button>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">Share this role</h3>
                <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                    Spread the word about the <span className="font-semibold text-gray-900">{jobToShare.title}</span> position at {jobToShare.location}.
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <a 
                        href={getSocialShareLink('email')}
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                    >
                        <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-700 group-hover:text-vivid-red border border-gray-100">
                            <Mail className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold text-gray-600">Email</span>
                    </a>
                    <a 
                        href={getSocialShareLink('linkedin')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                    >
                        <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-[#0077b5] border border-gray-100">
                            <Linkedin className="w-5 h-5 fill-current" />
                        </div>
                        <span className="text-xs font-semibold text-gray-600">LinkedIn</span>
                    </a>
                    <a 
                        href={getSocialShareLink('twitter')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                    >
                        <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-black border border-gray-100">
                            <Twitter className="w-5 h-5 fill-current" />
                        </div>
                        <span className="text-xs font-semibold text-gray-600">Twitter</span>
                    </a>
                </div>

                <div className="relative">
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-3">
                        <LinkIcon className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
                        <span className="text-xs text-gray-500 truncate flex-grow">
                            https://muhtesem-tech.com/jobs/{jobToShare.id}
                        </span>
                        <button 
                            onClick={copyShareLink}
                            className={`ml-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isCopied ? 'bg-green-100 text-green-700' : 'bg-white shadow-sm text-gray-700 hover:text-vivid-red'}`}
                        >
                            {isCopied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[80] bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-[fadeIn_0.3s_ease-out] border border-gray-700">
          {toast.type === 'success' ? (
             <CheckCircle className="w-5 h-5 text-vivid-red" />
          ) : (
             <Bookmark className="w-5 h-5 text-gray-400" />
          )}
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}
    </section>
  );
};

export default LiveJobs;