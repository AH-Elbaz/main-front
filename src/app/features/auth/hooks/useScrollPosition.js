// useScrollPosition.js

import { useState, useEffect } from 'react';

/**
 * Hook مخصص لتتبع موضع التمرير العمودي (Scroll Y Position) للصفحة.
 * @returns {number} - موضع التمرير الحالي.
 */
export const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // دالة المعالجة التي يتم استدعاؤها عند التمرير
    const handleScroll = () => {
      // تحديث حالة scrollY بموضع التمرير الحالي
      setScrollY(window.scrollY);
    };

    // إضافة مستمع لحدث التمرير عند تحميل المكون
    window.addEventListener('scroll', handleScroll, { passive: true });

    // إزالة مستمع الحدث عند إزالة المكون (Cleanup)
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // يشتغل مرة واحدة عند التحميل

  return scrollY;
};