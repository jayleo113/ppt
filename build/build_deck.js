// 生成《Gracenote 2026 AI 报告评析》课堂汇报 PPT（备注含讲稿；讲稿文件见 make_speech_docx.js）
// 用法：node build/build_deck.js [输出 pptx 路径]
// 依赖：pptxgenjs、jszip（随 pptxgenjs 安装）
//
// 设计：每页一个结论标题 + 一个主要图示 + 至多三行要点；装饰从简，以留白、细线和字号区分层级。
// 配色：深蓝为主，钢蓝标数据，橙色只标问题；字号：标题 28–30，正文 18–20，关键数字 44–60。
const path = require("path");
const fs = require("fs");
const pptxgen = require("pptxgenjs");
const SCRIPT = require("./script.js");

const ROOT = path.join(__dirname, "..");
const OUT = process.argv[2] || path.join(ROOT, "Gracenote报告解读_课堂汇报_最新版.pptx");

const THEME = {
  name: "Navy Brief",
  headFontFace: "Microsoft YaHei",
  bodyFontFace: "Microsoft YaHei",
  colors: {
    dk1: "1F2937", lt1: "FFFFFF", dk2: "1F2A44", lt2: "F4F5F7",
    accent1: "2F6690", accent2: "3A7D44", accent3: "D9542B", accent4: "F2A65A",
    accent5: "6B7280", accent6: "DCE3EC", hlink: "2F6690", folHlink: "6B7280",
  },
};
const H = THEME.colors; // 只接受十六进制的选项（图表、线条）用这里的值
const BAR_GRAY = "C9CED6";
const RULE = "D5DAE1";

// ---------- 动画分组 ----------
// 每页一个数组，数组内每组对象同时淡入，组与组间隔 STEP 毫秒；标题、页码和细线不动
const STEP = 350, FADE = 500;
const seq = (n, f) => Array.from({ length: n }, (_, i) => f(i + 1));
const ANALYSIS = ["事实", "原因", "影响"].map((k) => [`${k}标签`, `${k}内容`]);
const MOTION = [
  [["封面图"], ["封面分隔线", "封面目录"]],
  [...seq(4, (i) => [`选题标签${i}`, `选题内容${i}`]), ["报告封面阴影", "报告封面", "封面图注"], ["报告出处"]],
  [["背景"], ...seq(3, (i) => [`背景卡${i}`, `背景数字${i}`, `背景说明${i}`]), ["背景注"], ...seq(3, (i) => [`问题编号${i}`, `问题名${i}`, `问题内容${i}`]), ["建议说明"]],
  [["说明"]],
  [...seq(2, (i) => [`数据卡${i}`, `数据${i}`, `数据说明${i}`]), ["解释标题", "原因1", "箭头1", "结果1"], ["原因2", "箭头2", "结果2"]],
  [["结论三标题"], ...seq(3, (i) => [`步骤卡${i}`, `步骤名${i}`, `步骤数字${i}`, `步骤说明${i}`]), ["分组线", "结论四标题", "步骤卡4", "步骤名4", "步骤数字4", "步骤说明4"]],
  [[...seq(4, (i) => `总体圈${i}`), ...seq(3, (i) => `总体标签${i}`), "样本标签"], ...ANALYSIS, ["误导示例"]],
  [["原图阴影", "原图", "原图说明", "对比条"], ...ANALYSIS],
  [...seq(2, (i) => [`对比卡${i}`, `对比机构${i}`, `对比数字${i}`, `对比分母${i}`]), ...ANALYSIS],
  [[...seq(4, (i) => `数据类型卡${i}`), ...seq(4, (i) => `数据类型${i}`), ...seq(4, (i) => `数据类型数字${i}`), ...seq(4, (i) => `数据类型说明${i}`)], ...ANALYSIS],
  [...seq(3, (i) => [`判断环节${i}`, `判断标签${i}`, `判断标签文字${i}`]), ["参考价值"], ["改进卡", "改进内容"], ["局限"]],
];

