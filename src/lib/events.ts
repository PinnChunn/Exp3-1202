import { Instructor } from './types';

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  format: string;
  location?: string;
  description: string;
  imageUrl: string;
  xp?: number;
  attendeeLimit: number;
  tags: string[];
  skills: string[];
  requirements: string[];
  instructor: Instructor;
  learningOutcomes?: string[];
  registeredUsers: string[];
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  meetingLink?: string;
  externalLink?: string;
  duration?: string;
  participants?: number;
}

export const EVENTS_DATA: Event[] = [
  {
    id: 'aiux-lecture',
    title: "AI/UX Lecture",
    date: "December 8, 2024",
    time: "15:00 PM EST",
    format: "Virtual",
    description: "Join us for an intensive workshop that bridges the gap between AI technology and UX design. Learn how to leverage artificial intelligence to enhance user experiences, automate design workflows, and create more intelligent interfaces.",
    imageUrl: "/aiux活動動圖.mp4",
    xp: 500,
    attendeeLimit: 200,
    tags: ["AI", "UX", "Design"],
    skills: ["AI Integration", "UX Research", "Interface Design", "Technical Implementation"],
    requirements: [
      "Basic understanding of UX design principles",
      "Familiarity with design tools (Figma, Sketch)",
      "No coding experience required"
    ],
    learningOutcomes: [
      "Understand AI's role in modern UX design",
      "Learn to integrate AI tools into design workflows",
      "Create AI-enhanced user interfaces",
      "Implement ethical AI design principles"
    ],
    instructor: {
      id: "instructor1",
      name: "温明輝",
      role: "UX Research & Design Expert",
      avatar: "/speaker.jpg",
      bio: "40% 網路創業者 + 40 % 設計學院教授 + 20% UX 修行者與傳教士",
      stats: {
        courses: 12,
        articles: 45,
        students: 2800
      },
      expertise: [
        "AI/UX Integration",
        "Design Systems",
        "User Research",
        "Product Strategy"
      ]
    },
    meetingLink: "https://meet.google.com/bed-xapu-fve",
    status: "published",
    participants: 0,
    registeredUsers: []
  },
  {
    id: 'ux3-workshop',
    title: "UX.3toryu Workshop",
    date: "September 2024",
    time: "Flexible",
    format: "Virtual",
    duration: "September 2024 - February 2025",
    description: "Learn how to design and develop Web3 applications with a focus on user experience. This workshop covers everything from token economics to smart contract integration from a UX perspective.",
    imageUrl: "/3.jpg",
    xp: 500,
    attendeeLimit: 1000,
    participants: 970,
    tags: ["UX", "Web3", "Design"],
    skills: ["Web3 Design", "DApp UX", "Token Economics", "Smart Contract Integration"],
    requirements: [
      "Basic understanding of blockchain concepts",
      "Familiarity with Web3 wallets",
      "Basic JavaScript knowledge"
    ],
    instructor: {
      id: "instructor2",
      name: "Alex Chen",
      role: "Web3 UX Specialist",
      avatar: "/speaker.jpg",
      bio: "Pioneering the intersection of Web3 and user experience design",
      expertise: [
        "Web3 UX",
        "DApp Design",
        "Token Economics",
        "Smart Contracts"
      ]
    },
    externalLink: "https://lu.ma/ux3",
    status: "published",
    registeredUsers: []
  }
];

// Get all events
export const getEvents = () => {
  return EVENTS_DATA;
};

// Get a single event by ID
export const getEvent = (id: string): Event | null => {
  return EVENTS_DATA.find(event => event.id === id) || null;
};

// Check if a user is registered for an event
export const isUserRegistered = (eventId: string, userId: string): boolean => {
  const event = getEvent(eventId);
  return event ? event.registeredUsers.includes(userId) : false;
};

// Register a user for an event
export const registerForEvent = async (eventId: string, userId: string) => {
  const event = EVENTS_DATA.find(event => event.id === eventId);
  
  if (!event) {
    return { error: 'Event not found' };
  }

  if (event.registeredUsers.includes(userId)) {
    return { error: 'Already registered for this event' };
  }

  if (event.registeredUsers.length >= event.attendeeLimit) {
    return { error: 'Event is full' };
  }

  event.registeredUsers.push(userId);
  event.participants = (event.participants || 0) + 1;

  return { error: null };
};