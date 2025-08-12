export const navOptions = [
  { path: "/", name: "Home" },
  { path: "/about", name: "About Us" },
  { path: "/courses", name: "Courses" },
  { path: "/blogs", name: "Blog" },
  { path: "/events", name: "Events" },
  { path: "/gallery", name: "Gallery" },
  { path: "/donation", name: "Donate" },
];

export const QuoteFields = [
  { name: "quote", type: "string" },
  { name: "location", type: "string" },
  { name: "date", type: "date" },
];

export const EventFields = [
  { name: "title", type: "string" },
  { name: "description", type: "string" },
  { name: "type", type: "select", options: ["parent", "child"]},
  { name: "location", type: "string" },
  { name: "imageUrl", type: "img" },
  { name: "date", type: "date" },
]

export const BlogFields = [
  { name: "Title of the Blog", type: "string" },
  { name: "content", type: "text-editor" },
  { name: "author", type: "string" },
  { name: "date", type: "date" },
];

export const QueryFields = [
  { name: "name", type: "string" },
  { name: "email", type: "string" },
  { name: "phone", type: "string" },
  { name: "message", type: "string" },
];

export const JoinUsFields = [
  { name: "name", type: "string" },
  { name: "email", type: "string" },
  { name: "phone", type: "string" },
  {
    name: "services",
    type: "checkbox",
    options: [
      "Competitions",
      "Cultural Events",
      "Facilitate Meetings Onsite",
      "Promotions",
    ],
  },
  { name: "message", type: "string" },
];

export const DONOR_TIERS = [
  {
    name: "Kaustubha",
    amount: "₹108,108",
    numericAmount: 108108,
    benefits: [
      "• Airport pickup & drop-off",
      "• 2 days prasādam & accommodations for 2",
      "• Transcend App in your language",
      "• Śrīla Prabhupāda Lilamrita (hard copy in Mayapur)",
      "• All Jayapatākā Swami’s e‑books (or hard copies in Mayapur)",
      "• Jewelry made with Sri Sri Radha‑Madhava’s Mahā: 2 earrings, 1 necklace & 2 japa counter beads",
    ],
  },
  {
    name: "Diamond",
    amount: "₹88,108",
    numericAmount: 88108,
    benefits: [
      "• Airport pickup & drop-off",
      "• 1 day prasādam & accommodations for 2",
      "• Transcend App in your language",
      "• Śrīla Prabhupāda Lilamrita (hard copy in Mayapur)",
      "• All Jayapatākā Swami’s e‑books (or hard copies in Mayapur)",
      "• Jewelry with Sri Sri Radha‑Madhava’s Mahā: 2 earrings, 1 necklace, 2 japa counter beads",
    ],
  },
  {
    name: "Pearl",
    amount: "₹68,108",
    numericAmount: 68108,
    benefits: [
      "• Transcend App in your language",
      "• Śrīla Prabhupāda Lilamrita (hard copy in Mayapur)",
      "• All Jayapatākā Swami’s e‑books (or hard copies in Mayapur)",
      "• Jewelry with Sri Sri Radha‑Madhava’s Mahā: 2 earrings, 1 necklace, 2 japa counter beads",
    ],
  },
  {
    name: "Ruby",
    amount: "₹48,108",
    numericAmount: 48108,
    benefits: [
      "• Śrīla Prabhupāda Lilamrita e‑book (or hard copy in Mayapur)",
      "• All Jayapatākā Swami’s e‑books (or hard copies in Mayapur)",
      "• Jewelry with Sri Sri Radha‑Madhava’s Mahā: 2 earrings & 2 japa counter beads",
    ],
  },
  {
    name: "Sapphire",
    amount: "₹38,108",
    numericAmount: 38108,
    benefits: [
      "• Śrīla Prabhupāda Lilamrita e‑book (or hard copy in Mayapur)",
      "• All Jayapatākā Swami’s e‑books (or hard copies in Mayapur)",
      "• Jewelry with Sri Sri Radha‑Madhava’s Mahā: 2 japa counter beads",
    ],
  },
  {
    name: "Emerald",
    amount: "₹28,108",
    numericAmount: 28108,
    benefits: [
      "• Śrīla Prabhupāda Lilamrita e‑book (or hard copy in Mayapur)",
      "• Four e‑books by Jayapatākā Swami (or hard copies in Mayapur)",
      "• Jewelry with Sri Sri Radha‑Madhava’s Mahā: 2 japa counter beads",
    ],
  },
  {
    name: "Opal",
    amount: "₹18,108",
    numericAmount: 18108,
    benefits: [
      "• Śrīla Prabhupāda Lilamrita e‑book (or hard copy in Mayapur)",
      "• Three e‑books by Jayapatākā Swami (or hard copies in Mayapur)",
      "• Jewelry with Sri Sri Radha‑Madhava’s Mahā: 2 japa counter beads",
    ],
  },
  {
    name: "Gold",
    amount: "₹8,108",
    numericAmount: 8108,
    benefits: [
      "• Śrīla Prabhupāda Lilamrita e‑book (or hard copy in Mayapur)",
      "• Two e‑books by Jayapatākā Swami (or hard copies in Mayapur)",
      "• Jewelry with Sri Sri Radha‑Madhava’s Mahā: 2 japa counter beads",
    ],
  },
  {
    name: "Silver",
    amount: "₹4,108",
    numericAmount: 4108,
    benefits: [
      "• Śrīla Prabhupāda Lilamrita Vol. 1 e‑book (or hard copy in Mayapur)",
      "• One e‑book by Jayapatākā Swami (or hard copy in Mayapur)",
      "• Jewelry with Sri Sri Radha‑Madhava’s Mahā: 2 japa counter beads",
    ],
  },
  {
    name: "Bronze",
    amount: "₹2,108",
    numericAmount: 2108,
    benefits: [
      "• Chant and Be Happy e‑book (or hard copy of “Messenger of the Supreme Lord” in Mayapur)",
      "• One e‑book by Jayapatākā Swami: Secrets of Service",
      "• Jewelry with Sri Sri Radha‑Madhava’s Mahā: 2 japa counter beads",
    ],
  },
];
