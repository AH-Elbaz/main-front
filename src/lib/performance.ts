/**
 * Performance Monitoring Utilities
 * Web Vitals tracking for Next.js application
 */

import type { Metric } from 'web-vitals';

// Report Web Vitals to analytics
export function reportWebVitals(metric: Metric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics
    if (typeof window !== 'undefined') {
      const windowWithGtag = window as typeof window & { gtag?: (...args: unknown[]) => void };
      if (windowWithGtag.gtag) {
        windowWithGtag.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
        });
      }
    }

    // Example: Send to custom analytics endpoint
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    });

    // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/vitals', body);
    } else {
      fetch('/api/analytics/vitals', {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
        keepalive: true,
      }).catch(console.error);
    }
  }
}

// Performance observer for custom metrics
export function observePerformance() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  try {
    // Observe Long Tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn('Long task detected:', entry.duration, 'ms');
        }
      }
    });
    longTaskObserver.observe({ entryTypes: ['longtask'] });

    // Observe Layout Shifts
    const layoutShiftObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
        if (layoutShiftEntry.hadRecentInput) continue;
        console.log('Layout shift:', layoutShiftEntry.value);
      }
    });
    layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    console.error('Performance observer error:', e);
  }
}

// Image loading performance tracker
export function trackImageLoad(src: string, startTime: number) {
  const loadTime = performance.now() - startTime;
  console.log(`Image loaded: ${src} in ${loadTime.toFixed(2)}ms`);
  
  if (loadTime > 2000) {
    console.warn(`Slow image load detected: ${src}`);
  }
}

// Route change performance
export function trackRouteChange(url: string) {
  const navigationStart = performance.now();
  
  return () => {
    const navigationEnd = performance.now();
    const duration = navigationEnd - navigationStart;
    console.log(`Route change to ${url} took ${duration.toFixed(2)}ms`);
  };
}
