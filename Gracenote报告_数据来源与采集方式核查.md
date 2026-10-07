# Gracenote《TV Search and Discovery in the AI Era》：数据来源与采集方式核查（更新版）

核查日期：2026-10-07。报告页码按 PDF 印刷页码。

## 核实方式说明

本次核查运行在受网络策略限制的环境里，大部分原始网站（nielsen.com、gracenote.com、pewresearch.org、deloitte.com、pwc.com、arxiv.org 等）无法直接打开。因此每条结论都标出核实程度：

| 标记 | 含义 |
|---|---|
| **〔原文〕** | 直接读取了原始文件：Gracenote 2026 报告 PDF、Gracenote 2025《State of Play》PDF |
| **〔检索〕** | 通过搜索引擎对官方页面的摘录核实，未直接打开原页面 |
| **〔转述〕** | 只能找到行业媒体的转述，未找到发布方的完整说明 |

后续若能打开原页面，标〔检索〕〔转述〕的条目建议再对一次原文。

---

## 一、总览：11 个数据来源

| # | 来源 | 数据性质 | 采集方式 | 方法公开程度 |
|---|---|---|---|---|
| 1 | Gracenote 2026 生成式 AI 使用调查 | 消费者问卷 | 线上问卷，美国 13–79 岁 AI 聊天机器人用户，N = 4,003，2026.1.23–2.4 | 部分公开：无招募来源、抽样、加权、回应率 |
| 2 | Gracenote 2025 流媒体消费者调查 | 消费者问卷 | 线上问卷，6 国各 500 人，共 3,000 人，2025.7.28–8.1 | 部分公开：无招募来源、抽样、加权、回应率 |
| 3 | Nielsen NPOWER / Media Impact | 收视测量 | 样本户人员测量仪 + 机顶盒 / 智能电视大数据（Big Data + Panel） | 方法有官方说明，但报告图旁未注明 |
| 4 | Nielsen Streaming Content Ratings | 收视测量 | 全国样本中装有流媒体测量仪的电视家庭子样本 | 方法有官方说明，但报告图旁未注明 |
| 5 | Gracenote 节目数据库 / Studio System / Data Hub | 商业元数据 | 公司自有目录数据，非抽样 | 未公开采集与核验流程 |
| 6 | Pew Research Center 青少年调查 | 消费者问卷 | 概率样本库（Ipsos KnowledgePanel），N = 1,458，加权 | 完整公开 |
| 7 | Deloitte 2025 Digital Media Trends | 消费者问卷 | 线上问卷，美国 14 岁以上 3,595 人，2024 年 10 月，按人口普查加权 | 基本公开 |
| 8 | PwC 全球娱乐与媒体展望 | 市场预测 | 公开数据 + 行业访谈 + 统计建模，54 个国家和地区 | 方法框架公开，模型细节不公开 |
| 9 | Veed Analytics 聊天机器人测试 | 机器表现测试 | 在美欧多国向聊天机器人提问并评分 | 完整测试方案未公开 |
| 10 | USC 常识知识库偏差研究 | 学术论文 | 用自动指标分析两个知识库的陈述 | 完整公开（同行评审论文） |
| 11 | Fabric（经 Broadband TV News 转述）流失率 | 行业指标 | 自动抓取 + 人工核验（Fabric 自述） | 流失率的计算方法未公开 |

---

## 二、逐项核查

### 1. Gracenote 2026 生成式 AI 使用调查（报告的核心数据）

**报告怎么用：** 支撑报告中几乎所有 AI 相关数字，例如 75% 会核查 AI 答案、Alpha 世代 54% 每天使用、52% 认为 AI 可能成为最常用的娱乐信息来源。

