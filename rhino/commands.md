# Rhino command catalogue

Every command you can send Rhino through this bridge, taken from the installed
`rhinomcp` plugin (v1.27.x). Send them with:

```powershell
.\rhino.ps1 send <command> "<json-params>"
# or
python rhino_client.py send <command> "<json-params>"
```

The reply is always JSON: `{"status": "success", "result": {...}}` or
`{"status": "error", "message": "..."}`.

> ⚠️ **Read commands are safe.** **Write commands change your model** — they
> create, move, or delete geometry. Remember Rhino's own Undo (Ctrl+Z) plus the
> `undo` command below.
>
> 💾 **Auto-save:** every write command below triggers an automatic save over the
> `.3dm` file (reply shows `"_autosaved": true`). Read commands never save. Use
> `--no-save` to skip it once, or `RHINO_AUTOSAVE=0` to disable for a session.
> Save manually anytime with `python rhino_client.py save`.

---

## Read / inspect (safe)

| Command | What it does | Example params |
|---------|--------------|----------------|
| `get_document_summary` | File, units, layer list, object counts. | `{}` |
| `get_objects` | List objects. Filter by layer/type/bbox. | `{"limit":100,"include_geometry":false,"layer_filter":"Layer 01"}` |
| `get_object_info` | All detail on one object. | `{"name":"HubL_01"}` or `{"id":"<guid>"}` |
| `get_object_attributes` | Custom user attributes on an object. | `{"id":"<guid>"}` |
| `get_selected_objects_info` | Info on whatever is selected in Rhino. | `{}` |
| `get_or_set_current_layer` | Read (or set) the active layer. | `{}` or `{"name":"Layer 02"}` |
| `analyze_objects` | Geometric analysis of objects. | `{}` |
| `capture_viewport` | Grab the current viewport as an image. | `{}` |

## Layers

| Command | What it does | Example params |
|---------|--------------|----------------|
| `create_layer` | Make a new layer. | `{"name":"Hubs_L"}` |
| `delete_layer` | Remove a layer. | `{"name":"Old Layer"}` |

## Create geometry (write)

`create_object` — one object. Shape goes in `params`, with optional
`translation` / `rotation` / `scale` / `name` / `color`:

```json
{"type":"SPHERE","params":{"radius":5},"name":"test","translation":[10,0,0]}
```

Supported `type` values and their `params`:

| type | params |
|------|--------|
| `POINT` | `{"x":0,"y":0,"z":0}` |
| `LINE` | `{"start":[0,0,0],"end":[1,1,1]}` |
| `POLYLINE` | `{"points":[[0,0,0],[1,1,1],[2,2,2]]}` |
| `CIRCLE` | `{"center":[0,0,0],"radius":1.0}` |
| `CURVE` | `{"points":[[0,0,0],[1,1,1],[2,2,2]],"degree":3}` |
| `BOX` | `{"width":1.0,"length":1.0,"height":1.0}` |
| `SPHERE` | `{"radius":1.0}` |
| `CONE` | `{"radius":1.0,"height":1.0,"cap":true}` |
| `CYLINDER` | `{"radius":1.0,"height":1.0,"cap":true}` |
| `SURFACE` | `{"count":[3,3],"points":[...9 points...],"degree":[3,3],"closed":[false,false]}` |

`create_objects` — same idea, many at once (pass a list of object specs).

## Modify / delete (write)

| Command | What it does |
|---------|--------------|
| `modify_object` | Move/rotate/scale/rename/recolour one object. |
| `modify_objects` | Same, for many objects. |
| `update_object_attributes` | Set custom user attributes. |
| `delete_object` | Delete one object. |
| `select_objects` | Select objects in Rhino by a filter. |

## Curve & solid operations (write)

`extrude_curve`, `offset_curve`, `project_curve`, `split_curve`,
`intersect_curves`, `loft`, `pipe`,
`boolean_union`, `boolean_difference`, `boolean_intersection`.
(Each takes the relevant curve/object ids — see what `get_objects` returns.)

## Power tools (write — flexible but advanced)

| Command | What it does | Example params |
|---------|--------------|----------------|
| `run_command` | Run a raw Rhino command line. | `{"command":"_Circle 0,0,0 5","echo":false}` |
| `execute_rhinoscript_python_code` | Run RhinoScript Python inside Rhino. | `{"code":"import rhinoscriptsyntax as rs\nrs.AddPoint(0,0,0)"}` |
| `execute_rhinocommon_csharp_code` | Run RhinoCommon C# inside Rhino. | `{"code":"..."}` |

> `run_command`, `execute_rhinoscript_python_code`, and
> `execute_rhinocommon_csharp_code` may be **disabled by default** in the plugin
> for safety. If one returns a "disabled" message, it has to be enabled on the
> Rhino/plugin side before it will run.

## History

| Command | What it does | Example params |
|---------|--------------|----------------|
| `undo` | Undo the last step(s). | `{"steps":1}` |
| `redo` | Redo. | `{"steps":1}` |

---

### A worked example: tag every L-hub

```powershell
# 1) see what's in the model
.\rhino.ps1 summary

# 2) list objects on the hub layer
.\rhino.ps1 objects --layer "Hubs_L"

# 3) inspect one
.\rhino.ps1 info --name "HubL_01"

# 4) make a new layer and a marker sphere on it
.\rhino.ps1 send create_layer "{\"name\":\"Markers\"}"
.\rhino.ps1 send create_object "{\"type\":\"SPHERE\",\"params\":{\"radius\":3},\"name\":\"marker_1\"}"
```
