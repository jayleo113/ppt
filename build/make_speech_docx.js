// 生成手机阅读用讲稿：页面按手机屏幕比例（9:16），一页对应一张幻灯片，翻一屏就是翻一页 PPT
// 每页：进度与累计时间 → 一句话主旨 → 短句分行的讲稿 → 翻页提醒；（括号内）是 PPT 上没有的话，灰色；数字橙色加粗
// 用法：node build/make_speech_docx.js [输出 docx 路径]
const fs = require("fs");
const path = require("path");
const D = require("docx");
const { Document, Packer, Paragraph, TextRun, BorderStyle, ShadingType } = D;
const SCRIPT = require("./script.js");

const OUT = process.argv[2] || path.join(__dirname, "..", "讲稿_演讲用_最新版.docx");
const FONT = { ascii: "Arial", hAnsi: "Arial", eastAsia: "Microsoft YaHei", cs: "Arial" };
const NAVY = "1F2A44", ORANGE = "C2410C", GRAY = "6B7280";
let BODY = 40;           // 半磅：20 磅
let LINE_CAP = 12;       // 每行最多约 12 个汉字
const mmss = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
const run = (text, o = {}) => new TextRun({ text, font: FONT, size: BODY, ...o });
const width = (t) => [...t].reduce((a, c) => a + (/[\u0000-ÿ]/.test(c) ? 0.55 : 1), 0);

// 把文本拆成字符，并标记是否在（括号）内；括号内的字用灰色显示
function chars(text) {
  const out = [];
  let depth = 0;
  for (const c of text) {
    if (c === "（") depth++;
    out.push({ c, off: depth > 0 });
    if (c === "）") depth = Math.max(0, depth - 1);
  }
  return out;
}
// 分行：在逗号、顿号、冒号、分号、句号后断开（紧跟的右括号归前一段），再合并到不超过 LINE_CAP；句末另起一组
function toLines(text) {
  const cs = chars(text), units = [];
  let cur = [];
  cs.forEach((x, i) => {
    cur.push(x);
    const nxt = cs[i + 1];
    if ("，、：；。？".includes(x.c) && !(nxt && nxt.c === "）")) { units.push(cur); cur = []; }
    else if (x.c === "）" && "，、：；。？".includes(cs[i - 1].c)) { units.push(cur); cur = []; }
  });
  if (cur.length) units.push(cur);
  const groups = [];
  let group = [], line = [];
  const w = (arr) => width(arr.map((x) => x.c).join(""));
  for (const u of units) {
    if (line.length && w(line) + w(u) > LINE_CAP) { group.push(line); line = []; }
    line = line.concat(u);
    const end = u.map((x) => x.c).join("").replace(/）$/, "");
    if (/[。？]$/.test(end)) { group.push(line); groups.push(group); group = []; line = []; }
  }
  if (line.length) group.push(line);
  if (group.length) groups.push(group);
  return groups;
}
// 一行渲染成若干 run：括号内灰色；括号外的数字橙色加粗
function renderLine(line) {
  const out = [];
  let i = 0;
  while (i < line.length) {
    const off = line[i].off;
    let j = i;
    while (j < line.length && line[j].off === off) j++;
    const seg = line.slice(i, j).map((x) => x.c).join("");
    if (off) out.push(run(seg, { color: GRAY }));
    else out.push(...highlighted(seg));
    i = j;
  }
  return out;
}
// 数字与关键量词加粗变色
function highlighted(line) {
  const re = /(\d[\d,.]*\s?(?:%|分钟|个百分点|岁|国|名|人)?|三分之二|四项|四类)/g;
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
  // 字数多的页面略缩字号，保证一页放得下
  BODY = x.chars > 190 ? 32 : x.chars > 150 ? 35 : 40; LINE_CAP = x.chars > 190 ? 15 : x.chars > 150 ? 14 : 12;
  const first = i === 0;
  children.push(new Paragraph({
    pageBreakBefore: !first, spacing: { after: 80 },
    children: [run(`${i + 1}/${SCRIPT.length}`, { size: 28, bold: true, color: NAVY }), run(`　${x.title}　累计 ${mmss(acc)}`, { size: 28, color: GRAY })],
  }));
  children.push(new Paragraph({
    spacing: { after: 140 }, shading: { type: ShadingType.CLEAR, fill: "EEF1F6", color: "auto" }, indent: { left: 80, right: 80 },
    children: [run(x.cue, { size: 34, bold: true, color: NAVY })],
  }));
  if (first) children.push(new Paragraph({ spacing: { after: 100 }, children: [run("（灰色括号）内是 PPT 上没有的话：问候、过渡和补充。", { size: 24, color: GRAY })] }));
  toLines(x.text).forEach((g) => g.forEach((line, li) => {
    children.push(new Paragraph({
      keepLines: true, spacing: { after: li === g.length - 1 ? 100 : 10, line: 440 },
      children: renderLine(line),
    }));
  }));
  const nxt = SCRIPT[i + 1];
  children.push(new Paragraph({
    spacing: { before: 80 }, border: { top: { style: BorderStyle.SINGLE, size: 6, color: "D5DAE1", space: 4 } },
    children: [run(nxt ? `▶ 翻页 → 第 ${i + 2} 页 ${nxt.title}` : "■ 讲完，进入提问", { size: 28, bold: true, color: ORANGE })],
  }));
});

// 末页：被问到时
BODY = 40; LINE_CAP = 12;
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
