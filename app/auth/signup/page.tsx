"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Chrome,
  ArrowLeft,
  MapPin,
  TreeDeciduousIcon,
  Loader2,
  Navigation,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface LocationData {
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  neighborhood?: string;
  formattedLocation?: string;
}

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Function to get user's current location
  const getCurrentLocation = async () => {
    setIsGettingLocation(true);

    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive",
      });
      setIsGettingLocation(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        }
      );

      const { latitude, longitude } = position.coords;

      // Reverse geocoding using a free API
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );

      if (response.ok) {
        const data = await response.json();
        const locationData: LocationData = {
          city: data.city,
          district: data.localityInfo?.administrative?.[2]?.name,
          state: data.principalSubdivision,
          country: data.countryName,
          neighborhood: data.locality,
          formattedLocation: `${data.locality || data.city}, ${
            data.principalSubdivision
          }, ${data.countryName}`,
        };

        setLocation(locationData);

        toast({
          title: "Location detected",
          description: locationData.formattedLocation,
        });
      } else {
        throw new Error("Failed to fetch location data");
      }
    } catch (error) {
      toast({
        title: "Could not get location",
        description:
          "Please try again or ensure location services are enabled.",
        variant: "destructive",
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Automatically attempt to get location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    if (!location?.formattedLocation) {
      toast({ title: "Location required", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Upsert user with name and location BEFORE signIn
      const response = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          location: location.formattedLocation,
        }),
      });

      console.log({ response });

      // 2. Now trigger magic link email sign-in
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to send sign-up email.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Check your email",
          description: "We sent you a sign-up link.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }
    if (!location?.formattedLocation) {
      toast({
        title: "Location required",
        description: "Please detect your location to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("google", {
        email,
        name,
        location: location.formattedLocation,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      console.log("Google signIn result:", result); // Debugging
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to sign up with Google. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Google signIn error:", error);
      toast({
        title: "Error",
        description: "Failed to sign up with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TreeDeciduousIcon className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-2xl">Join Chautari</CardTitle>
            <CardDescription>
              Create your account and connect with your neighborhood community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              <Chrome className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Your Location</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="text-xs"
                  >
                    {isGettingLocation ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Navigation className="w-3 h-3 mr-1" />
                    )}
                    {isGettingLocation ? "Getting..." : "Detect Location"}
                  </Button>
                </div>

                {location?.formattedLocation && (
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {location.formattedLocation}
                  </div>
                )}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
