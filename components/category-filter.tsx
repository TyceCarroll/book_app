"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Search } from "lucide-react"

interface CategoryFilterProps {
  categories: string[]
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
}

export function CategoryFilter({ categories, selectedCategories, onCategoryChange }: CategoryFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCategories = categories.filter((category) => category.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleCategoryToggle = (category: string) => {
    const newSelected = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]
    onCategoryChange(newSelected)
  }

  const handleClearAll = () => {
    onCategoryChange([])
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Selected Categories */}
      {selectedCategories.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Selected Categories:</h4>
            <Button variant="ghost" size="sm" onClick={handleClearAll}>
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <Badge
                key={category}
                variant="default"
                className="bg-primary hover:bg-primary/80 cursor-pointer"
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Available Categories */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">Available Categories ({filteredCategories.length}):</h4>
        <ScrollArea className="h-48 w-full border rounded-md p-2">
          <div className="flex flex-wrap gap-2">
            {filteredCategories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "secondary"}
                className={`cursor-pointer transition-colors ${
                  selectedCategories.includes(category) ? "bg-primary hover:bg-primary/80" : "hover:bg-secondary/80"
                }`}
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Stats */}
      <div className="text-sm text-muted-foreground font-serif">
        {selectedCategories.length > 0 ? (
          <p>Filtering by {selectedCategories.length} categories</p>
        ) : (
          <p>Showing all categories</p>
        )}
      </div>
    </div>
  )
}
