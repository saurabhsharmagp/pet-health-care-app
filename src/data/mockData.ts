export type Owner = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type Pet = {
  id: string;
  name: string;
  species: 'Dog' | 'Cat' | 'Bird' | 'Rabbit';
  breed: string;
  age: string;
  weightKg: number;
  color: string;
  initial: string;
  photoUrl?: string;
  ownerId: string;
};

export type Vet = {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  rating: number;
  reviewsCount: number;
  priceLabel: string;
  priceValue: number;
  distanceKm: number;
  bio: string;
  color: string;
  initial: string;
  photoUrl?: string;
  availableSlots: { date: string; times: string[] }[];
  supportsVideo: boolean;
};

export type LabTestPackage = {
  id: string;
  name: string;
  category: string;
  description: string;
  includedTests: string[];
  price: number;
  turnaround: string;
  fasting: boolean;
  icon: string;
  color: string;
};

export type Appointment = {
  id: string;
  vetId: string;
  petId: string;
  date: string;
  time: string;
  reason: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'in-person' | 'video';
};

export type ChatMessage = {
  id: string;
  sender: 'user' | 'vet';
  text: string;
  time: string;
};

export type DoctorThread = {
  id: string;
  vetId: string;
  petId: string;
  messages: ChatMessage[];
};

export const currentUser = {
  name: 'Saurabh Sharma',
  email: 'saurabhsharmagp@yahoo.com',
  initial: 'S',
};

export const DOCTOR_VET_ID = 'vet-1';

export const owners: Owner[] = [
  { id: 'owner-1', name: 'Saurabh Sharma', email: 'saurabhsharmagp@yahoo.com', phone: '+91 98765 43210' },
  { id: 'owner-2', name: 'Neha Kapoor', email: 'neha.kapoor@example.com', phone: '+91 91234 56780' },
  { id: 'owner-3', name: 'Rohan Verma', email: 'rohan.verma@example.com', phone: '+91 99887 66554' },
];

export const pets: Pet[] = [
  {
    id: 'pet-1',
    name: 'Bruno',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: '3 yrs',
    weightKg: 28,
    color: '#FF8C42',
    initial: 'B',
    photoUrl: 'https://loremflickr.com/400/400/golden-retriever?lock=101',
    ownerId: 'owner-1',
  },
  {
    id: 'pet-2',
    name: 'Whiskers',
    species: 'Cat',
    breed: 'Persian',
    age: '1.5 yrs',
    weightKg: 4,
    color: '#0F9D8B',
    initial: 'W',
    photoUrl: 'https://loremflickr.com/400/400/persian-cat?lock=102',
    ownerId: 'owner-1',
  },
  {
    id: 'pet-3',
    name: 'Max',
    species: 'Dog',
    breed: 'Labrador',
    age: '4 yrs',
    weightKg: 30,
    color: '#3D8BFD',
    initial: 'M',
    photoUrl: 'https://loremflickr.com/400/400/labrador?lock=103',
    ownerId: 'owner-2',
  },
  {
    id: 'pet-4',
    name: 'Simba',
    species: 'Cat',
    breed: 'Maine Coon',
    age: '2 yrs',
    weightKg: 6,
    color: '#F4A261',
    initial: 'S',
    photoUrl: 'https://loremflickr.com/400/400/maine-coon-cat?lock=104',
    ownerId: 'owner-3',
  },
];

