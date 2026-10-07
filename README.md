# Gracenote 2026 AI 报告解读｜课堂分享 PPT

《市场调研：方法与实践》课后作业：介绍并评价一份国际市场调研机构的最新报告。

- **`Gracenote_AI报告解读_课堂分享.pptx`**：14 页中文分享稿（16:9），每页备注里有讲稿。
- **`build/build_deck.js`**：生成这份 PPT 的脚本，改内容后可重新生成。

## 报告
Gracenote（尼尔森旗下），*TV Search and Discovery in the AI Era*，2026 年。

## 结构
1. 开场
2–3. 报告介绍：机构、研究问题、研究方法（对象 / 时间 / 抽样 / 样本量）
4–6. 主要发现（含两张原生图表）
7. 评价框架：用课上春晚满意度案例的四个角度（调查对象、研究总体、研究方法、调查时间）
8–12. 五个局限：样本代表谁、子组样本、Pew 与 Gracenote 不可直接比较、意向 / 行为 / 预测 / 测试混用、引用口径
13. 优点与数字复算
14. 结论与课堂讨论问题

时间紧时可跳过第 6、12、13 页。

## 重新生成
```bash
npm install pptxgenjs react-icons react react-dom sharp
node build/build_deck.js 输出.pptx
```
