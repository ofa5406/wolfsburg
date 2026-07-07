"""Shared vault parser for the <stadt.hub> project brain.

Parses the Obsidian vault at brain/vault/ into notes + typed edges.
Stdlib only. Frontmatter is a strict hand-parsed subset of YAML:
  key: value
  key: [a, b, c]
  key:
    - item
"""
import os
import re
import sys

VAULT_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "vault"))

NODE_TYPES = {
    "concept", "element", "tier", "zone", "material", "mode", "finding",
    "precedent", "decision", "persona", "district", "dataset", "tool",
    "risk", "tension", "event", "deepdive", "index",
}

CATEGORIES = {
    "identity", "urbanism", "mobility", "hub", "fleet", "evidence",
    "precedent", "process", "place", "data", "people", "risk", "theory",
}

RELATIONS = {
    "defines", "part-of", "instance-of", "informs", "supports",
    "contradicts", "implements", "precedent-for", "located-in", "uses",
    "produces", "led-to", "mentions",
}

CONFIDENCE = {"high", "medium", "low"}

WIKILINK_RE = re.compile(r"\[\[([^\[\]|]+)(?:\|([^\[\]]+))?\]\]")
CONN_LINE_RE = re.compile(r"^-\s+([a-z-]+)\s+\[\[([^\[\]|]+)(?:\|[^\[\]]+)?\]\]\s*$")
BAD_FILENAME_RE = re.compile(r'[:"\\|?*<>]')


def slugify(name):
    s = name.strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def parse_frontmatter(text, errors, rel):
    """Return (meta dict, body str)."""
    if not text.startswith("---"):
        errors.append("%s: missing frontmatter" % rel)
        return {}, text
    end = text.find("\n---", 3)
    if end < 0:
        errors.append("%s: unterminated frontmatter" % rel)
        return {}, text
    raw = text[3:end].strip("\n")
    body = text[end + 4:].lstrip("\n")
    meta = {}
    key = None
    for line in raw.splitlines():
        if not line.strip():
            continue
        m = re.match(r"^(\w+):\s*(.*)$", line)
        if m:
            key, val = m.group(1), m.group(2).strip()
            if val == "":
                meta[key] = []
            elif val.startswith("[") and val.endswith("]"):
                items = [v.strip().strip("'\"") for v in val[1:-1].split(",")]
                meta[key] = [v for v in items if v]
            else:
                meta[key] = val.strip("'\"")
        elif re.match(r"^\s+-\s+", line) and key is not None:
            item = re.sub(r"^\s+-\s+", "", line).strip().strip("'\"")
            if not isinstance(meta.get(key), list):
                errors.append("%s: stray list item under scalar key '%s'" % (rel, key))
            else:
                meta[key].append(item)
        else:
            errors.append("%s: unparseable frontmatter line: %r" % (rel, line))
    return meta, body


