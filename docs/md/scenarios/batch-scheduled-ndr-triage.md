# 批量NDR研判工作流

**批量NDR研判工作流** 是基于 Flocks 内置工作流 `stream_alert_triage` 的持续研判方案。它用于周期性读取实时 NDR 降噪工作流产出的降噪结果，对剩余 HTTP 日志和告警进行批量研判，并生成当天的研判报告。

`stream_alert_triage` 会在工作流页面中展示为自定义或内置工作流卡片。

![工作流列表中的 stream_alert_triage](../../img/scenarios/alert-triage/batch-ndr-workflow-card.png)

## 1. 能力定位

实时 NDR 降噪工作流负责持续接收 TDP、SkyEye 等设备推送的 HTTP 流量日志，并过滤重复、低价值或确定性噪声。`stream_alert_triage` 则面向降噪后的剩余日志做进一步研判。

它适合处理：

- 经降噪后仍需要关注的 HTTP 日志和 NDR 告警。
- 按天或按时间窗归档的降噪结果文件。
- 需要周期性输出研判报告的值班、运营和复盘场景。
- 需要结合情报、资产、漏洞和 AI 研判能力的复杂告警。

## 2. 前置条件

使用 `stream_alert_triage` 前，建议先完成：

| 前置项 | 要求 |
| --- | --- |
| 大模型配置 | Flocks 已配置可用的大模型，并设置默认大模型。 |
| 实时 NDR 降噪工作流 | 已配置 [实时 NDR 降噪工作流](/md/scenarios/stream-ndr-alert-denoise)，并能生成当天的降噪结果文件。 |
| 数据目录 | `stream_alert_triage` 可以读取降噪工作流写入的降噪结果文件。 |
| 研判上下文 | 建议已接入威胁情报、资产信息、测绘结果或漏洞信息，便于增强研判质量。 |
| 任务中心 | 需要使用定时任务能力周期性触发工作流。 |

## 3. 核心原理

`stream_alert_triage` 的核心逻辑是：按 `input_date` 定位当天的降噪结果文件，读取降噪后保留下来的日志数据，再结合多类上下文完成批量研判。

研判过程中通常会结合：

- **情报**：IP、域名、URL、文件哈希等 IOC 的外部情报与历史记录。
- **Flocks AI 研判能力**：基于日志字段、请求路径、状态码、规则命中和上下文生成研判结论。
- **测绘**：补充公网资产、服务暴露、域名解析和端口信息。
- **资产漏洞分析**：结合目标资产、组件、漏洞和攻击路径判断风险等级。
- **NDR HTTP 日志字段**：包括源 / 目的 IP、域名、URL、HTTP 方法、状态码、规则名、告警等级和原始日志。

工作流会汇总研判结果，并生成 `pipeline_summary.md` 等报告文件，供会话总结、通道通知或人工复核使用。

![stream_alert_triage 工作流详情](../../img/scenarios/alert-triage/batch-ndr-workflow-detail.png)

## 4. 部署方式

该工作流可以作为内置工作流使用，也可以放置到用户插件目录的工作流目录中：

```text
~/.flocks/plugins/workflows/
└── stream_alert_triage/
    ├── workflow.md
    ├── workflow.json
    └── ...
```

放置完成后，刷新 Flocks，系统会自动扫描 `~/.flocks/plugins/workflows` 下的工作流目录，并在 **工作流** 页面识别和展示。识别后可以进入详情页查看流程图、运行统计和工作流文件。

更多工作流安装和调用方式可参考：[Workflow 工作流](/md/modules/workflow) 与 [调用工作流](/md/modules/workflow-invoke)。

## 5. 开启定时研判

推荐通过 **任务中心 → 定时任务** 周期性调用 `stream_alert_triage`。定时任务会按照设定频率运行工作流，读取经实时 NDR 降噪工作流处理后的剩余日志数据，再生成本轮研判报告。

可以在会话中让 Rex 创建定时任务，任务描述可以写成：

