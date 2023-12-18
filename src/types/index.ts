export interface ProductTypes {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[] | undefined
}

export interface CartItemTypes {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
  quantity: number
}
export interface OrderTypes {
  id: number
  transectionId: number
  price: number
  thumbnail: string
  quantity?: number | 1
  total: number
}
export interface TransectionTypes {
  transectionId: string
  orderList: CartItemTypes[]
  totalTransection: number
}
