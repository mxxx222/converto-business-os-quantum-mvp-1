/**
 * Notifications Settings Page
 * Configure reminder integrations (Notion, WhatsApp)
 */

"use client";
import { useState } from "react";

export default function NotificationsSettings() {
  const [notionDb, setNotionDb] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function saveNotion() {
    setLoading(true);
    setMessage("");
    
    try {
      const response = await fetch("/api/v1/reminders/integrations/notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ database_id: notionDb })
      });
      
      if (response.ok) {
        setMessage("✅ Notion-kalenteri tallennettu!");
      } else {
        setMessage("❌ Virhe tallennuksessa");
      }
    } catch (error) {
      setMessage("❌ Verkkovirhe");
    } finally {
      setLoading(false);
    }
  }

  async function testWhatsApp() {
    setLoading(true);
    setMessage("");
    
    try {
      const response = await fetch("/api/v1/reminders/test/whatsapp", {
        method: "POST"
      });
      
      if (response.ok) {
        setMessage("✅ WhatsApp-testiviesti lähetetty!");
      } else {
        const data = await response.json();
        setMessage(`❌ WhatsApp-virhe: ${data.detail}`);
      }
    } catch (error) {
      setMessage("❌ Verkkovirhe");
    } finally {
      setLoading(false);
    }
  }

  async function testNotion() {
    setLoading(true);
    setMessage("");
    
    try {
      const response = await fetch("/api/v1/reminders/test/notion", {
        method: "POST"
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ Notion-tapahtuma luotu! ${data.url || ""}`);
      } else {
        const data = await response.json();
        setMessage(`❌ Notion-virhe: ${data.detail}`);
      }
    } catch (error) {
      setMessage("❌ Verkkovirhe");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Muistutukset – Integraatiot</h1>
        <p className="text-gray-600 text-sm">
          Konfiguroi Notion-kalenteri ja WhatsApp-ilmoitukset älymuistutuksille.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.startsWith("✅") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
        }`}>
          {message}
        </div>
      )}

      {/* Notion Calendar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-1">📅 Notion Calendar</h2>
          <p className="text-sm text-gray-600">
            Muistutukset lisätään automaattisesti Notion-kalenteriin.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Notion Calendar Database ID
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={notionDb}
            onChange={(e) => setNotionDb(e.target.value)}
            placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          />
          <p className="text-xs text-gray-500">
            Löydät tämän Notion-tietokannan URL:sta tai jakamalla tietokannan.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={saveNotion}
            disabled={loading || !notionDb}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Tallennetaan..." : "Tallenna"}
          </button>
          <button
            onClick={testNotion}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Testaa Notion
          </button>
        </div>
      </div>

      {/* WhatsApp */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-1">💬 WhatsApp</h2>
          <p className="text-sm text-gray-600">
            Vastaanota muistutukset suoraan WhatsAppiin.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
          <p className="font-medium">Vaadittavat ympäristömuuttujat (.env):</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li><code>WA_PROVIDER</code> = meta tai twilio</li>
            <li><code>WA_META_TOKEN</code> (Meta) tai <code>TWILIO_SID</code> (Twilio)</li>
            <li><code>WA_META_PHONE_ID</code> (Meta) tai <code>TWILIO_TOKEN</code> (Twilio)</li>
            <li><code>WA_TO_PHONE</code> = +358XXXXXXXXX</li>
          </ul>
        </div>

        <button
          onClick={testWhatsApp}
          disabled={loading}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Lähetetään..." : "Lähetä testiviesti"}
        </button>
      </div>

      {/* Setup Guide */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 space-y-3">
        <h3 className="font-semibold text-blue-900">📖 Pika-asennusohje</h3>
        
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>1. Notion Calendar:</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Luo Notion-tietokanta kalenterinäkymällä</li>
            <li>Lisää kentät: Name (Title), Date (Date), Status (Select)</li>
            <li>Jaa integraatiolle (Converto Business OS)</li>
            <li>Kopioi database ID URL:sta</li>
          </ol>

          <p className="pt-2"><strong>2. WhatsApp (Meta):</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Rekisteröidy: <a href="https://developers.facebook.com" target="_blank" className="underline">Meta for Developers</a></li>
            <li>Luo WhatsApp Business App</li>
            <li>Hanki Access Token ja Phone Number ID</li>
            <li>Lisää .env-tiedostoon</li>
          </ol>

          <p className="pt-2"><strong>3. WhatsApp (Twilio):</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Rekisteröidy: <a href="https://www.twilio.com/whatsapp" target="_blank" className="underline">Twilio WhatsApp</a></li>
            <li>Hanki Account SID ja Auth Token</li>
            <li>Aktivoi WhatsApp Sandbox</li>
            <li>Lisää .env-tiedostoon</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

