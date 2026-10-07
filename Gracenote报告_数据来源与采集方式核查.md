# Gracenote《TV Search and Discovery in the AI Era》：数据来源与采集方式核查（第二轮）

核查日期：2026-10-07。报告页码按 PDF 印刷页码。

## 核实方式说明

核查分两轮进行：

- **第一轮：** 本环境网络受限，只能直接读取 Gracenote 2026 报告和 2025《State of Play》两份 PDF，其余来源靠搜索引擎摘录核实。
- **第二轮：** 用户另请一个能访问原始网站的模型逐条打开原文核对。原则是：以原始网页、官方 PDF 和论文原文为准，二手媒体只用来定位原文。下文已据此修正。

| 标记 | 含义 |
|---|---|
| **〔原文〕** | 本环境直接读取的原始文件 |
| **〔原文·外核〕** | 第二轮外部核对确认了原始网页、PDF 或论文原文 |
| **〔转述〕** | 只找到媒体转述，没找到发布方原文 |
| **〔未找到〕** | 两轮都没找到 |

---

## 一、总览：11 个数据来源

| # | 来源 | 数据性质 | 采集方式 | 方法公开程度 |
|---|---|---|---|---|
| 1 | Gracenote 2026 生成式 AI 使用调查 | 消费者问卷 | 线上问卷，美国 13–79 岁 AI 聊天机器人用户，N = 4,003，2026.1.23–2.4 | **关键信息未公开**：样本库、抽样、配额、加权、回应率、各组人数、未成年人同意程序 |
| 2 | Gracenote 2025 流媒体消费者调查 | 消费者问卷 | 线上问卷，6 国各 500 人，共 3,000 人，2025.7.28–8.1 | **关键信息未公开**：同上 |
| 3 | Nielsen NPOWER / Media Impact | 收视测量 | 约 4.2 万户人员测量仪样本 + 约 4,500 万户机顶盒和智能电视数据 | 方法公开，报告图旁未注明 |
| 4 | Nielsen Streaming Content Ratings | 收视测量 | 全国样本中装有流媒体测量仪的电视家庭子样本，只测电视屏幕 | 方法公开；当前样本户数未找到 |
| 5 | Gracenote 节目数据库 / Studio System / Data Hub | 商业元数据 | 公司自有目录数据，非抽样 | 采集与核验流程未公开 |
| 6 | Pew Research Center 青少年调查 | 消费者问卷 | 概率样本库 KnowledgePanel，N = 1,458，加权，误差 ±3.3 | 完整公开（含题目原文与分组数据） |
| 7 | Deloitte 2025 Digital Media Trends | 消费者问卷 | 线上问卷，美国 14 岁以上 3,595 人，2024 年 10 月，按人口普查加权 | 基本公开（执行公司未具名） |
| 8 | PwC 全球娱乐与媒体展望 | 市场预测 | 公开数据 + 行业访谈 + 统计建模，全球市场 | 方法框架公开，模型细节不公开 |
| 9 | Veed Analytics 聊天机器人测试 | 机器表现测试 | 6 国、独播剧、每题问 3 次 | 题量、日期、模型版本、评分程序未公开 |
| 10 | USC 常识知识库偏差研究 | 学术论文 | 自动分类器判定 + 众包抽样人工验证 | 完整公开（同行评审论文） |
| 11 | Fabric（经 Broadband TV News 转述）流失率 | 行业指标 | Fabric 自述为自动抓取 + 人工核验 | 5.5% 与 2% 在 Fabric 原页未找到；定义未公开 |

**结论：** 报告最核心的两份 Gracenote 自有问卷，恰恰是方法最不透明的两项。

---

## 二、逐项核查

### 1. Gracenote 2026 生成式 AI 使用调查（报告的核心数据）

**报告怎么用：** 支撑报告中几乎所有 AI 相关数字，例如 75% 会核查 AI 答案、Alpha 世代 54% 每天使用、52% 认为 AI 可能成为最常用的娱乐信息来源。

**已核实：**
- “online survey of 4,003 U.S. AI chatbot users ages 13-79”，“fielded Jan. 23 to Feb. 4, 2026”。〔原文·外核：Nielsen 新闻稿〕报告第 23 页写“4,000 多名互联网和 AI 聊天机器人用户”。〔原文〕
- “Gen Alpha findings are based on respondents ages 13 and 14.”〔原文·外核〕而报告第 2 页把 Alpha 世代定义为 2010–2024 年出生。〔原文〕
- 报告发布于 2026 年 4 月 8 日。〔转述〕

