"""
fragile_scraper.py — a scraper pinned to *today's* DOM fingerprint.

Run it once today, jot down what it returned, then trigger a rotation
(or wait for the 3am UTC cron) and run it again. Most fields will flip
to None/garbage because the selectors it learned are no longer valid.

Usage:

    pip install requests beautifulsoup4
    python scrapers/fragile_scraper.py

    # Trigger a fresh rotation:
    gh workflow run daily-rebuild.yml -R anil-bd/ecommerce-shop

    # Wait ~60 seconds for the deploy, then run again:
    python scrapers/fragile_scraper.py
"""

from __future__ import annotations

import re
import sys
from typing import Any

import requests
from bs4 import BeautifulSoup

URL = "https://ecommerce-shop-brd.vercel.app/product/aurora-wireless-headphones"


def fetch(url: str) -> str:
    r = requests.get(url, timeout=15, headers={"User-Agent": "fragile-scraper/0.1"})
    r.raise_for_status()
    return r.text


def fingerprint(html: str) -> dict[str, Any]:
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text(separator=" ", strip=True)

    # 1) Extract today's hashed class and noise attr name from the DOM,
    #    so that the scraper can "pin" to them and verify it later breaks.
    sample_class = next(iter(sorted({c for c in re.findall(r"c-[a-z][a-z0-9]{5,9}", html)})), None)
    sample_noise = next(iter(sorted({a for a in re.findall(r"data-[a-z]+-[a-z0-9]{3,5}", html)})), None)

    return {
        "build_id": (re.search(r'name="x-build" content="([^"]+)"', html) or [None, None])[1] if isinstance(re.search(r'name="x-build" content="([^"]+)"', html), re.Match) else None,
        "first_h1_text": (soup.find("h1") or {}).get_text(strip=True) if soup.find("h1") else None,
        "first_h2_text": (soup.find("h2") or {}).get_text(strip=True) if soup.find("h2") else None,
        "regex_dollar_prices": re.findall(r"\$\d+\.\d{2}", text)[:3],
        "first_image_src": (soup.find("img") or {}).get("src") if soup.find("img") else None,
        "sample_hashed_class_today": sample_class,
        "sample_noise_attr_today": sample_noise,
        "contains_full_product_name": "Aurora Wireless Headphones" in text,
        "contains_description_phrase": "memory-foam cups" in text,
    }


def replay_pinned(html: str, pinned_class: str | None, pinned_attr: str | None) -> dict[str, Any]:
    """Pretend a scraper learned these selectors yesterday. Re-check today."""
    soup = BeautifulSoup(html, "html.parser")
    return {
        "pinned_class_still_matches": bool(pinned_class) and bool(soup.select_one(f".{pinned_class}")),
        "pinned_attr_still_matches": bool(pinned_attr) and bool(soup.select_one(f"[{pinned_attr}]")),
    }


def main() -> int:
    html = fetch(URL)
    fp = fingerprint(html)
    build_match = re.search(r'name="x-build" content="([^"]+)"', html)
    fp["build_id"] = build_match.group(1) if build_match else None

    print("=" * 70)
    print(f"Scrape result for {URL}")
    print("=" * 70)
    for k, v in fp.items():
        print(f"  {k:35s} : {v!r}")
    print()
    print(
        "Note the values above. Trigger a rotation, wait for redeploy, then run\n"
        "this script again. Compare to see how much the same scraper sees change."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