```text
运行 stream_alert_triage 工作流，输入 `input_date` 为今天的日期（格式 YYYY-MM-DD）。工作流会自动读取当天的降噪结果文件，执行研判并生成报告。完成后读取生成的 `pipeline_summary.md` 并总结本次研判的关键结论（高危告警数量、攻击成功率、主要攻击类型等）。
```

推荐频率：**每 2 到 6 小时研判一次**。如果日志量较大，可以缩短到每 2 小时；如果日志量较小，或只需要值班摘要，可以设置为每 4 到 6 小时。

![创建 stream_alert_triage 定时任务](../../img/scenarios/alert-triage/batch-ndr-schedule-created.png)

创建完成后，可以在 **任务中心 → 定时任务** 中查看任务状态、执行频率、下次执行时间和启停状态。

![任务中心中的 stream_alert_triage 定时任务](../../img/scenarios/alert-triage/batch-ndr-task-center.png)

## 6. 运行结果

定时任务触发后，工作流会读取 `input_date` 对应日期的降噪结果。如果当天实时 NDR 降噪工作流尚未生成降噪结果文件，研判任务会提示无可处理数据；待降噪工作流写入结果后，下一次定时触发会自动继续研判。

一次成功运行通常会产出：

- 本轮读取的降噪后日志数量。
- 高危告警数量和攻击成功率。
- 主要攻击类型、关键源 IP、目标资产和 URL。
- 结合情报、测绘和漏洞上下文后的风险结论。
- 每条告警的结构化研判字段，包括是否为攻击、攻击是否成功、置信度 / 风险级别、判定结果和 Flocks AI 研判报告。
- `pipeline_summary.md` 研判摘要报告。

工作流会始终返回结构化结果，并写入总览报告：

```text
~/.flocks/workspace/outputs/<YYYY-MM-DD>/artifacts/stream_alert_triage_summary.md
```

研判后的完整告警默认写入 SOC 数据库，而不是默认写 JSONL 文件：

```text
~/.flocks/data/soc.db
```

如果启用 JSONL 输出，研判结果会写入工作空间的工作流目录：

```text
workspace/workflows/stream_alert_triage/
```

其中按日期存放 `triage_result_NNN.jsonl` 等可选产物。实时 NDR 降噪工作流的降噪结果会写入 `workspace/workflows/stream_alert_denoise/`，`stream_alert_triage` 会读取这些结果继续研判，再按配置写入 SOC 数据库、JSONL 文件或两者同时写入。

![stream_alert_triage 的工作空间产物目录](../../img/scenarios/alert-triage/batch-ndr-workspace-results.png)

## 7. 写入方式与数据库字段

`stream_alert_triage` 支持两类持久化写入：SOC 数据库和 JSONL 文件。默认配置是写入 SOC 数据库，便于 SOC 工作区页面和 `soc_workspace_query` 工具查询。

### 7.1 输出模式

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `triage_output_mode` | `soc_db` | 输出模式，支持 `soc_db`、`jsonl`、`both`、`none`。 |
| `soc_db_path` | `~/.flocks/data/soc.db` | SOC 数据库默认路径。 |
| `jsonl_output_dir` | 空 | 可选 JSONL 输出目录；为空时使用 `workspace/workflows/stream_alert_triage/<YYYY-MM-DD>/`。 |
| `persist_triage_output` | `false` | 旧兼容参数；在 `soc_db` 模式下设为 `true` 时，会额外写 JSONL，相当于 `both`。 |

各输出模式的行为：

| 输出模式 | 写 SOC DB | 写 JSONL | 适用场景 |
| --- | --- | --- | --- |
| `soc_db` | 是 | 否 | 默认模式，供 SOC 工作区页面和查询工具使用。 |
| `jsonl` | 否 | 是 | 只需要文件归档或给下游脚本消费。 |
| `both` | 是 | 是 | 既要 SOC 工作区展示，也要保留文件产物。 |
| `none` | 否 | 否 | 只看本次工作流返回值；仍可能写入研判缓存和总览报告。 |