**未找到（两轮）：** 样本库或执行公司、是否概率抽样、配额、加权、回应率、完整问卷、各年龄组人数、13–14 岁受访者如何招募、如何取得家长同意。〔未找到〕不能把 Pew 的家长招募做法套用到这份调查上。

**核查发现：**
- 报告正文多处把这批 AI 用户写成 “U.S. consumers”“Americans”“people”（第 2、5、6、20 页）。〔原文〕
- 五个年龄组会核查 AI 答案的比例为 74%、78%、78%、70%、58%，简单平均 71.6%，总体却写作 75%（第 2、5、18 页）。各组人数或权重必然不同，但报告没有交代。〔原文，计算〕
- 第 18 页核查图中，61–79 岁“会核查”为 58%，“用搜索交叉核对”却是 83%。后者大于前者，所以它的分母只能是“会核查的人”，图注没有写明。〔原文〕

### 2. Gracenote 2025 流媒体消费者调查

**报告怎么用：** 找节目要多久、“节目难找”、“会考虑退订”等自报数据（第 6、8、9、12、22 页）。

**已核实：** 巴西、法国、德国、墨西哥、美国、英国，“3,000 respondents (500 per country)”；受访者须通过联网设备或智能电视看流媒体；线上调查，2025 年 7 月 28 日至 8 月 1 日。〔原文：《State of Play》第 20 页〕

**未找到（两轮）：** 执行公司、概率抽样、配额、加权、回应率、完整问卷。〔未找到〕

**核查发现（来自《State of Play》原文图表，第二轮补充）：**

| 2026 报告的写法 | 原始材料 | 判断 |
|---|---|---|
| “平均要花 14 分钟找节目”，第 9 页与美国尼尔森收视数据画在同一张图里，图例标 “P2+” | 14 分钟是**六国简单平均**：巴西 12、法国 26、德国 11、墨西哥 11、英国 12、**美国 12**；(12+26+11+11+12+12)÷6 = 14.0〔原文〕 | 美国自己是 12 分钟；法国一国把平均值拉高（不含法国为 11.6）。六国平均被画进了美国收视图 |
| “18–34 岁要花 16 分钟” | 六国的 18–34 岁为 16 分钟〔原文〕 | 同样是六国口径 |
| 摘要：“54% 的 18–34 岁会取消订阅” | 六国 18–24 岁 52%、25–34 岁 56% “很可能 / 有些可能”因找不到节目而取消，六国总体 49%〔原文〕 | 54% 与六国口径吻合（按两组人数相等推算）。原题是“可能会”，摘要写成了“会取消” |
| 第 6 页：“50% 的**美国**电视观众会考虑取消” | 原始材料只找到六国总体 49%（“49% are willing to cancel a service”）〔原文 + 原文·外核：2025 新闻稿〕 | 美国 50% 的出处〔未找到〕 |
| 第 8 页：“51% 的**美国人**觉得服务太多、越来越难找到想看的” | 美国一栏为 51% 同意（六国平均 46%）〔原文〕 | **一致** ✓ |
| 第 9 页：“32% 认为选择太多影响观看体验，18–34 岁为 48%” | 《State of Play》中这道题的原文为 “the abundance of streaming services and content is having a negative impact on their overall TV enjoyment”，六国平均 32% 同意；六国 18–24 岁 39%、25–34 岁 40%〔原文〕 | 32% 与六国平均一致；48% 与六国 18–34 岁数据不符 |
| 第 12 页：“34% 的**美国人**认为流媒体服务和内容的数量影响观看乐趣，18–34 岁为 48%” | 措辞与上述原题更接近，但《State of Play》未单列美国数字 | 第 9 页和第 12 页措辞略有不同，但都指向同一道题。比较可能的解释是：32% 是六国口径，34% 和两处的 48% 是美国口径。报告没有说明 |
| 第 6 页：“26% 的美国人知道想看什么却仍然找不到” | 两轮都没找到出处。Gracenote 另有一个“26% 的观众找不到想看的比赛”，那是体育，不是同一个说法〔原文·外核〕 | 〔未找到〕 |

**每国 500 人意味着：** 凡是“美国人”的数字，样本只有约 500 人。按简单随机抽样粗算，误差约为 ±4.4 个百分点；这只是理论下限，非概率样本的实际误差无法计算。

### 3. Nielsen NPOWER 与 Nielsen Media Impact（第 8–9 页 CTV 占比与每日看电视时间）

