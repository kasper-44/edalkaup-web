#!/usr/bin/env python3
"""Shared Supabase + env helpers for the Edalkaup pipeline.

Reads secrets from ~/.hermes/.env (AUTO_DEV_API_KEY, SUPABASE_SERVICE_ROLE_KEY).
Never hard-code keys in committed files.
"""
import os
import re
from pathlib import Path

import requests

SUPABASE_URL = "https://fakjyfokweehxsonfbez.supabase.co"
TABLE = "cars"


def load_env() -> dict:
    """Load KEY=VALUE pairs from ~/.hermes/.env (quotes/whitespace stripped)."""
    env_path = Path(os.path.expanduser("~/.hermes/.env"))
    out = {}
    if not env_path.exists():
        return out
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        out[k.strip()] = v.strip().strip('"').strip("'")
    return out


_ENV = load_env()
AUTO_DEV_API_KEY = _ENV.get("AUTO_DEV_API_KEY", "")
SERVICE_KEY = _ENV.get("SUPABASE_SERVICE_ROLE_KEY", "")


def supa_headers(write: bool = False) -> dict:
    h = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json",
    }
    if write:
        h["Prefer"] = "return=representation"
    return h


def supa_get(params: dict) -> list:
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/{TABLE}",
        headers=supa_headers(),
        params=params,
        timeout=30,
    )
    r.raise_for_status()
    return r.json()


def supa_patch(row_id: str, body: dict) -> list:
    r = requests.patch(
        f"{SUPABASE_URL}/rest/v1/{TABLE}",
        headers=supa_headers(write=True),
        params={"id": f"eq.{row_id}"},
        json=body,
        timeout=30,
    )
    r.raise_for_status()
    return r.json()


def supa_insert(rows: list) -> list:
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/{TABLE}",
        headers=supa_headers(write=True),
        json=rows,
        timeout=60,
    )
    r.raise_for_status()
    return r.json()


def autodev_headers() -> dict:
    return {"Authorization": f"Bearer {AUTO_DEV_API_KEY}"}


if __name__ == "__main__":
    # Self-test: confirm both credentials work end to end.
    print(f"AUTO_DEV_API_KEY present: {bool(AUTO_DEV_API_KEY)} (len {len(AUTO_DEV_API_KEY)})")
    print(f"SERVICE_KEY present: {bool(SERVICE_KEY)} (len {len(SERVICE_KEY)})")

    rows = supa_get({"select": "*", "limit": "1"})
    print(f"\nSupabase READ ok. Columns: {sorted(rows[0].keys()) if rows else 'no rows'}")

    if rows:
        rid = rows[0]["id"]
        orig = rows[0]["status"]
        # round-trip write test
        supa_patch(rid, {"status": "draft"})
        after = supa_get({"select": "status", "id": f"eq.{rid}"})[0]["status"]
        supa_patch(rid, {"status": orig})
        restored = supa_get({"select": "status", "id": f"eq.{rid}"})[0]["status"]
        print(f"Supabase WRITE ok. round-trip: {orig} -> {after} -> {restored}")

    # Auto.dev test
    ad = requests.get(
        "https://auto.dev/api/listings",
        headers=autodev_headers(),
        params={"make": "Toyota", "model": "Land Cruiser"},
        timeout=30,
    )
    print(f"\nAuto.dev HTTP {ad.status_code}, totalCount={ad.json().get('totalCount')}")