### 7.2 SOC 数据库表结构

当前默认数据库文件：

```text
~/.flocks/data/soc.db
```

研判后的告警写入 `alert_records` 表。表结构如下：

```sql
CREATE TABLE alert_records (
    row_id TEXT PRIMARY KEY,
    record_id TEXT,
    asset_date TEXT NOT NULL,
    source_file TEXT NOT NULL,
    line_number INTEGER NOT NULL,
    event_time INTEGER,
    source_type TEXT,
    threat_name TEXT,
    is_duplicate INTEGER NOT NULL DEFAULT 0,
    record_json TEXT NOT NULL
);
```

字段说明：

| 字段 | SQLite 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `row_id` | `TEXT` | 是，主键 | 数据库行唯一 ID，用于避免重复写入同一条来源记录。 |
| `record_id` | `TEXT` | 否 | 告警原始 ID，通常来自降噪结果中的 `id` 字段。 |
| `asset_date` | `TEXT` | 是 | 资产 / 告警日期，格式通常为 `YYYY-MM-DD`，用于按天查询和分区展示。 |
| `source_file` | `TEXT` | 是 | 记录来源文件，通常是上游 `dedup_result_NNN.jsonl` 的相对路径或文件名。 |
| `line_number` | `INTEGER` | 是 | 来源 JSONL 文件中的行号；文件头行会被跳过。 |
| `event_time` | `INTEGER` | 否 | 告警事件时间，通常是 Unix 时间戳秒级值。 |
| `source_type` | `TEXT` | 否 | 告警来源类型，例如 `tdp`、`skyeye`。 |
| `threat_name` | `TEXT` | 否 | 威胁名称，例如 SQL 注入、Webshell 扫描、内网穿透等。 |
| `is_duplicate` | `INTEGER` | 是 | 是否为重复告警，`0` 表示否，`1` 表示是。 |
| `record_json` | `TEXT` | 是 | 完整告警 JSON 字符串，包含降噪字段和研判字段。 |

`record_json` 会保留完整记录，因此页面或查询工具需要的详细字段通常从这里解析。常见内容包括：

- 降噪阶段字段：`dedup_key`、`is_duplicate`、`_lsh_cluster_id`、`_source_type`、`_process_type`。
- 网络与 HTTP 字段：`sip`、`dip`、`sport`、`dport`、`direction`、`req_host`、`req_http_url`、`req_body`、`rsp_status_code`、`rsp_body`。
- 威胁字段：`threat_rule_id`、`threat_name`、`threat_type`、`threat_phase`、`threat_result`、`threat_confidence`。
- 研判字段：`attack_verdict`、`attack_success`、`risk_level`、`confidence`、`decision`、`decision_label`、`report_title`、`triage_report`、`triage_status`、`triage_source`、`triage_ms`。

数据库会为常用查询字段创建索引：

```sql
CREATE INDEX idx_alert_records_asset_date ON alert_records(asset_date);
CREATE INDEX idx_alert_records_record_id ON alert_records(record_id);
CREATE INDEX idx_alert_records_source_type ON alert_records(source_type);
CREATE INDEX idx_alert_records_threat_name ON alert_records(threat_name);
CREATE INDEX idx_alert_records_duplicate ON alert_records(is_duplicate);
```

### 7.3 数据契约元信息表

数据库中还包含 `contract_meta` 表，用于保存写入数据和前端 UI 之间的数据协议元信息。SOC 工作区页面和查询工具可以通过这张表判断 `alert_records.record_json` 应该按哪个 schema 解析，以及当前数据库由哪些来源文件生成。

表结构如下：

```sql
CREATE TABLE contract_meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
```

字段说明：

| 字段 | SQLite 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `key` | `TEXT` | 是，主键 | 元信息键名。 |
| `value` | `TEXT` | 是 | 元信息值。可以是普通字符串，也可以是 JSON 字符串。 |

当前常见 key：

