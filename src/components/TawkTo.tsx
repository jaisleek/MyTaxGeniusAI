import React, { useEffect } from 'react';

export default function TawkTo() {
  const propertyId = import.meta.env.VITE_TAWKTO_PROPERTY_ID || '1234567890';
  const widgetId = import.meta.env.VITE_TAWKTO_WIDGET_ID || 'default';

  useEffect(() => {
    if ((window as any).Tawk_API) return;

    var Tawk_API: any = Tawk_API || {}, Tawk_LoadStart = new Date();
    (window as any).Tawk_API = Tawk_API;

    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    if (s0 && s0.parentNode) {
        s0.parentNode.insertBefore(s1, s0);
    } else {
        document.head.appendChild(s1);
    }
  }, [propertyId, widgetId]);

  return null;
}
