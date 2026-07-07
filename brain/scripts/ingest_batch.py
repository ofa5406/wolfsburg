"""Split a concatenated batch file into individual vault notes.

Batch format: notes separated by lines like
=== FILE: 01_Concepts/Mobility Hub.md ===

Usage: python brain/scripts/ingest_batch.py <batchfile> [more batchfiles...]
"""
import os
import re
import sys

VAULT_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "vault"))
DELIM = re.compile(r"^===\s*FILE:\s*(.+?)\s*===\s*$", re.M)


def ingest(path):
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    parts = DELIM.split(text)
    # parts: [preamble, name1, content1, name2, content2, ...]
    if len(parts) < 3:
        print("%s: no FILE delimiters found" % path)
        return 0
    count = 0
    for i in range(1, len(parts) - 1, 2):
        rel = parts[i].replace("\\", "/")
        content = parts[i + 1].strip() + "\n"
        out = os.path.join(VAULT_DIR, rel)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, "w", encoding="utf-8") as f:
            f.write(content)
        count += 1
    print("%s: wrote %d notes" % (os.path.basename(path), count))
    return count


def main():
    total = 0
    for p in sys.argv[1:]:
        total += ingest(p)
    print("total: %d notes" % total)


if __name__ == "__main__":
    main()