| key | 示例值 | 说明 |
| --- | --- | --- |
| `schemaVersion` | `soc.alerts.sqlite.v1` | SOC 告警 SQLite 数据协议版本。前端 UI 和查询工具应优先根据该版本选择解析逻辑。 |
| `generatedAt` | `2026-07-01T13:36:57` | 数据库或本批数据生成时间，用于判断数据新鲜度。 |
| `sourceRoot` | `~/.flocks/plugins/contracts/webui/soc_ui/.../assets` | 数据契约或前端资源根目录，用于指引 UI 找到对应协议、字段映射或静态资源。 |
| `recordCount` | `6427` | 当前写入或生成时记录的告警数量，可用于页面展示、校验和排障。 |
| `sourceFiles` | `["2026-07-01/dedup_result_001.jsonl"]` | 本批数据来源文件列表，通常是 JSON 字符串数组。 |

`contract_meta` 的核心作用是把数据库表结构、`record_json` 里的业务字段和前端 UI 的展示协议连接起来：

- 写入侧通过 `schemaVersion` 声明当前 `record_json` 字段语义。
- 前端 UI 通过 `schemaVersion` 决定如何解析告警字段、研判字段和统计口径。
- `sourceRoot` 指向 SOC UI 数据契约或资源位置，便于页面加载字段映射、图表配置或默认展示规则。
- `recordCount` 和 `sourceFiles` 便于判断页面展示的数据量是否与写入批次一致。

如果后续调整 `record_json` 字段结构、字段命名或前端展示协议，应同步升级 `schemaVersion`，并确保 SOC 工作区 UI、`soc_workspace_query` 和写入工作流使用同一套协议。

### 7.4 JSONL 文件写入

当 `triage_output_mode=jsonl`、`triage_output_mode=both`，或旧参数 `persist_triage_output=true` 生效时，工作流会写入研判 JSONL 文件：

```text
~/.flocks/workspace/workflows/stream_alert_triage/<YYYY-MM-DD>/triage_result_NNN.jsonl
```

每个 JSONL 文件第一行是文件头，包含 `workflow`、`seq`、`run_id`、`batch_total`、`batch_triaged`、`batch_followers_reused`、`batch_cache_hit` 和 `batch_triage_failed` 等批次信息。后续每一行是一条带研判字段的完整告警记录。

## 8. 产出示例 JSON

`stream_alert_triage` 会读取 `stream_alert_denoise` 产出的降噪结果，并给每条告警追加研判字段。除了面向人阅读的 Flocks AI 研判报告，结果里也会包含可用于落库、筛选和自动化处置的结构化判定。

核心判定字段可以这样理解：

| 字段 | 说明 |
| --- | --- |
| `attack_verdict` | Flocks AI 的最终判定，常见取值包括 `attack_success`、`attack_failed`、`attack`、`unknown`、`benign`。 |
| `attack_success` | 攻击是否成功，`true` 表示研判为攻击成功。 |
| `risk_level` | 风险 / 置信强度分级，通常为 `High`、`Medium`、`Low`。 |
| `triage_report` | Flocks AI 生成的完整研判报告，包含证据、攻击载荷、响应特征和处置建议。 |
| `triage_status` | 本条告警的研判执行状态，例如 `ok`、`cached`、`reused_from_leader`、`failed`。 |
| `triage_source` | 研判来源，例如新研判、缓存复用或同批次 follower 复用。 |

对于业务系统来说，`attack_verdict` 可以直接作为“判定成功的结果”字段使用；也可以派生出 `is_attack`、`attack_succeeded` 和 `confidence` 等更直观的展示字段。

一次运行后的精简结果可以参考：

