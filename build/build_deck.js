// 生成《Gracenote 2026 AI 报告解读》课堂分享 PPT
// 用法：node build/build_deck.js [输出路径]
// 依赖：pptxgenjs、react-icons、react、react-dom、sharp、jszip（随 pptxgenjs 安装）
const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fs = require("fs");
const Fi = require("react-icons/fi");

const OUT = process.argv[2] || path.join(__dirname, "..", "Gracenote_AI报告解读_课堂分享.pptx");

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

// ---------- 图标 ----------
async function icon(Comp, hex, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + hex, size }));
  const buf = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 in
  pres.title = "AI 时代的电视搜索与内容发现：Gracenote 2026 报告解读";
  pres.subject = "市场调研：方法与实践 课后作业随堂分享";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  const W = 13.333;

  const ic = {
    search: await icon(Fi.FiSearch, H.accent1),
    searchLt: await icon(Fi.FiSearch, H.lt1),
    building: await icon(Fi.FiDatabase, H.lt1),
    file: await icon(Fi.FiFileText, H.lt1),
    msg: await icon(Fi.FiMessageCircle, H.lt1),
    activity: await icon(Fi.FiActivity, H.lt1),
    trend: await icon(Fi.FiTrendingUp, H.lt1),
    cpu: await icon(Fi.FiCpu, H.lt1),
    check: await icon(Fi.FiCheck, H.lt1),
    users: await icon(Fi.FiUsers, H.lt1),
    globe: await icon(Fi.FiGlobe, H.lt1),
    sliders: await icon(Fi.FiSliders, H.lt1),
    clock: await icon(Fi.FiClock, H.lt1),
  };

  // ---------- 版式 ----------
  const FOOT = "Gracenote《TV Search and Discovery in the AI Era》解读 ｜ 市场调研：方法与实践";
  pres.defineSlideMaster({
    title: "TITLE_DARK",
    background: { color: C.text2 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 1.55, w: 7.4, h: 2.3, fontSize: 40, bold: true, color: C.background1, valign: "bottom", align: "left", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.8, y: 4.05, w: 7.4, h: 1.2, fontSize: 18, color: C.accent6, valign: "top", align: "left", margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "SECTION_DARK",
    background: { color: C.text2 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 0.55, w: 11.7, h: 1.0, fontSize: 32, bold: true, color: C.background1, valign: "middle", align: "left", margin: 0 }, text: "" } },
      { text: { text: FOOT, options: { x: 0.8, y: 6.95, w: 9, h: 0.3, fontSize: 10, color: C.accent6, margin: 0 } } },
    ],
    slideNumber: { x: 12.0, y: 6.95, w: 0.6, h: 0.3, fontSize: 10, color: C.accent6, align: "right" },
  });
  pres.defineSlideMaster({
    title: "CONTENT",
    background: { color: C.background1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.4, w: 9.6, h: 0.85, fontSize: 30, bold: true, color: C.text2, valign: "middle", align: "left", margin: 0 }, text: "" } },
      { text: { text: FOOT, options: { x: 0.6, y: 6.95, w: 9, h: 0.3, fontSize: 10, color: C.accent5, margin: 0 } } },
    ],
    slideNumber: { x: 12.1, y: 6.95, w: 0.6, h: 0.3, fontSize: 10, color: C.accent5, align: "right" },
  });

  // 搜索框样式的小标签：全片统一的视觉母题
  function pill(slide, text, x, y, w, opts = {}) {
    const dark = opts.dark;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h: 0.42, rectRadius: 0.21,
      fill: { color: dark ? C.accent1 : C.background2 },
      line: { color: dark ? C.accent1 : C.accent6, width: 1 },
      objectName: opts.name || "标签",
    });
    slide.addImage({ data: dark ? ic.searchLt : ic.search, x: x + 0.16, y: y + 0.11, w: 0.2, h: 0.2, objectName: "搜索图标" });
    slide.addText(text, { x: x + 0.45, y, w: w - 0.55, h: 0.42, fontSize: 12, color: dark ? C.background1 : C.text2, valign: "middle", margin: 0, isTextBox: true, objectName: (opts.name || "标签") + "文字" });
  }
  function iconDot(slide, data, x, y, d, fill) {
    slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill }, objectName: "图标底" });
    const p = d * 0.25;
    slide.addImage({ data, x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p, objectName: "图标" });
  }
  const card = (slide, x, y, w, h, fill, name) =>
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill || C.background2 }, line: { color: fill || C.background2 }, objectName: name || "卡片" });
  const src = (slide, text, y = 6.5) =>
    slide.addText(text, { x: 0.6, y, w: 12.1, h: 0.32, fontSize: 10, color: C.accent5, margin: 0, isTextBox: true, objectName: "来源说明" });

  // ======================= 1 封面 =======================
  pres.addSection({ title: "开场" });
  let s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "开场" });
  s.addText("AI 时代，\n观众还找得到想看的节目吗？", { placeholder: "title" });
  s.addText("解读 Gracenote（尼尔森旗下）2026 年研究报告\n《TV Search and Discovery in the AI Era》", { placeholder: "body" });
  s.addText("市场调研：方法与实践 ｜ 课后作业随堂分享", { x: 0.8, y: 6.3, w: 7.4, h: 0.4, fontSize: 14, color: C.accent6, margin: 0, isTextBox: true, objectName: "课程名" });
  // 右侧：搜索框 + AI 回答，呼应报告主题
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.75, y: 2.2, w: 3.95, h: 0.8, rectRadius: 0.4, fill: { color: C.background1 }, line: { color: C.background1 }, objectName: "搜索框" });
  s.addImage({ data: ic.search, x: 9.0, y: 2.43, w: 0.34, h: 0.34, objectName: "搜索框图标" });
  s.addText("Where is the program I want to watch?", { x: 9.45, y: 2.2, w: 3.15, h: 0.8, fontSize: 13, italic: true, color: C.text2, valign: "middle", margin: 0, isTextBox: true, objectName: "搜索词" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.75, y: 3.25, w: 3.95, h: 1.95, rectRadius: 0.15, fill: { color: C.accent1 }, line: { color: C.accent1 }, objectName: "AI回答框" });
  s.addText([
    { text: "AI 聊天机器人", options: { bold: true, fontSize: 13, color: C.accent6, breakLine: true } },
    { text: "“这部剧在某某平台……”", options: { fontSize: 16, color: C.background1, breakLine: true } },
    { text: "报告引用的测试：只有约 2/3 的回答找对了播出平台", options: { fontSize: 12, color: C.accent6 } },
  ], { x: 9.0, y: 3.35, w: 3.5, h: 1.75, valign: "middle", margin: 0, paraSpaceAfter: 6, isTextBox: true, objectName: "AI回答文字" });
  s.addNotes("大家好，我分享的是尼尔森旗下 Gracenote 在 2026 年发布的报告《AI 时代的电视搜索与内容发现》。它关心的问题很日常：现在流媒体平台这么多，观众还找得到想看的节目吗？AI 聊天机器人能不能帮忙？我会先讲报告做了什么、发现了什么，再按课上讲的方法框架，重点谈它的局限。");

  // ======================= 2 报告概况 =======================
  pres.addSection({ title: "报告介绍" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  s.addText("报告是谁做的、想回答什么", { placeholder: "title" });
  card(s, 0.6, 1.55, 5.2, 4.75, C.text2, "机构卡片");
  iconDot(s, ic.building, 0.95, 1.9, 0.7, C.accent1);
  s.addText("研究机构", { x: 1.85, y: 1.9, w: 3.7, h: 0.7, fontSize: 20, bold: true, color: C.background1, valign: "middle", margin: 0, isTextBox: true, objectName: "机构标题" });
  s.addText([
    { text: "Gracenote 是尼尔森（Nielsen）旗下的内容数据业务，向媒体公司提供节目元数据：片名、简介、类型、在哪个平台播出等。", options: { breakLine: true } },
    { text: "尼尔森本身是收视率调查的代表机构，属于课上讲的“辛迪加服务”。", options: { breakLine: true } },
    { text: "本报告：2026 年发布，正文 23 页；类型上属于消费者调查 + 媒介调查。" },
  ], { x: 0.95, y: 2.8, w: 4.6, h: 3.3, fontSize: 15, color: C.background1, valign: "top", margin: 0, paraSpaceAfter: 10, isTextBox: true, objectName: "机构说明" });

  const qs = [
    ["使用", "人们，尤其是年轻人，怎样用 AI 聊天机器人找信息？"],
    ["痛点", "流媒体平台越来越多，找节目有多难？会不会导致退订？"],
    ["信任", "观众相信 AI 给出的娱乐、体育信息吗？"],
  ];
  s.addText("三个研究问题", { x: 6.3, y: 1.55, w: 6.4, h: 0.45, fontSize: 20, bold: true, color: C.text2, margin: 0, isTextBox: true, objectName: "问题标题" });
  qs.forEach(([k, v], i) => {
    const y = 2.2 + i * 1.08;
    s.addShape(pres.shapes.OVAL, { x: 6.3, y: y + 0.08, w: 0.62, h: 0.62, fill: { color: C.accent1 }, line: { color: C.accent1 }, objectName: `序号底${i + 1}` });
    s.addText(String(i + 1), { x: 6.3, y: y + 0.08, w: 0.62, h: 0.62, fontSize: 20, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: `序号${i + 1}` });
    s.addText([
      { text: k, options: { bold: true, color: C.accent1, fontSize: 16, breakLine: true } },
      { text: v, options: { color: C.text1, fontSize: 15 } },
    ], { x: 7.15, y, w: 5.55, h: 0.85, valign: "middle", margin: 0, isTextBox: true, objectName: `问题${i + 1}` });
  });
  pill(s, "报告主张：AI 会成为找节目的主要入口，但必须接入可信的行业数据", 6.3, 5.65, 6.4, { name: "主张标签" });
  s.addNotes("先介绍机构。Gracenote 是尼尔森的子公司，主业是给媒体公司提供节目数据。尼尔森大家课上见过，是做收视率的辛迪加服务机构。这份报告想回答三个问题：一是大家怎么用 AI 找信息，二是平台太多导致找节目难，会不会引起退订，三是大家信不信 AI 的答案。报告最后的主张是：AI 会成为找节目的入口，但必须接入可信的行业数据。");

  // ======================= 3 研究方法 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  s.addText("研究方法：一份报告，背后是五类数据", { placeholder: "title" });
  const hd = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text2 } } });
  const nd = (t) => ({ text: t, options: { color: C.accent3, bold: true } });
  const rows = [
    [hd("数据来源"), hd("性质"), hd("调查对象"), hd("调查时间"), hd("样本量"), hd("抽样方式")],
    [{ text: "Gracenote 2026 生成式 AI 使用调查（核心）", options: { bold: true } }, "线上问卷", "美国 13–79 岁互联网 / AI 聊天机器人用户", "2026.1.23–2.4", "4,003", nd("未披露")],
    [{ text: "Gracenote 2025 流媒体消费者调查", options: { bold: true } }, "线上问卷", "巴西、法、德、墨、美、英的流媒体用户", "2025.7.28–8.1", "3,000（每国 500）", nd("未披露")],
    [{ text: "Nielsen 收视测量（NPOWER 等）", options: { bold: true } }, "收视测量", "美国 2 岁以上观众", "2025 年", nd("图旁未注明"), nd("图旁未注明")],
    [{ text: "Gracenote 节目数据库", options: { bold: true } }, "商业元数据", "80+ 国家和地区、300+ 流媒体目录", "截至 2026.2", "—", "非抽样"],
    [{ text: "外部引用：Pew、Deloitte、PwC 等 6 项", options: { bold: true } }, "二手资料", "各不相同", "2021–2025", "各不相同", "各不相同"],
  ];
  s.addTable(rows, {
    x: 0.6, y: 1.5, w: 12.1, colW: [3.0, 1.3, 3.05, 1.65, 1.8, 1.3],
    fontSize: 13, color: C.text1, valign: "middle", margin: [4, 6, 4, 6],
    border: { type: "solid", pt: 0.75, color: C.accent6 }, rowH: [0.5, 0.78, 0.78, 0.66, 0.66, 0.66],
    fill: { color: C.background1 }, objectName: "方法表",
  });
  s.addText([
    { text: "课上要求看的四项（对象 / 时间 / 抽样 / 样本量）里，", options: {} },
    { text: "抽样方式是两份核心问卷都没有交代的一项", options: { bold: true, color: C.accent3 } },
    { text: "。4,003 这个精确数字来自尼尔森新闻稿，报告正文写的是“4,000 多人”。" },
  ], { x: 0.6, y: 5.75, w: 12.1, h: 0.6, fontSize: 14, color: C.text1, margin: 0, isTextBox: true, objectName: "方法小结" });
  src(s, "来源：报告第 23 页“Data sources”、第 8–10 页图注；Nielsen 2026 年新闻稿。");
  s.addNotes("这一页是研究方法。按老师要求的对象、时间、抽样、样本量来看：核心是 2026 年的 AI 使用调查，线上问卷，美国 13 到 79 岁的 AI 聊天机器人用户，2026 年 1 月底到 2 月初，约 4000 人。另一份是 2025 年六个国家共 3000 人的流媒体调查。此外还用了尼尔森的收视测量、自己的节目数据库和六项外部研究。要注意橙色字：两份核心问卷都没有说抽样方式，这是后面评价的起点。");

  // ======================= 4 数据来源逐一核查 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  s.addText("逐一核查 11 个数据来源：方法公开到什么程度", { placeholder: "title" });
  const ST = { open: [C.accent2, "方法公开"], part: [C.accent5, "部分公开"], gap: [C.accent3, "关键信息未公开"] };
  const srcs = [
    ["问卷", "Gracenote 2026 AI 调查", "线上 · 美国 AI 用户 · 4,003 人；招募、加权、回应率未公开", "gap"],
    ["问卷", "Gracenote 2025 流媒体调查", "线上 · 6 国各 500 人；招募、加权、回应率未公开", "gap"],
    ["问卷", "Pew 青少年调查", "概率样本库 · 1,458 人 · 加权 · 误差 ±3.3 个百分点", "open"],
    ["问卷", "Deloitte 数字媒体趋势", "线上 · 美国 14 岁以上 3,595 人 · 按人口普查加权", "open"],
    ["测量", "Nielsen NPOWER / Media Impact", "4.2 万户人员测量仪 + 4,500 万户机顶盒与智能电视数据", "open"],
    ["测量", "Nielsen 流媒体收视", "装流媒体测量仪的样本户，只测电视屏幕", "open"],
    ["数据库", "Gracenote 节目数据库", "公司自有元数据，非抽样；采集与核验流程未公开", "gap"],
    ["预测", "PwC 娱乐与媒体展望", "公开数据 + 行业访谈 + 建模；全球市场合计", "part"],
    ["测试", "Veed Analytics 聊天机器人测试", "6 国、只测独播剧、每题问 3 次；题量、模型版本、评分程序未公开", "gap"],
    ["论文", "USC 知识库偏差研究", "同行评审论文；自动分类器判定 + 众包抽样人工验证", "open"],
    ["行业", "Fabric 流失率", "Fabric 原页未见 5.5% 与 2%；流失率定义未公开", "gap"],
  ];
  srcs.forEach(([type, name, how, st], i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = 0.6 + col * 3.075, y = 1.45 + row * 1.68;
    card(s, x, y, 2.9, 1.5, C.background2, `来源卡${i + 1}`);
    s.addShape(pres.shapes.OVAL, { x: x + 0.2, y: y + 0.2, w: 0.2, h: 0.2, fill: { color: ST[st][0] }, line: { color: ST[st][0] }, objectName: `状态点${i + 1}` });
    s.addText([
      { text: type + " ｜ ", options: { fontSize: 11, color: C.accent5 } },
      { text: ST[st][1], options: { fontSize: 11, bold: true, color: ST[st][0] } },
    ], { x: x + 0.5, y: y + 0.12, w: 2.3, h: 0.35, valign: "middle", margin: 0, isTextBox: true, objectName: `来源类型${i + 1}` });
    s.addText([
      { text: name, options: { fontSize: 14, bold: true, color: C.text2, breakLine: true } },
      { text: how, options: { fontSize: 11, color: C.text1 } },
    ], { x: x + 0.2, y: y + 0.5, w: 2.55, h: 0.95, valign: "top", margin: 0, paraSpaceAfter: 3, isTextBox: true, objectName: `来源说明${i + 1}` });
  });
  // 第 12 格：结论
  card(s, 0.6 + 3 * 3.075, 1.45 + 2 * 1.68, 2.9, 1.5, C.text2, "来源小结卡");
  s.addText("Gracenote 自己的两份问卷，恰恰是方法最不透明的两项", { x: 0.6 + 3 * 3.075 + 0.2, y: 1.45 + 2 * 1.68, w: 2.5, h: 1.5, fontSize: 14, bold: true, color: C.background1, valign: "middle", margin: 0, isTextBox: true, objectName: "来源小结" });
  src(s, "核查依据：报告第 23 页；Gracenote 2025《State of Play》第 20 页；各机构方法说明与新闻稿（详见仓库中的核查文档）。", 6.55);
  s.addNotes("我把报告用到的 11 个数据来源逐一查了一遍，按方法公开的程度标了颜色。青色是方法公开的：尼尔森的收视测量、Pew、Deloitte 和 USC 的论文。橙色是关键信息没公开的。值得注意的是，报告最核心的两份 Gracenote 自己的问卷，恰恰都没有公开样本怎么招募、怎么加权、回应率多少。");

  // ======================= 4 主要结论 =======================
  pres.addSection({ title: "主要发现" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "主要发现" });
  s.addText("报告的主要结论", { placeholder: "title" });
  const stats = [
    ["54%", "Alpha 世代（13–14 岁受访者）每天使用 AI 聊天机器人"],
    ["80%", "Alpha 世代称过去 12–18 个月用得更多了"],
    ["75%", "受访者会核查聊天机器人给出的答案"],
    ["14 分钟", "六国平均找一个想看的节目所花时间；美国受访者为 12 分钟"],
    ["54%", "18–34 岁受访者（六国）：找不到想看的，可能会取消订阅"],
    ["52%", "美国受访者认为 AI 聊天机器人有可能成为最常用的娱乐信息来源"],
  ];
  stats.forEach(([n, t], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 4.1, y = 1.55 + row * 2.45;
    const fromOld = i === 3 || i === 4;
    card(s, x, y, 3.8, 2.15, C.background2, `结论卡${i + 1}`);
    s.addText(n, { x: x + 0.3, y: y + 0.2, w: 3.3, h: 0.9, fontSize: 40, bold: true, fontFace: "Arial", color: fromOld ? C.accent2 : C.accent1, margin: 0, valign: "middle", isTextBox: true, objectName: `结论数字${i + 1}` });
    s.addText(t, { x: x + 0.3, y: y + 1.1, w: 3.3, h: 0.9, fontSize: 14, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: `结论说明${i + 1}` });
  });
  s.addText([
    { text: "紫色：", options: { bold: true, color: C.accent1 } },
    { text: "2026 生成式 AI 使用调查    " },
    { text: "青色：", options: { bold: true, color: C.accent2 } },
    { text: "2025 流媒体消费者调查（六国平均）。两份调查的对象、国家和时间都不同。" },
  ], { x: 0.6, y: 6.45, w: 12.1, h: 0.35, fontSize: 11, color: C.accent5, margin: 0, isTextBox: true, objectName: "颜色说明" });
  s.addNotes("报告的主要结论有六个数字。紫色来自 2026 年的 AI 调查：13 到 14 岁的受访者有 54% 每天用 AI 聊天机器人，80% 说用得更多了；75% 的人会核查 AI 的答案；52% 认为 AI 有可能成为最常用的娱乐信息来源。青色来自 2025 年的流媒体调查：平均找一个节目要 14 分钟，18 到 34 岁有 54% 说找不到可能会退订。注意青色数字是六个国家的平均，美国自己找节目是 12 分钟，后面会细讲。");

  // ======================= 5 图表：每日使用 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "主要发现" });
  s.addText("年龄越小，每天用 AI 的比例越高", { placeholder: "title" });
  const ages = ["13–14 岁（Alpha 世代）", "15–28 岁（Z 世代）", "29–44 岁（千禧一代）", "45–60 岁（X 世代）", "61–79 岁（婴儿潮）", "全体平均"];
  s.addChart(pres.charts.BAR, [{ name: "每天使用", labels: ages, values: [54, 39, 42, 31, 20, 38] }], {
    x: 0.6, y: 1.5, w: 7.6, h: 4.85, barDir: "bar", catAxisOrientation: "maxMin",
    chartColors: [H.accent1, "A99BEA", "A99BEA", "A99BEA", "A99BEA", H.accent2],
    showTitle: true, title: "每天使用 AI 聊天机器人的比例", titleFontSize: 14, titleColor: H.dk2, titleFontFace: "+mn-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: '0"%"', dataLabelFontSize: 12, dataLabelColor: H.dk1, dataLabelFontFace: "+mn-lt",
    catAxisLabelFontSize: 12, catAxisLabelColor: H.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 65, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    catAxisLineShow: false, showLegend: false, barGapWidthPct: 45, objectName: "每日使用图",
  });
  card(s, 8.6, 1.5, 4.1, 2.15, C.background2, "说明卡1");
  s.addText([
    { text: "76%", options: { fontSize: 36, bold: true, fontFace: "Arial", color: C.accent2, breakLine: true } },
    { text: "全体平均：每天 38% + 每周多次 38%，即报告说的“75% 每周多次使用”", options: { fontSize: 14, color: C.text1 } },
  ], { x: 8.9, y: 1.65, w: 3.55, h: 1.9, valign: "middle", margin: 0, isTextBox: true, objectName: "说明1" });
  card(s, 8.6, 3.95, 4.1, 2.4, C.background2, "说明卡2");
  s.addText([
    { text: "先记住分母", options: { fontSize: 16, bold: true, color: C.accent3, breakLine: true } },
    { text: "这些比例都是在“互联网和 AI 聊天机器人用户”中算的，不是全体美国人中有多少人每天用 AI。", options: { fontSize: 14, color: C.text1 } },
  ], { x: 8.9, y: 4.1, w: 3.55, h: 2.1, valign: "middle", margin: 0, paraSpaceAfter: 6, isTextBox: true, objectName: "说明2" });
  src(s, "来源：报告第 14 页“Daily use of AI chatbots”，Gracenote 2026 生成式 AI 使用调查。");
  s.addNotes("这张图是每天使用 AI 聊天机器人的比例。13 到 14 岁最高，54%；婴儿潮一代最低，20%。平均每天用的 38%，加上每周用好几次的 38%，就是报告说的约四分之三。这里先请大家记住分母：这是 AI 聊天机器人用户里的比例，不是全体美国人。");

  // ======================= 6 图表：信任 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "主要发现" });
  s.addText("用得多，不等于信得过", { placeholder: "title" });
  const ages2 = ["13–14 岁", "15–28 岁", "29–44 岁", "45–60 岁", "61–79 岁", "全体平均"];
  s.addChart(pres.charts.BAR, [
    { name: "传统搜索", labels: ages2, values: [99, 91, 92, 92, 86, 92] },
    { name: "AI 聊天机器人", labels: ages2, values: [95, 83, 87, 87, 80, 85] },
  ], {
    x: 0.6, y: 1.5, w: 7.6, h: 4.85, barDir: "bar", barGrouping: "clustered", catAxisOrientation: "maxMin",
    chartColors: [H.accent5, H.accent2],
    showTitle: true, title: "认为娱乐搜索结果准确性“优秀 / 良好”的比例", titleFontSize: 14, titleColor: H.dk2, titleFontFace: "+mn-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: '0"%"', dataLabelFontSize: 12, dataLabelColor: H.dk1, dataLabelFontFace: "+mn-lt",
    catAxisLabelFontSize: 12, catAxisLabelColor: H.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 110, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    catAxisLineShow: false, showLegend: true, legendPos: "b", legendFontSize: 12, legendFontFace: "+mn-lt", legendColor: H.dk1,
    barGapWidthPct: 40, objectName: "准确性图",
  });
  const trust = [
    ["75%", "会核查 AI 的答案，最常用的核查办法是再用传统搜索查一遍"],
    ["77%", "对 AI 的结果有顾虑，最常见的是信息不够新、听起来对其实错"],
  ];
  trust.forEach(([n, t], i) => {
    const y = 1.5 + i * 2.5;
    card(s, 8.6, y, 4.1, 2.2, C.background2, `信任卡${i + 1}`);
    s.addText([
      { text: n, options: { fontSize: 36, bold: true, fontFace: "Arial", color: C.accent1, breakLine: true } },
      { text: t, options: { fontSize: 14, color: C.text1 } },
    ], { x: 8.9, y: y + 0.12, w: 3.55, h: 1.96, valign: "middle", margin: 0, isTextBox: true, objectName: `信任说明${i + 1}` });
  });
  src(s, "来源：报告第 15、18、20 页，Gracenote 2026 生成式 AI 使用调查。");
  s.addNotes("但用得多，不等于信得过。每个年龄组都觉得传统搜索比 AI 更准，平均 92% 对 85%。75% 的人会核查 AI 的答案，而且最常见的核查方式恰恰是再去用传统搜索查一遍。77% 对 AI 结果有顾虑，主要担心信息过时，或者听起来对但其实是错的。报告由此得出：AI 必须接入可信的数据。");

  // ======================= 7 评价框架 =======================
  pres.addSection({ title: "评价与局限" });
  s = pres.addSlide({ masterName: "SECTION_DARK", sectionTitle: "评价与局限" });
  s.addText("怎么评价：比起结果，更该看方法和过程", { placeholder: "title" });
  s.addText("课上的春晚满意度案例：央视 81.6% vs 新浪网 11.5%。差异来自四个方面，我用同样的四个角度检查这份报告。", { x: 0.8, y: 1.65, w: 11.7, h: 0.7, fontSize: 16, color: C.accent6, margin: 0, isTextBox: true, objectName: "框架引言" });
  const fw = [
    [ic.users, "调查对象", "问的是谁？AI 用户还是所有人？", "局限一、二"],
    [ic.globe, "研究总体", "结论能推广到谁？美国人？六国？年轻人？", "局限一、三、四"],
    [ic.sliders, "研究方法", "线上问卷怎么招人、怎么加权？指标是意向还是行为？", "局限一、五、六"],
    [ic.clock, "调查时间", "不同时间、不同调查的数字能不能直接比？", "局限四"],
  ];
  fw.forEach(([img, k, v, tag], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.8 + col * 5.95, y = 2.6 + row * 1.95;
    card(s, x, y, 5.75, 1.7, C.accent1, `框架卡${i + 1}`);
    iconDot(s, img, x + 0.3, y + 0.45, 0.8, C.text2);
    s.addText([
      { text: k, options: { fontSize: 20, bold: true, color: C.background1, breakLine: true } },
      { text: v, options: { fontSize: 14, color: C.background1, breakLine: true } },
      { text: "→ " + tag, options: { fontSize: 12, color: C.accent6 } },
    ], { x: x + 1.35, y: y + 0.12, w: 4.2, h: 1.46, valign: "middle", margin: 0, isTextBox: true, objectName: `框架文字${i + 1}` });
  });
  s.addNotes("接下来是评价。课上讲春晚满意度调查，央视说 81.6% 叫好，新浪网只有 11.5%，原因在于调查对象、研究总体、研究方法和调查时间不同。老师的提醒是：比起结果，更要看方法和过程。我就用这四个角度来检查这份报告，下面六个局限分别对应这四个角度。");

  // ======================= 8 局限一 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "评价与局限" });
  s.addText("局限一：4,003 人代表的是谁？", { placeholder: "title" });
  pill(s, "调查对象 · 研究总体", 10.4, 0.62, 2.3, { name: "角度标签" });
  // 嵌套圆：总体逐层收窄
  const rings = [
    [0.6, 1.55, 4.8, C.background2, "美国人口"],
    [1.05, 2.25, 3.9, C.accent6, "互联网用户"],
    [1.5, 2.95, 3.0, "A99BEA", "AI 聊天机器人用户"],
    [2.0, 3.65, 2.0, C.accent1, ""],
  ];
  rings.forEach(([x, y, d, fill, label], i) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: C.background1, width: 1.5 }, objectName: `总体圈${i + 1}` });
    if (label) s.addText(label, { x, y: y + 0.12, w: d, h: 0.45, fontSize: 13, bold: true, color: C.text2, align: "center", margin: 0, isTextBox: true, objectName: `总体标签${i + 1}` });
  });
  s.addText([
    { text: "本次线上受访者", options: { fontSize: 13, bold: true, color: C.background1, breakLine: true } },
    { text: "4,003", options: { fontSize: 20, bold: true, fontFace: "Arial", color: C.background1 } },
  ], { x: 2.0, y: 3.95, w: 2.0, h: 1.2, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: "受访者标签" });

  s.addText([
    { text: "报告披露了", options: { bold: true, color: C.accent2, fontSize: 16, breakLine: true } },
    { text: "线上调查；13–79 岁；2026.1.23–2.4；“4,000 多名互联网和 AI 聊天机器人用户”。", options: { fontSize: 15, breakLine: true, paraSpaceAfter: 14 } },
    { text: "报告没有披露", options: { bold: true, color: C.accent3, fontSize: 16, breakLine: true } },
    { text: "从哪里招募（哪家样本库）、是否概率抽样、配额和加权、回应率、完整问卷。", options: { fontSize: 15, breakLine: true, paraSpaceAfter: 14 } },
    { text: "所以", options: { bold: true, color: C.text2, fontSize: 16, breakLine: true } },
    { text: "结论适用于“这次接受调查的 AI 用户”。正文却多处写成 “U.S. consumers”“Americans”。仅凭 N = 4,003，无法判断它能否代表全体美国人。", options: { fontSize: 15 } },
  ], { x: 6.0, y: 1.55, w: 6.7, h: 3.95, color: C.text1, valign: "middle", paraSpaceAfter: 4, margin: 0, isTextBox: true, objectName: "局限一说明" });
  card(s, 6.0, 5.75, 6.7, 0.65, C.background2, "Durex卡");
  s.addText("和课上 Durex 网络调查是同一个问题：网络样本能否反映总体结构？", { x: 6.2, y: 5.75, w: 6.4, h: 0.65, fontSize: 14, color: C.text2, bold: true, valign: "middle", margin: 0, isTextBox: true, objectName: "Durex联系" });
  s.addNotes("第一个局限：4003 人代表的是谁？报告写得很清楚，对象是互联网和 AI 聊天机器人用户，是一层层收窄的人群。但它没说从哪里招人、是不是概率抽样、怎么加权、回应率多少。所以结论最严格只能说'这次接受调查的 AI 用户'。可报告正文常常写成'美国消费者''美国人'。这和课上 Durex 网络调查的问题一样：网络样本能不能反映总体结构。我不是说数据错了，而是凭现有说明判断不了。");

  // ======================= 9 局限二 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "评价与局限" });
  s.addText("局限二：“Alpha 世代”其实只有 13–14 岁", { placeholder: "title" });
  pill(s, "调查对象 · 样本量", 10.6, 0.62, 2.1, { name: "角度标签" });
  // 出生年份时间轴 2010–2024
  const tx0 = 0.9, tx1 = 12.4, y0 = 2.35;
  const yr = (v) => tx0 + ((v - 2010) / 15) * (tx1 - tx0);
  s.addText("报告定义：Alpha 世代 = 2010–2024 年出生", { x: 0.6, y: 1.5, w: 8, h: 0.4, fontSize: 15, bold: true, color: C.text2, margin: 0, isTextBox: true, objectName: "时间轴标题" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: tx0, y: y0, w: tx1 - tx0, h: 0.42, rectRadius: 0.21, fill: { color: C.background2 }, line: { color: C.accent6 }, objectName: "时间轴" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: yr(2011), y: y0, w: yr(2013) - yr(2011), h: 0.42, rectRadius: 0.21, fill: { color: C.accent3 }, line: { color: C.accent3 }, objectName: "样本覆盖段" });
  [2010, 2014, 2018, 2022, 2024].forEach((v) => {
    s.addText(String(v), { x: yr(v) - 0.4, y: y0 + 0.5, w: 0.8, h: 0.3, fontSize: 11, color: C.accent5, align: "center", margin: 0, isTextBox: true, objectName: `年份${v}` });
  });
  s.addText("样本只覆盖这一段（调查时 13–14 岁，约 2011–2012 年出生）", { x: yr(2013) + 0.15, y: y0 - 0.45, w: 6.5, h: 0.4, fontSize: 13, color: C.accent3, bold: true, margin: 0, isTextBox: true, objectName: "覆盖说明" });

  const lim2 = [
    ["分组人数没公布", "13–14 岁、15–28 岁等各组各有多少人，报告没写，所以 54%、80% 这类分组数字的误差无法估计。各组跨度也不一样：Alpha 组只有 2 岁，其他组 14–19 岁。"],
    ["“美国人”只有约 500 人", "2025 调查每国 500 人（Gracenote 上一份报告写明）。“51% 的美国人觉得服务太多难找”只基于约 500 人，误差至少约 ±4.4 个百分点。"],
    ["总体 75% 无法由分组复算", "五个年龄组的核查比例为 74%、78%、78%、70%、58%，简单平均只有 71.6%；总体却是 75%。说明各组人数或权重不同，但报告没交代。"],
  ];
  lim2.forEach(([k, v], i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 3.45, 3.8, 2.6, C.background2, `局限二卡${i + 1}`);
    s.addText([
      { text: k, options: { fontSize: 16, bold: true, color: C.text2, breakLine: true } },
      { text: v, options: { fontSize: 14, color: C.text1 } },
    ], { x: x + 0.25, y: 3.6, w: 3.3, h: 2.3, valign: "top", margin: 0, paraSpaceAfter: 8, isTextBox: true, objectName: `局限二文字${i + 1}` });
  });
  src(s, "来源：报告第 2、13–18、23 页；Gracenote 2025《State of Play》第 20 页（每国 500 人）。");
  s.addNotes("第二个局限是子样本。报告把 Alpha 世代定义为 2010 到 2024 年出生，但调查最小只到 13 岁，所以'Alpha 世代'其实只是 13 到 14 岁这两岁。每个年龄组多少人报告没写，分组数字的误差就没法估计。2025 年的调查每个国家 500 人，所以'美国人'的数字只基于 500 人左右，误差至少正负 4.4 个百分点。还有一个小细节：五个年龄组的核查比例简单平均是 71.6%，总体却是 75%，说明各组人数或权重不同，但报告没交代。");

  // ======================= 局限三：六国口径 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "评价与局限" });
  s.addText("局限三：六国平均被放进了美国语境", { placeholder: "title" });
  pill(s, "研究总体", 11.3, 0.62, 1.4, { name: "角度标签" });
  const ctry = ["巴西", "法国", "德国", "墨西哥", "英国", "美国", "六国平均"];
  s.addChart(pres.charts.BAR, [{ name: "找节目时间", labels: ctry, values: [12, 26, 11, 11, 12, 12, 14] }], {
    x: 0.6, y: 1.5, w: 5.6, h: 4.85, barDir: "bar", catAxisOrientation: "maxMin",
    chartColors: ["A99BEA", "A99BEA", "A99BEA", "A99BEA", "A99BEA", H.accent1, H.accent3],
    showTitle: true, title: "找到想看的节目要几分钟（2025 调查）", titleFontSize: 14, titleColor: H.dk2, titleFontFace: "+mn-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: '0" 分钟"', dataLabelFontSize: 12, dataLabelColor: H.dk1, dataLabelFontFace: "+mn-lt",
    catAxisLabelFontSize: 12, catAxisLabelColor: H.dk1, catAxisLabelFontFace: "+mn-lt",
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 32, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    catAxisLineShow: false, showLegend: false, barGapWidthPct: 45, objectName: "分国家找节目时间图",
  });
  const six = [
    ["14 分钟", "第 9 页把它和美国尼尔森收视数据画在同一张图里。它其实是六国简单平均：(12+26+11+11+12+12)÷6 = 14；美国自己是 12 分钟，法国一国拉高了平均。"],
    ["54% 与 50%", "摘要“18–34 岁 54% 会取消”与六国数据吻合（18–24 岁 52%、25–34 岁 56%）；“50% 的美国观众会考虑取消”原文只找到六国 49%。"],
    ["32% 与 34%", "两页措辞略异，但对应同一道题。32% 与六国平均一致；第 12 页写成“34% 的美国人”。两页的“18–34 岁 48%”都高于六国同龄的 39%–40%。"],
  ];
  six.forEach(([k, v], i) => {
    const y = 1.5 + i * 1.65;
    card(s, 6.6, y, 6.1, 1.45, C.background2, `口径卡${i + 1}`);
    s.addText(k, { x: 6.8, y, w: 1.55, h: 1.45, fontSize: 20, bold: true, color: C.accent3, valign: "middle", margin: 0, isTextBox: true, objectName: `口径数字${i + 1}` });
    s.addText(v, { x: 8.4, y: y + 0.08, w: 4.15, h: 1.3, fontSize: 13, color: C.text1, valign: "middle", margin: 0, isTextBox: true, objectName: `口径说明${i + 1}` });
  });
  src(s, "来源：报告第 2、9、12 页；Gracenote 2025《State of Play》分国家、分年龄图表（每国 500 人）。", 6.55);
  s.addNotes("第三个局限是我对照 Gracenote 上一份报告原文发现的。2026 报告里的'平均找节目 14 分钟'，其实是巴西、法国、德国、墨西哥、英国、美国六国的简单平均，美国自己是 12 分钟，法国一国 26 分钟把平均拉高了。但报告把 14 分钟和美国尼尔森的收视数据画在了同一张图里。摘要里'18 到 34 岁 54% 会取消订阅'也和六国数据吻合；报告说'50% 的美国观众会考虑取消'，原始材料里只找得到六国的 49%。还有第 9 页 32% 和第 12 页 34%，两页措辞略有不同，但对应同一道题，32% 和六国平均一致，34% 写的是美国人。也就是说，读者很容易把六国数字当成美国数字。");

  // ======================= 10 局限三 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "评价与局限" });
  s.addText("局限四：30% 到 54%，不能直接说“增长”", { placeholder: "title" });
  pill(s, "研究总体 · 调查时间", 10.4, 0.62, 2.3, { name: "角度标签" });
  s.addText("报告原话：Pew 2025 年秋发现 30% 的青少年每天用聊天机器人，“仅仅几个月后”Gracenote 调查显示超过一半，说明“使用频率在加速”。", { x: 0.6, y: 1.45, w: 12.1, h: 0.65, fontSize: 15, italic: true, color: C.text2, margin: 0, isTextBox: true, objectName: "报告原话" });
  const cmpH = (t, fill) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: fill }, align: "center" } });
  const lab = (t) => ({ text: t, options: { bold: true, color: C.text2, fill: { color: C.background2 } } });
  const cmp = [
    [cmpH("春晚案例的四个角度", C.text2), cmpH("Pew 研究中心", C.accent5), cmpH("Gracenote", C.accent1)],
    [lab("调查对象"), "美国 13–17 岁青少年，用不用 AI 都算", "13–14 岁的 AI 聊天机器人用户"],
    [lab("研究方法"), "Ipsos KnowledgePanel 概率样本库，加权；1,458 人，误差 ±3.3", "线上调查，招募和加权未披露；13–14 岁组人数未披露"],
    [lab("调查时间"), "2025.9.25–10.9", "2026.1.23–2.4"],
    [lab("结果"), { text: "64% 用过；每天用 28%，其中 13–14 岁 24%", options: { bold: true } }, { text: "13–14 岁：54% 每天使用", options: { bold: true } }],
    [lab("换成同一分母"), { text: "使用者中每天用：44%（894 人）", options: { bold: true, color: C.accent3 } }, { text: "54%（本来就只问使用者）", options: { bold: true, color: C.accent3 } }],
  ];
  s.addTable(cmp, {
    x: 0.6, y: 2.3, w: 12.1, colW: [2.6, 4.75, 4.75], fontSize: 14, color: C.text1, valign: "middle",
    margin: [4, 8, 4, 8], border: { type: "solid", pt: 0.75, color: C.accent6 }, rowH: [0.48, 0.55, 0.62, 0.5, 0.5, 0.55],
    fill: { color: C.background1 }, objectName: "对比表",
  });
  card(s, 0.6, 5.85, 12.1, 0.6, C.background2, "结论条");
  s.addText("同为 13–14 岁：24% 对 54%，差距主要来自分母。换成使用者分母只差约 10 个百分点，不能说明“加速”。", { x: 0.85, y: 5.85, w: 11.7, h: 0.6, fontSize: 15, bold: true, color: C.accent3, valign: "middle", margin: 0, isTextBox: true, objectName: "局限三结论" });
  src(s, "来源：报告第 14 页；Pew Research Center《Teens, Social Media and AI Chatbots 2025》方法说明。", 6.55);
  s.addNotes("第三个局限最像春晚案例。报告拿 Pew 的 30% 和自己的 54% 对比，说几个月内使用频率在加速。但我们用春晚的四个角度对一下：对象不同，Pew 是所有 13 到 17 岁青少年，Gracenote 是 13 到 14 岁的 AI 用户；方法不同，Pew 是基于随机地址抽样的样本库并加权；时间也不同。关键是分母。Pew 的数据表里，所有青少年每天用的精确值是 28%，其中 13 到 14 岁只有 24%；而 Gracenote 同样是 13 到 14 岁，却是 54%。区别在于 Pew 问的是所有青少年，Gracenote 只问 AI 用户。换成同样的'使用者'分母，Pew 是 44%，和 54% 只差 10 个百分点左右，剩下的还可能来自年龄、方法和时间不同。所以这个差距不能解释成增长。");

  // ======================= 11 局限四 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "评价与局限" });
  s.addText("局限五：意向、行为、预测、测试，不是同一种数据", { placeholder: "title" });
  pill(s, "研究方法", 11.3, 0.62, 1.4, { name: "角度标签" });
  const kinds = [
    [ic.msg, C.accent1, "意向（问卷自报）", "54%", "18–34 岁“可能会取消订阅”（六国）", "Gracenote 2025 调查"],
    [ic.activity, C.accent2, "行为（行业指标）", "5.5%", "月流失率，称 2019 年为 2%；Antenna 测得 2019 年 10 月已是 4.1%", "Fabric 原页未见此数，定义未公开"],
    [ic.trend, C.text2, "预测（模型）", "3,185 亿美元", "OTT 与付费电视 2029 年支出，是全球数字，不是美国", "PwC，年增仅 1.8%"],
    [ic.cpu, C.accent5, "测试（机器表现）", "约 2/3", "找对了播出平台；美英德约 80%，法意西不到 30%", "Veed，6 国合并、只测独播剧"],
  ];
  kinds.forEach(([img, col, k, n, t, from], i) => {
    const x = 0.6 + i * 3.075;
    card(s, x, 1.5, 2.85, 3.5, C.background2, `数据类型卡${i + 1}`);
    iconDot(s, img, x + 0.25, 1.75, 0.7, col);
    s.addText(k, { x: x + 0.25, y: 2.55, w: 2.4, h: 0.4, fontSize: 15, bold: true, color: C.text2, margin: 0, isTextBox: true, objectName: `类型名${i + 1}` });
    s.addText(n, { x: x + 0.25, y: 2.95, w: 2.45, h: 0.65, fontSize: n.length > 5 ? 22 : 30, bold: true, color: col, valign: "middle", margin: 0, isTextBox: true, objectName: `类型数字${i + 1}` });
    s.addText([
      { text: t, options: { fontSize: 14, color: C.text1, breakLine: true } },
      { text: from, options: { fontSize: 11, color: C.accent5 } },
    ], { x: x + 0.25, y: 3.6, w: 2.45, h: 1.35, valign: "top", margin: 0, paraSpaceAfter: 6, isTextBox: true, objectName: `类型说明${i + 1}` });
  });
  s.addText([
    { text: "报告把它们连成一条链：", options: { bold: true, color: C.text2 } },
    { text: "节目难找 → 观众退订 → 需要 AI + 可信数据。", options: { breakLine: true } },
    { text: "但没有追踪同一批人，也没有做实验，所以不能证明“找不到”导致“退订”；“通过 MCP 接入行业数据就能保证信息不过时”也没有经过检验。", options: {} },
  ], { x: 0.6, y: 5.3, w: 12.1, h: 1.1, fontSize: 15, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: "局限四结论" });
  s.addNotes("第五个局限是指标类型。报告用了四种完全不同的数据：问卷里说'可能会退订'是意向，而且是六国口径；5.5% 的月流失率是实际行为，但另一家机构 Antenna 测得 2019 年就已经是 4.1%，和报告说的 2% 差了一倍，说明定义不同；3185 亿美元是 PwC 对全球市场的预测，不是美国；三分之二找对平台是六个国家合并的测试结果，而且只测独播剧，ChatGPT 在美英德约八成正确，在法意西不到三成。报告把它们串成'找不到节目导致退订，所以需要 AI 和可信数据'。但它没有追踪同一批人，也没有做实验，所以这条因果链没有被证明。");

  // ======================= 12 局限五 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "评价与局限" });
  s.addText("局限六：几处引用和口径需要校准", { placeholder: "title" });
  pill(s, "研究方法", 11.3, 0.62, 1.4, { name: "角度标签" });
  const cal = [
    [cmpH("报告的写法", C.text2), cmpH("原始来源 / 图表本身显示", C.text2)],
    ["USC 研究：两个 AI 数据库中“高达 38%”的常识数据有偏差", "38.6% 只是 GenericsKB 一个库在 regard 指标下的比例，由自动分类器判定，该指标与人工判断的一致率仅 60.9%；另一个库 ConceptNet 是 3.4%–4.5%"],
    ["Deloitte：41% 的“流媒体订户”认为不值这个价", "Deloitte 原文的分母是“消费者”（3,595 名美国消费者，2024 年 10 月，按人口普查加权）"],
    ["摘要：54% 的 18–34 岁“会取消订阅”", "正文同一数字写的是“会考虑取消”，意向程度更弱"],
    ["PwC：OTT 与付费电视支出 2029 年达 3,185 亿美元", "这是全球数字（2024 年 2,913 亿，年增 1.8%），报告没写明是全球"],
    ["核查图：61–79 岁 58% 会核查 AI，却有 83% “用搜索交叉核对”", "83% 大于 58%，所以外圈的分母只能是“会核查的人”，图注没写清"],
  ];
  s.addTable(cal, {
    x: 0.6, y: 1.5, w: 12.1, colW: [5.3, 6.8], fontSize: 13, color: C.text1, valign: "middle",
    margin: [4, 8, 4, 8], border: { type: "solid", pt: 0.75, color: C.accent6 }, rowH: [0.45, 0.95, 0.72, 0.55, 0.72, 0.72],
    fill: { color: C.background1 }, objectName: "校准表",
  });
  s.addText("这些不一定改变报告的大方向，但说明引用二手数据时要回到原始来源核对分母和措辞。", { x: 0.6, y: 5.85, w: 12.1, h: 0.5, fontSize: 15, bold: true, color: C.text2, margin: 0, valign: "middle", isTextBox: true, objectName: "局限五结论" });
  src(s, "来源：报告第 2、5、6、18、22 页；USC 论文（EMNLP 2021）；Deloitte、PwC 方法说明与新闻稿。", 6.45);
  s.addNotes("第六个局限是几处引用和口径。比如 USC 那个 38%，原论文里只是一个知识库在一个指标下的数，而且是自动分类器判的，这个指标和人工判断的一致率只有六成，另一个库只有 3% 到 4%；Deloitte 的 41% 原文是所有消费者，报告写成了订户；摘要说'会取消'，正文是'会考虑取消'。PwC 的 3185 亿美元其实是全球数字；核查图里 83% 大于 58%，分母没写清。这些不一定推翻大方向，但提醒我们引用二手数据要回原文核对。");

  // ======================= 13 优点 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "评价与局限" });
  s.addText("也要看到：它做对了什么", { placeholder: "title" });
  const goods = [
    "公布了样本量、调查时间、年龄范围、调查方式和筛选条件",
    "每张图都有“Read as”读法说明和数据来源，读者容易看懂",
    "把收视测量（实际行为）和问卷（态度）放在一起看，角度互补",
  ];
  goods.forEach((t, i) => {
    const y = 1.6 + i * 1.3;
    iconDot(s, ic.check, 0.6, y + 0.12, 0.65, C.accent2);
    s.addText(t, { x: 1.5, y, w: 4.3, h: 0.9, fontSize: 15, color: C.text1, valign: "middle", margin: 0, isTextBox: true, objectName: `优点${i + 1}` });
  });
  card(s, 6.3, 1.5, 6.4, 4.85, C.background2, "复算卡");
  s.addText("我用图里的数字复算了几项", { x: 6.6, y: 1.65, w: 5.9, h: 0.45, fontSize: 17, bold: true, color: C.text2, margin: 0, isTextBox: true, objectName: "复算标题" });
  const checks = [
    ["授权剧比原创剧多 81% 观看分钟", "3,309 亿 ÷ 1,823 亿分钟 = 多 81.5%"],
    ["CTV 占美国电视时间 54%", "2:18 ÷ 4:17 = 53.7%"],
    ["51% 的美国人觉得服务太多难找", "与 2025 调查原文美国一栏 51% 一致"],
    ["75% 每周多次使用 AI", "每天 38% + 每周多次 38% = 76%"],
  ];
  checks.forEach(([a, b], i) => {
    const y = 2.25 + i * 0.85;
    s.addText([
      { text: a, options: { fontSize: 14, bold: true, color: C.text1, breakLine: true } },
      { text: b + "  ✓", options: { fontSize: 13, color: C.accent2 } },
    ], { x: 6.6, y, w: 5.9, h: 0.78, valign: "middle", margin: 0, isTextBox: true, objectName: `复算${i + 1}` });
  });
  s.addText("报告内部的数字基本自洽；问题主要在“代表谁”和“能推出什么”。", { x: 6.6, y: 5.6, w: 5.9, h: 0.65, fontSize: 14, bold: true, color: C.text2, valign: "middle", margin: 0, isTextBox: true, objectName: "复算结论" });
  src(s, "复算依据：报告第 8–10、14 页图表数值。");
  s.addNotes("评价也要看优点。报告公布了样本量、时间、年龄、方式和筛选条件，每张图都有读法和来源，还把收视测量和问卷结合起来。我还用图里的数字复算了几项，比如授权剧比原创剧多 81% 的观看分钟、CTV 占 54%，都算得上。所以报告内部是自洽的，问题主要在样本代表谁、数据能推出什么结论。");

  // ======================= 14 结论 =======================
  pres.addSection({ title: "结论" });
  s = pres.addSlide({ masterName: "SECTION_DARK", sectionTitle: "结论" });
  s.addText("我的评价", { placeholder: "title" });
  const verdict = [
    ["可以当作", "行业方向的信号：年轻用户正把 AI 当成找内容的入口，但并不完全信任它。"],
    ["不宜当作", "对“美国人”的精确估计（部分数字其实是六国平均），或“找不到节目导致退订”的因果证据。"],
    ["想更可信", "公布样本来源与抽样方式、加权、回应率、各子组人数和完整问卷。"],
  ];
  verdict.forEach(([k, v], i) => {
    const y = 1.75 + i * 1.2;
    card(s, 0.8, y, 7.2, 1.0, C.accent1, `评价卡${i + 1}`);
    s.addText([
      { text: k + "  ", options: { bold: true, fontSize: 18, color: C.accent6 } },
      { text: v, options: { fontSize: 15, color: C.background1 } },
    ], { x: 1.1, y, w: 6.7, h: 1.0, valign: "middle", margin: 0, isTextBox: true, objectName: `评价${i + 1}` });
  });
  s.addText("报告结论（需要可信的行业数据）正好是 Gracenote 的业务。这是我们细看方法的理由，但不能单凭这一点说数据有误。", { x: 0.8, y: 5.45, w: 7.2, h: 0.9, fontSize: 14, color: C.accent6, valign: "middle", margin: 0, isTextBox: true, objectName: "利益说明" });
  card(s, 8.5, 1.75, 4.0, 4.6, C.background1, "讨论卡");
  s.addText([
    { text: "留给大家的问题", options: { fontSize: 18, bold: true, color: C.accent1, breakLine: true } },
    { text: "如果要验证“找不到节目会导致退订”，你会怎么设计调查？", options: { fontSize: 20, bold: true, color: C.text1, breakLine: true } },
    { text: "提示：对同一批人做追踪调查，除了问“会不会考虑退订”，也记录他们后来是否真的退订。", options: { fontSize: 14, color: C.accent5 } },
  ], { x: 8.8, y: 1.95, w: 3.4, h: 4.2, valign: "middle", margin: 0, paraSpaceAfter: 18, isTextBox: true, objectName: "讨论问题" });
  s.addNotes("总结一下我的评价。这份报告可以当作行业方向的信号：年轻人在把 AI 当成找内容的入口，但并不完全信任它。它不宜被当成对美国人的精确估计，因为有些数字其实是六国平均，也不能证明找不到节目会导致退订。要更可信，需要公布样本来源、加权、回应率和各组人数。另外，报告的结论正好是 Gracenote 自己的业务，这提醒我们细看方法，但不能因此就说数据错。最后留一个问题：如果要验证'找不到节目导致退订'，你会怎么设计调查？谢谢大家。");

  await pres.writeFile({ fileName: OUT });

  // 写入主题配色，并把主题的中文（East Asian）字体设为微软雅黑
  const { applyTheme } = require(process.env.PPTX_SKILL_DIR
    ? path.join(process.env.PPTX_SKILL_DIR, "scripts", "apply_theme.js")
    : "./apply_theme.js");
  await applyTheme(OUT, THEME);
  const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));
  const zip = await JSZip.loadAsync(fs.readFileSync(OUT));
  const part = "ppt/theme/theme1.xml";
  let xml = await zip.file(part).async("string");
  xml = xml.replace(/<a:ea typeface=""\s*\/>/g, '<a:ea typeface="Microsoft YaHei"/>');
  zip.file(part, xml);
  fs.writeFileSync(OUT, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  console.log("written", OUT);
})().catch((e) => { console.error(e); process.exit(1); });
