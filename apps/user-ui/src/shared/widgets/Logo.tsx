import type React from "react"

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-2">
        <span className="text-white font-bold text-lg">S</span>
      </div>
      <span className="text-xl font-bold text-gray-900">ShopHub</span>
    </div>
  )
}

export default Logo
