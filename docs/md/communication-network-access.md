<!--
 * @Author: John Yin 10972267+john-yin2333@user.noreply.gitee.com
 * @Date: 2026-06-12 10:41:13
 * @LastEditors: John Yin 10972267+john-yin2333@user.noreply.gitee.com
 * @LastEditTime: 2026-06-12 10:44:11
 * @FilePath: /flocks_docs/docs/md/communication-network-access.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# 3.6 网络访问清单

在受限网络中部署 Flocks 时，不建议一次性放开全部公网访问，而应按**本机访问**、**安装/升级**和**运行期按功能放行**三类最小化配置。

1. 本机或内网访问 Flocks
   - 客户端访问 Flocks WebUI：`5173/tcp`
   - 浏览器或脚本直连后端 API 时访问：`8000/tcp`
   - 如果前面有反向代理，则按实际代理地址放行 `80/443`
2. 在线安装或升级阶段需要访问的出站 Host

国内环境默认使用 `install_zh` 链路：

| 用途 | Host |
| --- | --- |
| 源码与安装脚本 | `gitee.com` |
| Python 包索引 | `mirrors.aliyun.com` |
| npm 包索引 | `registry.npmmirror.com` |
| 浏览器依赖下载 | `cdn.npmmirror.com` |
| uv 安装脚本 | `astral.org.cn` |
| uv 备用源 | `uv.agentsmirror.com` |
| uv 官方回退源 | `astral.sh` |

国外环境默认使用 `install` 链路：

| 用途 | Host |
| --- | --- |
| 源码仓库与压缩包 | `github.com` |
| 一键安装脚本与 nvm 安装脚本 | `raw.githubusercontent.com` |
| Python 包索引 | `pypi.org` |
| npm 包索引 | `registry.npmjs.org` |
| uv 安装脚本 | `astral.sh` |
| Node.js 手动下载页 | `nodejs.org` |

Docker 在线拉镜像时，还需要放行 `ghcr.io`，或你们实际使用的 GHCR 镜像域名。如果你们通过环境变量覆写了 npm、PyPI、uv、nvm 或镜像地址，则应以实际覆写后的 Host 为准，而不是以上默认值。

3. 运行期最小必需外联
   - 放行你在 Flocks 中实际配置的大模型 `Base URL` 对应 Host
   - 如果只做离线 Docker 导入镜像部署，且模型、情报、通道都走内网或本地服务，则 Flocks 本体运行本身不强依赖公网
4. ThreatBook 相关能力
   - 大模型与引导场景可能涉及：`llm.threatbook.cn`、`llm.threatbook.io`
   - 引导页、服务接入与 MCP 相关访问可能涉及：`x.threatbook.com`、`threatbook.io`、`mcp.threatbook.cn`
5. IM 通道按需放行
   - 飞书：`open.feishu.cn`
   - 飞书国际版：`open.larksuite.com`
   - 钉钉：`api.dingtalk.com`
   - 企业微信：`openws.work.weixin.qq.com`
   - 企业微信 `wecom_mcp` 场景：还需要额外放行企业微信运行时动态返回的 MCP URL 对应 Host
   - 微信：`ilinkai.weixin.qq.com`、`novac2c.cdn.weixin.qq.com`
   - Telegram：`api.telegram.org`
  
- 仅本地使用：放行 WebUI / API 访问端口，加上模型服务 Host 即可。
- 需要在线安装：在最小集合上，再增加安装与升级阶段的依赖站点。
- 需要情报或 IM 集成：再按 ThreatBook、飞书、钉钉、企微、微信、Telegram 等启用项逐项加白，而不是全部放开。
