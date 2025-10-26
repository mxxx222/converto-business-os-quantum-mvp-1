// Force the page to be rendered dynamically so Vercel cannot treat the build as
// a static export, which previously resulted in 404 responses in production.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui", textAlign: "center" }}>
      <h1>Converto Dashboard</h1>
      <p>Business OS Dashboard - Coming Soon</p>
    </div>
  );
}
