import React from 'react';
import { Job, NavLink, Sector, Testimonial } from './types';
import { 
  Cpu, 
  Settings, 
  FlaskConical, 
  Building2, 
  Briefcase 
} from 'lucide-react';

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '#' },
  { label: 'Hire talent', href: '#' },
  { label: 'Find a job', href: '#' },
  { label: 'Candidates', href: '#', hasDropdown: true },
  { label: 'Our Team', href: '#' },
  { label: 'Muhteşem Careers', href: '#', hasDropdown: true },
  { label: 'FAQs', href: '#' },
  { label: 'News', href: '#' },
];

export const SECTORS: Sector[] = [
  { id: 'tech', title: 'Muhteşem Tech', icon: <Cpu className="w-5 h-5" /> },
  { id: 'eng', title: 'Muhteşem Engineering', icon: <Settings className="w-5 h-5" /> },
  { id: 'life', title: 'Muhteşem Life Sciences', icon: <FlaskConical className="w-5 h-5" /> },
  { id: 'gov', title: 'Muhteşem Government', icon: <Building2 className="w-5 h-5" /> },
  { id: 'careers', title: 'Muhteşem Careers', icon: <Briefcase className="w-5 h-5" /> },
];

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    category: 'ENGINEERING',
    title: 'Project Leader (Workday Implementation)',
    location: 'Ghent, Belgium',
    pay: 'Daily Rate',
    type: 'Contract',
    description: 'We are seeking an experienced Project Leader to oversee a large-scale Workday implementation for a leading industrial client. You will be responsible for bridging the gap between technical teams and business stakeholders, ensuring a smooth transition and adoption of the new system.',
    responsibilities: [
      'Lead the end-to-end implementation of Workday HCM modules.',
      'Manage stakeholder expectations and communicate progress to the steering committee.',
      'Coordinate with third-party vendors and internal IT teams.',
      'Define project scope, timeline, and resource allocation.'
    ],
    qualifications: [
      '5+ years of experience in ERP implementation, specifically Workday.',
      'Strong project management skills (Prince2 or PMP certification preferred).',
      'Excellent communication skills in English and Dutch.',
      'Ability to travel to Ghent 3 days a week.'
    ]
  },
  {
    id: '2',
    category: 'CONSUMER GOODS & RETAIL',
    title: 'Data Analyst',
    location: 'Netherlands',
    pay: '€75,000',
    type: 'Permanent',
    description: 'Join a global retail giant as a Data Analyst and help shape their consumer strategy. You will analyze purchasing patterns, optimize supply chain logistics through data, and build predictive models to forecast trends.',
    responsibilities: [
      'Analyze large datasets to identify consumer trends and actionable insights.',
      'Design and maintain interactive dashboards using Tableau or PowerBI.',
      'Collaborate with marketing and sales teams to optimize campaign performance.',
      'Develop predictive models to support inventory management.'
    ],
    qualifications: [
      'Bachelor’s degree in Mathematics, Statistics, or Computer Science.',
      'Proficiency in SQL and Python/R.',
      'Experience with data visualization tools (Tableau, PowerBI).',
      'Strong analytical mindset and attention to detail.'
    ]
  },
  {
    id: '3',
    category: 'LEGAL',
    title: 'Property Lawyer',
    location: 'London, United Kingdom',
    pay: '50-55',
    type: 'Contract',
    description: 'A prestigious law firm in London is looking for a Property Lawyer to assist with a high-volume commercial real estate portfolio. This is a 6-month contract with the possibility of extension.',
    responsibilities: [
      'Handle commercial property transactions from instruction to completion.',
      'Draft and negotiate leases, licenses, and renewal documents.',
      'Conduct title investigations and report on findings.',
      'Liaise with clients, agents, and other solicitors.'
    ],
    qualifications: [
      'Qualified Solicitor or Licensed Conveyancer with 2+ years PQE.',
      'Strong experience in commercial property law.',
      'Ability to manage a busy caseload independently.',
      'Excellent client care and negotiation skills.'
    ]
  },
  {
    id: '4',
    category: 'TECHNOLOGY',
    title: 'Senior React Developer',
    location: 'Remote, Europe',
    pay: '€600/day',
    type: 'Contract',
    description: 'We are looking for a Senior React Developer to join a fast-paced fintech startup. You will be building a next-generation trading platform, focusing on performance, scalability, and user experience.',
    responsibilities: [
      'Develop new features using React, TypeScript, and Tailwind CSS.',
      'Optimize application performance for maximum speed and scalability.',
      'Collaborate with UX/UI designers to implement pixel-perfect interfaces.',
      'Mentor junior developers and conduct code reviews.'
    ],
    qualifications: [
      '5+ years of frontend development experience.',
      'Deep knowledge of React.js, React Hooks, and state management (Redux/Zustand).',
      'Experience with WebSocket integration for real-time data.',
      'Familiarity with CI/CD pipelines and testing frameworks (Jest/Cypress).'
    ]
  },
  {
    id: '5',
    category: 'LIFE SCIENCES',
    title: 'QA Manager',
    location: 'Berlin, Germany',
    pay: '€85,000',
    type: 'Permanent',
    description: 'A leading pharmaceutical company is seeking a Quality Assurance Manager to oversee their software compliance and validation processes. You will ensure all systems meet GxP and FDA regulations.',
    responsibilities: [
      'Develop and implement QA strategies for software validation (CSV).',
      'Lead internal and external audits to ensure regulatory compliance.',
      'Manage a team of QA engineers and validation specialists.',
      'Maintain quality management systems (QMS) and documentation.'
    ],
    qualifications: [
      'Experience in the Life Sciences or Pharmaceutical industry.',
      'In-depth knowledge of GxP, FDA 21 CFR Part 11, and Annex 11.',
      'Strong leadership and team management skills.',
      'Fluent in German and English.'
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'CTO',
    company: 'FinTech Solutions Ltd',
    type: 'Client',
    quote: 'Muhteşem Technology understood our technical requirements immediately. Within 48 hours, we had CVs for 3 perfect candidates. A truly seamless hiring experience.',
    avatarId: '32',
  },
  {
    id: '2',
    name: 'David Chen',
    role: 'Senior DevOps Engineer',
    company: undefined,
    type: 'Candidate',
    quote: 'The team was incredibly supportive throughout my placement. They negotiated a rate higher than I expected and handled all the contract logistics perfectly.',
    avatarId: '64',
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    role: 'Head of Talent',
    company: 'Global Pharma Corp',
    type: 'Client',
    quote: 'We needed to scale our QA team rapidly for a new product launch. Muhteşem delivered 10 qualified contractors in under two weeks. Their speed is unmatched.',
    avatarId: '45',
  },
  {
    id: '4',
    name: 'James Wilson',
    role: 'Infrastructure Manager',
    company: 'Public Sector IT',
    type: 'Client',
    quote: 'Finding cleared professionals for government projects is difficult. Muhteşem made it look easy, providing us with candidates who were ready to start immediately.',
    avatarId: '12',
  },
  {
    id: '5',
    name: 'Anita Patel',
    role: 'Bioinformatics Lead',
    company: 'GeneSys Labs',
    type: 'Candidate',
    quote: 'I was looking for a very niche role in Zurich. The recruiters at Muhteşem not only found the perfect role but helped with the entire relocation process.',
    avatarId: '28',
  },
  {
    id: '6',
    name: 'Marcus Thorne',
    role: 'Director of Engineering',
    company: 'AutoTech Innovations',
    type: 'Client',
    quote: 'We have worked with many agencies, but none have the depth of network that Muhteşem has. They are our go-to partner for all senior technical hires.',
    avatarId: '68',
  },
  {
    id: '7',
    name: 'Sophie Dubois',
    role: 'HR Director',
    company: 'Retail Giant Co',
    type: 'Client',
    quote: 'Their data-driven approach to recruitment is refreshing. They provided us with market insights that helped us refine our offer and secure the best talent.',
    avatarId: '21',
  },
  {
    id: '8',
    name: 'Thomas Mueller',
    role: 'Senior Java Developer',
    company: undefined,
    type: 'Candidate',
    quote: 'Professional, transparent, and efficient. Muhteşem Technology helped me land my dream contract in Berlin. Highly recommended.',
    avatarId: '55',
  },
  {
    id: '9',
    name: 'Isabella Rossi',
    role: 'Operations Head',
    company: 'GovTech Solutions',
    type: 'Client',
    quote: 'A partner that truly cares about the long-term success of their placements. The retention rate of candidates from Muhteşem is outstanding.',
    avatarId: '41',
  }
];