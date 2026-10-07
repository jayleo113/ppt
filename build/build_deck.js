// 生成《Gracenote 2026 AI 报告解读》4–5 分钟课堂汇报 PPT 与讲稿
// 用法：node build/build_deck.js [输出 pptx 路径]
// 依赖：pptxgenjs、react-icons、react、react-dom、sharp、jszip（随 pptxgenjs 安装）
//
// 汇报主线：先介绍报告的发现与它给出的解释，再把报告的论证整理成四个环节，
// 用课上的四个维度逐环检验；每个维度页按“事实 → 原因 → 影响”展开，总结页回到论证链逐环下判断。
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
  pres.title = "AI 时代的电视搜索与内容发现：Gracenote 2026 报告解读与方法评价";
  pres.subject = "市场调研：方法与实践 课后作业汇报";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;

  const W = (c) => icon(c, H.lt1);
  const ic = {
    search: await icon(Fi.FiSearch, H.accent1),
    msg: await W(Fi.FiMessageCircle), searchLt: await W(Fi.FiSearch), shield: await W(Fi.FiShield),
    database: await W(Fi.FiDatabase), flag: await W(Fi.FiFlag), check: await W(Fi.FiCheck),
  };

  // ---------- 版式（无页脚，只保留页码） ----------
  pres.defineSlideMaster({
    title: "TITLE_DARK",
    background: { color: C.text2 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 1.6, w: 7.3, h: 2.2, fontSize: 40, bold: true, color: C.background1, valign: "bottom", align: "left", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.8, y: 4.05, w: 7.3, h: 1.2, fontSize: 18, color: C.accent6, valign: "top", align: "left", margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "SECTION_DARK",
    background: { color: C.text2 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 0.55, w: 11.7, h: 0.95, fontSize: 30, bold: true, color: C.background1, valign: "middle", align: "left", margin: 0 }, text: "" } },
    ],
    slideNumber: { x: 12.0, y: 6.95, w: 0.6, h: 0.3, fontSize: 10, color: C.accent6, align: "right" },
  });
  pres.defineSlideMaster({
    title: "CONTENT",
    background: { color: C.background1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.4, w: 8.1, h: 0.85, fontSize: 28, bold: true, color: C.text2, valign: "middle", align: "left", margin: 0 }, text: "" } },
    ],
    slideNumber: { x: 12.1, y: 6.95, w: 0.6, h: 0.3, fontSize: 10, color: C.accent5, align: "right" },
  });

  // ---------- 组件 ----------
  const card = (s, x, y, w, h, fill, name) =>
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: fill }, objectName: name || "卡片" });
  const text = (s, t, o) => s.addText(t, Object.assign({ margin: 0, isTextBox: true }, o));
  const src = (s, t, y = 6.55) => text(s, t, { x: 0.6, y, w: 11.3, h: 0.32, fontSize: 10, color: C.accent5, objectName: "来源说明" });
  const pillShape = (s, x, y, w, h, fill, line, name) =>
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: h / 2, fill: { color: fill }, line: { color: line || fill }, objectName: name });
  function iconDot(s, data, x, y, d, fill) {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill }, objectName: "图标底" });
    const p = d * 0.25;
    s.addImage({ data, x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p, objectName: "图标" });
  }
  // 汇报进度标签：标明当前所在部分，贯穿正文各页
  const PARTS = ["背景", "设计", "内容", "评价", "总结"];
  function tracker(s, active) {
    PARTS.forEach((a, i) => {
      const x = 8.93 + i * 0.77, on = i === active;
      pillShape(s, x, 0.62, 0.72, 0.4, on ? C.accent1 : C.background2, on ? C.accent1 : C.accent6, `进度${i + 1}`);
      text(s, a, { x, y: 0.62, w: 0.72, h: 0.4, fontSize: 11, bold: on, color: on ? C.background1 : C.accent5, align: "center", valign: "middle", objectName: `进度文字${i + 1}` });
    });
  }
  // 报告内容页：左侧 2×2 数据卡
  function statGrid(s, stats) {
    stats.forEach(([num, d, col], i) => {
      const x = 0.6 + (i % 2) * 3.0, y = 1.5 + Math.floor(i / 2) * 2.45;
      card(s, x, y, 2.8, 2.25, C.background2, `数据卡${i + 1}`);
      text(s, num, { x: x + 0.25, y: y + 0.15, w: 2.4, h: 0.8, fontSize: num.length > 5 ? 26 : 36, bold: true, fontFace: "Arial", color: col, valign: "middle", objectName: `数据${i + 1}` });
      text(s, d, { x: x + 0.25, y: y + 1.0, w: 2.35, h: 1.15, fontSize: 13, color: C.text1, valign: "top", objectName: `数据说明${i + 1}` });
    });
  }
  // 维度页：右侧“事实 → 原因 → 影响”三段
  const STEP = [["事实", C.accent2], ["原因", C.accent1], ["影响", C.accent3]];
  function analysis(s, items) {
    items.forEach((t, i) => {
      const y = 1.5 + i * 1.65, [k, col] = STEP[i];
      card(s, 6.75, y, 5.98, 1.5, C.background2, `${k}卡`);
      pillShape(s, 6.95, y + 0.17, 0.85, 0.38, col, col, `${k}标签`);
      text(s, k, { x: 6.95, y: y + 0.17, w: 0.85, h: 0.38, fontSize: 13, bold: true, color: C.background1, align: "center", valign: "middle", objectName: `${k}标签文字` });
      text(s, t, { x: 6.95, y: y + 0.62, w: 5.6, h: 0.82, fontSize: 14, color: C.text1, valign: "top", objectName: `${k}内容` });
      if (i < 2) text(s, "↓", { x: 9.5, y: y + 1.5, w: 0.5, h: 0.15, fontSize: 10, color: C.accent5, align: "center", valign: "middle", objectName: "下箭头" });
    });
  }
  let n = 0;
  const notes = (s) => s.addNotes(`【约 ${SCRIPT[n].secs} 秒】${SCRIPT[n++].text}`);

  // ======================= 封面 =======================
  pres.addSection({ title: "开场" });
  let s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "开场" });
  text(s, "市场调研：方法与实践 ｜ 课后作业汇报", { x: 0.8, y: 1.0, w: 7.3, h: 0.4, fontSize: 14, color: C.accent6, objectName: "课程名" });
  s.addText("AI 时代的电视搜索\n与内容发现", { placeholder: "title" });
  s.addText("Gracenote（尼尔森旗下）2026 年研究报告解读\n《TV Search and Discovery in the AI Era》", { placeholder: "body" });
  text(s, "54%", { x: 8.4, y: 1.45, w: 4.5, h: 2.2, fontSize: 120, bold: true, fontFace: "Arial", color: C.accent4, align: "center", valign: "middle", objectName: "封面数字" });
  text(s, "报告数据：13–14 岁受访者每日使用 AI 的比例", { x: 8.4, y: 3.65, w: 4.5, h: 0.5, fontSize: 13, color: C.accent6, align: "center", objectName: "封面数字说明" });
  pillShape(s, 8.75, 4.55, 3.8, 0.8, C.background1, C.background1, "提问框");
  s.addImage({ data: ic.search, x: 9.05, y: 4.78, w: 0.34, h: 0.34, objectName: "提问框图标" });
  text(s, "该数据代表哪类人群？", { x: 9.55, y: 4.55, w: 2.9, h: 0.8, fontSize: 18, bold: true, color: C.text2, valign: "middle", objectName: "提问框文字" });
  notes(s);

  // ======================= 汇报框架 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "开场" });
  s.addText("汇报框架与核心观点", { placeholder: "title" });
  [
    ["一", "研究背景与研究问题", "报告为何开展、回答哪些问题"],
    ["二", "研究设计", "对象、时间、抽样方式、样本量"],
    ["三", "报告内容与论证", "两组发现及报告给出的解释"],
    ["四", "方法评价", "沿论证链，从四个维度逐环检验"],
    ["五", "总结与启示", "各环节判断与讨论问题"],
  ].forEach(([no, k, v], i) => {
    const y = 1.5 + i * 0.98, focus = i === 3;
    card(s, 0.6, y, 6.9, 0.82, focus ? C.accent6 : C.background2, `框架行${i + 1}`);
    s.addShape(pres.shapes.OVAL, { x: 0.8, y: y + 0.13, w: 0.56, h: 0.56, fill: { color: C.accent1 }, line: { color: C.accent1 }, objectName: `序号底${i + 1}` });
    text(s, no, { x: 0.8, y: y + 0.13, w: 0.56, h: 0.56, fontSize: 16, bold: true, color: C.background1, align: "center", valign: "middle", objectName: `序号${i + 1}` });
    text(s, k, { x: 1.6, y, w: 2.3, h: 0.82, fontSize: 17, bold: true, color: C.text2, valign: "middle", objectName: `框架名${i + 1}` });
    text(s, v, { x: 3.95, y, w: 3.45, h: 0.82, fontSize: 14, color: C.text1, valign: "middle", objectName: `框架说明${i + 1}` });
  });
  card(s, 7.9, 1.5, 4.8, 4.74, C.text2, "核心观点卡");
  text(s, [
    { text: "核心观点", options: { fontSize: 18, bold: true, color: C.accent6, breakLine: true } },
    { text: "报告揭示的行业趋势具有参考价值，但其论证链的关键环节证据不足，结论应限定在调查对象的范围之内。", options: { fontSize: 18, bold: true, color: C.background1, breakLine: true } },
    { text: "评价重点：第四部分，沿报告的论证链逐环检验。", options: { fontSize: 13, color: C.accent6 } },
  ], { x: 8.25, y: 1.7, w: 4.1, h: 4.34, valign: "middle", paraSpaceAfter: 16, objectName: "核心观点" });
  notes(s);

  // ======================= 一、背景与问题 =======================
  pres.addSection({ title: "报告介绍" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  s.addText("一、研究背景与研究问题", { placeholder: "title" });
  tracker(s, 0);
  text(s, [
    { text: "研究背景：", options: { bold: true, color: C.accent1 } },
    { text: "流媒体平台数量增加、内容分散，用户检索节目的难度上升；生成式 AI 聊天机器人逐渐成为新的信息检索工具。", options: { color: C.text1 } },
  ], { x: 0.6, y: 1.35, w: 12.1, h: 0.55, fontSize: 15, valign: "middle", objectName: "研究背景" });
  [
    [ic.msg, "问题一 · 使用行为", "不同年龄群体如何使用 AI 聊天机器人检索信息？"],
    [ic.searchLt, "问题二 · 检索困难", "内容分散是否增加检索难度，并影响订阅决策？"],
    [ic.shield, "问题三 · 信任程度", "用户是否信任 AI 提供的娱乐与体育信息？"],
  ].forEach(([img, k, v], i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 2.05, 3.8, 1.95, C.background2, `问题卡${i + 1}`);
    iconDot(s, img, x + 0.3, 2.25, 0.65, C.accent1);
    text(s, k, { x: x + 1.1, y: 2.25, w: 2.6, h: 0.65, fontSize: 17, bold: true, color: C.text2, valign: "middle", objectName: `问题标题${i + 1}` });
    text(s, v, { x: x + 0.3, y: 3.0, w: 3.2, h: 0.85, fontSize: 15, color: C.text1, valign: "top", objectName: `问题内容${i + 1}` });
  });
  card(s, 0.6, 4.25, 12.1, 2.1, C.text2, "机构与主张");
  iconDot(s, ic.database, 0.95, 4.6, 0.6, C.accent1);
  text(s, [
    { text: "研究机构", options: { fontSize: 16, bold: true, color: C.accent6, breakLine: true } },
    { text: "Gracenote，尼尔森（Nielsen）旗下的内容数据业务，为电视与流媒体平台提供节目元数据（片名、简介、播出平台等）。", options: { fontSize: 15, color: C.background1 } },
  ], { x: 1.75, y: 4.4, w: 4.7, h: 1.8, valign: "middle", paraSpaceAfter: 6, objectName: "研究机构" });
  iconDot(s, ic.flag, 6.85, 4.6, 0.6, C.accent3);
  text(s, [
    { text: "报告主张", options: { fontSize: 16, bold: true, color: C.accent6, breakLine: true } },
    { text: "AI 将成为内容发现的主要入口，但须接入可信的行业数据——这与 Gracenote 的主营业务直接相关。", options: { fontSize: 15, color: C.background1 } },
  ], { x: 7.65, y: 4.4, w: 4.8, h: 1.8, valign: "middle", paraSpaceAfter: 6, objectName: "报告主张" });
  notes(s);

  // ======================= 二、研究设计 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  s.addText("二、研究设计：两项核心问卷调查", { placeholder: "title" });
  tracker(s, 1);
  [
    ["调查一：2026 年生成式 AI 使用调查", "报告中 AI 相关数据的来源", [
      ["调查对象", "美国 13–79 岁 AI 聊天机器人用户"], ["调查时间", "2026 年 1 月 23 日—2 月 4 日"], ["调查方式", "线上问卷"],
      ["样本量", "4,003"], ["抽样方式", "未公开：抽样框、加权方法、应答率"]]],
    ["调查二：2025 年六国流媒体消费者调查", "内容检索与退订相关数据的来源", [
      ["调查对象", "巴西、法、德、墨、美、英流媒体用户"], ["调查时间", "2025 年 7 月 28 日—8 月 1 日"], ["调查方式", "线上问卷"],
      ["样本量", "3,000（每国 500）"], ["抽样方式", "未公开：抽样框、加权方法、应答率"]]],
  ].forEach(([name, use, rows], i) => {
    const x = 0.6 + i * 6.15;
    card(s, x, 1.5, 5.95, 4.35, C.background2, `问卷卡${i + 1}`);
    text(s, [
      { text: name, options: { fontSize: 17, bold: true, color: C.text2, breakLine: true } },
      { text: use, options: { fontSize: 12, color: C.accent5 } },
    ], { x: x + 0.3, y: 1.65, w: 5.45, h: 0.8, valign: "middle", objectName: `问卷名${i + 1}` });
    rows.forEach(([k, v], j) => {
      const y = 2.6 + j * 0.62, gap = j === rows.length - 1;
      if (gap) card(s, x + 0.15, y - 0.04, 5.65, 0.58, C.background1, "未公开底");
      text(s, k, { x: x + 0.3, y, w: 1.3, h: 0.5, fontSize: 13, bold: true, color: gap ? C.accent3 : C.accent5, valign: "middle", objectName: `设计项${i + 1}-${j + 1}` });
      text(s, v, { x: x + 1.65, y, w: 4.15, h: 0.5, fontSize: 15, bold: gap, color: gap ? C.accent3 : C.text1, valign: "middle", objectName: `设计值${i + 1}-${j + 1}` });
    });
  });
  text(s, "此外引用尼尔森收视数据、Gracenote 节目数据库及皮尤研究中心、德勤、普华永道等机构研究，共 11 个数据来源（见附录一）。", { x: 0.6, y: 6.0, w: 12.1, h: 0.45, fontSize: 14, color: C.text1, objectName: "其他来源" });
  src(s, "来源：报告“数据来源”说明；尼尔森新闻稿（2026 年 4 月）；Gracenote 2025 年报告《State of Play》数据说明。");
  notes(s);

  // ======================= 三、报告内容（一） =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  s.addText("三、报告内容（一）：AI 使用增加，信任不足", { placeholder: "title" });
  tracker(s, 2);
  statGrid(s, [
    ["54%", "13–14 岁 AI 用户每日使用（报告称“Alpha 世代”）", C.accent1],
    ["80%", "13–14 岁受访者表示过去 12–18 个月使用增加", C.accent1],
    ["75%", "受访者表示会核查 AI 的回答", C.accent3],
    ["85%", "认为 AI 的娱乐信息准确，低于传统搜索的 92%", C.accent3],
  ]);
  card(s, 6.75, 1.5, 5.98, 4.7, C.text2, "报告解释卡");
  text(s, "报告的解释", { x: 7.05, y: 1.65, w: 5.4, h: 0.45, fontSize: 17, bold: true, color: C.accent6, objectName: "解释标题" });
  [
    ["为何偏好 AI", "AI 能给出直接、完整、可追问的答案；13–14 岁受访者中 70% 在需要直接答案时更偏好 AI。"],
    ["为何信任不足", "大模型按概率生成内容，可能出现“幻觉”——看似合理但错误的信息；77% 的受访者对 AI 结果有顾虑。"],
    ["报告的推论", "用户已依赖 AI，但需要更可靠的答案来源。"],
  ].forEach(([k, v], i) => {
    const y = 2.2 + i * 1.3;
    text(s, [
      { text: k, options: { fontSize: 15, bold: true, color: i === 2 ? C.accent4 : C.background1, breakLine: true } },
      { text: v, options: { fontSize: 14, color: C.accent6 } },
    ], { x: 7.05, y, w: 5.4, h: 1.15, valign: "top", paraSpaceAfter: 4, objectName: `解释${i + 1}` });
  });
  src(s, "来源：调查一（2026 年生成式 AI 使用调查）；报告正文对生成式 AI 的说明。");
  notes(s);

  // ======================= 三、报告内容（二） =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  s.addText("三、报告内容（二）：内容分散，检索困难", { placeholder: "title" });
  tracker(s, 2);
  statGrid(s, [
    ["54%", "联网电视（CTV）占美国电视收视时长（尼尔森，2025 年第四季度）", C.accent1],
    ["350+", "订阅点播目录，另有约 2,100 个免费流媒体频道（Gracenote 数据库）", C.accent1],
    ["14 分钟", "用户寻找节目的平均时长（调查二，六国）", C.accent2],
    ["54%", "18–34 岁受访者表示可能因检索困难而退订（调查二，六国）", C.accent2],
  ]);
  card(s, 6.75, 1.5, 5.98, 4.7, C.text2, "报告论证卡");
  text(s, "报告的论证", { x: 7.05, y: 1.65, w: 5.4, h: 0.45, fontSize: 17, bold: true, color: C.accent6, objectName: "论证标题" });
  [
    ["平台与内容分散", "节目分布在数百个目录与频道中"],
    ["检索时间延长", "用户需花更多时间寻找想看的节目"],
    ["退订风险上升", "找不到内容的用户可能取消订阅"],
    ["AI 须接入可信数据", "仅凭公开网络信息，AI 只答对约 2/3 的播出平台"],
  ].forEach(([k, v], i) => {
    const y = 2.2 + i * 0.98, last = i === 3;
    pillShape(s, 7.05, y, 2.3, 0.62, last ? C.accent1 : C.background1, last ? C.accent1 : C.background1, `论证环${i + 1}`);
    text(s, k, { x: 7.05, y, w: 2.3, h: 0.62, fontSize: 13, bold: true, color: last ? C.background1 : C.text2, align: "center", valign: "middle", objectName: `论证环文字${i + 1}` });
    text(s, v, { x: 9.5, y, w: 3.05, h: 0.62, fontSize: 13, color: C.accent6, valign: "middle", objectName: `论证说明${i + 1}` });
    if (i < 3) text(s, "↓", { x: 7.05, y: y + 0.62, w: 2.3, h: 0.36, fontSize: 14, bold: true, color: C.accent6, align: "center", valign: "middle", objectName: `论证箭头${i + 1}` });
  });
  src(s, "来源：尼尔森收视测量；Gracenote 数据库（截至 2026 年 2 月）；调查二；Veed Analytics 测试（报告引用）。");
  notes(s);

  // ======================= 四、论证链与评价思路 =======================
  pres.addSection({ title: "方法评价" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "方法评价" });
  s.addText("四、方法评价：沿论证链逐环检验", { placeholder: "title" });
  tracker(s, 3);
  text(s, "参照课上春晚满意度调查案例（央视 81.6% 与新浪网 11.5%）：调查对象、研究总体、调查时间与研究方法不同，结论必然不同。", { x: 0.6, y: 1.3, w: 12.1, h: 0.5, fontSize: 14, color: C.text2, valign: "middle", objectName: "评价引言" });
  const links = [
    ["① 用户日益依赖 AI", "54% 每日使用；较皮尤 30% “正在加速”", "维度一 调查对象\n维度三 调查时间"],
    ["② 但对 AI 信任不足", "75% 会核查 AI 的回答", "维度一 调查对象"],
    ["③ 检索困难导致退订", "14 分钟；54% 可能退订；5.5% 月退订率", "维度二 研究总体\n维度四 研究方法"],
    ["④ AI 须接入可信数据", "由前三环推出，无直接数据", "维度四 研究方法\n（方案未经检验）"],
  ];
  text(s, "论证环节", { x: 0.6, y: 1.95, w: 1.2, h: 0.85, fontSize: 13, bold: true, color: C.accent5, valign: "middle", objectName: "行标签1" });
  text(s, "报告证据", { x: 0.6, y: 3.0, w: 1.2, h: 1.3, fontSize: 13, bold: true, color: C.accent5, valign: "middle", objectName: "行标签2" });
  text(s, "检验维度", { x: 0.6, y: 4.5, w: 1.2, h: 1.55, fontSize: 13, bold: true, color: C.accent5, valign: "middle", objectName: "行标签3" });
  links.forEach(([k, ev, dim], i) => {
    const x = 1.8 + i * 2.75;
    card(s, x, 1.95, 2.5, 0.85, C.accent1, `环节${i + 1}`);
    text(s, k, { x: x + 0.1, y: 1.95, w: 2.3, h: 0.85, fontSize: 14, bold: true, color: C.background1, align: "center", valign: "middle", objectName: `环节文字${i + 1}` });
    if (i < 3) text(s, "→", { x: x + 2.5, y: 1.95, w: 0.25, h: 0.85, fontSize: 16, bold: true, color: C.accent5, align: "center", valign: "middle", objectName: `环节箭头${i + 1}` });
    card(s, x, 3.0, 2.5, 1.3, C.background2, `证据${i + 1}`);
    text(s, ev, { x: x + 0.15, y: 3.0, w: 2.2, h: 1.3, fontSize: 13, color: C.text1, valign: "middle", objectName: `证据文字${i + 1}` });
    card(s, x, 4.5, 2.5, 1.55, C.accent6, `检验${i + 1}`);
    text(s, dim, { x: x + 0.15, y: 4.5, w: 2.2, h: 1.55, fontSize: 14, bold: true, color: C.text2, valign: "middle", objectName: `检验文字${i + 1}` });
  });
  src(s, "评价框架参照课程案例：春晚满意度调查中，调查对象、研究总体、调查时间与研究方法的差异导致结论相反。");
  notes(s);

  // ======================= 维度一 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "方法评价" });
  s.addText("维度一 · 调查对象：样本代表性存疑", { placeholder: "title" });
  tracker(s, 3);
  [
    [0.8, 1.5, 4.8, C.background2, "美国人口"],
    [1.25, 2.2, 3.9, C.accent6, "互联网用户"],
    [1.7, 2.9, 3.0, MUTED_BAR, "AI 聊天机器人用户"],
    [2.2, 3.6, 2.0, C.accent1, ""],
  ].forEach(([x, y, d, fill, label], i) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: C.background1, width: 1.5 }, objectName: `总体圈${i + 1}` });
    if (label) text(s, label, { x, y: y + 0.12, w: d, h: 0.45, fontSize: 13, bold: true, color: C.text2, align: "center", objectName: `总体标签${i + 1}` });
  });
  text(s, [
    { text: "本次样本", options: { fontSize: 13, bold: true, color: C.background1, breakLine: true } },
    { text: "4,003", options: { fontSize: 22, bold: true, fontFace: "Arial", color: C.background1 } },
  ], { x: 2.2, y: 3.9, w: 2.0, h: 1.2, align: "center", valign: "middle", objectName: "样本标签" });
  analysis(s, [
    "样本仅为 AI 聊天机器人用户，报告却多处将结论表述为“美国人”；所称“Alpha 世代”仅含 13–14 岁受访者。",
    "线上样本以“使用 AI”为筛选条件，抽样框、加权方法与应答率均未公开，调查总体小于报告推论的总体。",
    "54%、75% 等数据只能解释为“美国 AI 用户中”的比例；与课上 Durex 网络调查同属覆盖偏差问题。",
  ]);
  src(s, "来源：Gracenote 报告；尼尔森新闻稿原文：“Gen Alpha findings are based on respondents ages 13 and 14”。");
  notes(s);

  // ======================= 维度二 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "方法评价" });
  s.addText("维度二 · 研究总体：六国均值用于美国", { placeholder: "title" });
  tracker(s, 3);
  s.addChart(pres.charts.BAR, [{ name: "寻找节目时长", labels: ["巴西", "法国", "德国", "墨西哥", "英国", "美国", "六国均值"], values: [12, 26, 11, 11, 12, 12, 14] }], {
    x: 0.6, y: 1.45, w: 5.8, h: 4.95, barDir: "bar", catAxisOrientation: "maxMin",
    chartColors: [MUTED_BAR, MUTED_BAR, MUTED_BAR, MUTED_BAR, MUTED_BAR, H.accent1, H.accent3],
    showTitle: true, title: "寻找节目的平均时长（六国调查原始报告）", titleFontSize: 14, titleColor: H.dk2, titleFontFace: "+mn-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: '0" 分钟"', dataLabelFontSize: 12, dataLabelColor: H.dk1, dataLabelFontFace: "+mn-lt",
    catAxisLabelFontSize: 13, catAxisLabelColor: H.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 32, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    catAxisLineShow: false, showLegend: false, barGapWidthPct: 45, objectName: "分国家寻找时长图",
  });
  analysis(s, [
    "“平均 14 分钟”“54% 可能退订”均来自六国调查；报告将 14 分钟置于描述美国收视情况的图表中。",
    "14 分钟为六国简单平均（每国 500 人、等权）；美国为 12 分钟，法国的 26 分钟拉高了均值。报告未标明国家口径。",
    "读者会高估美国用户的检索困难；“50% 的美国观众考虑退订”在原始报告中仅见六国均值 49%。",
  ]);
  src(s, "来源：Gracenote 报告；Gracenote 2025 年报告《State of Play》分国家、分年龄图表（每国 500 人）。");
  notes(s);

  // ======================= 维度三 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "方法评价" });
  s.addText("维度三 · 调查时间：比较口径不一致", { placeholder: "title" });
  tracker(s, 3);
  [
    [1.5, "皮尤研究中心（2025 年 9–10 月）", "24%", C.accent5, "分母：全体 13–14 岁青少年 · 概率样本，经加权"],
    [4.05, "Gracenote 本报告（2026 年 1–2 月）", "54%", C.accent1, "分母：13–14 岁 AI 用户 · 线上样本，加权未公开"],
  ].forEach(([y, who, num, col, meta], i) => {
    card(s, 0.6, y, 5.8, 2.3, C.background2, `对比卡${i + 1}`);
    text(s, who, { x: 0.9, y: y + 0.15, w: 5.3, h: 0.45, fontSize: 15, bold: true, color: col, objectName: `对比机构${i + 1}` });
    text(s, [
      { text: num, options: { fontSize: 48, bold: true, fontFace: "Arial", color: col } },
      { text: "  13–14 岁每日使用 AI", options: { fontSize: 15, color: C.text1 } },
    ], { x: 0.9, y: y + 0.6, w: 5.3, h: 0.95, valign: "middle", objectName: `对比数字${i + 1}` });
    text(s, meta, { x: 0.9, y: y + 1.6, w: 5.3, h: 0.5, fontSize: 13, color: C.text1, valign: "middle", objectName: `对比说明${i + 1}` });
  });
  analysis(s, [
    "报告将皮尤 2025 年秋季的 30% 与自身 2026 年初的 54% 对比，认为使用频率“正在加速”。",
    "两项调查的分母不同（全体青少年 vs AI 用户），抽样方法与年龄范围也不同；同为 13–14 岁，皮尤仅为 24%。",
    "统一为“使用者”口径后，皮尤为 44%，差距约 10 个百分点，不足以推断使用频率上升。",
  ]);
  src(s, "来源：Gracenote 报告；皮尤《Teens, Social Media and AI Chatbots 2025》数据表（全体每日 28%，13–14 岁 24%，使用者中 44%）。");
  notes(s);

  // ======================= 维度四 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "方法评价" });
  s.addText("维度四 · 研究方法：因果推断依据不足", { placeholder: "title" });
  tracker(s, 3);
  [
    ["意向 · 问卷", C.accent1, "54%", "18–34 岁表示可能退订（六国）"],
    ["行为 · 行业统计", C.accent2, "5.5%", "月度退订率（算法未公开）"],
    ["预测 · 普华永道", C.text2, "3,185 亿美元", "2029 年支出（全球数据）"],
    ["测试 · AI 回答", C.accent5, "约 2/3", "答对播出平台（六国合并）"],
  ].forEach(([k, col, num, d], i) => {
    const x = 0.6 + (i % 2) * 3.0, y = 1.5 + Math.floor(i / 2) * 2.45;
    card(s, x, y, 2.8, 2.25, C.background2, `数据类型卡${i + 1}`);
    text(s, k, { x: x + 0.25, y: y + 0.15, w: 2.4, h: 0.4, fontSize: 13, bold: true, color: col, objectName: `数据类型${i + 1}` });
    text(s, num, { x: x + 0.25, y: y + 0.6, w: 2.4, h: 0.75, fontSize: num.length > 5 ? 22 : 32, bold: true, color: col, valign: "middle", objectName: `数据类型数字${i + 1}` });
    text(s, d, { x: x + 0.25, y: y + 1.4, w: 2.35, h: 0.75, fontSize: 13, color: C.text1, valign: "top", objectName: `数据类型说明${i + 1}` });
  });
  analysis(s, [
    "“检索困难导致退订”由四类数据支撑：问卷中的退订意向、行业退订率、市场预测与 AI 测试。",
    "四类数据的对象、国家与性质各不相同（意向≠行为，预测≠测量），且缺乏追踪设计或实验设计。",
    "只能提示二者可能相关，不能证明因果；报告方案（AI 接入行业数据）亦未经检验。",
  ]);
  src(s, "来源：Gracenote 报告；普华永道、Veed Analytics 原文；退订率见 Broadband TV News 转述 Fabric 数据，Antenna 数据经 MediaPost 转述。");
  notes(s);

  // ======================= 五、总结与启示 =======================
  pres.addSection({ title: "总结" });
  s = pres.addSlide({ masterName: "SECTION_DARK", sectionTitle: "总结" });
  s.addText("五、总结与启示：逐环判断", { placeholder: "title" });
  [
    ["① 用户日益依赖 AI", "仅适用于 AI 用户；“加速”不成立", "部分成立", C.accent2],
    ["② 但对 AI 信任不足", "仅适用于 AI 用户", "部分成立", C.accent2],
    ["③ 检索困难导致退订", "六国与美国口径混用，因果未经证明", "证据不足", C.accent3],
    ["④ AI 须接入可信数据", "由前三环推出，方案效果未经检验", "未经检验", C.accent5],
  ].forEach(([k, v, tag, col], i) => {
    const y = 1.65 + i * 1.12;
    card(s, 0.8, y, 7.5, 0.95, C.accent1, `判断行${i + 1}`);
    text(s, k, { x: 1.05, y, w: 2.55, h: 0.95, fontSize: 15, bold: true, color: C.background1, valign: "middle", objectName: `判断环节${i + 1}` });
    text(s, v, { x: 3.65, y, w: 3.15, h: 0.95, fontSize: 13, color: C.background1, valign: "middle", objectName: `判断说明${i + 1}` });
    pillShape(s, 6.9, y + 0.25, 1.2, 0.45, col, col, `判断标签${i + 1}`);
    text(s, tag, { x: 6.9, y: y + 0.25, w: 1.2, h: 0.45, fontSize: 12, bold: true, color: C.background1, align: "center", valign: "middle", objectName: `判断标签文字${i + 1}` });
  });
  card(s, 8.6, 1.65, 3.95, 2.1, C.background1, "研究价值卡");
  text(s, [
    { text: "研究价值", options: { fontSize: 16, bold: true, color: C.accent2, breakLine: true } },
    { text: "公开样本量、调查时间与年龄范围；图表数据经复核基本一致，可作为行业趋势的参考。", options: { fontSize: 14, color: C.text1 } },
  ], { x: 8.85, y: 1.8, w: 3.5, h: 1.85, valign: "middle", paraSpaceAfter: 6, objectName: "研究价值" });
  card(s, 8.6, 3.95, 3.95, 2.18, C.background1, "讨论卡");
  text(s, [
    { text: "讨论问题", options: { fontSize: 16, bold: true, color: C.accent1, breakLine: true } },
    { text: "如何设计调查，才能检验“检索困难导致退订”？", options: { fontSize: 16, bold: true, color: C.text1, breakLine: true } },
    { text: "提示：追踪调查，同时测量退订意向与实际退订行为。", options: { fontSize: 12, color: C.accent5 } },
  ], { x: 8.85, y: 4.05, w: 3.5, h: 2.0, valign: "middle", paraSpaceAfter: 6, objectName: "讨论问题" });
  text(s, "注：报告主张与 Gracenote 主营业务直接相关，这构成审慎评估其方法的理由，但不能据此判定数据有误。", { x: 0.8, y: 6.4, w: 11.0, h: 0.4, fontSize: 12, color: C.accent6, objectName: "利益关系说明" });
  notes(s);

  // ======================= 附录一 =======================
  pres.addSection({ title: "附录（备问）" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "附录（备问）" });
  s.addText("附录一：11 个数据来源的方法公开程度", { placeholder: "title" });
  const ST = { open: [C.accent2, "方法公开"], part: [C.accent5, "部分公开"], gap: [C.accent3, "关键信息未公开"] };
  [
    ["问卷", "Gracenote 2026 AI 调查", "线上 · 美国 AI 用户 · 4,003 人；抽样框、加权、应答率、各组样本量未公开", "gap"],
    ["问卷", "Gracenote 2025 流媒体调查", "线上 · 六国各 500 人；抽样框、加权、应答率未公开", "gap"],
    ["问卷", "皮尤研究中心青少年调查", "概率样本 · 1,458 人 · 加权 · 误差 ±3.3 个百分点", "open"],
    ["问卷", "德勤数字媒体趋势调查", "线上 · 美国 14 岁以上 3,595 人 · 按人口普查加权", "open"],
    ["测量", "尼尔森 NPOWER / Media Impact", "约 4.2 万户人员测量仪 + 4,500 万户机顶盒与智能电视数据", "open"],
    ["测量", "尼尔森流媒体收视测量", "流媒体测量仪样本户，仅测电视屏幕", "open"],
    ["数据库", "Gracenote 节目数据库", "企业自有元数据，非抽样；采集与核验流程未公开", "gap"],
    ["预测", "普华永道娱乐与媒体展望", "公开数据 + 行业访谈 + 统计建模；全球市场", "part"],
    ["测试", "Veed Analytics AI 测试", "六国、仅测独播剧、每题重复 3 次；题量、模型版本、评分程序未公开", "gap"],
    ["论文", "南加州大学知识库偏差研究", "同行评审论文；自动分类器判定 + 众包抽样人工验证", "open"],
    ["行业", "Fabric 退订率", "原始页面未见 5.5% 与 2%；计算方法未公开", "gap"],
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
  text(s, "报告最核心的两项自有问卷，恰为方法最不透明的两项", { x: 0.6 + 3 * 3.075 + 0.2, y: 1.45 + 2 * 1.68, w: 2.5, h: 1.5, fontSize: 14, bold: true, color: C.background1, valign: "middle", objectName: "来源小结" });
  src(s, "详见《Gracenote报告_数据来源与采集方式核查.md》，各条结论均标注核实程度与原文链接。");
  s.addNotes("备问用，不计入汇报时间。被问及数据来源与方法公开程度时使用。");

  // ======================= 附录二 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "附录（备问）" });
  s.addText("附录二：引用与数据口径核对", { placeholder: "title" });
  const hd = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text2 }, align: "center" } });
  s.addTable([
    [hd("报告表述"), hd("原始来源 / 图表本身显示")],
    ["皮尤研究中心：30% 的青少年每日使用聊天机器人", "精确值 28%（13–14 岁为 24%）；分母为全体青少年，使用者中为 44%"],
    ["南加州大学：两个 AI 数据库中“高达 38%”的常识数据存在偏差", "38.6% 仅为 GenericsKB 在 regard 指标下的比例，由自动分类器判定；另一知识库为 3.4%–4.5%"],
    ["德勤：41% 的“流媒体订户”认为服务不值其价格", "原文分母为“全体消费者”（美国 14 岁以上 3,595 人，2024 年 10 月）"],
    ["普华永道：OTT 与付费电视支出 2029 年达 3,185 亿美元", "全球数据（2024 年为 2,913 亿美元，年均增长 1.8%），报告未注明"],
    ["摘要：54% 的 18–34 岁受访者“会取消订阅”", "原题为“可能取消”，且为六国数据"],
    ["核查图：61–79 岁 58% 会核查，83% “以搜索交叉核对”", "83% 大于 58%，外圈分母应为“会核查者”，图注未说明"],
    ["“26% 的美国人知道想看什么却仍找不到”", "两轮核查均未找到出处"],
  ], {
    x: 0.6, y: 1.45, w: 12.1, colW: [5.0, 7.1], fontSize: 13, color: C.text1, valign: "middle",
    margin: [3, 8, 3, 8], border: { type: "solid", pt: 0.75, color: C.accent6 }, rowH: [0.42, 0.6, 0.72, 0.6, 0.6, 0.55, 0.6, 0.5],
    fill: { color: C.background1 }, objectName: "口径核对表",
  });
  src(s, "来源：Gracenote 报告；皮尤研究中心、南加州大学、德勤、普华永道原文（第二轮外部核对）。");
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
    "**核心观点：** 报告揭示的行业趋势具有参考价值，但其论证链的关键环节证据不足，结论应限定在调查对象的范围之内。",
    "",
    "**报告的论证链：** ① 用户日益依赖 AI → ② 但对 AI 信任不足 → ③ 检索困难导致退订 → ④ AI 须接入可信数据。",
    "",
    "**评价思路：** 用课上春晚案例的四个维度逐环检验，每个维度按“事实 → 原因 → 影响”展开：",
    "",
    "| 环节 | 报告证据 | 检验维度 | 判断 |",
    "|---|---|---|---|",
    "| ① 用户日益依赖 AI | 54% 每日使用；较皮尤 30% “正在加速” | 维度一 调查对象；维度三 调查时间 | 部分成立：仅适用于 AI 用户，“加速”不成立 |",
    "| ② 但对 AI 信任不足 | 75% 会核查 AI 的回答 | 维度一 调查对象 | 部分成立：仅适用于 AI 用户 |",
    "| ③ 检索困难导致退订 | 14 分钟；54% 可能退订；5.5% 月退订率 | 维度二 研究总体；维度四 研究方法 | 证据不足：口径混用，因果未证 |",
    "| ④ AI 须接入可信数据 | 由前三环推出 | 维度四 研究方法 | 未经检验 |",
    "",
    "**页面顺序：** 封面 → 汇报框架与核心观点 → 一、研究背景与研究问题 → 二、研究设计 → 三、报告内容（两页：发现 + 报告的解释）→ 四、方法评价（论证链总览 + 四个维度）→ 五、总结与启示（逐环判断）。",
    "",
    "## 时间分配",
    "",
    "| 页 | 内容 | 用时 | 累计 |",
    "|---|---|---|---|",
    ...SCRIPT.map((x, i) => { acc += x.secs; return `| ${i + 1} | ${x.title} | ${x.secs} 秒 | ${mmss(acc)} |`; }),
    "",
    "如需压缩时间：第 3 页可略去最后一句；第 8 页可略去 Durex 案例一句。",
    "",
    "## 逐页讲稿",
    "",
    ...SCRIPT.flatMap((x, i) => [`### 第 ${i + 1} 页｜${x.title}（约 ${x.secs} 秒，${x.chars} 字）`, "", x.text, ""]),
    "## 可能的提问与回答要点",
    "",
    "**问：既然样本不代表美国人群，这份报告是否就没有价值？**  ",
    "答：报告对“AI 聊天机器人用户”这一群体的描述仍有参考价值，其趋势判断与皮尤研究中心等独立来源方向一致。问题在于引用时应限定口径，不宜推论到全体美国人。",
    "",
    "**问：六国均值的问题，是否只是表述不严谨？**  ",
    "答：可能如此，汇报中并未认为数据造假。但读者会据此认为美国观众平均需要 14 分钟，而原始数据中美国为 12 分钟。这正是“研究总体”维度需要关注的问题。",
    "",
    "**问：数据来源是如何核查的？**  ",
    "答：对照了报告原文、Gracenote 2025 年报告原文，以及皮尤研究中心、德勤、普华永道、南加州大学论文等原始材料，对 11 个数据来源逐一标注了方法公开程度（见附录一、附录二）。",
    "",
  ].join("\n");
  fs.writeFileSync(SCRIPT_MD, md);
  console.log("written", OUT, "| script", mmss(total), chars, "chars");
})().catch((e) => { console.error(e); process.exit(1); });
