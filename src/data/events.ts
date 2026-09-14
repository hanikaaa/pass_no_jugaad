export interface Event {
  id: string;
  name: string;
  date: string;
  dateShort: string;
  venue: string;
  location: string;
  time: string;
  priceRange: string;
  priceMin: number;
  priceMax: number;
  type: string[];
  demand: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY HIGH';
  availability: 'Available' | 'Limited' | 'Request Only';
  image: string;
  artist?: string;
  description: string;
  featured?: boolean;
  jugaadDrop?: boolean;
  dropPrice?: number;
  originalPrice?: number;
  dropNumber?: number;
}

export const EVENTS: Event[] = [
  {
    id: 'e1',
    name: 'RAAS RANG 2026',
    date: '12 OCT 2026',
    dateShort: '12 OCT',
    venue: 'Sindhu Bhavan',
    location: 'Sindhu Bhavan, Ahmedabad',
    time: '7:00 PM onwards',
    priceRange: '₹800–₹1,500',
    priceMin: 800,
    priceMax: 1500,
    type: ['Artist Night', 'Premium'],
    demand: 'HIGH',
    availability: 'Request Only',
    image: 'https://images.unsplash.com/photo-1786452156548-9a60189a9876?w=800&h=500&fit=crop&auto=format',
    artist: 'DJ Chetas',
    description: "One of Ahmedabad's most sought-after Navratri nights. Featuring top artists, premium production and an electric crowd. If you want to be part of the season's biggest night, this is it.",
    featured: true,
  },
  {
    id: 'e2',
    name: 'UNITED GARBA FESTIVAL',
    date: '11 OCT 2026',
    dateShort: '11 OCT',
    venue: 'GIFT City',
    location: 'GIFT City, Gandhinagar',
    time: '6:30 PM onwards',
    priceRange: '₹1,500–₹2,000',
    priceMin: 1500,
    priceMax: 2000,
    type: ['Pure Garba', 'Premium'],
    demand: 'VERY HIGH',
    availability: 'Limited',
    image: 'https://images.unsplash.com/photo-1667831617890-458ca443d799?w=800&h=500&fit=crop&auto=format',
    artist: 'Falguni Pathak',
    description: 'The biggest Pure Garba event of the season at GIFT City. Traditional raas garba with a massive stage production and 15,000+ crowd. A once-in-a-season experience.',
    featured: true,
  },
  {
    id: 'e3',
    name: 'NEON GARBA NIGHT',
    date: '13 OCT 2026',
    dateShort: '13 OCT',
    venue: 'SG Highway',
    location: 'SG Highway, Ahmedabad',
    time: '8:00 PM – 2:00 AM',
    priceRange: '₹1,000–₹1,500',
    priceMin: 1000,
    priceMax: 1500,
    type: ['Late Night', 'Youth', 'College'],
    demand: 'HIGH',
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1617184003170-1f266c325ff3?w=800&h=500&fit=crop&auto=format',
    description: 'Late-night neon-themed garba for the younger crowd. High energy, huge sound system and glow-in-the-dark outfits welcome.',
    featured: false,
  },
  {
    id: 'e4',
    name: 'BOPAL BEATS',
    date: '14 OCT 2026',
    dateShort: '14 OCT',
    venue: 'Bopal Ground',
    location: 'Bopal, Ahmedabad',
    time: '7:00 PM onwards',
    priceRange: '₹500–₹800',
    priceMin: 500,
    priceMax: 800,
    type: ['Full Power', 'College', 'Family'],
    demand: 'MEDIUM',
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1616787671779-eed71117a65e?w=800&h=500&fit=crop&auto=format',
    description: "Community garba at Bopal grounds. Great for families and college groups. Affordable, high-energy and close to home for Bopal's crowd.",
  },
  {
    id: 'e5',
    name: 'SBR MEGA GARBA',
    date: '15 OCT 2026',
    dateShort: '15 OCT',
    venue: 'SBR Ground',
    location: 'SBR, Ahmedabad',
    time: '6:00 PM onwards',
    priceRange: '₹1,200–₹2,500',
    priceMin: 1200,
    priceMax: 2500,
    type: ['Premium', 'Artist Night'],
    demand: 'VERY HIGH',
    availability: 'Request Only',
    image: 'https://images.unsplash.com/photo-1728272356720-4e0bd55a6e09?w=800&h=500&fit=crop&auto=format',
    artist: 'Kinjal Dave',
    description: "SBR's most awaited Navratri spectacle. Multi-stage setup, top artists and 10,000+ crowd. This sells out every year — request early.",
    featured: true,
    jugaadDrop: true,
    dropPrice: 1200,
    originalPrice: 1800,
    dropNumber: 1,
  },
  {
    id: 'e6',
    name: 'SHILAJ STAR NIGHT',
    date: '16 OCT 2026',
    dateShort: '16 OCT',
    venue: 'Shilaj Maidan',
    location: 'Shilaj, Ahmedabad',
    time: '7:30 PM onwards',
    priceRange: '₹800–₹1,200',
    priceMin: 800,
    priceMax: 1200,
    type: ['Artist Night', 'Late Night'],
    demand: 'HIGH',
    availability: 'Limited',
    image: 'https://images.unsplash.com/photo-1767278608250-e87182850006?w=800&h=500&fit=crop&auto=format',
    jugaadDrop: true,
    dropPrice: 800,
    originalPrice: 1200,
    dropNumber: 2,
    description: 'Star-studded artist night at Shilaj. One of the most in-demand events this Navratri season. Limited passes available through Pass No Jugaad exclusively.',
  },
  {
    id: 'e7',
    name: 'CLASSIC DANDIYA NIGHT',
    date: '17 OCT 2026',
    dateShort: '17 OCT',
    venue: 'Sindhu Bhavan Road',
    location: 'Sindhu Bhavan Road, Ahmedabad',
    time: '7:00 PM – 1:00 AM',
    priceRange: '₹600–₹1,000',
    priceMin: 600,
    priceMax: 1000,
    type: ['Pure Garba', 'Family'],
    demand: 'MEDIUM',
    availability: 'Available',
    image: 'https://images.unsplash.com/photo-1645264090488-a019de493023?w=800&h=500&fit=crop&auto=format',
    description: 'Traditional dandiya in the old-school style. Pure garba, classic songs and a warm community atmosphere.',
  },
  {
    id: 'e8',
    name: 'GRAND FINALE NIGHT',
    date: '19 OCT 2026',
    dateShort: '19 OCT',
    venue: 'GIFT City',
    location: 'GIFT City, Gandhinagar',
    time: '6:00 PM – 3:00 AM',
    priceRange: '₹2,000–₹3,000',
    priceMin: 2000,
    priceMax: 3000,
    type: ['Premium', 'Artist Night', 'Late Night'],
    demand: 'VERY HIGH',
    availability: 'Request Only',
    image: 'https://images.unsplash.com/photo-1783255333879-6974e32a2356?w=800&h=500&fit=crop&auto=format',
    artist: 'Multiple Artists',
    description: "Navami finale. The last and loudest night. Multiple headlining artists, premium production and Ahmedabad's biggest closing crowd.",
    featured: true,
  },
];

