"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import * as signalR from "@microsoft/signalr";
import dynamic from "next/dynamic";

// Dynamic imports for charts with SSR disabled
const LineChart = dynamic(() => import("recharts").then(mod => mod.LineChart), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then(mod => mod.AreaChart), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false });
// Note: Legend component usage was removed from chart markup due to typing
// conflicts with dynamic imports. If you need a legend, consider a static
// import or a typed wrapper for recharts' Legend.
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });
const Area = dynamic(() => import("recharts").then(mod => mod.Area), { ssr: false });
const Line = dynamic(() => import("recharts").then(mod => mod.Line), { ssr: false });
const ScatterChart = dynamic(() => import("recharts").then(mod => mod.ScatterChart), { ssr: false });
const Scatter = dynamic(() => import("recharts").then(mod => mod.Scatter), { ssr: false });

// --- OPENROUTER INTEGRATION ---
type AnalysisData = SensorData & { time: string }; 

const OPENROUTER_API_KEY = "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"; 
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Professional OpenRouter Prompt for Health Analysis
const createHealthAnalysisPrompt = (data: AnalysisData[]): string => {
  return `You are an advanced biomedical AI analyst specializing in real-time health monitoring and predictive wellness assessment. Your role is to provide clinically-relevant, actionable insights from continuous biometric data streams.

CONTEXT:
You have received a 10-second continuous biometric data stream from a wearable health monitoring system. Each data point represents measurements captured at 1-second intervals. The dataset includes:
- Heart Rate (BPM): Cardiac frequency indicator
- SpO2 (%): Peripheral oxygen saturation level
- Body Temperature (°C): Core/surface temperature measurement
- 3-Axis Acceleration (m/s²): Motion and activity intensity metrics
- GSR (Galvanic Skin Response, arbitrary units): Electrodermal activity indicator of stress/arousal

ANALYSIS REQUIREMENTS:
1. Identify temporal trends: Calculate whether each metric is increasing, decreasing, or stable over the 10-second window
2. Detect anomalies: Flag any values that deviate significantly from normal physiological ranges
3. Correlate patterns: Look for synchronized changes across metrics that indicate specific physiological states (stress, fatigue, exertion, etc.)
4. Assess risk: Evaluate overall wellness status and identify potential health concerns
5. Provide actionable guidance: Deliver a single, concise clinical insight that is immediately useful for the user

BIOMETRIC DATA:
${JSON.stringify(data, null, 2)}

NORMAL PHYSIOLOGICAL RANGES (for reference):
- Heart Rate: 60-100 BPM (varies with activity)
- SpO2: 95-100%
- Temperature: 36.5-37.5°C
- GSR: Baseline varies; elevated values indicate stress/arousal

OUTPUT REQUIREMENTS:
Provide ONLY a single, professional sentence (maximum 20 words) that delivers:
1. A clear observation about the current physiological state
2. A specific health recommendation or warning if applicable
3. Use clinical terminology where appropriate

Example outputs:
- "Heart rate trending upward with elevated GSR suggests acute stress response; recommend brief relaxation exercise."
- "All vitals stable within normal ranges; excellent cardiovascular stability during this monitoring period."
- "SpO2 declining slightly with increased acceleration; ensure adequate ventilation during continued activity."

Respond with ONLY the insight sentence, no additional text.`;
};

// Function to send data to OpenRouter - NOW WITH CALLBACK FOR CYCLE RESTART
const sendToOpenRouter = async (
  data: AnalysisData[], 
  setHealthResponse: (response: string) => void,
  onResponseComplete: () => void
) => {
  const prompt = createHealthAnalysisPrompt(data);

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vitalink.example.com",
        "X-Title": "VitaLink Health Dashboard"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          {
            role: "system",
            content: "You are an advanced biomedical AI analyst specializing in real-time health monitoring and predictive wellness assessment."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenRouter API Error:", response.status, errorBody);
      setHealthResponse("⚠️ Error: Unable to analyze data at this moment. Please try again.");
      onResponseComplete();
      return;
    }

    const result = await response.json();
    const text = result.choices?.[0]?.message?.content;
    
    if (!text) {
      console.error("OpenRouter API Response Missing Text:", result);
      setHealthResponse("⚠️ Error: Analysis returned empty response. Please try again.");
      onResponseComplete();
      return;
    }

    setHealthResponse(text);
    onResponseComplete();
  } catch (error) {
    console.error("Error sending to OpenRouter:", error);
    setHealthResponse("⚠️ Error: Network error. Please check your connection.");
    onResponseComplete();
  }
};

