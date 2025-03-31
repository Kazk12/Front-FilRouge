"use client";

import RegisterForm from "@/components/features/auth/RegisterForm";
import PublicRoute from "@/components/routing/PublicRoute";

export default function InscriptionPage() {
  return (
    <PublicRoute>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <RegisterForm />
        </div>
      </div>
    </PublicRoute>
  );
}