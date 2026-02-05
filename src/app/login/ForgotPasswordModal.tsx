"use client";
import { useState, useRef } from "react";
import Webcam from "react-webcam";

// Ensure you have installed the webcam library: npm install react-webcam

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
};

// This is the correct API URL based on your Azure screenshot
const API_BASE_URL = "https://vitalink20251014200825.azurewebsites.net";

export default function ForgotPasswordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1); // 1: Username, 2: Camera, 3: New Password, 4: Success
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const webcamRef = useRef<Webcam>(null);

  // 1. Verify User Identity
  const handleVerifyIdentity = async () => {
    // Protection: If camera is not ready
    if (!webcamRef.current) {
        setError("Camera not ready. Please try again.");
        return;
    }

    setLoading(true);
    setError("");

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error("Failed to capture photo.");

      // Sending request to the correct URL
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-identity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, imageBase64: imageSrc }),
      });

      if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Face verification failed.");
      }
      
      setStep(3); // Move to next step
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Reset Password
  const handleResetPassword = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, newPassword }),
      });

      if (!response.ok) throw new Error("Failed to reset password.");
      
      setStep(4); // Success
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div 
        className="w-full max-w-lg p-8 rounded-3xl border relative overflow-hidden"
        style={{
          backgroundColor: COLORS.darkCard,
          borderColor: COLORS.borderMedium,
          boxShadow: `0 0 50px ${COLORS.lime}15`
        }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>

        <div className="text-center space-y-6">
          
          {step === 1 && (
            <>
              <h2 className="text-2xl font-light text-white">Find Account</h2>
              <input
                type="text"
                placeholder="Enter User ID"
                className="w-full px-5 py-4 rounded-xl outline-none text-white focus:border-[#CCFF00]"
                style={{ backgroundColor: COLORS.darkInput, border: `1px solid ${COLORS.borderLight}` }}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button
                onClick={() => setStep(2)}
                disabled={!username}
                className="w-full py-4 rounded-xl font-bold text-black hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: COLORS.lime }}
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-light text-white">Face Verification</h2>
              
              {/* Camera Container */}
              <div className="relative rounded-2xl overflow-hidden border border-gray-800 mx-auto aspect-video bg-black">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  videoConstraints={{ facingMode: "user" }}
                  onUserMediaError={() => setError("Camera permission denied!")}
                />
                <div className="absolute inset-0 border-2 border-dashed rounded-full w-48 h-64 m-auto opacity-50 animate-pulse" style={{ borderColor: COLORS.lime }}></div>
              </div>
              
              <button
                onClick={handleVerifyIdentity}
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-black"
                style={{ backgroundColor: COLORS.lime, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Verifying..." : "Scan Face"}
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-light text-white">New Password</h2>
              <input
                type="password"
                placeholder="Enter New Password"
                className="w-full px-5 py-4 rounded-xl outline-none text-white"
                style={{ backgroundColor: COLORS.darkInput, border: `1px solid ${COLORS.borderLight}` }}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-black"
                style={{ backgroundColor: COLORS.lime }}
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </>
          )}

          {step === 4 && (
            <div className="py-10">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
              <p className="text-gray-400 mb-6">Password changed successfully.</p>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl font-bold text-black"
                style={{ backgroundColor: COLORS.lime }}
              >
                Back to Login
              </button>
            </div>
          )}

          {error && <p className="text-red-400 text-sm animate-pulse font-medium bg-red-900/20 p-2 rounded">{error}</p>}
        </div>
      </div>
    </div>
  );
}