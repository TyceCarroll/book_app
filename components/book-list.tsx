"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { BookOpen, Calendar, Star, Trash2 } from "lucide-react"

interface Book {
  title: string
  author: string
  rating: string
  pages: string
  dateRead: string
  dateAdded: string
  shelves: string[]
}

interface BookListProps {
  books: Book[]
  onBookDelete?: (index: number) => void
  showDeleteButton?: boolean
}

export function BookList({ books, onBookDelete, showDeleteButton = false }: BookListProps) {
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null)

  const handleDeleteBook = (index: number) => {
    if (onBookDelete) {
      onBookDelete(index)
    }
    setDeletingIndex(null)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {books.map((book, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200 border-2 hover:border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg leading-tight line-clamp-2">{book.title}</CardTitle>
                <CardDescription className="font-serif mt-1">by {book.author}</CardDescription>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <BookOpen className="h-5 w-5 text-primary" />
                {showDeleteButton && onBookDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Book</AlertDialogTitle>
                        <AlertDialogDescription className="font-serif">
                          Are you sure you want to remove "{book.title}" from your collection? This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteBook(index)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Rating and Pages */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {book.rating && book.rating !== "0" && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{book.rating}</span>
                </div>
              )}
              {book.pages && (
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{book.pages} pages</span>
                </div>
              )}
            </div>

            {/* Date Information */}
            {(book.dateRead || book.dateAdded) && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{book.dateRead ? `Read: ${book.dateRead}` : `Added: ${book.dateAdded}`}</span>
              </div>
            )}

            {/* Shelves */}
            {book.shelves.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {book.shelves.slice(0, 3).map((shelf, shelfIndex) => (
                  <Badge key={shelfIndex} variant="secondary" className="text-xs">
                    {shelf}
                  </Badge>
                ))}
                {book.shelves.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{book.shelves.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
