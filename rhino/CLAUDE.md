# Rhino bridge — session briefing (read this when a Rhino task comes up)

This folder is how you (Claude) drive the user's **running Rhino 8** from the
terminal. The user is an urban designer, not a developer — keep explanations
plain and confirm before any destructive change.

## The connection

- Rhino must be **open** with the `rhinomcp` plugin started: the user types
  **`mcpstart`** in Rhino's command line. It then listens on `127.0.0.1:1999`.
- This is the **same** bridge the Claude desktop app uses; the terminal just
  reaches it over a raw socket.
- Claude Code does **not** have native Rhino MCP tools loaded. Use the client in
  this folder instead.

## How to send a command

Easiest — use the client here:

```bash
python rhino_client.py summary
python rhino_client.py objects --layer "Layer 01"
python rhino_client.py send <command> '<json-params>'
```

Or import it:

```python
from rhino_client import rhino_command
data = rhino_command("get_document_summary")
data = rhino_command("get_objects", {"limit": 50, "layer_filter": "Hubs_L"})
```

Or raw, with no dependency on this folder — open a TCP socket to
`127.0.0.1:1999`, send `{"type": "<command>", "params": {...}}` (UTF-8), and read
JSON back until it parses. Response: `{"status": "success"|"error", ...}`.

## Command reference

See `commands.md` for the full catalogue (read vs. write, parameter shapes,
examples). Key ones: `get_document_summary`, `get_objects`, `get_object_info`,
`create_object`, `modify_object`, `delete_object`, `create_layer`, `undo`.

## Working rules

1. **Check first:** run `python rhino_client.py ping`. If unreachable, ask the
   user to open Rhino and run `mcpstart` — don't guess.
2. **Read before write:** inspect with `summary`/`objects`/`info` before changing
   anything.
3. **Writes change the model.** For create/modify/delete, say what you'll do and
   get a go-ahead. `undo` (and Rhino's Ctrl+Z) exist.
   **Auto-save is on:** `rhino_command()` (and the CLI) automatically saves over
   the `.3dm` after any write command — reply carries `"_autosaved": true`. Reads
   never save. Disable per-call with `auto_save=False` / `--no-save`, or per
   session with `RHINO_AUTOSAVE=0`. It overwrites the working file, so suggest a
   milestone copy before large/risky edits.
4. `run_command` and the `execute_*` code tools may be disabled in the plugin for
   safety — if they return "disabled", note that rather than working around it.
5. Units in the current model are **centimeters** (verify via `summary` — it can
   change per file).

See also the memory note `project_rhino_mcp` and the parent `../CLAUDE.md` for
the Wolfsburg project context.
