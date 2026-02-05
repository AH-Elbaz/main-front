"use client";
import { useState } from "react";
import { useAuth } from "@/app/features/auth/hooks/useAuth";
import Link from "next/link";
import ForgotPasswordModal from "./ForgotPasswordModal";

const COLORS = {
  lime: '#CCFF00',
  darkBg: '#0A0A0A',
  darkCard: '#0F0F0F',
  darkInput: '#141414',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#808080',
  borderLight: 'rgba(204, 255, 0, 0.06)',
  borderMedium: 'rgba(204, 255, 0, 0.12)',
  borderStrong: 'rgba(204, 255, 0, 0.2)',
  accentGlow: 'rgba(204, 255, 0, 0.08)',
};

export default function LoginForm() {
  const { login, loading, error } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // State للتحكم في نافذة نسيان كلمة المرور
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(name, password);
  };

  return (
    <div 
      className="min-h-screen w-full flex relative overflow-hidden"
      style={{ backgroundColor: COLORS.darkBg }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${COLORS.lime}30, transparent 70%)`,
            filter: 'blur(100px)',
            animation: 'float 8s ease-in-out infinite',
          }}
        ></div>
        
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, ${COLORS.lime}20, transparent 70%)`,
            filter: 'blur(100px)',
            animation: 'float 10s ease-in-out infinite reverse',
          }}
        ></div>

        <div 
          className="absolute top-1/2 right-1/3 w-72 h-72 rounded-full opacity-15"
          style={{
            background: `radial-gradient(circle, ${COLORS.lime}15, transparent 70%)`,
            filter: 'blur(80px)',
            animation: 'float 12s ease-in-out infinite',
          }}
        ></div>

        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, ${COLORS.lime} 25%, ${COLORS.lime} 26%, transparent 27%, transparent 74%, ${COLORS.lime} 75%, ${COLORS.lime} 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, ${COLORS.lime} 25%, ${COLORS.lime} 26%, transparent 27%, transparent 74%, ${COLORS.lime} 75%, ${COLORS.lime} 76%, transparent 77%, transparent)
            `,
            backgroundSize: '80px 80px',
            animation: 'drift 20s linear infinite',
          }}
        ></div>
      </div>

      {/* Left Side Content */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 relative z-10">
         <div>
           {/* يمكن إلغاء التعليق عن الصورة إذا قمت بإضافتها */}
           {/* <Image 
             src="/images/logo.png" 
             alt="VitaLink" 
             width={160} 
             height={45} 
             className="object-contain"
             style={{ filter: `drop-shadow(0 0 15px ${COLORS.lime}40)` }}
           /> */}
         </div>

         <div className="space-y-8">
           <div>
            <h1 className="text-6xl font-light leading-tight mb-6" style={{ color: COLORS.textPrimary }}>
              Unlock Your Peak Performance
            </h1>
            <p className="text-xl font-light max-w-lg" style={{ color: COLORS.textSecondary }}>
              Experience the future of athletic optimization with real-time biometric insights.
            </p>
           </div>
         </div>
         
         <div className="grid grid-cols-3 gap-6 pt-8 border-t" style={{ borderColor: COLORS.borderLight }}>
           {[
             { number: "50K+", label: "Active Athletes" },
             { number: "99.9%", label: "Uptime" },
             { number: "24/7", label: "Support" }
           ].map((stat, idx) => (
             <div key={idx} className="text-center">
               <div className="text-2xl font-light mb-2" style={{ color: COLORS.lime }}>{stat.number}</div>
               <p className="text-xs font-light" style={{ color: COLORS.textTertiary }}>{stat.label}</p>
             </div>
           ))}
         </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-md">
          <div 
            className="rounded-3xl border backdrop-blur-2xl p-12 relative overflow-hidden group"
            style={{
              backgroundColor: `${COLORS.darkCard}E0`,
              borderColor: COLORS.borderMedium,
              boxShadow: `0 25px 50px rgba(0, 0, 0, 0.6), 0 0 1px ${COLORS.borderStrong}, inset 0 1px 0 ${COLORS.borderLight}`,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            
            <div className="text-center mb-12 relative z-10">
                <div className="inline-block mb-6 p-4 rounded-2xl" style={{ backgroundColor: `${COLORS.lime}10`, border: `1px solid ${COLORS.borderMedium}` }}>
                  <span className="text-3xl">🔐</span>
                </div>
                <h1 className="text-4xl font-light mb-3" style={{ color: COLORS.textPrimary }}>Welcome Back</h1>
                <p className="text-sm font-light" style={{ color: COLORS.textTertiary }}>Access your personalized dashboard</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              
              {/* User ID Field */}
              <div className="space-y-3">
                 <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider" style={{ color: focusedField === 'name' ? COLORS.lime : COLORS.textSecondary }}>User ID</label>
                 <div className="relative group/input">
                    <input
                       id="name"
                       type="text"
                       suppressHydrationWarning={true} // 👈 التعديل الأول
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       onFocus={() => setFocusedField('name')}
                       onBlur={() => setFocusedField(null)}
                       placeholder="Enter your user ID"
                       required
                       className="w-full px-5 py-4 rounded-xl font-light text-sm transition-all duration-300 outline-none relative z-10"
                       style={{
                          backgroundColor: COLORS.darkInput,
                          borderColor: focusedField === 'name' ? COLORS.lime : COLORS.borderLight,
                          border: `1px solid ${focusedField === 'name' ? COLORS.lime : COLORS.borderLight}`,
                          color: COLORS.textPrimary,
                          boxShadow: focusedField === 'name' ? `0 0 0 4px ${COLORS.accentGlow}, inset 0 1px 2px rgba(0,0,0,0.3)` : 'inset 0 1px 2px rgba(0,0,0,0.3)',
                       }}
                    />
                 </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider" style={{ color: focusedField === 'password' ? COLORS.lime : COLORS.textSecondary }}>
                    Authentication Key
                  </label>
                  
                  {/* Forgot Button */}
                  <button 
                    type="button"
                    suppressHydrationWarning={true} // 👈 التعديل الثاني (زر نسيان كلمة المرور)
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-light transition-colors duration-200 hover:text-[#CCFF00]"
                    style={{ color: COLORS.textTertiary }}
                  >
                    Forgot?
                  </button>
                </div>
                
                <div className="relative">
                   <input
                     id="password"
                     type={showPassword ? "text" : "password"}
                     suppressHydrationWarning={true} // 👈 التعديل الثالث (حقل الباسورد)
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     onFocus={() => setFocusedField('password')}
                     onBlur={() => setFocusedField(null)}
                     placeholder="••••••••••"
                     required
                     className="w-full px-5 py-4 rounded-xl font-light text-sm outline-none pr-14"
                     style={{
                        backgroundColor: COLORS.darkInput,
                        borderColor: focusedField === 'password' ? COLORS.lime : COLORS.borderLight,
                        border: `1px solid ${focusedField === 'password' ? COLORS.lime : COLORS.borderLight}`,
                        color: COLORS.textPrimary,
                        boxShadow: focusedField === 'password' ? `0 0 0 4px ${COLORS.accentGlow}, inset 0 1px 2px rgba(0,0,0,0.3)` : 'inset 0 1px 2px rgba(0,0,0,0.3)',
                     }}
                   />
                   
                   {/* Show/Hide Button */}
                   <button
                        type="button"
                        suppressHydrationWarning={true} // 👈 إضافة إضافية للحماية هنا أيضاً
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase transition-colors duration-200"
                        style={{ color: COLORS.textTertiary }}
                   >
                        {showPassword ? "Hide" : "Show"}
                   </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                suppressHydrationWarning={true} // 👈 إضافة إضافية لزر الدخول
                disabled={loading}
                className="w-full py-4 mt-8 rounded-xl font-semibold uppercase tracking-wider text-black text-sm relative overflow-hidden"
                style={{
                  backgroundColor: loading ? `${COLORS.lime}70` : COLORS.lime,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.8px',
                  boxShadow: `0 12px 32px ${COLORS.lime}35, inset 0 -2px 4px rgba(0,0,0,0.2)`,
                }}
              >
                {loading ? "Authenticating..." : "Initiate Login"}
              </button>

              {/* Error Message */}
              {error && (
                <div className="mt-6 p-4 rounded-lg text-sm font-light text-center border animate-pulse"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.35)', color: '#FCA5A5' }}
                >
                  {error}
                </div>
              )}

              {/* Create Account Link */}
              <Link 
                href="/signup"
                suppressHydrationWarning={true} // 👈 إضافة إضافية
                className="block w-full py-4 mt-4 rounded-xl font-semibold uppercase tracking-wider text-center transition-all duration-300 border text-sm"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: COLORS.borderMedium,
                  color: COLORS.lime,
                  letterSpacing: '0.8px',
                }}
              >
                Create Account
              </Link>

            </form>
          </div>
        </div>
      </div>

      {/* استدعاء المودال */}
      <ForgotPasswordModal 
        isOpen={showForgotModal} 
        onClose={() => setShowForgotModal(false)} 
      />

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px) translateX(0px); } 33% { transform: translateY(-30px) translateX(10px); } 66% { transform: translateY(20px) translateX(-10px); } }
        @keyframes drift { 0% { transform: translate(0, 0); } 100% { transform: translate(60px, 60px); } }
        input::placeholder { color: ${COLORS.textTertiary}; opacity: 0.4; }
      `}</style>
    </div>
  );
}