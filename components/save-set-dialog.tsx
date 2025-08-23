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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Save, RefreshCw, Copy, Check } from "lucide-react"
import { SetManager } from "@/lib/set-manager"

interface SaveSetDialogProps {
  books: any[]
  filteredBooks: any[]
  onSetSaved?: (setData: any) => void
}

export function SaveSetDialog({ books, filteredBooks, onSetSaved }: SaveSetDialogProps) {
  const [open, setOpen] = useState(false)
  const [setName, setSetName] = useState("")
  const [setCode, setSetCode] = useState(SetManager.generateCode())
  const [saveOption, setSaveOption] = useState("filtered") // Added option to save filtered or all books
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [savedSet, setSavedSet] = useState<any>(null)
  const [codeCopied, setCodeCopied] = useState(false)

  const handleGenerateNewCode = () => {
    let newCode = SetManager.generateCode()
    while (SetManager.codeExists(newCode)) {
      newCode = SetManager.generateCode()
    }
    setSetCode(newCode)
  }

  const handleSaveSet = async () => {
    if (!setName.trim()) {
      setError("Please enter a set name")
      return
    }

    if (SetManager.setExists(setName.trim())) {
      setError("A set with this name already exists")
      return
    }

    if (SetManager.codeExists(setCode)) {
      setError("This code is already in use. Please generate a new one.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const booksToSave = saveOption === "filtered" ? filteredBooks : books
      const newSet = SetManager.createSet(setName.trim(), booksToSave, setCode)
      setSavedSet(newSet)
      onSetSaved?.(newSet)
    } catch (err) {
      setError("Failed to save set. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(setCode)
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea")
      textArea.value = setCode
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setSetName("")
    setSetCode(SetManager.generateCode())
    setSaveOption("filtered") // Reset to default option
    setError("")
    setSavedSet(null)
    setCodeCopied(false)
  }

  if (savedSet) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-2 border-accent hover:bg-accent/10 bg-transparent">
            <Save className="h-4 w-4 mr-2" />
            Save as Set
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-primary">Set Created Successfully!</DialogTitle>
            <DialogDescription className="text-center font-serif">
              Your book collection has been saved. Share these details to access it later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="p-4 bg-card rounded-lg border-2 border-primary/20">
                <h3 className="font-semibold text-lg">{savedSet.name}</h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-2xl font-bold text-primary">{savedSet.code}</span>
                  <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                    {codeCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{savedSet.books.length} books saved</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-2 border-accent hover:bg-accent/10 bg-transparent">
          <Save className="h-4 w-4 mr-2" />
          Save as Set
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Book Collection</DialogTitle>
          <DialogDescription className="font-serif">
            Create a named set with a unique code to access your book collection later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="set-name">Set Name</Label>
            <Input
              id="set-name"
              placeholder="My Fantasy Collection"
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Books to Save</Label>
            <RadioGroup value={saveOption} onValueChange={setSaveOption}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="filtered" id="filtered" />
                <Label htmlFor="filtered" className="font-normal">
                  Save filtered books only ({filteredBooks.length} books)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="font-normal">
                  Save all books ({books.length} books)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="set-code">Access Code</Label>
            <div className="flex gap-2">
              <Input id="set-code" value={setCode} onChange={(e) => setSetCode(e.target.value)} maxLength={4} />
              <Button variant="outline" size="sm" onClick={handleGenerateNewCode}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground font-serif">
              4-digit code to access your set. You can customize it or generate a new one.
            </p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveSet} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Set"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
