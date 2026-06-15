#!/usr/bin/env python3
"""
rhino_client.py — talk to a running Rhino 8 from the terminal.

Rhino must be OPEN with the `rhinomcp` plugin started (type `mcpstart` in
Rhino's command line). The plugin listens on a local socket: 127.0.0.1:1999.
This script sends one JSON command and prints the JSON reply.

Wire protocol (learned from the rhinomcp plugin source):
    send:  {"type": "<command>", "params": { ... }}
    recv:  {"status": "success"|"error", "result": {...}} / {"message": "..."}

AUTO-SAVE
---------
After any command that *changes the model* (create/modify/delete/boolean/etc.),
this client automatically tells Rhino to save over the current .3dm file, so your
work is never left unsaved. Read-only commands (summary/objects/info) never save.

  • On by default. Turn off for one call with the CLI flag --no-save.
  • Turn off globally by setting the env var RHINO_AUTOSAVE=0.
  • In code, pass auto_save=False to rhino_command().

Use it two ways:

1) From PowerShell / CMD as a CLI:
     python rhino_client.py ping
     python rhino_client.py summary
     python rhino_client.py objects --layer "Layer 01" --limit 50
     python rhino_client.py info --name "MyBox"
     python rhino_client.py save                      # save on demand
     python rhino_client.py send create_object "{\"type\":\"SPHERE\",\"params\":{\"radius\":5}}"
     python rhino_client.py send delete_object "{...}" --no-save   # skip auto-save once

2) From other Python code / a Claude session:
     from rhino_client import rhino_command
     data = rhino_command("get_document_summary")               # read, no save
     rhino_command("create_layer", {"name": "Hubs"})            # write, auto-saves
     rhino_command("create_layer", {"name": "Tmp"}, auto_save=False)
"""

import argparse
import json
import os
import socket
import sys

HOST = "127.0.0.1"
PORT = 1999          # rhinomcp default; override with RHINO_MCP_PORT if you ever change it
TIMEOUT = 30.0       # seconds to wait for Rhino to answer

# Commands that change the document. After one of these succeeds, the client
# saves automatically (unless auto-save is disabled). Keep in sync with
# commands.md. Read-only commands are deliberately absent.
WRITE_COMMANDS = {
    "create_object", "create_objects",
    "modify_object", "modify_objects",
    "update_object_attributes",
    "delete_object",
    "create_layer", "delete_layer",
    "extrude_curve", "offset_curve", "project_curve", "split_curve",
    "intersect_curves", "loft", "pipe",
    "boolean_union", "boolean_difference", "boolean_intersection",
    "undo", "redo",
    "execute_rhinoscript_python_code", "execute_rhinocommon_csharp_code",
    "run_command",  # may modify; we save after it unless it IS a save itself
}

SAVE_TYPE = "run_command"
SAVE_PARAMS = {"command": "_Save", "echo": False}


def _autosave_default() -> bool:
    """Auto-save is on unless RHINO_AUTOSAVE is set to a falsey value."""
    return os.getenv("RHINO_AUTOSAVE", "1").strip().lower() not in ("0", "false", "no", "off")


def _is_save_call(command_type: str, params: dict) -> bool:
    """True if this command is itself a save — so we never save-after-saving."""
    if command_type != "run_command":
        return False
    return "save" in str((params or {}).get("command", "")).lower()


def _send_raw(command_type: str, params: dict, host: str, port: int, timeout: float) -> dict:
    """One socket round-trip. No auto-save. Returns parsed JSON dict."""
    payload = json.dumps({"type": command_type, "params": params or {}}).encode("utf-8")

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    try:
        try:
            sock.connect((host, port))
        except OSError as e:
            raise ConnectionError(
                f"Could not reach Rhino at {host}:{port}. "
                f"Is Rhino open and did you run `mcpstart` in its command line? ({e})"
            ) from e

        sock.sendall(payload)

        # The plugin sends a single JSON object, maybe across several packets.
        # Read until the buffer parses as JSON.
        buffer = b""
        while True:
            try:
                chunk = sock.recv(8192)
            except socket.timeout:
                raise TimeoutError(
                    f"Rhino did not answer within {timeout}s for command '{command_type}'."
                )
            if not chunk:
                break
            buffer += chunk
            try:
                response = json.loads(buffer.decode("utf-8"))
                break
            except json.JSONDecodeError:
                continue  # more data coming
        else:
            raise RuntimeError("Rhino closed the connection before sending a full reply.")

        if not isinstance(response, dict):
            return {"result": response}
        if response.get("status") == "error":
            raise RuntimeError(f"Rhino error for '{command_type}': {response.get('message')}")
        return response
    finally:
        sock.close()


