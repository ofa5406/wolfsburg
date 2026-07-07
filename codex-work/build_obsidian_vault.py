from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
WORK = ROOT / "codex-work"
VAULT = WORK / "stadt-hub-vault"


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def win(path: Path) -> str:
    return path.as_posix().replace("/", "\\")


def ensure_clean_target() -> None:
    if VAULT.exists():
        shutil.rmtree(VAULT)
    VAULT.mkdir(parents=True, exist_ok=True)


def write(path: str, text: str) -> None:
    target = VAULT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(text.rstrip() + "\n", encoding="utf-8")


def yaml_list(items: list[str]) -> str:
    if not items:
        return "[]"
    return "\n" + "\n".join(f'  - "{item}"' for item in items)


def frontmatter(
    title: str,
    note_type: str,
    source_paths: list[str] | None = None,
    status: str = "generated",
    confidence: str = "medium",
    tags: list[str] | None = None,
) -> str:
    source_paths = source_paths or []
    tags = tags or []
    return (
        "---\n"
        f'title: "{title}"\n'
        f'type: "{note_type}"\n'
        f'status: "{status}"\n'
        f'confidence: "{confidence}"\n'
        f"source_path:{yaml_list(source_paths)}\n"
        f"tags:{yaml_list(tags)}\n"
        "---\n\n"
    )


def bullets(items: list[str]) -> str:
    return "\n".join(f"- {item}" for item in items)


def git(cmd: list[str], cwd: Path, safe: bool = False) -> str:
    base = ["git"]
    if safe:
        base += ["-c", f"safe.directory={cwd.as_posix()}"]
    try:
        out = subprocess.check_output(base + cmd, cwd=str(cwd), stderr=subprocess.STDOUT, text=True, encoding="utf-8")
        return out.strip()
    except Exception as exc:
        return f"UNAVAILABLE: {exc}"


def headings_for(path: Path, limit: int = 24) -> list[str]:
    try:
        lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
    except Exception:
        return []
    heads = []
    for line in lines:
        if re.match(r"^#{1,4}\s+", line):
            heads.append(line.strip())
        if len(heads) >= limit:
            break
    return heads


def file_inventory() -> dict[str, object]:
    ignore_parts = {".git", "node_modules", "__pycache__"}
    files = []
    folder_counts = Counter()
    ext_counts = Counter()
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        parts = set(path.relative_to(ROOT).parts)
        if parts & ignore_parts:
            continue
        if "codex-work" in parts:
            continue
        r = rel(path)
        ext = path.suffix.lower() or "[none]"
        files.append(path)
        ext_counts[ext] += 1
        folder_counts[path.relative_to(ROOT).parts[0]] += 1
    return {"files": files, "ext_counts": ext_counts, "folder_counts": folder_counts}


def geojson_summary(path: Path) -> dict[str, object]:
    try:
        data = json.loads(path.read_text(encoding="utf-8", errors="replace"))
        features = data.get("features", [])
        first = features[0] if features else {}
        props = list((first.get("properties") or {}).keys())[:8]
        geom = (first.get("geometry") or {}).get("type", "")
        return {"features": len(features), "geometry": geom, "props": props}
    except Exception as exc:
        return {"error": str(exc)}


def csv_summary(path: Path) -> dict[str, object]:
    try:
        lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
        return {"rows": max(0, len(lines) - 1), "header": lines[0] if lines else ""}
    except Exception as exc:
        return {"error": str(exc)}


def write_home(inv: dict[str, object]) -> None:
    ext_counts: Counter = inv["ext_counts"]  # type: ignore[assignment]
    folder_counts: Counter = inv["folder_counts"]  # type: ignore[assignment]
    ext_lines = [f"- `{ext}`: {count}" for ext, count in ext_counts.most_common(18)]
    folder_lines = [f"- `{folder}`: {count} files" for folder, count in folder_counts.most_common()]
    write(
        "00_Home/Home.md",
        frontmatter(
            "stadt.hub Vault Home",
            "home",
            [win(ROOT / "README.md"), win(ROOT / "HANDOFF.md")],
            confidence="high",
            tags=["moc", "project"],
        )
        + "# stadt.hub Knowledge Vault\n\n"
        + "This vault reorganizes the Wolfsburg urban design repository into a project knowledge system. "
        + "It does not replace the repository. Every synthesized note keeps source traceability to the original file paths.\n\n"
        + "## Start Here\n\n"
        + bullets(
            [
                "[[Project Map]] gives the overall graph.",
                "[[Fundamental Concepts Index]] breaks the project down to base concepts.",
                "[[Hub Typology Graph Index]] shows S/M/L hubs, toolpalette elements, zones, materials, and relationships.",
                "[[Project Thesis - stadt.hub]] explains the argument.",
                "[[Feedback and Critique Index]] tracks tutor and review feedback as first-class knowledge.",
                "[[Decision Index]] records what is locked and what remains unresolved.",
                "[[Methods and Tools Index]] links tools to methods, maps, insights, and design moves.",
                "[[Risks and Open Questions Index]] lists weakly supported or conflicting parts.",
            ]
        )
        + "\n\n## Repository Snapshot\n\n"
        + f"- Source root: `{win(ROOT)}`\n"
        + "- Main GitHub repo: `ofa5406/wolfsburg`, local branch `main`.\n"
        + "- Linked tool repo: `annestasiia/wolfsburg-activity-map`, local branch `master`, stored inside the source root but ignored by the main repo.\n"
        + "- Vault output: `codex-work/stadt-hub-vault`.\n\n"
        + "## Major Folders\n\n"
        + "\n".join(folder_lines)
        + "\n\n## File Type Mix\n\n"
        + "\n".join(ext_lines)
        + "\n\n## Core Graph Logic\n\n"
        + "Research -> Analysis -> Feedback -> Revision -> Decision -> Outcome\n\n"
        + "Tool -> Method -> Map -> Insight -> Design Move\n\n"
        + "Comment -> Concern -> Response -> Revised Deliverable\n",
    )

    write(
        "00_Home/Project Map.md",
        frontmatter(
            "Project Map",
            "moc",
            [win(ROOT / "CLAUDE.md"), win(ROOT / "HANDOFF.md")],
            confidence="high",
            tags=["moc", "graph"],
        )
        + "# Project Map\n\n"
        + "## Fundamental Concepts\n\n"
        + bullets(
            [
                "[[Fundamental Concepts Index]]",
                "[[Hub Typology Graph Index]]",
                "[[Concept Map - From Parking to Hub City]]",
                "[[Concept Map - Proof Chain]]",
            ]
        )
        + "\n\n"
        + "## Core\n\n"
        + bullets(
            [
                "[[Project Thesis - stadt.hub]]",
                "[[Core Numbers and Proof Claims]]",
                "[[Proof Framework]]",
                "[[Wolfsburg as Testbed]]",
            ]
        )
        + "\n\n## Feedback -> Decisions -> Outcomes\n\n"
        + bullets(
            [
                "[[Feedback and Critique Index]]",
                "[[Decision Index]]",
                "[[Revision Threads]]",
                "[[Final Presentation Outcome]]",
                "[[Summaery Exhibition Kiosk Outcome]]",
            ]
        )
        + "\n\n## Analysis and Tools\n\n"
        + bullets(
            [
                "[[Methods and Tools Index]]",
                "[[Wolfsburg Activity Map]]",
                "[[Rhino and Grasshopper Workflow]]",
                "[[Hub Viewer]]",
                "[[Spatial Dataset Index]]",
            ]
        )
        + "\n\n## Risks\n\n"
        + bullets(
            [
                "[[Fleet Number Conflict]]",
                "[[Methodology Versus Implemented Code]]",
                "[[Unreadable and External Materials]]",
            ]
        )
        + "\n\n## Source Trace\n\n"
        + bullets(
            [
                "[[Markdown Source Inventory]]",
                "[[Asset Index]]",
                "[[GitHub and Revision Trace]]",
            ]
        ),
    )


def write_project_core() -> None:
    write(
        "01_Project_Thesis/Project Thesis - stadt.hub.md",
        frontmatter(
            "Project Thesis - stadt.hub",
            "project-thesis",
            [
                win(ROOT / "project" / "current.md"),
                win(ROOT / "README.md"),
                win(ROOT / "HANDOFF.md"),
            ],
            confidence="high",
            tags=["thesis", "core"],
        )
        + "# Project Thesis - stadt.hub\n\n"
        + "Wolfsburg is reframed as a post-private-car city where the organizing element of mobility shifts from parking to mobility hubs. "
        + "The spatial promise is not simply cleaner mobility, but the release of car-dominated land for public life, greenery, housing, and civic space.\n\n"
        + "## Core Formula\n\n"
        + "`Parking City -> Hub City`\n\n"
        + "Parking is treated as the infrastructure of private ownership. Hubs are treated as the infrastructure of shared mobility.\n\n"
        + "## What Must Be Proven\n\n"
        + bullets(
            [
                "The hub network provides credible walking access and citywide coverage.",
                "The shared fleet can handle the Volkswagen shift-wave demand.",
                "The reclaimed land becomes a real urban design opportunity, not only a mobility diagram.",
                "The proposal is legible to studio critics, competition jurors, and unattended exhibition visitors.",
            ]
        )
        + "\n\n## Key Linked Notes\n\n"
        + bullets(
            [
                "[[Core Numbers and Proof Claims]]",
                "[[Proof Framework]]",
                "[[Hub Typology System]]",
                "[[Wolfsburg as Testbed]]",
                "[[Decision Index]]",
            ]
        ),
    )

    write(
        "01_Project_Thesis/Core Numbers and Proof Claims.md",
        frontmatter(
            "Core Numbers and Proof Claims",
            "claim-index",
            [
                win(ROOT / "decisions.md"),
                win(ROOT / "HANDOFF.md"),
                win(ROOT / "wolfsburg-activity-map" / "analysis" / "outputs" / "results_fleet.csv"),
                win(ROOT / "wolfsburg-activity-map" / "analysis" / "outputs" / "results_baseline.csv"),
            ],
            confidence="medium",
            tags=["numbers", "proof", "risk"],
        )
        + "# Core Numbers and Proof Claims\n\n"
        + "## Locked Design Numbers\n\n"
        + bullets(
            [
                "68 hubs total: 6 Large, 19 Medium, 43 Small.",
                "Locked fleet in `decisions.md`: 763 vehicles total.",
                "Locked fleet composition: 131 e-bikes, 55 shuttle pods, 33 autonomous buses, 369 micro-pods, 175 shared EVs.",
                "5-zone Groningen-style filtered permeability model.",
                "VW factory-gate hub is the primary case study.",
            ]
        )
        + "\n\n## Analysis Output Numbers\n\n"
        + bullets(
            [
                "`results_baseline.csv`: 104,100 trips/day; 49,647.69 car vehicles/day; peak 08:00 around 8,983 trips.",
                "`results_fleet.csv`: e-bikes 641, shuttles 55, buses 33, pods 369, car-share EVs 175, total 1,273.",
                "`results_hub_summary.csv`: Hub L 6, Hub M 19, Hub S 43, with per-hub footprints and charging estimates.",
            ]
        )
        + "\n\n## Interpretive Status\n\n"
        + "The 68 hub count is stable across design decisions and analysis outputs. The fleet total is not stable. "
        + "Treat [[Fleet Number Conflict]] as an unresolved evidence issue before public or jury-facing claims are reused.\n\n"
        + "## Related\n\n"
        + bullets(
            [
                "[[Fleet Number Conflict]]",
                "[[Capacity Analysis Method]]",
                "[[Wolfsburg Activity Map]]",
            ]
        ),
    )

    write(
        "01_Project_Thesis/Proof Framework.md",
        frontmatter(
            "Proof Framework",
            "project-framework",
            [win(ROOT / "project" / "current.md"), win(ROOT / "tasks.md"), win(ROOT / "project" / "deliverables.md")],
            confidence="high",
            tags=["proof", "deliverables"],
        )
        + "# Proof Framework\n\n"
        + "The repository repeatedly frames the project as moving from an attractive vision to a provable system. "
        + "The proof framework turns critique into deliverables.\n\n"
        + "## Required Proofs\n\n"
        + bullets(
            [
                "Hub coverage map: all 68 hubs and walking catchments.",
                "Fleet sizing logic: shared fleet handles the VW shift-wave.",
                "Persona journey: a named user, especially Anna or a VW worker, completes a car-free trip.",
                "Car-land map: composite visual of car-dedicated land.",
                "Street transformation sections: before/after spatial consequences.",
                "Implementation timeline: staged transition from today to post-car centre.",
            ]
        )
        + "\n\n## Feedback Origin\n\n"
        + "The proof framework follows the June 4 and June 11 consultations. The project was not asked to invent more vehicles; it was asked to prove that the system works.\n\n"
        + "## Related\n\n"
        + bullets(
            [
                "[[Feedback - 2026-06-04 Consultation]]",
                "[[Feedback - 2026-06-11 Consultation]]",
                "[[Decision - Project Focus Prove the System]]",
                "[[Deliverables Index]]",
            ]
        ),
    )

    write(
        "01_Project_Thesis/Wolfsburg as Testbed.md",
        frontmatter(
            "Wolfsburg as Testbed",
            "project-argument",
            [win(ROOT / "project" / "current.md"), win(ROOT / "research" / "06_arguments-evidence.md")],
            confidence="medium",
            tags=["argument", "site"],
        )
        + "# Wolfsburg as Testbed\n\n"
        + "Wolfsburg is treated as an unusually strong prototype city for shared autonomous mobility because the Volkswagen factory produces concentrated, predictable commuter waves. "
        + "This transforms a mobility problem into a design opportunity: demand that is usually hard to model becomes schedulable.\n\n"
        + "## Argument Chain\n\n"
        + bullets(
            [
                "The city is structurally tied to Volkswagen and private-car culture.",
                "That same tie creates predictable shift-wave demand.",
                "Predictable demand makes fleet sizing and hub placement more defensible.",
                "A post-car proposal in Wolfsburg has symbolic force because it challenges the car city from within.",
            ]
        )
        + "\n\n## Related\n\n"
        + bullets(
            [
                "[[Core Numbers and Proof Claims]]",
                "[[MOIA and MIA Precedent]]",
                "[[VW Shift-Wave Simulation]]",
                "[[Risk - AV Realism]]",
            ]
        ),
    )


def write_briefs() -> None:
    items = [
        (
            "Competition Brief - Wolfsburg Award",
            ROOT / "briefs" / "competition_brief.md",
            [
                "Open ideas competition context.",
                "Digital submission deadline is August 16, 2026.",
                "The vault should keep competition requirements separate from studio and exhibition requirements.",
            ],
        ),
        (
            "Studio Brief - Prompt City",
            ROOT / "briefs" / "studio_brief.md",
            [
                "University studio context.",
                "Evaluation includes project methodology and AI/workflow reflection.",
                "The repository's workflow and tool documentation are therefore deliverable knowledge, not only internal notes.",
            ],
        ),
        (
            "Midterm Brief",
            ROOT / "briefs" / "midterm_brief.md",
            [
                "Midterm communication constraint: unattended legibility matters.",
                "The brief warns against tech-only framing and supports spatial/urban clarity.",
                "This connects directly to the Summaery kiosk and exhibition decisions.",
            ],
        ),
    ]
    write(
        "02_Briefs_Constraints/Briefs and Constraints Index.md",
        frontmatter(
            "Briefs and Constraints Index",
            "moc",
            [win(ROOT / "briefs" / "competition_brief.md"), win(ROOT / "briefs" / "studio_brief.md"), win(ROOT / "briefs" / "midterm_brief.md")],
            confidence="high",
            tags=["briefs", "constraints"],
        )
        + "# Briefs and Constraints Index\n\n"
        + bullets([f"[[{name}]]" for name, _, _ in items] + ["[[Summaery Exhibition Constraint]]"])
        + "\n\n## Role in Graph\n\n"
        + "Briefs constrain what counts as a successful outcome. They should link to feedback, deliverables, and risks rather than sitting as isolated documents.\n",
    )
    for name, source, points in items:
        write(
            f"02_Briefs_Constraints/{name}.md",
            frontmatter(name, "brief", [win(source)], confidence="medium", tags=["brief"])
            + f"# {name}\n\n"
            + "## Extracted Role\n\n"
            + bullets(points)
            + "\n\n## Source Headings\n\n"
            + bullets([f"`{h}`" for h in headings_for(source)])
            + "\n\n## Related\n\n"
            + bullets(["[[Proof Framework]]", "[[Deliverables Index]]", "[[Feedback and Critique Index]]"]),
        )
    write(
        "02_Briefs_Constraints/Summaery Exhibition Constraint.md",
        frontmatter(
            "Summaery Exhibition Constraint",
            "constraint",
            [win(ROOT / "exhibition" / "README.md"), win(ROOT / "HANDOFF.md")],
            confidence="high",
            tags=["exhibition", "constraint"],
        )
        + "# Summaery Exhibition Constraint\n\n"
        + "The Summaery exhibition must work without narration. On July 6, 2026 the exhibition plan pivoted to one screen only.\n\n"
        + "## Consequences\n\n"
        + bullets(
            [
                "The project story must be self-running and self-explanatory.",
                "Kiosk timing, beat order, and visitor takeover behavior become design decisions.",
                "Earlier multi-station alternatives remain useful as reference, but are superseded.",
                "The final kiosk links presentation narrative to the live 3D hub-viewer tour.",
            ]
        )
        + "\n\n## Related\n\n"
        + bullets(["[[Summaery Exhibition Kiosk Outcome]]", "[[Exhibition Alternatives]]", "[[Hub Viewer]]"]),
    )


