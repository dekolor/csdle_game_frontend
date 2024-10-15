// app/dashboard/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, logout } from "../../utils/auth";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
    }
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