export const vets: Vet[] = [
  {
    id: 'vet-1',
    name: 'Dr. Anjali Rao',
    specialty: 'General & Preventive Care',
    clinic: 'Green Paws Veterinary Clinic',
    rating: 4.9,
    reviewsCount: 214,
    priceLabel: '₹600 / visit',
    priceValue: 600,
    distanceKm: 1.2,
    bio: 'Dr. Rao has 10+ years of experience in general wellness, vaccinations, and preventive care for dogs and cats.',
    color: '#0F9D8B',
    initial: 'A',
    photoUrl: 'https://loremflickr.com/400/400/veterinarian,woman?lock=201',
    supportsVideo: true,
    availableSlots: [
      { date: 'Mon, 21 Jul', times: ['09:30 AM', '11:00 AM', '04:00 PM'] },
      { date: 'Tue, 22 Jul', times: ['10:00 AM', '02:30 PM'] },
      { date: 'Wed, 23 Jul', times: ['09:00 AM', '01:00 PM', '05:30 PM'] },
    ],
  },
  {
    id: 'vet-2',
    name: 'Dr. Karan Mehta',
    specialty: 'Dermatology',
    clinic: 'CityVet Specialty Hospital',
    rating: 4.7,
    reviewsCount: 132,
    priceLabel: '₹900 / visit',
    priceValue: 900,
    distanceKm: 3.4,
    bio: 'Specialist in skin allergies, infections, and coat health for all breeds.',
    color: '#FF8C42',
    initial: 'K',
    photoUrl: 'https://loremflickr.com/400/400/veterinarian,man?lock=202',
    supportsVideo: true,
    availableSlots: [
      { date: 'Mon, 21 Jul', times: ['12:00 PM', '03:30 PM'] },
      { date: 'Thu, 24 Jul', times: ['09:30 AM', '11:30 AM'] },
    ],
  },
  {
    id: 'vet-3',
    name: 'Dr. Priya Nair',
    specialty: 'Surgery & Orthopedics',
    clinic: 'Metro Animal Hospital',
    rating: 4.8,
    reviewsCount: 98,
    priceLabel: '₹1,200 / visit',
    priceValue: 1200,
    distanceKm: 5.1,
    bio: 'Orthopedic and soft-tissue surgeon with a focus on post-op recovery plans.',
    color: '#3D8BFD',
    initial: 'P',
    photoUrl: 'https://loremflickr.com/400/400/doctor,woman?lock=203',
    supportsVideo: false,
    availableSlots: [
      { date: 'Wed, 23 Jul', times: ['10:30 AM'] },
      { date: 'Fri, 25 Jul', times: ['09:00 AM', '11:00 AM'] },
    ],
  },
  {
    id: 'vet-4',
    name: 'Dr. Simran Kaur',
    specialty: 'Nutrition & Wellness',
    clinic: 'Green Paws Veterinary Clinic',
    rating: 4.6,
    reviewsCount: 76,
    priceLabel: '₹500 / visit',
    priceValue: 500,
    distanceKm: 1.2,
    bio: 'Helps design diet and weight-management plans tailored to your pet.',
    color: '#E63946',
    initial: 'S',
    photoUrl: 'https://loremflickr.com/400/400/veterinarian,woman?lock=204',
    supportsVideo: true,
    availableSlots: [
      { date: 'Tue, 22 Jul', times: ['09:00 AM', '04:30 PM'] },
      { date: 'Thu, 24 Jul', times: ['01:00 PM'] },
    ],
  },
];

export const appointments: Appointment[] = [
  {
    id: 'appt-1',
    vetId: 'vet-1',
    petId: 'pet-1',
    date: 'Mon, 21 Jul',
    time: '11:00 AM',
    reason: 'Annual checkup + vaccination',
    status: 'upcoming',
    type: 'in-person',
  },
  {
    id: 'appt-2',
    vetId: 'vet-2',
    petId: 'pet-2',
    date: 'Tue, 15 Jul',
    time: '10:00 AM',
    reason: 'Skin irritation follow-up',
    status: 'completed',
    type: 'video',
  },
  {
    id: 'appt-3',
    vetId: 'vet-3',
    petId: 'pet-1',
    date: 'Wed, 08 Jul',
    time: '09:00 AM',
    reason: 'Limping on hind leg',
    status: 'completed',
    type: 'in-person',
  },
  {
    id: 'appt-4',
    vetId: 'vet-1',
    petId: 'pet-3',
    date: 'Mon, 21 Jul',
    time: '09:30 AM',
    reason: 'Ear infection check',
    status: 'upcoming',
    type: 'in-person',
  },
  {
    id: 'appt-5',
    vetId: 'vet-1',
    petId: 'pet-4',
    date: 'Tue, 22 Jul',
    time: '10:00 AM',
    reason: 'Routine vaccination',
    status: 'upcoming',
    type: 'video',
  },
  {
    id: 'appt-6',
    vetId: 'vet-1',
    petId: 'pet-3',
    date: 'Mon, 07 Jul',
    time: '11:00 AM',
    reason: 'Annual checkup',
    status: 'completed',
    type: 'in-person',
  },
];

