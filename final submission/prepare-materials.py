"""Place the exhibition prints into the submission.

The printed material lives outside this repo (it was produced in the studio
folder). This copies it in and makes the two versions the guidelines ask for:

    materials/       print resolution, as produced        -> Nextcloud
    materials-web/   150 dpi, under 10 MB per file        -> copied into site/
    raw/             the source images behind the prints  -> Nextcloud

The web version is built by recompressing the *images inside* each PDF, not by
rasterising the page. `graphic and content.pdf` has 16 font objects — real,
selectable text — and flattening it to pictures would throw that away.

Run:  python "final submission/prepare-materials.py"
"""

import shutil
import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("PyMuPDF is required:  python -m pip install pymupdf")

HERE = Path(__file__).parent
SRC = Path(r"D:\ıudd\prompt city\exhibition")

MATERIALS = HERE / "materials"
MATERIALS_WEB = HERE / "materials-web"
RAW = HERE / "raw" / "exhibition-prints"

# Print PDFs: (source, destination name, one-line description for the README)
PRINTS = [
    (SRC / "graphic and content.pdf", "graphic-and-content.pdf",
     "9 boards at A2 — the exhibition graphics and text"),
    (SRC / "before-after images" / "before after.pdf", "before-after.pdf",
     "8 sheets at A3 — before/after views of the hub sites"),
]

# Web-resolution target, from the guidelines' resolution table.
WEB_DPI = 150
# Only touch images above this; PyMuPDF requires the target to be lower than
# the threshold, so anything already at or under ~160 dpi is left alone.
WEB_DPI_THRESHOLD = 160
WEB_QUALITY = 80
SIZE_LIMIT_MB = 10


def mb(path: Path) -> float:
    return path.stat().st_size / 1024 / 1024


def make_web_version(src: Path, dst: Path) -> None:
    """Recompress embedded images to WEB_DPI, keeping text and vectors intact."""
    doc = fitz.open(src)
    # Downsample any image whose effective resolution is above the target, and
    # re-encode as JPEG. Text, line work and layout are untouched.
    doc.rewrite_images(dpi_target=WEB_DPI, dpi_threshold=WEB_DPI_THRESHOLD,
                       quality=WEB_QUALITY, set_to_gray=False)
    doc.subset_fonts()
    doc.save(dst, garbage=4, deflate=True, clean=True)
    doc.close()


def main() -> None:
    if not SRC.exists():
        sys.exit(f"Source folder not found: {SRC}")

    MATERIALS.mkdir(parents=True, exist_ok=True)
    MATERIALS_WEB.mkdir(parents=True, exist_ok=True)
    RAW.mkdir(parents=True, exist_ok=True)

    print("materials/  (print resolution, for Nextcloud)")
    for src, name, desc in PRINTS:
        if not src.exists():
            print(f"  !! missing: {src}")
            continue
        dst = MATERIALS / name
        shutil.copy2(src, dst)
        print(f"  {name:26} {mb(dst):5.1f} MB   {desc}")

    print("\nmaterials-web/  (150 dpi, copied into site/materials/)")
    for _, name, _ in PRINTS:
        src = MATERIALS / name
        if not src.exists():
            continue
        dst = MATERIALS_WEB / name
        make_web_version(src, dst)
        before, after = mb(src), mb(dst)
        # If recompression made it bigger, the original was already web-sized.
        if after >= before:
            shutil.copy2(src, dst)
            after = mb(dst)
        flag = "" if after < SIZE_LIMIT_MB else f"   ** still over {SIZE_LIMIT_MB} MB **"
        print(f"  {name:26} {before:5.1f} -> {after:5.1f} MB{flag}")

    print("\nraw/exhibition-prints/  (the source images behind the prints)")
    src_images = SRC / "before-after images"
    if src_images.exists():
        dst_images = RAW / "before-after-images"
        if dst_images.exists():
            shutil.rmtree(dst_images)
        # The print PDF itself already lives in materials/; keep only images here.
        shutil.copytree(src_images, dst_images,
                        ignore=shutil.ignore_patterns("*.pdf"))
        n = len(list(dst_images.iterdir()))
        total = sum(f.stat().st_size for f in dst_images.rglob("*") if f.is_file())
        print(f"  before-after-images/       {total / 1024 / 1024:5.1f} MB   {n} files")

    print("\nDone. Re-run build-site.mjs to copy materials-web/ into site/materials/.")


if __name__ == "__main__":
    main()
