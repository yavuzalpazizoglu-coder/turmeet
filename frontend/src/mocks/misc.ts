/*
 * MOCK VERİ — Mesajlar, Kullanıcılar, Bekleyen Kayıtlar, Promosyonlar, Koordinatörler
 */
import type {
  MessageThread,
  User,
  PendingRegistration,
  Promotion,
  Coordinator,
} from "@/types";

export const MOCK_THREADS: MessageThread[] = [
  {
    // WhatsApp widget'ından gelen destek konuşması — widget "Open Messages"
    // linki ?thread=th-support ile bu thread'i açar.
    id: "th-support",
    type: "support",
    title: "Turmeet Support (WhatsApp)",
    lastMessage: "Yes — Turmeet is 100% free for event organizers. No hidden costs.",
    lastMessageAt: "2026-07-12T09:05:00Z",
    unreadCount: 1,
    messages: [
      {
        id: "ms1",
        threadId: "th-support",
        senderRole: "system",
        senderName: "Turmeet Support",
        body: "Hi! 👋 Welcome to Turmeet — Turkey's MICE venue search engine. How can we help?",
        attachments: [],
        sentAt: "2026-07-12T09:00:00Z",
      },
      {
        id: "ms2",
        threadId: "th-support",
        senderRole: "customer",
        senderName: "You",
        body: "Is Turmeet free for organizers?",
        attachments: [],
        sentAt: "2026-07-12T09:04:00Z",
      },
      {
        id: "ms3",
        threadId: "th-support",
        senderRole: "system",
        senderName: "Turmeet Support",
        body: "Yes — Turmeet is 100% free for event organizers. No subscription fees, no service charges, no hidden costs. Commission is paid by the venue, never by you.",
        attachments: [],
        sentAt: "2026-07-12T09:05:00Z",
      },
    ],
  },
  {
    id: "th1",
    type: "venue",
    title: "Swissôtel The Bosphorus Istanbul",
    lastMessage: "You can find the floor plan in the attached PDF.",
    lastMessageAt: "2026-07-11T10:32:00Z",
    unreadCount: 2,
    messages: [
      {
        id: "m1",
        threadId: "th1",
        senderRole: "customer",
        senderName: "You",
        body: "Hello, is Hall A's capacity of 200 in classroom setup?",
        attachments: [],
        sentAt: "2026-07-11T09:15:00Z",
      },
      {
        id: "m2",
        threadId: "th1",
        senderRole: "venue",
        senderName: "Swissôtel Events Team",
        body: "You can find the floor plan in the attached PDF. Classroom capacity is 180.",
        attachments: [{ name: "hall_plan_A.pdf", sizeKb: 2100 }],
        sentAt: "2026-07-11T10:32:00Z",
      },
    ],
  },
  {
    id: "th2",
    type: "coordinator",
    title: "Turmeet Coordinator — Gizem",
    lastMessage: "The contract draft is ready for your review.",
    lastMessageAt: "2026-07-10T16:00:00Z",
    unreadCount: 1,
    messages: [
      {
        id: "m3",
        threadId: "th2",
        senderRole: "coordinator",
        senderName: "Gizem (Coordinator)",
        body: "The contract draft is ready for your review. Please check the attrition clause.",
        attachments: [],
        sentAt: "2026-07-10T16:00:00Z",
      },
    ],
  },
  {
    id: "th3",
    type: "venue",
    title: "Hilton Istanbul Bomonti",
    lastMessage: "Our quote has been submitted through the platform.",
    lastMessageAt: "2026-07-03T10:20:00Z",
    unreadCount: 0,
    messages: [
      {
        id: "m4",
        threadId: "th3",
        senderRole: "venue",
        senderName: "Hilton Sales Office",
        body: "Our quote has been submitted through the platform. Happy to arrange a site visit.",
        attachments: [],
        sentAt: "2026-07-03T10:20:00Z",
      },
    ],
  },
];

export const MOCK_USER: User = {
  id: "u1",
  name: "Anna Weber",
  email: "anna.weber@nordwind-capital.de",
  company: "Nordwind Capital GmbH",
  country: "Germany",
  role: "customer_admin",
  createdAt: "2026-05-01T00:00:00Z",
};

export const MOCK_PENDING_REGISTRATIONS: PendingRegistration[] = [
  {
    id: "pr1",
    company: "EventScope Ltd",
    email: "procurement@eventscope.co.uk",
    country: "United Kingdom",
    sector: "Tourism Agency",
    contactName: "James Carter",
    status: "pending",
    appliedAt: "2026-07-10T14:22:00Z",
  },
  {
    id: "pr2",
    company: "Global Med Congress SA",
    email: "ops@gmcongress.fr",
    country: "France",
    sector: "Association",
    contactName: "Claire Dubois",
    status: "pending",
    appliedAt: "2026-07-11T08:05:00Z",
  },
  {
    id: "pr3",
    company: "TechBridge Events FZ-LLC",
    email: "team@techbridge.ae",
    country: "UAE",
    sector: "Corporate",
    contactName: "Omar Al-Rashid",
    status: "on_hold",
    appliedAt: "2026-07-08T10:40:00Z",
  },
];

export const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: "p1",
    venueId: "v1",
    name: "Complimentary meeting room",
    validFrom: "2026-07-01",
    validUntil: "2026-12-31",
    description: "Free main meeting room rental for bookings of 100+ room nights.",
    minCondition: "100+ room nights",
    active: true,
  },
  {
    id: "p2",
    venueId: "v1",
    name: "Low season group rate",
    validFrom: "2026-11-01",
    validUntil: "2027-02-28",
    description: "15% off published group rates for events in low season.",
    minCondition: "30+ rooms",
    active: false,
  },
];

/*
 * D Event koordinatör ekibi — MD 1824-1831 atama tablosu birebir:
 * Ahmet 8 kontrat / %95 müsait, Gizem 6 / %92 yoğun, Alptekin 4 / %98 müsait.
 * Elite müşteriler doğrudan Yavuzalp'e atanır (MD 2356).
 */
export const MOCK_COORDINATORS: Coordinator[] = [
  { id: "co1", name: "Ahmet", activeAssignments: 8, newThisWeek: 2, slaCompliance: 95, available: true },
  { id: "co2", name: "Gizem", activeAssignments: 6, newThisWeek: 3, slaCompliance: 92, available: false },
  { id: "co3", name: "Alptekin", activeAssignments: 4, newThisWeek: 1, slaCompliance: 98, available: true },
  { id: "co4", name: "Yavuzalp — Elite accounts", activeAssignments: 2, newThisWeek: 1, slaCompliance: 100, available: true },
];
