// 生成演讲用讲稿 Word：大字号、短句分行、每页有一句话主旨和翻页提示，便于边讲边瞄
// 用法：node build/make_speech_docx.js [输出 docx 路径]
const fs = require("fs");
const path = require("path");
const D = require("docx");
const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, ShadingType, Footer, PageNumber, Table, TableRow, TableCell, WidthType } = D;
const SCRIPT = require("./script.js");

const OUT = process.argv[2] || path.join(__dirname, "..", "讲稿_演讲用.docx");
const FONT = { ascii: "Arial", hAnsi: "Arial", eastAsia: "Microsoft YaHei", cs: "Arial" };
const NAVY = "1F2A44", ORANGE = "C2410C", GRAY = "6B7280";
const mmss = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;

const run = (text, o = {}) => new TextRun({ text, font: FONT, size: 40, ...o });

// 短句分行：先按句号、分号断句，长句再按逗号合并成不超过约 20 字的行
function toLines(text) {
  const out = [];
  for (const sent of text.split(/(?<=[。；？])/).filter(Boolean)) {
    const parts = sent.split(/(?<=，)/);
    let cur = "";
    const group = [];
    for (const p of parts) {
      if (cur && cur.replace(/\s/g, "").length >= 8 && (cur + p).replace(/\s/g, "").length > 17) { group.push(cur); cur = p; } else cur += p;
    }
    if (cur) group.push(cur);
    out.push(group);
  }
  return out;
}
// 数字与关键量词加粗变色，卡壳时一眼能找到
function highlighted(line) {
  const re = /(\d[\d,.]*\s?(?:%|分钟|个百分点|岁|国|名)?|三分之二|四个环节|四类数据)/g;
  const out = [];
  let last = 0, m;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(run(line.slice(last, m.index)));
    out.push(run(m[0], { bold: true, color: ORANGE }));
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(run(line.slice(last)));
  return out;
}

const children = [];
const total = SCRIPT.reduce((a, x) => a + x.secs, 0);
let acc = 0;
const cum = SCRIPT.map((x) => (acc += x.secs));

children.push(
  new Paragraph({ spacing: { after: 80 }, children: [run("演讲稿：Gracenote 2026 AI 报告评析", { size: 40, bold: true, color: NAVY })] }),
  new Paragraph({ spacing: { after: 160 }, children: [run(`共 ${SCRIPT.length} 页，约 ${mmss(total)}。每页先看灰底的一句话主旨，卡住时只讲这一句再翻页。橙色加粗为必须说准的数字。`, { size: 26, color: GRAY })] }),
);
const checkpoints = [[4, "研究方法讲完"], [7, "评价思路讲完"], [10, "调查时间讲完"], [12, "全部结束"]];
children.push(new Paragraph({
  spacing: { after: 240 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "D5DAE1", space: 8 } },
  children: [run("时间检查点　", { size: 26, bold: true, color: NAVY }), ...checkpoints.map(([p, t]) => run(`第 ${p} 页（${t}）${mmss(cum[p - 1])}　`, { size: 26 }))],
}));

SCRIPT.forEach((x, i) => {
  children.push(new Paragraph({
    keepNext: true, spacing: { before: 280, after: 100 },
    border: { top: { style: BorderStyle.SINGLE, size: 12, color: NAVY, space: 6 } },
    children: [run(`第 ${i + 1} 页　${x.title}`, { size: 32, bold: true, color: NAVY }), run(`　约 ${x.secs} 秒 · 累计 ${mmss(cum[i])}`, { size: 24, color: GRAY })],
  }));
  children.push(new Paragraph({
    keepNext: true, spacing: { after: 140 }, shading: { type: ShadingType.CLEAR, fill: "EEF1F6", color: "auto" },
    indent: { left: 120, right: 120 },
    children: [run(x.cue, { size: 32, bold: true, color: NAVY })],
  }));
  const groups = toLines(x.text);
  groups.forEach((g, gi) => g.forEach((line, li) => {
    const lastOfAll = gi === groups.length - 1 && li === g.length - 1;
    children.push(new Paragraph({
      keepNext: !lastOfAll || !!x.next, keepLines: true,
      spacing: { after: li === g.length - 1 ? 110 : 20, line: 420 },
      children: highlighted(line.trim()),
    }));
  }));
  if (x.next) children.push(new Paragraph({ spacing: { after: 60 }, children: [run(`▶ 翻页：${x.next}`, { size: 26, color: GRAY })] }));
});

// 被问到时
children.push(new Paragraph({ keepNext: true, spacing: { before: 360, after: 120 }, border: { top: { style: BorderStyle.SINGLE, size: 12, color: NAVY, space: 6 } }, children: [run("被问到时（一句话回答）", { size: 32, bold: true, color: NAVY })] }));
[
  ["样本不能代表美国人，报告还有价值吗？", "有，对 AI 用户的描述可以参考；引用时要限定在 AI 用户。"],
  ["六国均值只是表述问题吗？", "数据不一定错，但放在美国图表里会让人以为美国是 14 分钟，实际是 12。"],
  ["54% 和皮尤的 24% 为什么不能比？", "皮尤分母是全体青少年，本报告只有 AI 用户；换成使用者，皮尤是 44%。"],
].forEach(([q, a]) => {
  children.push(new Paragraph({ keepNext: true, spacing: { after: 20 }, children: [run(`问：${q}`, { size: 30, bold: true })] }));
  children.push(new Paragraph({ spacing: { after: 140 }, indent: { left: 360 }, children: [run(a, { size: 30 })] }));
});

const doc = new Document({
  creator: "", title: "演讲稿：Gracenote 2026 AI 报告评析",
  styles: { default: { document: { run: { font: FONT, size: 36 } } } },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 20, color: GRAY })] })] }) },
    children,
  }],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(OUT, b); console.log("written", OUT, mmss(total)); });