// --- THEMES ---
const THEMES = {
  limeDark: {
    name: 'Lime Dark',
    background: { primary: '#0A0A0A', secondary: '#121212', tertiary: '#1A1A1A', hover: '#252525' },
    text: { primary: '#FFFFFF', secondary: '#D0D0D0', tertiary: '#909090', disabled: '#505050' },
    accent: { primary: '#CCFF00', light: 'rgba(204, 255, 0, 0.08)', medium: 'rgba(204, 255, 0, 0.15)', dark: 'rgba(204, 255, 0, 0.05)', glow: 'rgba(204, 255, 0, 0.25)' },
    border: { light: 'rgba(204, 255, 0, 0.06)', medium: 'rgba(204, 255, 0, 0.12)', strong: 'rgba(204, 255, 0, 0.25)' },
    status: { success: '#10B981', warning: '#F59E0B', danger: '#EF4444', info: '#CCFF00' },
    shadow: { soft: '0 10px 20px rgba(0, 0, 0, 0.6), 0 5px 10px rgba(0, 0, 0, 0.3)', strong: '0 15px 40px rgba(204, 255, 0, 0.15), 0 5px 15px rgba(204, 255, 0, 0.05)' }, 
  },
  blueLight: {
    name: 'Blue Light',
    background: { primary: '#F8FAFC', secondary: '#FFFFFF', tertiary: '#F1F5F9', hover: '#E2E8F0' },
    text: { primary: '#1E293B', secondary: '#475569', tertiary: '#94A3B8', disabled: '#CBD5E1' },
    accent: { primary: '#3B82F6', light: 'rgba(59, 130, 246, 0.08)', medium: 'rgba(59, 130, 246, 0.15)', dark: 'rgba(59, 130, 246, 0.05)', glow: 'rgba(59, 130, 246, 0.25)' },
    border: { light: 'rgba(59, 130, 246, 0.08)', medium: 'rgba(59, 130, 246, 0.15)', strong: 'rgba(59, 130, 246, 0.25)' },
    status: { success: '#059669', warning: '#F59E0B', danger: '#DC2626', info: '#3B82F6' },
    shadow: { soft: '0 4px 12px rgba(0, 0, 0, 0.1)', strong: '0 8px 30px rgba(59, 130, 246, 0.08)' },
  }
};

// --- ANIMATION KEYFRAMES & STYLES ---
const keyframes = `
@keyframes smooth-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 rgba(204, 255, 0, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(204, 255, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(204, 255, 0, 0); }
}

@keyframes slide-in-fade {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounce-in {
  0% { opacity: 0; transform: scale(0.95) translateY(10px); }
  50% { opacity: 1; transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes gradient-shift-dark {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

@keyframes gradient-shift-light {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
}
`;