def write_feedback_and_decisions() -> None:
    feedback_sources = [
        (
            "Feedback - 2026-06-04 Consultation",
            ROOT / "consultations" / "2026-06-04_session.md",
            [
                "Move beyond compelling images and prove the system works.",
                "Produce one composite image of car-dedicated land.",
                "Develop a persona journey, demand-based sizing, and transformation timeline.",
                "Go deeper on what reclaimed space becomes.",
            ],
            ["[[Decision - Project Focus Prove the System]]", "[[Proof Framework]]", "[[Car-Land Map]]"],
        ),
        (
            "Feedback - 2026-06-11 Consultation",
            ROOT / "consultations" / "2026-06-11_session.md",
            [
                "Quantitative fleet and hub basis accepted.",
                "Use Grasshopper for 43 S-hub placement; use manual design judgment for M and L.",
                "Dot-matrix graphics were praised as effective communication.",
                "Some hubs inside, some periphery, calibrated by function.",
            ],
            ["[[Decision - Fleet Composition Accepted]]", "[[Decision - Hub Network Counts Accepted]]", "[[Rhino and Grasshopper Workflow]]"],
        ),
    ]
    write(
        "03_Feedback_Critique/Feedback and Critique Index.md",
        frontmatter(
            "Feedback and Critique Index",
            "moc",
            [win(ROOT / "consultations" / "2026-06-04_session.md"), win(ROOT / "consultations" / "2026-06-11_session.md")],
            confidence="high",
            tags=["feedback", "critique"],
        )
        + "# Feedback and Critique Index\n\n"
        + "Feedback is first-class project knowledge. It explains why the project moved from visual speculation into proof, tooling, and exhibition legibility.\n\n"
        + bullets([f"[[{name}]]" for name, _, _, _ in feedback_sources])
        + "\n\n## Main Feedback Themes\n\n"
        + bullets(
            [
                "[[Concern - Prove the System]]",
                "[[Concern - Car-Land Must Be Visible]]",
                "[[Concern - Hub Placement and Centrality]]",
                "[[Concern - Exhibition Legibility]]",
            ]
        ),
    )
    for name, source, points, related in feedback_sources:
        write(
            f"03_Feedback_Critique/{name}.md",
            frontmatter(name, "feedback", [win(source)], confidence="high", tags=["feedback"])
            + f"# {name}\n\n"
            + "## Key Feedback\n\n"
            + bullets(points)
            + "\n\n## Response Path\n\n"
            + bullets(related)
            + "\n\n## Source Headings\n\n"
            + bullets([f"`{h}`" for h in headings_for(source)])
            + "\n\n## Graph Pattern\n\n"
            + "Comment -> Concern -> Response -> Revised Deliverable\n",
        )
    concern_notes = [
        ("Concern - Prove the System", "The strongest repeated critique is that the vision is accepted, but the system must be spatially and operationally proven.", ["[[Proof Framework]]", "[[VW Shift-Wave Simulation]]", "[[Hub Coverage Map]]"]),
        ("Concern - Car-Land Must Be Visible", "Reviewers identified the composite car-land map as the project's rhetorical anchor.", ["[[Car-Land Map]]", "[[Parking Land Evidence]]"]),
        ("Concern - Hub Placement and Centrality", "Large hubs near pedestrian zones may reintroduce car movement; the response becomes L-Anchor versus L-Gateway.", ["[[Decision - Hub System Resolved Concept Versus Tool]]", "[[Hub Typology System]]"]),
        ("Concern - Exhibition Legibility", "The Summaery exhibit must communicate without narration and survive short visitor attention.", ["[[Summaery Exhibition Constraint]]", "[[Summaery Exhibition Kiosk Outcome]]"]),
    ]
    for name, body, links in concern_notes:
        write(
            f"03_Feedback_Critique/{name}.md",
            frontmatter(name, "critique-concern", [win(ROOT / "consultations" / "2026-06-04_session.md"), win(ROOT / "consultations" / "2026-06-11_session.md")], confidence="medium", tags=["concern"])
            + f"# {name}\n\n"
            + body
            + "\n\n## Related Responses\n\n"
            + bullets(links),
        )

    decision_data = [
        ("Decision - Project Name stadt.hub", ROOT / "decisions.md", "The project name is locked as `<stadt.hub>`; descriptive subtitle remains Post-Car Future of Wolfsburg.", ["[[Project Thesis - stadt.hub]]"]),
        ("Decision - Fleet Composition Accepted", ROOT / "decisions.md", "Tutor-accepted fleet composition totals 763 vehicles, but this conflicts with later Activity Map outputs.", ["[[Fleet Number Conflict]]", "[[Core Numbers and Proof Claims]]"]),
        ("Decision - Hub Network Counts Accepted", ROOT / "decisions.md", "68 hubs are locked: 6 L, 19 M, 43 S.", ["[[Hub Typology System]]", "[[Hub Coverage Map]]"]),
        ("Decision - Zone Structure Groningen Model", ROOT / "decisions.md", "The city centre uses a 5-zone filtered-permeability model inspired by Groningen.", ["[[Groningen Filtered Permeability]]"]),
        ("Decision - Small Hub Placement via Grasshopper", ROOT / "decisions.md", "S-hubs are placed algorithmically; M and L require design judgment.", ["[[Rhino and Grasshopper Workflow]]"]),
        ("Decision - VW Factory Hub Case Study", ROOT / "decisions.md", "The VW factory-gate hub is the primary case study.", ["[[Wolfsburg as Testbed]]", "[[VW Shift-Wave Simulation]]"]),
        ("Decision - Project Focus Prove the System", ROOT / "decisions.md", "The project stops inventing vehicle types and focuses on proving the hub system.", ["[[Proof Framework]]", "[[Feedback - 2026-06-04 Consultation]]"]),
        ("Decision - L-Hubs Reuse Multi-Storey Car Parks", ROOT / "decisions.md", "Existing multi-storey car parks become L-hubs; later refined as L-Anchor and L-Gateway.", ["[[Hub Typology System]]"]),
        ("Decision - Hub System Resolved Concept Versus Tool", ROOT / "decisions.md", "The 2026-06-17 resolution separates location logic from hub-as-place; M is parking-served surface typology, L splits into Anchor and Gateway.", ["[[Methodology Versus Implemented Code]]", "[[Hub System Concept Versus Tool]]"]),
    ]
    write(
        "04_Decisions_Revisions/Decision Index.md",
        frontmatter("Decision Index", "moc", [win(ROOT / "decisions.md")], confidence="high", tags=["decisions"])
        + "# Decision Index\n\n"
        + "This index keeps locked decisions separate from unresolved implementation gaps.\n\n"
        + bullets([f"[[{name}]]" for name, _, _, _ in decision_data])
        + "\n\n## Related\n\n"
        + bullets(["[[Revision Threads]]", "[[Risks and Open Questions Index]]"]),
    )
    for name, source, body, related in decision_data:
        write(
            f"04_Decisions_Revisions/{name}.md",
            frontmatter(name, "decision", [win(source)], confidence="high", tags=["decision"])
            + f"# {name}\n\n"
            + body
            + "\n\n## Related\n\n"
            + bullets(related),
        )
    write(
        "04_Decisions_Revisions/Revision Threads.md",
        frontmatter(
            "Revision Threads",
            "revision-index",
            [win(ROOT / "sessions" / "INDEX.md"), win(ROOT / "notes.md"), win(ROOT / "tasks.md")],
            confidence="medium",
            tags=["revision", "timeline"],
        )
        + "# Revision Threads\n\n"
        + "## Major Threads\n\n"
        + bullets(
            [
                "Initial project setup -> research library -> session memory system.",
                "June 4 critique -> proof framework and car-land demand.",
                "June 11 consultation -> accepted quantitative basis.",
                "June 17 hub rethink -> L-Anchor / L-Gateway and methodology/code risk.",
                "June 21-25 presentation build -> `<stadt.hub>` public narrative.",
                "July 4 hub-viewer navigation and deck refactor.",
                "July 6 Summaery one-screen kiosk pivot.",
            ]
        )
        + "\n\n## Related\n\n"
        + bullets(["[[GitHub and Revision Trace]]", "[[Timeline and Sessions Index]]"]),
    )


def write_research() -> None:
    research_files = [
        ("Post-Car Urbanism", "01_post-car-urbanism.md", ["post-car theory", "parking as urban form", "filtered permeability"]),
        ("Mobility System Research", "02_mobility-system.md", ["shared mobility", "autonomous fleets", "fleet sizing"]),
        ("Transfer Hub Research", "03_transfer-hubs.md", ["hub precedents", "tier logic", "toolpalette"]),
        ("Behavioral Shift Research", "04_behavioral-shift.md", ["modal shift", "car culture", "VW company-town sociology"]),
        ("Precedents Research", "05_precedents.md", ["Groningen", "Ghent", "Barcelona", "Paris", "Bremen"]),
        ("Arguments and Evidence Bank", "06_arguments-evidence.md", ["quote-ready claims", "parking land", "Wolfsburg hero stat"]),
        ("Weak Points and Actions", "07_weak-points-actions.md", ["jury risks", "counter-arguments", "action plan"]),
        ("Future Projections and Scenarios", "08_future-projections.md", ["2035/2050", "AV uncertainty", "reclaimed land"]),
        ("Execution Workflow Playbook", "09_execution-workflow.md", ["production plan", "Rhino workflow", "AI process"]),
        ("MOIA and MIA Precedent", "10_moia-mia-precedent.md", ["VW subsidiary", "MIA simulator", "home advantage"]),
    ]
    write(
        "05_Research_Evidence/Research and Evidence Index.md",
        frontmatter(
            "Research and Evidence Index",
            "moc",
            [win(ROOT / "research" / "README.md"), win(ROOT / "research" / "sources.md")],
            confidence="high",
            tags=["research", "evidence"],
        )
        + "# Research and Evidence Index\n\n"
        + "The research folder is already structured. The vault splits it into project-useful clusters and links evidence to analysis, feedback, decisions, and deliverables.\n\n"
        + bullets([f"[[{name}]]" for name, _, _ in research_files])
        + "\n\n## Atomic Evidence Notes\n\n"
        + bullets(
            [
                "[[Parking Land Evidence]]",
                "[[Groningen Filtered Permeability]]",
                "[[Bremen Mobility Hub Precedent]]",
                "[[MOIA and MIA Precedent]]",
                "[[Risk - AV Realism]]",
                "[[Risk - Political Acceptance]]",
            ]
        ),
    )
    for name, filename, themes in research_files:
        source = ROOT / "research" / filename
        write(
            f"05_Research_Evidence/{name}.md",
            frontmatter(name, "research-overview", [win(source)], confidence="medium", tags=["research"])
            + f"# {name}\n\n"
            + "## Use in Project\n\n"
            + bullets([f"Supports: {theme}." for theme in themes])
            + "\n\n## Source Headings\n\n"
            + bullets([f"`{h}`" for h in headings_for(source)])
            + "\n\n## Trace\n\n"
            + f"Original file: `{win(source)}`\n",
        )
    atomic = [
        ("Parking Land Evidence", ROOT / "research" / "06_arguments-evidence.md", "The car-land argument states that parking and road infrastructure consume urban land that could support public life. This evidence directly feeds the car-land composite map.", ["[[Car-Land Map]]", "[[Concern - Car-Land Must Be Visible]]"]),
        ("Groningen Filtered Permeability", ROOT / "sources" / "precedents.md", "Groningen is the direct precedent for the 5-zone filtered-permeability model: car access remains possible, but through-traffic is discouraged.", ["[[Decision - Zone Structure Groningen Model]]"]),
        ("Bremen Mobility Hub Precedent", ROOT / "research" / "06_arguments-evidence.md", "Bremen mobil.punkt is used as evidence that mobility hubs and car-sharing stations can reduce private car ownership.", ["[[Hub Typology System]]"]),
        ("Risk - AV Realism", ROOT / "research" / "07_weak-points-actions.md", "The project depends on future autonomous mobility. The safest framing treats AV maturity honestly and uses phased implementation plus interim shared mobility.", ["[[Risks and Open Questions Index]]"]),
        ("Risk - Political Acceptance", ROOT / "research" / "04_behavioral-shift.md", "Car-reduction projects fail when they are framed as loss. The project needs positive before/after visions and staged acceptance mechanisms.", ["[[Summaery Exhibition Kiosk Outcome]]"]),
    ]
    for name, source, body, links in atomic:
        write(
            f"05_Research_Evidence/{name}.md",
            frontmatter(name, "evidence", [win(source)], confidence="medium", tags=["evidence"])
            + f"# {name}\n\n"
            + body
            + "\n\n## Related\n\n"
            + bullets(links),
        )


