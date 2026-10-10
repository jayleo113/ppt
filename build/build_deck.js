// 生成《Gracenote 2026 AI 报告评析》4–5 分钟课堂汇报 PPT 与讲稿
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
const OUT = process.argv[2] || path.join(ROOT, "Gracenote报告解读_课堂汇报.pptx");
const SCRIPT_MD = path.join(ROOT, "讲稿_4-5分钟.md");

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
  [["封面图"], ["封面分隔线", "封面数字", "封面问题"]],
  [...seq(5, (i) => [`序号${i}`, `框架名${i}`]), ["结论卡", "结论"]],
  [["背景"], ...seq(3, (i) => [`问题编号${i}`, `问题名${i}`, `问题内容${i}`]), ["报告封面阴影", "报告封面", "封面图注"], ["研究机构"]],
  [["说明"]],
  [...seq(2, (i) => [`数据卡${i}`, `数据${i}`, `数据说明${i}`]), ["解释标题", "原因1", "箭头1", "结果1"], ["原因2", "箭头2", "结果2"]],
  seq(4, (i) => [`步骤卡${i}`, `步骤名${i}`, `步骤数字${i}`, `步骤说明${i}`, `链箭头${i - 1}`]),
  [...seq(4, (i) => [`环节${i}`, `环节文字${i}`, `环节箭头${i - 1}`, `检验标签${i}`, `检验文字${i}`]), ["评价说明"]],
  [[...seq(4, (i) => `总体圈${i}`), ...seq(3, (i) => `总体标签${i}`), "样本标签"], ...ANALYSIS],
  [["原图阴影", "原图", "原图说明", "对比条"], ...ANALYSIS],
  [...seq(2, (i) => [`对比卡${i}`, `对比机构${i}`, `对比数字${i}`, `对比分母${i}`]), ...ANALYSIS],
  [[...seq(4, (i) => `数据类型卡${i}`), ...seq(4, (i) => `数据类型${i}`), ...seq(4, (i) => `数据类型数字${i}`)], ...ANALYSIS],
  [...seq(4, (i) => [`判断环节${i}`, `判断标签${i}`, `判断标签文字${i}`]), ["讨论卡", "讨论问题"], ["可取之处"]],
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
  rule(s, 0.8, 4.55, 5.6, "3A4766", "封面分隔线");
  text(s, "54%", { x: 0.8, y: 4.75, w: 2.0, h: 1.0, fontSize: 48, bold: true, fontFace: "Arial", color: C.accent4, valign: "middle", objectName: "封面数字" });
  text(s, [
    { text: "13–14 岁受访者每日使用 AI", options: { color: C.background1, breakLine: true } },
    { text: "该比例来自哪类样本？", options: { color: C.accent6 } },
  ], { x: 2.9, y: 4.75, w: 3.6, h: 1.0, fontSize: 16, valign: "middle", paraSpaceAfter: 4, objectName: "封面问题" });
  notes(s);

  // ======================= 汇报框架 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "开场" });
  head(s, "汇报框架", "报告结论的适用范围小于其表述");
  ["研究背景与问题", "研究方法", "研究结论", "思考与评价", "总体判断"].forEach((t, i) => {
    const y = 1.8 + i * 0.9, focus = i === 3;
    rule(s, 0.6, y, 6.0);
    text(s, `0${i + 1}`, { x: 0.6, y, w: 0.9, h: 0.9, fontSize: 20, bold: true, fontFace: "Arial", color: focus ? C.accent3 : C.accent5, valign: "middle", objectName: `序号${i + 1}` });
    text(s, t, { x: 1.5, y, w: 5.0, h: 0.9, fontSize: 20, bold: focus, color: C.text2, valign: "middle", objectName: `框架名${i + 1}` });
  });
  rule(s, 0.6, 6.3, 6.0);
  card(s, 7.2, 1.8, 5.5, 4.5, C.text2, "结论卡");
  text(s, [
    { text: "结论", options: { fontSize: 15, bold: true, color: C.accent4, breakLine: true } },
    { text: "报告反映了 AI 用户的变化，具有参考价值；但样本仅限 AI 用户，结论不宜推及美国整体人群。", options: { fontSize: 22, bold: true, color: C.background1 } },
  ], { x: 7.6, y: 2.0, w: 4.7, h: 4.1, valign: "middle", paraSpaceAfter: 16, objectName: "结论" });
  notes(s);

  // ======================= 01 背景与问题 =======================
  pres.addSection({ title: "报告介绍" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  head(s, "01  研究背景与问题", "研究问题：AI 如何改变节目检索");
  text(s, "背景：流媒体平台增多，节目分散，检索成本上升；AI 聊天机器人成为新的检索工具。", { x: 0.6, y: 1.7, w: 7.2, h: 0.8, fontSize: 18, color: C.text1, valign: "middle", objectName: "背景" });
  [["问题一", "使用频率", "各年龄层 AI 使用频率"], ["问题二", "检索难度", "检索耗时与退订意向"], ["问题三", "信任程度", "对 AI 回答的核查"]].forEach(([no, k, v], i) => {
    const y = 2.75 + i * 0.85;
    rule(s, 0.6, y, 7.2);
    text(s, no, { x: 0.6, y, w: 1.0, h: 0.85, fontSize: 14, bold: true, color: C.accent5, valign: "middle", objectName: `问题编号${i + 1}` });
    text(s, k, { x: 1.65, y, w: 2.2, h: 0.85, fontSize: 21, bold: true, color: C.text2, valign: "middle", objectName: `问题名${i + 1}` });
    text(s, v, { x: 3.95, y, w: 3.85, h: 0.85, fontSize: 18, color: C.text1, valign: "middle", objectName: `问题内容${i + 1}` });
  });
  rule(s, 0.6, 5.3, 7.2);
  text(s, [
    { text: "研究机构  ", options: { bold: true, color: C.accent3 } },
    { text: "Gracenote，尼尔森旗下节目数据公司。报告建议接入的行业数据，即其主营业务。", options: { color: C.text1 } },
  ], { x: 0.6, y: 5.45, w: 7.2, h: 0.85, fontSize: 17, valign: "middle", objectName: "研究机构" });
  framedImage(s, "report_cover.jpg", 8.35, 2.75, 4.35, 2.64, "报告封面");
  text(s, "报告封面 · Gracenote，2026 年 4 月", { x: 8.35, y: 5.55, w: 4.35, h: 0.35, fontSize: 13, color: C.accent5, objectName: "封面图注" });
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
    { text: "报告另引用 11 个外部来源，其方法披露情况见附录一。", options: { color: C.text1 } },
  ], { x: 0.6, y: 6.15, w: 12.1, h: 0.45, fontSize: 18, valign: "middle", objectName: "说明" });
  notes(s);

  // ======================= 03 发现一 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  head(s, "03  研究结论", "结论一：AI 使用普遍，信任有限");
  [
    [0.6, "54%", "13–14 岁 AI 用户\n每日使用"],
    [6.75, "75%", "受访者\n核对 AI 回答"],
  ].forEach(([x, num, d], i) => {
    card(s, x, 1.8, 5.95, 2.2, C.background2, `数据卡${i + 1}`);
    text(s, num, { x: x + 0.4, y: 1.8, w: 2.6, h: 2.2, fontSize: 60, bold: true, fontFace: "Arial", color: C.accent1, valign: "middle", objectName: `数据${i + 1}` });
    text(s, d, { x: x + 3.0, y: 1.8, w: 2.8, h: 2.2, fontSize: 20, color: C.text1, valign: "middle", objectName: `数据说明${i + 1}` });
  });
  text(s, "报告的解释", { x: 0.6, y: 4.35, w: 4, h: 0.4, fontSize: 16, bold: true, color: C.accent5, objectName: "解释标题" });
  [["回答直接、可追问", "使用增加"], ["可能生成错误信息", "需要核对"]].forEach(([cause, effect], i) => {
    const y = 4.85 + i * 0.75;
    rule(s, 0.6, y, 12.1);
    text(s, cause, { x: 0.6, y, w: 6.5, h: 0.75, fontSize: 20, color: C.text1, valign: "middle", objectName: `原因${i + 1}` });
    arrowR(s, 7.2, y, 0.75, `箭头${i + 1}`);
    text(s, effect, { x: 7.7, y, w: 5.0, h: 0.75, fontSize: 20, bold: true, color: C.text2, valign: "middle", objectName: `结果${i + 1}` });
  });
  rule(s, 0.6, 6.35, 12.1);
  notes(s);

  // ======================= 03 发现二 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "报告介绍" });
  head(s, "03  研究结论", "结论二：检索困难与退订风险");
  [
    ["内容分散", "54%", "联网电视占美国\n电视时长"],
    ["检索耗时", "14 分钟", "平均检索时长"],
    ["退订意向", "54%", "18–34 岁表示\n可能退订"],
    ["接入行业数据", "约 2/3", "AI 正确回答\n播出平台的比例"],
  ].forEach(([k, num, d], i) => {
    const x = 0.6 + i * 3.1, last = i === 3;
    card(s, x, 1.85, 2.8, 4.1, last ? C.text2 : C.background2, `步骤卡${i + 1}`);
    text(s, k, { x: x + 0.3, y: 2.1, w: 2.3, h: 0.5, fontSize: 20, bold: true, color: last ? C.background1 : C.text2, objectName: `步骤名${i + 1}` });
    text(s, num, { x: x + 0.3, y: 3.0, w: 2.3, h: 1.1, fontSize: num.length > 4 ? 36 : 44, bold: true, fontFace: "Arial", color: last ? C.accent4 : C.accent1, valign: "middle", objectName: `步骤数字${i + 1}` });
    text(s, d, { x: x + 0.3, y: 4.3, w: 2.3, h: 1.2, fontSize: 16, color: last ? C.accent6 : C.text1, valign: "top", objectName: `步骤说明${i + 1}` });
    if (!last) arrowR(s, x + 2.8, 1.85, 4.1, `链箭头${i + 1}`);
  });
  src(s, "数据：尼尔森收视测量；调查二（六国）；Veed Analytics 测试（报告引用）。");
  notes(s);

  // ======================= 04 评价思路 =======================
  pres.addSection({ title: "方法评价" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "方法评价" });
  head(s, "04  思考与评价", "评价：逐项检验四个推论环节");
  [
    ["① 依赖 AI", "调查对象\n调查时间"],
    ["② 信任不足", "调查对象"],
    ["③ 难找导致退订", "调查范围\n研究方法"],
    ["④ 接入行业数据", "研究方法"],
  ].forEach(([k, dims], i) => {
    const x = 0.6 + i * 3.1;
    card(s, x, 1.8, 2.8, 0.95, C.text2, `环节${i + 1}`);
    text(s, k, { x, y: 1.8, w: 2.8, h: 0.95, fontSize: 19, bold: true, color: C.background1, align: "center", valign: "middle", objectName: `环节文字${i + 1}` });
    if (i < 3) arrowR(s, x + 2.8, 1.8, 0.95, `环节箭头${i + 1}`);
    text(s, "检验", { x, y: 3.0, w: 2.8, h: 0.35, fontSize: 13, color: C.accent5, align: "center", objectName: `检验标签${i + 1}` });
    rule(s, x, 3.4, 2.8);
    text(s, dims, { x, y: 3.5, w: 2.8, h: 1.3, fontSize: 20, bold: true, color: C.accent1, align: "center", valign: "middle", objectName: `检验文字${i + 1}` });
    rule(s, x, 4.9, 2.8);
  });
  text(s, "调查对象、范围、时间与方法的差异均会影响结果，以下逐项检验。", { x: 0.6, y: 5.5, w: 12.1, h: 0.6, fontSize: 18, color: C.text1, valign: "middle", objectName: "评价说明" });
  notes(s);

  // ======================= 调查对象 =======================
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
    "结果仅代表 AI 用户，\n不能推及全体美国人",
  ]);
  src(s, "来源：Gracenote 报告；尼尔森新闻稿。");
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
  src(s, "来源：Gracenote 2025 年报告《State of Play》分国家数据（每国 500 人）。");
  notes(s);

  // ======================= 调查时间 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "方法评价" });
  head(s, "04  思考与评价", "调查时间：比较基准不一致");
  [
    [1.8, "皮尤研究中心 · 2025 年秋", "24%", "全体 13–14 岁青少年", C.accent5],
    [4.15, "本报告 · 2026 年初", "54%", "13–14 岁 AI 用户", C.accent1],
  ].forEach(([y, who, num, base, col], i) => {
    card(s, 0.6, y, 6.0, 2.1, C.background2, `对比卡${i + 1}`);
    text(s, who, { x: 0.95, y: y + 0.2, w: 5.4, h: 0.4, fontSize: 16, bold: true, color: col, objectName: `对比机构${i + 1}` });
    text(s, num, { x: 0.95, y: y + 0.65, w: 2.4, h: 1.25, fontSize: 56, bold: true, fontFace: "Arial", color: col, valign: "middle", objectName: `对比数字${i + 1}` });
    text(s, [
      { text: "分母", options: { fontSize: 14, color: C.accent5, breakLine: true } },
      { text: base, options: { fontSize: 18, bold: true, color: C.text1 } },
    ], { x: 3.4, y: y + 0.65, w: 3.0, h: 1.25, valign: "middle", objectName: `对比分母${i + 1}` });
  });
  analysis(s, [
    "以皮尤 30% 对比本报告 54%，\n称使用正在加速",
    "皮尤为全体青少年，\n本报告仅为 AI 用户",
    "统一分母后差距约 10 个百分点，\n“加速”不成立",
  ]);
  src(s, "来源：皮尤《Teens, Social Media and AI Chatbots 2025》数据表（使用者中每日使用 44%）。");
  notes(s);

  // ======================= 研究方法 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "方法评价" });
  head(s, "04  思考与评价", "研究方法：因果关系未经检验");
  [["意向 · 问卷", "54%"], ["行为 · 退订率", "5.5%"], ["预测 · 普华永道", "3,185 亿美元"], ["测试 · AI 答题", "约 2/3"]].forEach(([k, num], i) => {
    const x = 0.6 + (i % 2) * 3.1, y = 1.8 + Math.floor(i / 2) * 2.3;
    card(s, x, y, 2.9, 2.1, C.background2, `数据类型卡${i + 1}`);
    text(s, k, { x: x + 0.3, y: y + 0.25, w: 2.4, h: 0.4, fontSize: 16, bold: true, color: C.accent5, objectName: `数据类型${i + 1}` });
    text(s, num, { x: x + 0.3, y: y + 0.75, w: 2.5, h: 1.05, fontSize: num.length > 5 ? 26 : 38, bold: true, fontFace: "Arial", color: C.text2, valign: "middle", objectName: `数据类型数字${i + 1}` });
  });
  analysis(s, [
    "退订意向、退订率、预测与\n测试数据并列使用",
    "数据性质不一，\n且无追踪设计",
    "仅能说明相关，\n不能证明因果",
  ]);
  src(s, "来源：Gracenote 报告；普华永道、Veed Analytics 原文；Fabric 数据经 Broadband TV News 转述。");
  notes(s);

  // ======================= 05 结论 =======================
  pres.addSection({ title: "结论" });
  s = pres.addSlide({ masterName: "SECTION_DARK", sectionTitle: "结论" });
  head(s, "05  总体判断", "结论适用于 AI 用户，不宜外推", true);
  [
    ["① 依赖 AI", "部分成立", C.accent1],
    ["② 信任不足", "部分成立", C.accent1],
    ["③ 难找导致退订", "证据不足", C.accent3],
    ["④ 接入行业数据", "未经检验", C.accent5],
  ].forEach(([k, tag, col], i) => {
    const y = 1.95 + i * 0.95;
    rule(s, 0.8, y, 7.3, "3A4766", "结论分隔线");
    text(s, k, { x: 0.8, y, w: 4.8, h: 0.95, fontSize: 20, bold: true, color: C.background1, valign: "middle", objectName: `判断环节${i + 1}` });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.35, y: y + 0.24, w: 1.75, h: 0.47, rectRadius: 0.05, fill: { color: col }, line: { color: col }, objectName: `判断标签${i + 1}` });
    text(s, tag, { x: 6.35, y: y + 0.24, w: 1.75, h: 0.47, fontSize: 15, bold: true, color: C.background1, align: "center", valign: "middle", objectName: `判断标签文字${i + 1}` });
  });
  rule(s, 0.8, 5.75, 7.3, "3A4766", "结论分隔线");
  text(s, "报告公开了样本量、调查时间与年龄范围，数据可复核。", { x: 0.8, y: 5.95, w: 11.7, h: 0.45, fontSize: 16, color: C.accent6, valign: "middle", objectName: "可取之处" });
  card(s, 8.7, 1.95, 3.85, 3.8, C.background1, "讨论卡");
  text(s, [
    { text: "讨论", options: { fontSize: 15, bold: true, color: C.accent3, breakLine: true } },
    { text: "如何设计调查，\n检验检索困难与\n退订的因果关系？", options: { fontSize: 22, bold: true, color: C.text2 } },
  ], { x: 9.05, y: 2.1, w: 3.2, h: 3.5, valign: "middle", paraSpaceAfter: 14, objectName: "讨论问题" });
  notes(s);

  // ======================= 附录一 =======================
  pres.addSection({ title: "附录（备问）" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "附录（备问）" });
  head(s, "附录（备问）", "附录一：数据来源的方法披露");
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
  s.addNotes("备问用，不计入汇报时间。被问及数据来源与方法披露时使用。");

  // ======================= 附录二 =======================
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "附录（备问）" });
  head(s, "附录（备问）", "附录二：引用与原始来源比对");
  const hd = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text2 } } });
  s.addTable([
    [hd("报告表述"), hd("原始来源")],
    ["皮尤：30% 的青少年每日使用", "精确值 28%；13–14 岁为 24%"],
    ["南加州大学：“高达 38%”数据有偏差", "仅为单一知识库、单一自动指标的结果"],
    ["德勤：41% 的“订户”认为不值", "原文分母为全体消费者"],
    ["普华永道：2029 年支出 3,185 亿美元", "全球数据，非美国"],
    ["摘要：54% 的 18–34 岁“会取消”", "原题为“可能取消”，且为六国数据"],
    ["“26% 的美国人找不到想看的”", "未找到出处"],
  ], {
    x: 0.6, y: 1.7, w: 12.1, colW: [5.6, 6.5], fontSize: 16, color: C.text1, valign: "middle",
    margin: [4, 12, 4, 12], border: [{ type: "none" }, { type: "none" }, { pt: 0.75, color: RULE }, { type: "none" }],
    rowH: [0.55, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62], fill: { color: C.background1 }, objectName: "引用比对表",
  });
  src(s, "来源：Gracenote 报告；皮尤、南加州大学、德勤、普华永道原文。");
  s.addNotes("备问用，不计入汇报时间。被问及引用数据是否准确时使用。");

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

  // 讲稿 Markdown
  const total = SCRIPT.reduce((a, x) => a + x.secs, 0);
  const chars = SCRIPT.reduce((a, x) => a + x.chars, 0);
  const mmss = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
  let acc = 0;
  const md = [
    "# 讲稿：Gracenote 2026 AI 报告评析（4–5 分钟）",
    "",
    `正讲 ${SCRIPT.length} 页，计划用时约 ${mmss(total)}，全文约 ${chars} 字（按每分钟约 240 字的中速朗读）。附录两页不讲，用于回答提问。`,
    "",
    "## 汇报主线",
    "",
    "**结论：** 报告反映了 AI 用户的变化，具有参考价值；但样本仅限 AI 用户，结论不宜推及美国整体人群。",
    "",
    "**报告的推论：** ① 年轻人依赖 AI → ② 信任不足 → ③ 检索困难导致退订 → ④ AI 应接入行业数据。",
    "",
    "| 环节 | 检验方面 | 判断 |",
    "|---|---|---|",
    "| ① 依赖 AI | 调查对象；调查时间 | 部分成立：仅适用于 AI 用户，“加速”不成立 |",
    "| ② 信任不足 | 调查对象 | 部分成立：仅适用于 AI 用户 |",
    "| ③ 难找导致退订 | 调查范围；研究方法 | 证据不足：使用六国数据，仅能说明相关 |",
    "| ④ 接入行业数据 | 研究方法 | 未经检验 |",
    "",
    "**讲法：** 每页先陈述标题，再结合图表或数字说明；页面只列要点，细节口头补充。",
    "",
    "## 时间分配",
    "",
    "| 页 | 内容 | 用时 | 累计 |",
    "|---|---|---|---|",
    ...SCRIPT.map((x, i) => { acc += x.secs; return `| ${i + 1} | ${x.title} | ${x.secs} 秒 | ${mmss(acc)} |`; }),
    "",
    "如需压缩时间：第 3 页可略去最后一句；第 10 页可略去最后一句。",
    "",
    "## 逐页讲稿",
    "",
    ...SCRIPT.flatMap((x, i) => [`### 第 ${i + 1} 页｜${x.title}（约 ${x.secs} 秒，${x.chars} 字）`, "", x.text, ""]),
    "## 可能的提问与回答要点",
    "",
    "**问：样本不能代表美国人群，报告是否还有价值？**  ",
    "答：有。报告对 AI 用户的描述可作参考，且与皮尤等独立调查的方向一致。问题在于引用时应限定为 AI 用户，不宜表述为美国人整体。",
    "",
    "**问：六国均值的问题是否只是表述不严谨？**  ",
    "答：可能如此，评析并未质疑数据真实性。但该数值置于美国收视图表中，读者会误以为美国平均检索时长为 14 分钟，而原始数据中美国为 12 分钟。",
    "",
    "**问：数据来源如何核对？**  ",
    "答：对照了报告原文、Gracenote 2025 年报告，以及皮尤、德勤、普华永道和南加州大学论文的原文，逐一记录 11 个来源的方法披露情况（见附录）。",
    "",
  ].join("\n");
  fs.writeFileSync(SCRIPT_MD, md);
  console.log("written", OUT, "| script", mmss(total), chars, "chars");
})().catch((e) => { console.error(e); process.exit(1); });