```json
{
  "summary_path": "~/.flocks/workspace/outputs/2026-06-26/artifacts/stream_alert_triage_summary.md",
  "top_attack_verdict": "attack_success",
  "top_risk_level": "High",
  "top_report_title": "SQL注入攻击成功，需立即处置",
  "top_triage_report": "# SQL注入攻击研判报告\n\n## 研判结论\n该告警具备明确攻击载荷和响应证据，判定为攻击成功...",
  "triage_stats": {
    "total": 3,
    "unique_dedup_keys": 2,
    "work_units": 2,
    "cache_hit": 0,
    "followers_reused": 1,
    "triaged": 2,
    "triage_failed": 0,
    "verdict_counts": {
      "attack_success": 1,
      "attack_failed": 1
    },
    "elapsed_ms": 18420,
    "output_paths": [
      "~/.flocks/workspace/workflows/stream_alert_triage/2026-06-26/triage_result_001.jsonl"
    ]
  },
  "triage_results": [
    {
      "dedup_key": "b7428a52e96c835c9f72efb555d36772",
      "has_dedup_key": true,
      "threat_name": "SQL注入",
      "sip": "1.2.3.4",
      "dip": "10.0.0.1",
      "is_duplicate": false,
      "triage_source": "triaged",
      "triage_status": "ok",
      "attack_verdict": "attack_success",
      "risk_level": "High",
      "report_title": "SQL注入攻击成功，需立即处置",
      "triage_ms": 9210,
      "triage_error": null
    }
  ]
}
```

如果需要查看单条告警的完整研判结果，可以读取 `enriched_alerts_with_triage` 或 `triage_result_NNN.jsonl`。其中会保留降噪阶段的字段，并追加研判字段：

```json
{
  "id": "AZtRkZkzj",
  "sip": "1.2.3.4",
  "dip": "10.0.0.1",
  "req_http_url": "/admin?id=1' or '1'='1",
  "threat_name": "SQL注入",
  "dedup_key": "b7428a52e96c835c9f72efb555d36772",
  "is_duplicate": false,
  "has_dedup_key": true,
  "triage_source": "triaged",
  "triage_status": "ok",
  "attack_verdict": "attack_success",
  "attack_success": true,
  "risk_level": "High",
  "confidence": "High",
  "is_attack": true,
  "attack_succeeded": true,
  "decision": "attack_success",
  "decision_label": "攻击成功",
  "report_title": "SQL注入攻击成功，需立即处置",
  "triage_report": "# SQL注入攻击研判报告\n\n## 研判结论\n本次请求包含明显 SQL 注入载荷，响应内容存在异常回显，结合情报和 HTTP 响应证据，判定为攻击成功。\n\n## 关键证据\n- 请求路径包含 SQL 注入特征\n- 目标服务返回异常数据库相关响应\n- 源 IP 命中威胁情报记录\n\n## 处置建议\n封禁源 IP，排查目标资产访问日志，并对相关接口进行参数化修复。",
  "triage_ms": 9210
}
```

示例中的 `is_attack`、`attack_succeeded`、`confidence`、`decision` 和 `decision_label` 是面向业务展示的读取口径：其中 `decision` 对应工作流原生的 `attack_verdict`，`attack_succeeded` 对应 `attack_success`，`confidence` 可按 `risk_level` 和报告证据强度归一化展示。

## 9. 上线检查

正式启用前，建议确认：

- Flocks 默认大模型可用，且模型能力满足批量研判需求。
- 实时 NDR 降噪工作流已经接入 TDP、SkyEye 或其他 NDR 日志源。
- 降噪工作流已经产生当天的降噪结果文件。
- `stream_alert_triage` 工作流可以读取降噪结果文件所在目录。
- 默认输出模式是否符合预期：保留 `triage_output_mode=soc_db`，或按需要切换为 `jsonl` / `both` / `none`。
- 如果使用 SOC 工作区展示，确认 `~/.flocks/data/soc.db` 可写，并且 `alert_records` 中有数据。
- 定时任务频率合理，避免与日志写入、报告生成或通道通知互相抢占资源。

相关：[告警研判](/md/scenarios/alert-triage) · [实时 NDR 降噪工作流](/md/scenarios/stream-ndr-alert-denoise) · [任务中心](/md/modules/tasks) · [调用工作流](/md/modules/workflow-invoke)
