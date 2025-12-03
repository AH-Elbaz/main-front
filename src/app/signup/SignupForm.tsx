"use client";
import { useState } from "react";
import { useAuth } from "@/app/features/auth/hooks/useAuth";
import Link from "next/link";
import NavBar from "@/components/navbar";
import { Listbox } from "@headlessui/react";
import type { User } from "@/app/models";
import Footer from "@/components/ui/footer";



export default function SignupForm() {
  const { signup, loading, error } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    bloodType: "",
    targetSport: "",
    weight: "",
    fatPercentage: "",
  });

  const [formError, setFormError] = useState("");

  const validBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const sports = ["Running", "Football"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleListboxChange = (name: "bloodType" | "targetSport", value: string) => {
    setForm({ ...form, [name]: value });
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!form.firstName.trim() || !form.lastName.trim()) return "Please enter your full name";
        if (form.password !== form.confirmPassword) return "Passwords do not match";
        if (form.password.length < 6) return "Password must be at least 6 characters long";
        break;
      case 2:
        if (!form.birthDate) return "Please select your birth date";
        if (!validBloodTypes.includes(form.bloodType)) return "Please select a valid blood type";
        if (!form.targetSport) return "Please select your target sport";
        break;
      case 3:
        if (!form.weight.trim() || isNaN(parseFloat(form.weight)) || parseFloat(form.weight) <= 0) return "Please enter a valid weight";
        if (!form.fatPercentage.trim() || isNaN(parseFloat(form.fatPercentage)) || parseFloat(form.fatPercentage) < 0) return "Please enter a valid body fat percentage";
        break;
    }
    return "";
  };

  const nextStep = () => {
    const err = validateStep();
    if (err) {
      setFormError(err);
      return;
    }
    setFormError("");
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setFormError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const err = validateStep();
    if (err) {
      setFormError(err);
      return;
    }

    setFormError("");

    const formattedData: User = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      password: form.password,
      birthDate: new Date(form.birthDate).toISOString(),
      weight: parseFloat(form.weight),
      bodyFatPercentage: parseFloat(form.fatPercentage),
  bloodType: form.bloodType as User['bloodType'],
      targetSport: form.targetSport,
    };

    signup(formattedData);
  };

  return (
    <div className="  min-h-screen w-full flex flex-col">
      {/* NavBar */}
      <div className="hidden lg:block">
        <NavBar />
      </div>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden pt-3 pb-2" style={{ backgroundColor: 'var(--color-dark-bg)' }}>
        {/* Animated Background with Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated Gradient Orbs */}
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30"
            style={{
              background: `radial-gradient(circle, var(--color-lime)30, transparent 70%)`,
              filter: 'blur(100px)',
              animation: 'float 8s ease-in-out infinite',
            }}
          ></div>

          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, var(--color-lime)20, transparent 70%)`,
              filter: 'blur(100px)',
              animation: 'float 10s ease-in-out infinite reverse',
            }}
          ></div>

          <div
            className="absolute top-1/2 right-1/3 w-72 h-72 rounded-full opacity-15"
            style={{
              background: `radial-gradient(circle, var(--color-lime)15, transparent 70%)`,
              filter: 'blur(80px)',
              animation: 'float 12s ease-in-out infinite',
            }}
          ></div>

          {/* Animated Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `
                linear-gradient(0deg, transparent 24%, var(--color-lime) 25%, var(--color-lime) 26%, transparent 27%, transparent 74%, var(--color-lime) 75%, var(--color-lime) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, var(--color-lime) 25%, var(--color-lime) 26%, transparent 27%, transparent 74%, var(--color-lime) 75%, var(--color-lime) 76%, transparent 77%, transparent)
              `,
              backgroundSize: '80px 80px',
              animation: 'drift 20s linear infinite',
            }}
          ></div>

          {/* Animated Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10" style={{ pointerEvents: 'none' }}>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-lime)" stopOpacity="0" />
                <stop offset="50%" stopColor="var(--color-lime)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--color-lime)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="url(#lineGradient)" strokeWidth="2" />
            <line x1="100%" y1="0" x2="0" y2="100%" stroke="url(#lineGradient)" strokeWidth="2" />
            <circle cx="50%" cy="50%" r="30%" fill="none" stroke="url(#lineGradient)" strokeWidth="1" />
          </svg>
        </div>

        {/* Content Container */}
        <div className="flex w-full min-h-full relative z-10 items-center justify-center   md:pt-20">
          {/* Left Side - Animated Content */}
          <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 ">
            {/* Main Content */}
            <div className="space-y-8">
              <div>
                <h1
                  className="text-5xl font-light leading-tight mb-6"
                  style={{
                    color: 'var(--color-text-primary)',
                    letterSpacing: '-1px',
                    fontWeight: 300
                  }}
                >
                  Join the Athletic Revolution
                </h1>

                <p
                  className="text-lg font-light max-w-lg"
                  style={{
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.8',
                    letterSpacing: '0.3px'
                  }}
                >
                  Create your VitaLink account and unlock the power of real-time biometric insights tailored to your unique performance profile.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="space-y-4 pt-4">
                {[
                  { icon: "🎯", title: "Personalized Insights", desc: "AI-powered recommendations based on your metrics" },
                  { icon: "📊", title: "Complete Profile", desc: "Build your comprehensive health and performance baseline" },
                  { icon: "🚀", title: "Instant Access", desc: "Start optimizing your performance immediately" }
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-4 p-4 rounded-lg backdrop-blur-sm transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--color-accent-glow)',
                      borderColor: 'var(--color-border-light)',
                      border: `1px solid var(--color-border-light)`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-accent-glow)';
                      e.currentTarget.style.borderColor = 'var(--color-border-medium)';
                      e.currentTarget.style.boxShadow = `0 0 20px var(--color-lime)15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-accent-glow)';
                      e.currentTarget.style.borderColor = 'var(--color-border-light)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h3
                        className="font-semibold text-sm mb-1"
                        style={{ color: 'var(--color-text-primary)', letterSpacing: '0.5px' }}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className="text-sm font-light"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t" style={{ borderColor: 'var(--color-border-light)' }}>
              {[
                { number: "50K+", label: "Members" },
                { number: "100M+", label: "Data Points" },
                { number: "24/7", label: "Support" }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div
                    className="text-2xl font-light mb-2"
                    style={{ color: 'var(--color-lime)', letterSpacing: '-0.5px' }}
                  >
                    {stat.number}
                  </div>
                  <p
                    className="text-xs font-light"
                    style={{ color: 'var(--color-text-tertiary)', letterSpacing: '0.3px' }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
            <div className="w-full max-w-md">
          {/* Form Container with Glassmorphism */}
          <div
            className="rounded-3xl border backdrop-blur-2xl p-8 relative overflow-hidden group"
            style={{
              backgroundColor: 'var(--color-dark-card)',
              borderColor: 'var(--color-border-medium)',
              boxShadow: `
                0 25px 50px rgba(0, 0, 0, 0.6),
                0 0 1px var(--color-border-strong),
                inset 0 1px 0 var(--color-border-light)
              `,
              transition: 'all 0.3s ease'
            }}
          >
       

            {/* Form Header */}
            <div className="text-center mb-10 relative z-10">        
              <h1
                className="text-3xl font-light mb-3"
                style={{
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.8px',
                  fontWeight: 300
                }}
              >
                Create Account
              </h1>
              <p
                className="text-sm font-light mb-6"
                style={{
                  color: 'var(--color-text-tertiary)',
                  letterSpacing: '0.4px'
                }}
              >
                Step {currentStep} of 3 — Complete your profile
              </p>

              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className="transition-all duration-300"
                      style={{
                        width: currentStep === step ? '40px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        backgroundColor: currentStep >= step ? 'var(--color-lime)' : 'var(--color-border-medium)',
                        boxShadow: currentStep === step ? `0 0 12px var(--color-lime)50` : 'none'
                      }}
                    ></div>
                  ))}
                </div>
                <div
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--color-border-light)',
                    width: `${(currentStep / 3) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">

              {/* Step 1 - Personal Information */}
              {currentStep === 1 && (
                <>
                  {/* First Name */}
                  <div className="space-y-2.5">
                    <label
                      htmlFor="firstName"
                      className="block text-xs font-semibold uppercase tracking-wider"
                      style={{
                        color: focusedField === 'firstName' ? 'var(--color-lime)' : 'var(--color-text-secondary)',
                        letterSpacing: '0.8px',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={form.firstName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your first name"
                      className="w-full px-5 py-4 rounded-xl font-light text-sm transition-all duration-300 outline-none"
                      style={{
                        backgroundColor: 'var(--color-dark-input)',
                        borderColor: focusedField === 'firstName' ? 'var(--color-lime)' : 'var(--color-border-light)',
                        border: `1px solid ${focusedField === 'firstName' ? 'var(--color-lime)' : 'var(--color-border-light)'}`,
                        color: 'var(--color-text-primary)',
                        boxShadow: focusedField === 'firstName' ? `0 0 0 4px var(--color-accent-glow), inset 0 1px 2px rgba(0,0,0,0.3)` : 'inset 0 1px 2px rgba(0,0,0,0.3)',
                      }}
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2.5">
                    <label
                      htmlFor="lastName"
                      className="block text-xs font-semibold uppercase tracking-wider"
                      style={{
                        color: focusedField === 'lastName' ? 'var(--color-lime)' : 'var(--color-text-secondary)',
                        letterSpacing: '0.8px',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={form.lastName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your last name"
                      className="w-full px-5 py-4 rounded-xl font-light text-sm transition-all duration-300 outline-none"
                      style={{
                        backgroundColor: 'var(--color-dark-input)',
                        borderColor: focusedField === 'lastName' ? 'var(--color-lime)' : 'var(--color-border-light)',
                        border: `1px solid ${focusedField === 'lastName' ? 'var(--color-lime)' : 'var(--color-border-light)'}`,
                        color: 'var(--color-text-primary)',
                        boxShadow: focusedField === 'lastName' ? `0 0 0 4px var(--color-accent-glow), inset 0 1px 2px rgba(0,0,0,0.3)` : 'inset 0 1px 2px rgba(0,0,0,0.3)',
                      }}
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2.5">
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold uppercase tracking-wider"
                      style={{
                        color: focusedField === 'password' ? 'var(--color-lime)' : 'var(--color-text-secondary)',
                        letterSpacing: '0.8px',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Create a strong password"
                        className="w-full px-5 py-4 rounded-xl font-light text-sm transition-all duration-300 outline-none pr-12"
                        style={{
                          backgroundColor: 'var(--color-dark-input)',
                          borderColor: focusedField === 'password' ? 'var(--color-lime)' : 'var(--color-border-light)',
                          border: `1px solid ${focusedField === 'password' ? 'var(--color-lime)' : 'var(--color-border-light)'}`,
                          color: 'var(--color-text-primary)',
                          boxShadow: focusedField === 'password' ? `0 0 0 4px var(--color-accent-glow), inset 0 1px 2px rgba(0,0,0,0.3)` : 'inset 0 1px 2px rgba(0,0,0,0.3)',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase transition-colors duration-200"
                        style={{
                          color: 'var(--color-text-tertiary)',
                          letterSpacing: '0.5px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-lime)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-tertiary)'}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2.5">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-xs font-semibold uppercase tracking-wider"
                      style={{
                        color: focusedField === 'confirmPassword' ? 'var(--color-lime)' : 'var(--color-text-secondary)',
                        letterSpacing: '0.8px',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Confirm your password"
                        className="w-full px-5 py-4 rounded-xl font-light text-sm transition-all duration-300 outline-none pr-12"
                        style={{
                          backgroundColor: 'var(--color-dark-input)',
                          borderColor: focusedField === 'confirmPassword' ? 'var(--color-lime)' : 'var(--color-border-light)',
                          border: `1px solid ${focusedField === 'confirmPassword' ? 'var(--color-lime)' : 'var(--color-border-light)'}`,
                          color: 'var(--color-text-primary)',
                          boxShadow: focusedField === 'confirmPassword' ? `0 0 0 4px var(--color-accent-glow), inset 0 1px 2px rgba(0,0,0,0.3)` : 'inset 0 1px 2px rgba(0,0,0,0.3)',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase transition-colors duration-200"
                        style={{
                          color: 'var(--color-text-tertiary)',
                          letterSpacing: '0.5px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-lime)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-tertiary)'}
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2 - Health Profile */}
              {currentStep === 2 && (
                <>
                  {/* Birth Date */}
                  <div className="space-y-2.5">
                    <label
                      htmlFor="birthDate"
                      className="block text-xs font-semibold uppercase tracking-wider"
                      style={{
                        color: focusedField === 'birthDate' ? 'var(--color-lime)' : 'var(--color-text-secondary)',
                        letterSpacing: '0.8px',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      Birth Date
                    </label>
                    <input
                      id="birthDate"
                      type="date"
                      name="birthDate"
                      value={form.birthDate}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('birthDate')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-5 py-4 rounded-xl font-light text-sm transition-all duration-300 outline-none"
                      style={{
                        backgroundColor: 'var(--color-dark-input)',
                        borderColor: focusedField === 'birthDate' ? 'var(--color-lime)' : 'var(--color-border-light)',
                        border: `1px solid ${focusedField === 'birthDate' ? 'var(--color-lime)' : 'var(--color-border-light)'}`,
                        color: 'var(--color-text-primary)',
                        boxShadow: focusedField === 'birthDate' ? `0 0 0 4px var(--color-accent-glow), inset 0 1px 2px rgba(0,0,0,0.3)` : 'inset 0 1px 2px rgba(0,0,0,0.3)',
                      }}
                    />
                  </div>

                  {/* Blood Type */}
                  <div className="space-y-2.5">
                    <label
                      className="block text-xs font-semibold uppercase tracking-wider"
                      style={{
                        color: form.bloodType ? 'var(--color-lime)' : 'var(--color-text-secondary)',
                        letterSpacing: '0.8px',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      Blood Type
                    </label>
                    <Listbox value={form.bloodType} onChange={(value) => handleListboxChange("bloodType", value)}>
                      <div className="relative">
                        <Listbox.Button
                          className="w-full px-5 py-4 rounded-xl font-light text-sm transition-all duration-300 outline-none text-left"
                          style={{
                            backgroundColor: 'var(--color-dark-input)',
                            borderColor: form.bloodType ? 'var(--color-lime)' : 'var(--color-border-light)',
                            border: `1px solid ${form.bloodType ? 'var(--color-lime)' : 'var(--color-border-light)'}`,
                            color: form.bloodType ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                            boxShadow: form.bloodType ? `0 0 0 4px var(--color-accent-glow), inset 0 1px 2px rgba(0,0,0,0.3)` : 'inset 0 1px 2px rgba(0,0,0,0.3)',
                          }}
                        >
                          {form.bloodType || "Select your blood type"}
                        </Listbox.Button>
                        <Listbox.Options
                          className="absolute mt-2 w-full rounded-xl shadow-lg z-10 max-h-60 overflow-auto"
                          style={{
                            backgroundColor: 'var(--color-dark-card)',
                            borderColor: 'var(--color-border-medium)',
                            border: `1px solid var(--color-border-medium)`,
                          }}
                        >
                          {validBloodTypes.map((type) => (
                            <Listbox.Option
                              key={type}
                              value={type}
                              className="cursor-pointer select-none p-3 transition-colors duration-200"
                              style={{
                                backgroundColor: form.bloodType === type ? 'var(--color-lime)' : 'transparent',
                                color: form.bloodType === type ? '#000' : 'var(--color-text-primary)',
                              }}
                            >
                              {type}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>

                  {/* Target Sport */}
                  <div className="space-y-2.5">
                    <label
                      className="block text-xs font-semibold uppercase tracking-wider"
                      style={{
                        color: form.targetSport ? 'var(--color-lime)' : 'var(--color-text-secondary)',
                        letterSpacing: '0.8px',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      Target Sport
                    </label>
                    <Listbox value={form.targetSport} onChange={(value) => handleListboxChange("targetSport", value)}>
                      <div className="relative">
                        <Listbox.Button
                          className="w-full px-5 py-4 rounded-xl font-light text-sm transition-all duration-300 outline-none text-left"
                          style={{
                            backgroundColor: 'var(--color-dark-input)',
                            borderColor: form.targetSport ? 'var(--color-lime)' : 'var(--color-border-light)',
                            border: `1px solid ${form.targetSport ? 'var(--color-lime)' : 'var(--color-border-light)'}`,
                            color: form.targetSport ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                            boxShadow: form.targetSport ? `0 0 0 4px var(--color-accent-glow), inset 0 1px 2px rgba(0,0,0,0.3)` : 'inset 0 1px 2px rgba(0,0,0,0.3)',
                          }}
                        >
                          {form.targetSport || "Select your sport"}
                        </Listbox.Button>
                        <Listbox.Options
                          className="absolute mt-2 w-full rounded-xl shadow-lg z-10 max-h-60 overflow-auto"
                          style={{
                            backgroundColor: 'var(--color-dark-card)',
                            borderColor: 'var(--color-border-medium)',
                            border: `1px solid var(--color-border-medium)`,
                          }}
                        >
                          {sports.map((sport) => (
                            <Listbox.Option
                              key={sport}
                              value={sport}
                              className="cursor-pointer select-none p-3 transition-colors duration-200"
                              style={{
                                backgroundColor: form.targetSport === sport ? 'var(--color-lime)' : 'transparent',
                                color: form.targetSport === sport ? '#000' : 'var(--color-text-primary)',
                              }}
                            >
                              {sport}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>
                </>
              )}

              {/* Step 3 - Physical Metrics */}
              {currentStep === 3 && (
                <>
                  {/* Weight */}
                  <div className="space-y-2.5">
                    <label
                      htmlFor="weight"
                      className="block text-xs font-semibold uppercase tracking-wider"
                      style={{
                        color: focusedField === 'weight' ? 'var(--color-lime)' : 'var(--color-text-secondary)',
                        letterSpacing: '0.8px',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      Weight (kg)
                    </label>
                    <input
                      id="weight"
                      name="weight"
                      type="number"
                      value={form.weight}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('weight')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your weight"
                      className="w-full px-5 py-4 rounded-xl font-light text-sm transition-all duration-300 outline-none"
                      style={{
                        backgroundColor: 'var(--color-dark-input)',
                        borderColor: focusedField === 'weight' ? 'var(--color-lime)' : 'var(--color-border-light)',
                        border: `1px solid ${focusedField === 'weight' ? 'var(--color-lime)' : 'var(--color-border-light)'}`,
                        color: 'var(--color-text-primary)',
                        boxShadow: focusedField === 'weight' ? `0 0 0 4px var(--color-accent-glow), inset 0 1px 2px rgba(0,0,0,0.3)` : 'inset 0 1px 2px rgba(0,0,0,0.3)',
                      }}
                    />
                  </div>

                  {/* Body Fat Percentage */}
                  <div className="space-y-2.5">
                    <label
                      htmlFor="fatPercentage"
                      className="block text-xs font-semibold uppercase tracking-wider"
                      style={{
                        color: focusedField === 'fatPercentage' ? 'var(--color-lime)' : 'var(--color-text-secondary)',
                        letterSpacing: '0.8px',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      Body Fat (%)
                    </label>
                    <input
                      id="fatPercentage"
                      name="fatPercentage"
                      type="number"
                      value={form.fatPercentage}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('fatPercentage')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your body fat %"
                      className="w-full px-5 py-4 rounded-xl font-light text-sm transition-all duration-300 outline-none"
                      style={{
                        backgroundColor: 'var(--color-dark-input)',
                        borderColor: focusedField === 'fatPercentage' ? 'var(--color-lime)' : 'var(--color-border-light)',
                        border: `1px solid ${focusedField === 'fatPercentage' ? 'var(--color-lime)' : 'var(--color-border-light)'}`,
                        color: 'var(--color-text-primary)',
                        boxShadow: focusedField === 'fatPercentage' ? `0 0 0 4px var(--color-accent-glow), inset 0 1px 2px rgba(0,0,0,0.3)` : 'inset 0 1px 2px rgba(0,0,0,0.3)',
                      }}
                    />
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-8 pt-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-4 rounded-xl font-semibold uppercase tracking-wider transition-all duration-300 border text-sm"
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: 'var(--color-border-medium)',
                      color: 'var(--color-lime)',
                      letterSpacing: '0.8px',
                      fontWeight: 600
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-accent-glow)';
                      e.currentTarget.style.borderColor = 'var(--color-lime)';
                      e.currentTarget.style.boxShadow = `0 0 20px var(--color-lime)25`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'var(--color-border-medium)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Previous
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 py-4 rounded-xl font-semibold uppercase tracking-wider transition-all duration-300 text-black text-sm"
                    style={{
                      backgroundColor: 'var(--color-lime)',
                      letterSpacing: '0.8px',
                      fontWeight: 600,
                      boxShadow: `0 12px 32px var(--color-lime)35`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 16px 48px var(--color-lime)50`;
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `0 12px 32px var(--color-lime)35`;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 rounded-xl font-semibold uppercase tracking-wider transition-all duration-300 text-black text-sm"
                    style={{
                      backgroundColor: loading ? 'var(--color-lime)70' : 'var(--color-lime)',
                      opacity: loading ? 0.7 : 1,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      letterSpacing: '0.8px',
                      fontWeight: 600,
                      boxShadow: `0 12px 32px var(--color-lime)35`,
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.boxShadow = `0 16px 48px var(--color-lime)50`;
                        e.currentTarget.style.transform = 'translateY(-3px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.boxShadow = `0 12px 32px var(--color-lime)35`;
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                )}
              </div>

              {/* Error Messages */}
              {formError && (
                <div 
                  className="mt-4 p-4 rounded-lg text-sm font-light text-center border animate-pulse"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    borderColor: 'rgba(239, 68, 68, 0.35)',
                    color: '#FCA5A5',
                    letterSpacing: '0.3px'
                  }}
                >
                  {formError}
                </div>
              )}
              {error && (
                <div 
                  className="mt-4 p-4 rounded-lg text-sm font-light text-center border animate-pulse"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    borderColor: 'rgba(239, 68, 68, 0.35)',
                    color: '#FCA5A5',
                    letterSpacing: '0.3px'
                  }}
                >
                  The user already exists
                </div>
              )}
            </form>

            {/* Bottom Accent Line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[1px] rounded-full"
              style={{
                background: `linear-gradient(90deg, transparent, var(--color-lime)60, transparent)`,
                boxShadow: `0 0 20px var(--color-lime)30`
              }}
            ></div>
          </div>

          {/* Sign In Link */}
          <p
            className="text-center text-xs font-light mt-6"
            style={{ color: 'var(--color-text-secondary)', letterSpacing: '0.3px' }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="transition-colors duration-200 font-semibold"
              style={{ color: 'var(--color-lime)' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Sign In
            </Link>
          </p>
            </div>
          </div>
        </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-30px) translateX(10px);
          }
          66% {
            transform: translateY(20px) translateX(-10px);
          }
        }

        @keyframes drift {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(60px, 60px);
          }
        }

        input::placeholder {
          color: var(--color-text-tertiary);
          opacity: 0.4;
        }

        @media (max-width: 1024px) {
          input, button {
            font-size: 16px;
          }
        }
      `}</style>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}