**报告怎么用：** 2025 年第四季度，美国 2 岁以上人群的电视时间中，CTV 占 54%、直播 41%、时移 5%；18–34 岁 CTV 占 80%。

**已核实：**〔原文·外核：Nielsen Big Data + Panel 官方说明与新闻稿〕
- 人员测量仪样本约 “101,000 people from approximately 42,000 households”；大数据来自 “approximately 45 million big data households and 75 million devices”，来源包括 Comcast、Dish、DIRECTV、Roku、Vizio。
- MRC 于 2025 年 1 月 22 日完成认证；2025 年 9 月 22 日新播出季起，Big Data + Panel 正式成为全国电视收视标准。
- Nielsen Media Impact 是媒介策划工具。〔转述〕

**核查发现：**
- 报告用的第四季度数据正好在换用新方法之后，与 2025 年 9 月以前的数据比较时要注意方法变化。
- 用图中数字复算：CTV 2:18 ÷ 总计 4:17 = 53.7%；18–34 岁 2:04 ÷ 2:34 = 80.5%，都与报告一致。〔原文，计算〕
- 同一张图里的“找节目时间”来自六国问卷，与尼尔森的美国测量数据在性质、国家、人群上都不同（见第 2 项）。

### 4. Nielsen Streaming Content Ratings（第 10 页热门剧观看分钟）

**已核实：** 基于 “a sample of Nielsen’s Streaming Meter homes”，是 “a subset of the National TV Panel”，只测 “streaming happening on the television glass”。〔原文·外核〕

**未找到：** 当前流媒体测量仪样本的户数。〔未找到〕（第一轮写的“从约 800 户扩大到约 14,000 户”未经原文确认，已删除。）

**核查发现：**
- 不含手机、电脑上的观看。
- 用图中数字复算：授权剧合计 3,309 亿分钟，原创剧合计 1,823 亿分钟，前者多 81.5%，与报告的 81% 一致。〔原文，计算〕

### 5. Gracenote 节目数据库、Studio System 与 Data Hub

**报告怎么用：** 第 8 页的节目规模（截至 2026 年 2 月：近 350 个 SVOD 目录、180 万个节目；近 2,100 个 FAST 频道、21 万个节目）；第 9 页的新节目和电影产量（Studio System）；“Data Hub 追踪的 5 个平台片库一年增长 20%”。

**已核实：** Data Hub 于 2024 年 11 月 13 日上线，追踪 Prime Video、Apple TV+、Disney+、Netflix、Paramount+ 五个平台。〔原文·外核〕

**第二轮更正：** 第一轮写的“自上线以来增长 6.7%，与报告的 20% 可能矛盾”**有误**。6.7% 是 2025 年第一季度的**环比**增长；2026 年 Data Hub 的更新确有“同比增长 20%”。〔原文·外核〕两者并不矛盾。

**核查发现：**
- 第 23 页写“300+ 个流媒体目录”，第 8 页写“近 350 个 SVOD 目录”，2025 年《State of Play》写“260+ 个”。〔原文〕三者时间点不同，不应混用。
- 未公开：采集方、更新频率、各国覆盖差异、去重规则、缺失率、核验流程。

### 6. Pew Research Center：青少年聊天机器人使用（第 14 页）

**报告怎么用：** 拿 Pew 的“30% 青少年每天用聊天机器人”与自己的“Alpha 世代 54% 每天用”对比，称使用频率“在加速”。

**已核实：**〔原文·外核：Pew 报告 PDF 第 19–22 页方法、第 29–31 页数据表〕
- 1,458 名美国 13–17 岁青少年，2025 年 9 月 25 日至 10 月 9 日线上调查；通过 KnowledgePanel（“a probability-based web panel”）中的家长招募；误差 ±3.3 个百分点。
- 题目原文：“About how often do you use an artificial intelligence (AI) chatbot like ChatGPT, Copilot or Character.ai?”
- 64% 用过聊天机器人。

**精确数字（第二轮新增）：**

| 分母 | 每天至少用一次 | 构成 |
|---|---|---|
| 全体 13–17 岁青少年 | **28%** | 几乎一直在用 4% + 一天几次 12% + 大约一天一次 12% |
| 其中 13–14 岁 | **24%** | — |
| 其中 15–17 岁 | **31%** | — |
| 用过聊天机器人的青少年（N = 894） | **44%** | 6% + 19% + 19% |

