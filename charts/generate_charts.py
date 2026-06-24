"""
Generate presentation charts with corrected legend placement.
Run: python3 charts/generate_charts.py
"""
import math, os
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.gridspec import GridSpec

OUT = os.path.dirname(__file__)

# ── Data (from hub_calculation.py) ──────────────────────────────────────────
fleet_total = {
    "e_bike": 641, "autonomous_shuttle": 55,
    "autonomous_bus": 33, "autonomous_pod": 369, "car_sharing_ev": 175,
}
hub_counts = {"hub_l": 6, "hub_m": 19, "hub_s": 43}

distribution = {
    "car_sharing_ev":     {"hub_l": 1.00, "hub_m": 0.00, "hub_s": 0.00},
    "autonomous_bus":     {"hub_l": 1.00, "hub_m": 0.00, "hub_s": 0.00},
    "autonomous_shuttle": {"hub_l": 0.50, "hub_m": 0.50, "hub_s": 0.00},
    "autonomous_pod":     {"hub_l": 0.30, "hub_m": 0.50, "hub_s": 0.20},
    "e_bike":             {"hub_l": 0.00, "hub_m": 0.30, "hub_s": 0.70},
}
fleet_at_tier = {"hub_l": {}, "hub_m": {}, "hub_s": {}}
for mode, shares in distribution.items():
    for tier, share in shares.items():
        fleet_at_tier[tier][mode] = math.ceil(fleet_total[mode] * share)

charging_rate = {"e_bike": 0.50, "autonomous_pod": 0.30,
                 "autonomous_shuttle": 0.30, "autonomous_bus": 0.30, "car_sharing_ev": 0.30}
footprint_m2_per_unit = {"e_bike": 2, "autonomous_pod": 8,
                          "autonomous_shuttle": 30, "autonomous_bus": 55, "car_sharing_ev": 12}

fleet_per_hub = {}
for tier, count in hub_counts.items():
    fleet_per_hub[tier] = {
        mode: math.ceil(fleet_at_tier[tier].get(mode, 0) / count * 1.20)
        for mode in fleet_total
    }
charging_per_hub = {
    tier: sum(math.ceil(fleet_per_hub[tier].get(m, 0) * r)
              for m, r in charging_rate.items())
    for tier in hub_counts
}
footprint_per_hub = {
    tier: sum(fleet_per_hub[tier].get(m, 0) * fp
              for m, fp in footprint_m2_per_unit.items())
    for tier in hub_counts
}

# ── Hub area data (from hub_area.py) ────────────────────────────────────────
fleet_per_hub_area = {
    "hub_l": {"e_bike": 0,  "autonomous_shuttle": 6,  "autonomous_bus": 7,  "autonomous_pod": 23, "car_sharing_ev": 35},
    "hub_m": {"e_bike": 13, "autonomous_shuttle": 2,  "autonomous_bus": 0,  "autonomous_pod": 12, "car_sharing_ev": 0},
    "hub_s": {"e_bike": 13, "autonomous_shuttle": 0,  "autonomous_bus": 0,  "autonomous_pod": 3,  "car_sharing_ev": 0},
}
footprint_per_unit = {"e_bike": 2.5, "autonomous_pod": 10, "autonomous_shuttle": 35,
                       "autonomous_bus": 60, "car_sharing_ev": 15}
charging_fp = {"e_bike": 0.5, "other": 4.0}
charging_rate_area = {"e_bike": 0.50, "autonomous_pod": 0.30, "autonomous_shuttle": 0.30,
                       "autonomous_bus": 0.30, "car_sharing_ev": 0.30}
circulation_factor = {"hub_l": 1.60, "hub_m": 1.40, "hub_s": 1.20}
PROGRAM_SHARE = 0.10
MODES = ["e_bike", "autonomous_shuttle", "autonomous_bus", "autonomous_pod", "car_sharing_ev"]
TIERS = ["hub_l", "hub_m", "hub_s"]

