# -*- coding: utf-8 -*-
"""Fetch CC-licensed lead images for the 10 players from Wikipedia REST API."""
import json, os, sys, urllib.request

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
PLAYERS = {
    "kohli": "Virat_Kohli", "sharma": "Rohit_Sharma", "bumrah": "Jasprit_Bumrah",
    "jadeja": "Ravindra_Jadeja", "rahul": "KL_Rahul", "pandya": "Hardik_Pandya",
    "gill": "Shubman_Gill", "pant": "Rishabh_Pant", "yadav": "Suryakumar_Yadav",
    "siraj": "Mohammed_Siraj",
}
os.makedirs("assets/players", exist_ok=True)
credits = {}
UA = {"User-Agent": "FanGram-design-mockup/1.0 (internal design exploration)"}

for slug, title in PLAYERS.items():
    try:
        req = urllib.request.Request(
            f"https://en.wikipedia.org/api/rest_v1/page/summary/{title}", headers=UA)
        d = json.loads(urllib.request.urlopen(req, timeout=30).read())
        src = d.get("originalimage", {}).get("source") or d.get("thumbnail", {}).get("source")
        if not src:
            print(f"{slug}: NO IMAGE"); continue
        ext = ".jpg" if ".jpg" in src.lower() or ".jpeg" in src.lower() else ".png"
        out = f"assets/players/{slug}{ext}"
        req2 = urllib.request.Request(src, headers=UA)
        data = urllib.request.urlopen(req2, timeout=60).read()
        with open(out, "wb") as f:
            f.write(data)
        credits[slug] = {"file": out, "source": src, "article": f"https://en.wikipedia.org/wiki/{title}"}
        print(f"{slug}: {len(data)//1024} KB -> {out}")
    except Exception as e:
        print(f"{slug}: FAILED {e}")

with open("assets/players/credits.json", "w", encoding="utf-8") as f:
    json.dump(credits, f, indent=2)
print("done", len(credits), "of", len(PLAYERS))
