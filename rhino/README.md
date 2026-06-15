# Rhino bridge — control Rhino 8 from the terminal

This folder lets you (and Claude) **talk to your running Rhino 8** to read the
model and run tasks — listing objects, checking dimensions, creating geometry,
organising layers, running RhinoScript, and so on.

It talks to the **same `rhinomcp` connection** that the Claude desktop app uses,
just from PowerShell / a terminal instead. Both reach the same open Rhino.

---

## Before anything works — start Rhino's side

Every time you want to use this, **two things must be true**:

1. **Rhino 8 is open** with a document (your `.3dm` file, or even a blank one).
2. You have typed **`mcpstart`** into Rhino's command line (the bar at the top)
   and pressed Enter. You only do this once per Rhino session.

That makes Rhino listen on a local channel: `127.0.0.1`, port `1999`.
If you close Rhino and reopen later, run `mcpstart` again.

> The plugin is already installed (it lives in Rhino 8's package folder).
> You do **not** need to reinstall it.

---

## Quick start (PowerShell)

From this folder:

```powershell
.\rhino.ps1 ping        # is Rhino reachable right now?
.\rhino.ps1 summary     # file name, units, layers, object counts
.\rhino.ps1 objects     # list objects in the model
```

If `ping` says *reachable*, you're connected. If it errors, see Troubleshooting.

> First time only: PowerShell may block local scripts. If `.\rhino.ps1` is
> blocked, run this once, then try again:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`
> Or skip the wrapper entirely and use `python rhino_client.py ...` instead.

## Quick start (plain Python — works anywhere)

```powershell
python rhino_client.py ping
python rhino_client.py summary
python rhino_client.py objects --layer "Layer 01" --limit 50
python rhino_client.py info --name "MyBox"
```

---

## Auto-save (built in)

Whenever a command **changes the model** — creating, moving, deleting, booleans,
undo/redo, etc. — this bridge **automatically saves** over your `.3dm` file right
after. So your work is never left unsaved. You'll see `"_autosaved": true` in the
reply.

- **Read** commands (`summary`, `objects`, `info`, `ping`) never save.
- Save on demand anytime: `.\rhino.ps1 save`
- Skip auto-save for one command: add `--no-save`, e.g.
  `.\rhino.ps1 send delete_object "{...}" --no-save`
- Turn it off for a whole session: set `RHINO_AUTOSAVE=0` before running.

Auto-save **overwrites** the working file (your chosen setting). Rhino's in-app
Undo (Ctrl+Z) still works within the session, but the previous version on disk is
replaced — so keep your own milestone copies before big changes if you want them.

## What's in this folder

| File | What it is |
|------|------------|
| `README.md` | This guide. |
| `rhino_client.py` | The actual tool. A small Python program + importable function. |
| `rhino.ps1` | PowerShell shortcut so you can skip typing `python ...`. |
| `commands.md` | The full list of Rhino commands you can send, with examples. |
| `CLAUDE.md` | A short briefing a Claude session reads to know how to drive Rhino. |

---

## Common things to run

```powershell
# Read the whole document at a glance
.\rhino.ps1 summary

# List everything on a layer
.\rhino.ps1 objects --layer "Layer 01"

# Full detail on one object (by name or by id/GUID)
.\rhino.ps1 info --name "HubL_01"

# Send ANY command (see commands.md for the list and parameters)
.\rhino.ps1 send get_document_summary
.\rhino.ps1 send create_object "{\"type\":\"SPHERE\",\"params\":{\"radius\":5}}"
```

Anything beyond the built-in shortcuts goes through `send <command> <json>`.
See **`commands.md`** for the complete command catalogue.

---

## Troubleshooting

**"Could not reach Rhino at 127.0.0.1:1999"**
→ Rhino isn't open, or you haven't run `mcpstart` yet. Open Rhino, type
`mcpstart`, press Enter, and try again.

**`ping` works but a command returns an error**
→ The command name or its parameters are off. Check `commands.md` for the exact
spelling and the JSON shape it expects.

**`.\rhino.ps1` is blocked / "cannot be loaded"**
→ Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, or just use
`python rhino_client.py ...` directly.

**Nothing returns / it hangs**
→ Rhino may be mid-operation or showing a dialog. Click back into Rhino, make
sure no command is waiting for input, then retry.

---

## How it works (one paragraph)

`mcpstart` makes Rhino listen on a local socket (port 1999). This tool opens
that socket, sends one line of JSON — `{"type": "<command>", "params": {...}}` —
and reads back one line of JSON with the result. That's the entire bridge.
Nothing leaves your computer; it's a local connection only.
