// One-shot generator for themes/: reads the vendored upstream One Dark Pro
// theme sheets and writes one .color-theme.json per flavor with the
// CodeBuddy coverage patch applied. Run: node scripts/gen-themes.mjs
//
// Why a patch: the vendored sheets are the published One Dark Pro 3.20.2
// output (Binaryify/OneDark-Pro, MIT). They predate CodeBuddy's 1.106
// workbench, so 81 color keys the CodeBuddy UI reads (command center,
// notifications, quick input, menus, genie chat chrome, ...) are absent and
// fall back to Dark Modern / Catppuccin-flavored defaults — off-palette
// grays and greens that clash with One Dark's warm grays. The patch fills
// exactly those keys from One Dark's own conventions; every other key
// (including all tokenColors / semanticTokenColors) passes through
// untouched.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** One Dark's shared chrome palette (constant across upstream variants). */
const P = {
	fg: "#abb2bf", // editor.foreground
	fgTitle: "#9da5b4", // titleBar.activeForeground
	fgBright: "#d7dae0", // activityBar.foreground / list.activeSelectionForeground
	fgTab: "#dcdcdc", // tab.activeForeground
	dim: "#6b717d", // agentsChatInput.placeholderForeground
	dimmer: "#5c6370", // comment gray
	blue: "#61afef", // textLink / link accents
	badge: "#4d78cc", // activityBarBadge / statusBarItem.remoteBackground
	red: "#e06c75", // error accents
	border: "#181a1f", // tab.border / editorGroup.border / widget borders
	hover: "#2c313a", // list.hoverBackground
	raise: "#3e4452", // focusBorder / panel.border
	tabHover: "#323842", // tab.hoverBackground
	button: "#404754", // button.background / checkbox.border
	buttonHover: "#4e5666", // one step above button.background
	buttonFg: "#f8fafd", // activityBarBadge.foreground
	amber: "#d19a6644", // editor.findMatchBackground
	whiteFaint: "#ffffff1a", // textPreformat-style washes
};

/**
 * Coverage patch. Values are concrete colors, or {ref: "key"} to reuse the
 * flavor's own value for key — refs are how the per-flavor background
 * ladder (pro #282c34 / darker #23272e / night-flat #16191d) propagates
 * without restating the hexes per flavor.
 */
const PATCH = {
	"activityBar.activeBackground": P.hover,
	"activityBar.activeBorder": P.badge,
	"activityBar.border": P.border,
	"activityBar.inactiveForeground": P.dim,
	"badge.foreground": P.fg,
	"button.border": "#00000000",
	"button.foreground": P.buttonFg,
	"button.hoverBackground": P.buttonHover,
	"button.secondaryHoverBackground": P.raise,
	"checkbox.background": { ref: "input.background" },
	"commandCenter.activeForeground": P.fgTab,
	"commandCenter.background": { ref: "sideBar.background" },
	"commandCenter.border": P.border,
	"commandCenter.foreground": P.fgTitle,
	"disabledForeground": P.dim,
	"dropdown.foreground": P.fg,
	"dropdown.listBackground": { ref: "dropdown.background" },
	"editorGroupHeader.tabsBorder": P.border,
	"editorOverviewRuler.border": P.border,
	"editorPane.background": { ref: "editor.background" },
	"errorForeground": P.red,
	"foreground": P.fg,
	"icon.foreground": P.fg,
	"input.border": P.border,
	"input.placeholderForeground": P.dim,
	"inputOption.activeBackground": P.blue + "33",
	"inputOption.activeBorder": P.blue,
	"keybindingLabel.background": P.tabHover,
	"keybindingLabel.foreground": P.fg,
	"list.activeSelectionIconForeground": P.fgBright,
	"menu.background": { ref: "dropdown.background" },
	"menu.border": P.raise,
	"menu.selectionBackground": P.hover,
	"menu.selectionForeground": P.fgBright,
	"notebook.cellBorderColor": P.border,
	"notebook.selectedCellBackground": P.hover,
	"notificationCenterHeader.background": { ref: "editorWidget.background" },
	"notificationCenterHeader.foreground": P.fgTitle,
	"notifications.background": { ref: "editorWidget.background" },
	"notifications.border": P.border,
	"notifications.foreground": P.fg,
	"notificationsInfoIcon.foreground": P.blue,
	"panel.background": { ref: "editor.background" },
	"panelInput.border": P.border,
	"panelTitle.activeBorder": P.blue,
	"panelTitle.activeForeground": P.fgTab,
	"panelTitle.inactiveForeground": P.fgTitle,
	"peekViewResult.matchHighlightBackground": P.amber,
	"pickerGroup.border": P.raise,
	"progressBar.background": P.badge,
	"quickInput.background": { ref: "editorWidget.background" },
	"quickInput.foreground": P.fg,
	"quickInputList.focusBackground": { ref: "list.activeSelectionBackground" },
	"settings.dropdownBackground": { ref: "input.background" },
	"settings.dropdownBorder": P.button,
	"settings.modifiedItemIndicator": P.badge,
	"sideBar.border": P.border,
	"sideBarSectionHeader.border": P.border,
	"sideBarTitle.foreground": P.fg,
	"statusBar.border": P.border,
	"statusBar.focusBorder": P.raise,
	"statusBarItem.focusBorder": P.badge,
	"statusBarItem.hoverBackground": P.whiteFaint,
	"statusBarItem.hoverForeground": "#ffffff",
	"statusBarItem.prominentBackground": P.badge,
	"tab.activeBorderTop": { ref: "tab.activeBorder" },
	"tab.inactiveForeground": P.fgTitle,
	// CodeBuddy fork key (stock VS Code ignores it): keep the selected tab's
	// top border in the same neutral as tab.activeBorder so the fork UI
	// doesn't paint a Catppuccin blue bar over the One Dark look.
	"tab.selectedBorderTop": { ref: "tab.activeBorder" },
	"tab.unfocusedActiveBorder": P.dim,
	"tab.unfocusedActiveBorderTop": P.dim,
	"tab.unfocusedInactiveBackground": { ref: "tab.inactiveBackground" },
	"terminal.tab.activeBorder": { ref: "tab.activeBorder" },
	"textCodeBlock.background": { ref: "editorWidget.background" },
	"textLink.activeForeground": P.blue,
	"textPreformat.background": P.whiteFaint,
	"textSeparator.foreground": P.dimmer,
	"titleBar.border": P.border,
	"toolbar.hoverBackground": P.hover,
	"welcomePage.progress.foreground": P.badge,
	"welcomePage.tileBackground": { ref: "editorWidget.background" },
	"widget.border": P.border,
};

