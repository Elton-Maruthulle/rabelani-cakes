import { Category, NavLink } from "./types";
const IMG_CAKES_13 = new URL(
  "./components/img/cakes/cakes (13).jpg",
  import.meta.url
).href;
const IMG_CAKES_4 = new URL(
  "./components/img/cakes/cakes (4).jpg",
  import.meta.url
).href;
const IMG_10012_4 = new URL(
  "./components/img/cupcakes/10012 (4).jpg",
  import.meta.url
).href;
const IMG_CAKES_14 = new URL(
  "./components/img/cakes/cakes (14).jpg",
  import.meta.url
).href;
const IMG_CAKES_39 = new URL(
  "./components/img/cakes/cakes (39).jpg",
  import.meta.url
).href;
const IMG_CAKES_42 = new URL(
  "./components/img/cakes/cakes (42).jpg",
  import.meta.url
).href;

export const NAV_LINKS: NavLink[] = [
  { label: "Cakes", href: "#" },
  { label: "Cup Cakes", href: "#" },
  { label: "Catering", href: "#" },
  { label: "Daily Specials", href: "#" },
];

export const CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Cakes",
    image: IMG_CAKES_39,
    bgColor: "bg-amber-100",
    hasNotification: true,
  },
  {
    id: 2,
    name: "Cup Cakes",
    image:
      "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&q=80&w=300&h=300",
    bgColor: "bg-orange-100",
    hasNotification: false,
  },
  {
    id: 5,
    name: "Custom Cake",
    image: IMG_CAKES_13,
    bgColor: "bg-pink-100",
    hasNotification: false,
  },
  {
    id: 3,
    name: "Wedding Cakes",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f418eec0d6?auto=format&fit=crop&q=80&w=300&h=300",
    bgColor: "bg-pink-100",
    hasNotification: false,
  },
  {
    id: 4,
    name: "Design Cakes",
    image: IMG_CAKES_42,
    bgColor: "bg-indigo-100",
    hasNotification: false,
  },
  {
    id: 6,
    name: "Celebration Cakes",
    image: IMG_CAKES_14,
    bgColor: "bg-purple-100",
    hasNotification: false,
  },
  {
    id: 7,
    name: "Cookies",
    image:
      "https://images.unsplash.com/photo-1499636138143-bd630f5cf38a?auto=format&fit=crop&q=80&w=300&h=300",
    bgColor: "bg-stone-100",
    hasNotification: true,
  },
  {
    id: 8,
    name: "Custom Cupcake",
    image: IMG_10012_4,
    bgColor: "bg-red-50",
    hasNotification: false,
  },
  {
    id: 9,
    name: "Custom Order",
    image: IMG_CAKES_4,
    bgColor: "bg-emerald-100",
    hasNotification: true,
  },
];

export const CAKES = [
  {
    id: 101,
    name: "Signature Truffle",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800&h=800",
    price: 38.5,
    description:
      "Dark Belgian chocolate sponge layered with ganache and truffles.",
  },
  {
    id: 102,
    name: "Berry Velvet",
    image:
      "https://images.unsplash.com/photo-1541781288491-faff0da2b01c?auto=format&fit=crop&q=80&w=800&h=800",
    price: 32.0,
    description: "Red velvet base topped with fresh berry compote.",
  },
  {
    id: 103,
    name: "Caramel Drip Cake",
    image:
      "https://images.unsplash.com/photo-1559622214-8c6c1a7b1e84?auto=format&fit=crop&q=80&w=800&h=800",
    price: 35.0,
    description: "Vanilla sponge with salted caramel drip and buttercream.",
  },
  {
    id: 104,
    name: "Lemon Elderflower",
    image:
      "https://images.unsplash.com/photo-1514516884752-b0f6c12c6075?auto=format&fit=crop&q=80&w=800&h=800",
    price: 30.0,
    description: "Zesty lemon layers infused with elderflower syrup.",
  },
];
