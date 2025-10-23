import React from 'react';

export default function DashboardPage(): JSX.Element {
  return (
    <main style={{ padding: 24 }}>
      <h1>Converto — Dashboard (placeholder)</h1>
      <p>Rakennetaan uudelleen komponentti kerrallaan. Tämä sivu on tilapäinen.</p>
      <div style={{ marginTop: 20 }}>
        <a
          href="/selko/ocr"
          style={{
            marginRight: 16,
            padding: "8px 16px",
            backgroundColor: "#3b82f6",
            color: "white",
            textDecoration: "none",
            borderRadius: 4,
          }}
        >
          OCR Kuittiskannaus
        </a>
        <a
          href="/billing"
          style={{
            padding: "8px 16px",
            backgroundColor: "#10b981",
            color: "white",
            textDecoration: "none",
            borderRadius: 4,
          }}
        >
          Hinnoittelu
        </a>
      </div>
    </main>
  );
}
