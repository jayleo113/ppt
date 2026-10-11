// 把 build/report_source.md 排成 Word 研究报告（A4，宋体小四，1.5 倍行距，首行缩进两字）
// 用法：node build/make_report_docx.js [输出 docx 路径]
const fs = require("fs");
const path = require("path");
const D = require("docx");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType,
  BorderStyle, ShadingType, LevelFormat, Footer, PageNumber, HeadingLevel } = D;

const OUT = process.argv[2] || path.join(__dirname, "..", "研究报告_Gracenote报告介绍与评价.docx");
const lines = fs.readFileSync(path.join(__dirname, "report_source.md"), "utf8").split("\n");

const BODY = "宋体", HEAD = "黑体", LATIN = "Times New Roman";
const font = { ascii: LATIN, hAnsi: LATIN, eastAsia: BODY, cs: LATIN };
const headFont = { ascii: "Arial", hAnsi: "Arial", eastAsia: HEAD, cs: "Arial" };

// 行内：**粗体**、*斜体*
function runs(text, o = {}) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0, m;
  const push = (t, extra) => t && out.push(new TextRun({ text: t, font: o.font || font, size: o.size || 24, ...o.run, ...extra }));
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index));
    if (m[0].startsWith("**")) push(m[0].slice(2, -2), { bold: true });
    else push(m[0].slice(1, -1), { italics: true });
    last = m.index + m[0].length;
  }
  push(text.slice(last));
  return out;
}

const body = (t) => new Paragraph({ children: runs(t), spacing: { line: 360, after: 120 }, indent: { firstLine: 480 }, alignment: AlignmentType.JUSTIFIED });
const heading = (t, level) => new Paragraph({
  heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
  children: runs(t, { font: headFont, size: level === 1 ? 32 : 28, run: { bold: true } }),
  spacing: { before: level === 1 ? 360 : 240, after: 120, line: 360 }, keepNext: true,
});
const listItem = (t, ref) => new Paragraph({ children: runs(t), numbering: { reference: ref, level: 0 }, spacing: { line: 360, after: 60 } });

const border = { style: BorderStyle.SINGLE, size: 4, color: "808080" };
const borders = { top: border, bottom: border, left: border, right: border };
function table(rows) {
  const cells = rows.map((r) => r.split("|").slice(1, -1).map((c) => c.trim()));
  const n = cells[0].length;
  const widths = cells[0][0] === "" ? [1500, 3763, 3763] : n === 3 ? [2000, 1500, 5526] : Array(n).fill(Math.floor(9026 / n));
  return new Table({
    width: { size: 9026, type: WidthType.DXA }, columnWidths: widths,
    rows: cells.map((r, i) => new TableRow({
      tableHeader: i === 0, cantSplit: true,
      children: r.map((c, j) => new TableCell({
        width: { size: widths[j], type: WidthType.DXA }, borders,
        shading: i === 0 || j === 0 && cells[0][0] === "" ? { fill: "EDEDED", type: ShadingType.CLEAR, color: "auto" } : undefined,
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: runs(c, { size: 21, run: i === 0 || (j === 0 && cells[0][0] === "") ? { bold: true } : {} }), spacing: { line: 300 }, keepNext: i < cells.length - 1 })],
      })),
    })),
  });
}

const children = [];
let i = 0, listRef = 0, numbered = [];
while (i < lines.length) {
  const l = lines[i];
  if (!l.trim() || l.trim() === "---") { i++; continue; }
  if (l.startsWith("# ")) {
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 160, line: 400 },
      children: l.slice(2).split(/(?<=》)(?=报告)/).flatMap((t, k) => runs(t, { font: headFont, size: 36, run: { bold: true, break: k ? 1 : 0 } })) }));
  } else if (l.startsWith("## ")) children.push(heading(l.slice(3), 1));
  else if (l.startsWith("### ")) children.push(heading(l.slice(4), 2));
  else if (l.startsWith("黄广润")) {
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: runs(l.replace(/　+/g, "　　"), { size: 22 }) }));
  } else if (l.startsWith("|")) {
    const rows = [];
    while (i < lines.length && lines[i].startsWith("|")) { if (!/^\|[-| ]+\|$/.test(lines[i])) rows.push(lines[i]); i++; }
    children.push(table(rows), new Paragraph({ spacing: { after: 120 }, children: [] }));
    continue;
  } else if (/^\d+\. /.test(l)) {
    const ref = `num${listRef++}`; numbered.push(ref);
    while (i < lines.length && /^\d+\. /.test(lines[i])) { children.push(listItem(lines[i].replace(/^\d+\. /, ""), ref)); i++; }
    continue;
  } else if (l.startsWith("- ")) {
    while (i < lines.length && lines[i].startsWith("- ")) { children.push(listItem(lines[i].slice(2), "bullets")); i++; }
    continue;
  } else { const p = body(l); const nxt = lines.slice(i + 1).find((x) => x.trim()); children.push(nxt && nxt.startsWith("|") ? new Paragraph({ children: runs(l), spacing: { line: 360, after: 120 }, indent: { firstLine: 480 }, alignment: AlignmentType.JUSTIFIED, keepNext: true }) : p); }
  i++;
}

const doc = new Document({
  creator: "", title: "对 Gracenote 报告《AI 时代的电视搜索与内容发现》的介绍与评价",
  styles: {
    default: { document: { run: { font, size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: headFont, size: 32, bold: true }, paragraph: { outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: headFont, size: 28, bold: true }, paragraph: { outlineLevel: 1 } },
    ],
  },
  numbering: { config: [
    { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 840, hanging: 360 } } } }] },
    ...numbered.map((ref) => ({ reference: ref, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 840, hanging: 360 } } } }] })),
  ] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], font, size: 20 })] })] }) },
    children,
  }],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(OUT, b); console.log("written", OUT); });
