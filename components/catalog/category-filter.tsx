"use client"

import React from "react"

import { 
  Sparkles, Calendar, Home, Wrench, Shirt, Wind, 
  Gamepad2, PenTool, Gift, Smartphone, Package, LayoutGrid, Backpack 
} from "lucide-react"
import { Button } from "@/components/ui/button"

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Calendar,
  Home,
  Wrench,
  Shirt,
  Wind,
  Gamepad2,
  PenTool,
  Backpack,
  Gift,
  Smartphone,
  Package,
}

interface Category {
  id: string
  name: string
  icon: string
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* All categories button */}
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onSelectCategory(null)}
        className={selectedCategory === null ? "bg-[#1EA7E1] hover:bg-[#1794c7]" : ""}
      >
        <LayoutGrid className="mr-2 h-4 w-4" />
        Todos
      </Button>

      {/* Category buttons */}
      {categories.map((category) => {
        const Icon = iconMap[category.icon] || Package
        const isSelected = selectedCategory === category.id

        return (
          <Button
            key={category.id}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectCategory(category.id)}
            className={isSelected ? "bg-[#1EA7E1] hover:bg-[#1794c7]" : ""}
          >
            <Icon className="mr-2 h-4 w-4" />
            {category.name}
          </Button>
        )
      })}
    </div>
  )
}