**核查发现：**
- 报告说的“30%”是 Pew 正文“about three-in-ten”的说法，精确值是 28%。
- **同为 13–14 岁：** Pew 的全体青少年为 24%，Gracenote 的 AI 用户为 54%，相差 30 个百分点。这个差距主要来自分母不同。
- **换成相同的“使用者”分母：** Pew 为 44%（13–17 岁使用者），与 Gracenote 的 54% 相差约 10 个百分点。剩下的差距还可能来自年龄范围、抽样方法、调查时间和题目措辞的不同。仅凭这两项调查，不能说明“几个月内使用频率在加速”。

### 7. Deloitte 2025 Digital Media Trends（第 22 页）

**已核实：** “online survey of 3,595 US consumers”，14 岁以上，2024 年 10 月，“weighted back to the most recent Census”，由未具名的 “independent research firm” 执行。〔原文·外核〕

**核查发现：** 原文是 “41% percent of consumers overall say the content available on SVOD isn’t worth the price”。〔原文·外核〕Gracenote 写成了“41% 的流媒体订户”。〔原文〕而且该题测的是价格与价值的感受，不是“因为找不到节目而退订”。

### 8. PwC 全球娱乐与媒体展望 2025–2029（第 6 页）

**已核实：** OTT 视频与付费电视的消费支出 “grow from US$291.3 billion in 2024 to US$318.5 billion in 2029”，“a CAGR of 1.8%”；2027 年 OTT 首次超过付费电视。图表标注为 “Global subscription TV revenue”“Global OTT revenue”。〔原文·外核〕

**核查发现：**
- 3,185 亿美元是**全球数字**，不是美国数字；年均增长只有 1.8%。报告没有写明是全球，而上下文讲的是美国用户。
- PwC 展望覆盖 54 个国家和地区的说法来自第一轮检索，第二轮未在相关原文页确认。〔转述〕
- 这是模型预测，不是测量值，也不能证明内容难找会导致退订。

### 9. Veed Analytics：聊天机器人找片测试（第 6 页）

**报告怎么用：** “只有约 2/3 的结果正确指出了节目在哪个平台，只有 31% 提供了深层链接。”脚注列出 ChatGPT、Claude、Gemini、Perplexity。

**已核实（作者 Bernd Riefler 本人文章，以及 NAB Show 2026 年 4 月 20 日演讲页）：**〔原文·外核〕
- 测试了 “ChatGPT, Claude, Gemini and Perplexity” 四个（NAB 简介只列前三个）。
- 国家：“US, UK, France, Germany, Italy and Spain”。
- 选题：“searching for exclusive shows on streaming services”，即只测独播剧，不是从全部片库随机抽取。
- “We ran each prompt three times in a row”。
- 正确平台约 “roughly two third”；深层链接 “Less than a third”；“A little less than a half of the runs were inconsistent”。
- ChatGPT 在 “US/UK/Germany (c80%)”，在 “France/Italy/Spain (<30%)”。

**未找到：** 模型版本、题目总数、完整片单、评分人及评分程序、各聊天机器人的完整结果。〔未找到〕68%、31%、57% 这几个精确值只见于媒体转述的图表。〔转述〕

**核查发现：**
- “约 2/3”是六国合并值。ChatGPT 在美、英、德约 80% 正确，在法、意、西不到 30%，国家差异极大，报告没有交代。
- 只测独播剧：这类题目的答案唯一，难度和普通“在哪儿看”的问题不同。
- **独立参照：Reelgood 测试**〔原文·外核：Reelgood 官方分析页〕
  - 2026 年 3 月 5 日，用 100 部美国影视（50 部电影、50 部剧）测试。
  - 模型版本为 ChatGPT 5.2 和 Claude Haiku 4.5。
  - 提问：“Where can I watch the movie/show [Title] today in the US?”
  - 与当天人工核验的结果比对，按漏报、错报计算准确率。
  - 结果：ChatGPT 43.76%，Claude 50.21%，Reelgood 自己的数据 96.89%。
  - Reelgood 本身也是元数据公司，与 Gracenote 有类似的利益结构。两项测试的方法、模型和时间不同，不宜直接比较数字，但方向一致：聊天机器人回答“在哪儿看”并不可靠。

### 10. USC 研究：常识知识库中的表征伤害（第 5 页）

**原研究：** Mehrabi 等，《Lawyers are Dishonest? Quantifying Representational Harms in Commonsense Knowledge Resources》，EMNLP 2021。研究对象是 ConceptNet 和 GenericsKB 两个常识知识库。

**已核实：**〔原文·外核：论文 PDF 第 5 页〕

