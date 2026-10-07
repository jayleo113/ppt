// 生成《Gracenote 2026 AI 报告解读》4–5 分钟课堂分享 PPT 与讲稿
// 用法：node build/build_deck.js [输出 pptx 路径]
// 依赖：pptxgenjs、react-icons、react、react-dom、sharp、jszip（随 pptxgenjs 安装）
const path = require("path");
const fs = require("fs");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const Fi = require("react-icons/fi");
const SCRIPT = require("./script.js");

const ROOT = path.join(__dirname, "..");
const OUT = process.argv[2] || path.join(ROOT, "Gracenote_AI报告解读_课堂分享.pptx");
const SCRIPT_MD = path.join(ROOT, "讲稿_4-5分钟.md");

const THEME = {
  name: "Search Glow",
  headFontFace: "Microsoft YaHei",
  bodyFontFace: "Microsoft YaHei",
  colors: {
    dk1: "1C1733", lt1: "FFFFFF", dk2: "2B1D6B", lt2: "F3F1FA",
    accent1: "5B3FD9", accent2: "0F8B8D", accent3: "D9480F", accent4: "7CC242",
    accent5: "6E6890", accent6: "E4DFF8", hlink: "5B3FD9", folHlink: "6E6890",
  },
};
const H = THEME.colors; // 只接受十六进制的选项（图表网格线、单系列多色）用这里的值
const MUTED_BAR = "A99BEA";

