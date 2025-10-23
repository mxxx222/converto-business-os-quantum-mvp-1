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
        padding: "1rem 0",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0B1220", margin: 0 }}>
              Converto™ Business OS
            </h1>
            <nav style={{ display: "flex", gap: "1.5rem" }}>
              <a href="#pricing" style={{ color: "#6B7280", textDecoration: "none", transition: "color 0.2s" }}>Hinnoittelu</a>
              <a href="#solutions" style={{ color: "#6B7280", textDecoration: "none", transition: "color 0.2s" }}>Ratkaisut</a>
              <a href="/dashboard" style={{ color: "#6B7280", textDecoration: "none", transition: "color 0.2s" }}>Dashboard</a>
              <a href="/api/health" style={{ color: "#10B981", textDecoration: "none", transition: "color 0.2s" }}>Status</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: "4rem 1rem" }}>
        <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
          {/* Trust Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "2rem",
            background: "#F3F4F6",
            color: "#374151",
            fontSize: "0.825rem",
            fontWeight: "500",
            marginBottom: "2rem"
          }}>
            🛡️ Tietoturva ja Eurooppa-hosting • Toimitus 3–7 arkipäivässä
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: "clamp(2.5rem, 4vw, 4rem)",
            fontWeight: "bold",
            color: "#0B1220",
            margin: "0 0 1rem 0",
            textAlign: "center",
            lineHeight: "1.1"
          }}>
            Automaatio, joka vähentää käsityötä ja kasvattaa kassavirtaa
          </h1>

          {/* Subtitle */}
          <p style={{
            color: "#4B5563",
            fontSize: "1.25rem",
            margin: "0.5rem 0 2rem 0",
            textAlign: "center",
            maxWidth: "700px",
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: "1.6"
          }}>
            Yhdistä kuitit, laskutus, raportointi ja hyväksynnät yhteen näkymään. Tunnit pois rutiineista, eurot esiin.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "4rem",
            maxWidth: "400px",
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            <button
              onClick={() => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                width: "100%",
                padding: "1rem 2rem",
                borderRadius: "0.75rem",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                background: "#0A5FFF",
                color: "white",
                fontSize: "1.125rem",
                transition: "all 0.2s",
                boxShadow: "0 4px 14px 0 rgba(10, 95, 255, 0.25)"
              }}
              onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
            >
              Aloita pilotti
            </button>
            <button
              onClick={() => window.open('https://calendly.com/converto-demo/20min', '_blank')}
              style={{
                width: "100%",
                padding: "1rem 2rem",
                borderRadius: "0.75rem",
                border: "2px solid #E5E7EB",
                cursor: "pointer",
                fontWeight: "600",
                background: "transparent",
                color: "#374151",
                fontSize: "1.125rem",
                transition: "all 0.2s"
              }}
            >
              Varaa 20 min demo
            </button>
          </div>

          {/* Value Props */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
            marginTop: "4rem"
          }}>
            <div style={{
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "1rem",
              padding: "2rem",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
            }}>
              <div style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "0.75rem",
                background: "linear-gradient(135deg, #10B981, #059669)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
                fontSize: "1.5rem"
              }}>
                📊
              </div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#0B1220",
                margin: "0 0 1rem 0"
              }}>
                Vähemmän manuaalia
              </h3>
              <p style={{
                color: "#4B5563",
                margin: "0",
                lineHeight: "1.6"
              }}>
                Poimi kuitit automaattisesti, täsmäytä ja arkistoi. Säästät 8–12 h/kk per tiimi.
              </p>
            </div>

            <div style={{
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "1rem",
              padding: "2rem",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
            }}>
              <div style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "0.75rem",
                background: "linear-gradient(135deg, #3B82F6, #2563EB)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
                fontSize: "1.5rem"
              }}>
                💰
              </div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#0B1220",
                margin: "0 0 1rem 0"
              }}>
                Nopeampi laskutus
              </h3>
              <p style={{
                color: "#4B5563",
                margin: "0",
                lineHeight: "1.6"
              }}>
                Luo, lähetä ja seuranta yhdessä paikassa. Raha sisään nopeammin.
              </p>
            </div>

            <div style={{
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "1rem",
              padding: "2rem",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
            }}>
              <div style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "0.75rem",
                background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
                fontSize: "1.5rem"
              }}>
                📈
              </div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#0B1220",
                margin: "0 0 1rem 0"
              }}>
                Selkeä tilannekuva
              </h3>
              <p style={{
                color: "#4B5563",
                margin: "0",
                lineHeight: "1.6"
              }}>
                Reaaliaikaiset raportit ja hälytykset. Päätökset dataan nojaten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "4rem 1rem", background: "#F9FAFB" }}>
        <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
          <h2 style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#0B1220",
            textAlign: "center",
            margin: "0 0 3rem 0"
          }}>
            Näin se toimii
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem"
          }}>
            <div style={{
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "1rem",
              padding: "2rem",
              textAlign: "center"
            }}>
              <div style={{
                width: "4rem",
                height: "4rem",
                borderRadius: "50%",
                background: "#0A5FFF",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                fontWeight: "bold",
                margin: "0 auto 1.5rem"
              }}>
                1
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0B1220", margin: "0 0 1rem 0" }}>
                Kytke sähköposti ja pankkiyhteys
              </h3>
              <p style={{ color: "#4B5563", margin: "0", lineHeight: "1.6" }}>
                Yhdistämme järjestelmäsi turvallisesti olemassa oleviin työkaluihin.
              </p>
            </div>

            <div style={{
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "1rem",
              padding: "2rem",
              textAlign: "center"
            }}>
              <div style={{
                width: "4rem",
                height: "4rem",
                borderRadius: "50%",
                background: "#0A5FFF",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                fontWeight: "bold",
                margin: "0 auto 1.5rem"
              }}>
                2
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0B1220", margin: "0 0 1rem 0" }}>
                Tuo tuotteet ja asiakkaat
              </h3>
              <p style={{ color: "#4B5563", margin: "0", lineHeight: "1.6" }}>
                Synkronoidaan tiedot automaattisesti tai tuotavana CSV-muodossa.
              </p>
            </div>

            <div style={{
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "1rem",
              padding: "2rem",
              textAlign: "center"
            }}>
              <div style={{
                width: "4rem",
                height: "4rem",
                borderRadius: "50%",
                background: "#0A5FFF",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                fontWeight: "bold",
                margin: "0 auto 1.5rem"
              }}>
                3
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0B1220", margin: "0 0 1rem 0" }}>
                Ota käyttöön kuitti- ja laskuautomaatio
              </h3>
              <p style={{ color: "#4B5563", margin: "0", lineHeight: "1.6" }}>
                Aktivoidaan työnkulut vaiheittain tarpeidesi mukaan.
              </p>
            </div>

            <div style={{
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "1rem",
              padding: "2rem",
              textAlign: "center"
            }}>
              <div style={{
                width: "4rem",
                height: "4rem",
                borderRadius: "50%",
                background: "#0A5FFF",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                fontWeight: "bold",
                margin: "0 auto 1.5rem"
              }}>
                4
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0B1220", margin: "0 0 1rem 0" }}>
                Näe tulokset dashboardissa
              </h3>
              <p style={{ color: "#4B5563", margin: "0", lineHeight: "1.6" }}>
                Seuraa säästöjä, kassavirtaa ja automaation tehokkuutta reaaliajassa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proof Section */}
      <section style={{ padding: "4rem 1rem" }}>
        <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg, #F3F4F6, #FFFFFF)",
            border: "1px solid #E5E7EB",
            borderRadius: "1rem",
            padding: "3rem",
            textAlign: "center",
            marginBottom: "4rem"
          }}>
            <blockquote style={{
              fontSize: "1.25rem",
              fontStyle: "italic",
              color: "#4B5563",
              margin: "0 0 2rem 0",
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto"
            }}>
              "Ensimmäinen kuukausi palautti 40 h manuaalia ja nopeutti kassaa 9 päivää."
            </blockquote>
            <cite style={{
              fontSize: "0.9rem",
              color: "#6B7280",
              fontWeight: "500"
            }}>
              — SaaS-yrityksen toimitusjohtaja, Helsinki
            </cite>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section style={{ padding: "4rem 1rem", background: "#F9FAFB" }}>
        <div style={{ maxWidth: "1040px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#0B1220",
            margin: "0 0 2rem 0"
          }}>
            Integraatiot
          </h2>
          <p style={{
            color: "#4B5563",
            fontSize: "1.125rem",
            margin: "0 0 3rem 0",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            Toimii sähköpostin, pankkiyhteyksien, kirjanpidon ja verkkokaupan kanssa. Kytketään tarpeen mukaan.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "2rem",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            {["📧 Sähköposti", "🏦 Pankki/SEPA", "📊 Kirjanpito", "🛒 Verkkokauppa"].map((integration, i) => (
              <div key={i} style={{
                background: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                color: "#374151"
              }}>
                {integration}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="register-form" style={{ padding: "4rem 1rem" }}>
        <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
          <div style={{
            background: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "1rem",
            padding: "3rem",
            maxWidth: "600px",
            margin: "0 auto",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
          }}>
            <h2 style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#0B1220",
              textAlign: "center",
              margin: "0 0 2rem 0"
            }}>
              Valmis tuotantoon 3–7 arkipäivässä
            </h2>

            <form onSubmit={handleSubmit} style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
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
                  padding: "0.875rem",
                  border: "1px solid #E5E7EB",
                  borderRadius: "0.5rem",
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
                  padding: "0.875rem",
                  border: "1px solid #E5E7EB",
                  borderRadius: "0.5rem",
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
                  padding: "0.875rem",
                  border: "1px solid #E5E7EB",
                  borderRadius: "0.5rem",
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
                  padding: "0.875rem",
                  border: "1px solid #E5E7EB",
                  borderRadius: "0.5rem",
                  fontFamily: "inherit",
                  fontSize: "1rem"
                }}
              />
              <textarea
                placeholder="Kerro lyhyesti mitä haluat automatisoida (esim. kuitit, toistuvat laskut, viivehälytykset, raportit)"
                rows={3}
                value={form.note}
                onChange={(e) => setForm(f => ({ ...f, note: e.target.value }))}
                style={{
                  gridColumn: "1 / -1",
                  width: "100%",
                  padding: "0.875rem",
                  border: "1px solid #E5E7EB",
                  borderRadius: "0.5rem",
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
                  gridColumn: "1 / -1",
                  padding: "1rem 2rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  background: "#0A5FFF",
                  color: "white",
                  fontSize: "1.125rem",
                  opacity: loading ? 0.6 : 1,
                  transition: "all 0.2s"
                }}
              >
                {loading ? "Lähetetään..." : "Lähetä ilmoittautuminen"}
              </button>
              {message && (
                <div style={{
                  gridColumn: "1 / -1",
                  padding: "1rem",
                  color: message.includes("Virhe") ? "#DC2626" : "#059669",
                  fontSize: "0.9rem",
                  textAlign: "center",
                  background: message.includes("Virhe") ? "#FEF2F2" : "#F0FDF4",
                  borderRadius: "0.5rem"
                }}>
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: "#111827",
        color: "#6B7280",
        fontSize: "0.9rem",
        padding: "3rem 1rem 1rem"
      }}>
        <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
            marginBottom: "2rem"
          }}>
            <div>
              <h3 style={{ color: "white", fontSize: "1.125rem", fontWeight: "bold", margin: "0 0 1rem 0" }}>
                Converto™ Business OS
              </h3>
              <p style={{ margin: "0", lineHeight: "1.6" }}>
                Automaatio, joka vähentää käsityötä ja kasvattaa kassavirtaa.
              </p>
            </div>
            <div>
              <h4 style={{ color: "white", fontSize: "1rem", fontWeight: "600", margin: "0 0 1rem 0" }}>
                Tuotteet
              </h4>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                <li style={{ marginBottom: "0.5rem" }}><a href="#pricing" style={{ color: "#6B7280", textDecoration: "none" }}>Hinnoittelu</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="#solutions" style={{ color: "#6B7280", textDecoration: "none" }}>Ratkaisut</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="/dashboard" style={{ color: "#6B7280", textDecoration: "none" }}>Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: "white", fontSize: "1rem", fontWeight: "600", margin: "0 0 1rem 0" }}>
                Tuki
              </h4>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                <li style={{ marginBottom: "0.5rem" }}><a href="tel:+358401234567" style={{ color: "#6B7280", textDecoration: "none" }}>+358 40 123 4567</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="mailto:hello@converto.fi" style={{ color: "#6B7280", textDecoration: "none" }}>hello@converto.fi</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="/api/health" style={{ color: "#6B7280", textDecoration: "none" }}>Järjestelmän tila</a></li>
              </ul>
            </div>
          </div>

          <div style={{
            borderTop: "1px solid #374151",
            paddingTop: "2rem",
            textAlign: "center"
          }}>
            <p style={{ margin: "0" }}>
              © {new Date().getFullYear()} Converto Solutions Oy • Kaikki oikeudet pidätetään
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