| 知识库 | sentiment 指标 | regard 指标 |
|---|---|---|
| ConceptNet | 4.5% | 3.4% |
| GenericsKB | 36.5% | 38.6% |

- **判定方法：** “we apply sentiment and regard classifiers”。比例由自动分类器计算，不是人工逐条判定。
- **人工验证：** 作者请 Amazon Mechanical Turk 众包工人抽样标注（ConceptNet 约 3,000 条，GenericsKB 1,500 多条）。自动指标与人工标签的一致率：ConceptNet 83.1% / 75.4%，**GenericsKB 70.3% / 60.9%**。

**核查发现：**
- 报告写“两个 AI 数据库中高达 38% 的常识‘事实’数据有偏差”，并推到“超过三分之一的基础训练数据有偏差”。实际上 38.6% 只是一个知识库在一个指标下的结果；另一个知识库只有 3.4%–4.5%。
- 38.6% 来自 regard 自动分类器，而这个分类器在 GenericsKB 上与人工判断的一致率只有 60.9%。
- 这两个知识库也不等同于今天大模型的训练语料。

### 11. Fabric / Broadband TV News：流媒体月流失率（第 22 页）

**报告怎么用：** “月流失率去年为 5.5%，五年前只有 2%。”

**已核实：** Broadband TV News 2025 年 8 月 20 日文章写有 “average monthly churn rate now sits at 5.5%”“from 2% in 2019”，并注明来自 “a new analysis by Fabric”。〔原文·外核〕

**未找到：** Fabric 原始分析页能找到（讨论 2025 年第一季度各平台流失率上升），但页面正文**没有** 5.5% 和“2019 年 2%”这两个数字，也没有流失率定义。〔未找到〕

**核查发现：**
- Antenna 用交易数据计算 10 家主要付费 SVOD 的加权平均月流失率（只计主动取消）：2019 年 10 月为 4.1%，2021 年 10 月为 6%。〔转述：MediaPost；Antenna 原文未找到〕两家对“2019 年”的数字差了一倍多，说明定义或覆盖范围不同。
- 它测的是实际退订，和问卷里“会考虑退订”不是同一种数据，也不能说明退订原因是“找不到节目”。

---

## 三、主要结论（第二轮更新）

1. **六国数据被放进了美国语境。** 14 分钟、16 分钟、54%、32% 都是 2025 年六国调查的口径。其中 14 分钟是六国简单平均（美国自己 12 分钟），却与美国尼尔森收视数据画在同一张图里。“50% 的美国观众会考虑取消”在原始材料里只找到六国 49%。
2. **Pew 对比的差距主要来自分母。** 同为 13–14 岁，Pew 全体青少年每天用的比例为 24%，Gracenote 的 AI 用户为 54%。换成使用者分母，Pew 为 44%，与 54% 只差约 10 个百分点。
3. **外部数字被说窄或说大了。**
   - PwC 的 3,185 亿美元是全球数字。
   - Veed 的“约 2/3”是六国合并值，国家差异极大，而且只测独播剧。
   - Deloitte 的分母是全体消费者。
   - USC 的 38.6% 只是一个知识库、一个自动指标的结果，该指标与人工判断的一致率只有 60.9%。
4. **报告内部数字大体自洽。** CTV 54% / 80%、授权剧多 81%、每周多次使用 76%、“51% 的美国人觉得难找”、Data Hub 同比增长 20% 都能复核。
5. **Gracenote 自有问卷的方法最不透明。** 两轮都没找到样本库、抽样、加权、回应率、各组人数和未成年人同意程序。

## 四、对报告结论的影响

- **方向性结论站得住：** 多个独立来源（Pew、Veed、Reelgood）都指向“年轻人越来越多用 AI 找内容”和“AI 回答‘在哪儿看’不可靠”。
- **精确数字要带上口径：** 引用时写明是“美国 AI 聊天机器人用户”（2026 调查）还是“六国流媒体用户”（2025 调查），不能把六国平均当成美国数字。
- **因果链没有被证明：** 意向（问卷）、行为（流失率）、预测（PwC）、测试（Veed）是四种数据，报告既没有追踪同一批人，也没有做实验。
- **利益关系：** 报告的落脚点“需要接入可信的行业数据”正是 Gracenote 的业务。这是要细看方法的理由，但不能单凭这一点判定某个数字有误。

## 五、可直接引用的谨慎表述

