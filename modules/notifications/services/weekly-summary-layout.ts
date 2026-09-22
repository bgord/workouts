import { escapeHtml, NotificationShell } from "./notification-shell";

export type WeeklySummaryLayoutTile = { value: string; label: string; delta: string };

export type WeeklySummaryLayoutConfig = {
  eyebrow: string;
  title: string;
  numbers: { tiles: ReadonlyArray<WeeklySummaryLayoutTile> } | { empty: string };
  highlights: { heading: string; rows: ReadonlyArray<{ name: string; previous: string; current: string }> };
  bodyWeight?: { heading: string; value: string; caption: string; note?: string };
  consistency: string;
  footer: { before: string; link: string; after: string; url: string };
  signature: string;
};

const styles = {
  eyebrow:
    "margin:24px 0 0;font-size:11px;line-height:1.5;letter-spacing:.08em;text-transform:uppercase;color:#6b6e75;",
  title: "margin:4px 0 0;font-size:20px;line-height:1.3;font-weight:600;color:#0f131a;",
  heading:
    "margin:28px 0 0;font-size:11px;line-height:1.5;letter-spacing:.08em;text-transform:uppercase;color:#6b6e75;",
  paragraph: "margin:24px 0 0;font-size:15px;line-height:1.6;color:#3c4047;",
  tiles: "margin-top:24px;border:1px solid #e0e1e3;border-radius:8px;border-collapse:separate;",
  tile: {
    cell: "padding:14px 12px;vertical-align:top;",
    divider: "border-right:1px solid #e0e1e3;",
    value: "font-size:24px;line-height:1.2;font-weight:600;color:#0f131a;font-variant-numeric:tabular-nums;",
    label: "margin-top:2px;font-size:12px;line-height:1.4;color:#55585e;",
    delta: "margin-top:6px;font-size:12px;line-height:1.4;color:#6b6e75;font-variant-numeric:tabular-nums;",
  },
  rows: "margin-top:8px;border-collapse:collapse;",
  row: {
    name: "padding:10px 0;border-bottom:1px solid #e0e1e3;font-size:14px;line-height:1.5;color:#0f131a;",
    change:
      "padding:10px 0;border-bottom:1px solid #e0e1e3;font-size:14px;line-height:1.5;color:#55585e;white-space:nowrap;font-variant-numeric:tabular-nums;",
    arrow: "color:#a3a6ab;",
    current: "color:#0f131a;font-weight:500;",
  },
  bodyWeight: {
    line: "margin:8px 0 0;font-size:14px;line-height:1.5;color:#0f131a;",
    value: "font-size:20px;font-weight:600;font-variant-numeric:tabular-nums;",
    caption: "color:#55585e;",
    note: "margin:4px 0 0;font-size:13px;line-height:1.5;color:#55585e;font-variant-numeric:tabular-nums;",
  },
  consistency:
    "margin:28px 0 0;font-size:13px;line-height:1.6;color:#55585e;font-variant-numeric:tabular-nums;",
  footer: "margin:16px 0 0;font-size:12px;line-height:1.6;color:#6b6e75;",
  link: "color:#ca5a15;text-decoration:underline;",
};

const heading = (text: string) => `
    <p style="${styles.heading}">${escapeHtml(text)}</p>`;

const tile = (
  tile: WeeklySummaryLayoutTile,
  index: number,
  tiles: ReadonlyArray<WeeklySummaryLayoutTile>,
) => {
  const last = index === tiles.length - 1;
  const width = Math.floor(100 / tiles.length) + (last ? 100 % tiles.length : 0);

  return `
      <td width="${width}%" style="${styles.tile.cell}${last ? "" : styles.tile.divider}">
        <div style="${styles.tile.value}">${escapeHtml(tile.value)}</div>
        <div style="${styles.tile.label}">${escapeHtml(tile.label)}</div>
        <div style="${styles.tile.delta}">${escapeHtml(tile.delta)}</div>
      </td>`;
};

const numbers = (config: WeeklySummaryLayoutConfig["numbers"]) => {
  if ("empty" in config)
    return `
    <p style="${styles.paragraph}">${escapeHtml(config.empty)}</p>`;

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${styles.tiles}">
    <tr>${config.tiles.map(tile).join("")}
    </tr>
    </table>`;
};

const highlights = (config: WeeklySummaryLayoutConfig["highlights"]) => {
  if (config.rows.length === 0) return "";

  const rows = config.rows.map(
    (row) => `
    <tr>
      <td style="${styles.row.name}">${escapeHtml(row.name)}</td>
      <td align="right" style="${styles.row.change}">${escapeHtml(row.previous)} <span style="${styles.row.arrow}">→</span> <span style="${styles.row.current}">${escapeHtml(row.current)}</span></td>
    </tr>`,
  );

  return `${heading(config.heading)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${styles.rows}">${rows.join("")}
    </table>`;
};

const bodyWeight = (config: WeeklySummaryLayoutConfig["bodyWeight"]) => {
  if (!config) return "";

  const note = config.note
    ? `
    <p style="${styles.bodyWeight.note}">${escapeHtml(config.note)}</p>`
    : "";

  return `${heading(config.heading)}
    <p style="${styles.bodyWeight.line}"><span style="${styles.bodyWeight.value}">${escapeHtml(config.value)}</span><span style="${styles.bodyWeight.caption}"> ${escapeHtml(config.caption)}</span></p>${note}`;
};

const footer = (config: WeeklySummaryLayoutConfig["footer"]) => `
    <p style="${styles.footer}">${escapeHtml(config.before)}<a href="${escapeHtml(config.url)}" style="${styles.link}">${escapeHtml(config.link)}</a>${escapeHtml(config.after)}</p>`;

export class WeeklySummaryLayout {
  static render(config: WeeklySummaryLayoutConfig): string {
    const body = `
    <p style="${styles.eyebrow}">${escapeHtml(config.eyebrow)}</p>
    <p style="${styles.title}">${escapeHtml(config.title)}</p>${numbers(config.numbers)}${highlights(config.highlights)}${bodyWeight(config.bodyWeight)}
    <p style="${styles.consistency}">${escapeHtml(config.consistency)}</p>${footer(config.footer)}`;

    return NotificationShell.render({ body, signature: config.signature });
  }
}