**已核实的采集信息：**
- 线上调查，4,003 名美国 AI 聊天机器人用户，13–79 岁，2026 年 1 月 23 日至 2 月 4 日。〔检索：Nielsen / Gracenote 新闻稿〕报告正文第 23 页写“4,000 多名互联网和 AI 聊天机器人用户”。〔原文〕
- 新闻稿明确说明：**“Alpha 世代”结论只基于 13 岁和 14 岁的受访者。**〔检索〕而报告第 2 页把 Alpha 世代定义为 2010–2024 年出生。〔原文〕
- 报告发布日期为 2026 年 4 月 8 日。〔检索：ppc.land 报道〕

**未公开：** 样本从哪里招募（哪家样本库）、是否概率抽样、配额、加权、回应率、完整问卷、各年龄组人数，以及未成年受访者如何取得家长同意。

**核查发现：**
- 报告正文多处把这批 AI 用户写成 “U.S. consumers”“Americans”“people”（第 2、5、6、20 页）。〔原文〕
- 五个年龄组会核查 AI 答案的比例分别为 74%、78%、78%、70%、58%，简单平均为 71.6%，而总体写作 75%（第 2、5、18 页）。各组人数或权重必然不同，但报告没有交代。〔原文，计算〕
- 第 18 页核查图中，61–79 岁“会核查”为 58%，“用搜索交叉核对”却是 83%。后者大于前者，所以它的分母只能是“会核查的人”，图注没有写明。〔原文〕

### 2. Gracenote 2025 流媒体消费者调查

**报告怎么用：** 找节目要多久、“节目难找”、“会考虑退订”等自报数据（第 6、8、9、12、22 页）。

**已核实的采集信息：** 巴西、法国、德国、墨西哥、美国、英国六国，**每国 500 人**，共 3,000 人；受访者须通过联网设备或智能电视看流媒体；线上调查，2025 年 7 月 28 日至 8 月 1 日。〔原文：《State of Play》第 20 页〕

**未公开：** 招募来源、抽样、加权、回应率；也没说明跨国平均是否按人口加权。

**核查发现（本次新增，均来自《State of Play》原文图表）：**

| 2026 报告的写法 | 2025《State of Play》原文 | 判断 |
|---|---|---|
| “平均要花 14 分钟找节目”，并在第 9 页与美国尼尔森收视数据画在同一张图里，图例标 “P2+” | 14 分钟是**六国简单平均**：巴西 12、法国 26、德国 11、墨西哥 11、英国 12、**美国 12**；(12+26+11+11+12+12)÷6 = 14.0 | 美国自己是 12 分钟；法国一国把平均值拉高（不含法国为 11.6 分钟）。把六国平均画进美国收视图，口径不一致 |
| “18–34 岁要花 16 分钟” | 六国的 18–34 岁为 16 分钟 | 同样是六国口径，而不是美国 |
| 摘要：“54% 的 18–34 岁会取消订阅” | 六国 18–24 岁 52%、25–34 岁 56% “很可能 / 有些可能”因找不到节目而取消，两者平均为 54%；六国总体为 49% | 54% 与六国口径吻合（按两组人数相等推算）。摘要把它和美国数据并列，且原题是“可能会”，摘要写成了“会取消” |
| 第 6 页：“50% 的**美国**电视观众会考虑取消” | 原文只给出六国平均 49%，没有单独的美国数字 | 无法核实“美国 50%” |
| 第 8 页：“51% 的**美国人**觉得服务太多、越来越难找到想看的” | 美国一栏为 51% 同意（六国平均 46%） | **一致** ✓ |
| 第 9 页：“32% 认为选择太多影响观看体验，18–34 岁为 48%” | 六国平均 32% 同意；但六国 18–24 岁为 39%、25–34 岁为 40% | 32% 是六国口径；48% 与六国 18–34 岁数据不符，可能是美国口径，报告未说明 |
| 第 12 页：“34% 的**美国人**……18–34 岁为 48%” | 原文未单列美国数字 | 32% 与 34% 的差异很可能来自六国平均与美国的口径不同 |
| 第 6 页：“26% 的美国人知道想看什么却仍然找不到” | 公开的《State of Play》中未找到对应题目 | 无法追溯出处 |

