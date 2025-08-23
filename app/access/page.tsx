"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Key, BookOpen, Upload, Shuffle } from "lucide-react"
import Link from "next/link"
import { SetManager } from "@/lib/set-manager"
import { BookList } from "@/components/book-list"
import { AddBookDialog } from "@/components/add-book-dialog"
import { CategoryFilter } from "@/components/category-filter"
import { parseCSV } from "@/lib/csv-parser"

export default function AccessPage() {
  const [setName, setSetName] = useState("")
  const [setCode, setSetCode] = useState("")
  const [currentSet, setCurrentSet] = useState<any>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [displayBooks, setDisplayBooks] = useState<any[]>([])
  const [filteredBooks, setFilteredBooks] = useState<any[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const handleAccessSet = () => {
    if (!setName.trim() || !setCode.trim()) {
      setError("Please enter both set name and code")
      return
    }

    setIsLoading(true)
    setError("")

    const set = SetManager.getSet(setName.trim(), setCode.trim())

    if (set) {
      setCurrentSet(set)
      setDisplayBooks(set.books)
      setFilteredBooks(set.books) // Initialize filtered books
    } else {
      setError("Set not found. Please check your set name and code.")
    }

    setIsLoading(false)
  }

  const handleNewSearch = () => {
    setCurrentSet(null)
    setSetName("")
    setSetCode("")
    setError("")
    setDisplayBooks([])
    setFilteredBooks([]) // Reset filtered books
    setSelectedCategories([]) // Reset selected categories
  }

  const handleAddBook = (book: any) => {
    if (currentSet) {
      const updatedSet = SetManager.addBookToSet(currentSet.id, book)
      if (updatedSet) {
        setCurrentSet(updatedSet)
        setDisplayBooks(updatedSet.books)
        applyFilters(updatedSet.books, selectedCategories)
      }
    }
  }

  const handleDeleteBook = (index: number) => {
    if (currentSet) {
      const updatedSet = SetManager.removeBookFromSet(currentSet.id, index)
      if (updatedSet) {
        setCurrentSet(updatedSet)
        setDisplayBooks(updatedSet.books)
        applyFilters(updatedSet.books, selectedCategories)
      }
    }
  }

  const handleRandomize = () => {
    const shuffled = [...filteredBooks].sort(() => Math.random() - 0.5) // Randomize filtered books instead of display books
    setFilteredBooks(shuffled)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !currentSet) return

    try {
      const text = await file.text()
      const parsedBooks = parseCSV(text)
      const updatedSet = SetManager.replaceSetBooks(currentSet.id, parsedBooks)
      if (updatedSet) {
        setCurrentSet(updatedSet)
        setDisplayBooks(updatedSet.books)
        setSelectedCategories([])
        setFilteredBooks(updatedSet.books)
      }
    } catch (error) {
      console.error("Error parsing CSV:", error)
    }
  }

  const applyFilters = (books: any[], categories: string[]) => {
    if (categories.length === 0) {
      setFilteredBooks(books)
    } else {
      const filtered = books.filter((book) => categories.some((category) => book.shelves.includes(category)))
      setFilteredBooks(filtered)
    }
  }

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories)
    applyFilters(displayBooks, categories)
  }

  if (currentSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleNewSearch}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Access Another Set
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{currentSet.name}</h1>
              <p className="text-muted-foreground font-serif">
                Code: {currentSet.code} • {filteredBooks.length} of {currentSet.books.length} books
              </p>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Set Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">{new Date(currentSet.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Accessed</p>
                    <p className="font-medium">{new Date(currentSet.lastAccessed).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Books</p>
                    <p className="font-medium">{currentSet.books.length}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AddBookDialog onBookAdd={handleAddBook} />
                  <Button
                    onClick={handleRandomize}
                    variant="outline"
                    className="border-2 border-secondary hover:bg-secondary/10 bg-transparent"
                  >
                    <Shuffle className="h-4 w-4 mr-2" />
                    Randomize
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" className="border-2 border-accent hover:bg-accent/10 bg-transparent">
                      <Upload className="h-4 w-4 mr-2" />
                      Re-upload CSV
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <CategoryFilter
              books={displayBooks}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
            />

            <BookList books={filteredBooks} onBookDelete={handleDeleteBook} showDeleteButton={true} />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Access Your Set</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-8">
          <Card className="border-2 border-primary/30">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Key className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Enter Set Details</CardTitle>
              <CardDescription className="font-serif">
                Enter your set name and 4-digit code to access your saved book collection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="access-name">Set Name</Label>
                <Input
                  id="access-name"
                  placeholder="My Fantasy Collection"
                  value={setName}
                  onChange={(e) => setSetName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAccessSet()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="access-code">4-Digit Code</Label>
                <Input
                  id="access-code"
                  placeholder="1234"
                  value={setCode}
                  onChange={(e) => setSetCode(e.target.value)}
                  maxLength={4}
                  onKeyDown={(e) => e.key === "Enter" && handleAccessSet()}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button onClick={handleAccessSet} disabled={isLoading} className="w-full">
                {isLoading ? "Accessing..." : "Access Set"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Don't have a set yet?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground font-serif mb-4">
                Upload your Goodreads library to create and save your first book collection.
              </p>
              <Link href="/upload">
                <Button variant="outline" className="w-full bg-transparent">
                  Create New Set
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