export const NAVRATRI_DATES = [
  '10 OCT', '11 OCT', '12 OCT', '13 OCT', '14 OCT',
  '15 OCT', '16 OCT', '17 OCT', '18 OCT', '19 OCT'
];

export const DEMAND_COLOR: Record<string, string> = {
  'LOW': '#22d3ee',
  'MEDIUM': '#f5b800',
  'HIGH': '#ff7b00',
  'VERY HIGH': '#ff3b3b',
};

export const DEMAND_LABEL: Record<string, string> = {
  'LOW': '🌊 LOW DEMAND',
  'MEDIUM': '📈 MEDIUM DEMAND',
  'HIGH': '🔥 HIGH DEMAND',
  'VERY HIGH': '🔥 VERY HIGH DEMAND',
};

export const AVAIL_COLOR: Record<string, string> = {
  'Available': '#22c55e',
  'Limited': '#f5b800',
  'Request Only': '#FF5500',
};

export type Page =
  | 'home'
  | 'find-jugaad'
  | 'jugaad-success'
  | 'radar'
  | 'calendar'
  | 'events'
  | 'event-detail'
  | 'request-pass'
  | 'request-success'
  | 'drops'
  | 'gallery'
  | 'organisers'
  | 'organiser-form'
  | 'organiser-success'
  | 'my-requests'
  | 'about'
  | 'contact';

export interface NavProps {
  navigate: (page: Page, opts?: { eventId?: string }) => void;
  currentPage: Page;
}
