#!/usr/bin/env python3
"""Send the Edalkaup daily-sync summary by email via Resend.

Reads sync output from stdin, parses the summary numbers, and emails them.
Secrets/config from ~/.hermes/.env:
  RESEND_API_KEY   (required)
  EDALKAUP_EMAIL_TO    (optional, default sigurdur@edalkaup.is)
  EDALKAUP_EMAIL_FROM  (optional, default 'Eðalkaup Vefur <fyrirspurn@edalkaup.is>')

Usage:
  python3 scripts/sync_inventory.py | python3 scripts/email_summary.py
"""
import os
import re
import sys
from datetime import date
from pathlib import Path

import requests


def load_env() -> dict:
    p = Path(os.path.expanduser("~/.hermes/.env"))
    out = {}
    if p.exists():
        for line in p.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                out[k.strip()] = v.strip().strip('"').strip("'")
    return out


def grab(pattern: str, text: str, default: str = "?") -> str:
    m = re.search(pattern, text)
    return m.group(1).strip() if m else default


def main():
    raw = sys.stdin.read()
    print(raw)  # echo so cron logs still capture it

    env = load_env()
    api_key = env.get("RESEND_API_KEY")
    to_addr = env.get("EDALKAUP_EMAIL_TO", "sigurdur@edalkaup.is")
    from_addr = env.get("EDALKAUP_EMAIL_FROM", "Eðalkaup Vefur <fyrirspurn@edalkaup.is>")

    if not api_key:
        print("\n[email_summary] RESEND_API_KEY not set in ~/.hermes/.env — skipping email.")
        return

    added = grab(r"New cars added\s*:\s*(\d+)", raw)
    sold = grab(r"Marked sold\s*:\s*(\d+)", raw)
    scanned = grab(r"Candidates scanned\s*:\s*(\d+)", raw)
    today = date.today().isoformat()

    error_flag = ("Traceback" in raw) or (scanned == "0") or ("error" in raw.lower() and "fetch error" in raw.lower())

    subject = f"Eðalkaup dagleg samstilling — {today}"
    if error_flag:
        subject = "⚠️ " + subject

    html = f"""
      <div style="font-family:system-ui,Arial,sans-serif;max-width:560px">
        <h2 style="margin-bottom:4px">Eðalkaup — dagleg bílasamstilling</h2>
        <p style="color:#666;margin-top:0">{today}</p>
        <table style="border-collapse:collapse;font-size:15px">
          <tr><td style="padding:6px 16px 6px 0">🆕 Nýir bílar (drög til verðlagningar)</td>
              <td style="font-weight:bold">{added}</td></tr>
          <tr><td style="padding:6px 16px 6px 0">✅ Merktir seldir (faldir)</td>
              <td style="font-weight:bold">{sold}</td></tr>
          <tr><td style="padding:6px 16px 6px 0">🔎 Bílar skoðaðir</td>
              <td style="font-weight:bold">{scanned}</td></tr>
        </table>
        <p style="margin-top:16px">
          Skoðaðu drögin í stjórnborðinu, settu verð (ISK) og birtu þá:
          <br><a href="https://edalkaup-web.vercel.app/stjorn" style="color:#d97706">edalkaup-web.vercel.app/stjorn</a>
        </p>
        {"<p style='color:#b91c1c'><strong>⚠️ Mögulegt vandamál:</strong> samstillingin skilaði villu eða engum bílum. Athugaðu log.</p>" if error_flag else ""}
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
        <pre style="font-size:11px;color:#888;white-space:pre-wrap">{raw[-1500:]}</pre>
      </div>
    """

    resp = requests.post(
        "https://api.resend.com/emails",
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={"from": from_addr, "to": [to_addr], "subject": subject, "html": html},
        timeout=30,
    )
    if resp.status_code in (200, 201):
        print(f"\n[email_summary] Email sent to {to_addr} (id {resp.json().get('id','?')}).")
    else:
        print(f"\n[email_summary] Resend error {resp.status_code}: {resp.text[:300]}")


if __name__ == "__main__":
    main()