**每国 500 人意味着：** 凡是“美国人”的数字，样本只有约 500 人；按简单随机抽样粗算，误差约为 ±4.4 个百分点（这是理论下限，非概率样本的实际误差无法计算）。

### 3. Nielsen NPOWER 与 Nielsen Media Impact（第 8–9 页 CTV 占比与每日看电视时间）

**报告怎么用：** 2025 年第四季度，美国 2 岁以上人群的电视时间中，CTV 占 54%、直播 41%、时移 5%；18–34 岁 CTV 占 80%。

**采集方式：**
- NPOWER 是尼尔森的全国电视受众分析系统。〔检索〕
- 2025 年 9 月起，尼尔森全国电视收视改用 **Big Data + Panel**：约 42,000 户、10 万人的人员测量仪样本，加上约 4,500 万户、7,500 万台设备的机顶盒和智能电视数据。〔检索：Nielsen 新闻稿、Sports Media Watch〕媒体评级委员会（MRC）已于 2025 年 1 月 22 日认证这套方法。〔检索〕
- Nielsen Media Impact 是媒介策划工具，提供受访者层级的到达率、频次和重叠分析。〔检索〕

**核查发现：**
- 报告使用的第四季度数据，正好处在尼尔森换用新方法之后。与 2025 年 9 月以前的数据比较时要注意方法变化。
- 用图中数字复算：CTV 2:18 ÷ 总计 4:17 = 53.7%；18–34 岁 2:04 ÷ 2:34 = 80.5%。都与报告一致。〔原文，计算〕
- 同一张图里的“找节目时间”来自六国问卷，与尼尔森的美国测量数据性质、国家、人群都不同（见第 2 项）。

### 4. Nielsen Streaming Content Ratings（第 10 页热门剧观看分钟）

**采集方式：** 来自全国样本中装有流媒体测量仪的电视家庭子样本，只测电视屏幕上的流媒体（智能电视、Roku、Apple TV、游戏机等），覆盖 Netflix、Prime Video、Hulu、Disney+、YouTube、Tubi 等主要平台。〔检索〕流媒体测量仪样本曾从约 800 户扩大到约 14,000 户。〔检索，具体时间待核〕

**核查发现：**
- 不含手机、电脑上的观看。
- 用图中数字复算：授权剧合计 3,309 亿分钟，原创剧合计 1,823 亿分钟，前者多 81.5%，与报告的 81% 一致。〔原文，计算〕

### 5. Gracenote 节目数据库、Studio System 与 Data Hub

**报告怎么用：** 第 8 页的节目规模（截至 2026 年 2 月：近 350 个 SVOD 目录、180 万个节目；近 2,100 个 FAST 频道、21 万个节目）；第 9 页的新节目和电影产量（Studio System）；“Data Hub 追踪的 5 个平台片库一年增长 20%”。

**采集方式：** 公司自有的商业元数据，不是抽样调查。Data Hub 于 2024 年 11 月上线，追踪 Prime Video、Apple TV+、Disney+、Netflix、Paramount+ 五个平台，数据来自 Gracenote Global Video Data。〔检索〕

**核查发现：**
- 第 23 页写“300+ 个流媒体目录”，第 8 页写“近 350 个 SVOD 目录”；2025 年《State of Play》写“260+ 个”。〔原文〕三者时间点不同，不应混用。
- 搜索结果显示，Gracenote 曾公布“自 2024 年 11 月 Data Hub 上线以来，片库合计增长 6.7%”。〔检索〕这与报告的“过去一年增长 20%”时间段可能不同，报告没有注明起止时间。
- 未公开：采集方、更新频率、各国覆盖差异、去重规则、缺失率、核验流程。

### 6. Pew Research Center：青少年聊天机器人使用（第 14 页）

**报告怎么用：** 拿 Pew 的“约 30% 青少年每天用聊天机器人”与自己的“Alpha 世代 54% 每天用”对比，称使用频率“在加速”。