def write_site_methods_design() -> None:
    write(
        "06_Site_Analysis/Site Analysis Index.md",
        frontmatter(
            "Site Analysis Index",
            "moc",
            [win(ROOT / "web-tool" / "status.md"), win(ROOT / "wolfsburg-activity-map" / "docs" / "MODES.md")],
            confidence="high",
            tags=["site-analysis", "maps"],
        )
        + "# Site Analysis Index\n\n"
        + bullets(
            [
                "[[Spatial Dataset Index]]",
                "[[Mobility Connectivity Analysis]]",
                "[[Facilities and Activity Dataset]]",
                "[[Greenery and Social Vitality Analysis]]",
                "[[Hub Placement Analysis]]",
                "[[Cycling Network Analysis]]",
                "[[Car-Land Map]]",
                "[[Hub Coverage Map]]",
            ]
        ),
    )
    analyses = [
        ("Mobility Connectivity Analysis", "district connectivity by public transport, car, cycling, and walking", ["wolfsburg_roads.geojson", "wolfsburg_bus_routes.geojson", "wolfsburg_footways.geojson"]),
        ("Facilities and Activity Dataset", "venue/activity hotspots by district, time, category, and intensity", ["wolfsburg_hotspots_v2.xlsx", "wolfsburg_facilities.geojson"]),
        ("Greenery and Social Vitality Analysis", "green coverage, social density, accessibility, and encounter potential", ["wolfsburg_parks_forests.geojson", "src/data/parks.json", "src/data/forest.json"]),
        ("Hub Placement Analysis", "candidate hubs from parking, bus stops, bike parking, activity, parks, and residential context", ["wolfsburg_car_parking.geojson", "wolfsburg_bus_stops.geojson", "wolfsburg_bike_parking.geojson"]),
        ("Cycling Network Analysis", "Dijkstra routing over road/footway graph, with missing infrastructure flagged", ["wolfsburg_cycling.geojson", "wolfsburg_cycling_official.geojson", "wolfsburg_roads.geojson"]),
    ]
    for name, body, files in analyses:
        srcs = [win(ROOT / "wolfsburg-activity-map" / "public" / f) if f.endswith(".geojson") else win(ROOT / "wolfsburg-activity-map" / f) for f in files]
        write(
            f"06_Site_Analysis/{name}.md",
            frontmatter(name, "analysis", srcs + [win(ROOT / "wolfsburg-activity-map" / "docs" / "MODES.md")], confidence="medium", tags=["analysis"])
            + f"# {name}\n\n"
            + f"This analysis covers {body}.\n\n"
            + "## Source Files\n\n"
            + bullets([f"`{s}`" for s in srcs])
            + "\n\n## Related\n\n"
            + bullets(["[[Wolfsburg Activity Map]]", "[[Spatial Dataset Index]]", "[[Methods and Tools Index]]"]),
        )
    write(
        "06_Site_Analysis/Car-Land Map.md",
        frontmatter(
            "Car-Land Map",
            "deliverable-analysis",
            [win(ROOT / "tasks.md"), win(ROOT / "consultations" / "2026-06-04_session.md"), win(ROOT / "project" / "rhino_masterplan.md")],
            confidence="medium",
            tags=["map", "deliverable", "car-land"],
        )
        + "# Car-Land Map\n\n"
        + "The car-land map is the highest-rhetorical-value missing deliverable. It should composite surface parking, on-street parking, garages, and car-oriented street infrastructure.\n\n"
        + "## Current Evidence\n\n"
        + bullets(
            [
                "June 4 consultation explicitly requested one graphic showing the full scale of car-dedicated land.",
                "Rhino masterplan notes say layers exist for car-land export, but the deliverable is still missing.",
                "Activity Map contains parking and road GeoJSON layers that can support an index or source note.",
            ]
        )
        + "\n\n## Related\n\n"
        + bullets(["[[Concern - Car-Land Must Be Visible]]", "[[Parking Land Evidence]]", "[[Final Presentation Outcome]]"]),
    )
    write(
        "06_Site_Analysis/Hub Coverage Map.md",
        frontmatter(
            "Hub Coverage Map",
            "deliverable-analysis",
            [win(ROOT / "tasks.md"), win(ROOT / "project" / "rhino_masterplan.md"), win(ROOT / "wolfsburg-activity-map" / "analysis" / "outputs" / "results_hub_summary.csv")],
            confidence="medium",
            tags=["map", "hub-network", "deliverable"],
        )
        + "# Hub Coverage Map\n\n"
        + "The hub coverage map should show all 68 hubs with meaningful walking catchments. A key risk is that some tool coverage radii are service ranges, not walking catchments.\n\n"
        + "## Current Status\n\n"
        + bullets(
            [
                "68 hub count is stable.",
                "Rhino/Grasshopper has hub dots and catchment preview geometry, but exports/baking remain needed.",
                "Activity Map has coverage circles and hub placement views, but radii need interpretation.",
            ]
        )
        + "\n\n## Related\n\n"
        + bullets(["[[Fleet Number Conflict]]", "[[Methodology Versus Implemented Code]]", "[[Decision - Hub Network Counts Accepted]]"]),
    )

    write(
        "07_Methods_Tools/Methods and Tools Index.md",
        frontmatter(
            "Methods and Tools Index",
            "moc",
            [win(ROOT / "web-tool" / "status.md"), win(ROOT / "rhino" / "README.md"), win(ROOT / "hub-viewer" / "README.md")],
            confidence="high",
            tags=["methods", "tools"],
        )
        + "# Methods and Tools Index\n\n"
        + bullets(
            [
                "[[Wolfsburg Activity Map]]",
                "[[Capacity Analysis Method]]",
                "[[Hub Placement Method]]",
                "[[Rhino and Grasshopper Workflow]]",
                "[[Hub Viewer]]",
                "[[Chart Generation Workflow]]",
                "[[Image Generation Workflow]]",
                "[[GitHub and Revision Trace]]",
            ]
        ),
    )
    write(
        "07_Methods_Tools/Wolfsburg Activity Map.md",
        frontmatter(
            "Wolfsburg Activity Map",
            "tool",
            [
                win(ROOT / "web-tool" / "status.md"),
                win(ROOT / "wolfsburg-activity-map" / "README.md"),
                win(ROOT / "wolfsburg-activity-map" / "CLAUDE.md"),
            ],
            confidence="high",
            tags=["tool", "activity-map"],
        )
        + "# Wolfsburg Activity Map\n\n"
        + "Interactive React/MapLibre tool for spatial analysis, capacity analysis, hub placement, urban design, and simulation placeholders. It is an analysis instrument, not the final deliverable.\n\n"
        + "## Main Sections\n\n"
        + bullets(
            [
                "Post-Car Strategy.",
                "Capacity Analysis.",
                "Hub System: geo-data analysis and hub placement.",
                "Urban Design: interactive hub typologies.",
                "Operational Simulation: in development.",
            ]
        )
        + "\n\n## Repository Status\n\n"
        + "- Separate git repo: `annestasiia/wolfsburg-activity-map`.\n"
        + "- Local branch: `master`.\n"
        + "- Main Wolfsburg repo ignores this folder.\n\n"
        + "## Related\n\n"
        + bullets(["[[Capacity Analysis Method]]", "[[Hub Placement Method]]", "[[Methodology Versus Implemented Code]]"]),
    )
    write(
        "07_Methods_Tools/Capacity Analysis Method.md",
        frontmatter(
            "Capacity Analysis Method",
            "method",
            [
                win(ROOT / "wolfsburg-activity-map" / "docs" / "capacity.md"),
                win(ROOT / "wolfsburg-activity-map" / "analysis" / "fleet_calculation.py"),
                win(ROOT / "wolfsburg-activity-map" / "src" / "utils" / "capacityCalc.js"),
            ],
            confidence="medium",
            tags=["method", "capacity"],
        )
        + "# Capacity Analysis Method\n\n"
        + "The capacity method chains baseline modal demand, post-car fleet sizing, hub count/footprint, and per-tier allocation.\n\n"
        + "## Method Chain\n\n"
        + "`modal_distribution.py -> fleet_calculation.py -> hub_calculation.py -> hub_area.py`\n\n"
        + "## Risk\n\n"
        + "Different documents and outputs contain different fleet totals. Use [[Fleet Number Conflict]] before quoting final numbers.\n",
    )
    write(
        "07_Methods_Tools/Hub Placement Method.md",
        frontmatter(
            "Hub Placement Method",
            "method",
            [
                win(ROOT / "wolfsburg-activity-map" / "src" / "utils" / "intermodalAlgorithm.js"),
                win(ROOT / "wolfsburg-activity-map" / "src" / "utils" / "hubLMAlgorithm.js"),
                win(ROOT / "project" / "hub_concept_vs_tool.md"),
            ],
            confidence="medium",
            tags=["method", "hub-placement"],
        )
        + "# Hub Placement Method\n\n"
        + "There are two implemented hub-placement logics: an intermodal bus/car candidate algorithm and an L/M parking-derived algorithm. They do not fully match the public methodology narrative.\n\n"
        + "## Implemented Logic\n\n"
        + bullets(
            [
                "Intermodal algorithm scores bus stops and car parking by nearby facilities, parks, bike parking, and residential zones, then density-thins and merges nearby bus/car pairs.",
                "Hub L/M algorithm selects multi-storey/garage and underground parking candidates by estimated area and distribution score.",
                "S-hub generation is closer to bus-stop/intermodal logic than parking logic.",
            ]
        )
        + "\n\n## Related\n\n"
        + bullets(["[[Methodology Versus Implemented Code]]", "[[Hub System Concept Versus Tool]]"]),
    )
    write(
        "07_Methods_Tools/Rhino and Grasshopper Workflow.md",
        frontmatter(
            "Rhino and Grasshopper Workflow",
            "tool",
            [win(ROOT / "project" / "rhino_masterplan.md"), win(ROOT / "rhino" / "README.md"), win(ROOT / "rhino" / "build_toolpalette.py")],
            confidence="medium",
            tags=["rhino", "grasshopper", "tool"],
        )
        + "# Rhino and Grasshopper Workflow\n\n"
        + "Rhino/Grasshopper is the spatial production layer for masterplan road hierarchy, hub points, catchments, land acquisition zones, and kit-of-parts output.\n\n"
        + "## Important Status\n\n"
        + bullets(
            [
                "The masterplan visual depends on Grasshopper preview geometry.",
                "Hub points and catchments need baking/export for stable deliverables.",
                "Source `.3dm` files are referenced but not present in this repository.",
            ]
        )
        + "\n\n## Related\n\n"
        + bullets(["[[Hub Coverage Map]]", "[[Car-Land Map]]", "[[Unreadable and External Materials]]"]),
    )
    write(
        "07_Methods_Tools/Hub Viewer.md",
        frontmatter(
            "Hub Viewer",
            "tool",
            [win(ROOT / "hub-viewer" / "README.md"), win(ROOT / "hub-viewer" / "CLAUDE.md"), win(ROOT / "hub-viewer" / "data" / "model-data.js")],
            confidence="high",
            tags=["tool", "3d", "hub-viewer"],
        )
        + "# Hub Viewer\n\n"
        + "Standalone offline 3D viewer of the mobility-hub kit, exported from Rhino. It is both a deliverable and a reusable embedded tool.\n\n"
        + "## Knowledge Role\n\n"
        + bullets(
            [
                "Makes the hub typology legible as a spatial object.",
                "Connects Rhino model data to the final presentation and Summaery kiosk.",
                "Its baked `model-data.js` is readable as data, but the original source model is external/missing from the repo.",
            ]
        )
        + "\n\n## Related\n\n"
        + bullets(["[[Hub Typology System]]", "[[Summaery Exhibition Kiosk Outcome]]"]),
    )
    write(
        "07_Methods_Tools/Chart Generation Workflow.md",
        frontmatter("Chart Generation Workflow", "tool", [win(ROOT / "charts" / "generate_charts.py")], confidence="medium", tags=["charts", "tool"])
        + "# Chart Generation Workflow\n\n"
        + "`charts/generate_charts.py` generates or supports the chart/image set used in the presentation. The charts folder contains before/after persona images, masterplan renders, problem images, and hub data visualizations.\n\n"
        + "## Related\n\n"
        + bullets(["[[Final Presentation Outcome]]", "[[Asset Index]]"]),
    )
    write(
        "07_Methods_Tools/Image Generation Workflow.md",
        frontmatter("Image Generation Workflow", "workflow", [win(ROOT / "visuals" / "image-prompts.md")], confidence="medium", tags=["image-generation", "workflow"])
        + "# Image Generation Workflow\n\n"
        + "The visuals folder contains prompt strategy, style anchors, and generated image references. It should be indexed as a design-production workflow, not as evidence.\n\n"
        + "## Related\n\n"
        + bullets(["[[Asset Index]]", "[[Final Presentation Outcome]]"]),
    )

    write(
        "08_Design_System/Design System Index.md",
        frontmatter("Design System Index", "moc", [win(ROOT / "project" / "hub_typologies.md"), win(ROOT / "project" / "rhino_toolpalette.md")], confidence="high", tags=["design-system"])
        + "# Design System Index\n\n"
        + bullets(["[[Hub Typology System]]", "[[Hub Toolpalette]]", "[[L-Anchor and L-Gateway]]", "[[Street Transformation System]]", "[[Persona Journeys]]"]),
    )
    write(
        "08_Design_System/Hub Typology System.md",
        frontmatter("Hub Typology System", "design-system", [win(ROOT / "project" / "hub_typologies.md"), win(ROOT / "research" / "03_transfer-hubs.md")], confidence="high", tags=["hub", "typology"])
        + "# Hub Typology System\n\n"
        + "The hub typology defines hubs as public-life anchors rather than mere fleet infrastructure. Tiers are spatial and civic roles, not only capacity classes.\n\n"
        + "## Tiers\n\n"
        + bullets(["S-Hub: last-metre street moment.", "M-Hub: multimodal choice point.", "L-Hub: neighbourhood anchor, later refined into L-Anchor and L-Gateway."])
        + "\n\n## Related\n\n"
        + bullets(["[[L-Anchor and L-Gateway]]", "[[Hub Toolpalette]]", "[[Decision - Hub System Resolved Concept Versus Tool]]"]),
    )
    write(
        "08_Design_System/Hub Toolpalette.md",
        frontmatter("Hub Toolpalette", "design-system", [win(ROOT / "project" / "rhino_toolpalette.md"), win(ROOT / "rhino" / "build_toolpalette.py")], confidence="medium", tags=["hub", "rhino"])
        + "# Hub Toolpalette\n\n"
        + "The Rhino kit-of-parts contains 45 reusable block elements arranged by material/category. It translates typology logic into modelable components.\n\n"
        + "## Related\n\n"
        + bullets(["[[Hub Typology System]]", "[[Hub Viewer]]", "[[Rhino and Grasshopper Workflow]]"]),
    )
    write(
        "08_Design_System/L-Anchor and L-Gateway.md",
        frontmatter("L-Anchor and L-Gateway", "design-decision", [win(ROOT / "decisions.md"), win(ROOT / "project" / "hub_concept_vs_tool.md")], confidence="high", tags=["hub", "decision"])
        + "# L-Anchor and L-Gateway\n\n"
        + "The June 17 resolution splits the L-hub idea into two public roles.\n\n"
        + bullets(
            [
                "L-Anchor: central reuse of former multi-storey car parks as mixed public anchors.",
                "L-Gateway: edge fleet depot and park-and-switch interchange for inbound commuters.",
            ]
        )
        + "\n\n## Unresolved\n\n"
        + "Whether L-Gateways count toward the six public L-hubs remains an implementation question.\n\n"
        + "## Related\n\n"
        + bullets(["[[Methodology Versus Implemented Code]]", "[[Hub System Concept Versus Tool]]"]),
    )
    write(
        "08_Design_System/Street Transformation System.md",
        frontmatter("Street Transformation System", "design-system", [win(ROOT / "charts"), win(ROOT / "project" / "current.md")], confidence="medium", tags=["streets", "before-after"])
        + "# Street Transformation System\n\n"
        + "Street transformation is shown through before/after images, lane reductions, parking removal, cycling infrastructure, greenery, and public life.\n\n"
        + "## Related\n\n"
        + bullets(["[[Final Presentation Outcome]]", "[[Car-Land Map]]", "[[Risk - Political Acceptance]]"]),
    )
    write(
        "08_Design_System/Persona Journeys.md",
        frontmatter("Persona Journeys", "design-system", [win(ROOT / "charts"), win(ROOT / "tasks.md"), win(ROOT / "project" / "deliverables.md")], confidence="medium", tags=["persona", "journey"])
        + "# Persona Journeys\n\n"
        + "Persona journeys translate system proof into lived experience. The repository includes persona before/after visual sets for Sabine, Lukas, Thomas, and Gertrude; the Anna/VW-worker journey remains a named required deliverable.\n\n"
        + "## Related\n\n"
        + bullets(["[[Proof Framework]]", "[[VW Shift-Wave Simulation]]", "[[Final Presentation Outcome]]"]),
    )