async function icon(Comp, hex, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + hex, size }));
  const buf = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 in
  pres.title = "54% 的 13–14 岁每天都用 AI？Gracenote 2026 报告解读";
  pres.subject = "市场调研：方法与实践 课后作业随堂分享";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;

  const W = (c) => icon(c, H.lt1);
  const ic = {
    search: await icon(Fi.FiSearch, H.accent1),
    msg: await W(Fi.FiMessageCircle), searchLt: await W(Fi.FiSearch), shield: await W(Fi.FiShield),
    database: await W(Fi.FiDatabase), flag: await W(Fi.FiFlag),
    users: await W(Fi.FiUsers), globe: await W(Fi.FiGlobe), clock: await W(Fi.FiClock), sliders: await W(Fi.FiSliders),
    check: await W(Fi.FiCheck),
  };

  // ---------- 版式 ----------
  pres.defineSlideMaster({
    title: "TITLE_DARK",
    background: { color: C.text2 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 1.7, w: 7.2, h: 2.3, fontSize: 44, bold: true, color: C.background1, valign: "bottom", align: "left", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.8, y: 4.25, w: 7.2, h: 1.5, fontSize: 18, color: C.accent6, valign: "top", align: "left", margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "SECTION_DARK",
    background: { color: C.text2 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 0.55, w: 11.7, h: 0.95, fontSize: 32, bold: true, color: C.background1, valign: "middle", align: "left", margin: 0 }, text: "" } },
    ],
    slideNumber: { x: 12.0, y: 6.95, w: 0.6, h: 0.3, fontSize: 10, color: C.accent6, align: "right" },
  });
  pres.defineSlideMaster({
    title: "CONTENT",
    background: { color: C.background1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.4, w: 8.2, h: 0.85, fontSize: 30, bold: true, color: C.text2, valign: "middle", align: "left", margin: 0 }, text: "" } },
    ],
    slideNumber: { x: 12.1, y: 6.95, w: 0.6, h: 0.3, fontSize: 10, color: C.accent5, align: "right" },
  });

  // ---------- 组件 ----------
  const card = (s, x, y, w, h, fill, name) =>
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: fill }, objectName: name || "卡片" });
  const text = (s, t, o) => s.addText(t, Object.assign({ margin: 0, isTextBox: true }, o));
  const src = (s, t, y = 6.5) => text(s, t, { x: 0.6, y, w: 12.1, h: 0.32, fontSize: 10, color: C.accent5, objectName: "来源说明" });
  function iconDot(s, data, x, y, d, fill) {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill }, objectName: "图标底" });
    const p = d * 0.25;
    s.addImage({ data, x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p, objectName: "图标" });
  }
  // 四个评价角度的进度标签：评价部分统一的导航母题
  const ANGLES = ["对象", "总体", "时间", "方法"];
  function tracker(s, active) {
    ANGLES.forEach((a, i) => {
      const x = 8.95 + i * 0.96, on = i === active;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 0.62, w: 0.9, h: 0.42, rectRadius: 0.21, fill: { color: on ? C.accent1 : C.background2 }, line: { color: on ? C.accent1 : C.accent6 }, objectName: `角度${i + 1}` });
      text(s, a, { x, y: 0.62, w: 0.9, h: 0.42, fontSize: 12, bold: on, color: on ? C.background1 : C.accent5, align: "center", valign: "middle", objectName: `角度文字${i + 1}` });
    });
  }
  let n = 0;
  const notes = (s) => s.addNotes(`【约 ${SCRIPT[n].secs} 秒】${SCRIPT[n++].text}`);

  // ======================= 1 封面 =======================
  pres.addSection({ title: "开场" });
  let s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "开场" });
  text(s, "市场调研：方法与实践 ｜ 课后作业分享", { x: 0.8, y: 1.05, w: 7.2, h: 0.4, fontSize: 14, color: C.accent6, objectName: "课程名" });
  s.addText("54% 的 13–14 岁\n每天都用 AI？", { placeholder: "title" });
  s.addText("解读尼尔森旗下 Gracenote 2026 年的行业报告\n《TV Search and Discovery in the AI Era》\n主题：AI 时代，人们怎样找电视节目", { placeholder: "body" });
  text(s, "54%", { x: 8.5, y: 1.55, w: 4.3, h: 2.2, fontSize: 120, bold: true, fontFace: "Arial", color: C.accent4, align: "center", valign: "middle", objectName: "封面数字" });
  text(s, "报告：13–14 岁受访者每天用 AI 的比例", { x: 8.3, y: 3.75, w: 4.7, h: 0.45, fontSize: 13, color: C.accent6, align: "center", objectName: "封面数字说明" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.75, y: 4.6, w: 3.8, h: 0.8, rectRadius: 0.4, fill: { color: C.background1 }, line: { color: C.background1 }, objectName: "搜索框" });
  s.addImage({ data: ic.search, x: 9.05, y: 4.83, w: 0.34, h: 0.34, objectName: "搜索框图标" });
  text(s, "这个数字代表的是谁？", { x: 9.55, y: 4.6, w: 2.9, h: 0.8, fontSize: 18, bold: true, color: C.text2, valign: "middle", objectName: "搜索框问题" });
  notes(s);

  // ======================= 2 研究问题 =======================
  pres.addSection({ title: "报告介绍" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  s.addText("这份报告在问什么", { placeholder: "title" });
  text(s, [
    { text: "背景：", options: { bold: true, color: C.accent1 } },
    { text: "流媒体平台越来越多，想看一部剧常常不知道去哪找；不少人开始直接问 ChatGPT 这类 AI 聊天机器人。", options: { color: C.text1 } },
  ], { x: 0.6, y: 1.35, w: 12.1, h: 0.5, fontSize: 16, valign: "middle", objectName: "背景" });
  [
    [ic.msg, "使用", "人们，尤其是年轻人，怎样用 AI 聊天机器人找信息？"],
    [ic.searchLt, "痛点", "流媒体平台越来越多，找节目有多难？会不会因此退订？"],
    [ic.shield, "信任", "观众相信 AI 给出的娱乐和体育信息吗？"],
  ].forEach(([img, k, v], i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 2.05, 3.8, 1.95, C.background2, `问题卡${i + 1}`);
    iconDot(s, img, x + 0.3, 2.25, 0.65, C.accent1);
    text(s, `问题 ${i + 1} · ${k}`, { x: x + 1.1, y: 2.25, w: 2.5, h: 0.65, fontSize: 18, bold: true, color: C.text2, valign: "middle", objectName: `问题标题${i + 1}` });
    text(s, v, { x: x + 0.3, y: 3.0, w: 3.2, h: 0.85, fontSize: 15, color: C.text1, valign: "top", objectName: `问题内容${i + 1}` });
  });
  card(s, 0.6, 4.25, 12.1, 2.1, C.text2, "机构与主张");
  iconDot(s, ic.database, 0.95, 4.6, 0.6, C.accent1);
  text(s, [
    { text: "谁做的", options: { fontSize: 16, bold: true, color: C.accent6, breakLine: true } },
    { text: "Gracenote，属于尼尔森（全球最大的收视率调查公司），专门给电视和流媒体平台提供节目资料：片名、简介、在哪能看。", options: { fontSize: 15, color: C.background1 } },
  ], { x: 1.75, y: 4.4, w: 4.7, h: 1.8, valign: "middle", paraSpaceAfter: 6, objectName: "机构说明" });
  iconDot(s, ic.flag, 6.85, 4.6, 0.6, C.accent3);
  text(s, [
    { text: "报告主张", options: { fontSize: 16, bold: true, color: C.accent6, breakLine: true } },
    { text: "AI 会成为人们找节目的入口，但必须接入可信的行业数据——这正是 Gracenote 卖的东西。", options: { fontSize: 15, color: C.background1 } },
  ], { x: 7.65, y: 4.4, w: 4.8, h: 1.8, valign: "middle", paraSpaceAfter: 6, objectName: "报告主张" });
  notes(s);

  // ======================= 3 研究方法 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  s.addText("研究方法：两份核心问卷", { placeholder: "title" });
  const surveys = [
    ["调查一：2026 年 AI 使用调查", "报告里所有关于 AI 的数字都来自这里", [
      ["调查对象", "美国 13–79 岁 AI 聊天机器人用户"], ["调查时间", "2026.1.23–2.4"], ["调查方式", "线上问卷"],
      ["样本量", "4,003"], ["抽样方式", "未披露：样本来源、加权、回应率"]]],
    ["调查二：2025 年六国流媒体调查", "“找节目难”“会退订”等数字来自这里", [
      ["调查对象", "巴西、法、德、墨、美、英的流媒体用户"], ["调查时间", "2025.7.28–8.1"], ["调查方式", "线上问卷"],
      ["样本量", "3,000（每国 500）"], ["抽样方式", "未披露：样本来源、加权、回应率"]]],
  ];
  surveys.forEach(([name, use, rows], i) => {
    const x = 0.6 + i * 6.15;
    card(s, x, 1.5, 5.95, 4.35, C.background2, `问卷卡${i + 1}`);
    text(s, [
      { text: name, options: { fontSize: 18, bold: true, color: C.text2, breakLine: true } },
      { text: use, options: { fontSize: 12, color: C.accent5 } },
    ], { x: x + 0.3, y: 1.65, w: 5.4, h: 0.8, valign: "middle", objectName: `问卷名${i + 1}` });
    rows.forEach(([k, v], j) => {
      const y = 2.6 + j * 0.62, gap = j === rows.length - 1;
      if (gap) card(s, x + 0.15, y - 0.04, 5.65, 0.58, C.background1, "未披露底");
      text(s, k, { x: x + 0.3, y, w: 1.3, h: 0.5, fontSize: 13, bold: true, color: gap ? C.accent3 : C.accent5, valign: "middle", objectName: `方法项${i + 1}-${j + 1}` });
      text(s, v, { x: x + 1.65, y, w: 4.1, h: 0.5, fontSize: 15, bold: gap, color: gap ? C.accent3 : C.text1, valign: "middle", objectName: `方法值${i + 1}-${j + 1}` });
    });
  });
  text(s, "此外还引用了尼尔森收视率数据、Gracenote 节目资料库，以及皮尤、德勤、普华永道等机构的研究，共 11 个来源（核查见附录一）。", { x: 0.6, y: 6.05, w: 12.1, h: 0.4, fontSize: 14, color: C.text1, objectName: "其他来源" });
  src(s, "来源：报告的数据说明；尼尔森新闻稿（2026.4）；Gracenote 2025 年报告《State of Play》的数据说明。", 6.5);
  notes(s);

  // ======================= 4 主要结论 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  s.addText("报告的主要结论", { placeholder: "title" });
  [
    ["54%", "13–14 岁 AI 用户每天都用（报告称为“Alpha 世代”）", "调查一", C.accent1],
    ["75%", "受访者会核查 AI 给出的答案", "调查一", C.accent1],
    ["14 分钟", "平均找一个想看的节目所花时间", "调查二（六国）", C.accent2],
    ["54%", "18–34 岁：找不到想看的，可能会退订", "调查二（六国）", C.accent2],
  ].forEach(([num, d, from, col], i) => {
    const x = 0.6 + i * 3.075;
    card(s, x, 1.5, 2.85, 2.85, C.background2, `结论卡${i + 1}`);
    text(s, num, { x: x + 0.25, y: 1.7, w: 2.45, h: 0.9, fontSize: num.length > 4 ? 34 : 44, bold: true, fontFace: "Arial", color: col, valign: "middle", objectName: `结论数字${i + 1}` });
    text(s, d, { x: x + 0.25, y: 2.7, w: 2.4, h: 0.95, fontSize: 15, color: C.text1, valign: "top", objectName: `结论说明${i + 1}` });
    text(s, from, { x: x + 0.25, y: 3.8, w: 2.4, h: 0.35, fontSize: 11, color: C.accent5, objectName: `结论来源${i + 1}` });
  });
  text(s, "报告的逻辑链", { x: 0.6, y: 4.65, w: 4, h: 0.4, fontSize: 15, bold: true, color: C.text2, objectName: "逻辑链标题" });
  const chain = ["年轻人越来越依赖 AI", "但不信任 AI 的答案", "节目难找导致退订", "所以 AI 要接入可信数据"];
  chain.forEach((t, i) => {
    const x = 0.6 + i * 3.13, last = i === chain.length - 1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 5.15, w: 2.7, h: 0.8, rectRadius: 0.4, fill: { color: last ? C.accent1 : C.background2 }, line: { color: last ? C.accent1 : C.accent6 }, objectName: `链${i + 1}` });
    text(s, t, { x, y: 5.15, w: 2.7, h: 0.8, fontSize: 14, bold: last, color: last ? C.background1 : C.text2, align: "center", valign: "middle", objectName: `链文字${i + 1}` });
    if (!last) text(s, "→", { x: x + 2.7, y: 5.15, w: 0.43, h: 0.8, fontSize: 20, bold: true, color: C.accent5, align: "center", valign: "middle", objectName: `箭头${i + 1}` });
  });
  src(s, "来源：Gracenote 报告正文与图表。", 6.5);
  notes(s);

  // ======================= 5 评价框架 =======================
  pres.addSection({ title: "评价" });
  s = pres.addSlide({ masterName: "SECTION_DARK", sectionTitle: "评价" });
  s.addText("怎么评价：比起结果，更该看方法", { placeholder: "title" });
  text(s, "课上的春晚满意度案例：央视 81.6% 叫好，新浪网只有 11.5%。调查对象、研究总体、调查时间、研究方法不同，结果必然不同。", { x: 0.8, y: 1.6, w: 11.7, h: 0.8, fontSize: 16, color: C.accent6, objectName: "框架引言" });
  [
    [ic.users, "一、调查对象", "问的是 AI 用户，常被写成“美国人”"],
    [ic.globe, "二、研究总体", "六国平均被当成美国数字"],
    [ic.clock, "三、调查时间", "不同调查、不同时间的数字直接比"],
    [ic.sliders, "四、研究方法", "四种不同数据串成因果链"],
  ].forEach(([img, k, v], i) => {
    const x = 0.8 + i * 2.98;
    card(s, x, 2.75, 2.78, 3.0, C.accent1, `框架卡${i + 1}`);
    iconDot(s, img, x + 0.3, 3.05, 0.75, C.text2);
    text(s, k, { x: x + 0.3, y: 3.95, w: 2.3, h: 0.5, fontSize: 20, bold: true, color: C.background1, objectName: `框架名${i + 1}` });
    text(s, [
      { text: "这份报告：", options: { fontSize: 13, color: C.accent6, breakLine: true } },
      { text: v, options: { fontSize: 15, bold: true, color: C.background1 } },
    ], { x: x + 0.3, y: 4.5, w: 2.25, h: 1.15, valign: "top", paraSpaceAfter: 4, objectName: `框架问题${i + 1}` });
  });
  notes(s);

  // ======================= 6 对象 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "评价" });
  s.addText("对象：4,003 人是 AI 用户", { placeholder: "title" });
  tracker(s, 0);
  [
    [0.6, 1.5, 4.8, C.background2, "美国人口"],
    [1.05, 2.2, 3.9, C.accent6, "互联网用户"],
    [1.5, 2.9, 3.0, MUTED_BAR, "AI 聊天机器人用户"],
    [2.0, 3.6, 2.0, C.accent1, ""],
  ].forEach(([x, y, d, fill, label], i) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: C.background1, width: 1.5 }, objectName: `总体圈${i + 1}` });
    if (label) text(s, label, { x, y: y + 0.12, w: d, h: 0.45, fontSize: 13, bold: true, color: C.text2, align: "center", objectName: `总体标签${i + 1}` });
  });
  text(s, [
    { text: "本次受访者", options: { fontSize: 13, bold: true, color: C.background1, breakLine: true } },
    { text: "4,003", options: { fontSize: 22, bold: true, fontFace: "Arial", color: C.background1 } },
  ], { x: 2.0, y: 3.9, w: 2.0, h: 1.2, align: "center", valign: "middle", objectName: "受访者标签" });
  [
    ["报告的写法", C.accent2, "调查的是“用 AI 聊天机器人的人”，正文却常把结论写成“美国人”如何如何。"],
    ["“Alpha 世代”", C.accent1, "报告把 13–14 岁受访者叫作 Alpha 世代；这个世代其实指 2010–2024 年出生的所有人。"],
    ["没有公开", C.accent3, "样本来源、是否概率抽样、加权、回应率、各年龄组人数。"],
  ].forEach(([k, col, v], i) => {
    const y = 1.55 + i * 1.3;
    text(s, [
      { text: k, options: { fontSize: 16, bold: true, color: col, breakLine: true } },
      { text: v, options: { fontSize: 15, color: C.text1 } },
    ], { x: 6.0, y, w: 6.7, h: 1.15, valign: "top", paraSpaceAfter: 4, objectName: `对象要点${i + 1}` });
  });
  card(s, 6.0, 5.55, 6.7, 0.8, C.background2, "Durex卡");
  text(s, "和课上 Durex 网络调查是同一个问题：网络样本能否代表总体？", { x: 6.25, y: 5.55, w: 6.3, h: 0.8, fontSize: 15, bold: true, color: C.text2, valign: "middle", objectName: "Durex联系" });
  src(s, "来源：Gracenote 报告；尼尔森新闻稿原文：“Gen Alpha findings are based on respondents ages 13 and 14”。");
  notes(s);

  // ======================= 7 总体 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "评价" });
  s.addText("总体：六国平均当成了美国数字", { placeholder: "title" });
  tracker(s, 1);
  s.addChart(pres.charts.BAR, [{ name: "找节目时间", labels: ["巴西", "法国", "德国", "墨西哥", "英国", "美国", "六国平均"], values: [12, 26, 11, 11, 12, 12, 14] }], {
    x: 0.6, y: 1.45, w: 5.6, h: 4.95, barDir: "bar", catAxisOrientation: "maxMin",
    chartColors: [MUTED_BAR, MUTED_BAR, MUTED_BAR, MUTED_BAR, MUTED_BAR, H.accent1, H.accent3],
    showTitle: true, title: "找到想看的节目要几分钟（六国调查的原始报告）", titleFontSize: 14, titleColor: H.dk2, titleFontFace: "+mn-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: '0" 分钟"', dataLabelFontSize: 12, dataLabelColor: H.dk1, dataLabelFontFace: "+mn-lt",
    catAxisLabelFontSize: 13, catAxisLabelColor: H.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 32, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    catAxisLineShow: false, showLegend: false, barGapWidthPct: 45, objectName: "分国家找节目时间图",
  });
  [
    ["14 分钟", "来自 Gracenote 去年的六国调查：美国 12 分钟，14 分钟是六国平均。这份报告却把它放进讲美国人看电视的图里。"],
    ["54%", "“18–34 岁可能退订”也是六国数字；报告另说“50% 的美国观众会考虑退订”，原始报告里只有六国的 49%。"],
    ["32%", "同一道题，报告一处写 32%（六国平均），另一处写成“34% 的美国人”。"],
  ].forEach(([k, v], i) => {
    const y = 1.5 + i * 1.65;
    card(s, 6.6, y, 6.1, 1.45, C.background2, `口径卡${i + 1}`);
    text(s, k, { x: 6.85, y, w: 1.5, h: 1.45, fontSize: 22, bold: true, color: C.accent3, valign: "middle", objectName: `口径数字${i + 1}` });
    text(s, v, { x: 8.4, y: y + 0.08, w: 4.15, h: 1.3, fontSize: 14, color: C.text1, valign: "middle", objectName: `口径说明${i + 1}` });
  });
  src(s, "来源：Gracenote 报告；Gracenote 2025 年报告《State of Play》分国家、分年龄图表（每国 500 人）。", 6.55);
  notes(s);

  // ======================= 8 时间与分母 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "评价" });
  s.addText("时间：24% 到 54% 不是“增长”", { placeholder: "title" });
  tracker(s, 2);
  text(s, "报告原话：皮尤研究中心 2025 年秋发现 30% 的青少年每天用 AI 聊天机器人，“仅仅几个月后”我们的调查显示超过一半，说明使用频率“在加速”。", { x: 0.6, y: 1.4, w: 12.1, h: 0.65, fontSize: 15, italic: true, color: C.text2, objectName: "报告原话" });
  [
    [0.6, "皮尤研究中心（Pew，美国权威民调机构）", "24%", C.accent5, ["分母：全体 13–14 岁青少年，用不用 AI 都算", "概率样本，加权；2025.9–10"]],
    [7.23, "Gracenote（本报告）", "54%", C.accent1, ["分母：13–14 岁的 AI 聊天机器人用户", "线上样本，未公开加权；2026.1–2"]],
  ].forEach(([x, who, num, col, meta], i) => {
    card(s, x, 2.25, 5.5, 2.65, C.background2, `对比卡${i + 1}`);
    text(s, who, { x: x + 0.3, y: 2.4, w: 4.9, h: 0.45, fontSize: 16, bold: true, color: col, objectName: `对比机构${i + 1}` });
    text(s, [
      { text: num, options: { fontSize: 54, bold: true, fontFace: "Arial", color: col } },
      { text: "  13–14 岁每天使用", options: { fontSize: 15, color: C.text1 } },
    ], { x: x + 0.3, y: 2.85, w: 5.0, h: 1.0, valign: "middle", objectName: `对比数字${i + 1}` });
    text(s, meta.map((m, j) => ({ text: m, options: { breakLine: j < meta.length - 1 } })), { x: x + 0.3, y: 3.9, w: 5.0, h: 0.85, fontSize: 13, color: C.text1, valign: "top", paraSpaceAfter: 2, objectName: `对比说明${i + 1}` });
  });
  text(s, "≠", { x: 6.1, y: 2.25, w: 1.13, h: 2.65, fontSize: 48, bold: true, color: C.accent3, align: "center", valign: "middle", objectName: "不等号" });
  card(s, 0.6, 5.15, 12.1, 1.2, C.text2, "同分母条");
  text(s, [
    { text: "如果都只看用 AI 的人：", options: { bold: true, color: C.accent6 } },
    { text: "皮尤 44% 对 Gracenote 54%，只差约 10 个百分点。剩下的差距还可能来自年龄、方法、时间不同，不能说明“加速”。", options: { color: C.background1 } },
  ], { x: 0.9, y: 5.15, w: 11.5, h: 1.2, fontSize: 15, valign: "middle", objectName: "同分母结论" });
  src(s, "来源：Gracenote 报告；皮尤《Teens, Social Media and AI Chatbots 2025》数据表（全体每天 28%，13–14 岁 24%，使用者中 44%）。", 6.5);
  notes(s);

  // ======================= 9 方法 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "评价" });
  s.addText("方法：四种数据拼成一条因果链", { placeholder: "title" });
  tracker(s, 3);
  [
    ["意向 · 问卷", C.accent1, "54%", "18–34 岁说“可能会退订”", "六国数字"],
    ["行为 · 行业统计", C.accent2, "5.5%", "流媒体平台每月退订率", "算法未公开；另一机构测得 2019 年已是 4.1%"],
    ["预测 · 普华永道", C.text2, "3,185 亿美元", "网络视频与付费电视 2029 年总支出", "全球数字，不是美国"],
    ["测试 · 让 AI 答题", C.accent5, "约 2/3", "AI 答对了剧在哪个平台能看", "6 国合并：美英德约 80%，法意西不到 30%"],
  ].forEach(([k, col, num, d, cav], i) => {
    const x = 0.6 + i * 3.12;
    card(s, x, 1.5, 2.75, 2.75, C.background2, `数据卡${i + 1}`);
    text(s, k, { x: x + 0.25, y: 1.65, w: 2.3, h: 0.4, fontSize: 14, bold: true, color: col, objectName: `数据类型${i + 1}` });
    text(s, num, { x: x + 0.25, y: 2.05, w: 2.35, h: 0.7, fontSize: num.length > 5 ? 22 : 32, bold: true, color: col, valign: "middle", objectName: `数据数字${i + 1}` });
    text(s, [
      { text: d, options: { fontSize: 14, color: C.text1, breakLine: true } },
      { text: cav, options: { fontSize: 12, color: C.accent3 } },
    ], { x: x + 0.25, y: 2.8, w: 2.35, h: 1.35, valign: "top", paraSpaceAfter: 4, objectName: `数据说明${i + 1}` });
    if (i < 3) text(s, "→", { x: x + 2.75, y: 1.5, w: 0.37, h: 2.75, fontSize: 20, bold: true, color: C.accent5, align: "center", valign: "middle", objectName: `箭头${i + 1}` });
  });
  [
    [0.6, "因果链没有被证明", "四种数据对象不同、性质不同，也没追踪同一批人或做实验，证明不了“找不到 → 退订”；报告提出的办法（让 AI 接入行业数据库）也没有检验效果。"],
    [6.75, "有些引用被放大了", "南加州大学研究的“38% 数据有偏差”，只是一个知识库、一个自动打分指标的结果；德勤的“41% 觉得不值”指全体消费者，报告写成了“订户”。"],
  ].forEach(([x, k, v], i) => {
    card(s, x, 4.5, 5.95, 1.85, C.background2, `方法结论卡${i + 1}`);
    text(s, [
      { text: k, options: { fontSize: 16, bold: true, color: C.accent3, breakLine: true } },
      { text: v, options: { fontSize: 14, color: C.text1 } },
    ], { x: x + 0.3, y: 4.6, w: 5.4, h: 1.65, valign: "middle", paraSpaceAfter: 4, objectName: `方法结论${i + 1}` });
  });
  src(s, "来源：Gracenote 报告；普华永道（PwC）、Veed Analytics 测试、南加州大学论文（EMNLP 2021）、德勤（Deloitte）原文；Antenna 数据经 MediaPost 转述。", 6.5);
  notes(s);

  // ======================= 10 我的评价 =======================
  pres.addSection({ title: "结论" });
  s = pres.addSlide({ masterName: "SECTION_DARK", sectionTitle: "结论" });
  s.addText("我的评价", { placeholder: "title" });
  card(s, 0.8, 1.65, 3.75, 4.6, C.accent1, "优点卡");
  text(s, "做得好的", { x: 1.1, y: 1.85, w: 3.2, h: 0.5, fontSize: 18, bold: true, color: C.accent6, objectName: "优点标题" });
  ["公开了样本量、时间、年龄和筛选条件", "每张图都有读法说明和来源", "我用图里的原始数字复算了几处，都对得上"].forEach((t, i) => {
    const y = 2.5 + i * 1.2;
    iconDot(s, ic.check, 1.1, y + 0.05, 0.5, C.accent2);
    text(s, t, { x: 1.75, y, w: 2.6, h: 1.0, fontSize: 14, color: C.background1, valign: "top", objectName: `优点${i + 1}` });
  });
  [
    [1.65, C.accent2, "可以当作", "行业趋势的信号：年轻人在用 AI 找节目，但并不信任它。"],
    [4.0, C.accent3, "不宜当作", "对“美国人”的精确数据，或“找不到 → 退订”的因果证据。"],
  ].forEach(([y, fill, k, v], i) => {
    card(s, 4.8, y, 3.9, 2.25, fill, `判断卡${i + 1}`);
    text(s, [
      { text: k, options: { fontSize: 18, bold: true, color: C.background1, breakLine: true } },
      { text: v, options: { fontSize: 15, color: C.background1 } },
    ], { x: 5.1, y: y + 0.15, w: 3.35, h: 1.95, valign: "middle", paraSpaceAfter: 6, objectName: `判断${i + 1}` });
  });
  card(s, 8.95, 1.65, 3.6, 4.6, C.background1, "讨论卡");
  text(s, [
    { text: "留给大家的问题", options: { fontSize: 16, bold: true, color: C.accent1, breakLine: true } },
    { text: "如果要验证“找不到节目会导致退订”，你会怎么设计调查？", options: { fontSize: 19, bold: true, color: C.text1, breakLine: true } },
    { text: "提示：追踪同一批人，既问“会不会退订”，也记录后来是否真的退订。", options: { fontSize: 13, color: C.accent5 } },
  ], { x: 9.25, y: 1.85, w: 3.05, h: 4.2, valign: "middle", paraSpaceAfter: 16, objectName: "讨论问题" });
  text(s, "提醒：报告的主张（AI 要接入可信的行业数据）正是 Gracenote 的业务。这是要细看方法的理由，但不能据此断定数据有误。", { x: 0.8, y: 6.35, w: 11.75, h: 0.4, fontSize: 12, color: C.accent6, objectName: "利益说明" });
  notes(s);

  // ======================= 附录一 =======================
  pres.addSection({ title: "附录（备问）" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "附录（备问）" });
  s.addText("附录一：11 个来源方法公开程度", { placeholder: "title" });
  const ST = { open: [C.accent2, "方法公开"], part: [C.accent5, "部分公开"], gap: [C.accent3, "关键信息未公开"] };
  [
    ["问卷", "Gracenote 2026 AI 调查", "线上 · 美国 AI 用户 · 4,003 人；样本来源、加权、回应率、各组人数未公开", "gap"],
    ["问卷", "Gracenote 2025 流媒体调查", "线上 · 6 国各 500 人；样本来源、加权、回应率未公开", "gap"],
    ["问卷", "Pew 青少年调查", "概率样本库 · 1,458 人 · 加权 · 误差 ±3.3", "open"],
    ["问卷", "Deloitte 数字媒体趋势", "线上 · 美国 14 岁以上 3,595 人 · 按人口普查加权", "open"],
    ["测量", "Nielsen NPOWER / Media Impact", "约 4.2 万户人员测量仪 + 4,500 万户机顶盒与智能电视数据", "open"],
    ["测量", "Nielsen 流媒体收视", "装流媒体测量仪的样本户，只测电视屏幕", "open"],
    ["数据库", "Gracenote 节目数据库", "公司自有元数据，非抽样；采集与核验流程未公开", "gap"],
    ["预测", "PwC 娱乐与媒体展望", "公开数据 + 行业访谈 + 建模；全球市场合计", "part"],
    ["测试", "Veed 聊天机器人测试", "6 国、只测独播剧、每题问 3 次；题量、模型版本、评分程序未公开", "gap"],
    ["论文", "USC 知识库偏差研究", "同行评审论文；自动分类器判定 + 众包抽样人工验证", "open"],
    ["行业", "Fabric 流失率", "Fabric 原页未见 5.5% 与 2%；流失率定义未公开", "gap"],
  ].forEach(([type, name, how, st], i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = 0.6 + col * 3.075, y = 1.45 + row * 1.68;
    card(s, x, y, 2.9, 1.5, C.background2, `来源卡${i + 1}`);
    s.addShape(pres.shapes.OVAL, { x: x + 0.2, y: y + 0.2, w: 0.2, h: 0.2, fill: { color: ST[st][0] }, line: { color: ST[st][0] }, objectName: `状态点${i + 1}` });
    text(s, [
      { text: type + " ｜ ", options: { fontSize: 11, color: C.accent5 } },
      { text: ST[st][1], options: { fontSize: 11, bold: true, color: ST[st][0] } },
    ], { x: x + 0.5, y: y + 0.12, w: 2.3, h: 0.35, valign: "middle", objectName: `来源类型${i + 1}` });
    text(s, [
      { text: name, options: { fontSize: 14, bold: true, color: C.text2, breakLine: true } },
      { text: how, options: { fontSize: 11, color: C.text1 } },
    ], { x: x + 0.2, y: y + 0.5, w: 2.55, h: 0.95, valign: "top", paraSpaceAfter: 3, objectName: `来源说明${i + 1}` });
  });
  card(s, 0.6 + 3 * 3.075, 1.45 + 2 * 1.68, 2.9, 1.5, C.text2, "来源小结卡");
  text(s, "Gracenote 自己的两份问卷，恰恰是方法最不透明的两项", { x: 0.6 + 3 * 3.075 + 0.2, y: 1.45 + 2 * 1.68, w: 2.5, h: 1.5, fontSize: 14, bold: true, color: C.background1, valign: "middle", objectName: "来源小结" });
  src(s, "详见仓库《Gracenote报告_数据来源与采集方式核查.md》，每条结论标注了核实程度与原文链接。", 6.5);
  s.addNotes("备问用，不计入讲解时间。被问到“数据从哪来、方法公开到什么程度”时翻到这一页。");

  // ======================= 附录二 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "附录（备问）" });
  s.addText("附录二：引用与口径核对", { placeholder: "title" });
  const hd = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text2 }, align: "center" } });
  s.addTable([
    [hd("报告的写法"), hd("原始来源 / 图表本身显示")],
    ["Pew：30% 的青少年每天用聊天机器人", "精确值 28%（13–14 岁 24%）；分母是全体青少年，使用者中为 44%"],
    ["USC：两个 AI 数据库中“高达 38%”的常识数据有偏差", "38.6% 只是 GenericsKB 一个库在 regard 指标下的比例，由自动分类器判定；另一个库为 3.4%–4.5%"],
    ["Deloitte：41% 的“流媒体订户”认为不值这个价", "原文分母是“全体消费者”（美国 14 岁以上 3,595 人，2024 年 10 月）"],
    ["PwC：OTT 与付费电视支出 2029 年达 3,185 亿美元", "全球数字（2024 年 2,913 亿，年增 1.8%），报告没写明"],
    ["摘要：54% 的 18–34 岁“会取消订阅”", "原题是“可能会取消”，而且是六国口径"],
    ["核查图：61–79 岁 58% 会核查，83% “用搜索交叉核对”", "83% 大于 58%，外圈分母只能是“会核查的人”，图注没写清"],
    ["“26% 的美国人知道想看什么却找不到”", "两轮核查都没找到出处"],
  ], {
    x: 0.6, y: 1.45, w: 12.1, colW: [5.0, 7.1], fontSize: 13, color: C.text1, valign: "middle",
    margin: [3, 8, 3, 8], border: { type: "solid", pt: 0.75, color: C.accent6 }, rowH: [0.42, 0.6, 0.72, 0.6, 0.6, 0.55, 0.6, 0.5],
    fill: { color: C.background1 }, objectName: "校准表",
  });
  src(s, "来源：报告第 2、5、6、14、18、22 页；Pew、USC、Deloitte、PwC 原文（第二轮外部核对）。", 6.5);
  s.addNotes("备问用，不计入讲解时间。被问到“报告引用的数字准不准”时翻到这一页。");

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
    `正讲 10 页，计划用时约 ${mmss(total)}，全文约 ${chars} 字（按每分钟约 240 字的中速朗读）。附录两页不讲，留作回答提问。`,
    "",
    "## 时间分配",
    "",
    "| 页 | 内容 | 用时 | 讲到这页结束时 |",
    "|---|---|---|---|",
    ...SCRIPT.map((x, i) => { acc += x.secs; return `| ${i + 1} | ${x.title} | ${x.secs} 秒 | ${mmss(acc)} |`; }),
    "",
    "超时的话：第 2 页的背景可以压缩成一句；第 6 页可以略过 Durex 那一句。",
    "",
    "## 逐页讲稿",
    "",
    ...SCRIPT.flatMap((x, i) => [`### 第 ${i + 1} 页｜${x.title}（约 ${x.secs} 秒，${x.chars} 字）`, "", x.text, ""]),
    "## 可能被问到的问题",
    "",
    "**问：你说样本不代表美国人，那这份报告是不是没用？**  ",
    "答：不是没用。它对“AI 用户”这个群体的描述有参考价值，方向也和皮尤研究中心等独立来源一致。我的意思是引用时要带上口径，不能说成“美国人”。",
    "",
    "**问：六国平均的问题，会不会只是报告写得不严谨？**  ",
    "答：有可能，我也没有说数据造假。但读者看那张图，会以为美国观众要花 14 分钟，而美国自己的数字是 12 分钟。这正是课上说的：要看清研究总体。",
    "",
    "**问：这些数据来源你是怎么核查的？**  ",
    "答：对照了报告原文、Gracenote 上一份报告的原文，以及 Pew、Deloitte、PwC、USC 论文等原始材料，11 个来源逐一标了方法公开程度。（见附录一、附录二）",
    "",
  ].join("\n");
  fs.writeFileSync(SCRIPT_MD, md);
  console.log("written", OUT, "| script", mmss(total), chars, "chars");
})().catch((e) => { console.error(e); process.exit(1); });