**采集方式：** 1,458 名美国 13–17 岁青少年；2025 年 9 月 25 日至 10 月 9 日线上调查；Ipsos 通过 KnowledgePanel 中的家长招募青少年。KnowledgePanel 主要通过全国随机地址抽样建立，是概率样本库，结果经过加权。全样本误差为 ±3.3 个百分点。〔检索：Pew 报告〕

**核查发现（本次新增）：**
- Pew 原文是：**64% 的青少年用过聊天机器人，其中约 3 成的青少年每天用。**〔检索〕“约 30%”的分母是全体青少年。
- 换成和 Gracenote 一样的“使用者”分母：30% ÷ 64% ≈ **47%**（按“约 3 成”粗算）。与 Gracenote 54% 的差距从表面的 24 个百分点缩小到约 7 个百分点。
- 剩下的差距还可能来自年龄范围（13–17 岁对 13–14 岁）、抽样方法、调查时间和题目措辞的不同。仅凭这两项调查，不能说明“几个月内使用频率在加速”。

### 7. Deloitte 2025 Digital Media Trends（第 22 页）

**采集方式：** 3,595 名美国 14 岁以上消费者，2024 年 10 月线上调查，按最新人口普查加权。〔检索〕

**核查发现：** Deloitte 原文是 41% 的“**消费者总体**”认为 SVOD 内容不值这个价（比上一年高 5 个百分点）。〔检索〕Gracenote 写成了“41% 的流媒体订户”。〔原文〕而且该题测的是价格与价值的感受，不是“因为找不到节目而退订”。

### 8. PwC 全球娱乐与媒体展望 2025–2029（第 6 页）

**报告怎么用：** “OTT 与付费电视的消费支出 2029 年将达 3,185 亿美元，OTT 将在 2027 年超过付费电视。”

**采集方式：** PwC 先收集公开历史数据（行业协会、政府来源），再访谈协会、监管机构和行业主要公司补足缺口，然后建模预测并验证。〔检索：PwC 方法页〕

**核查发现（本次新增）：**
- 3,185 亿美元是 **54 个国家和地区的全球合计**，2024 年为 2,913 亿美元，年均增长仅 1.8%。〔检索：PwC 新闻稿及相关报道〕报告没写明是全球数字，而上下文讲的是美国用户。
- 这是模型预测，不是测量值，也不能证明内容难找会导致退订。

### 9. Veed Analytics：聊天机器人找片测试（第 6 页）

**报告怎么用：** “只有约 2/3 的结果正确指出了节目在哪个平台，只有 31% 提供了深层链接。”脚注列出 ChatGPT、Claude、Gemini、Perplexity。

**已知信息：**〔转述：TVREV、ScreenVoice、NAB Show 摘要〕
- 由 Veed Analytics 的 Bernd Riefler 主持，在美国和欧洲多国测试。
- 68% 的回答包含正确的播出平台；同一问题问三遍，答案一致的只有 57%；31% 给出深层链接。
- **国家差异很大：** ChatGPT 在美国、英国、德国约 80% 正确，在法国、意大利、西班牙不到 30%。
- NAB 摘要只列了 ChatGPT、Claude、Gemini 三个，报告脚注多了 Perplexity，无法确认 Perplexity 是否计入这些比例。

**核查发现：**
- “约 2/3”是多国合并值。在美国这类市场可能更高，在南欧更低，报告没有交代。
- 完整协议未公开：题目数量、选片规则、测试日期、模型版本、评分标准、评分人。
- **独立参照：** Reelgood 2026 年 3 月用 100 部美国热门影视测试，以人工核验结果为准，ChatGPT 正确率 43.76%，Claude 50.21%，Reelgood 自己的数据为 96.89%。〔转述：Advanced Television、Forbes〕Reelgood 本身也是流媒体元数据公司，与 Gracenote 有类似的利益结构。两项测试的方法和时间不同，不宜直接比较数字，但都说明“聊天机器人回答‘在哪儿看’并不可靠”这一方向。

### 10. USC 研究：常识知识库中的表征伤害（第 5 页）