def write_deliverables_risks() -> None:
    write(
        "09_Deliverables_Exhibition/Deliverables Index.md",
        frontmatter("Deliverables Index", "moc", [win(ROOT / "project" / "deliverables.md"), win(ROOT / "tasks.md")], confidence="high", tags=["deliverables"])
        + "# Deliverables Index\n\n"
        + bullets(
            [
                "[[Final Presentation Outcome]]",
                "[[Summaery Exhibition Kiosk Outcome]]",
                "[[Exhibition Alternatives]]",
                "[[VW Shift-Wave Simulation]]",
                "[[Car-Land Map]]",
                "[[Hub Coverage Map]]",
                "[[Street Transformation System]]",
                "[[Persona Journeys]]",
            ]
        ),
    )
    write(
        "09_Deliverables_Exhibition/Final Presentation Outcome.md",
        frontmatter("Final Presentation Outcome", "outcome", [win(ROOT / "final-presentation" / "index.html"), win(ROOT / "charts"), win(ROOT / "sessions" / "2026-06-21_html-presentation" / "notes.md")], confidence="high", tags=["presentation", "outcome"])
        + "# Final Presentation Outcome\n\n"
        + "The final presentation is a scroll-based HTML site carrying the project narrative, masterplan views, hub charts, before/after imagery, and embedded hub-viewer references.\n\n"
        + "## Related\n\n"
        + bullets(["[[Project Thesis - stadt.hub]]", "[[Core Numbers and Proof Claims]]", "[[Asset Index]]"]),
    )
    write(
        "09_Deliverables_Exhibition/Summaery Exhibition Kiosk Outcome.md",
        frontmatter("Summaery Exhibition Kiosk Outcome", "outcome", [win(ROOT / "exhibition" / "kiosk" / "index.html"), win(ROOT / "exhibition" / "kiosk" / "kiosk.js"), win(ROOT / "sessions" / "2026-07-06_summaery-kiosk" / "notes.md")], confidence="high", tags=["exhibition", "kiosk", "outcome"])
        + "# Summaery Exhibition Kiosk Outcome\n\n"
        + "The July 6 pivot produced a one-screen self-running kiosk: question-led beats, typed headlines, map stills, before/after material, locked numbers, and a final live hub-viewer camera tour.\n\n"
        + "## Knowledge Role\n\n"
        + bullets(
            [
                "Responds to the unattended Summaery constraint.",
                "Turns the web/presentation ecosystem into a durable exhibition object.",
                "Supersedes earlier multi-station alternatives while preserving their content as reference.",
            ]
        )
        + "\n\n## Related\n\n"
        + bullets(["[[Summaery Exhibition Constraint]]", "[[Exhibition Alternatives]]", "[[Hub Viewer]]"]),
    )
    write(
        "09_Deliverables_Exhibition/Exhibition Alternatives.md",
        frontmatter("Exhibition Alternatives", "deliverable-history", [win(ROOT / "exhibition" / "alt-1-stations" / "concept.md"), win(ROOT / "exhibition" / "alt-2-parking-space" / "concept.md"), win(ROOT / "exhibition" / "README.md")], confidence="high", tags=["exhibition", "history"])
        + "# Exhibition Alternatives\n\n"
        + "Before the one-screen pivot, the repository developed two Summaery concepts: Station Constellation and One Parking Space. They are superseded but remain important design-history and copy sources.\n\n"
        + "## Related\n\n"
        + bullets(["[[Summaery Exhibition Kiosk Outcome]]", "[[Concern - Exhibition Legibility]]"]),
    )
    write(
        "09_Deliverables_Exhibition/VW Shift-Wave Simulation.md",
        frontmatter("VW Shift-Wave Simulation", "deliverable", [win(ROOT / "tasks.md"), win(ROOT / "project" / "deliverables.md"), win(ROOT / "research" / "10_moia-mia-precedent.md")], confidence="medium", tags=["simulation", "deliverable"])
        + "# VW Shift-Wave Simulation\n\n"
        + "The VW shift-wave simulation is a required proof deliverable: show how the fleet handles roughly 10,000 workers in about one hour.\n\n"
        + "## Current Status\n\n"
        + "The logic is identified, but a finished visualization/simulation remains unresolved in the task list.\n\n"
        + "## Related\n\n"
        + bullets(["[[Wolfsburg as Testbed]]", "[[Capacity Analysis Method]]", "[[MOIA and MIA Precedent]]"]),
    )

    write(
        "11_Risks_Open_Questions/Risks and Open Questions Index.md",
        frontmatter("Risks and Open Questions Index", "moc", [win(ROOT / "research" / "07_weak-points-actions.md"), win(ROOT / "HANDOFF.md"), win(ROOT / "tasks.md")], confidence="high", tags=["risk"])
        + "# Risks and Open Questions Index\n\n"
        + bullets(
            [
                "[[Fleet Number Conflict]]",
                "[[Methodology Versus Implemented Code]]",
                "[[Hub System Concept Versus Tool]]",
                "[[Unreadable and External Materials]]",
                "[[Risk - AV Realism]]",
                "[[Risk - Political Acceptance]]",
            ]
        ),
    )
    write(
        "11_Risks_Open_Questions/Fleet Number Conflict.md",
        frontmatter("Fleet Number Conflict", "risk", [win(ROOT / "decisions.md"), win(ROOT / "HANDOFF.md"), win(ROOT / "wolfsburg-activity-map" / "analysis" / "outputs" / "results_fleet.csv"), win(ROOT / "wolfsburg-activity-map" / "docs" / "capacity.md")], confidence="high", tags=["risk", "numbers"])
        + "# Fleet Number Conflict\n\n"
        + "There are conflicting fleet totals across the project ecosystem.\n\n"
        + "## Known Values\n\n"
        + bullets(
            [
                "`decisions.md` and locked design memory: 763 total vehicles.",
                "`results_fleet.csv`: 1,273 total vehicles, including 641 e-bikes.",
                "`docs/capacity.md` text also references an approximate ~632 shared units in one method section.",
            ]
        )
        + "\n\n## Why It Matters\n\n"
        + "Fleet size drives hub capacity, charging, footprint, public claims, and exhibition/presentation credibility.\n\n"
        + "## Recommended Treatment\n\n"
        + "Keep 763 as the design-locked number only if the team confirms it. Otherwise treat all fleet figures as unresolved until a canonical calculation is selected.\n",
    )
    write(
        "11_Risks_Open_Questions/Methodology Versus Implemented Code.md",
        frontmatter("Methodology Versus Implemented Code", "risk", [win(ROOT / "project" / "hub_concept_vs_tool.md"), win(ROOT / "wolfsburg-activity-map" / "src" / "components" / "HubAlgoPanel.jsx"), win(ROOT / "wolfsburg-activity-map" / "src" / "utils" / "hubLMAlgorithm.js")], confidence="high", tags=["risk", "methodology"])
        + "# Methodology Versus Implemented Code\n\n"
        + "The public methodology narrative describes MCLP, AHP, KDE, Moran's I, isochrones, and grid candidates. The implemented code is much simpler and uses parking/bus candidates, greedy selection, and fixed radii.\n\n"
        + "## Risk\n\n"
        + "If jurors inspect the public methodology page, the project may overclaim its computational method.\n\n"
        + "## Response Options\n\n"
        + bullets(
            [
                "Revise public methodology text to match implemented code.",
                "Implement the described method.",
                "Clearly label advanced methods as planned/future methodology.",
            ]
        )
        + "\n\n## Related\n\n"
        + bullets(["[[Hub Placement Method]]", "[[Hub System Concept Versus Tool]]"]),
    )
    write(
        "11_Risks_Open_Questions/Hub System Concept Versus Tool.md",
        frontmatter("Hub System Concept Versus Tool", "risk", [win(ROOT / "project" / "hub_concept_vs_tool.md")], confidence="high", tags=["risk", "hub"])
        + "# Hub System Concept Versus Tool\n\n"
        + "Three models of the hub system coexist: design concept, implemented web-tool code, and public methodology text. The June 17 decision resolves the design concept but leaves implementation gaps.\n\n"
        + "## Key Resolution\n\n"
        + "Separate where a hub is placed from what a hub is. Parking infrastructure can support location/service logic, while the surface hub remains a public place.\n\n"
        + "## Open Implementation Gaps\n\n"
        + bullets(
            [
                "L-Gateways counting toward the six L-hub total.",
                "Central L-Anchor placement while code excludes some central districts.",
                "Walking catchments versus service radii.",
                "Public methodology page versus actual algorithms.",
            ]
        ),
    )
    write(
        "11_Risks_Open_Questions/Unreadable and External Materials.md",
        frontmatter("Unreadable and External Materials", "risk", [win(ROOT / "project" / "rhino_masterplan.md"), win(ROOT / "hub-viewer" / "README.md"), win(ROOT / "wolfsburg-activity-map" / "cycle paths")], confidence="high", tags=["risk", "assets"])
        + "# Unreadable and External Materials\n\n"
        + "Some materials cannot be fully parsed as text or are not present in the repository.\n\n"
        + "## Materials\n\n"
        + bullets(
            [
                "Rhino `.3dm` masterplan and toolpalette source models are referenced but not present in the repo.",
                "Hub Viewer contains baked geometry in `model-data.js`, which is not equivalent to the editable Rhino source.",
                "Videos and most rendered images require visual review, not text extraction.",
                "Shapefile/DBF cycling data should be indexed as spatial source material.",
            ]
        ),
    )


