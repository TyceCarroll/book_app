"use client" 

import type React from "react" 

import { useState, useMemo } from "react" 
import { Button } from "@/components/ui/button" 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card" 
import { Input } from "@/components/ui/input" 
import { Label } from "@/components/ui/label" 
import { Upload, FileText, ArrowLeft, Shuffle, Filter } from "lucide-react" 
import Link from "next/link" 
import { BookList } from "@/components/book-list" 
import { CategoryFilter } from "@/components/category-filter" 
import { SaveSetDialog } from "@/components/save-set-dialog" 
import { AddBookDialog } from "@/components/add-book-dialog" 
import { parseCSV } from "@/lib/csv-parser" 

interface Book { 
  title: string 
  author: string 
  rating: string 
  pages: string 
  dateRead: string 
  dateAdded: string 
  shelves: string[] 
} 

export default function UploadPage() { 
  const [books, setBooks] = useState<Book[]>([]) 
  const [isUploading, setIsUploading] = useState(false) 
  const [randomizedBooks, setRandomizedBooks] = useState<Book[]>([]) 
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]) 

  const allCategories = useMemo(() => { 
    const categories = new Set<string>() 
    books.forEach((book) => { 
      book.shelves.forEach((shelf) => { 
        if (shelf && shelf.trim()) { 
          categories.add(shelf.trim()) 
        } 
      }) 
    }) 
    return Array.from(categories).sort() 
  }, [books]) 

  const filteredBooks = useMemo(() => { 
    if (selectedCategories.length === 0) { 
      return books 
    } 
    return books.filter((book) => selectedCategories.some((category) => book.shelves.includes(category))) 
  }, [books, selectedCategories]) 

  // New logic to determine which categories to save 
  const categoriesToSave = selectedCategories.length > 0 ? selectedCategories : allCategories 

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => { 
    const file = event.target.files?.[0] 
    if (!file) return 

    setIsUploading(true) 
    try { 
      const text = await file.text() 
      const parsedBooks = parseCSV(text) 
      setBooks(parsedBooks) 
      setRandomizedBooks(parsedBooks) 
      setSelectedCategories([]) 
    } catch (error) { 
      console.error("Error parsing CSV:", error) 
    } finally { 
      setIsUploading(false) 
    } 
  } 

  const handleRandomize = () => { 
    const shuffled = [...filteredBooks].sort(() => Math.random() - 0.5) 
    setRandomizedBooks(shuffled) 
  } 

  const handleCategoryChange = (categories: string[]) => { 
    setSelectedCategories(categories) 
    const booksToShow = 
      categories.length === 0 
        ? books 
        : books.filter((book) => categories.some((category) => book.shelves.includes(category))) 
    setRandomizedBooks(booksToShow) 
  } 

  const handleAddBook = (book: Book) => { 
    const newBooks = [...books, book] 
    setBooks(newBooks) 

    // Update filtered books if no categories selected, or if book matches current filter 
    if (selectedCategories.length === 0 || selectedCategories.some((category) => book.shelves.includes(category))) { 
      setRandomizedBooks([...randomizedBooks, book]) 
    } 
  } 

  const handleDeleteBook = (index: number) => { 
    const bookToDelete = randomizedBooks[index] 
    const originalIndex = books.findIndex((b) => b.title === bookToDelete.title && b.author === bookToDelete.author) 

    if (originalIndex !== -1) { 
      const newBooks = books.filter((_, i) => i !== originalIndex) 
      setBooks(newBooks) 

      const newRandomizedBooks = randomizedBooks.filter((_, i) => i !== index) 
      setRandomizedBooks(newRandomizedBooks) 
    } 
  } 

  return ( 
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted"> 
      {/* Header */} 
      <header className="container mx-auto px-4 py-6"> 
        <div className="flex items-center gap-4"> 
          <Link href="/"> 
            <Button variant="ghost" size="sm"> 
              <ArrowLeft className="h-4 w-4 mr-2" /> 
              Back to Home 
            </Button> 
          </Link> 
          <h1 className="text-2xl font-bold text-foreground">Upload Your Library</h1> 
        </div> 
      </header> 

      <main className="container mx-auto px-4 py-8"> 
        {books.length === 0 ? ( 
          /* Upload Section */ 
          <div className="max-w-2xl mx-auto space-y-8"> 
            <Card className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors"> 
              <CardHeader className="text-center"> 
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4"> 
                  <Upload className="h-8 w-8 text-primary" /> 
                </div> 
                <CardTitle className="text-2xl">Upload Your Goodreads Export</CardTitle> 
                <CardDescription className="font-serif"> 
                  Select your CSV file exported from Goodreads to begin your magical book journey 
                </CardDescription> 
              </CardHeader> 
              <CardContent className="space-y-6"> 
                <div className="space-y-2"> 
                  <Label htmlFor="csv-file" className="text-base font-medium"> 
                    Choose CSV File 
                  </Label> 
                  <Input 
                    id="csv-file" 
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileUpload} 
                    disabled={isUploading} 
                    className="cursor-pointer" 
                  /> 
                </div> 
                {isUploading && ( 
                  <div className="text-center"> 
                    <div className="inline-flex items-center gap-2 text-primary"> 
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div> 
                      Processing your library... 
                    </div> 
                  </div> 
                )} 
              </CardContent> 
            </Card> 

            {/* Instructions */} 
            <Card> 
              <CardHeader> 
                <CardTitle className="flex items-center gap-2"> 
                  <FileText className="h-5 w-5 text-secondary" /> 
                  How to Export from Goodreads 
                </CardTitle> 
              </CardHeader> 
              <CardContent className="space-y-3 font-serif"> 
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground"> 
                  <li>Go to your Goodreads account and navigate to "My Books"</li> 
                  <li>Scroll to the bottom and click "Import and export"</li> 
                  <li>Click "Export Library" to download your CSV file</li> 
                  <li>Upload the downloaded file here to get started</li> 
                </ol> 
              </CardContent> 
            </Card> 
          </div> 
        ) : ( 
          /* Books Display Section */ 
          <div className="space-y-6"> 
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"> 
              <div> 
                <h2 className="text-3xl font-bold text-foreground">Your Magical Library</h2> 
                <p className="text-muted-foreground font-serif"> 
                  {filteredBooks.length} of {books.length} books 
                  {selectedCategories.length > 0 && " (filtered)"} 
                </p> 
              </div> 
              <div className="flex gap-2 flex-wrap"> 
                <AddBookDialog onBookAdd={handleAddBook} /> 
                <SaveSetDialog 
                  books={filteredBooks.length > 0 ? filteredBooks : books} 
                  categories={categoriesToSave} // <-- PASS THE CATEGORIES HERE
                /> 
                <Button onClick={handleRandomize} size="lg" className="bg-secondary hover:bg-secondary/90"> 
                  <Shuffle className="h-5 w-5 mr-2" /> 
                  Randomize Order 
                </Button> 
              </div> 
            </div> 

            {allCategories.length > 0 && ( 
              <Card className="border-2 border-accent/20"> 
                <CardHeader> 
                  <CardTitle className="flex items-center gap-2 text-lg"> 
                    <Filter className="h-5 w-5 text-accent" /> 
                    Filter by Categories 
                  </CardTitle> 
                  <CardDescription className="font-serif"> 
                    Select one or more categories to filter your books. Leave empty to show all books. 
                  </CardDescription> 
                </CardHeader> 
                <CardContent> 
                  <CategoryFilter 
                    categories={allCategories} 
                    selectedCategories={selectedCategories} 
                    onCategoryChange={handleCategoryChange} 
                  /> 
                </CardContent> 
              </Card> 
            )} 

            <BookList books={randomizedBooks} onBookDelete={handleDeleteBook} showDeleteButton={true} /> 
          </div> 
        )} 
      </main> 
    </div> 
  ) 
}
