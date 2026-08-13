# submission-tools

The working tooling for the InfAU final submission. **Nothing here is uploaded**
— it lives outside `final submission/` on purpose.

The Nextcloud folder is fixed and the brief says *"do not create new ones —
upload into the existing structure."* So `final submission/` is **pure output**:
whatever is in it is exactly what gets uploaded, and "upload everything in this
folder" is simply correct. `check-upload-shape.mjs` enforces that.

A copy of this folder is placed at `final submission/source/build/` by
`build-submission.mjs`, because the brief asks `source/` to include the scripts.
The canonical copy staying here means regenerating `source/` can never destroy
the scripts that build it.

## Rebuild, in order

```
node submission-tools/build-site.mjs         gather the four pieces into site/
node submission-tools/downsize-media.mjs     images to 2000 px / q80
node submission-tools/build-submission.mjs   assemble source/ and raw/
```

`downsize-media.mjs` needs `sharp`, which is not a project dependency — install
it somewhere and run the script from there, or `npm i sharp` in a scratch folder
and copy the script beside it.

Printed material comes from the studio folder outside this repo and is placed by:

```
python submission-tools/prepare-materials.py
```

It writes print-resolution PDFs to `final submission/materials/`, 150 dpi copies
to `submission-tools/materials-web/` (which `build-site.mjs` copies into
`site/materials/`), and the source images to `final submission/raw/`.

## Checks

```
node submission-tools/check-upload-shape.mjs     the six-entry rule
node submission-tools/check-credits.mjs          every photograph credited
node submission-tools/check-snapshots.mjs        every loadOsm() name exists
node submission-tools/check-filename-case.mjs    Linux/Pages case sensitivity
node submission-tools/verify-offline.mjs         the one that matters
```

`verify-offline.mjs` serves the package **one folder deep**, mimicking
`Bauhaus-InfAU.github.io/<project>/`, and **blocks every request that would leave
the machine** — stricter than switching wifi off, and it avoids the browser-cache
trap the brief warns about. It then reports the `file://` case separately, since
double-clicking `index.html` cannot work for the Vite-built pieces.

## Files

| File | What it is |
|---|---|
| `paths.mjs` | One place that knows where everything is. Every script imports it. |
| `README-submission.md` | **The canonical README.** Copied to `site/README.md` and the folder root, so they cannot drift. Edit it here. |
| `map-README.md` | Copied to `site/map/`, so the Activity Map explains itself. |
| `launchers/` | `open-offline.{cmd,sh}` templates; `__PORT__` is substituted per destination. |
| `materials-web/` | 150 dpi print PDFs. Tracked, so `site/materials/` is rebuildable without the external studio folder. |
| `image-credits.xlsx` | The working record behind the README's photograph credits. |