def write_fundamental_concepts() -> None:
    common_sources = {
        "core": [ROOT / "project" / "current.md", ROOT / "README.md", ROOT / "HANDOFF.md"],
        "decisions": [ROOT / "decisions.md", ROOT / "tasks.md"],
        "feedback": [ROOT / "consultations" / "2026-06-04_session.md", ROOT / "consultations" / "2026-06-11_session.md"],
        "research": [ROOT / "research" / "README.md", ROOT / "research" / "06_arguments-evidence.md", ROOT / "research" / "07_weak-points-actions.md"],
        "activity": [ROOT / "web-tool" / "status.md", ROOT / "wolfsburg-activity-map" / "docs" / "MODES.md", ROOT / "wolfsburg-activity-map" / "CLAUDE.md"],
        "rhino": [ROOT / "project" / "rhino_masterplan.md", ROOT / "rhino" / "README.md"],
        "exhibition": [ROOT / "exhibition" / "README.md", ROOT / "sessions" / "2026-07-06_summaery-kiosk" / "notes.md"],
    }

    def src(*keys: str) -> list[str]:
        paths: list[Path] = []
        for key in keys:
            paths.extend(common_sources[key])
        seen = []
        for path in paths:
            w = win(path)
            if w not in seen:
                seen.append(w)
        return seen

    concepts = [
        {
            "title": "Post-Car City",
            "cluster": "Project Frame",
            "definition": "A city model where private car ownership no longer organizes everyday access, land allocation, and street design.",
            "why": "This is the project's horizon. It turns mobility from a vehicle question into an urban form question.",
            "distinguish": "Not a city without all vehicles. It is a city no longer structured around privately stored cars.",
            "links": ["Project Thesis - stadt.hub", "Hub City", "Private Car Ownership", "Reclaimed Land"],
            "sources": src("core", "research"),
        },
        {
            "title": "Parking City",
            "cluster": "Project Frame",
            "definition": "The existing condition in which land, streets, and buildings are organized around storing and moving private cars.",
            "why": "It is the problem condition the project wants to make visible.",
            "distinguish": "Not only surface parking lots. It includes garages, on-street parking, overwide roads, and car-first access logic.",
            "links": ["Car-Dedicated Land", "Parking Land Evidence", "Car-Land Composite", "Project Thesis - stadt.hub"],
            "sources": src("core", "feedback", "research"),
        },
        {
            "title": "Hub City",
            "cluster": "Project Frame",
            "definition": "The proposed condition in which shared access is organized through a network of mobility hubs rather than private parking.",
            "why": "It is the project's main transformation: Parking City -> Hub City.",
            "distinguish": "Not just replacing parking lots with stations. It requires public-life programming, network proof, and phased behavior change.",
            "links": ["Mobility Hub", "Hub as Place", "Shared Mobility", "Project Thesis - stadt.hub"],
            "sources": src("core", "decisions"),
        },
        {
            "title": "Car Dependency",
            "cluster": "Project Frame",
            "definition": "A spatial and behavioral condition where daily life is easiest, fastest, or most normal by private car.",
            "why": "It explains why Wolfsburg needs more than a new transport app; the city form itself makes car use rational.",
            "distinguish": "Not only personal preference. It is produced by infrastructure, parking availability, trip patterns, and cultural expectation.",
            "links": ["Private Car Ownership", "Parking City", "Modal Shift", "Risk - Political Acceptance"],
            "sources": src("research", "feedback"),
        },
        {
            "title": "Private Car Ownership",
            "cluster": "Project Frame",
            "definition": "The model in which mobility access is tied to individually owned cars that are idle most of the day.",
            "why": "The project attacks the land cost of ownership, not only the emissions of driving.",
            "distinguish": "Different from car use. A shared car can exist in the future system without recreating private storage demand.",
            "links": ["Car-Dedicated Land", "Shared Mobility", "Fleet", "Post-Car City"],
            "sources": src("core", "research"),
        },
        {
            "title": "Car-Dedicated Land",
            "cluster": "Project Frame",
            "definition": "Urban land used primarily for private car storage, circulation, access, and residual road capacity.",
            "why": "This is the spatial budget of the project. Reclaiming it creates the urban design payoff.",
            "distinguish": "Broader than parking. It includes overbuilt roads and car-oriented fragments that prevent public life.",
            "links": ["Parking City", "Car-Land Composite", "Reclaimed Land", "Car-Land Map"],
            "sources": src("core", "feedback", "research", "rhino"),
        },
        {
            "title": "Reclaimed Land",
            "cluster": "Project Frame",
            "definition": "Space released from car storage or car-priority circulation and reassigned to public life, greenery, housing, or civic use.",
            "why": "It is the benefit side of the mobility argument.",
            "distinguish": "Not automatically green space. It requires design decisions about program, ownership, access, and maintenance.",
            "links": ["Car-Dedicated Land", "Public Life", "Street Transformation", "Risk - Political Acceptance"],
            "sources": src("core", "research"),
        },
        {
            "title": "Public Life",
            "cluster": "Project Frame",
            "definition": "The social, civic, ecological, and everyday uses that can occupy land once it is not dominated by parked cars.",
            "why": "It keeps the project from becoming only a mobility optimization exercise.",
            "distinguish": "Not decorative streetscape. It is the actual urban reason to reorganize mobility.",
            "links": ["Hub as Place", "Reclaimed Land", "Street Transformation", "Self-Explanatory Exhibit"],
            "sources": src("core", "feedback", "research"),
        },
        {
            "title": "Urban Proof",
            "cluster": "Project Frame",
            "definition": "A design argument supported by spatial evidence, operational logic, and legible deliverables.",
            "why": "Tutor feedback shifted the project from compelling images to proof.",
            "distinguish": "Not just numeric proof. In this project, proof includes maps, journeys, sections, and exhibition communication.",
            "links": ["Proof Framework", "Critique Concern", "Deliverable", "Evidence Claim"],
            "sources": src("feedback", "core"),
        },
        {
            "title": "Shared Mobility",
            "cluster": "Mobility System",
            "definition": "A mobility model where vehicles are accessed as a service and used by many people across the day.",
            "why": "It is the operational mechanism that allows far fewer vehicles to replace many private cars.",
            "distinguish": "Not the same as public transport. It includes bikes, pods, shuttles, car-share EVs, and buses.",
            "links": ["Fleet", "Fleet Sizing", "Mobility as a Service", "Private Car Ownership"],
            "sources": src("core", "research", "activity"),
        },
        {
            "title": "Mobility as a Service",
            "cluster": "Mobility System",
            "definition": "A service model where access to multiple transport modes is coordinated as a user-facing system.",
            "why": "It supports the claim that mobility can be reliable without ownership.",
            "distinguish": "Not just an app. The repository repeatedly warns against reducing the project to tech-saviour framing.",
            "links": ["Shared Mobility", "Intermodal Transfer", "Risk - Political Acceptance", "MOIA and MIA Precedent"],
            "sources": src("research", "activity"),
        },
        {
            "title": "Autonomous Mobility",
            "cluster": "Mobility System",
            "definition": "Driverless or partially driverless transport modes used in the future shared fleet scenario.",
            "why": "It allows high utilization and flexible dispatch in the project story.",
            "distinguish": "A risk-bearing assumption, not a guaranteed present-day condition.",
            "links": ["Risk - AV Realism", "Fleet", "VW Shift Wave", "MOIA and MIA Precedent"],
            "sources": src("research", "decisions"),
        },
        {
            "title": "Electric Mobility",
            "cluster": "Mobility System",
            "definition": "The electric vehicle layer of the shared system, including charging needs and operational reserves.",
            "why": "It affects hub footprints, charging points, and fleet infrastructure.",
            "distinguish": "Electrification alone does not solve car-land consumption.",
            "links": ["Fleet", "Hub as Infrastructure", "Capacity Analysis Method", "Core Numbers and Proof Claims"],
            "sources": src("activity", "research"),
        },
        {
            "title": "Multimodal Network",
            "cluster": "Mobility System",
            "definition": "A network where walking, cycling, buses, shuttles, pods, e-bikes, and shared EVs work together.",
            "why": "The project depends on combining modes, not on one perfect vehicle type.",
            "distinguish": "Different from mode stacking. The modes must connect spatially at hubs and operationally through the system.",
            "links": ["Mobility Hub", "Intermodal Transfer", "Cycling Network", "Hub City"],
            "sources": src("core", "activity"),
        },
        {
            "title": "Intermodal Transfer",
            "cluster": "Mobility System",
            "definition": "The moment or place where a user changes from one mode to another.",
            "why": "Hubs must make transfers easy, legible, and comfortable.",
            "distinguish": "Not just proximity of vehicles. It includes waiting, wayfinding, accessibility, and safety.",
            "links": ["Mobility Hub", "M-Hub", "Hub as Place", "Hub Placement Algorithm"],
            "sources": src("research", "activity"),
        },
        {
            "title": "Fleet",
            "cluster": "Mobility System",
            "definition": "The total set of shared vehicles that replaces private car trips in the proposal.",
            "why": "Fleet size drives capacity, hub footprint, charging needs, and proof credibility.",
            "distinguish": "Not the same as vehicles on street at one moment. It includes reserves, charging, and maintenance.",
            "links": ["Fleet Sizing", "Peak Hour Demand", "Fleet Number Conflict", "Capacity Analysis Method"],
            "sources": src("core", "activity", "decisions"),
        },
        {
            "title": "Fleet Sizing",
            "cluster": "Mobility System",
            "definition": "The method for translating trip demand, capacity, trip duration, and reserve factors into a fleet count.",
            "why": "It is one of the key proofs requested by reviewers.",
            "distinguish": "Not a single stable number yet. The vault records conflicting totals.",
            "links": ["Fleet", "Capacity Analysis Method", "Fleet Number Conflict", "VW Shift-Wave Simulation"],
            "sources": src("activity", "decisions"),
        },
        {
            "title": "Peak Hour Demand",
            "cluster": "Mobility System",
            "definition": "The maximum hourly load the system must handle, especially the 08:00 commuter peak.",
            "why": "Fleet sizing is governed by peak load more than by daily totals.",
            "distinguish": "Different from daily demand. A city can have manageable daily totals but fail at peaks.",
            "links": ["VW Shift Wave", "Fleet Sizing", "Core Numbers and Proof Claims", "Wolfsburg as Testbed"],
            "sources": src("activity", "core"),
        },
        {
            "title": "VW Shift Wave",
            "cluster": "Mobility System",
            "definition": "The predictable arrival/departure wave of Volkswagen workers used as the project's proof case.",
            "why": "It makes Wolfsburg a strong testbed because concentrated demand can be planned and modeled.",
            "distinguish": "Not the whole mobility system. It is the most difficult and persuasive case study.",
            "links": ["Wolfsburg as Testbed", "Peak Hour Demand", "VW Shift-Wave Simulation", "Decision - VW Factory Hub Case Study"],
            "sources": src("core", "feedback", "activity"),
        },
        {
            "title": "Modal Shift",
            "cluster": "Mobility System",
            "definition": "A change in how people choose between car, walking, public transport, cycling, and shared modes.",
            "why": "The project must explain not only infrastructure but behavior change.",
            "distinguish": "Not automatic. It requires convenience, constraints, incentives, and positive visions.",
            "links": ["Car Dependency", "Filtered Permeability", "Risk - Political Acceptance", "Behavioral Shift Research"],
            "sources": src("research", "feedback"),
        },
        {
            "title": "Mobility Hub",
            "cluster": "Hub System",
            "definition": "A spatial node where shared modes, transfers, charging, wayfinding, and public-life functions meet.",
            "why": "It replaces parking as the project's organizing element.",
            "distinguish": "Not merely a garage or depot. The design concept protects the hub as a public place.",
            "links": ["Hub as Place", "Hub as Infrastructure", "Hub Tier", "Hub Typology System"],
            "sources": src("core", "research", "decisions"),
        },
        {
            "title": "Hub as Place",
            "cluster": "Hub System",
            "definition": "The idea that a hub must create public presence, identity, comfort, and social value.",
            "why": "It guards the project from becoming a hidden fleet logistics proposal.",
            "distinguish": "Different from hub as depot. A place is experienced by residents and visitors.",
            "links": ["Public Life", "Hub Typology System", "L-Anchor", "M-Hub"],
            "sources": src("decisions", "research"),
        },
        {
            "title": "Hub as Infrastructure",
            "cluster": "Hub System",
            "definition": "The operational side of hubs: charging, storage, maintenance, dispatch, and transfer capacity.",
            "why": "The system cannot work if the public-space concept ignores operational needs.",
            "distinguish": "Different from hub as place, but both must coexist.",
            "links": ["Electric Mobility", "L-Gateway", "Fleet", "Hub System Concept Versus Tool"],
            "sources": src("decisions", "activity"),
        },
        {
            "title": "Hub Tier",
            "cluster": "Hub System",
            "definition": "A hierarchy of hub roles and scales: S, M, and L.",
            "why": "Tiering makes the network legible and distributes functions across the city.",
            "distinguish": "Not just size. Tiers include urban role, catchment, vehicle mix, and spatial expression.",
            "links": ["S-Hub", "M-Hub", "L-Hub", "Hub Typology System"],
            "sources": src("core", "decisions", "research"),
        },
        {
            "title": "S-Hub",
            "cluster": "Hub System",
            "definition": "The smallest hub tier: a last-metre street node for e-bikes, pods, and local access.",
            "why": "S-hubs provide fine-grain coverage and make the system walkable.",
            "distinguish": "Least parking-bound tier; placement is closer to transit/activity logic than parking-structure logic.",
            "links": ["Hub Tier", "Walking Catchment", "Grasshopper Placement", "Decision - Small Hub Placement via Grasshopper"],
            "sources": src("decisions", "activity", "research"),
        },
        {
            "title": "M-Hub",
            "cluster": "Hub System",
            "definition": "The medium hub tier: a district-level multimodal choice point, resolved as parking-served surface typology.",
            "why": "M-hubs connect local access to the wider shared fleet.",
            "distinguish": "Not simply an underground parking site; the public surface hub remains essential.",
            "links": ["Hub Tier", "Intermodal Transfer", "Hub as Place", "Hub System Concept Versus Tool"],
            "sources": src("decisions", "activity"),
        },
        {
            "title": "L-Hub",
            "cluster": "Hub System",
            "definition": "The large hub tier, originally linked to repurposed multi-storey car parks and later split into L-Anchor and L-Gateway roles.",
            "why": "L-hubs carry the strongest symbolic and operational burden.",
            "distinguish": "Do not collapse L-Anchor and L-Gateway into one undifferentiated garage.",
            "links": ["L-Anchor", "L-Gateway", "Hub Tier", "Decision - L-Hubs Reuse Multi-Storey Car Parks"],
            "sources": src("decisions", "core"),
        },
        {
            "title": "L-Anchor",
            "cluster": "Hub System",
            "definition": "A central L-hub subtype that reuses a car-park building as a mixed public neighbourhood anchor.",
            "why": "It protects the spatial/public-life thesis of the large hub.",
            "distinguish": "Different from an edge fleet depot. It is central, programmatic, and civic.",
            "links": ["L-Hub", "Hub as Place", "L-Anchor and L-Gateway", "Hub System Concept Versus Tool"],
            "sources": src("decisions"),
        },
        {
            "title": "L-Gateway",
            "cluster": "Hub System",
            "definition": "An edge L-hub subtype for fleet depot, maintenance, charging, and park-and-switch interchange.",
            "why": "It resolves the problem of where private regional car access meets the post-car center.",
            "distinguish": "Different from a central public anchor. Its public role is threshold and interchange.",
            "links": ["L-Hub", "Hub as Infrastructure", "Filtered Permeability", "L-Anchor and L-Gateway"],
            "sources": src("decisions"),
        },
        {
            "title": "Catchment Area",
            "cluster": "Hub System",
            "definition": "The area considered served by a hub or mobility node.",
            "why": "Coverage claims depend on what counts as served.",
            "distinguish": "Can be walking catchment or service radius; mixing these creates confusion.",
            "links": ["Walking Catchment", "Service Radius", "Coverage", "Hub Coverage Map"],
            "sources": src("core", "activity"),
        },
        {
            "title": "Walking Catchment",
            "cluster": "Hub System",
            "definition": "A human-scale access radius based on how far a user can reasonably walk to a hub.",
            "why": "It tests whether the network is usable in everyday life.",
            "distinguish": "Different from service radius used for fleet operations or large coverage graphics.",
            "links": ["Catchment Area", "Service Radius", "S-Hub", "Hub Coverage Map"],
            "sources": src("core", "decisions"),
        },
        {
            "title": "Service Radius",
            "cluster": "Hub System",
            "definition": "A larger operational radius describing fleet service reach or analytical coverage.",
            "why": "Some Activity Map radii read as service ranges rather than walking access.",
            "distinguish": "Do not present service radius as walking catchment without explanation.",
            "links": ["Catchment Area", "Walking Catchment", "Methodology Versus Implemented Code", "Hub System Concept Versus Tool"],
            "sources": src("activity", "decisions"),
        },
        {
            "title": "Coverage",
            "cluster": "Hub System",
            "definition": "The claimed share of people, area, demand, or destinations served by the proposed system.",
            "why": "Coverage is one of the main proof metrics.",
            "distinguish": "Always ask: coverage of what, by which radius, and for whom?",
            "links": ["Catchment Area", "Hub Coverage Graphic", "Hub Coverage Map", "Core Numbers and Proof Claims"],
            "sources": src("activity", "core"),
        },
        {
            "title": "Activity Map",
            "cluster": "Methods and Evidence",
            "definition": "The interactive web tool used to analyze mobility, facilities, greenery, hub placement, capacity, and urban design.",
            "why": "It is the main computational instrument behind many maps and claims.",
            "distinguish": "Not the final project deliverable; it is a design and proof instrument.",
            "links": ["Wolfsburg Activity Map", "GeoJSON Layer", "Capacity Analysis", "Hub Placement Algorithm"],
            "sources": src("activity"),
        },
        {
            "title": "GeoJSON Layer",
            "cluster": "Methods and Evidence",
            "definition": "A spatial data file containing map features such as roads, parking, parks, transit, or facilities.",
            "why": "Most Activity Map analyses are built from GeoJSON layers.",
            "distinguish": "A data layer is not yet an insight. It needs method, interpretation, and design response.",
            "links": ["OSM Data", "Spatial Dataset Index", "Activity Map", "Site Analysis Index"],
            "sources": src("activity"),
        },
        {
            "title": "OSM Data",
            "cluster": "Methods and Evidence",
            "definition": "OpenStreetMap-derived geographic data used for roads, parking, transit, parks, cycling, and facilities.",
            "why": "It is the main spatial data source for the tool.",
            "distinguish": "OSM data is uneven and requires preprocessing; do not treat it as municipal certainty without checking.",
            "links": ["GeoJSON Layer", "Spatial Dataset Index", "Hub Placement Algorithm", "Cycling Network"],
            "sources": src("activity"),
        },
        {
            "title": "Facilities Dataset",
            "cluster": "Methods and Evidence",
            "definition": "The Excel and derived facility layers describing destinations, categories, activity intensity, and time patterns.",
            "why": "It grounds hub placement in where people actually go and when activity happens.",
            "distinguish": "Different from OSM facilities alone; the project also uses team-prepared Excel input.",
            "links": ["Facilities and Activity Dataset", "Activity Map", "Hub Placement Algorithm", "Peak Hour Demand"],
            "sources": [win(ROOT / "wolfsburg-activity-map" / "wolfsburg_hotspots_v2.xlsx"), *src("activity")],
        },
        {
            "title": "Green Social Vitality",
            "cluster": "Methods and Evidence",
            "definition": "A composite reading of green coverage, social density, accessibility, transit, and pedestrian path density.",
            "why": "It connects reclaimed land to social and ecological need.",
            "distinguish": "Not only a park map. It asks where public life conditions are weak or strong.",
            "links": ["Greenery and Social Vitality Analysis", "Reclaimed Land", "Public Life", "Activity Map"],
            "sources": src("activity"),
        },
        {
            "title": "Cycling Network",
            "cluster": "Methods and Evidence",
            "definition": "The proposed or analyzed bike network connecting hubs, settlements, and destinations.",
            "why": "Cycling is a practical mode that supports the post-car shift before full autonomy is mature.",
            "distinguish": "Not just existing cycle paths. It includes missing protected segments flagged for intervention.",
            "links": ["Cycling Network Analysis", "Dijkstra Routing", "Modal Shift", "Street Transformation"],
            "sources": src("activity"),
        },
        {
            "title": "Dijkstra Routing",
            "cluster": "Methods and Evidence",
            "definition": "A shortest-path algorithm used to route cycling connections through weighted street networks.",
            "why": "It gives the cycling network a reproducible routing method.",
            "distinguish": "It finds least-cost paths according to chosen weights; the weights are design assumptions.",
            "links": ["Cycling Network", "Cycling Network Analysis", "Implemented Method", "Activity Map"],
            "sources": [win(ROOT / "wolfsburg-activity-map" / "src" / "utils" / "radAlgorithm.js"), *src("activity")],
        },
        {
            "title": "Grasshopper Placement",
            "cluster": "Methods and Evidence",
            "definition": "Parametric/algorithmic placement logic used especially for the 43 S-hubs and Rhino masterplan previews.",
            "why": "It makes large numbers of small hubs manageable and supports exportable masterplan geometry.",
            "distinguish": "Not a substitute for design judgment at M and L scales.",
            "links": ["S-Hub", "Rhino and Grasshopper Workflow", "Decision - Small Hub Placement via Grasshopper", "Hub Placement Algorithm"],
            "sources": src("rhino", "decisions"),
        },
        {
            "title": "Hub Placement Algorithm",
            "cluster": "Methods and Evidence",
            "definition": "The computational logic that proposes or ranks hub locations from candidate data.",
            "why": "It connects site analysis to the spatial hub network.",
            "distinguish": "There are multiple hub placement logics in the repo; do not treat them as one method.",
            "links": ["Hub Placement Method", "Method Claim", "Implemented Method", "Hub System Concept Versus Tool"],
            "sources": src("activity", "decisions"),
        },
        {
            "title": "Capacity Analysis",
            "cluster": "Methods and Evidence",
            "definition": "The calculation layer for baseline demand, fleet sizing, hub count, charging, and footprint.",
            "why": "It is the quantitative proof layer of the proposal.",
            "distinguish": "The method is useful, but its output numbers must be reconciled.",
            "links": ["Capacity Analysis Method", "Fleet Sizing", "Fleet Number Conflict", "Core Numbers and Proof Claims"],
            "sources": src("activity"),
        },
        {
            "title": "Method Claim",
            "cluster": "Methods and Evidence",
            "definition": "A statement about what analytical method the project says it uses.",
            "why": "Public-facing method claims must match the actual code or be clearly marked as planned.",
            "distinguish": "Different from implemented method. A claim can be aspirational, outdated, or wrong.",
            "links": ["Implemented Method", "Methodology Versus Implemented Code", "Hub Placement Algorithm"],
            "sources": src("activity"),
        },
        {
            "title": "Implemented Method",
            "cluster": "Methods and Evidence",
            "definition": "The method actually present in the code or scripts.",
            "why": "It is the defensible basis for tool-generated outputs.",
            "distinguish": "Different from public methodology text, which may be more ambitious.",
            "links": ["Method Claim", "Dijkstra Routing", "Capacity Analysis", "Methodology Versus Implemented Code"],
            "sources": src("activity"),
        },
        {
            "title": "Source Traceability",
            "cluster": "Knowledge System",
            "definition": "The practice of keeping every vault note linked back to original repository paths.",
            "why": "It makes the vault auditable and prevents the graph from becoming detached interpretation.",
            "distinguish": "Not citation polish. It is the backbone of trust in the vault.",
            "links": ["Markdown Source Inventory", "Asset Index", "Uncertain Inference"],
            "sources": [win(ROOT / "codex-work" / "build_obsidian_vault.py"), win(ROOT / "README.md")],
        },
        {
            "title": "Uncertain Inference",
            "cluster": "Knowledge System",
            "definition": "A conclusion drawn from sources but not directly stated by them.",
            "why": "The vault should preserve useful interpretation without pretending it is source fact.",
            "distinguish": "Different from evidence claim. It must be marked as inference.",
            "links": ["Source Traceability", "Evidence Claim", "Risk Register", "Unreadable and External Materials"],
            "sources": [win(ROOT / "codex-work" / "build_obsidian_vault.py")],
        },
        {
            "title": "Evidence Claim",
            "cluster": "Knowledge System",
            "definition": "A project statement backed by a source, number, precedent, or documented method.",
            "why": "The competition narrative depends on claims that can survive questions.",
            "distinguish": "Different from design ambition. Evidence claims need source trace.",
            "links": ["Research and Evidence Index", "Source Traceability", "Urban Proof", "Core Numbers and Proof Claims"],
            "sources": src("research"),
        },
        {
            "title": "Critique Concern",
            "cluster": "Knowledge System",
            "definition": "A problem, doubt, or direction raised through tutor/reviewer feedback.",
            "why": "Concerns explain why revisions happened.",
            "distinguish": "Not all feedback is a decision. A concern becomes project knowledge when it changes work.",
            "links": ["Feedback and Critique Index", "Design Decision", "Revision Thread", "Urban Proof"],
            "sources": src("feedback"),
        },
        {
            "title": "Design Decision",
            "cluster": "Knowledge System",
            "definition": "A formally chosen project direction that should not be re-litigated unless reopened.",
            "why": "Decisions stabilize the project across sessions and tools.",
            "distinguish": "Different from open task, idea, or critique concern.",
            "links": ["Decision Index", "Critique Concern", "Revision Thread", "Hub System Concept Versus Tool"],
            "sources": src("decisions"),
        },
        {
            "title": "Revision Thread",
            "cluster": "Knowledge System",
            "definition": "A sequence of feedback, work sessions, commits, and outputs that shows design evolution.",
            "why": "It makes the project history legible.",
            "distinguish": "Different from a single decision. It is a chain over time.",
            "links": ["Revision Threads", "Timeline and Sessions Index", "GitHub and Revision Trace", "Design Decision"],
            "sources": [win(ROOT / "sessions" / "INDEX.md"), win(ROOT / "notes.md")],
        },
        {
            "title": "Deliverable",
            "cluster": "Knowledge System",
            "definition": "A concrete output required for studio, exhibition, competition, or project proof.",
            "why": "Deliverables turn concept and analysis into reviewable artifacts.",
            "distinguish": "Different from a method or source. It is what someone can see, present, submit, or test.",
            "links": ["Deliverables Index", "Proof Framework", "Final Presentation Outcome", "Summaery Exhibition Kiosk Outcome"],
            "sources": [win(ROOT / "project" / "deliverables.md"), win(ROOT / "tasks.md")],
        },
        {
            "title": "Car-Land Composite",
            "cluster": "Deliverable Language",
            "definition": "A single composite visualization of land currently dedicated to cars.",
            "why": "It is the rhetorical anchor requested by feedback.",
            "distinguish": "Different from a parking-point map. It must show the full spatial burden of car infrastructure.",
            "links": ["Car-Land Map", "Car-Dedicated Land", "Concern - Car-Land Must Be Visible", "Parking Land Evidence"],
            "sources": src("feedback", "rhino"),
        },
        {
            "title": "Hub Coverage Graphic",
            "cluster": "Deliverable Language",
            "definition": "A map or diagram showing hub locations, tiers, catchments, and coverage.",
            "why": "It visually proves whether the network is spatially plausible.",
            "distinguish": "Must distinguish walking catchments from service radii.",
            "links": ["Hub Coverage Map", "Coverage", "Walking Catchment", "Service Radius"],
            "sources": src("core", "activity", "rhino"),
        },
        {
            "title": "Street Transformation",
            "cluster": "Deliverable Language",
            "definition": "A before/after redesign of streets once parking and car lanes are reduced.",
            "why": "It makes reclaimed land visible at human scale.",
            "distinguish": "Not just lane geometry. It should show environmental quality and public life.",
            "links": ["Street Transformation System", "Reclaimed Land", "Before-After Visualization", "Risk - Political Acceptance"],
            "sources": src("feedback", "core"),
        },
        {
            "title": "Persona Journey",
            "cluster": "Deliverable Language",
            "definition": "A human-scale route through the proposed system, showing time, mode changes, and experience.",
            "why": "It translates network proof into lived usability.",
            "distinguish": "Different from aggregate demand. It proves comprehension and trust at user scale.",
            "links": ["Persona Journeys", "Anna Persona", "VW Shift Wave", "Proof Framework"],
            "sources": src("feedback", "core"),
        },
        {
            "title": "Anna Persona",
            "cluster": "Deliverable Language",
            "definition": "The named VW-worker journey persona referenced as a required proof path.",
            "why": "Anna makes the VW shift-wave concrete and narratable.",
            "distinguish": "Different from existing visual personas such as Thomas, Sabine, Lukas, and Gertrude.",
            "links": ["Persona Journey", "VW Shift Wave", "VW Shift-Wave Simulation", "Wolfsburg as Testbed"],
            "sources": src("core", "feedback"),
        },
        {
            "title": "Before-After Visualization",
            "cluster": "Deliverable Language",
            "definition": "A visual comparison between today's car-dominated condition and the proposed post-car condition.",
            "why": "It helps viewers understand loss, gain, and transformation quickly.",
            "distinguish": "Not proof by itself. It must connect to analysis and decisions.",
            "links": ["Street Transformation", "Final Presentation Outcome", "Chart Generation Workflow", "Self-Explanatory Exhibit"],
            "sources": [win(ROOT / "charts"), *src("feedback")],
        },
        {
            "title": "Dot-Matrix Graphic",
            "cluster": "Deliverable Language",
            "definition": "A visual counting system where dots represent vehicles, spaces, or units.",
            "why": "Critique identified it as a strong communication device, and exhibition concepts reuse it.",
            "distinguish": "Useful only when the unit and number are clear.",
            "links": ["Core Numbers and Proof Claims", "Exhibition Alternatives", "Summaery Exhibition Kiosk Outcome", "Before-After Visualization"],
            "sources": src("feedback", "exhibition"),
        },
        {
            "title": "Self-Explanatory Exhibit",
            "cluster": "Deliverable Language",
            "definition": "An exhibition format that communicates without narration or supervision.",
            "why": "Summaery requires visitors to understand the project alone.",
            "distinguish": "Different from a presentation deck. It must work for short attention and public browsing.",
            "links": ["Summaery Exhibition Constraint", "Exhibition Kiosk", "Dot-Matrix Graphic", "Public Life"],
            "sources": src("exhibition"),
        },
        {
            "title": "Exhibition Kiosk",
            "cluster": "Deliverable Language",
            "definition": "The one-screen self-running Summaery browser presentation with interactive takeover and idle resume.",
            "why": "It is the final exhibition response after equipment constraints.",
            "distinguish": "Different from earlier multi-station concepts, which are now reference material.",
            "links": ["Summaery Exhibition Kiosk Outcome", "Self-Explanatory Exhibit", "Hub Viewer", "Exhibition Alternatives"],
            "sources": src("exhibition"),
        },
        {
            "title": "Risk Register",
            "cluster": "Knowledge System",
            "definition": "A structured set of weak points, objections, uncertainty, and response actions.",
            "why": "The project has known jury risks around AV realism, numbers, politics, financing, and methodology.",
            "distinguish": "Not a failure list. It is a design steering tool.",
            "links": ["Risks and Open Questions Index", "Weak Points and Actions", "Fleet Number Conflict", "Methodology Versus Implemented Code"],
            "sources": src("research"),
        },
        {
            "title": "Filtered Permeability",
            "cluster": "Urban Strategy",
            "definition": "A traffic strategy that prevents through-traffic while retaining local access.",
            "why": "It is the spatial behavior-change mechanism behind the 5-zone model.",
            "distinguish": "Not full car exclusion. It makes car routes less direct than alternatives.",
            "links": ["Five-Zone Model", "Groningen Precedent", "Modal Shift", "L-Gateway"],
            "sources": src("decisions", "research"),
        },
        {
            "title": "Five-Zone Model",
            "cluster": "Urban Strategy",
            "definition": "The Wolfsburg centre traffic structure inspired by Groningen, dividing the centre into access zones.",
            "why": "It gives the post-car proposal a circulation logic beyond isolated hub placement.",
            "distinguish": "Not a generic pedestrian zone. It is a filtered access model.",
            "links": ["Filtered Permeability", "Groningen Precedent", "Decision - Zone Structure Groningen Model", "Street Transformation"],
            "sources": src("decisions", "core"),
        },
        {
            "title": "Groningen Precedent",
            "cluster": "Urban Strategy",
            "definition": "The Dutch filtered-permeability reference used to justify Wolfsburg's zone structure.",
            "why": "It grounds the project in a proven mobility transformation model.",
            "distinguish": "A precedent is not a copy-paste plan. It provides transferable principles.",
            "links": ["Groningen Filtered Permeability", "Five-Zone Model", "Filtered Permeability", "Modal Shift"],
            "sources": [win(ROOT / "sources" / "precedents.md"), *src("research")],
        },
    ]

    clusters: dict[str, list[str]] = defaultdict(list)
    for concept in concepts:
        clusters[concept["cluster"]].append(concept["title"])

    index_parts = [
        "# Fundamental Concepts Index\n\n",
        "This section breaks the vault down into base concepts. Use it when the project feels too large: start from a concept, then follow links to evidence, methods, decisions, and outcomes.\n\n",
        "## Concept Maps\n\n",
        bullets(["[[Concept Map - From Parking to Hub City]]", "[[Concept Map - Proof Chain]]", "[[Concept Map - Tool to Design Move]]"]),
        "\n\n",
    ]
    for cluster, titles in clusters.items():
        index_parts.append(f"## {cluster}\n\n")
        index_parts.append(bullets([f"[[{title}]]" for title in sorted(titles)]))
        index_parts.append("\n\n")
    write(
        "12_Fundamental_Concepts/Fundamental Concepts Index.md",
        frontmatter(
            "Fundamental Concepts Index",
            "moc",
            [win(ROOT / "project" / "current.md"), win(ROOT / "decisions.md"), win(ROOT / "web-tool" / "status.md")],
            confidence="high",
            tags=["concepts", "moc"],
        )
        + "".join(index_parts),
    )

    write(
        "12_Fundamental_Concepts/Concept Map - From Parking to Hub City.md",
        frontmatter(
            "Concept Map - From Parking to Hub City",
            "concept-map",
            src("core", "decisions"),
            confidence="high",
            tags=["concept-map", "concepts"],
        )
        + "# Concept Map - From Parking to Hub City\n\n"
        + "```mermaid\n"
        + "flowchart LR\n"
        + '  A["Parking City"] --> B["Car-Dedicated Land"]\n'
        + '  B --> C["Car-Land Composite"]\n'
        + '  C --> D["Urban Proof"]\n'
        + '  A --> E["Private Car Ownership"]\n'
        + '  E --> F["Shared Mobility"]\n'
        + '  F --> G["Mobility Hub"]\n'
        + '  G --> H["Hub City"]\n'
        + '  H --> I["Reclaimed Land"]\n'
        + '  I --> J["Public Life"]\n'
        + "```\n\n"
        + "## Read This Chain\n\n"
        + bullets(["[[Parking City]]", "[[Car-Dedicated Land]]", "[[Shared Mobility]]", "[[Mobility Hub]]", "[[Hub City]]", "[[Reclaimed Land]]"]),
    )

    write(
        "12_Fundamental_Concepts/Concept Map - Proof Chain.md",
        frontmatter(
            "Concept Map - Proof Chain",
            "concept-map",
            src("feedback", "activity", "decisions"),
            confidence="high",
            tags=["concept-map", "proof"],
        )
        + "# Concept Map - Proof Chain\n\n"
        + "```mermaid\n"
        + "flowchart LR\n"
        + '  A["Critique Concern"] --> B["Urban Proof"]\n'
        + '  B --> C["Evidence Claim"]\n'
        + '  C --> D["Capacity Analysis"]\n'
        + '  C --> E["Hub Coverage Graphic"]\n'
        + '  D --> F["Fleet Sizing"]\n'
        + '  F --> G["Fleet Number Conflict"]\n'
        + '  E --> H["Walking Catchment"]\n'
        + '  H --> I["Service Radius"]\n'
        + '  B --> J["Deliverable"]\n'
        + "```\n\n"
        + "## Read This Chain\n\n"
        + bullets(["[[Critique Concern]]", "[[Urban Proof]]", "[[Evidence Claim]]", "[[Capacity Analysis]]", "[[Fleet Number Conflict]]", "[[Deliverable]]"]),
    )

    write(
        "12_Fundamental_Concepts/Concept Map - Tool to Design Move.md",
        frontmatter(
            "Concept Map - Tool to Design Move",
            "concept-map",
            src("activity", "rhino"),
            confidence="high",
            tags=["concept-map", "tools"],
        )
        + "# Concept Map - Tool to Design Move\n\n"
        + "```mermaid\n"
        + "flowchart LR\n"
        + '  A["OSM Data"] --> B["GeoJSON Layer"]\n'
        + '  B --> C["Activity Map"]\n'
        + '  C --> D["Hub Placement Algorithm"]\n'
        + '  C --> E["Cycling Network"]\n'
        + '  D --> F["Hub Coverage Graphic"]\n'
        + '  E --> G["Street Transformation"]\n'
        + '  F --> H["Design Decision"]\n'
        + '  G --> H\n'
        + '  H --> I["Deliverable"]\n'
        + "```\n\n"
        + "## Read This Chain\n\n"
        + bullets(["[[OSM Data]]", "[[GeoJSON Layer]]", "[[Activity Map]]", "[[Hub Placement Algorithm]]", "[[Street Transformation]]", "[[Design Decision]]"]),
    )

    for concept in concepts:
        related = concept["links"]
        write(
            f"12_Fundamental_Concepts/{concept['title']}.md",
            frontmatter(
                concept["title"],
                "fundamental-concept",
                concept["sources"],
                confidence="medium",
                tags=["concept", concept["cluster"].lower().replace(" ", "-")],
            )
            + f"# {concept['title']}\n\n"
            + f"## Definition\n\n{concept['definition']}\n\n"
            + f"## Why It Matters Here\n\n{concept['why']}\n\n"
            + f"## Do Not Confuse With\n\n{concept['distinguish']}\n\n"
            + "## Graph Links\n\n"
            + bullets([f"[[{link}]]" for link in related])
            + "\n\n## Source Logic\n\n"
            + "This note is a conceptual synthesis of the source paths in the frontmatter. Treat direct claims as source-traced; treat cross-note framing as vault interpretation.\n",
        )