S_fleet = {t: sum(fleet_per_hub_area[t].get(m, 0) * footprint_per_unit[m] for m in MODES) for t in TIERS}
S_circ  = {t: S_fleet[t] * (circulation_factor[t] - 1) for t in TIERS}
S_charging = {}
for tier in TIERS:
    total = 0
    for mode in MODES:
        n = fleet_per_hub_area[tier].get(mode, 0)
        chargers = math.ceil(n * charging_rate_area[mode])
        fp = charging_fp["e_bike"] if mode == "e_bike" else charging_fp["other"]
        total += chargers * fp
    S_charging[tier] = total
S_sub     = {t: S_fleet[t] + S_circ[t] + S_charging[t] for t in TIERS}
S_program = {t: S_sub[t] * PROGRAM_SHARE for t in TIERS}
S_hub     = {t: S_fleet[t] + S_circ[t] + S_charging[t] + S_program[t] for t in TIERS}

# ── Colours / labels ─────────────────────────────────────────────────────────
HUB_COLORS  = {"hub_l": "#1A1A1A", "hub_m": "#2D6A4F", "hub_s": "#95B8A0"}
HUB_LABELS  = {"hub_l": "Hub L",   "hub_m": "Hub M",   "hub_s": "Hub S"}
MODE_COLORS = {"e_bike": "#27AE60", "autonomous_shuttle": "#8E44AD",
               "autonomous_bus": "#2C3E50", "autonomous_pod": "#2980B9", "car_sharing_ev": "#E67E22"}
MODE_LABELS = {"e_bike": "E-Bike", "autonomous_shuttle": "Auto Shuttle",
               "autonomous_bus": "Auto Bus", "autonomous_pod": "Auto Pod", "car_sharing_ev": "Car-Share EV"}
COMP_COLORS = {"S_fleet": "#2D6A4F", "S_circ": "#52A882",
               "S_charging": "#2980B9", "S_program": "#BDC3C7"}
COMP_LABELS = {"S_fleet": "Fleet parking", "S_circ": "Circulation",
               "S_charging": "Charging", "S_program": "Program / shelter"}

plt.rcParams.update({
    "font.family": "sans-serif", "font.size": 10,
    "axes.spines.top": False, "axes.spines.right": False,
    "axes.spines.left": False, "axes.spines.bottom": False,
    "xtick.bottom": False, "ytick.left": False,
    "figure.facecolor": "white", "axes.facecolor": "white",
})

modes_order = ["e_bike", "autonomous_shuttle", "autonomous_bus", "autonomous_pod", "car_sharing_ev"]
tiers_order = ["hub_l", "hub_m", "hub_s"]

# ── 1. Hub heatmap ───────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(7, 3.6))
matrix = np.array([[fleet_per_hub[t].get(m, 0) for t in tiers_order] for m in modes_order])
from matplotlib.colors import LinearSegmentedColormap
cmap = LinearSegmentedColormap.from_list("g", ["#FFFFFF", "#2D6A4F"])
ax.imshow(matrix, cmap=cmap, aspect="auto")
ax.set_xticks(range(3)); ax.set_xticklabels([HUB_LABELS[t] for t in tiers_order], fontsize=11, fontweight="600")
ax.set_yticks(range(5)); ax.set_yticklabels([MODE_LABELS[m] for m in modes_order], fontsize=10)
ax.tick_params(length=0)
for i, m in enumerate(modes_order):
    for j, t in enumerate(tiers_order):
        v = matrix[i, j]
        color = "white" if v > matrix.max() * 0.55 else "#1A1A1A"
        ax.text(j, i, str(v) if v > 0 else "–", ha="center", va="center",
                fontsize=11, fontweight="600", color=color)
ax.set_title("Fleet per Hub  (incl. 20% reserve)", fontsize=12, fontweight="700",
             pad=12, loc="left", color="#1A1A1A")
fig.tight_layout(pad=1.8)
fig.savefig(os.path.join(OUT, "hub_heatmap.png"), dpi=150, bbox_inches="tight")
plt.close(fig)
print("hub_heatmap.png")