const GlobalStyles: React.FC<{ theme: Theme }> = ({ theme }) => {
  const cssVariables = {
    '--bg-primary': theme.background.primary,
    '--bg-secondary': theme.background.secondary,
    '--bg-tertiary': theme.background.tertiary,
    '--text-primary': theme.text.primary,
    '--text-secondary': theme.text.secondary,
    '--text-tertiary': theme.text.tertiary,
    '--accent-primary': theme.accent.primary,
    '--accent-glow': theme.accent.glow,
    '--border-medium': theme.border.medium,
    '--status-success': theme.status.success,
    '--status-warning': theme.status.warning,
    '--status-danger': theme.status.danger,
    '--shadow-soft': theme.shadow.soft,
  };

  const styleString = Object.entries(cssVariables).map(([key, value]) => `${key}: ${value};`).join('');

  const globalOverrides = `
    * {
        background-color: var(--bg-fallback, inherit); 
        border-color: var(--border-fallback, inherit);
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      <style>{`:root { ${styleString} }`}</style>
      <style>{globalOverrides}</style>
    </>
  );
};

// --- TYPES & UTILITIES ---
type ThemeKey = keyof typeof THEMES;
type Theme = typeof THEMES[ThemeKey];
type DataMode = 'live' | 'simulated';
type HealthStatus = 'optimal' | 'warning' | 'danger';

type JwtPayload = {
    ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]?: string;
    sub?: string;
    email?: string;
  [key: string]: unknown;
};

type SensorData = {
    heartRate: number;
    spo2: number;
    temperature: number;
    accX: number;
    accY: number;
    accZ: number;
    sweat: number;
};

type HistoricalData = SensorData & {
    time: string;
};

const getHealthStatus = (value: number, min: number, max: number): HealthStatus => {
  if (value < min || value > max) return 'warning';
  return 'optimal';
};

const getOverallHealthStatus = (...statuses: HealthStatus[]): HealthStatus => {
  if (statuses.includes('danger')) return 'danger';
  if (statuses.includes('warning')) return 'warning';
  return 'optimal';
};

const getStatusColor = (status: HealthStatus, theme: Theme): string => {
  switch (status) {
    case 'optimal': return theme.status.success;
    case 'warning': return theme.status.warning;
    case 'danger': return theme.status.danger;
    default: return theme.accent.primary;
  }
};

const generateSimulatedData = (): SensorData => {
  return {
    heartRate: 72 + Math.sin(Date.now() / 5000) * 15 + Math.random() * 2,
    spo2: 98 + Math.cos(Date.now() / 7000) * 2 + Math.random() * 0.5,
    temperature: 37 + Math.sin(Date.now() / 8000) * 0.5 + Math.random() * 0.1,
    accX: Math.sin(Date.now() / 3000) * 2 + Math.random() * 0.5,
    accY: Math.cos(Date.now() / 3500) * 2 + Math.random() * 0.5,
    accZ: 10 + Math.sin(Date.now() / 4000) * 0.5 + Math.random() * 0.5,
    sweat: 50 + Math.sin(Date.now() / 6000) * 30 + Math.random() * 5,
  };
};

const icons = {
    'Heart Rate': '❤️',
    'Blood Oxygen': '🫧',
    'Body Temperature': '🌡️',
    'GSR Level': '💧',
};

// --- COMPONENTS ---

const AnimatedBackground: React.FC<{ theme: Theme }> = ({ theme }) => {
  const isDark = theme.name === 'Lime Dark';
  const color1 = isDark ? '#1A1A1A' : '#F1F5F9';
  const color2 = theme.background.primary;
  const color3 = isDark ? '#121212' : '#E2E8F0';

  return (
    <div 
      className="fixed top-0 left-0 w-full h-full overflow-hidden" 
      style={{ 
        zIndex: 0, 
        backgroundColor: color2, 
        backgroundImage: `linear-gradient(270deg, ${color1}, ${color2}, ${color3})`, 
        backgroundSize: '400% 400%',
        animation: `${isDark ? 'gradient-shift-dark' : 'gradient-shift-light'} 30s ease infinite`, 
        transition: 'background-color 0.5s',
      }}
    />
  );
};

interface MetricCardProps {
  label: keyof typeof icons;
  value: number;
  unit: string;
  status: HealthStatus;
  theme: Theme;
  min: number;
  max: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, status, theme, min, max }) => {
  const statusColor = getStatusColor(status, theme);
  const isOptimal = status === 'optimal';
  
  return (
    <div 
      className="rounded-xl overflow-hidden transition-all duration-300 h-full hover:shadow-xl" 
      style={{
        backgroundColor: `${theme.background.secondary}dd`, 
        backdropFilter: 'blur(10px)', 
        border: `1px solid ${theme.border.medium}`,
        boxShadow: isOptimal 
          ? theme.shadow.soft 
          : `${theme.shadow.soft}, 0 0 25px ${theme.accent.glow}`,
        animation: 'slide-in-fade 0.6s ease-out',
      }}
    >
      <div className="p-5 sm:p-6 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2 mb-4">
          <p 
            className="text-xs font-semibold uppercase tracking-widest flex items-center gap-2"
            style={{ color: theme.text.tertiary, letterSpacing: '0.1em' }}
          >
            <span style={{ fontSize: '1.1em' }}>{icons[label]}</span>
            {label} 
          </p>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <div 
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ 
                backgroundColor: statusColor,
                boxShadow: `0 0 0 0 ${statusColor}`,
                animation: !isOptimal ? 'pulse-ring 1.5s infinite' : 'none',
              }}
            />
            <span 
              className="text-xs font-bold uppercase whitespace-nowrap"
              style={{ color: statusColor }}
            >
              {isOptimal ? 'OPTIMAL' : 'WARNING'}
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span 
            className="text-5xl sm:text-6xl font-extrabold leading-none"
            style={{ color: theme.accent.primary, transition: 'color 0.3s' }}
          >
            {value.toFixed(1)}
          </span>
          <span 
            className="text-lg font-semibold"
            style={{ color: theme.text.secondary }}
          >
            {unit}
          </span>
        </div>
        
        <div className="mt-2">
            <p className="text-xs" style={{ color: theme.text.tertiary }}>
                Range: {min.toFixed(1)} - {max.toFixed(1)} {unit}
            </p>
        </div>
      </div>
    </div>
  );
};

const StatusIndicator: React.FC<{ label: string, status: boolean, details?: string, theme: Theme }> = ({ label, status, details, theme }) => {
  const statusColor = status ? theme.status.success : theme.status.danger;
  
  return (
    <div 
      className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300"
      style={{
        backgroundColor: `${theme.background.secondary}dd`, 
        borderColor: theme.border.medium,
        boxShadow: theme.shadow.soft,
        backdropFilter: 'blur(10px)',
        animation: 'slide-in-fade 0.5s ease-out',
      }}
    >
      <div 
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ 
          backgroundColor: statusColor,
          animation: 'smooth-pulse 2s ease-in-out infinite',
        }}
      />
      <div className="flex-1 min-w-0">
        <p 
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: theme.text.secondary, letterSpacing: '0.05em' }}
        >
          {label}
        </p>
        {details && (
          <p 
            className="text-xs mt-0.5"
            style={{ color: theme.text.tertiary }}
          >
            {details}
          </p>
        )}
      </div>
      <span 
        className="text-xs font-bold uppercase tracking-wider flex-shrink-0"
        style={{ 
          color: statusColor,
          letterSpacing: '0.05em',
        }}
      >
        {status ? 'ACTIVE' : 'OFFLINE'}
      </span>
    </div>
  );
};

const DataStreamSelector: React.FC<{ mode: DataMode, onChange: (mode: DataMode) => void, theme: Theme }> = ({ mode, onChange, theme }) => {
  return (
    <div 
      className="flex gap-2 p-1 rounded-xl" 
      style={{
        backgroundColor: theme.background.tertiary,
        border: `1px solid ${theme.border.medium}`,
        boxShadow: theme.shadow.soft,
        animation: 'bounce-in 0.6s ease-out',
      }}
    >
      {(['live', 'simulated'] as const).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className="px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all duration-300"
          style={{
            backgroundColor: mode === m ? theme.accent.primary : 'transparent',
            color: mode === m ? theme.background.primary : theme.text.secondary,
            border: `1px solid ${mode === m ? theme.accent.primary : 'transparent'}`,
            animation: mode === m ? 'bounce-in 0.4s ease-out' : 'none',
          }}
        >
          {m === 'live' ? '🔴 Live Stream' : '📊 Simulated'}
        </button>
      ))}
    </div>
  );
};

const ChartWrapper: React.FC<{ title: string, children: React.ReactNode, theme: Theme }> = ({ title, children, theme }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const exportButtonRef = useRef<HTMLButtonElement>(null); 

  const downloadChart = useCallback(async () => {
    if (!containerRef?.current || !exportButtonRef?.current) return;
    
    setIsDownloading(true);
    exportButtonRef.current.style.display = 'none';

    try {
      const html2canvas = (await import('html2canvas')).default;

      const actualWidth = containerRef.current.scrollWidth;
      const actualHeight = containerRef.current.scrollHeight; 
      
      const bufferHeight = actualHeight + 100; 
      const bufferWidth = actualWidth + 20;
      
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      
      tempContainer.style.width = `${bufferWidth}px`;
      tempContainer.style.height = `${bufferHeight}px`; 

      tempContainer.style.backgroundColor = theme.background.secondary; 
      tempContainer.style.color = theme.text.primary; 
      tempContainer.style.fontFamily = 'sans-serif'; 

      tempContainer.innerHTML = containerRef.current.innerHTML;
      document.body.appendChild(tempContainer);

      const canvas = await html2canvas(tempContainer, {
        backgroundColor: theme.background.secondary, 
        scale: 2,
        width: bufferWidth,
        height: bufferHeight, 
        logging: false, 
        useCORS: true,
        allowTaint: true,
      });

      document.body.removeChild(tempContainer);

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${title.replace(/\s+/g, '_')}_${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error downloading chart:', error);
      alert('An error occurred while saving the chart. Please ensure all charts are visible.');
    } finally {
      if (exportButtonRef.current) {
        exportButtonRef.current.style.display = 'flex';
      }
      setIsDownloading(false);
    }
  }, [title, theme]);

  return (
    <div 
      className="rounded-xl p-5 sm:p-6 border overflow-hidden transition-all duration-300" 
      style={{
        backgroundColor: `${theme.background.secondary}dd`, 
        backdropFilter: 'blur(10px)', 
        borderColor: theme.border.medium,
        boxShadow: theme.shadow.soft, 
        animation: 'slide-in-fade 0.7s ease-out',
      }}
      ref={containerRef}
    >
      <div className="flex items-center justify-between mb-5 gap-3">
        <h2 
          className="text-base sm:text-lg font-semibold tracking-wide"
          style={{ color: theme.text.primary, letterSpacing: '0.05em', textTransform: 'uppercase' }}
        >
          {title}
        </h2>
        <button
          onClick={downloadChart}
          disabled={isDownloading}
          ref={exportButtonRef}
          className="px-3 py-2 rounded-lg text-xs font-bold uppercase flex-shrink-0 transition-all duration-200 flex items-center gap-1.5"
          style={{
            backgroundColor: isDownloading ? theme.text.tertiary : theme.accent.primary,
            color: isDownloading ? theme.text.secondary : theme.background.primary,
            border: `1px solid ${theme.accent.primary}`,
            opacity: isDownloading ? 0.6 : 1,
            cursor: isDownloading ? 'not-allowed' : 'pointer',
            animation: 'bounce-in 0.6s ease-out',
          }}
        >
          <span>📊</span>
          <span>{isDownloading ? 'Saving...' : 'Export'}</span>
        </button>
      </div>
      <div className="overflow-hidden" style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
        {children}
      </div>
    </div>
  );
};

const HealthStatusChart: React.FC<{ historicalData: HistoricalData[], theme: Theme }> = ({ historicalData, theme }) => {
    return (
        <ChartWrapper title="VITAL SIGNS TREND (STACKED)" theme={theme}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart 
                data={historicalData} 
                margin={{ top: 30, right: 30, left: 5, bottom: 30 }}
            >
              <defs>
                <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.status.danger} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={theme.status.danger} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSpo2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.status.success} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={theme.status.success} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border.light} horizontal={true} vertical={false} />
              <XAxis dataKey="time" stroke={theme.text.tertiary} style={{ fontSize: '0.75rem' }} />
              <YAxis stroke={theme.text.tertiary} style={{ fontSize: '0.75rem' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: theme.background.secondary, border: `1px solid ${theme.border.medium}`, borderRadius: '8px', color: theme.text.primary }}
                labelStyle={{ color: theme.text.primary }}
              />
                          {/* Legend removed to avoid typing conflicts with dynamic import; default legend omitted */}
              
              <Area 
                type="monotone" 
                dataKey="heartRate" 
                stackId="vitals" 
                stroke={theme.status.danger} 
                fillOpacity={1} 
                fill="url(#colorHr)" 
                name="Heart Rate (bpm)" 
                strokeWidth={3}
              />
              <Area 
                type="monotone" 
                dataKey="spo2" 
                stackId="vitals" 
                stroke={theme.status.success} 
                fillOpacity={1} 
                fill="url(#colorSpo2)" 
                name="SpO2 (%)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartWrapper>
      );
};

const TemperatureTrendChart: React.FC<{ historicalData: HistoricalData[], theme: Theme }> = ({ historicalData, theme }) => {
  return (
    <ChartWrapper title="TEMPERATURE TREND" theme={theme}>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart 
            data={historicalData} 
            margin={{ top: 30, right: 30, left: 5, bottom: 30 }}
        >
            <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.accent.primary} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={theme.accent.primary} stopOpacity={0.1}/>
                </linearGradient>
            </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.border.light} horizontal={true} vertical={false} />
          <XAxis dataKey="time" stroke={theme.text.tertiary} style={{ fontSize: '0.75rem' }} />
          <YAxis stroke={theme.text.tertiary} style={{ fontSize: '0.75rem' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: theme.background.secondary, border: `1px solid ${theme.border.medium}`, borderRadius: '8px', color: theme.text.primary }}
            labelStyle={{ color: theme.text.primary }}
          />
          {/* Legend removed */}
          <Area 
            type="monotone" 
            dataKey="temperature" 
            stroke={theme.accent.primary} 
            fillOpacity={1}
            fill="url(#colorTemp)"
            strokeWidth={3}
            name="Temperature (°C)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

const GSRTrendChart: React.FC<{ historicalData: HistoricalData[], theme: Theme }> = ({ historicalData, theme }) => {
  const gsrColor = "#00FFFF";
  return (
    <ChartWrapper title="GSR (GALVANIC SKIN RESPONSE) TREND" theme={theme}>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart 
            data={historicalData} 
            margin={{ top: 30, right: 30, left: 5, bottom: 30 }}
        >
            <defs>
                <linearGradient id="colorGSR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={gsrColor} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={gsrColor} stopOpacity={0.1}/>
                </linearGradient>
            </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.border.light} horizontal={true} vertical={false} />
          <XAxis dataKey="time" stroke={theme.text.tertiary} style={{ fontSize: '0.75rem' }} />
          <YAxis stroke={theme.text.tertiary} style={{ fontSize: '0.75rem' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: theme.background.secondary, border: `1px solid ${theme.border.medium}`, borderRadius: '8px', color: theme.text.primary }}
            labelStyle={{ color: theme.text.primary }}
          />
          {/* Legend removed */}
          <Area 
            type="monotone" 
            dataKey="sweat" 
            stroke={gsrColor} 
            fillOpacity={1}
            fill="url(#colorGSR)"
            strokeWidth={3}
            name="GSR (Ohms)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

const AccelerationChart: React.FC<{ historicalData: HistoricalData[], theme: Theme }> = ({ historicalData, theme }) => {
    return (
        <ChartWrapper title="3D ACCELERATION TREND" theme={theme}>
            <ResponsiveContainer width="100%" height={280}>
                <AreaChart 
                    data={historicalData} 
                    margin={{ top: 30, right: 30, left: 5, bottom: 30 }}
                >
                    <defs>
                        <linearGradient id="colorAccX" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#A93226" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#A93226" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorAccY" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#27AE60" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#27AE60" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorAccZ" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3498DB" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#3498DB" stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.border.light} horizontal={true} vertical={false} />
                    <XAxis dataKey="time" stroke={theme.text.tertiary} style={{ fontSize: '0.75rem' }} />
                    <YAxis stroke={theme.text.tertiary} style={{ fontSize: '0.75rem' }} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: theme.background.secondary, border: `1px solid ${theme.border.medium}`, borderRadius: '8px', color: theme.text.primary }}
                        labelStyle={{ color: theme.text.primary }}
                    />
                    {/* Legend removed */}
                    <Area type="monotone" dataKey="accX" stroke="#A93226" fillOpacity={1} fill="url(#colorAccX)" strokeWidth={3} name="AccX (m/s²)" />
                    <Area type="monotone" dataKey="accY" stroke="#27AE60" fillOpacity={1} fill="url(#colorAccY)" strokeWidth={3} name="AccY (m/s²)" />
                    <Area type="monotone" dataKey="accZ" stroke="#3498DB" fillOpacity={1} fill="url(#colorAccZ)" strokeWidth={3} name="AccZ (m/s²)" />
                </AreaChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

// Professional Circular Countdown Component
const CircularCountdown: React.FC<{ counter: number, theme: Theme }> = ({ counter, theme }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (counter / 10) * circumference;
  
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div style={{ position: 'relative', width: '120px', height: '120px' }}>
        <svg
          width="120"
          height="120"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'rotate(-90deg)',
          }}
        >
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={theme.border.medium}
            strokeWidth="2"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={theme.accent.primary}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out',
              filter: `drop-shadow(0 0 8px ${theme.accent.primary})`,
            }}
          />
        </svg>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <span
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: theme.accent.primary,
              lineHeight: '1',
            }}
          >
            {Math.max(0, counter)}
          </span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 'bold',
              color: theme.text.tertiary,
              letterSpacing: '0.05em',
            }}
          >
            SECONDS
          </span>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function DashboardPage() {
  const [username, setUsername] = useState<string>(""); 
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [timestamp, setTimestamp] = useState<string>('');
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('limeDark');
  const [dataMode, setDataMode] = useState<DataMode>('live');
  const theme = THEMES[currentTheme];
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // OpenRouter Analysis States - Using useRef for proper state management
  const analysisArrayRef = useRef<AnalysisData[]>([]);
  const [analysisArrayLength, setAnalysisArrayLength] = useState(0);
  const [counter, setCounter] = useState(10);
  const [geminiResponse, setGeminiResponse] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // User Extraction (Login Logic)
  useEffect(() => {
    const token = Cookies.get("token"); 
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const name =
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
          decoded.email ||
          decoded.sub ||
          "User";
        
        const normalizedUsername = name.toLowerCase(); 
        setUsername(normalizedUsername);
        
      } catch (error) {
        console.error("❌ Invalid token:", error);
      }
    } else {
      console.warn("⚠️ No JWT cookie found.");
    }
  }, []);

  // Handle data update and analysis collection
  const handleDataUpdate = useCallback((data: SensorData) => {
    setSensorData(data);
    setTimestamp(new Date().toLocaleTimeString());
    
    setHistoricalData(prev => [
        ...prev.slice(-59),
        { ...data, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
    ]);

    const newAnalysisData: AnalysisData = { ...data, time: new Date().toISOString() };
    analysisArrayRef.current = [...analysisArrayRef.current, newAnalysisData];
    setAnalysisArrayLength(analysisArrayRef.current.length);
  }, []);

  // Callback to restart the cycle AFTER OpenRouter response is received
  const handleResponseComplete = useCallback(() => {
    console.log("✅ Response received. Restarting cycle...");
    setIsAnalyzing(false);
    analysisArrayRef.current = [];
    setAnalysisArrayLength(0);
    setCounter(10);
  }, []);

  // Start the 10-second countdown and analysis cycle
  const startCountdownCycle = useCallback(() => {
    console.log("🔄 Starting countdown cycle...");
    
    if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
    }

    countdownIntervalRef.current = setInterval(() => {
        setCounter(prev => {
          const newCounter = prev - 1;
          
          if (newCounter === 0 && !isAnalyzing && analysisArrayRef.current.length > 0) {
            console.log("📊 Sending data to OpenRouter:", analysisArrayRef.current.length, "points");
            setIsAnalyzing(true);
            sendToOpenRouter(analysisArrayRef.current, setGeminiResponse, handleResponseComplete);
            return 10;
          }
          
          return newCounter;
        });
    }, 1000);
  }, [isAnalyzing, handleResponseComplete]);

  // Connection Logic (SignalR/Simulation with Fallback)
  useEffect(() => {
    const useSimulatedMode = dataMode === 'simulated' || (!username && dataMode === 'live');

    const cleanup = () => {
        if (simulationIntervalRef.current) {
            clearInterval(simulationIntervalRef.current);
            simulationIntervalRef.current = null;
        }
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }
        if (connection) {
            connection.stop();
            setConnection(null);
            setIsConnected(false);
        }
    };

    cleanup();

    if (useSimulatedMode) {
      setIsConnected(true);
      if (dataMode === 'live' && !username) {
        setSensorData(null); 
        setTimestamp('Awaiting user authentication...');
      } else {
        simulationIntervalRef.current = setInterval(() => {
            const data = generateSimulatedData();
            handleDataUpdate(data);
        }, 1000);

        startCountdownCycle();
      }
    } else {
      const connectToHub = async () => {
        try {
            const hub = new signalR.HubConnectionBuilder()
                .withUrl("https://vitalink20251014200825.azurewebsites.net/sensorhub", {
                    accessTokenFactory: () => Cookies.get("token") || "", 
                })
                .configureLogging(signalR.LogLevel.Information)
                .withAutomaticReconnect()
                .build();
                
            hub.onreconnected(async () => {
                console.log("🔄 Reconnected. Reregistering user.");
                await hub.invoke("RegisterConnection", username);
            });

            hub.on("ReceiveLiveUpdate", (data: SensorData) => {
                handleDataUpdate(data);
            });

            await hub.start();
            setIsConnected(true);
            
            await hub.invoke("RegisterConnection", username); 

            setConnection(hub);
            startCountdownCycle();
        } catch (err) {
            console.error("❌ SignalR connection failed:", err);
            console.log("⚠️ Falling back to Simulated Mode...");
            setIsConnected(false);
            setDataMode('simulated');
        }
      };

      connectToHub();
    }

    return cleanup;
  }, [username, dataMode, handleDataUpdate, startCountdownCycle]);

  // Calculations
  const handleClearData = useCallback(() => {
    setHistoricalData([]);
  }, []);

  const HR_MIN = 60, HR_MAX = 100;
  const SPO2_MIN = 95, SPO2_MAX = 100;
  const TEMP_MIN = 36.5, TEMP_MAX = 37.5;
  const GSR_MAX = 1300; 

  const heartRateStatus = useMemo(() => getHealthStatus(sensorData?.heartRate ?? 0, HR_MIN, HR_MAX), [sensorData?.heartRate]);
  const spo2Status = useMemo(() => getHealthStatus(sensorData?.spo2 ?? 0, SPO2_MIN, SPO2_MAX), [sensorData?.spo2]);
  const tempStatus = useMemo(() => getHealthStatus(sensorData?.temperature ?? 0, TEMP_MIN, TEMP_MAX), [sensorData?.temperature]);
  const gsrValue = sensorData ? sensorData.sweat * 13 : 0;
  const gsrStatus = useMemo<HealthStatus>(() => gsrValue > GSR_MAX ? 'warning' : 'optimal', [gsrValue]);

  const overallHealthStatus = useMemo(() => {
    const statuses = [heartRateStatus, spo2Status, tempStatus, gsrStatus];
    return getOverallHealthStatus(...statuses);
  }, [heartRateStatus, spo2Status, tempStatus, gsrStatus]);

  // Render
  return (
    <div className="relative" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      <GlobalStyles theme={theme} />
      
      <AnimatedBackground theme={theme} />

      <div 
          className="relative z-10" 
          style={{ 
              backgroundColor: theme.background.primary, 
          }}
      >
        
        {/* Header Section */}
        <header 
          className="border-b px-4 sm:px-6 md:px-8 py-8 sm:py-10"
          style={{ 
            borderColor: theme.border.medium,
            backgroundColor: `${theme.background.secondary}dd`, 
            backdropFilter: 'blur(10px)', 
            boxShadow: theme.shadow.soft,
          }}
        >
          <div className="max-w-7xl mx-auto">
            
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              
              <div className="flex-1">
                <h1 
                  className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
                  style={{ color: theme.text.primary, letterSpacing: '0.02em', animation: 'slide-in-fade 0.6s ease-out' }}
                >
                  VitaLink Dashboard
                </h1>
                <p 
                  className="text-sm sm:text-base"
                  style={{ color: theme.text.secondary, letterSpacing: '0.02em', animation: 'slide-in-fade 0.7s ease-out' }}
                >
                  Welcome, <span style={{ color: theme.accent.primary, fontWeight: 'bold' }}>{username || "Guest"}</span> — Real-Time Biometric Monitoring
                </p>
              </div>
              
              <div 
                  className="flex flex-col sm:flex-row gap-3 flex-shrink-0" 
                  style={{ zIndex: 20 }}
              >
                <div className="flex gap-3 justify-end items-center">
                    <StatusIndicator 
                        label="System Status" 
                        status={overallHealthStatus !== 'danger' && overallHealthStatus !== 'warning'}
                        details={overallHealthStatus.toUpperCase()}
                        theme={theme}
                    />
                    <StatusIndicator 
                        label="Connection" 
                        status={dataMode === 'simulated' ? true : isConnected}
                        details={dataMode === 'simulated' ? 'Simulated' : (isConnected ? "Connected" : "Disconnected")}
                        theme={theme}
                    />
                    
                    <button
                        onClick={() => setCurrentTheme(currentTheme === 'limeDark' ? 'blueLight' : 'limeDark')}
                        className="px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all duration-300"
                        style={{
                            backgroundColor: theme.background.tertiary,
                            color: theme.text.secondary,
                            border: `1px solid ${theme.border.medium}`,
                            boxShadow: theme.shadow.soft,
                            animation: 'bounce-in 0.6s ease-out',
                        }}
                    >
                        {currentTheme === 'limeDark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                </div>
                
                <div className="flex gap-3 justify-end items-center">
                    <DataStreamSelector mode={dataMode} onChange={setDataMode} theme={theme} />
                    
                    <button
                        onClick={handleClearData}
                        className="px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all duration-300"
                        style={{
                            backgroundColor: theme.background.tertiary,
                            color: theme.text.secondary,
                            border: `1px solid ${theme.border.medium}`,
                            boxShadow: theme.shadow.soft,
                            animation: 'bounce-in 0.7s ease-out',
                        }}
                    >
                        Clear Data
                    </button>
                </div>
              </div>
            </div>

            <div className="text-right mt-4">
                <p className="text-xs font-medium" style={{ color: theme.text.tertiary }}>
                    Last Update: <span style={{ color: theme.text.secondary }}>{timestamp || 'N/A'}</span>
                </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12">
          
          {/* Metrics Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <MetricCard 
              label="Heart Rate" 
              value={sensorData?.heartRate ?? 0} 
              unit="BPM" 
              status={heartRateStatus} 
              theme={theme}
              min={HR_MIN}
              max={HR_MAX}
            />
            <MetricCard 
              label="Blood Oxygen" 
              value={sensorData?.spo2 ?? 0} 
              unit="%" 
              status={spo2Status} 
              theme={theme}
              min={SPO2_MIN}
              max={SPO2_MAX}
            />
            <MetricCard 
              label="Body Temperature" 
              value={sensorData?.temperature ?? 0} 
              unit="°C" 
              status={tempStatus} 
              theme={theme}
              min={TEMP_MIN}
              max={TEMP_MAX}
            />
            <MetricCard 
              label="GSR Level" 
              value={gsrValue} 
              unit="Ohms" 
              status={gsrStatus} 
              theme={theme}
              min={0}
              max={GSR_MAX}
            />
          </section>

          {/* AI Health Insight Section - Redesigned */}
          <section 
            className="rounded-xl p-8 sm:p-10 border mb-12"
            style={{
                backgroundColor: `${theme.background.secondary}dd`, 
                backdropFilter: 'blur(10px)', 
                borderColor: theme.border.medium,
                boxShadow: theme.shadow.soft, 
                animation: 'slide-in-fade 0.8s ease-out',
            }}
          >
            <h2 
              className="text-2xl sm:text-3xl font-bold mb-8 tracking-tight"
              style={{ 
                color: theme.text.primary, 
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              AI Health Insight
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Left: Circular Countdown */}
              <div className="flex justify-center md:justify-start">
                <CircularCountdown counter={counter} theme={theme} />
              </div>

              {/* Center: Insight Text */}
              <div className="md:col-span-1">
                <p 
                  className="text-base sm:text-lg leading-relaxed"
                  style={{ 
                    color: theme.text.secondary,
                    lineHeight: '1.8',
                    minHeight: '120px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {geminiResponse || "Analyzing biometric patterns... Waiting for the first 10-second data cycle to complete."}
                </p>
              </div>

              {/* Right: Status Info */}
              <div className="flex flex-col justify-center gap-4">
                <div 
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: theme.background.tertiary,
                    border: `1px solid ${theme.border.medium}`,
                  }}
                >
                  <p className="text-xs font-bold uppercase" style={{ color: theme.text.tertiary, marginBottom: '8px' }}>
                    Analysis Status
                  </p>
                  <p style={{ color: theme.accent.primary, fontSize: '14px', fontWeight: 'bold' }}>
                    {isAnalyzing ? 'Processing...' : 'Ready'}
                  </p>
                </div>
                <div 
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: theme.background.tertiary,
                    border: `1px solid ${theme.border.medium}`,
                  }}
                >
                  <p className="text-xs font-bold uppercase" style={{ color: theme.text.tertiary, marginBottom: '8px' }}>
                    Data Points Collected
                  </p>
                  <p style={{ color: theme.accent.primary, fontSize: '14px', fontWeight: 'bold' }}>
                    {analysisArrayLength} / 10
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Charts Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HealthStatusChart historicalData={historicalData} theme={theme} />
            <TemperatureTrendChart historicalData={historicalData} theme={theme} />
            <GSRTrendChart historicalData={historicalData} theme={theme} />
            <AccelerationChart historicalData={historicalData} theme={theme} />
          </section>
        </main>

        {/* Footer */}
        <footer 
            className="border-t px-4 sm:px-6 md:px-8 py-6"
            style={{ 
                borderColor: theme.border.medium,
                backgroundColor: theme.background.primary,
            }}
        >
            <div className="max-w-7xl mx-auto text-center">
                <p className="text-xs" style={{ color: theme.text.tertiary }}>
                    © {new Date().getFullYear()} VitaLink. All rights reserved. Data provided for demonstration purposes.
                </p>
            </div>
        </footer>
      </div>
    </div>
  );
}