> 据 Gracenote 2026 年对 4,003 名美国 AI 聊天机器人用户的线上调查，75% 表示会核查聊天机器人的答案。报告未公开该调查的招募来源、加权和回应率，这一比例应理解为该调查样本的自述结果。

> Gracenote 2025 年对六国 3,000 名流媒体用户的调查显示，受访者平均花 14 分钟找节目。这是六国的简单平均，其中美国受访者为 12 分钟，法国为 26 分钟。

> Pew 2025 年的概率样本调查显示，13–14 岁美国青少年中有 24% 每天使用 AI 聊天机器人；Gracenote 调查中 13–14 岁 AI 用户的这一比例为 54%。两者分母不同（全体青少年 vs. AI 用户），不能据此推断使用率在几个月内上升。

---

## 来源

- Gracenote 2026 报告原文：[GRACENOTE-2026-AI-report.pdf](https://s3.amazonaws.com/media.mediapost.com/uploads/GRACENOTE-2026-AI-report.pdf)
- Gracenote 2025《State of Play》原文：[gracenote-2025-state-of-play.pdf](https://s3.amazonaws.com/media.mediapost.com/uploads/gracenote-2025-state-of-play.pdf)
- 新闻稿：[Nielsen](https://www.nielsen.com/news-center/2026/gen-alpha-leads-shift-to-ai-powered-entertainment-search-discovery-and-recommendations/)；[Gracenote](https://gracenote.com/newsroom/gen-alpha-leads-shift-to-ai-powered-entertainment-search-discovery-and-recommendations/)；[ppc.land 报道](https://ppc.land/most-tv-viewers-distrust-ai-search-results-gracenote-study-finds/)
- 尼尔森测量方法：[Big Data + Panel 官方说明](https://www.nielsen.com/data-center/big-data-panel/)；[Big Data + Panel 启用](https://www.nielsen.com/news-center/2025/nielsen-begins-updated-era-of-tv-ratings-with-big-data-panel-for-this-falls-tv-season/)；[MRC 认证](https://www.nielsen.com/news-center/2025/2025-the-media-rating-council-accredits-nielsens-innovative-big-data-panel-national-tv-measurement/)；[Streaming Video Ratings](https://content.nielsen.com/streaming-video-ratings-report)
- Gracenote Data Hub：[上线新闻稿](https://www.nielsen.com/news-center/2024/gracenote-launches-new-data-hub-illuminating-content-insights-across-industrys-leading-svod-services/)
- Pew：[报告页面](https://www.pewresearch.org/internet/2025/12/09/teens-social-media-and-ai-chatbots-2025/)；[报告 PDF](https://www.pewresearch.org/wp-content/uploads/sites/20/2025/12/PI_2025.12.09_Teens-Social-Media-AI_REPORT.pdf)
- Deloitte：[2025 Digital Media Trends](https://www.deloitte.com/us/en/insights/industry/technology/digital-media-trends-consumption-habits-survey/2025.html)
- PwC：[Global E&M Outlook 2025–2029](https://www.pwc.com/id/gemo-2025)；[全球新闻稿](https://www.pwc.com/gx/en/news-room/press-releases/2025/pwc-global-entertainment-media-outlook.html)；[方法说明](https://www.pwc.com/gx/en/issues/business-model-reinvention/outlook/insights-and-perspectives/methodology.html)
- Veed Analytics：[NAB Show 演讲页](https://www.nabshow.com/video/chatbots-for-streaming-content-discovery-first-hand-data-insights-from-tests-in-the-us-and-europe/)；[NAB 议程页](https://www.nabshow.com/session/chatbots-for-streaming-content-discovery-first-hand-data-insights-from-tests-in-the-us-and-europe/)；[TVREV（作者文章）](https://www.tvrev.com/news/chatbots-for-content-discovery)
- Reelgood：[官方分析](https://data.reelgood.com/chatgpt-claude-streaming-availability-accuracy-analysis/)
- USC 论文：[ACL Anthology](https://aclanthology.org/2021.emnlp-main.410/)；[PDF](https://aclanthology.org/2021.emnlp-main.410.pdf)
- 流失率：[Broadband TV News](https://www.broadbandtvnews.com/2025/08/20/us-streaming-platforms-shift-focus-to-retention-as-churn-rates-surge/)；[Fabric](https://www.fabricdata.com/trends/streaming-trends-in-the-usa-how-are-platforms-responding)；[MediaPost 关于 Antenna 数据](https://www.mediapost.com/publications/article/369573/double-digit-streamer-sub-churn-rates-transaction.html)