**原研究：** Mehrabi、Zhou、Morstatter、Pujara、Ren、Galstyan，《Lawyers are Dishonest? Quantifying Representational Harms in Commonsense Knowledge Resources》，EMNLP 2021。〔检索〕研究对象是 ConceptNet 和 GenericsKB 两个常识知识库，用 sentiment（情感）和 regard（对群体的社会评价）两个自动指标衡量“过度概括”。

**核查发现：** 38.6% 只是 GenericsKB 在 regard 指标下的比例；ConceptNet 两项指标为 4.5% 和 3.4%（数值据交接核查读取的论文原文）。报告写成“两个 AI 数据库中高达 38% 的常识‘事实’数据有偏差”，进而推到“超过三分之一的基础训练数据有偏差”。这两个知识库也不等同于今天大模型的训练语料。

### 11. Fabric / Broadband TV News：流媒体月流失率（第 22 页）

**报告怎么用：** “月流失率去年为 5.5%，五年前只有 2%。”

**已知信息：** Broadband TV News 2025 年 8 月转述 Fabric 的分析，称美国主要平台平均月流失率为 5.5%，2019 年为 2%。〔检索〕Fabric 自述的数据方法是“自动抓取 + 分析师人工核验”。〔检索〕

**核查发现（本次新增）：**
- 没有公开流失率的定义、覆盖平台和计算方法。
- 另一家机构 Antenna 用交易数据计算 10 家主要付费 SVOD 的加权平均月流失率（只计用户主动取消）：**2019 年 10 月已是 4.1%**，2021 年 10 月为 6%。〔检索：MediaPost 转述 Antenna 数据〕两家对“2019 年”的数字差了一倍多，说明定义或覆盖范围不同。
- 它测的是实际退订，和问卷里“会考虑退订”不是同一种数据，也不能说明退订的原因是“找不到节目”。

---

## 三、本次更新的主要新增结论

1. **六国数据被放进了美国语境。** 14 分钟、16 分钟、54%、32% 都是 2025 年六国调查的口径。其中 14 分钟是六国简单平均（美国自己 12 分钟），却与美国尼尔森收视数据画在同一张图里。
2. **Pew 对比的差距主要来自分母。** 换成“使用者”分母后，Pew 约 47%，与 Gracenote 的 54% 只差约 7 个百分点。
3. **外部数字的范围被缩窄或放大。** PwC 是全球 54 个市场的预测；Veed 是多国合并、国家差异极大的测试结果；Deloitte 的分母是全体消费者；USC 的 38% 只是一个知识库的一个指标。
4. **报告内部数字大体自洽。** CTV 54% / 80%、授权剧多 81%、每周多次使用 76%、“51% 的美国人觉得难找”都能从图表或原始调查复核。

## 四、对报告结论的影响

- **方向性结论站得住：** 多个来源，包括独立的 Pew、Veed、Reelgood，都指向“年轻人越来越多用 AI 找内容”和“AI 回答‘在哪儿看’不可靠”。
- **精确数字要带上口径：** 引用时应写明是“美国 AI 聊天机器人用户”（2026 调查）或“六国流媒体用户”（2025 调查），并且不能把六国平均当成美国数字。
- **因果链没有被证明：** 意向（问卷）、行为（流失率）、预测（PwC）、测试（Veed）是四种数据，没有追踪同一批人，也没有做实验。
- **利益关系：** 报告的落脚点“需要接入可信的行业数据”正是 Gracenote 的业务。这是要细看方法的理由，但不能单凭这一点判定某个数字有误。

## 五、可直接引用的谨慎表述

> 据 Gracenote 2026 年对 4,003 名美国 AI 聊天机器人用户的线上调查，75% 表示会核查聊天机器人的答案。报告未公开该调查的招募来源、加权和回应率，这一比例应理解为该调查样本的自述结果。

> Gracenote 2025 年对六国 3,000 名流媒体用户的调查显示，受访者平均花 14 分钟找节目。这是六国的简单平均，其中美国受访者为 12 分钟，法国为 26 分钟。

---

## 来源