/**
 * Keys the shipped CodeBuddy 1.106 workbench reads that the vendored sheets
 * don't define. The generator asserts PATCH covers every one of them after
 * application, so bumping the vendored upstream files can't silently drop
 * coverage.
 */
const REQUIRED_KEYS = [
	"activityBar.activeBackground", "activityBar.activeBorder", "activityBar.border",
	"activityBar.inactiveForeground", "badge.foreground", "button.border",
	"button.foreground", "button.hoverBackground", "button.secondaryHoverBackground",
	"checkbox.background", "commandCenter.activeForeground", "commandCenter.background",
	"commandCenter.border", "commandCenter.foreground", "disabledForeground",
	"dropdown.foreground", "dropdown.listBackground", "editorGroupHeader.tabsBorder",
	"editorOverviewRuler.border", "editorPane.background", "errorForeground",
	"foreground", "icon.foreground", "input.border", "input.placeholderForeground",
	"inputOption.activeBackground", "inputOption.activeBorder",
	"keybindingLabel.background", "keybindingLabel.foreground",
	"list.activeSelectionIconForeground", "menu.background", "menu.border",
	"menu.selectionBackground", "menu.selectionForeground", "notebook.cellBorderColor",
	"notebook.selectedCellBackground", "notificationCenterHeader.background",
	"notificationCenterHeader.foreground", "notifications.background",
	"notifications.border", "notifications.foreground",
	"notificationsInfoIcon.foreground", "panel.background", "panelInput.border",
	"panelTitle.activeBorder", "panelTitle.activeForeground",
	"panelTitle.inactiveForeground", "peekViewResult.matchHighlightBackground",
	"pickerGroup.border", "progressBar.background", "quickInput.background",
	"quickInput.foreground", "quickInputList.focusBackground",
	"settings.dropdownBackground", "settings.dropdownBorder",
	"settings.modifiedItemIndicator", "sideBar.border",
	"sideBarSectionHeader.border", "sideBarTitle.foreground", "statusBar.border",
	"statusBar.focusBorder", "statusBarItem.focusBorder",
	"statusBarItem.hoverBackground", "statusBarItem.hoverForeground",
	"statusBarItem.prominentBackground", "tab.activeBorderTop",
	"tab.inactiveForeground", "tab.selectedBorderTop",
	"tab.unfocusedActiveBorder", "tab.unfocusedActiveBorderTop",
	"tab.unfocusedInactiveBackground", "terminal.tab.activeBorder",
	"textCodeBlock.background", "textLink.activeForeground",
	"textPreformat.background", "textSeparator.foreground", "titleBar.border",
	"toolbar.hoverBackground", "welcomePage.progress.foreground",
	"welcomePage.tileBackground", "widget.border",
];

const FLAVORS = [
	{ file: "OneDark-Pro.json", out: "onedark-pro.color-theme.json" },
	{ file: "OneDark-Pro-darker.json", out: "onedark-darker.color-theme.json" },
	{ file: "OneDark-Pro-night-flat.json", out: "onedark-night-flat.color-theme.json" },
];

for (const flavor of FLAVORS) {
	const source = JSON.parse(readFileSync(join(root, "vendor", flavor.file), "utf8"));
	const colors = { ...source.colors };

	const resolve = (value) => {
		if (typeof value === "object" && value !== null && "ref" in value) {
			const referred = colors[value.ref];
			if (typeof referred !== "string") {
				throw new Error(`${flavor.file}: patch ref "${value.ref}" does not resolve to a color`);
			}
			return referred;
		}
		return value;
	};
	for (const [key, value] of Object.entries(PATCH)) {
		colors[key] = resolve(value);
	}

	const missing = REQUIRED_KEYS.filter((key) => !(key in colors));
	if (missing.length > 0) {
		throw new Error(`${flavor.out}: coverage gaps: ${missing.join(", ")}`);
	}

	writeFileSync(
		join(root, "themes", flavor.out),
		JSON.stringify({ ...source, colors }, null, "\t") + "\n",
	);
	console.log(`wrote themes/${flavor.out} (${Object.keys(colors).length} colors, ${source.tokenColors.length} token rules)`);
}
