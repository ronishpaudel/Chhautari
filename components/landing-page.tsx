"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  MapPin,
  Briefcase,
  Vote,
  MessageCircle,
  Shield,
  Smartphone,
  Zap,
  TreeDeciduousIcon,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Hyperlocal Feed",
      description:
        "Stay connected with posts and updates from your specific neighborhood (tol)",
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Micro Jobs",
      description:
        "Find local gigs like plumbing, tutoring, cleaning with AI-verified work samples",
    },
    {
      icon: <Vote className="h-6 w-6" />,
      title: "Community Polls",
      description:
        "Participate in neighborhood decisions and vote on local issues",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Real-time Chat",
      description: "Connect directly with neighbors and service providers",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "AI Verification",
      description:
        "AI-powered verification of work samples for trusted service providers",
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Push Notifications",
      description:
        "Stay updated with instant notifications for jobs, polls, and messages",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          {/* Desktop Header */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  <TreeDeciduousIcon className="h-5 w-5" />
                </span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chautari
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <Button
                asChild
                variant="ghost"
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20"
              >
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-500 hover:from-blue-700 hover:via-purple-600 hover:to-indigo-600"
              >
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>

            {/* Mobile Menu Button & Theme Toggle */}
            <div className="flex items-center space-x-2 md:hidden">
              <ThemeToggle />
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-8">
                    {/* Mobile Logo */}
                    <div className="flex items-center space-x-2 mb-8">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <TreeDeciduousIcon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Chautari
                      </span>
                    </div>

                    {/* Mobile Navigation Links */}
                    <div className="flex flex-col space-y-4">
                      <Button
                        asChild
                        variant="ghost"
                        className="justify-start text-left h-12 text-base"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Link href="#features">Features</Link>
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        className="justify-start text-left h-12 text-base"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Link href="/auth/signin">Sign In</Link>
                      </Button>
                      <Button
                        asChild
                        className="justify-start text-left h-12 text-base bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-500 hover:from-blue-700 hover:via-purple-600 hover:to-indigo-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Link href="/auth/signup">Get Started</Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 text-center">
        <Badge
          variant="secondary"
          className="mb-4 dark:text-black text-white bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800"
        >
          <Zap className="w-3 h-3 mr-1" />
          AI-Powered Community Platform
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
          Your Neighborhood,
          <br />
          Connected & Thriving
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto px-4">
          Chautari brings your community together with hyperlocal feeds,
          verified micro jobs, neighborhood polls, and real-time connections.
          Build stronger bonds with your neighbors.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <Button
            asChild
            size="lg"
            className="text-base sm:text-lg px-6 sm:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 hover:from-blue-700 hover:via-purple-700 hover:to-blue-900"
          >
            <Link href="/auth/signup">Join Your Community</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="text-base sm:text-lg px-6 sm:px-8"
          >
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="container mx-auto px-4 py-12 sm:py-16 lg:py-20"
      >
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Everything Your Community Needs
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            From finding trusted local services to making community decisions
            together
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100 text-sm sm:text-base">
                Active Community Members
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">5K+</div>
              <div className="text-blue-100 text-sm sm:text-base">
                Jobs Completed
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100 text-sm sm:text-base">
                Neighborhoods Connected
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
          Ready to Connect with Your Neighbors?
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto px-4">
          Join thousands of community members who are already building stronger
          neighborhoods together.
        </p>
        <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8">
          <Link href="/auth/signup">Get Started Today</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 dark:bg-gray-900 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  <TreeDeciduousIcon className="h-5 w-5" />
                </span>
              </div>
              <span className="text-xl font-bold">Chautari</span>
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              © 2024 Chautari. Building stronger communities together.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
