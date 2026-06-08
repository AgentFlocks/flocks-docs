<!--
 * @Author: John Yin 10972267+john-yin2333@user.noreply.gitee.com
 * @Date: 2026-05-12 18:17:53
 * @LastEditors: John Yin 10972267+john-yin2333@user.noreply.gitee.com
 * @LastEditTime: 2026-05-12 18:18:57
 * @FilePath: /flocks-test/Users/yinzhongchao/Documents/flocks_docs/docs/md/scenarios/alert-noise-reduction.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# 告警降噪

告警降噪场景用于把 TDP / NDR / XDR 等设备产生的大量告警先做过滤、归并和初步分级，再交给告警研判、通道通知或任务中心处理。

本场景的重点不是单条告警分析，而是稳定接收告警流、识别重复告警、合并同类事件，并把需要人工关注的部分输出出来。

## 部署要求

告警降噪通常需要部署在服务器上，不建议部署在个人电脑上。原因是 Syslog、设备回调或日志推送类数据需要由安全设备主动发送到 Flocks 所在机器，个人电脑通常不具备稳定的固定地址、长期在线能力和网络可达性。

推荐服务器规格：

| 项目 | 建议配置 |
| --- | --- |
| 部署形态 | 云主机或内网虚拟机均可 |
| CPU / 内存 | 8 核 32 GB |
| 磁盘 | 500 GB，建议预留日志与中间结果空间 |
| 操作系统 | CentOS、Ubuntu 或 Rocky Linux |
| 运行方式 | 长期在线，适合作为日志接收与任务执行节点 |

## 联网与连通条件

告警降噪能否落地，关键取决于 Flocks 服务器与安全设备之间的数据链路是否可达。

| 数据路径 | 连通要求 | 说明 |
| --- | --- | --- |
| Flocks 主动查询 TDP API | Flocks 服务器可以访问 TDP API 地址 | 适合主动拉取告警、定时查询、补充详情 |
| TDP 通过 Syslog 推送 | TDP 设备可以访问 Flocks 服务器的 Syslog 接收地址和端口 | 适合持续接收日志流；通常要求 Flocks 部署在服务器上 |


相关：[告警研判](/md/scenarios/alert-triage) · [内网安全产品接入](/md/scenarios/network-integration) · [任务中心](/md/modules/tasks) · [通道配置](/md/communication-channels)
