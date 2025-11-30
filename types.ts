import React from 'react';

export interface Job {
  id: string;
  title: string;
  category: string;
  location: string;
  pay: string;
  type: 'Contract' | 'Permanent';
  description?: string;
  responsibilities?: string[];
  qualifications?: string[];
}

export interface NavLink {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export interface Sector {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  type: 'Client' | 'Candidate';
  quote: string;
  avatarId: string;
}