# ── 2. Hub area breakdown (horizontal stacked bar) ──────────────────────────
comp_keys = ["S_fleet", "S_circ", "S_charging", "S_program"]
comp_vals = {k: [{"S_fleet": S_fleet, "S_circ": S_circ, "S_charging": S_charging, "S_program": S_program}[k][t]
                 for t in TIERS] for k in comp_keys}

fig, ax = plt.subplots(figsize=(9, 4.2))   # taller to give legend room below
y_pos = np.arange(len(TIERS))
lefts = np.zeros(len(TIERS))
for ck in comp_keys:
    vals = np.array(comp_vals[ck])
    ax.barh(y_pos, vals, left=lefts, color=COMP_COLORS[ck], label=COMP_LABELS[ck], height=0.5, zorder=2)
    for yi, (v, l) in enumerate(zip(vals, lefts)):
        if v > 15:
            ax.text(l + v/2, yi, f"{v:.0f}", ha="center", va="center",
                    fontsize=8, fontweight="600", color="white")
    lefts += vals
for yi, tier in enumerate(TIERS):
    ax.text(S_hub[tier] + 12, yi, f"{S_hub[tier]:.0f} m²",
            va="center", fontsize=9, fontweight="700", color=HUB_COLORS[tier])
ax.set_yticks(y_pos)
ax.set_yticklabels([f"{HUB_LABELS[t]}\n({hub_counts[t]} hubs)" for t in TIERS],
                   fontsize=10, fontweight="600")
ax.tick_params(length=0)
ax.xaxis.grid(True, color="#E8E8ED", zorder=0)
ax.set_xlabel("m² per hub", fontsize=10, color="#6E6E73")
# Legend moved BELOW the chart
ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.18),
          fontsize=8, frameon=False, ncol=4, columnspacing=1.2)
ax.set_title("Hub Area Breakdown  (m² per single hub)", fontsize=12, fontweight="700",
             pad=12, loc="left", color="#1A1A1A")
fig.tight_layout(pad=1.8)
fig.subplots_adjust(bottom=0.20)
fig.savefig(os.path.join(OUT, "hub_area_breakdown.png"), dpi=150, bbox_inches="tight")
plt.close(fig)
print("hub_area_breakdown.png")

# ── 3. Stacked bar — total fleet by tier ─────────────────────────────────────
fig, ax = plt.subplots(figsize=(6, 5.0))   # extra height so legend fits below
x = np.arange(3)
bottoms = np.zeros(3)
for mode in modes_order:
    vals = np.array([fleet_at_tier[t].get(mode, 0) for t in tiers_order])
    bars = ax.bar(x, vals, bottom=bottoms, color=MODE_COLORS[mode], label=MODE_LABELS[mode],
                  width=0.52, zorder=2)
    for xi, (v, b) in enumerate(zip(vals, bottoms)):
        if v > 12:
            ax.text(xi, b + v / 2, str(v), ha="center", va="center",
                    fontsize=9, fontweight="600", color="white")
    bottoms += vals
ax.set_xticks(x)
ax.set_xticklabels([f"{HUB_LABELS[t]}\n({hub_counts[t]} hubs)" for t in tiers_order],
                   fontsize=10, fontweight="600")
ax.set_ylabel("Total fleet units", fontsize=10, color="#6E6E73", labelpad=8)
ax.yaxis.grid(True, color="#E8E8ED", zorder=0)
ax.set_axisbelow(True)
# Legend moved BELOW the chart
ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.18),
          fontsize=8, frameon=False, ncol=2, labelspacing=0.5, columnspacing=1.0)
ax.set_title("Total Fleet by Hub Tier", fontsize=12, fontweight="700",
             pad=12, loc="left", color="#1A1A1A")
fig.tight_layout(pad=1.8)
fig.subplots_adjust(bottom=0.28)
fig.savefig(os.path.join(OUT, "hub_stacked_bar.png"), dpi=150, bbox_inches="tight")
plt.close(fig)
print("hub_stacked_bar.png")

