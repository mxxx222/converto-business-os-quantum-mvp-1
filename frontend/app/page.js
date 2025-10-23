"use client";

import { useState } from "react";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    email: "",
    name: "",
    company: "",
    phone: "",
    note: "",
    hp: "" // honeypot
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const utm = typeof window !== "undefined" ? window.location.search : "";
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, utm }),
      });

      const data = await response.json();

      if (data.ok) {
        setMessage("Varaus vastaanotettu. Tarkista sähköposti.");
        setForm({ email: "", name: "", company: "", phone: "", note: "", hp: "" });
      } else {
        setMessage("Virhe. Yritä uudelleen.");
      }
    } catch (error) {
      setMessage("Virhe. Yritä uudelleen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      fontFamily: "ui-sans-serif, system-ui",
      background: "linear-gradient(180deg,#F8FAFF 0%,#FFFFFF 100%)",
      minHeight: "100vh"
    }}>
      {/* Header */}
      <header style={{
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #E5E7EB",
        padding: "1rem 0"
      }}>
        <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0B1220", margin: 0 }}>
              Converto™ Business OS
            </h1>
            <nav style={{ display: "flex", gap: "1.5rem" }}>
              <a href="/dashboard" style={{ color: "#6B7280", textDecoration: "none", transition: "color 0.2s" }}>Dashboard</a>
              <a href="/api/health" style={{ color: "#10B981", textDecoration: "none", transition: "color 0.2s" }}>Status</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: "4rem 1rem" }}>
        <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
          {/* Coming Soon Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "2rem",
            background: "linear-gradient(135deg, #0A5FFF, #8B5CF6)",
            color: "white",
            fontSize: "0.825rem",
            fontWeight: "600",
            marginBottom: "2rem"
          }}>
            🚀 Pilotointi • 3–7 arkipäivässä
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: "clamp(1.8rem, 2.5vw, 3rem)",
            fontWeight: "bold",
            color: "#0B1220",
            margin: "0 0 0.75rem 0",
            textAlign: "center"
          }}>
            Converto™ Business OS 2.0
          </h1>

          {/* Subtitle */}
          <p style={{
            color: "#4B5563",
            fontSize: "1.125rem",
            margin: "0.25rem 0 1rem 0",
            textAlign: "center",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            Automatisoi kirjanpito, maksut ja varastonhallinta yhdessä näkymässä
          </p>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} style={{
            background: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "1rem",
            padding: "2rem",
            margin: "2rem auto",
            maxWidth: "760px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
            alignItems: "end"
          }}>
            <input
              type="email"
              placeholder="Sähköposti *"
              required
              value={form.email}
              onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #E5E7EB",
                borderRadius: "0.75rem",
                fontFamily: "inherit",
                fontSize: "1rem"
              }}
            />
            <input
              type="text"
              placeholder="Nimi"
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #E5E7EB",
                borderRadius: "0.75rem",
                fontFamily: "inherit",
                fontSize: "1rem"
              }}
            />
            <input
              type="text"
              placeholder="Yritys"
              value={form.company}
              onChange={(e) => setForm(f => ({ ...f, company: e.target.value }))}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #E5E7EB",
                borderRadius: "0.75rem",
                fontFamily: "inherit",
                fontSize: "1rem"
              }}
            />
            <input
              type="tel"
              placeholder="Puhelin"
              value={form.phone}
              onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #E5E7EB",
                borderRadius: "0.75rem",
                fontFamily: "inherit",
                fontSize: "1rem"
              }}
            />
            <textarea
              placeholder="Lisätiedot (valinnainen)"
              rows={3}
              value={form.note}
              onChange={(e) => setForm(f => ({ ...f, note: e.target.value }))}
              style={{
                gridColumn: "1 / -1",
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #E5E7EB",
                borderRadius: "0.75rem",
                fontFamily: "inherit",
                fontSize: "1rem",
                resize: "vertical"
              }}
            />
            {/* Honeypot */}
            <input
              name="website"
              autoComplete="off"
              tabIndex={-1}
              value={form.hp}
              onChange={(e) => setForm(f => ({ ...f, hp: e.target.value }))}
              style={{ display: "none" }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.875rem 1.25rem",
                borderRadius: "0.75rem",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "600",
                background: "#0A5FFF",
                color: "white",
                fontSize: "1rem",
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? "Lähetetään..." : "Lähetä ilmoittautuminen"}
            </button>
            {message && (
              <div style={{
                gridColumn: "1 / -1",
                padding: "0.75rem",
                color: message.includes("Virhe") ? "#DC2626" : "#059669",
                fontSize: "0.9rem"
              }}>
                {message}
              </div>
            )}
          </form>

          {/* USP Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
            marginTop: "2rem"
          }}>
            <div style={{
              border: "1px solid #E5E7EB",
              borderRadius: "1rem",
              padding: "1rem"
            }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <b style={{ color: "#0B1220" }}>Kirjanpito ilman manuaalia</b>
              </div>
              <p style={{ color: "#4B5563", margin: "0.25rem 0 1rem 0", fontSize: "0.9rem" }}>
                Ostolaskut, kuitit ja ALV automaattisesti. Vähemmän virheitä. Nopeampi kuukausi.
              </p>
            </div>

            <div style={{
              border: "1px solid #E5E7EB",
              borderRadius: "1rem",
              padding: "1rem"
            }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <b style={{ color: "#0B1220" }}>Maksut ja kassa yhtenä virrana</b>
              </div>
              <p style={{ color: "#4B5563", margin: "0.25rem 0 1rem 0", fontSize: "0.9rem" }}>
                Stripe, verkkokauppa ja POS samaan näkymään. Päivän kate selkeästi.
              </p>
            </div>

            <div style={{
              border: "1px solid #E5E7EB",
              borderRadius: "1rem",
              padding: "1rem"
            }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <b style={{ color: "#0B1220" }}>Varasto ja automaatiot</b>
              </div>
              <p style={{ color: "#4B5563", margin: "0.25rem 0 1rem 0", fontSize: "0.9rem" }}>
                Tuotteet, saldo ja hälytykset. N8n-reitit ja webhookit valmiina.
              </p>
            </div>
          </div>

          {/* Support Info */}
          <div style={{
            marginTop: "1.25rem",
            color: "#6B7280",
            textAlign: "center",
            fontSize: "0.9rem"
          }}>
            Tuki +358 40 123 4567 • Pilotit 3–7 arkipäivässä
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: "#111827",
        color: "#6B7280",
        fontSize: "0.9rem",
        padding: "2rem 0"
      }}>
        <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "0 2rem", textAlign: "center" }}>
          © {new Date().getFullYear()} Converto Solutions Oy
        </div>
      </footer>
    </main>
  );
}
