import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Sparkles, Upload, Users, Key, Wand2, Crown, Castle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted relative overflow-hidden">
      {/* Floating Fantasy Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating books */}
        <div className="absolute top-20 left-10 float">
          <div className="w-8 h-10 bg-primary/20 rounded-sm transform rotate-12 shadow-lg"></div>
        </div>
        <div className="absolute top-40 right-20 float" style={{ animationDelay: "1s" }}>
          <div className="w-6 h-8 bg-secondary/20 rounded-sm transform -rotate-6 shadow-lg"></div>
        </div>
        <div className="absolute bottom-40 left-20 float" style={{ animationDelay: "2s" }}>
          <div className="w-7 h-9 bg-accent/20 rounded-sm transform rotate-45 shadow-lg"></div>
        </div>

        {/* Sparkles */}
        <Sparkles className="absolute top-32 right-32 h-6 w-6 text-primary/40 sparkle" />
        <Sparkles
          className="absolute top-60 left-32 h-4 w-4 text-secondary/40 sparkle"
          style={{ animationDelay: "0.5s" }}
        />
        <Sparkles
          className="absolute bottom-60 right-40 h-5 w-5 text-accent/40 sparkle"
          style={{ animationDelay: "1.5s" }}
        />

        {/* Magic wands */}
        <Wand2 className="absolute top-80 left-40 h-8 w-8 text-primary/30 wiggle" />
        <Crown className="absolute bottom-80 right-60 h-6 w-6 text-secondary/30 bounce-gentle" />
        <Castle className="absolute top-96 right-80 h-10 w-10 text-accent/20 float" style={{ animationDelay: "1s" }} />
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-center gap-3">
          <div className="relative">
            <BookOpen className="h-8 w-8 text-primary bounce-gentle" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-secondary sparkle" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center space-y-8">
          {/* Hero Content */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight font-serif">
              Discover Your Next
              <span className="text-primary block wiggle inline-block">Magical Adventure</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-serif">
              Upload your Goodreads library and let our enchanted randomizer guide you to your next captivating fantasy
              read! ✨📚
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/upload">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 transform hover:scale-105 transition-all duration-200 rounded-2xl shadow-lg font-serif"
              >
                <Upload className="mr-2 h-5 w-5 bounce-gentle" />
                Start Your Journey
              </Button>
            </Link>
            <Link href="/access">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 border-2 border-secondary hover:bg-secondary/10 bg-transparent rounded-2xl shadow-lg font-serif"
              >
                <Key className="mr-2 h-5 w-5 wiggle" />
                Access Existing Set
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="border-2 border-border hover:border-primary/50 transition-colors duration-200 hover:shadow-lg rounded-2xl transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 bounce-gentle">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <Sparkles className="absolute h-4 w-4 text-secondary sparkle" />
                </div>
                <CardTitle className="text-xl font-serif">Randomization</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center font-serif">
                  Our magical algorithm shuffles your books to suggest the perfect next read from your collection! 🎲✨
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-border hover:border-secondary/50 transition-colors duration-200 hover:shadow-lg rounded-2xl transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4 sparkle">
                  <Sparkles className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl font-serif">Category Magic</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center font-serif">
                  Filter by your favorite genres and shelves to find exactly the type of adventure you're craving! 🏰📖
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-border hover:border-accent/50 transition-colors duration-200 hover:shadow-lg rounded-2xl transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 wiggle">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl font-serif">Personal Library</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center font-serif">
                  Create custom sets with unique codes to share your curated book collections with friends and family!
                  👥💫
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* How it Works */}
          <div className="mt-20 space-y-8">
            <h3 className="text-3xl font-bold text-foreground font-serif">How the Magic Works ✨</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto shadow-lg bounce-gentle">
                  <span className="text-2xl font-bold text-white font-serif">1</span>
                </div>
                <h4 className="font-semibold text-foreground font-serif">Upload CSV 📤</h4>
                <p className="text-sm text-muted-foreground font-serif">
                  Export your Goodreads library and upload it here - it's like magic! ✨
                </p>
              </div>
              <div className="text-center space-y-3">
                <div
                  className="w-20 h-20 bg-gradient-to-br from-secondary to-secondary/60 rounded-full flex items-center justify-center mx-auto shadow-lg bounce-gentle"
                  style={{ animationDelay: "0.2s" }}
                >
                  <span className="text-2xl font-bold text-white font-serif">2</span>
                </div>
                <h4 className="font-semibold text-foreground font-serif">Create Set 🎯</h4>
                <p className="text-sm text-muted-foreground font-serif">
                  Name your collection and get a unique access code to share! 🔑
                </p>
              </div>
              <div className="text-center space-y-3">
                <div
                  className="w-20 h-20 bg-gradient-to-br from-accent to-accent/60 rounded-full flex items-center justify-center mx-auto shadow-lg bounce-gentle"
                  style={{ animationDelay: "0.4s" }}
                >
                  <span className="text-2xl font-bold text-white font-serif">3</span>
                </div>
                <h4 className="font-semibold text-foreground font-serif">Filter & Randomize 🎲</h4>
                <p className="text-sm text-muted-foreground font-serif">
                  Choose categories and let the magic decide your next read! ✨
                </p>
              </div>
              <div className="text-center space-y-3">
                <div
                  className="w-20 h-20 bg-gradient-to-br from-chart-1 to-chart-1/60 rounded-full flex items-center justify-center mx-auto shadow-lg bounce-gentle"
                  style={{ animationDelay: "0.6s" }}
                >
                  <span className="text-2xl font-bold text-white font-serif">4</span>
                </div>
                <h4 className="font-semibold text-foreground font-serif">Enjoy Reading 📚</h4>
                <p className="text-sm text-muted-foreground font-serif">
                  Dive into your perfectly chosen fantasy adventure! 🏰
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 relative z-10">
        <div className="text-center text-muted-foreground font-serif">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary sparkle" />
            </div>
            <p>Made for book lovers everywhere</p>
            <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-secondary wiggle" />
            </div>
          </div>
          <p className="text-xs">May your next adventure be legendary! 🐉📖✨</p>
        </div>
      </footer>
    </div>
  )
}
