// 生成《Gracenote 2026 AI 报告解读》4–5 分钟课堂汇报 PPT 与讲稿
// 用法：node build/build_deck.js [输出 pptx 路径]
// 依赖：pptxgenjs、react-icons、react、react-dom、sharp、jszip（随 pptxgenjs 安装）
//
// 设计原则：每页一个结论标题（断言）+ 一个主要图示（证据）+ 至多三条短句；细节交给讲稿。
// 配色只用三种语义色：深蓝 = 报告的说法与数据，橙 = 问题所在，灰 = 中性信息。
// 字号层级：标题 30，正文 18–20，关键数字 40–64，来源小字 11。
const path = require("path");
const fs = require("fs");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const Fi = require("react-icons/fi");
const SCRIPT = require("./script.js");

const ROOT = path.join(__dirname, "..");
const OUT = process.argv[2] || path.join(ROOT, "Gracenote报告解读_课堂汇报.pptx");
const SCRIPT_MD = path.join(ROOT, "讲稿_4-5分钟.md");

const THEME = {
  name: "Navy Brief",
  headFontFace: "Microsoft YaHei",
  bodyFontFace: "Microsoft YaHei",
  colors: {
    dk1: "1F2937", lt1: "FFFFFF", dk2: "1F2A44", lt2: "F3F4F6",
    accent1: "2F6690", accent2: "3A7D44", accent3: "E4572E", accent4: "F4A259",
    accent5: "6B7280", accent6: "DCE6F0", hlink: "2F6690", folHlink: "6B7280",
  },
};
const H = THEME.colors; // 只接受十六进制的选项（图表网格线、单系列多色）用这里的值
const BAR_GRAY = "C5CBD3";