def write_hub_typology_graph() -> None:
    typology = ROOT / "project" / "hub_typologies.md"
    toolpalette = ROOT / "project" / "rhino_toolpalette.md"
    viewer_desc = ROOT / "hub-viewer" / "data" / "descriptions.js"
    layers = ROOT / "rhino" / "toolpalette_layers.json"
    source_paths = [win(typology), win(toolpalette), win(viewer_desc), win(layers)]

    category_names = {
        "mobility": "Toolpalette Category - Mobility",
        "wayfinding": "Toolpalette Category - Wayfinding and Accessibility",
        "shelter": "Toolpalette Category - Shelter and Comfort",
        "environment": "Toolpalette Category - Environment",
        "social": "Toolpalette Category - Social and Cultural",
        "lighting": "Toolpalette Category - Lighting",
        "street": "Toolpalette Category - Street and Crossing",
        "optional": "Toolpalette Category - Optional Elements",
        "typology": "Toolpalette Category - Typology Specific",
    }
    category_descriptions = {
        "mobility": "Movement, docking, charging, and arrival/departure infrastructure.",
        "wayfinding": "Elements that make the hub legible, navigable, and accessible.",
        "shelter": "Comfort, waiting, drinking water, repair, and weather protection.",
        "environment": "Trees, planting, bioswales, permeable surfaces, and climate infrastructure.",
        "social": "Elements that turn the hub into a social and cultural place.",
        "lighting": "Night-time legibility, safety, and atmospheric response.",
        "street": "Crossing and carriageway elements that make the hub part of the street section.",
        "optional": "Context-specific elements used when site programme or surrounding demand makes them relevant.",
        "typology": "Important typology elements described in the design brief but not listed as Rhino blocks.",
    }
    zone_names = {
        "1": "Hub Zone 1 - Vehicle Edge",
        "2": "Hub Zone 2 - Threshold",
        "3": "Hub Zone 3 - Dwelling Edge",
        "field": "Hub Zone - Ground Field",
        "transitions": "Hub Zone - Transitions",
        "carriageway": "Hub Zone - Carriageway",
        "L facade": "Hub Zone - L Facade",
        "L building": "Hub Zone - L Building",
        "perimeter": "Hub Zone - Perimeter",
    }
    zone_descriptions = {
        "1": "Docking, arrival/departure, EV bay, charging, and other vehicle-edge functions.",
        "2": "Threshold zone for information, identity, wayfinding, canopy, and transfer orientation.",
        "3": "Dwelling edge for seating, greenery, social, cultural, and longer-stay elements.",
        "field": "The reddish stone ground field that defines the hub territory.",
        "transitions": "Accessible transitions between zones, boarding points, and crossings.",
        "carriageway": "The street surface where the hub crosses, calms, or narrows vehicle movement.",
        "L facade": "Large-hub building facade, especially repurposed car-park walls.",
        "L building": "The reused or pavilion-based large hub structure.",
        "perimeter": "The large hub edge where operational fleet infrastructure can sit.",
    }
    material_names = {
        "pavement": "Material - Pavement",
        "concrete": "Material - Concrete",
        "metal": "Material - Metal",
        "wood": "Material - Wood",
        "glass": "Material - Glass",
        "plastic": "Material - Plastic",
        "greenery": "Material - Greenery",
        "lighting": "Material - Lighting",
        "context": "Material - Context",
    }
    material_descriptions = {
        "pavement": "Reddish stone field, road surface, markings base, and paving.",
        "concrete": "Kerbs, plinths, foundations, walls, and L-hub structure.",
        "metal": "Frames, posts, racks, canopy structure, charging posts, lockers, and fittings.",
        "wood": "Bench tops, counters, planters, decking, cabinets, and warm touch surfaces.",
        "glass": "Screens, glazing, shelter panels, and vehicle bodies.",
        "plastic": "Surface markings, dock units, signage, locker doors, and highlight elements.",
        "greenery": "Trees, planting, bioswales, living walls, wildflower strips.",
        "lighting": "Ground and ambient glow elements.",
        "context": "Street and surrounding context massing, not a hub element material.",
    }

    elements = [
        ("EL_mob_ebikeDock", "E-bike Docking Rack", "Toolpalette Element - E-bike Docking Rack", "mobility", "S/M/L", "1", ["metal", "pavement", "plastic"], "Shared e-bike docking with integrated charging at the vehicle edge."),
        ("EL_mob_privateBike", "Private Bike Parking", "Toolpalette Element - Private Bike Parking", "mobility", "S/M/L", "2", ["metal", "pavement"], "Secure parking for personally owned bikes near the threshold."),
        ("EL_mob_cargoBikeDock", "Cargo Bike Dock", "Toolpalette Element - Cargo Bike Dock", "mobility", "M/L", "1", ["metal", "pavement", "plastic"], "Docking bays for shared or private cargo bikes."),
        ("EL_mob_microPodZone", "Micro-pod Arrival / Departure", "Toolpalette Element - Micro-pod Arrival Departure", "mobility", "S/M/L", "1", ["pavement", "glass", "plastic"], "Marked stop in the stone field where autonomous micro-pods arrive or depart."),
        ("EL_mob_sharedEVbay", "Shared EV Bay", "Toolpalette Element - Shared EV Bay", "mobility", "M/L", "1", ["pavement", "glass", "metal"], "Parking and charging bay for shared electric cars."),
        ("EL_mob_avDropoff", "AV Drop-off / Pickup", "Toolpalette Element - AV Drop-off Pickup", "mobility", "M/L", "1", ["pavement", "glass", "plastic"], "Marked zone sized for autonomous shuttle pods and buses."),
        ("EL_mob_chargingPoints", "Charging Point", "Toolpalette Element - Charging Point", "mobility", "S/M/L", "1", ["metal", "glass"], "Charging integrated into furniture or structure, not freestanding posts."),
        ("EL_mob_infoTerminal", "Real-time Info Terminal", "Toolpalette Element - Real-time Info Terminal", "mobility", "M/L", "2", ["metal", "glass"], "Live arrivals and vehicle availability at this hub."),
        ("EL_mob_ptShed", "Public Transport Shed", "Toolpalette Element - Public Transport Shed", "mobility", "all", "2", ["metal", "glass", "wood"], "Shelter at fixed bus or tram stops; may merge with the canopy."),
        ("EL_way_directionalLines", "Directional Lines", "Toolpalette Element - Directional Lines", "wayfinding", "S/M/L", "field", ["pavement", "plastic"], "Lines in the stone field pointing toward each mobility element."),
        ("EL_way_tactileStrips", "Tactile Paving Strips", "Toolpalette Element - Tactile Paving Strips", "wayfinding", "S/M/L", "transitions", ["pavement", "plastic"], "Raised tactile surface at zone transitions, boarding areas, and crossings."),
        ("EL_way_identityMarker", "Hub Identity Marker", "Toolpalette Element - Hub Identity Marker", "wayfinding", "S/M/L", "2", ["concrete", "metal", "plastic"], "Panel with hub name, tier, and map of nearby hubs."),
        ("EL_shel_canopy", "Canopy / Beacon", "Toolpalette Element - Canopy Beacon", "shelter", "S/M/L", "2", ["metal", "glass"], "The vertical beacon, readable from 50 metres; overhead at the threshold."),
        ("EL_shel_bench", "Bench", "Toolpalette Element - Bench", "shelter", "S/M/L", "3", ["wood", "metal"], "Linear bench for individual users at the dwelling edge."),
        ("EL_shel_groupSeating", "Group Seating", "Toolpalette Element - Group Seating", "shelter", "M/L", "3", ["wood", "metal"], "Larger seating configuration for social groups."),
        ("EL_shel_drinkingWater", "Drinking Water Point", "Toolpalette Element - Drinking Water Point", "shelter", "S/M/L", "3", ["concrete", "metal"], "Public drinking water access."),
        ("EL_shel_repairStation", "Bike Repair Station", "Toolpalette Element - Bike Repair Station", "shelter", "S/M/L", "3", ["metal", "plastic"], "Self-service tools and pump at the dwelling edge."),
        ("EL_env_treeGrate", "Tree with Stone Grate", "Toolpalette Element - Tree with Stone Grate", "environment", "S/M/L", "field", ["wood", "metal", "greenery"], "Tree in the stone field with a flush grate; shade and identity."),
        ("EL_env_planting", "Planting / Bioswale", "Toolpalette Element - Planting Bioswale", "environment", "M/L", "3", ["concrete", "greenery"], "Linear planted bed that can double as a stormwater channel."),
        ("EL_env_permeable", "Permeable Surface", "Toolpalette Element - Permeable Surface", "environment", "M/L", "field", ["pavement", "greenery"], "Permeable paving sections for stormwater infiltration."),
        ("EL_soc_communityBoard", "Community Board", "Toolpalette Element - Community Board", "social", "S/M/L", "3", ["wood", "glass", "metal"], "Noticeboard for local events and neighbourhood information."),
        ("EL_soc_kiosk", "Vendor / Kiosk Slot", "Toolpalette Element - Vendor Kiosk Slot", "social", "M/L", "3", ["metal", "glass", "wood"], "Position for a small vendor such as coffee or local goods."),
        ("EL_soc_artMarker", "Art / Cultural Marker", "Toolpalette Element - Art Cultural Marker", "social", "S/M/L", "field", ["concrete", "metal"], "Site-specific artwork integrated into the hub, one per hub."),
        ("EL_soc_flexSurface", "Flexible Surface Area", "Toolpalette Element - Flexible Surface Area", "social", "M/L", "3", ["pavement", "plastic"], "Clear paved area for temporary events, markets, and gatherings."),
        ("EL_lit_groundLight", "Ground-embedded Lighting", "Toolpalette Element - Ground-embedded Lighting", "lighting", "S/M/L", "field", ["pavement", "lighting"], "Lighting set into the stone field so the hub stays navigable after dark."),
        ("EL_lit_ambientLight", "Ambient Responsive Lighting", "Toolpalette Element - Ambient Responsive Lighting", "lighting", "S/M/L", "2", ["metal", "lighting"], "Canopy lighting that brightens on approach and stays low at quiet hours."),
        ("EL_str_hubCrossing", "Hub-integrated Crossing", "Toolpalette Element - Hub-integrated Crossing", "street", "S/M/L", "carriageway", ["pavement", "plastic"], "Raised crossing tying the two sides of the street into the hub."),
        ("EL_str_raisedCarriage", "Raised / Narrowed Carriageway", "Toolpalette Element - Raised Narrowed Carriageway", "street", "M/L", "carriageway", ["pavement", "concrete"], "Raised table that calms traffic and integrates the crossing."),
        ("EL_str_bothSides", "Both-sides Distribution", "Toolpalette Element - Both-sides Distribution", "street", "M/L", "carriageway", ["pavement", "context"], "Hub elements split across the street and linked by the crossing."),
        ("EL_opt_heatedZone", "Heated Waiting Zone", "Toolpalette Element - Heated Waiting Zone", "optional", "opt", "3", ["glass", "metal", "wood", "lighting"], "Semi-enclosed heated seating for cold or exposed locations."),
        ("EL_opt_deviceCharging", "Personal Device Charging", "Toolpalette Element - Personal Device Charging", "optional", "opt", "3", ["wood", "plastic", "lighting"], "USB or wireless charging in bench or canopy at high-dwell spots."),
        ("EL_opt_solarCanopy", "Solar Canopy", "Toolpalette Element - Solar Canopy", "optional", "opt", "2", ["metal", "glass"], "Energy-generating canopy where PV is viable and visible."),
        ("EL_opt_wildflower", "Wildflower / Meadow Strip", "Toolpalette Element - Wildflower Meadow Strip", "optional", "opt", "3", ["greenery"], "Low-maintenance seasonal planting for biodiversity."),
        ("EL_opt_livingWall", "Living Wall", "Toolpalette Element - Living Wall", "optional", "opt", "L facade", ["metal", "greenery"], "Vertical garden on L-hub facades or repurposed car-park walls."),
        ("EL_opt_cargoLibrary", "Cargo Bike Lending Library", "Toolpalette Element - Cargo Bike Lending Library", "optional", "opt", "1", ["pavement", "metal", "plastic"], "Covered cargo-bike lending where cargo demand is high."),
        ("EL_opt_adaptiveDock", "Adaptive Mobility Dock", "Toolpalette Element - Adaptive Mobility Dock", "optional", "opt", "1", ["pavement", "metal", "plastic"], "Dock for accessible vehicles near care or medical facilities."),
        ("EL_opt_parcelLockers", "Parcel Pickup Lockers", "Toolpalette Element - Parcel Pickup Lockers", "optional", "opt", "3", ["metal", "plastic"], "Last-mile delivery lockers that reduce van traffic."),
        ("EL_opt_luggage", "Luggage Storage", "Toolpalette Element - Luggage Storage", "optional", "opt", "3", ["metal", "plastic"], "Luggage lockers near factory gates or interchange points."),
        ("EL_opt_microLibrary", "Micro-library / Book Exchange", "Toolpalette Element - Micro-library Book Exchange", "optional", "opt", "3", ["wood", "glass", "metal"], "Book exchange built into the structure at high-dwell hubs."),
        ("EL_opt_gameTable", "Game Table", "Toolpalette Element - Game Table", "optional", "opt", "3", ["wood", "concrete"], "Chess or ping-pong table at hubs with social ambition."),
        ("EL_opt_playElement", "Children's Play Element", "Toolpalette Element - Childrens Play Element", "optional", "opt", "3", ["pavement", "metal", "plastic", "greenery"], "Simple play element making the hub a family destination."),
        ("EL_opt_fitnessElement", "Outdoor Fitness Element", "Toolpalette Element - Outdoor Fitness Element", "optional", "opt", "3", ["pavement", "metal"], "Minimal fitness bars serving all ages."),
        ("EL_opt_popupMarket", "Pop-up Market Slot", "Toolpalette Element - Pop-up Market Slot", "optional", "opt", "3", ["pavement", "metal", "plastic", "wood"], "Serviced regular vendor surface in L-hub open spaces."),
        ("EL_opt_memoryMarker", "Memory / History Marker", "Toolpalette Element - Memory History Marker", "optional", "opt", "field", ["concrete", "plastic"], "Marker telling the Wolfsburg transformation story, especially on former car parks."),
        ("EL_opt_toolLending", "Tool / Equipment Lending", "Toolpalette Element - Tool Equipment Lending", "optional", "opt", "3", ["wood", "metal", "plastic"], "Small neighbourhood tool library near residential areas."),
    ]

    typology_specific = [
        ("TYPO_avStaging", "Autonomous Vehicle Staging Area", "Typology Element - Autonomous Vehicle Staging Area", "typology", "L", "perimeter", ["pavement", "metal"], "Large-hub operational area where autonomous vehicles queue, charge, or dispatch."),
        ("TYPO_fleetCharging", "EV Fleet Charging at Scale", "Typology Element - EV Fleet Charging at Scale", "typology", "L", "perimeter", ["metal", "glass"], "Large-scale charging infrastructure for the shared fleet at L-hubs."),
        ("TYPO_maintenance", "Fleet Maintenance Station", "Typology Element - Fleet Maintenance Station", "typology", "L", "L building", ["concrete", "metal"], "Maintenance capacity for the full shared fleet, described in the L-hub typology."),
        ("TYPO_fullFleet", "Full Fleet Representation", "Typology Element - Full Fleet Representation", "typology", "L", "perimeter", ["context"], "The L-hub contains or coordinates all five system modes."),
        ("TYPO_gastronomy", "Gastronomy and Permanent Programme", "Typology Element - Gastronomy and Permanent Programme", "typology", "L", "L building", ["concrete", "glass", "wood"], "Ground-floor cafe, restaurant, shops, cultural and community programme in a reused L-hub building."),
    ]

    all_elements = elements + typology_specific

    note_by_display = {display: note for _, display, note, *_ in all_elements}
    mandatory_s = [
        "E-bike Docking Rack", "Private Bike Parking", "Micro-pod Arrival / Departure",
        "Charging Point", "Hub Identity Marker", "Directional Lines", "Tactile Paving Strips",
        "Canopy / Beacon", "Bench", "Ground-embedded Lighting",
    ]
    standard_s = [
        "Tree with Stone Grate", "Ambient Responsive Lighting", "Community Board",
        "Art / Cultural Marker", "Public Transport Shed", "Hub-integrated Crossing",
    ]
    mandatory_m_extra = [
        "Cargo Bike Dock", "Real-time Info Terminal", "Shared EV Bay", "AV Drop-off / Pickup",
        "Group Seating", "Drinking Water Point", "Bike Repair Station", "Planting / Bioswale",
        "Permeable Surface", "Tree with Stone Grate",
    ]
    standard_m = [
        "Public Transport Shed", "Vendor / Kiosk Slot", "Flexible Surface Area",
        "Raised / Narrowed Carriageway", "Both-sides Distribution",
    ]
    mandatory_l = [
        "Autonomous Vehicle Staging Area", "EV Fleet Charging at Scale",
        "Fleet Maintenance Station", "Full Fleet Representation",
        "Gastronomy and Permanent Programme",
    ]
    l_outdoor = [
        "Game Table", "Planting / Bioswale", "Tree with Stone Grate", "Living Wall",
        "Memory / History Marker", "Pop-up Market Slot", "Flexible Surface Area",
        "Group Seating", "Vendor / Kiosk Slot",
    ]
    optional_context = [
        "Heated Waiting Zone", "Personal Device Charging", "Solar Canopy", "Wildflower / Meadow Strip",
        "Cargo Bike Lending Library", "Adaptive Mobility Dock", "Parcel Pickup Lockers",
        "Luggage Storage", "Micro-library / Book Exchange", "Children's Play Element",
        "Outdoor Fitness Element", "Tool / Equipment Lending",
    ]

    status: dict[str, dict[str, str]] = defaultdict(dict)
    for name in mandatory_s:
        status[name]["S"] = "mandatory"
    for name in standard_s:
        status[name]["S"] = "standard"
    for name in mandatory_s + mandatory_m_extra:
        status[name]["M"] = "mandatory"
    for name in standard_m:
        status[name]["M"] = "standard"
    for name in mandatory_s + mandatory_m_extra + standard_m + mandatory_l:
        status[name]["L"] = "mandatory/apply"
    for name in l_outdoor:
        status[name]["L"] = "outdoor standard"
    for name in optional_context:
        status[name]["S"] = status[name].get("S", "optional context")
        status[name]["M"] = status[name].get("M", "optional context")
        status[name]["L"] = status[name].get("L", "optional context")

    def element_link(display: str) -> str:
        return f"[[{note_by_display[display]}]]"

    def links_for_status(tier: str, relation: str) -> list[str]:
        names = [name for name, per_tier in status.items() if per_tier.get(tier) == relation and name in note_by_display]
        return [element_link(name) for name in sorted(names)]

    def tier_links(display: str, tier_key: str) -> list[str]:
        links = []
        for tier in ["S", "M", "L"]:
            if tier in status.get(display, {}):
                links.append(f"[[Hub Tier - {tier}-Hub]]")
        if tier_key == "all":
            links.append("[[Conditional Public Transport Overlap]]")
        if tier_key == "opt" and not links:
            links.append("[[Optional Toolpalette Element]]")
        return links

    write(
        "13_Hub_Typology_Graph/Hub Typology Graph Index.md",
        frontmatter("Hub Typology Graph Index", "moc", source_paths, confidence="high", tags=["hub-typology", "moc"])
        + "# Hub Typology Graph Index\n\n"
        + "This section breaks the hub design system into graph-readable parts: hub tiers, toolpalette categories, individual elements, zones, materials, and tier-element relationships.\n\n"
        + "## Hub Tiers\n\n"
        + bullets(["[[Hub Tier - S-Hub]]", "[[Hub Tier - M-Hub]]", "[[Hub Tier - L-Hub]]"])
        + "\n\n## Relationship Maps\n\n"
        + bullets(["[[Hub Element Matrix]]", "[[Hub Toolpalette Category Index]]", "[[Hub Spatial Zone Index]]", "[[Hub Material Index]]"])
        + "\n\n## Toolpalette Categories\n\n"
        + bullets([f"[[{name}]]" for name in category_names.values()])
        + "\n\n## Graph Reading Tip\n\n"
        + "Open a hub tier note and use local graph view. You should see its mandatory, standard, optional, zone, category, and material neighbours.\n",
    )

    write(
        "13_Hub_Typology_Graph/Hub Element Matrix.md",
        frontmatter("Hub Element Matrix", "matrix", source_paths, confidence="high", tags=["hub-typology", "matrix"])
        + "# Hub Element Matrix\n\n"
        + "| Element | S-Hub | M-Hub | L-Hub | Category |\n"
        + "|---|---|---|---|---|\n"
        + "\n".join(
            f"| [[{note}]] | {status.get(display, {}).get('S', '')} | {status.get(display, {}).get('M', '')} | {status.get(display, {}).get('L', '')} | [[{category_names[cat]}]] |"
            for _, display, note, cat, *_ in all_elements
        )
        + "\n\n## Legend\n\n"
        + bullets([
            "`mandatory`: required by the tier definition.",
            "`standard`: present at most hubs or where context requires.",
            "`outdoor standard`: specifically named for L-hub outdoor space.",
            "`optional context`: context-specific; not automatically present.",
            "`mandatory/apply`: applies through the L-hub rule that S and M outdoor elements also apply, or through explicit L-hub infrastructure.",
        ]),
    )

    tier_defs = {
        "S": {
            "title": "Hub Tier - S-Hub",
            "subtitle": "The Moment",
            "summary": "43 compact last-mile hubs for e-bikes, micro-pods, quick access, and legible street presence.",
            "concept": "S-Hub",
            "mandatory": links_for_status("S", "mandatory"),
            "standard": links_for_status("S", "standard"),
            "optional": links_for_status("S", "optional context"),
        },
        "M": {
            "title": "Hub Tier - M-Hub",
            "subtitle": "The Choice Point",
            "summary": "19 neighbourhood-scale multimodal transfer hubs with more dwell time, more modes, and stronger public-space elements.",
            "concept": "M-Hub",
            "mandatory": links_for_status("M", "mandatory"),
            "standard": links_for_status("M", "standard"),
            "optional": links_for_status("M", "optional context"),
        },
        "L": {
            "title": "Hub Tier - L-Hub",
            "subtitle": "The Neighbourhood Anchor",
            "summary": "6 large hubs based on building reuse or pavilion clusters, full fleet infrastructure, and a strong community programme.",
            "concept": "L-Hub",
            "mandatory": links_for_status("L", "mandatory/apply"),
            "standard": links_for_status("L", "outdoor standard"),
            "optional": links_for_status("L", "optional context"),
        },
    }
    for tier, data in tier_defs.items():
        write(
            f"13_Hub_Typology_Graph/{data['title']}.md",
            frontmatter(data["title"], "hub-tier", [win(typology), win(toolpalette)], confidence="high", tags=["hub-tier", f"{tier.lower()}-hub"])
            + f"# {data['title']}\n\n"
            + f"## {data['subtitle']}\n\n"
            + data["summary"]
            + f"\n\n## Core Concept\n\n[[{data['concept']}]]\n\n"
            + "## Mandatory / Applies\n\n"
            + bullets(data["mandatory"])
            + "\n\n## Standard / Usually Present\n\n"
            + bullets(data["standard"])
            + "\n\n## Optional Context Elements\n\n"
            + bullets(data["optional"])
            + "\n\n## Spatial Logic\n\n"
            + bullets(["[[Hub Zone 1 - Vehicle Edge]]", "[[Hub Zone 2 - Threshold]]", "[[Hub Zone 3 - Dwelling Edge]]", "[[Hub Zone - Ground Field]]"])
            + "\n\n## Related\n\n"
            + bullets(["[[Hub Element Matrix]]", "[[Hub Typology System]]", "[[Hub Toolpalette]]"]),
        )

    write(
        "13_Hub_Typology_Graph/Conditional Public Transport Overlap.md",
        frontmatter("Conditional Public Transport Overlap", "relationship", [win(typology), win(toolpalette)], confidence="high", tags=["hub-relationship"])
        + "# Conditional Public Transport Overlap\n\n"
        + "Some elements, especially [[Toolpalette Element - Public Transport Shed]], apply at any tier only where a fixed public transport route overlaps the hub.\n\n"
        + "## Related\n\n"
        + bullets(["[[Hub Tier - S-Hub]]", "[[Hub Tier - M-Hub]]", "[[Hub Tier - L-Hub]]"]),
    )
    write(
        "13_Hub_Typology_Graph/Optional Toolpalette Element.md",
        frontmatter("Optional Toolpalette Element", "relationship", [win(typology), win(toolpalette)], confidence="high", tags=["hub-relationship"])
        + "# Optional Toolpalette Element\n\n"
        + "Optional elements are context-specific. They should be linked to a hub tier only when the site, surrounding programme, or user group makes that element relevant.\n\n"
        + "## Related\n\n"
        + bullets(["[[Hub Element Matrix]]", "[[Toolpalette Category - Optional Elements]]"]),
    )

    write(
        "13_Hub_Typology_Graph/Hub Toolpalette Category Index.md",
        frontmatter("Hub Toolpalette Category Index", "moc", [win(toolpalette), win(viewer_desc)], confidence="high", tags=["hub-category"])
        + "# Hub Toolpalette Category Index\n\n"
        + bullets([f"[[{name}]]" for name in category_names.values()]),
    )
    for key, note in category_names.items():
        member_links = [
            f"[[{element_note}]]"
            for _, _, element_note, cat, *_ in all_elements
            if cat == key
        ]
        write(
            f"13_Hub_Typology_Graph/{note}.md",
            frontmatter(note, "toolpalette-category", [win(toolpalette), win(viewer_desc)], confidence="high", tags=["hub-category"])
            + f"# {note}\n\n"
            + category_descriptions[key]
            + "\n\n## Elements\n\n"
            + bullets(member_links),
        )

    write(
        "13_Hub_Typology_Graph/Hub Spatial Zone Index.md",
        frontmatter("Hub Spatial Zone Index", "moc", [win(typology), win(toolpalette)], confidence="high", tags=["hub-zone"])
        + "# Hub Spatial Zone Index\n\n"
        + bullets([f"[[{name}]]" for name in zone_names.values()]),
    )
    for key, note in zone_names.items():
        member_links = [
            f"[[{element_note}]]"
            for _, _, element_note, _, _, zone, *_ in all_elements
            if zone == key
        ]
        write(
            f"13_Hub_Typology_Graph/{note}.md",
            frontmatter(note, "hub-zone", [win(typology), win(toolpalette)], confidence="high", tags=["hub-zone"])
            + f"# {note}\n\n"
            + zone_descriptions[key]
            + "\n\n## Elements In This Zone\n\n"
            + bullets(member_links),
        )

    write(
        "13_Hub_Typology_Graph/Hub Material Index.md",
        frontmatter("Hub Material Index", "moc", [win(toolpalette), win(layers)], confidence="high", tags=["hub-material"])
        + "# Hub Material Index\n\n"
        + bullets([f"[[{name}]]" for name in material_names.values()]),
    )
    for key, note in material_names.items():
        member_links = [
            f"[[{element_note}]]"
            for _, _, element_note, _, _, _, materials, _ in all_elements
            if key in materials
        ]
        write(
            f"13_Hub_Typology_Graph/{note}.md",
            frontmatter(note, "hub-material", [win(toolpalette), win(layers)], confidence="high", tags=["hub-material"])
            + f"# {note}\n\n"
            + material_descriptions[key]
            + "\n\n## Elements Using This Material\n\n"
            + bullets(member_links),
        )

    for block, display, note, cat, tier_key, zone, materials, desc in all_elements:
        per_tier = status.get(display, {})
        relations = []
        for tier in ["S", "M", "L"]:
            if tier in per_tier:
                relations.append(f"[[Hub Tier - {tier}-Hub]] - {per_tier[tier]}")
        if tier_key == "all":
            relations.append("[[Conditional Public Transport Overlap]]")
        if tier_key == "opt":
            relations.append("[[Optional Toolpalette Element]]")
        if not relations:
            relations.extend(tier_links(display, tier_key))
        write(
            f"13_Hub_Typology_Graph/{note}.md",
            frontmatter(note, "toolpalette-element", source_paths, confidence="high", tags=["hub-element", cat])
            + f"# {note}\n\n"
            + f"## Element\n\n{display}\n\n"
            + f"## Block / Source ID\n\n`{block}`\n\n"
            + f"## Description\n\n{desc}\n\n"
            + "## Category\n\n"
            + f"[[{category_names[cat]}]]\n\n"
            + "## Hub Tier Relationship\n\n"
            + bullets(relations)
            + "\n\n## Spatial Zone\n\n"
            + f"[[{zone_names[zone]}]]\n\n"
            + "## Materials\n\n"
            + bullets([f"[[{material_names[m]}]]" for m in materials])
            + "\n\n## Interpretation Note\n\n"
            + "Tier relationships use the explicit tier key in `rhino_toolpalette.md` plus the mandatory/standard lists in `hub_typologies.md`. Optional context links are intentionally marked as optional rather than mandatory.\n",
        )


