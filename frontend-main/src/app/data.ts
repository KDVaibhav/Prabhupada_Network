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
  {name: "quote", type: "string"},
  {name: "location", type: "string"},
  {name: "date", type: "date"},
]


export const BlogFields = [
  {name: "Title of the Blog", type: "string"},
  {name: "content", type: "text-editor"},
  {name: "author", type: "string"},
  {name: "date", type: "date"},
]

export const QueryFields = [
  {name: "name", type: "string"},
  {name: "email", type: "string"},
  {name: "phone", type: "string"},
  {name: "message", type: "string"},
]