def save_document(host: str = HOST, port: int = PORT, timeout: float = TIMEOUT) -> dict:
    """Save the current Rhino document over its .3dm file. Returns Rhino's reply."""
    return _send_raw(SAVE_TYPE, SAVE_PARAMS, host, port, timeout)


def rhino_command(command_type: str, params: dict | None = None, *,
                  auto_save: bool | None = None,
                  host: str = HOST, port: int = PORT, timeout: float = TIMEOUT) -> dict:
    """Send one command to Rhino and return the parsed JSON response as a dict.

    If the command changed the model and auto-save is enabled, the document is
    saved afterwards. The returned dict gets an "_autosaved" key (True/False)
    noting whether a save ran.

    Raises ConnectionError if Rhino isn't reachable (not open, or `mcpstart`
    not run). Raises RuntimeError if Rhino reports an error for the command.
    """
    params = params or {}
    response = _send_raw(command_type, params, host, port, timeout)

    do_save = _autosave_default() if auto_save is None else auto_save
    saved = False
    if (do_save and command_type in WRITE_COMMANDS
            and not _is_save_call(command_type, params)):
        try:
            save_document(host, port, timeout)
            saved = True
        except Exception as e:  # never let a save failure mask a successful edit
            response.setdefault("_autosave_error", str(e))

    if isinstance(response, dict):
        response["_autosaved"] = saved
    return response


def _print(obj) -> None:
    # Force UTF-8 so Turkish characters / paths don't crash the Windows console.
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    print(json.dumps(obj, indent=2, ensure_ascii=False))


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description="Talk to a running Rhino 8 (rhinomcp).")
    parser.add_argument("--no-save", action="store_true",
                        help="Do not auto-save after this command, even if it changes the model.")
    sub = parser.add_subparsers(dest="cmd", required=True)

    sub.add_parser("ping", help="Check whether Rhino is reachable.")
    sub.add_parser("summary", help="Document summary: file, units, layers, object counts.")
    sub.add_parser("save", help="Save the current document now.")

    p_obj = sub.add_parser("objects", help="List objects in the document.")
    p_obj.add_argument("--layer", help="Only objects on this layer.")
    p_obj.add_argument("--limit", type=int, default=100, help="Max objects (default 100).")
    p_obj.add_argument("--geometry", action="store_true", help="Include geometry data.")

    p_info = sub.add_parser("info", help="Detailed info for one object.")
    g = p_info.add_mutually_exclusive_group(required=True)
    g.add_argument("--id", help="Object GUID.")
    g.add_argument("--name", help="Object name.")

    p_send = sub.add_parser("send", help="Send any raw command with optional JSON params.")
    p_send.add_argument("type", help="Command type, e.g. get_document_summary.")
    p_send.add_argument("params", nargs="?", default="{}", help="JSON params string.")

    args = parser.parse_args(argv)
    auto_save = False if args.no_save else None  # None = use env default

    try:
        if args.cmd == "ping":
            rhino_command("get_document_summary", auto_save=False)
            _print({"ok": True, "message": "Rhino is reachable on 127.0.0.1:1999."})
        elif args.cmd == "summary":
            _print(rhino_command("get_document_summary", auto_save=False))
        elif args.cmd == "save":
            _print(save_document())
        elif args.cmd == "objects":
            params = {"limit": args.limit, "include_geometry": args.geometry}
            if args.layer:
                params["layer_filter"] = args.layer
            _print(rhino_command("get_objects", params, auto_save=False))
        elif args.cmd == "info":
            params = {"id": args.id} if args.id else {"name": args.name}
            _print(rhino_command("get_object_info", params, auto_save=False))
        elif args.cmd == "send":
            try:
                params = json.loads(args.params)
            except json.JSONDecodeError as e:
                print(f"params is not valid JSON: {e}", file=sys.stderr)
                return 2
            _print(rhino_command(args.type, params, auto_save=auto_save))
    except (ConnectionError, TimeoutError, RuntimeError) as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
