// 生成手机阅读用讲稿：页面按手机屏幕比例（9:16），一页对应一张幻灯片，翻一屏就是翻一页 PPT
// 每页：进度与累计时间 → 一句话主旨 → 短句分行的讲稿 → 翻页提示；数字用橙色加粗
// 用法：node build/make_speech_docx.js [输出 docx 路径]
const fs = require("fs");
const path = require("path");
const D = require("docx");
const { Document, Packer, Paragraph, TextRun, BorderStyle, ShadingType } = D;
const SCRIPT = require("./script.js");

const OUT = process.argv[2] || path.join(__dirname, "..", "讲稿_演讲用.docx");
const FONT = { ascii: "Arial", hAnsi: "Arial", eastAsia: "Microsoft YaHei", cs: "Arial" };
const NAVY = "1F2A44", ORANGE = "C2410C", GRAY = "6B7280";
const BODY = 40;           // 半磅：20 磅
const LINE_CAP = 12;       // 每行最多约 12 个汉字
const mmss = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
const run = (text, o = {}) => new TextRun({ text, font: FONT, size: BODY, ...o });
const width = (t) => [...t].reduce((a, c) => a + (/[\u0000-ÿ]/.test(c) ? 0.55 : 1), 0);

// 分行：按逗号、分号、句号切成小段，再合并到不超过 LINE_CAP；每个句号后多空一点
function toLines(text) {
  const out = [];
  for (const sent of text.split(/(?<=[。；？])/).filter(Boolean)) {
    const lines = [];
    let cur = "";
    for (const u of sent.split(/(?<=[，、：])/)) {
      if (cur && width(cur + u) > LINE_CAP) { lines.push(cur); cur = u; } else cur += u;
    }
    if (cur) lines.push(cur);
    out.push(lines);
  }
  return out;
}
// 数字与关键量词加粗变色
function highlighted(line) {
  const re = /(\d[\d,.]*\s?(?:%|分钟|个百分点|岁|国|名)?|三分之二|四项|四类数据)/g;
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
let acc = 0;
SCRIPT.forEach((x, i) => {
  acc += x.secs;
  const first = i === 0;
  children.push(new Paragraph({
    pageBreakBefore: !first, spacing: { after: 80 },
    children: [run(`${i + 1}/${SCRIPT.length}`, { size: 28, bold: true, color: NAVY }), run(`　${x.title}　累计 ${mmss(acc)}`, { size: 28, color: GRAY })],
  }));
  children.push(new Paragraph({
    spacing: { after: 140 }, shading: { type: ShadingType.CLEAR, fill: "EEF1F6", color: "auto" }, indent: { left: 80, right: 80 },
    children: [run(x.cue, { size: 34, bold: true, color: NAVY })],
  }));
  const groups = toLines(x.text);
  groups.forEach((g, gi) => g.forEach((line, li) => {
    children.push(new Paragraph({
      keepLines: true, spacing: { after: li === g.length - 1 ? 100 : 10, line: 440 },
      children: highlighted(line.trim()),
    }));
  }));
  if (x.next) children.push(new Paragraph({
    spacing: { before: 60 }, border: { top: { style: BorderStyle.SINGLE, size: 6, color: "D5DAE1", space: 4 } },
    children: [run(`▶ 翻页：${x.next}`, { size: 30, color: GRAY })],
  }));
});

// 末页：被问到时
children.push(new Paragraph({ pageBreakBefore: true, spacing: { after: 140 }, children: [run("被问到时", { size: 30, bold: true, color: NAVY })] }));
[
  ["样本不能代表美国人，报告还有价值吗？", "有，对 AI 用户的描述可以参考；引用时要限定在 AI 用户。"],
  ["六国均值只是表述问题吗？", "数据不一定错，但放在美国图表里会让人以为美国是 14 分钟，实际是 12。"],
  ["54% 和皮尤的 24% 为什么不能比？", "皮尤分母是全体青少年，本报告只有 AI 用户；换成使用者，皮尤是 44%。"],
].forEach(([q, a]) => {
  children.push(new Paragraph({ spacing: { after: 20 }, children: [run(`问：${q}`, { bold: true })] }));
  children.push(new Paragraph({ spacing: { after: 140 }, indent: { left: 200 }, children: [run(a)] }));
});

const doc = new Document({
  creator: "", title: "演讲稿：Gracenote 2026 AI 报告评析（手机版）",
  styles: { default: { document: { run: { font: FONT, size: BODY } } } },
  sections: [{
    properties: { page: { size: { width: 6123, height: 10886 }, margin: { top: 400, bottom: 400, left: 400, right: 400 } } },
    children,
  }],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(OUT, b); console.log("written", OUT, mmss(acc)); });