export const labTestPackages: LabTestPackage[] = [
  {
    id: 'lab-1',
    name: 'Basic Wellness Panel',
    category: 'Preventive Screening',
    description: 'A general health snapshot covering blood count, kidney and liver function — great for annual checkups.',
    includedTests: ['Complete Blood Count (CBC)', 'Kidney function (BUN, Creatinine)', 'Liver enzymes (ALT, ALP)', 'Blood glucose'],
    price: 899,
    turnaround: '24-48 hrs',
    fasting: true,
    icon: 'flask-outline',
    color: '#0F9D8B',
  },
  {
    id: 'lab-2',
    name: 'Complete Blood Count (CBC)',
    category: 'Blood Work',
    description: 'Checks red and white blood cell counts to screen for infection, anemia, and other blood disorders.',
    includedTests: ['Red blood cell count', 'White blood cell count', 'Platelet count', 'Hemoglobin'],
    price: 399,
    turnaround: '24 hrs',
    fasting: false,
    icon: 'water-outline',
    color: '#FF8C42',
  },
  {
    id: 'lab-3',
    name: 'Deworming & Parasite Check',
    category: 'Parasite Screening',
    description: 'Screens for intestinal parasites and giardia using a stool sample.',
    includedTests: ['Fecal ova & parasite exam', 'Giardia antigen test'],
    price: 349,
    turnaround: '24 hrs',
    fasting: false,
    icon: 'bug-outline',
    color: '#E63946',
  },
  {
    id: 'lab-4',
    name: 'Skin Allergy Panel',
    category: 'Dermatology',
    description: 'Identifies environmental and food allergens behind itching, rashes, and recurring skin issues.',
    includedTests: ['Environmental allergen panel', 'Food allergen panel', 'Skin scrape analysis'],
    price: 1499,
    turnaround: '3-5 days',
    fasting: false,
    icon: 'body-outline',
    color: '#3D8BFD',
  },
  {
    id: 'lab-5',
    name: 'Senior Pet Screening',
    category: 'Comprehensive Health',
    description: 'A thorough workup for senior pets covering blood chemistry, thyroid, urine and chest imaging review.',
    includedTests: ['Full blood chemistry panel', 'Thyroid function (T4)', 'Urinalysis', 'Chest X-ray review'],
    price: 2199,
    turnaround: '48-72 hrs',
    fasting: true,
    icon: 'heart-outline',
    color: '#F4A261',
  },
];

export const labTestSlots: { date: string; times: string[] }[] = [
  { date: 'Mon, 21 Jul', times: ['08:00 AM', '10:00 AM', '05:00 PM'] },
  { date: 'Tue, 22 Jul', times: ['09:00 AM', '11:00 AM'] },
  { date: 'Wed, 23 Jul', times: ['08:00 AM', '01:00 PM', '04:00 PM'] },
];

export const chatThreads: Record<string, ChatMessage[]> = {
  'vet-1': [
    { id: 'm1', sender: 'vet', text: 'Hi! How is Bruno doing after the last vaccination?', time: '09:12 AM' },
    { id: 'm2', sender: 'user', text: 'He seems fine, just a little low energy yesterday.', time: '09:15 AM' },
    { id: 'm3', sender: 'vet', text: 'That is normal for 24-48 hrs. Keep him hydrated and let me know if it continues.', time: '09:17 AM' },
  ],
  'vet-2': [
    { id: 'm1', sender: 'vet', text: 'The redness on Whiskers should reduce in a few days with the ointment.', time: 'Yesterday' },
  ],
};

export const doctorThreads: DoctorThread[] = [
  {
    id: 'dthread-1',
    vetId: 'vet-1',
    petId: 'pet-1',
    messages: chatThreads['vet-1'],
  },
  {
    id: 'dthread-2',
    vetId: 'vet-1',
    petId: 'pet-3',
    messages: [
      { id: 'm1', sender: 'user', text: "Max has been scratching his left ear a lot since yesterday.", time: '08:40 AM' },
      { id: 'm2', sender: 'vet', text: 'Any discharge or odor from the ear?', time: '08:52 AM' },
      { id: 'm3', sender: 'user', text: "A little discharge, and it smells a bit off.", time: '08:55 AM' },
      { id: 'm4', sender: 'vet', text: "That sounds like it could be an ear infection. Let's take a look at your upcoming visit.", time: '09:01 AM' },
    ],
  },
];

export const doctorRevenue: { month: string; amount: number; appointments: number }[] = [
  { month: 'Feb', amount: 42000, appointments: 58 },
  { month: 'Mar', amount: 47500, appointments: 63 },
  { month: 'Apr', amount: 39800, appointments: 52 },
  { month: 'May', amount: 51200, appointments: 68 },
  { month: 'Jun', amount: 55900, appointments: 74 },
  { month: 'Jul', amount: 34650, appointments: 41 },
];