def load_vault(vault_dir=VAULT_DIR):
    """Return (notes, errors, warnings).

    notes: dict id -> note dict with keys:
      id, title, type, category, confidence, source, tags, folder, file,
      body (markdown without the Connections section), connections
      (list of (rel, target_title)), inline_links (list of target titles)
    """
    notes = {}
    by_title = {}
    errors = []
    warnings = []

    for root, _dirs, files in os.walk(vault_dir):
        for fn in sorted(files):
            if not fn.endswith(".md"):
                continue
            path = os.path.join(root, fn)
            rel = os.path.relpath(path, vault_dir).replace("\\", "/")
            folder = rel.split("/")[0] if "/" in rel else ""
            if BAD_FILENAME_RE.search(fn):
                errors.append("%s: filename contains Windows-unsafe characters" % rel)
            with open(path, "r", encoding="utf-8") as f:
                text = f.read()
            meta, body = parse_frontmatter(text, errors, rel)

            title = meta.get("title") or ""
            if not title:
                errors.append("%s: missing title" % rel)
                title = fn[:-3]
            nid = meta.get("id") or slugify(fn[:-3])

            ntype = meta.get("type", "")
            if ntype not in NODE_TYPES:
                errors.append("%s: unknown type %r" % (rel, ntype))
            cat = meta.get("category", "")
            if cat not in CATEGORIES:
                errors.append("%s: unknown category %r" % (rel, cat))
            conf = meta.get("confidence", "high")
            if conf not in CONFIDENCE:
                errors.append("%s: unknown confidence %r" % (rel, conf))
            source = meta.get("source", [])
            if isinstance(source, str):
                source = [source]
            for s in source:
                if "\\" in s:
                    errors.append("%s: backslash in source path %r" % (rel, s))
            tags = meta.get("tags", [])
            if isinstance(tags, str):
                tags = [tags]

            # split off the Connections section
            conn = []
            main_body = body
            m = re.search(r"^##\s+Connections\s*$", body, re.M)
            if m:
                main_body = body[:m.start()].rstrip()
                conn_text = body[m.end():]
                for line in conn_text.splitlines():
                    line = line.strip()
                    if not line:
                        continue
                    cm = CONN_LINE_RE.match(line)
                    if cm:
                        relname, target = cm.group(1), cm.group(2).strip()
                        if relname not in RELATIONS:
                            errors.append("%s: unknown relation %r" % (rel, relname))
                        conn.append((relname, target))
                    else:
                        errors.append("%s: bad Connections line: %r" % (rel, line))
            else:
                warnings.append("%s: no Connections section" % rel)

            words = len(re.findall(r"\w+", main_body))
            if words < 40:
                errors.append("%s: body too short (%d words)" % (rel, words))

            inline = [x.group(1).strip() for x in WIKILINK_RE.finditer(main_body)]

            if nid in notes:
                errors.append("%s: duplicate id %r (also %s)" % (rel, nid, notes[nid]["file"]))
            tkey = title.lower()
            fkey = fn[:-3].lower()
            for k in {tkey, fkey}:
                if k in by_title and by_title[k] != nid:
                    errors.append("%s: title/filename collision on %r with id %r" % (rel, k, by_title[k]))
                by_title[k] = nid

            notes[nid] = {
                "id": nid, "title": title, "type": ntype, "category": cat,
                "confidence": conf, "source": source, "tags": tags,
                "folder": folder, "file": rel, "body": main_body,
                "connections": conn, "inline_links": inline,
            }

    # resolve links
    def resolve(target):
        return by_title.get(target.lower())

    edges = []          # (src_id, dst_id, rel)
    seen_pairs = set()  # for typed edges
    for nid, note in notes.items():
        out_typed = 0
        for relname, target in note["connections"]:
            dst = resolve(target)
            if dst is None:
                errors.append("%s: broken link [[%s]]" % (note["file"], target))
                continue
            if dst == nid:
                warnings.append("%s: self-link [[%s]]" % (note["file"], target))
                continue
            key = (nid, dst, relname)
            if key in seen_pairs:
                warnings.append("%s: duplicate edge %s -> %s (%s)" % (note["file"], nid, dst, relname))
                continue
            seen_pairs.add(key)
            edges.append((nid, dst, relname))
            out_typed += 1
        for target in note["inline_links"]:
            dst = resolve(target)
            if dst is None:
                errors.append("%s: broken inline link [[%s]]" % (note["file"], target))
                continue
            if dst == nid:
                continue
            # skip mention if a typed edge already exists either way
            if any((a, b) == (nid, dst) or (a, b) == (dst, nid)
                   for (a, b, _r) in edges):
                continue
            key = (nid, dst, "mentions")
            if key in seen_pairs:
                continue
            seen_pairs.add(key)
            edges.append((nid, dst, "mentions"))
        if out_typed < 2 and note["type"] != "index":
            warnings.append("%s: only %d typed connection(s)" % (note["file"], out_typed))

    # degree
    deg = {nid: 0 for nid in notes}
    for a, b, _r in edges:
        deg[a] += 1
        deg[b] += 1
    for nid, d in deg.items():
        notes[nid]["degree"] = d
        if d == 0:
            errors.append("%s: orphan node (degree 0)" % notes[nid]["file"])

    return notes, edges, errors, warnings


def stats(notes, edges):
    from collections import Counter
    lines = []
    lines.append("notes: %d   edges: %d" % (len(notes), len(edges)))
    lines.append("by type:   " + ", ".join("%s=%d" % kv for kv in sorted(
        Counter(n["type"] for n in notes.values()).items())))
    lines.append("by folder: " + ", ".join("%s=%d" % kv for kv in sorted(
        Counter(n["folder"] for n in notes.values()).items())))
    lines.append("by rel:    " + ", ".join("%s=%d" % kv for kv in sorted(
        Counter(r for _a, _b, r in edges).items())))
    top = sorted(notes.values(), key=lambda n: -n["degree"])[:20]
    lines.append("top hubs:  " + ", ".join("%s(%d)" % (n["title"], n["degree"]) for n in top))
    wl = [len(re.findall(r"\w+", n["body"])) for n in notes.values()]
    if wl:
        lines.append("body words: avg=%d min=%d max=%d" % (sum(wl) / len(wl), min(wl), max(wl)))
    return "\n".join(lines)
