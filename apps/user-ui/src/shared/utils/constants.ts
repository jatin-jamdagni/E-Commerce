export const navItems:NavItemsTypes[] =[
  {
    title: "Home",
    href:"/"
  },
   {
    title: "Products",
    href:"/products"
  },
   {
    title: "Shops",
    href:"/shops"
  },
   {
    title: "Offers",
    href:"/offers"
  },
  {
    title: "Become a Seller",
    href:"/become-seller"
  },
]


import { Smartphone, Shirt, Home, Dumbbell, Sparkles, BookOpen, Gamepad2, Car, type LucideIcon } from "lucide-react"


export interface Department {
  id: string
  name: string
  href: string
  icon?: LucideIcon
}


export const departments: Department[] = [
  {
    id: "electronics",
    name: "Electronics",
    href: "/department/electronics",
    icon: Smartphone,
  },
  {
    id: "clothing",
    name: "Clothing",
    href: "/department/clothing",
    icon: Shirt,
  },
  {
    id: "home-garden",
    name: "Home & Garden",
    href: "/department/home-garden",
    icon: Home,
  },
  {
    id: "sports",
    name: "Sports",
    href: "/department/sports",
    icon: Dumbbell,
  },
  {
    id: "beauty",
    name: "Beauty",
    href: "/department/beauty",
    icon: Sparkles,
  },
  {
    id: "books",
    name: "Books",
    href: "/department/books",
    icon: BookOpen,
  },
  {
    id: "toys",
    name: "Toys",
    href: "/department/toys",
    icon: Gamepad2,
  },
  {
    id: "automotive",
    name: "Automotive",
    href: "/department/automotive",
    icon: Car,
  },
]