async function icon(Comp, hex, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + hex, size }));
  const buf = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 in
  pres.title = "AI 时代的电视搜索与内容发现：Gracenote 2026 报告解读与方法评价";
  pres.subject = "市场调研：方法与实践 课后作业汇报";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;

  const ic = {
    search: await icon(Fi.FiSearch, H.dk2),
    users: await icon(Fi.FiUsers, H.lt1), alert: await icon(Fi.FiAlertTriangle, H.lt1), shield: await icon(Fi.FiShield, H.lt1),
  };

  // ---------- 版式（无页脚，只保留页码） ----------
  pres.defineSlideMaster({
    title: "TITLE_DARK",
    background: { color: C.text2 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 1.9, w: 7.4, h: 1.9, fontSize: 40, bold: true, color: C.background1, valign: "bottom", align: "left", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.8, y: 4.0, w: 7.4, h: 1.0, fontSize: 18, color: C.accent6, valign: "top", align: "left", margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "SECTION_DARK",
    background: { color: C.text2 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 0.75, w: 11.7, h: 0.85, fontSize: 30, bold: true, color: C.background1, valign: "middle", align: "left", margin: 0 }, text: "" } },
    ],
    slideNumber: { x: 12.0, y: 6.95, w: 0.6, h: 0.3, fontSize: 10, color: C.accent6, align: "right" },
  });
  pres.defineSlideMaster({
    title: "CONTENT",
    background: { color: C.background1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.7, w: 12.1, h: 0.75, fontSize: 30, bold: true, color: C.text2, valign: "middle", align: "left", margin: 0 }, text: "" } },
    ],
    slideNumber: { x: 12.1, y: 6.95, w: 0.6, h: 0.3, fontSize: 10, color: C.accent5, align: "right" },
  });

  // ---------- 组件 ----------
  const card = (s, x, y, w, h, fill, name) =>
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill }, objectName: name || "卡片" });
  const text = (s, t, o) => s.addText(t, Object.assign({ margin: 0, isTextBox: true }, o));
  const pill = (s, x, y, w, h, fill, t, size = 14) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: h / 2, fill: { color: fill }, line: { color: fill }, objectName: `标签：${t}` });
    text(s, t, { x, y, w, h, fontSize: size, bold: true, color: C.background1, align: "center", valign: "middle", objectName: `标签文字：${t}` });
  };
  const src = (s, t) => text(s, t, { x: 0.6, y: 6.6, w: 11.3, h: 0.3, fontSize: 11, color: C.accent5, objectName: "来源说明" });
  // 标题上方的章节标记，如“02 研究设计”
  const head = (s, kicker, title, dark) => {
    text(s, kicker, { x: dark ? 0.8 : 0.6, y: dark ? 0.35 : 0.3, w: 8, h: 0.35, fontSize: 14, bold: true, color: dark ? C.accent4 : C.accent3, valign: "middle", objectName: "章节标记" });
    s.addText(title, { placeholder: "title" });
  };
  const arrowR = (s, x, y, h) => text(s, "→", { x, y, w: 0.3, h, fontSize: 22, bold: true, color: C.accent5, align: "center", valign: "middle", objectName: "箭头" });
  // 评价页右栏：事实 / 原因 / 影响 三行
  function analysis(s, rows) {
    [["事实", C.accent1], ["原因", C.accent5], ["影响", C.accent3]].forEach(([k, col], i) => {
      const y = 1.75 + i * 1.55;
      card(s, 6.9, y, 5.8, 1.35, C.background2, `${k}卡`);
      pill(s, 7.15, y + 0.42, 0.95, 0.5, col, k, 15);
      text(s, rows[i], { x: 8.3, y, w: 4.25, h: 1.35, fontSize: 18, color: C.text1, valign: "middle", objectName: `${k}内容` });
    });
  }
  let n = 0;
  const notes = (s) => s.addNotes(`【约 ${SCRIPT[n].secs} 秒】${SCRIPT[n++].text}`);

  // ======================= 封面 =======================
  pres.addSection({ title: "开场" });
  let s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "开场" });
  text(s, "市场调研：方法与实践 · 课后作业汇报", { x: 0.8, y: 1.2, w: 7.4, h: 0.4, fontSize: 16, color: C.accent4, objectName: "课程名" });
  s.addText("AI 时代的电视搜索\n与内容发现", { placeholder: "title" });
  s.addText("Gracenote（尼尔森旗下）2026 年报告解读", { placeholder: "body" });
  text(s, "54%", { x: 8.5, y: 1.6, w: 4.3, h: 2.0, fontSize: 120, bold: true, fontFace: "Arial", color: C.accent4, align: "center", valign: "middle", objectName: "封面数字" });
  text(s, "报告：13–14 岁受访者每天使用 AI", { x: 8.5, y: 3.6, w: 4.3, h: 0.45, fontSize: 16, color: C.accent6, align: "center", objectName: "封面数字说明" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.85, y: 4.45, w: 3.6, h: 0.8, rectRadius: 0.4, fill: { color: C.background1 }, line: { color: C.background1 }, objectName: "提问框" });
  s.addImage({ data: ic.search, x: 9.15, y: 4.68, w: 0.34, h: 0.34, objectName: "提问框图标" });
  text(s, "该数据代表哪类人群？", { x: 9.6, y: 4.45, w: 2.75, h: 0.8, fontSize: 18, bold: true, color: C.text2, valign: "middle", objectName: "提问框文字" });
  notes(s);

  // ======================= 框架与核心观点 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "开场" });
  head(s, "汇报框架", "趋势大体可信，但结论推得太远");
  ["研究背景与问题", "研究设计", "报告内容", "方法评价（重点）", "总结"].forEach((t, i) => {
    const y = 1.75 + i * 0.95, focus = i === 3;
    card(s, 0.6, y, 6.2, 0.8, focus ? C.accent6 : C.background2, `框架行${i + 1}`);
    text(s, `0${i + 1}`, { x: 0.85, y, w: 0.8, h: 0.8, fontSize: 22, bold: true, fontFace: "Arial", color: focus ? C.accent3 : C.accent1, valign: "middle", objectName: `序号${i + 1}` });
    text(s, t, { x: 1.7, y, w: 4.9, h: 0.8, fontSize: 20, bold: focus, color: C.text2, valign: "middle", objectName: `框架名${i + 1}` });
  });
  card(s, 7.2, 1.75, 5.5, 4.6, C.text2, "核心观点卡");
  text(s, [
    { text: "我的判断", options: { fontSize: 16, bold: true, color: C.accent4, breakLine: true } },
    { text: "报告看到的趋势大体可信；问题在于，它把一群 AI 用户的回答，推成了更大人群的结论。", options: { fontSize: 24, bold: true, color: C.background1 } },
  ], { x: 7.6, y: 1.95, w: 4.7, h: 4.2, valign: "middle", paraSpaceAfter: 18, objectName: "核心观点" });
  notes(s);

  // ======================= 01 背景与问题 =======================
  pres.addSection({ title: "报告介绍" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  head(s, "01  研究背景与问题", "节目越来越难找，AI 会不会成为新的入口？");
  [
    ["问题一", "怎么用 AI", "不同年龄的人，如何用 AI 找信息？"],
    ["问题二", "找不到会怎样", "节目难找，会不会让人退订？"],
    ["问题三", "信不信 AI", "人们是否相信 AI 给的答案？"],
  ].forEach(([no, k, v], i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 1.75, 3.8, 2.75, C.background2, `问题卡${i + 1}`);
    text(s, no, { x: x + 0.35, y: 1.95, w: 3.1, h: 0.4, fontSize: 16, bold: true, color: C.accent1, objectName: `问题编号${i + 1}` });
    text(s, k, { x: x + 0.35, y: 2.4, w: 3.1, h: 0.65, fontSize: 26, bold: true, color: C.text2, valign: "middle", objectName: `问题名${i + 1}` });
    text(s, v, { x: x + 0.35, y: 3.2, w: 3.15, h: 1.1, fontSize: 18, color: C.text1, valign: "top", objectName: `问题内容${i + 1}` });
  });
  card(s, 0.6, 4.85, 12.1, 1.45, C.text2, "机构条");
  text(s, [
    { text: "研究机构  ", options: { fontSize: 16, bold: true, color: C.accent4 } },
    { text: "Gracenote 隶属尼尔森，本身就做节目数据；报告最后的建议，恰好落在它自己的业务上。", options: { fontSize: 18, color: C.background1 } },
  ], { x: 0.95, y: 4.85, w: 11.5, h: 1.45, valign: "middle", objectName: "研究机构" });
  notes(s);

  // ======================= 02 研究设计 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  head(s, "02  研究设计", "两份线上问卷，撑起了报告的大部分结论");
  const th = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text2 }, fontSize: 18 } });
  const tl = (t) => ({ text: t, options: { bold: true, color: C.accent1, fill: { color: C.background2 } } });
  s.addTable([
    [th(""), th("调查一：2026 年 AI 使用调查"), th("调查二：2025 年六国流媒体调查")],
    [tl("调查对象"), "美国 13–79 岁 AI 聊天机器人用户", "六国流媒体用户"],
    [tl("调查时间"), "2026 年 1–2 月", "2025 年 7–8 月"],
    [tl("样本量"), "4,003 人", "3,000 人（每国 500）"],
  ], {
    x: 0.6, y: 1.75, w: 12.1, colW: [2.0, 5.05, 5.05], fontSize: 20, color: C.text1, valign: "middle",
    margin: [6, 14, 6, 14], border: { type: "solid", pt: 1, color: C.background1 }, rowH: [0.85, 1.05, 1.05, 1.05],
    fill: { color: C.background2 }, objectName: "研究设计表",
  });
  
  text(s, [
    { text: "注：", options: { bold: true, color: C.accent3 } },
    { text: "样本如何抽取，两份调查都没有交代。另引用尼尔森、皮尤等共 11 个来源（见附录）。", options: { color: C.text1 } },
  ], { x: 0.6, y: 6.05, w: 12.1, h: 0.5, fontSize: 18, valign: "middle", objectName: "说明条" });
  notes(s);

  // ======================= 03 报告内容（一） =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  head(s, "03  报告内容（一）", "年轻人越来越依赖 AI，却并不完全信任它");
  [
    [0.6, "54%", "13–14 岁 AI 用户\n每天都用"],
    [6.75, "75%", "受访者会回头\n核对 AI 的答案"],
  ].forEach(([x, num, d], i) => {
    card(s, x, 1.75, 5.95, 2.3, C.background2, `大数字卡${i + 1}`);
    text(s, num, { x: x + 0.35, y: 1.75, w: 2.4, h: 2.3, fontSize: 64, bold: true, fontFace: "Arial", color: C.accent1, valign: "middle", objectName: `大数字${i + 1}` });
    text(s, d, { x: x + 2.85, y: 1.75, w: 2.95, h: 2.3, fontSize: 20, color: C.text1, valign: "middle", objectName: `大数字说明${i + 1}` });
  });
  text(s, "报告的解释", { x: 0.6, y: 4.3, w: 4, h: 0.45, fontSize: 18, bold: true, color: C.text2, objectName: "解释标题" });
  [
    ["AI 能直接给出答案，还能接着追问", "所以受欢迎"],
    ["但它也会给出看似合理的错误答案", "所以还要再核对"],
  ].forEach(([cause, effect], i) => {
    const y = 4.85 + i * 0.8;
    card(s, 0.6, y, 7.9, 0.65, C.background2, `原因${i + 1}`);
    text(s, cause, { x: 0.9, y, w: 7.5, h: 0.65, fontSize: 18, color: C.text1, valign: "middle", objectName: `原因文字${i + 1}` });
    arrowR(s, 8.6, y, 0.65);
    pill(s, 9.05, y + 0.02, 3.65, 0.6, C.text2, effect, 17);
  });
  notes(s);

  // ======================= 03 报告内容（二） =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  head(s, "03  报告内容（二）", "从内容分散到用户流失，报告这样推理");
  [
    ["内容分散", "54%", "联网电视占\n美国电视时长"],
    ["找起来费时", "14 分钟", "平均找一个节目"],
    ["可能退订", "54%", "18–34 岁说可能退订"],
    ["接入可靠数据", "约 2/3", "AI 能答对的播出平台"],
  ].forEach(([k, num, d], i) => {
    const x = 0.6 + i * 3.1, last = i === 3;
    card(s, x, 1.85, 2.8, 4.1, last ? C.text2 : C.background2, `链条卡${i + 1}`);
    text(s, `第 ${i + 1} 步`, { x: x + 0.3, y: 2.05, w: 2.3, h: 0.4, fontSize: 14, bold: true, color: last ? C.accent4 : C.accent5, objectName: `步骤${i + 1}` });
    text(s, k, { x: x + 0.3, y: 2.5, w: 2.3, h: 0.95, fontSize: 21, bold: true, color: last ? C.background1 : C.text2, valign: "top", objectName: `步骤名${i + 1}` });
    text(s, num, { x: x + 0.3, y: 3.55, w: 2.3, h: 1.0, fontSize: num.length > 4 ? 36 : 44, bold: true, fontFace: "Arial", color: last ? C.accent4 : C.accent1, valign: "middle", objectName: `步骤数字${i + 1}` });
    text(s, d, { x: x + 0.3, y: 4.65, w: 2.3, h: 1.0, fontSize: 16, color: last ? C.accent6 : C.text1, valign: "top", objectName: `步骤说明${i + 1}` });
    if (!last) arrowR(s, x + 2.8, 1.85, 4.1);
  });
  src(s, "数据：尼尔森收视测量；调查二（六国）；Veed Analytics 测试（报告引用）。");
  notes(s);

  // ======================= 04 评价思路 =======================
  pres.addSection({ title: "方法评价" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "方法评价" });
  head(s, "04  方法评价", "沿着这条推理，逐环看证据站不站得住");
  [
    ["① 依赖 AI", ["调查对象", "调查时间"]],
    ["② 信任不足", ["调查对象"]],
    ["③ 难找致退订", ["研究总体", "研究方法"]],
    ["④ 接入可靠数据", ["研究方法"]],
  ].forEach(([k, dims], i) => {
    const x = 0.6 + i * 3.1;
    card(s, x, 1.8, 2.8, 1.0, C.text2, `环节${i + 1}`);
    text(s, k, { x, y: 1.8, w: 2.8, h: 1.0, fontSize: 20, bold: true, color: C.background1, align: "center", valign: "middle", objectName: `环节文字${i + 1}` });
    if (i < 3) arrowR(s, x + 2.8, 1.8, 1.0);
    text(s, "↓", { x, y: 2.85, w: 2.8, h: 0.45, fontSize: 20, bold: true, color: C.accent5, align: "center", valign: "middle", objectName: `下箭头${i + 1}` });
    card(s, x, 3.35, 2.8, 1.75, C.background2, `检验${i + 1}`);
    text(s, dims.map((d, j) => ({ text: d, options: { breakLine: j < dims.length - 1 } })), { x: x + 0.25, y: 3.35, w: 2.4, h: 1.75, fontSize: 20, bold: true, color: C.accent1, align: "center", valign: "middle", paraSpaceAfter: 6, objectName: `检验文字${i + 1}` });
  });
  card(s, 0.6, 5.45, 12.1, 0.85, C.background2, "依据条");
  text(s, [
    { text: "为什么看这四处：", options: { bold: true, color: C.accent3 } },
    { text: "同一个问题，问谁、问哪里的人、什么时候问、怎么问，得到的答案都可能不同。", options: { color: C.text1 } },
  ], { x: 0.9, y: 5.45, w: 11.6, h: 0.85, fontSize: 18, valign: "middle", objectName: "评价依据" });
  notes(s);

  // ======================= 维度一 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "方法评价" });
  head(s, "04  方法评价 · 调查对象", "问的是 AI 用户，说的却是“美国人”");
  [
    [0.9, 1.7, 4.8, C.background2, "美国人口"],
    [1.35, 2.4, 3.9, C.accent6, "互联网用户"],
    [1.8, 3.1, 3.0, "A9C3DA", "AI 聊天机器人用户"],
    [2.3, 3.8, 2.0, C.text2, ""],
  ].forEach(([x, y, d, fill, label], i) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: C.background1, width: 1.5 }, objectName: `总体圈${i + 1}` });
    if (label) text(s, label, { x, y: y + 0.1, w: d, h: 0.5, fontSize: 15, bold: true, color: C.text2, align: "center", objectName: `总体标签${i + 1}` });
  });
  text(s, [
    { text: "本次样本", options: { fontSize: 14, bold: true, color: C.background1, breakLine: true } },
    { text: "4,003", options: { fontSize: 24, bold: true, fontFace: "Arial", color: C.background1 } },
  ], { x: 2.3, y: 4.1, w: 2.0, h: 1.2, align: "center", valign: "middle", objectName: "样本标签" });
  analysis(s, [
    "4,003 名受访者\n全是 AI 聊天机器人用户",
    "按“用不用 AI”筛选，\n样本偏向会用的人",
    "网络样本不等于总体，\n结论只适用于 AI 用户",
  ]);
  src(s, "来源：Gracenote 报告；尼尔森新闻稿。");
  notes(s);

  // ======================= 维度二 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "方法评价" });
  head(s, "04  方法评价 · 研究总体", "“14 分钟”其实是六国平均，美国是 12 分钟");
  s.addChart(pres.charts.BAR, [{ name: "寻找节目时长", labels: ["巴西", "法国", "德国", "墨西哥", "英国", "美国", "六国均值"], values: [12, 26, 11, 11, 12, 12, 14] }], {
    x: 0.6, y: 1.65, w: 6.0, h: 4.8, barDir: "bar", catAxisOrientation: "maxMin",
    chartColors: [BAR_GRAY, BAR_GRAY, BAR_GRAY, BAR_GRAY, BAR_GRAY, H.accent1, H.accent3],
    showTitle: true, title: "寻找节目的平均时长（分钟）", titleFontSize: 16, titleColor: H.dk2, titleFontFace: "+mn-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 15, dataLabelColor: H.dk1, dataLabelFontFace: "+mn-lt",
    catAxisLabelFontSize: 16, catAxisLabelColor: H.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 30, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    catAxisLineShow: false, showLegend: false, barGapWidthPct: 40, objectName: "分国家寻找时长图",
  });
  analysis(s, [
    "图里的“14 分钟”，\n是六个国家的平均",
    "六国直接平均，\n法国的 26 分钟拉高了它",
    "放进美国收视图里，\n容易高估美国的困难",
  ]);
  src(s, "来源：Gracenote 2025 年报告《State of Play》分国家数据（每国 500 人）。");
  notes(s);

  // ======================= 维度三 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "方法评价" });
  head(s, "04  方法评价 · 调查时间", "分母不一样，“加速”也就无从谈起");
  [
    [1.75, "皮尤研究中心（2025 年秋）", "24%", "全体 13–14 岁青少年", C.accent5],
    [4.15, "本报告（2026 年初）", "54%", "13–14 岁 AI 用户", C.accent1],
  ].forEach(([y, who, num, base, col], i) => {
    card(s, 0.6, y, 6.0, 2.2, C.background2, `对比卡${i + 1}`);
    text(s, who, { x: 0.95, y: y + 0.2, w: 5.4, h: 0.45, fontSize: 17, bold: true, color: col, objectName: `对比机构${i + 1}` });
    text(s, num, { x: 0.95, y: y + 0.7, w: 2.4, h: 1.3, fontSize: 60, bold: true, fontFace: "Arial", color: col, valign: "middle", objectName: `对比数字${i + 1}` });
    text(s, [
      { text: "分母", options: { fontSize: 14, color: C.accent5, breakLine: true } },
      { text: base, options: { fontSize: 19, bold: true, color: C.text1 } },
    ], { x: 3.4, y: y + 0.7, w: 3.0, h: 1.3, valign: "middle", objectName: `对比分母${i + 1}` });
  });
  analysis(s, [
    "拿皮尤去年秋的 30%，\n比本报告今年初的 54%",
    "皮尤问全体青少年，\n本报告只问 AI 用户",
    "分母统一后，\n差距只剩约 10 个百分点",
  ]);
  src(s, "来源：皮尤《Teens, Social Media and AI Chatbots 2025》数据表（使用者中每日使用 44%）。");
  notes(s);

  // ======================= 维度四 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "方法评价" });
  head(s, "04  方法评价 · 研究方法", "几类不同的数据，拼不出“找不到就退订”");
  [
    ["意向 · 问卷", "54%"], ["行为 · 退订率", "5.5%"], ["预测 · 普华永道", "3,185 亿美元"], ["测试 · AI 答题", "约 2/3"],
  ].forEach(([k, num], i) => {
    const x = 0.6 + (i % 2) * 3.1, y = 1.75 + Math.floor(i / 2) * 2.4;
    card(s, x, y, 2.9, 2.2, C.background2, `数据类型卡${i + 1}`);
    text(s, k, { x: x + 0.3, y: y + 0.25, w: 2.4, h: 0.45, fontSize: 17, bold: true, color: C.accent1, objectName: `数据类型${i + 1}` });
    text(s, num, { x: x + 0.3, y: y + 0.8, w: 2.5, h: 1.1, fontSize: num.length > 5 ? 26 : 40, bold: true, fontFace: "Arial", color: C.text2, valign: "middle", objectName: `数据类型数字${i + 1}` });
  });
  analysis(s, [
    "意愿、退订率、预测、测试\n被串成一条链",
    "有的是想法，有的是行为，\n有的只是预测",
    "能说明相关，\n说明不了谁导致了谁",
  ]);
  src(s, "来源：Gracenote 报告；普华永道、Veed Analytics 原文；Fabric 数据经 Broadband TV News 转述。");
  notes(s);

  // ======================= 05 总结 =======================
  pres.addSection({ title: "总结" });
  s = pres.addSlide({ masterName: "SECTION_DARK", sectionTitle: "总结" });
  head(s, "05  总结", "趋势可以参考，结论需要收窄", true);
  [
    ["① 依赖 AI", "部分成立", C.accent1],
    ["② 信任不足", "部分成立", C.accent1],
    ["③ 难找致退订", "证据不足", C.accent3],
    ["④ 接入可靠数据", "未经检验", C.accent5],
  ].forEach(([k, tag, col], i) => {
    const y = 1.95 + i * 1.0;
    card(s, 0.8, y, 7.4, 0.82, "2C3A5C", `判断行${i + 1}`);
    text(s, k, { x: 1.1, y, w: 4.5, h: 0.82, fontSize: 20, bold: true, color: C.background1, valign: "middle", objectName: `判断环节${i + 1}` });
    pill(s, 6.2, y + 0.17, 1.75, 0.48, col, tag, 15);
  });
  text(s, [
    { text: "可取之处：", options: { bold: true, color: C.accent4 } },
    { text: "样本量、时间、年龄都交代清楚，图里的数字经得起复算。", options: { color: C.accent6 } },
  ], { x: 0.8, y: 6.05, w: 11.7, h: 0.5, fontSize: 16, valign: "middle", objectName: "优点" });
  card(s, 8.7, 1.95, 3.85, 3.82, C.background1, "讨论卡");
  text(s, [
    { text: "留给大家", options: { fontSize: 16, bold: true, color: C.accent3, breakLine: true } },
    { text: "要验证“找不到就退订”，调查该怎么设计？", options: { fontSize: 22, bold: true, color: C.text2 } },
  ], { x: 9.05, y: 2.1, w: 3.2, h: 3.5, valign: "middle", paraSpaceAfter: 14, objectName: "讨论问题" });
  notes(s);

  // ======================= 附录一 =======================
  pres.addSection({ title: "附录（备问）" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "附录（备问）" });
  head(s, "附录（备问）", "11 个来源里，报告自己的两份问卷最不透明");
  const ST = { open: [C.accent1, "方法公开"], part: [C.accent5, "部分公开"], gap: [C.accent3, "关键信息未公开"] };
  [
    ["Gracenote 2026 AI 调查", "线上 · 美国 AI 用户 4,003 人", "gap"],
    ["Gracenote 2025 流媒体调查", "线上 · 六国各 500 人", "gap"],
    ["皮尤研究中心青少年调查", "概率样本 1,458 人 · 加权", "open"],
    ["德勤数字媒体趋势调查", "美国 3,595 人 · 人口普查加权", "open"],
    ["尼尔森 NPOWER", "测量仪样本户 + 机顶盒数据", "open"],
    ["尼尔森流媒体收视", "测量仪样本户，仅电视屏幕", "open"],
    ["Gracenote 节目数据库", "企业自有数据，非抽样", "gap"],
    ["普华永道展望", "公开数据 + 访谈 + 建模", "part"],
    ["Veed Analytics 测试", "六国、独播剧；题量未公开", "gap"],
    ["南加州大学论文", "同行评审，自动分类器", "open"],
    ["Fabric 退订率", "计算方法未公开", "gap"],
  ].forEach(([name, how, st], i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = 0.6 + col * 3.075, y = 1.7 + row * 1.6;
    card(s, x, y, 2.9, 1.42, C.background2, `来源卡${i + 1}`);
    text(s, ST[st][1], { x: x + 0.2, y: y + 0.12, w: 2.5, h: 0.35, fontSize: 12, bold: true, color: ST[st][0], objectName: `来源状态${i + 1}` });
    text(s, [
      { text: name, options: { fontSize: 15, bold: true, color: C.text2, breakLine: true } },
      { text: how, options: { fontSize: 12, color: C.text1 } },
    ], { x: x + 0.2, y: y + 0.48, w: 2.6, h: 0.88, valign: "top", paraSpaceAfter: 3, objectName: `来源说明${i + 1}` });
  });
  src(s, "详见《Gracenote报告_数据来源与采集方式核查.md》。");
  s.addNotes("备问用，不计入汇报时间。被问及数据来源与方法公开程度时使用。");

  // ======================= 附录二 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "附录（备问）" });
  head(s, "附录（备问）", "几处引用，和原始来源的说法并不一致");
  const hd = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text2 }, align: "center" } });
  s.addTable([
    [hd("报告表述"), hd("原始来源")],
    ["皮尤：30% 的青少年每日使用", "精确值 28%；13–14 岁为 24%"],
    ["南加州大学：“高达 38%”数据有偏差", "仅一个知识库、一个自动指标的结果"],
    ["德勤：41% 的“订户”认为不值", "原文分母为全体消费者"],
    ["普华永道：2029 年支出 3,185 亿美元", "全球数据，非美国"],
    ["摘要：54% 的 18–34 岁“会取消”", "原题为“可能取消”，且为六国数据"],
    ["“26% 的美国人找不到想看的”", "未找到出处"],
  ], {
    x: 0.6, y: 1.7, w: 12.1, colW: [5.6, 6.5], fontSize: 16, color: C.text1, valign: "middle",
    margin: [4, 12, 4, 12], border: { type: "solid", pt: 0.75, color: C.accent6 }, rowH: [0.55, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62],
    fill: { color: C.background1 }, objectName: "口径核对表",
  });
  src(s, "来源：Gracenote 报告；皮尤、南加州大学、德勤、普华永道原文。");
  s.addNotes("备问用，不计入汇报时间。被问及报告引用数据是否准确时使用。");

  await pres.writeFile({ fileName: OUT });

  // 写入主题配色，并把主题的中文（East Asian）字体设为微软雅黑
  const { applyTheme } = require("./apply_theme.js");
  await applyTheme(OUT, THEME);
  const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));
  const zip = await JSZip.loadAsync(fs.readFileSync(OUT));
  const part = "ppt/theme/theme1.xml";
  zip.file(part, (await zip.file(part).async("string")).replace(/<a:ea typeface=""\s*\/>/g, '<a:ea typeface="Microsoft YaHei"/>'));
  fs.writeFileSync(OUT, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));

  // 讲稿 Markdown
  const total = SCRIPT.reduce((a, x) => a + x.secs, 0);
  const chars = SCRIPT.reduce((a, x) => a + x.chars, 0);
  const mmss = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
  let acc = 0;
  const md = [
    "# 讲稿：Gracenote 2026 AI 报告解读（4–5 分钟）",
    "",
    `正讲 ${SCRIPT.length} 页，计划用时约 ${mmss(total)}，全文约 ${chars} 字（按每分钟约 240 字的中速朗读）。附录两页不讲，用于回答提问。`,
    "",
    "## 汇报主线",
    "",
    "**我的判断：** 报告看到的趋势大体可信；问题在于，它把一群 AI 用户的回答，推成了更大人群的结论。",
    "",
    "**报告的推理：** ① 年轻人依赖 AI → ② 但不完全信任 → ③ 节目难找导致退订 → ④ AI 需要接入可靠数据。",
    "",
    "| 环节 | 从哪里看 | 判断 |",
    "|---|---|---|",
    "| ① 依赖 AI | 调查对象；调查时间 | 部分成立：只适用于 AI 用户，“加速”说不通 |",
    "| ② 信任不足 | 调查对象 | 部分成立：只适用于 AI 用户 |",
    "| ③ 难找致退订 | 研究总体；研究方法 | 证据不足：混用六国数据，只见相关不见因果 |",
    "| ④ 接入可靠数据 | 研究方法 | 未经检验 |",
    "",
    "**讲法：** 每页先把标题那句话说出来，再指着图或数字解释；页面只放要点，细节留给口头。",
    "",
    "## 时间分配",
    "",
    "| 页 | 内容 | 用时 | 累计 |",
    "|---|---|---|---|",
    ...SCRIPT.map((x, i) => { acc += x.secs; return `| ${i + 1} | ${x.title} | ${x.secs} 秒 | ${mmss(acc)} |`; }),
    "",
    "如需压缩时间：第 3 页可略去最后一句；第 8 页可略去最后一句。",
    "",
    "## 逐页讲稿",
    "",
    ...SCRIPT.flatMap((x, i) => [`### 第 ${i + 1} 页｜${x.title}（约 ${x.secs} 秒，${x.chars} 字）`, "", x.text, ""]),
    "## 可能的提问与回答要点",
    "",
    "**问：既然样本代表不了美国人，这份报告还有用吗？**  ",
    "答：有用。它对 AI 用户的描述是可以参考的，而且和皮尤等独立调查的方向一致。我只是觉得，引用时得说清楚这是 AI 用户的情况，不能直接换成“美国人”。",
    "",
    "**问：六国平均那一处，会不会只是写得不够严谨？**  ",
    "答：很可能是。我没有说数据造假。但读者看那张图，会以为美国人平均要找 14 分钟，而原始数据里美国是 12 分钟。数字没错，放的位置让它说了别的话。",
    "",
    "**问：这些来源你是怎么核对的？**  ",
    "答：对照了报告原文、Gracenote 前一年的报告，以及皮尤、德勤、普华永道和南加州大学论文的原文，11 个来源逐一看了它们公开了哪些方法信息（见附录）。",
    "",
  ].join("\n");
  fs.writeFileSync(SCRIPT_MD, md);
  console.log("written", OUT, "| script", mmss(total), chars, "chars");
})().catch((e) => { console.error(e); process.exit(1); });
