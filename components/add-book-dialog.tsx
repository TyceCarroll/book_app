"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

interface AddBookDialogProps {
  onBookAdd: (book: any) => void
}

export function AddBookDialog({ onBookAdd }: AddBookDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [pages, setPages] = useState("")
  const [shelves, setShelves] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAddBook = () => {
    if (!title.trim() || !author.trim()) {
      return
    }

    setIsLoading(true)

    const newBook = {
      title: title.trim(),
      author: author.trim(),
      rating: "0", // Set default rating to 0 instead of using user input
      pages: pages || "",
      dateRead: "",
      dateAdded: new Date().toLocaleDateString(),
      shelves: shelves
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    }

    onBookAdd(newBook)

    // Reset form
    setTitle("")
    setAuthor("")
    setPages("")
    setShelves("")
    setOpen(false)
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-2 border-secondary hover:bg-secondary/10 bg-transparent">
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription className="font-serif">
            Manually add a book to your collection. Title and author are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="book-title">Title *</Label>
            <Input
              id="book-title"
              placeholder="The Name of the Wind"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="book-author">Author *</Label>
            <Input
              id="book-author"
              placeholder="Patrick Rothfuss"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="book-pages">Pages</Label>
            <Input
              id="book-pages"
              placeholder="662"
              type="number"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="book-shelves">Shelves (comma-separated)</Label>
            <Textarea
              id="book-shelves"
              placeholder="fantasy, to-read, favorites"
              value={shelves}
              onChange={(e) => setShelves(e.target.value)}
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddBook} disabled={isLoading || !title.trim() || !author.trim()}>
            {isLoading ? "Adding..." : "Add Book"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