- Gracenote 2026 报告原文：[GRACENOTE-2026-AI-report.pdf](https://s3.amazonaws.com/media.mediapost.com/uploads/GRACENOTE-2026-AI-report.pdf)
- Gracenote 2025《State of Play》原文：[gracenote-2025-state-of-play.pdf](https://s3.amazonaws.com/media.mediapost.com/uploads/gracenote-2025-state-of-play.pdf)
- 新闻稿：[Nielsen](https://www.nielsen.com/news-center/2026/gen-alpha-leads-shift-to-ai-powered-entertainment-search-discovery-and-recommendations/)；[Gracenote](https://gracenote.com/newsroom/gen-alpha-leads-shift-to-ai-powered-entertainment-search-discovery-and-recommendations/)；[ppc.land 报道](https://ppc.land/most-tv-viewers-distrust-ai-search-results-gracenote-study-finds/)
- 尼尔森测量方法：[Big Data + Panel 启用](https://www.nielsen.com/news-center/2025/nielsen-begins-updated-era-of-tv-ratings-with-big-data-panel-for-this-falls-tv-season/)；[MRC 认证](https://www.nielsen.com/news-center/2025/2025-the-media-rating-council-accredits-nielsens-innovative-big-data-panel-national-tv-measurement/)；[Sports Media Watch 解读](https://www.sportsmediawatch.com/2025/12/nielsen-big-data-plus-panel-tv-measurement/)；[Nielsen Media Impact](https://www.nielsen.com/solutions/media-planning/media-impact/)；[Streaming Video Ratings](https://content.nielsen.com/streaming-video-ratings-report)
- Gracenote Data Hub：[Nielsen 新闻稿](https://www.nielsen.com/news-center/2024/gracenote-launches-new-data-hub-illuminating-content-insights-across-industrys-leading-svod-services/)
- Pew：[报告页面](https://www.pewresearch.org/internet/2025/12/09/teens-social-media-and-ai-chatbots-2025/)；[报告 PDF](https://www.pewresearch.org/wp-content/uploads/sites/20/2025/12/PI_2025.12.09_Teens-Social-Media-AI_REPORT.pdf)
- Deloitte：[2025 Digital Media Trends](https://www.deloitte.com/us/en/insights/industry/technology/digital-media-trends-consumption-habits-survey/2025.html)
- PwC：[新闻稿](https://www.pwc.com/gx/en/news-room/press-releases/2025/pwc-global-entertainment-media-outlook.html)；[方法说明](https://www.pwc.com/gx/en/issues/business-model-reinvention/outlook/insights-and-perspectives/methodology.html)
- Veed Analytics：[NAB Show 摘要](https://www.nabshow.com/video/chatbots-for-streaming-content-discovery-first-hand-data-insights-from-tests-in-the-us-and-europe/)；[TVREV](https://www.tvrev.com/news/chatbots-for-content-discovery)；[ScreenVoice](https://www.screenvoice.cz/en/news/ai-and-video-search-chatbots-can-find-streaming-platforms-but-struggle-with-deep-links-to-shows-study-says/)
- Reelgood 测试：[Advanced Television](https://www.advanced-television.com/2026/06/02/analysis-ai-assistants-inconsistent-on-answering-on-streaming-availability-queries/)；[Forbes](https://www.forbes.com/sites/rickellis/2026/06/04/chatgpt-and-claude-score-below-51-accuracy-on-streaming-availability/)
- USC 论文：[ACL Anthology](https://aclanthology.org/2021.emnlp-main.410/)；[arXiv](https://arxiv.org/abs/2103.11320)
- 流失率：[Broadband TV News](https://www.broadbandtvnews.com/2025/08/20/us-streaming-platforms-shift-focus-to-retention-as-churn-rates-surge/)；[Fabric](https://www.fabricdata.com/streaming-trends-in-the-usa-how-are-platforms-responding)；[MediaPost 关于 Antenna 交易数据](https://www.mediapost.com/publications/article/369573/double-digit-streamer-sub-churn-rates-transaction.html)
