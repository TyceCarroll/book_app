interface Book {
  title: string
  author: string
  rating: string
  pages: string
  dateRead: string
  dateAdded: string
  shelves: string[]
}

export function parseCSV(csvText: string): Book[] {
  const lines = csvText.split("\n")
  const headers = lines[0].split(",").map((header) => header.replace(/"/g, "").trim())

  const books: Book[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Parse CSV line handling quoted values
    const values = parseCSVLine(line)
    if (values.length < headers.length) continue

    const book: Book = {
      title: values[headers.indexOf("Title")] || "",
      author: values[headers.indexOf("Author")] || "",
      rating: values[headers.indexOf("My Rating")] || "0",
      pages: values[headers.indexOf("Number of Pages")] || "",
      dateRead: values[headers.indexOf("Date Read")] || "",
      dateAdded: values[headers.indexOf("Date Added")] || "",
      shelves: [],
    }

    // Extract shelves from shelf columns
    for (let j = 1; j <= 15; j++) {
      const shelfIndex = headers.indexOf(`shelf ${j}`)
      if (shelfIndex !== -1 && values[shelfIndex] && values[shelfIndex].trim()) {
        book.shelves.push(values[shelfIndex].trim())
      }
    }

    // Remove duplicates from shelves
    book.shelves = [...new Set(book.shelves)]

    if (book.title) {
      books.push(book)
    }
  }

  return books
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result.map((value) => value.replace(/"/g, ""))
}