def write_source_indexes(inv: dict[str, object]) -> None:
    files: list[Path] = inv["files"]  # type: ignore[assignment]
    md_files = sorted([p for p in files if p.suffix.lower() == ".md"], key=lambda p: rel(p).lower())
    lines = []
    for path in md_files:
        heads = headings_for(path, limit=8)
        head_text = "; ".join(heads[:6])
        lines.append(f"- `{rel(path)}` - {head_text}")
    write(
        "99_Source_Trace/Markdown Source Inventory.md",
        frontmatter("Markdown Source Inventory", "source-index", [win(ROOT)], confidence="high", tags=["source-trace"])
        + "# Markdown Source Inventory\n\n"
        + "\n".join(lines)
        + "\n",
    )

    asset_exts = {".png", ".jpg", ".jpeg", ".svg", ".mp4", ".html", ".js", ".jsx", ".css", ".py", ".geojson", ".json", ".csv", ".xlsx", ".shp", ".dbf", ".prj", ".shx", ".xml"}
    by_ext = defaultdict(list)
    for path in files:
        if path.suffix.lower() in asset_exts:
            by_ext[path.suffix.lower()].append(path)
    sections = []
    for ext in sorted(by_ext):
        sections.append(f"## {ext}\n")
        for path in sorted(by_ext[ext], key=lambda p: rel(p).lower())[:180]:
            size_kb = path.stat().st_size / 1024
            sections.append(f"- `{rel(path)}` ({size_kb:.1f} KB)")
        if len(by_ext[ext]) > 180:
            sections.append(f"- ... {len(by_ext[ext]) - 180} more files omitted from this section")
        sections.append("")
    write(
        "10_Assets_Datasets_Index/Asset Index.md",
        frontmatter("Asset Index", "asset-index", [win(ROOT)], confidence="high", tags=["assets", "source-trace"])
        + "# Asset Index\n\n"
        + "This note indexes non-note assets and code-adjacent materials. It does not copy them into the vault.\n\n"
        + "\n".join(sections),
    )

    spatial_paths = sorted(
        [p for p in files if p.suffix.lower() in {".geojson", ".csv", ".xlsx", ".shp", ".dbf", ".prj", ".shx", ".xml"}],
        key=lambda p: rel(p).lower(),
    )
    spatial_lines = []
    for path in spatial_paths:
        ext = path.suffix.lower()
        note = ""
        if ext == ".geojson" and path.stat().st_size < 8_000_000:
            summary = geojson_summary(path)
            if "error" not in summary:
                note = f" - features={summary['features']}, geometry={summary['geometry']}, props={', '.join(summary['props'])}"
        elif ext == ".csv":
            summary = csv_summary(path)
            if "error" not in summary:
                note = f" - rows={summary['rows']}, header=`{summary['header']}`"
        spatial_lines.append(f"- `{rel(path)}`{note}")
    write(
        "10_Assets_Datasets_Index/Spatial Dataset Index.md",
        frontmatter("Spatial Dataset Index", "dataset-index", [win(ROOT / "wolfsburg-activity-map"), win(ROOT / "exhibition" / "deck" / "mapembed")], confidence="high", tags=["datasets", "spatial"])
        + "# Spatial Dataset Index\n\n"
        + "\n".join(spatial_lines)
        + "\n\n## Related\n\n"
        + bullets(["[[Site Analysis Index]]", "[[Wolfsburg Activity Map]]"]),
    )

    main_status = git(["status", "--short"], ROOT)
    main_log = git(["log", "--oneline", "--decorate", "-n", "20"], ROOT)
    activity = ROOT / "wolfsburg-activity-map"
    activity_status = git(["status", "--short"], activity, safe=True)
    activity_log = git(["log", "--oneline", "--decorate", "-n", "20"], activity, safe=True)
    write(
        "99_Source_Trace/GitHub and Revision Trace.md",
        frontmatter("GitHub and Revision Trace", "source-index", [win(ROOT / ".git" / "config"), win(activity / ".git" / "config")], confidence="high", tags=["git", "revision"])
        + "# GitHub and Revision Trace\n\n"
        + "## Main Repository\n\n"
        + "- Remote: `https://github.com/ofa5406/wolfsburg.git`\n"
        + "- Branch: `main`\n"
        + "- GitHub API audit: 3 merged PRs, no standalone issues, no PR comments or review comments found.\n\n"
        + "### Local Status at Vault Generation\n\n"
        + "```text\n"
        + main_status
        + "\n```\n\n"
        + "### Recent History\n\n"
        + "```text\n"
        + main_log
        + "\n```\n\n"
        + "## Activity Map Repository\n\n"
        + "- Remote: `https://github.com/annestasiia/wolfsburg-activity-map.git`\n"
        + "- Branch: `master`\n"
        + "- GitHub API audit: 6 merged PRs, no standalone issues, no PR comments or review comments found.\n\n"
        + "### Local Status at Vault Generation\n\n"
        + "```text\n"
        + activity_status
        + "\n```\n\n"
        + "### Recent History\n\n"
        + "```text\n"
        + activity_log
        + "\n```\n",
    )

    write(
        "90_Timeline_Sessions/Timeline and Sessions Index.md",
        frontmatter("Timeline and Sessions Index", "timeline", [win(ROOT / "sessions" / "INDEX.md"), win(ROOT / "HANDOFF.md")], confidence="high", tags=["timeline", "sessions"])
        + "# Timeline and Sessions Index\n\n"
        + "## Session Source\n\n"
        + f"`{win(ROOT / 'sessions' / 'INDEX.md')}`\n\n"
        + "## Major Phases\n\n"
        + bullets(
            [
                "2026-06-14/15: repository and research memory setup.",
                "2026-06-17: MOIA/MIA research and hub-system rethink.",
                "2026-06-21/25: final HTML presentation and project naming.",
                "2026-06-24/25: Hub Viewer build and saved views.",
                "2026-07-02: exhibition alternatives.",
                "2026-07-04: hub-viewer navigation and deck refactor.",
                "2026-07-06: Summaery kiosk pivot.",
            ]
        )
        + "\n\n## Related\n\n"
        + bullets(["[[Revision Threads]]", "[[GitHub and Revision Trace]]"]),
    )