# ── 4. Hub profile cards ─────────────────────────────────────────────────────
fig = plt.figure(figsize=(11, 5.8))
gs = GridSpec(1, 3, figure=fig, wspace=0.06)

card_data = {
    "hub_l": {"modes": ["car_sharing_ev", "autonomous_bus", "autonomous_shuttle", "autonomous_pod"],
               "desc": "Large interchange hub\n(parking garage / transit node)"},
    "hub_m": {"modes": ["autonomous_shuttle", "autonomous_pod", "e_bike"],
               "desc": "District mobility hub\n(street-level, covered)"},
    "hub_s": {"modes": ["e_bike", "autonomous_pod"],
               "desc": "Neighbourhood micro-hub\n(on-street docking)"},
}
for col, tier in enumerate(tiers_order):
    ax = fig.add_subplot(gs[0, col])
    ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")
    # Card border
    ax.add_patch(mpatches.FancyBboxPatch((0.04, 0.05), 0.92, 0.90,
                  boxstyle="round,pad=0.02", linewidth=1.5,
                  edgecolor=HUB_COLORS[tier], facecolor="#F9F9F9"))
    # Header strip
    ax.add_patch(mpatches.FancyBboxPatch((0.04, 0.78), 0.92, 0.17,
                  boxstyle="round,pad=0.01", linewidth=0, facecolor=HUB_COLORS[tier]))
    # Hub label
    ax.text(0.50, 0.868, HUB_LABELS[tier], ha="center", va="center",
            fontsize=15, fontweight="800", color="white", transform=ax.transAxes)
    # "N hubs" — more space below header
    ax.text(0.50, 0.730, f"{hub_counts[tier]} hubs", ha="center", va="center",
            fontsize=10, fontweight="600", color=HUB_COLORS[tier], transform=ax.transAxes)
    # Description — more space below "N hubs"
    ax.text(0.50, 0.660, card_data[tier]["desc"], ha="center", va="center",
            fontsize=7.5, color="#6E6E73", transform=ax.transAxes, linespacing=1.6)
    # Mode rows — flow down from top of content area
    y = 0.590
    for mode in card_data[tier]["modes"]:
        qty = fleet_per_hub[tier].get(mode, 0)
        if qty == 0:
            continue
        ax.plot(0.13, y, "o", markersize=6, color=MODE_COLORS[mode], transform=ax.transAxes, clip_on=False)
        ax.text(0.22, y, MODE_LABELS[mode], ha="left", va="center",
                fontsize=9, color="#1A1A1A", transform=ax.transAxes)
        ax.text(0.90, y, f"{qty}", ha="right", va="center",
                fontsize=9, fontweight="700", color="#1A1A1A", transform=ax.transAxes)
        y -= 0.090
    # Footer — anchored to fixed positions so all cards align
    ax.plot([0.08, 0.92], [0.27, 0.27], color="#E8E8ED", linewidth=0.8, transform=ax.transAxes)
    ax.text(0.13, 0.20, "Charging points", ha="left", va="center",
            fontsize=9, color="#6E6E73", transform=ax.transAxes)
    ax.text(0.90, 0.20, f"{charging_per_hub[tier]}", ha="right", va="center",
            fontsize=9, fontweight="700", color="#1A1A1A", transform=ax.transAxes)
    ax.text(0.13, 0.12, "Footprint", ha="left", va="center",
            fontsize=9, color="#6E6E73", transform=ax.transAxes)
    ax.text(0.90, 0.12, f"{footprint_per_hub[tier]:,} m²", ha="right", va="center",
            fontsize=9, fontweight="700", color="#1A1A1A", transform=ax.transAxes)

fig.suptitle("Hub Profile Cards", fontsize=13, fontweight="700",
             x=0.06, ha="left", y=1.01, color="#1A1A1A")
fig.tight_layout(pad=1.2)
fig.savefig(os.path.join(OUT, "hub_profile_cards.png"), dpi=150, bbox_inches="tight")
plt.close(fig)
print("hub_profile_cards.png")

print("\nDone — all charts saved to", OUT)
