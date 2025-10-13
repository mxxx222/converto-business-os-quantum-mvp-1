"""
Report Generation Service
PDF and CSV reports without external integrations
"""

import os
import csv
import io
from datetime import datetime, timedelta
from typing import List, Dict, Any
from pathlib import Path


def generate_vat_csv(tenant_id: str, month: str) -> bytes:
    """
    Generate VAT report as CSV
    
    Args:
        tenant_id: Tenant ID
        month: Month in YYYY-MM format
        
    Returns:
        CSV bytes
    """
    # Mock data (replace with actual DB query)
    data = [
        {"Date": "2025-10-01", "Vendor": "K-Market", "Amount": 34.20, "VAT_Rate": 14.0, "VAT_Amount": 4.20},
        {"Date": "2025-10-05", "Vendor": "Shell", "Amount": 65.90, "VAT_Rate": 24.0, "VAT_Amount": 12.78},
        {"Date": "2025-10-12", "Vendor": "Ravintola", "Amount": 25.90, "VAT_Rate": 14.0, "VAT_Amount": 3.21},
    ]
    
    # Generate CSV
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=["Date", "Vendor", "Amount", "VAT_Rate", "VAT_Amount"])
    writer.writeheader()
    writer.writerows(data)
    
    return output.getvalue().encode("utf-8")


def generate_vat_pdf(tenant_id: str, month: str) -> bytes:
    """
    Generate VAT report as PDF
    
    Args:
        tenant_id: Tenant ID
        month: Month in YYYY-MM format
        
    Returns:
        PDF bytes
    """
    # For MVP: Use HTML to PDF conversion
    # Options: weasyprint, wkhtmltopdf, or reportlab
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; }}
            h1 {{ color: #111827; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
            th, td {{ border: 1px solid #e5e7eb; padding: 8px; text-align: left; }}
            th {{ background: #f3f4f6; }}
            .total {{ font-weight: bold; background: #fef3c7; }}
        </style>
    </head>
    <body>
        <h1>ALV-raportti {month}</h1>
        <p><strong>Yritys:</strong> {tenant_id}</p>
        <p><strong>Raportti luotu:</strong> {datetime.now().strftime("%d.%m.%Y %H:%M")}</p>
        
        <table>
            <thead>
                <tr>
                    <th>Päivä</th>
                    <th>Kauppias</th>
                    <th>Summa (€)</th>
                    <th>ALV-%</th>
                    <th>ALV (€)</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>01.10.2025</td><td>K-Market</td><td>34,20</td><td>14%</td><td>4,20</td></tr>
                <tr><td>05.10.2025</td><td>Shell</td><td>65,90</td><td>24%</td><td>12,78</td></tr>
                <tr><td>12.10.2025</td><td>Ravintola</td><td>25,90</td><td>14%</td><td>3,21</td></tr>
                <tr class="total"><td colspan="2">Yhteensä</td><td>126,00</td><td></td><td>20,19</td></tr>
            </tbody>
        </table>
        
        <p style="margin-top:40px;color:#6b7280;font-size:12px;">
            Luotu automaattisesti Converto™ Business OS:lla
        </p>
    </body>
    </html>
    """
    
    # For MVP: Return HTML (can be printed to PDF from browser)
    # For production: Use weasyprint or wkhtmltopdf
    return html.encode("utf-8")


def generate_ical_reminders(tenant_id: str) -> str:
    """
    Generate iCal file with reminders (ALV deadlines, etc.)
    
    Args:
        tenant_id: Tenant ID
        
    Returns:
        iCal format string
    """
    # Calculate next VAT deadline (12th of next month)
    now = datetime.now()
    next_month = now.month % 12 + 1
    next_year = now.year + (1 if now.month == 12 else 0)
    deadline = datetime(next_year, next_month, 12, 9, 0)
    
    ical = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Converto Business OS//FI
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Converto Muistutukset
X-WR-TIMEZONE:Europe/Helsinki
BEGIN:VEVENT
DTSTART:{deadline.strftime("%Y%m%dT%H%M%S")}
DTEND:{deadline.strftime("%Y%m%dT%H%M%S")}
DTSTAMP:{now.strftime("%Y%m%dT%H%M%S")}
UID:{tenant_id}-vat-{deadline.strftime("%Y%m")}@converto.fi
CREATED:{now.strftime("%Y%m%dT%H%M%S")}
DESCRIPTION:Muista tehdä ALV-ilmoitus kuukaudelta {now.strftime("%Y-%m")}
LAST-MODIFIED:{now.strftime("%Y%m%dT%H%M%S")}
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:ALV-ilmoitus {now.strftime("%Y-%m")}
TRANSP:OPAQUE
BEGIN:VALARM
TRIGGER:-P1D
DESCRIPTION:ALV-ilmoitus huomenna
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR
"""
    
    return ical.strip()


def create_full_export_zip(tenant_id: str) -> Path:
    """
    Create complete data export (database + files + metadata)
    
    Returns ZIP with:
    - database.sql
    - files.tar.gz
    - meta.json
    - calendar.ics
    - reports/ (PDF/CSV)
    """
    import zipfile
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    export_file = BACKUP_DIR / f"{tenant_id}_export_{timestamp}.zip"
    
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    
    with zipfile.ZipFile(export_file, "w", zipfile.ZIP_DEFLATED) as zipf:
        # 1. Metadata
        metadata = {
            "tenant_id": tenant_id,
            "export_date": datetime.now().isoformat(),
            "version": "2.0.0",
            "format": "converto_export_standalone_v2",
            "includes": ["database", "files", "calendar", "reports"]
        }
        zipf.writestr("meta.json", json.dumps(metadata, indent=2))
        
        # 2. Database dump (stub for MVP)
        zipf.writestr("database.sql", "-- Database dump placeholder")
        
        # 3. iCal reminders
        ical = generate_ical_reminders(tenant_id)
        zipf.writestr("calendar.ics", ical)
        
        # 4. Sample reports
        vat_csv = generate_vat_csv(tenant_id, datetime.now().strftime("%Y-%m"))
        zipf.writestr("reports/vat_report.csv", vat_csv)
        
        vat_pdf = generate_vat_pdf(tenant_id, datetime.now().strftime("%Y-%m"))
        zipf.writestr("reports/vat_report.html", vat_pdf)
    
    return export_file

