interface BookSet {
  id: string
  name: string
  code: string
  books: Array<{
    title: string
    author: string
    rating: string
    pages: string
    dateRead: string
    dateAdded: string
    shelves: string[]
  }>
  createdAt: string
  lastAccessed: string
}

export class SetManager {
  private static STORAGE_KEY = "book-randomizer-sets"

  static generateCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  static createSet(name: string, books: any[], customCode?: string): BookSet {
    const code = customCode || this.generateCode()
    const id = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`

    const bookSet: BookSet = {
      id,
      name: name.trim(),
      code,
      books,
      createdAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
    }

    this.saveSet(bookSet)
    return bookSet
  }

  static saveSet(bookSet: BookSet): void {
    const sets = this.getAllSets()
    const existingIndex = sets.findIndex((s) => s.id === bookSet.id)

    if (existingIndex >= 0) {
      sets[existingIndex] = bookSet
    } else {
      sets.push(bookSet)
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sets))
  }

  static getAllSets(): BookSet[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  static getSet(name: string, code: string): BookSet | null {
    const sets = this.getAllSets()
    const set = sets.find((s) => s.name.toLowerCase() === name.toLowerCase() && s.code === code)

    if (set) {
      set.lastAccessed = new Date().toISOString()
      this.saveSet(set)
    }

    return set || null
  }

  static updateSet(setId: string, updates: Partial<BookSet>): BookSet | null {
    const sets = this.getAllSets()
    const setIndex = sets.findIndex((s) => s.id === setId)

    if (setIndex === -1) return null

    const updatedSet = { ...sets[setIndex], ...updates, lastAccessed: new Date().toISOString() }
    sets[setIndex] = updatedSet
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sets))

    return updatedSet
  }

  static addBookToSet(setId: string, book: any): BookSet | null {
    const sets = this.getAllSets()
    const setIndex = sets.findIndex((s) => s.id === setId)

    if (setIndex === -1) return null

    sets[setIndex].books.push(book)
    sets[setIndex].lastAccessed = new Date().toISOString()
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sets))

    return sets[setIndex]
  }

  static removeBookFromSet(setId: string, bookIndex: number): BookSet | null {
    const sets = this.getAllSets()
    const setIndex = sets.findIndex((s) => s.id === setId)

    if (setIndex === -1 || bookIndex < 0 || bookIndex >= sets[setIndex].books.length) return null

    sets[setIndex].books.splice(bookIndex, 1)
    sets[setIndex].lastAccessed = new Date().toISOString()
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sets))

    return sets[setIndex]
  }

  static replaceSetBooks(setId: string, newBooks: any[]): BookSet | null {
    const sets = this.getAllSets()
    const setIndex = sets.findIndex((s) => s.id === setId)

    if (setIndex === -1) return null

    sets[setIndex].books = newBooks
    sets[setIndex].lastAccessed = new Date().toISOString()
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sets))

    return sets[setIndex]
  }

  static deleteSet(id: string): void {
    const sets = this.getAllSets().filter((s) => s.id !== id)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sets))
  }

  static setExists(name: string): boolean {
    const sets = this.getAllSets()
    return sets.some((s) => s.name.toLowerCase() === name.toLowerCase())
  }

  static codeExists(code: string): boolean {
    const sets = this.getAllSets()
    return sets.some((s) => s.code === code)
  }
}