def write_templates_and_obsidian() -> None:
    template_common = (
        "---\n"
        "title: \"\"\n"
        "type: \"\"\n"
        "status: \"draft\"\n"
        "confidence: \"\"\n"
        "source_path: []\n"
        "tags: []\n"
        "---\n\n"
        "# Title\n\n"
        "## Summary\n\n"
        "## Source Trace\n\n"
        "## Related\n"
    )
    write("_templates/Source Note Template.md", template_common)
    write(
        "_templates/Decision Note Template.md",
        template_common
        + "\n## Decision\n\n## Why\n\n## Alternatives Considered\n\n## Consequences\n\n## Open Implementation Gaps\n",
    )
    write(
        "_templates/Feedback Note Template.md",
        template_common
        + "\n## Feedback Received\n\n## Concern\n\n## Response\n\n## Revision or Deliverable Affected\n",
    )
    write(
        "_templates/Asset Index Template.md",
        template_common
        + "\n## Asset Role\n\n## Parse Status\n\n## How To Use\n",
    )
    write(
        ".obsidian/app.json",
        json.dumps({"showLineNumber": False, "alwaysUpdateLinks": True, "newFileLocation": "current"}, indent=2),
    )
    write(
        ".obsidian/appearance.json",
        json.dumps({"theme": "obsidian", "cssTheme": ""}, indent=2),
    )
    write(
        ".obsidian/graph.json",
        json.dumps(
            {
                "collapse-filter": False,
                "search": "",
                "showTags": True,
                "showAttachments": True,
                "hideUnresolved": False,
                "showOrphans": True,
                "colorGroups": [
                    {"query": "tag:#risk", "color": {"a": 1, "rgb": 16734003}},
                    {"query": "tag:#decision", "color": {"a": 1, "rgb": 3329330}},
                    {"query": "tag:#tool", "color": {"a": 1, "rgb": 2003199}},
                    {"query": "tag:#feedback", "color": {"a": 1, "rgb": 16753920}},
                    {"query": "tag:#hub-tier", "color": {"a": 1, "rgb": 4286945}},
                    {"query": "tag:#hub-element", "color": {"a": 1, "rgb": 12540415}},
                    {"query": "tag:#hub-category", "color": {"a": 1, "rgb": 9659306}},
                    {"query": "tag:#hub-zone", "color": {"a": 1, "rgb": 6737151}},
                ],
            },
            indent=2,
        ),
    )
    write(
        "README.md",
        frontmatter("Vault README", "readme", [win(ROOT)], confidence="high", tags=["readme"])
        + "# stadt.hub Obsidian Vault\n\n"
        + "Generated inside `codex-work` from the Wolfsburg repository audit. Existing source files were not modified.\n\n"
        + "Open this folder as an Obsidian vault:\n\n"
        + "`D:\\vibe_lab\\wolfsburg\\codex-work\\stadt-hub-vault`\n\n"
        + "Start at [[Home]].\n",
    )


def main() -> None:
    ensure_clean_target()
    inv = file_inventory()
    write_home(inv)
    write_project_core()
    write_briefs()
    write_feedback_and_decisions()
    write_research()
    write_site_methods_design()
    write_deliverables_risks()
    write_fundamental_concepts()
    write_hub_typology_graph()
    write_source_indexes(inv)
    write_templates_and_obsidian()

    notes_before_manifest = len(list(VAULT.rglob("*.md")))
    files_before_manifest = len([p for p in VAULT.rglob("*") if p.is_file()])
    manifest = {
        "vault": win(VAULT),
        "source_root": win(ROOT),
        "notes": notes_before_manifest + 1,
        "all_files": files_before_manifest + 1,
    }
    write("99_Source_Trace/Generation Manifest.md", frontmatter("Generation Manifest", "manifest", [win(Path(__file__))], confidence="high", tags=["manifest"]) + "# Generation Manifest\n\n```json\n" + json.dumps(manifest, indent=2) + "\n```\n")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