// 生成 <p:timing>：页面出现后自动开始，各组以“与上一动画同时 + 延迟”的方式依次淡入
function timingXml(xml, groups) {
  if (!groups.length) return "";
  const ids = {};
  for (const m of xml.matchAll(/<p:cNvPr id="(\d+)" name="([^"]*)"/g)) (ids[m[2]] = ids[m[2]] || []).push(m[1]);
  const isSp = (id) => new RegExp(`<p:sp><p:nvSpPr><p:cNvPr id="${id}" `).test(xml);
  let ctn = 4;
  const effects = [], built = [];
  groups.forEach((names, g) => {
    for (const name of names) {
      for (const id of ids[name] || []) {
        const a = ctn++, b = ctn++, c = ctn++;
        const dur = name === "封面图" ? 900 : FADE;
        effects.push(
          `<p:par><p:cTn id="${a}" presetID="10" presetClass="entr" presetSubtype="0" fill="hold" grpId="0" nodeType="withEffect">` +
          `<p:stCondLst><p:cond delay="${200 + g * STEP}"/></p:stCondLst><p:childTnLst>` +
          `<p:set><p:cBhvr><p:cTn id="${b}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>` +
          `<p:tgtEl><p:spTgt spid="${id}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>` +
          `<p:to><p:strVal val="visible"/></p:to></p:set>` +
          `<p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="${c}" dur="${dur}"/><p:tgtEl><p:spTgt spid="${id}"/></p:tgtEl></p:cBhvr></p:animEffect>` +
          `</p:childTnLst></p:cTn></p:par>`);
        if (isSp(id)) built.push(`<p:bldP spid="${id}" grpId="0" animBg="1"/>`);
      }
    }
    const missing = names.filter((nm) => !ids[nm] && !/箭头0$/.test(nm));
    if (missing.length) throw new Error(`动画分组找不到对象：${missing.join("、")}`);
  });
  return `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>` +
    `<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>` +
    `<p:par><p:cTn id="3" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst>` +
    `<p:childTnLst><p:par><p:cTn id="${ctn}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>${effects.join("")}</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>` +
    `</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>` +
    `<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>` +
    `</p:childTnLst></p:cTn></p:par></p:tnLst>${built.length ? `<p:bldLst>${built.join("")}</p:bldLst>` : ""}</p:timing>`;
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 in
  pres.title = "AI 时代的电视搜索与内容发现：Gracenote 2026 报告评析";
  pres.subject = "市场调研：方法与实践 课后作业";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;

  // ---------- 版式（无页脚，只保留页码） ----------
  pres.defineSlideMaster({
    title: "TITLE_DARK",
    background: { color: C.text2 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 1.45, w: 5.9, h: 1.75, fontSize: 40, bold: true, color: C.background1, valign: "bottom", align: "left", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.8, y: 3.35, w: 5.9, h: 0.5, fontSize: 18, color: C.accent6, valign: "top", align: "left", margin: 0 }, text: "" } },
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
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.05, fill: { color: fill }, line: { color: fill }, objectName: name || "卡片" });
  const text = (s, t, o) => s.addText(t, Object.assign({ margin: 0, isTextBox: true }, o));
  const rule = (s, x, y, w, color = RULE, name = "分隔线") =>
    s.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color, width: 0.75 }, objectName: name });
  const src = (s, t) => text(s, t, { x: 0.6, y: 6.6, w: 11.3, h: 0.3, fontSize: 11, color: C.accent5, objectName: "来源说明" });
  // 带超链接的出处行：parts 为 [文字] 或 [文字, 链接]
  const srcLink = (s, parts, y = 6.6, name = "来源说明") => text(s, parts.map(([t, url]) => ({ text: t, options: url ? { hyperlink: { url, tooltip: url }, color: C.accent1, underline: { style: "sng" } } : { color: C.accent5 } })),
    { x: 0.6, y, w: 12.1, h: 0.3, fontSize: 11, objectName: name });
  const head = (s, kicker, title, dark) => {
    text(s, kicker, { x: dark ? 0.8 : 0.6, y: dark ? 0.35 : 0.3, w: 8, h: 0.35, fontSize: 14, bold: true, color: dark ? C.accent4 : C.accent3, valign: "middle", objectName: "章节标记" });
    s.addText(title, { placeholder: "title" });
  };
  const arrowR = (s, x, y, h, name = "箭头") => text(s, "→", { x, y, w: 0.3, h, fontSize: 20, color: C.accent5, align: "center", valign: "middle", objectName: name });
  // 图片：白底矩形承托柔和阴影（图片本身不支持阴影）
  const framedImage = (s, file, x, y, w, h, name) => {
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: "FFFFFF" }, line: { color: "E3E7EC", width: 0.5 },
      shadow: { type: "outer", color: "1F2A44", opacity: 0.18, blur: 14, offset: 4, angle: 90 }, objectName: `${name}阴影` });
    s.addImage({ path: path.join(__dirname, "assets", file), x, y, w, h, objectName: name });
  };
  // 评价页右栏：事实 / 原因 / 影响，以细线分行
  function analysis(s, rows) {
    [["事实", C.accent1], ["原因", C.accent5], ["影响", C.accent3]].forEach(([k, col], i) => {
      const y = 1.8 + i * 1.5;
      rule(s, 7.0, y, 5.7);
      text(s, k, { x: 7.0, y: y + 0.15, w: 0.9, h: 1.2, fontSize: 16, bold: true, color: col, valign: "middle", objectName: `${k}标签` });
      text(s, rows[i], { x: 8.0, y: y + 0.15, w: 4.7, h: 1.2, fontSize: 18, color: C.text1, valign: "middle", objectName: `${k}内容` });
    });
    rule(s, 7.0, 6.3, 5.7);
  }
  let n = 0;
  const notes = (s) => s.addNotes(`【约 ${SCRIPT[n].secs} 秒】${SCRIPT[n++].text}`);

  // ======================= 封面 =======================
  pres.addSection({ title: "开场" });
  let s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "开场" });
  s.addImage({ path: path.join(__dirname, "assets", "cover_hero.jpg"), x: 7.0, y: 0, w: 6.333, h: 7.5, objectName: "封面图" });
  text(s, "市场调研：方法与实践 · 课后作业", { x: 0.8, y: 0.95, w: 5.9, h: 0.4, fontSize: 15, color: C.accent4, objectName: "课程名" });
  s.addText("AI 时代的电视搜索\n与内容发现", { placeholder: "title" });
  s.addText("Gracenote（尼尔森旗下）2026 年研究报告评析", { placeholder: "body" });
  text(s, "黄广润　524031910373", { x: 0.8, y: 6.55, w: 5.9, h: 0.4, fontSize: 15, color: C.accent6, objectName: "汇报人" });
  rule(s, 0.8, 4.55, 5.6, "3A4766", "封面分隔线");
  text(s, [
    { text: "01  研究背景与问题　　02  研究方法", options: { breakLine: true } },
    { text: "03  研究结论　　　　　04  思考与评价" },
  ], { x: 0.8, y: 4.8, w: 5.9, h: 1.0, fontSize: 16, color: C.background1, valign: "middle", paraSpaceAfter: 6, objectName: "封面目录" });
  notes(s);

  // ======================= 选题 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "开场" });
  head(s, "选题", "选取对象：Gracenote 2026 年 4 月的报告");
  [
    ["报告", [{ text: "AI 时代的电视搜索与内容发现", options: { fontSize: 22, bold: true, color: C.text2, breakLine: true } }, { text: "TV Search and Discovery in the AI Era，2026 年 4 月", options: { fontSize: 13, color: C.accent5 } }]],
    ["机构", [{ text: "Gracenote，尼尔森旗下公司", options: { fontSize: 20, color: C.text1 } }]],
    ["业务", [{ text: "电视与流媒体的节目数据", options: { fontSize: 20, color: C.text1, breakLine: true } }, { text: "名称、简介、播出平台、节目表", options: { fontSize: 14, color: C.accent5 } }]],
    ["关联", [{ text: "视频软件里的节目指南，背后常常就是这类数据", options: { fontSize: 20, color: C.text1 } }]],
  ].forEach(([k, runs], i) => {
    const y = 1.8 + i * 1.12;
    rule(s, 0.6, y, 7.2);
    text(s, k, { x: 0.6, y, w: 1.0, h: 1.12, fontSize: 15, bold: true, color: C.accent3, valign: "middle", objectName: `选题标签${i + 1}` });
    text(s, runs, { x: 1.7, y, w: 6.1, h: 1.12, valign: "middle", objectName: `选题内容${i + 1}` });
  });
  rule(s, 0.6, 6.28, 7.2);
  framedImage(s, "report_cover.jpg", 8.35, 2.45, 4.35, 2.64, "报告封面");
  text(s, "报告封面", { x: 8.35, y: 5.25, w: 4.35, h: 0.35, fontSize: 13, color: C.accent5, objectName: "封面图注" });
  srcLink(s, [["出处：Gracenote（Nielsen），TV Search and Discovery in the AI Era，2026 年 4 月。　"], ["报告原文（PDF）", "https://s3.amazonaws.com/media.mediapost.com/uploads/GRACENOTE-2026-AI-report.pdf"], ["　｜　"], ["Gracenote 发布页", "https://gracenote.com/newsroom/gen-alpha-leads-shift-to-ai-powered-entertainment-search-discovery-and-recommendations/"]], 6.55, "报告出处");
  notes(s);

  // ======================= 01 背景与问题 =======================
  pres.addSection({ title: "报告介绍" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  head(s, "01  研究背景与问题", "研究背景：节目分散，找节目更费劲");
  text(s, "流媒体平台增多，节目分散；AI 聊天机器人成为新的找节目方式。", { x: 0.6, y: 1.65, w: 12.1, h: 0.5, fontSize: 18, color: C.text1, valign: "middle", objectName: "背景" });
  [["近 350 个", "点播片库"], ["约 180 万个", "节目"], ["近 2,100 个", "免费频道"]].forEach(([num, d], i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 2.3, 3.9, 1.2, C.background2, `背景卡${i + 1}`);
    text(s, num, { x: x + 0.3, y: 2.3, w: 2.3, h: 1.2, fontSize: 24, bold: true, fontFace: "Arial", color: C.accent1, valign: "middle", objectName: `背景数字${i + 1}` });
    text(s, d, { x: x + 2.6, y: 2.3, w: 1.2, h: 1.2, fontSize: 15, color: C.text1, valign: "middle", objectName: `背景说明${i + 1}` });
  });
  text(s, "截至 2026 年 2 月，Gracenote 记录的数量（点播指 SVOD，免费频道指 FAST）", { x: 0.6, y: 3.55, w: 8, h: 0.3, fontSize: 12, color: C.accent5, objectName: "背景注" });
  [["问题一", "使用频率", "各年龄段使用 AI 的频率"], ["问题二", "检索难度", "找节目的难度与退订意向"], ["问题三", "信任程度", "对 AI 回答的信任"]].forEach(([no, k, v], i) => {
    const y = 4.0 + i * 0.62;
    rule(s, 0.6, y, 12.1);
    text(s, no, { x: 0.6, y, w: 1.2, h: 0.62, fontSize: 14, bold: true, color: C.accent5, valign: "middle", objectName: `问题编号${i + 1}` });
    text(s, k, { x: 1.9, y, w: 2.4, h: 0.62, fontSize: 20, bold: true, color: C.text2, valign: "middle", objectName: `问题名${i + 1}` });
    text(s, v, { x: 4.5, y, w: 8.2, h: 0.62, fontSize: 18, color: C.text1, valign: "middle", objectName: `问题内容${i + 1}` });
  });
  rule(s, 0.6, 5.86, 12.1);
  text(s, [
    { text: "留意  ", options: { bold: true, color: C.accent3 } },
    { text: "报告建议 AI 接入行业数据，而提供行业数据正是 Gracenote 的业务。", options: { color: C.text1 } },
  ], { x: 0.6, y: 5.95, w: 12.1, h: 0.6, fontSize: 18, valign: "middle", objectName: "建议说明" });
  notes(s);

  // ======================= 02 研究设计 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  head(s, "02  研究方法", "研究方法：两项线上问卷");
  const th = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text2 }, fontSize: 18 } });
  const tl = (t) => ({ text: t, options: { bold: true, color: C.accent5 } });
  s.addTable([
    [th(""), th("调查一：2026 年 AI 使用调查"), th("调查二：2025 年六国流媒体调查")],
    [tl("调查对象"), "美国 13–79 岁 AI 聊天机器人用户", "六国流媒体用户"],
    [tl("调查时间"), "2026 年 1–2 月", "2025 年 7–8 月"],
    [tl("调查方式"), "线上问卷", "线上问卷"],
    [tl("抽样方式"), { text: "报告未说明", options: { bold: true, color: C.accent3 } }, { text: "报告未说明", options: { bold: true, color: C.accent3 } }],
    [tl("样本量"), "4,003 人", "3,000 人（每国 500）"],
  ], {
    x: 0.6, y: 1.75, w: 12.1, colW: [2.0, 5.05, 5.05], fontSize: 20, color: C.text1, valign: "middle",
    margin: [6, 14, 6, 14], border: [{ type: "none" }, { type: "none" }, { pt: 0.75, color: RULE }, { type: "none" }],
    rowH: [0.75, 0.72, 0.72, 0.72, 0.72, 0.72], fill: { color: C.background1 }, objectName: "研究设计表",
  });
  text(s, [
    { text: "注：", options: { bold: true, color: C.accent3 } },
    { text: "报告另引用尼尔森、皮尤、德勤、普华永道等 11 个外部来源。", options: { color: C.text1 } },
  ], { x: 0.6, y: 6.15, w: 12.1, h: 0.45, fontSize: 18, valign: "middle", objectName: "说明" });
  notes(s);

  // ======================= 03 发现一 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  head(s, "03  研究结论", "结论一、二：年轻人依赖 AI，但信任有限");
  [
    [0.6, "54%", "13–14 岁受访者\n每日使用 AI\n80% 称近 18 个月使用增加"],
    [6.75, "75%", "受访者表示会\n核对 AI 的结果"],
  ].forEach(([x, num, d], i) => {
    card(s, x, 1.8, 5.95, 2.2, C.background2, `数据卡${i + 1}`);
    text(s, num, { x: x + 0.4, y: 1.8, w: 2.6, h: 2.2, fontSize: 60, bold: true, fontFace: "Arial", color: C.accent1, valign: "middle", objectName: `数据${i + 1}` });
    text(s, d.split("\n").map((l, k, arr) => ({ text: l, options: { fontSize: k === 2 ? 14 : 20, color: k === 2 ? C.accent5 : C.text1, breakLine: k < arr.length - 1 } })), { x: x + 3.0, y: 1.8, w: 2.8, h: 2.2, valign: "middle", objectName: `数据说明${i + 1}` });
  });
  text(s, "报告对数据的解释", { x: 0.6, y: 4.35, w: 4, h: 0.4, fontSize: 16, bold: true, color: C.accent5, objectName: "解释标题" });
  [["AI 回答直接、可追问", "使用增加"], ["但是 AI 可能生成错误信息", "需要核对"]].forEach(([cause, effect], i) => {
    const y = 4.85 + i * 0.75;
    rule(s, 0.6, y, 12.1);
    text(s, cause, { x: 0.6, y, w: 6.5, h: 0.75, fontSize: 20, color: C.text1, valign: "middle", objectName: `原因${i + 1}` });
    arrowR(s, 7.2, y, 0.75, `箭头${i + 1}`);
    text(s, effect, { x: 7.7, y, w: 5.0, h: 0.75, fontSize: 20, bold: true, color: C.text2, valign: "middle", objectName: `结果${i + 1}` });
  });
  rule(s, 0.6, 6.35, 12.1);
  notes(s);

  // ======================= 03 结论三、四 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  head(s, "03  研究结论", "结论三、四：难找可能导致退订，AI 应接入行业数据");
  text(s, [{ text: "结论三　", options: { bold: true, color: C.accent3 } }, { text: "内容难找，可能导致退订", options: { bold: true, color: C.text2 } }],
    { x: 0.6, y: 1.7, w: 8.8, h: 0.5, fontSize: 18, valign: "middle", objectName: "结论三标题" });
  text(s, [{ text: "结论四", options: { bold: true, color: C.accent3 } }],
    { x: 9.9, y: 1.7, w: 2.8, h: 0.5, fontSize: 18, valign: "middle", objectName: "结论四标题" });
  [
    ["内容分散", "54%", "联网电视占美国\n电视时长"],
    ["检索耗时", "14 分钟", "平均检索时长"],
    ["退订意向", "54%", "18–34 岁表示\n可能退订"],
    ["AI 应接入行业数据", "约 2/3", "依据：AI 正确回答\n播出平台的比例"],
  ].forEach(([k, num, d], i) => {
    const last = i === 3, x = last ? 9.9 : 0.6 + i * 3.0;
    card(s, x, 2.35, 2.8, 3.6, last ? C.text2 : C.background2, `步骤卡${i + 1}`);
    text(s, k, { x: x + 0.25, y: 2.6, w: 2.45, h: 0.5, fontSize: last ? 17 : 20, bold: true, color: last ? C.background1 : C.text2, objectName: `步骤名${i + 1}` });
    text(s, num, { x: x + 0.3, y: 3.3, w: 2.3, h: 1.1, fontSize: num.length > 4 ? 36 : 44, bold: true, fontFace: "Arial", color: last ? C.accent4 : C.accent1, valign: "middle", objectName: `步骤数字${i + 1}` });
    text(s, d, { x: x + 0.3, y: 4.6, w: 2.3, h: 1.1, fontSize: 16, color: last ? C.accent6 : C.text1, valign: "top", objectName: `步骤说明${i + 1}` });
  });
  s.addShape(pres.shapes.LINE, { x: 9.65, y: 1.75, w: 0, h: 4.2, line: { color: RULE, width: 0.75 }, objectName: "分组线" });
  src(s, "数据：尼尔森收视测量；调查二（六国）；Veed Analytics 测试（报告引用）。");
  notes(s);

  // ======================= 调查对象 =======================
  pres.addSection({ title: "方法评价" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "方法评价" });
  head(s, "04  思考与评价", "调查对象：样本仅为 AI 用户");
  [
    [1.0, 1.7, 4.7, C.background2, "美国人口"],
    [1.45, 2.4, 3.8, C.accent6, "互联网用户"],
    [1.9, 3.1, 2.9, "AFC3D6", "AI 聊天机器人用户"],
    [2.4, 3.8, 1.9, C.text2, ""],
  ].forEach(([x, y, d, fill, label], i) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: C.background1, width: 1.5 }, objectName: `总体圈${i + 1}` });
    if (label) text(s, label, { x, y: y + 0.12, w: d, h: 0.45, fontSize: 14, bold: true, color: C.text2, align: "center", objectName: `总体标签${i + 1}` });
  });
  text(s, [
    { text: "样本", options: { fontSize: 14, color: C.accent6, breakLine: true } },
    { text: "4,003", options: { fontSize: 24, bold: true, fontFace: "Arial", color: C.background1 } },
  ], { x: 2.4, y: 4.15, w: 1.9, h: 1.2, align: "center", valign: "middle", objectName: "样本标签" });
  analysis(s, [
    "受访者 4,003 人，\n均为 AI 聊天机器人用户",
    "以使用 AI 为筛选条件，\n不含非用户",
    "结果仅代表 AI 用户，\n报告却写作“美国消费者”",
  ]);
  text(s, "例：“52% 的美国消费者认为 AI 可能成为最喜欢的娱乐信息来源”——分母实为 AI 用户，易被读成全美国的比例。", { x: 0.6, y: 6.5, w: 12.1, h: 0.4, fontSize: 13, color: C.text2, valign: "middle", objectName: "误导示例" });
  notes(s);

  // ======================= 调查范围 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "方法评价" });
  head(s, "04  思考与评价", "调查范围：“14 分钟”为六国均值");
  framedImage(s, "daily_tv_usage_marked.jpg", 0.6, 1.8, 6.0, 3.49, "原图");
  text(s, "报告原图：橙框为六国均值，与尼尔森美国收视数据并列", { x: 0.6, y: 5.4, w: 6.0, h: 0.35, fontSize: 13, color: C.accent5, objectName: "原图说明" });
  text(s, [
    { text: "美国 ", options: { color: C.text1 } }, { text: "12", options: { bold: true, color: C.accent1 } }, { text: " 分钟     法国 ", options: { color: C.text1 } },
    { text: "26", options: { bold: true, color: C.text2 } }, { text: " 分钟     六国均值 ", options: { color: C.text1 } },
    { text: "14", options: { bold: true, color: C.accent3 } }, { text: " 分钟", options: { color: C.text1 } },
  ], { x: 0.6, y: 5.8, w: 6.0, h: 0.5, fontSize: 18, valign: "middle", objectName: "对比条" });
  analysis(s, [
    "六国均值被置于\n美国收视图表中",
    "六国等权平均，\n法国 26 分钟抬高均值",
    "美国实际为 12 分钟，\n易被高估",
  ]);
  srcLink(s, [["来源：Gracenote 2025 年报告《State of Play》分国家数据（每国 500 人）。　"], ["原文（PDF）", "https://s3.amazonaws.com/media.mediapost.com/uploads/gracenote-2025-state-of-play.pdf"]]);
  notes(s);

  // ======================= 调查时间 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "方法评价" });
  head(s, "04  思考与评价", "调查时间：比较基准不一致");
  [
    [1.8, "皮尤研究中心 · 2025 年秋", "概率样本，1,458 名美国 13–17 岁青少年", "24%", "全体 13–14 岁青少年", C.accent5],
    [4.15, "本报告 · 2026 年初", "线上问卷，4,003 名美国 AI 用户", "54%", "13–14 岁 AI 用户", C.accent1],
  ].forEach(([y, who, how, num, base, col], i) => {
    card(s, 0.6, y, 6.0, 2.1, C.background2, `对比卡${i + 1}`);
    text(s, [{ text: who, options: { fontSize: 16, bold: true, color: col, breakLine: true } }, { text: how, options: { fontSize: 12, color: C.accent5 } }], { x: 0.95, y: y + 0.15, w: 5.4, h: 0.65, valign: "top", objectName: `对比机构${i + 1}` });
    text(s, num, { x: 0.95, y: y + 0.8, w: 2.4, h: 1.15, fontSize: 52, bold: true, fontFace: "Arial", color: col, valign: "middle", objectName: `对比数字${i + 1}` });
    text(s, [
      { text: "分母", options: { fontSize: 14, color: C.accent5, breakLine: true } },
      { text: base, options: { fontSize: 18, bold: true, color: C.text1 } },
    ], { x: 3.4, y: y + 0.8, w: 3.0, h: 1.15, valign: "middle", objectName: `对比分母${i + 1}` });
  });
  analysis(s, [
    "以皮尤 30% 对比本报告 54%，\n称使用正在加速",
    "皮尤为全体青少年，\n本报告仅为 AI 用户",
    "统一分母后仍差约 10 个百分点，\n还不能判断“加速”",
  ]);
  srcLink(s, [["来源：皮尤《Teens, Social Media and AI Chatbots 2025》数据表（使用者中每日使用 44%）。　"], ["原文", "https://www.pewresearch.org/internet/2025/12/09/teens-social-media-and-ai-chatbots-2025/"]]);
  notes(s);

  // ======================= 研究方法 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "方法评价" });
  head(s, "04  思考与评价", "研究方法：因果关系未经检验");
  [["意向 · 问卷", "54%", "18–34 岁称可能退订"], ["行为 · 退订率", "5.5%", "行业月流失率（转述）"], ["预测 · 普华永道", "3,185 亿美元", "2029 年全球市场支出"], ["测试 · AI 答题", "约 2/3", "AI 正确回答播出平台"]].forEach(([k, num, d], i) => {
    const x = 0.6 + (i % 2) * 3.1, y = 1.8 + Math.floor(i / 2) * 2.3;
    card(s, x, y, 2.9, 2.1, C.background2, `数据类型卡${i + 1}`);
    text(s, k, { x: x + 0.3, y: y + 0.25, w: 2.4, h: 0.4, fontSize: 16, bold: true, color: C.accent5, objectName: `数据类型${i + 1}` });
    text(s, d, { x: x + 0.3, y: y + 1.55, w: 2.5, h: 0.4, fontSize: 13, color: C.text1, objectName: `数据类型说明${i + 1}` });
    text(s, num, { x: x + 0.3, y: y + 0.65, w: 2.5, h: 0.9, fontSize: num.length > 5 ? 26 : 36, bold: true, fontFace: "Arial", color: C.text2, valign: "middle", objectName: `数据类型数字${i + 1}` });
  });
  analysis(s, [
    "退订意向、退订率、预测与\n测试数据并列使用",
    "数据性质不一，\n无追踪、无对照",
    "只能说明同时存在，\n不足以证明因果",
  ]);
  src(s, "来源：Gracenote 报告；普华永道、Veed Analytics 原文；Fabric 数据经 Broadband TV News 转述。");
  notes(s);

  // ======================= 05 总结 =======================
  pres.addSection({ title: "总结" });
  s = pres.addSlide({ masterName: "SECTION_DARK", sectionTitle: "总结" });
  head(s, "05  总结", "有参考价值，但结论超出样本所能支持的范围", true);
  [
    ["① 年轻人依赖 AI", "仅限 AI 用户", C.accent1],
    ["② 信任有限", "仅限 AI 用户", C.accent1],
    ["③ 难找导致退订", "只能说相关", C.accent3],
  ].forEach(([k, tag, col], i) => {
    const y = 1.75 + i * 1.2;
    rule(s, 0.8, y, 7.3, "3A4766", "结论分隔线");
    text(s, k, { x: 0.8, y, w: 5.2, h: 1.2, fontSize: 20, bold: true, color: C.background1, valign: "middle", objectName: `判断环节${i + 1}` });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.1, y: y + 0.36, w: 2.0, h: 0.47, rectRadius: 0.05, fill: { color: col }, line: { color: col }, objectName: `判断标签${i + 1}` });
    text(s, tag, { x: 6.1, y: y + 0.36, w: 2.0, h: 0.47, fontSize: 15, bold: true, color: C.background1, align: "center", valign: "middle", objectName: `判断标签文字${i + 1}` });
  });
  rule(s, 0.8, 5.35, 7.3, "3A4766", "结论分隔线");
  text(s, "皮尤、Veed 等独立来源也指向同样两个方向：年轻人更多用 AI 找内容，AI 回答“在哪看”不够可靠。", { x: 0.8, y: 5.45, w: 7.3, h: 0.8, fontSize: 16, color: C.accent6, valign: "middle", objectName: "参考价值" });
  card(s, 8.45, 1.75, 4.1, 4.5, C.background1, "改进卡");
  text(s, [
    { text: "改进方向", options: { fontSize: 15, bold: true, color: C.accent3, breakLine: true } },
    { text: "采用概率样本，含非 AI 用户", options: { fontSize: 17, bold: true, color: C.text2, breakLine: true } },
    { text: "同一问卷问困难与退订，追踪同一批人", options: { fontSize: 17, bold: true, color: C.text2, breakLine: true } },
    { text: "公开招募、配额、加权、回收率", options: { fontSize: 17, bold: true, color: C.text2 } },
  ], { x: 8.75, y: 1.95, w: 3.6, h: 4.1, valign: "middle", paraSpaceAfter: 14, objectName: "改进内容" });
  text(s, "局限：评价依据公开资料；个别来源只有媒体转述，如 Fabric 的流失率。", { x: 0.8, y: 6.5, w: 11.7, h: 0.4, fontSize: 13, color: C.accent6, valign: "middle", objectName: "局限" });
  notes(s);

  await pres.writeFile({ fileName: OUT });

  // 写入主题配色，并把主题的中文（East Asian）字体设为微软雅黑
  const { applyTheme } = require("./apply_theme.js");
  await applyTheme(OUT, THEME);
  const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));
  const zip = await JSZip.loadAsync(fs.readFileSync(OUT));
  const part = "ppt/theme/theme1.xml";
  zip.file(part, (await zip.file(part).async("string")).replace(/<a:ea typeface=""\s*\/>/g, '<a:ea typeface="Microsoft YaHei"/>'));

  // 动画：全部页面淡入切换；正讲页的内容按阅读顺序自动依次淡入（无需点击）
  for (let i = 1; zip.file(`ppt/slides/slide${i}.xml`); i++) {
    const f = `ppt/slides/slide${i}.xml`;
    let xml = await zip.file(f).async("string");
    xml = xml.replace("</p:clrMapOvr>", `</p:clrMapOvr><p:transition spd="med"><p:fade/></p:transition>${timingXml(xml, MOTION[i - 1] || [])}`);
    zip.file(f, xml);
  }
  fs.writeFileSync(OUT, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));

  const total = SCRIPT.reduce((t, x) => t + x.secs, 0);
  console.log("written", OUT, "| script", `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`);
})().catch((e) => { console.error(e); process.exit(1); });
