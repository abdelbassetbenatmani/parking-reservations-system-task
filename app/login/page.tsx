import { LoginForm } from "@/components/login-form";
import React from "react";

const LoginFormPage = () => {
  return (
    <div className="min-h-screen w-full relative">
      {/* Radial Gradient Background from Top */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #fff 40%, #475569 100%)",
        }}
      />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 relative z-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginFormPage;
