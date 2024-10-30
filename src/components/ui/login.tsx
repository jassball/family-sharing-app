"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { logIn } from "../../lib/auth";
import { Routes } from "@/app/constants/routes";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize useRouter

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await logIn(email, password);
      alert("Login successful!");
      router.push(Routes.HOME); // Redirect using router instance
    } catch {
      setError("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your email and password to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <form onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Epost</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                placeholder="hei@oliver.no"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passord</Label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type="password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>

          <div className="flex justify-center flex-col">
            <p>
              Ingen bruker? Lag en{" "}
              <Link className="font-bold" href={Routes.SIGNUP}>
                HER
              </Link>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
