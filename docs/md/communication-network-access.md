# 3.6 网络访问清单

在受限网络中部署 Flocks 时，按实际使用场景最小化放行。下表用于客户配置防火墙或安全组；ThreatBook 域名列出当前完整解析 IP，其他公网域名列出当前部分解析 IP。

#### 本机或内网访问 Flocks

- 客户端访问 Flocks WebUI：5173/tcp
- 浏览器或脚本直连后端 API 时访问：8000/tcp
- 如果前面有反向代理，则按实际代理地址放行 80/443

<style>
.vp-doc table.network-access-table {
  display: table;
  width: 100%;
  min-width: 920px;
  table-layout: fixed;
  border-collapse: collapse;
  background: #ffffff;
  border: 1px solid #d8dee4;
  font-size: 14px;
}
.vp-doc table.network-access-table col.ip {
  width: 24%;
}
.vp-doc table.network-access-table col.protocol {
  width: 7%;
}
.vp-doc table.network-access-table col.port {
  width: 9%;
}
.vp-doc table.network-access-table col.description {
  width: 30%;
}
.vp-doc table.network-access-table col.domain {
  width: 30%;
}
.vp-doc table.network-access-table th,
.vp-doc table.network-access-table td {
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  color: #374151;
  line-height: 1.55;
  vertical-align: top;
  background: #ffffff;
  word-break: break-word;
}
.vp-doc table.network-access-table th {
  background: #f6f8fa;
  color: #111827;
  font-weight: 700;
  text-align: left;
}
.vp-doc table.network-access-table th[colspan="5"] {
  padding: 13px 12px;
  background: #e5e7eb;
  color: #111827;
  border-top: 2px solid #9ca3af;
  border-bottom: 1px solid #c5cbd3;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 17px;
  font-weight: 900;
  letter-spacing: 0;
  text-align: center;
}
.vp-doc table.network-access-table td:nth-child(2),
.vp-doc table.network-access-table td:nth-child(3),
.vp-doc table.network-access-table tr:not(:first-child) th:nth-child(2),
.vp-doc table.network-access-table tr:not(:first-child) th:nth-child(3) {
  text-align: center;
}
.vp-doc table.network-access-table td:nth-child(2),
.vp-doc table.network-access-table tr:not(:first-child) th:nth-child(2) {
  white-space: nowrap;
}
.vp-doc table.network-access-table code {
  color: #1f2937;
  background: #f6f8fa;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 1px 4px;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.vp-doc table.network-access-table td:nth-child(5) code {
  word-break: break-all;
}
</style>

<table class="network-access-table">
  <colgroup>
    <col class="ip">
    <col class="protocol">
    <col class="port">
    <col class="description">
    <col class="domain">
  </colgroup>
  <tbody>
    <tr><th colspan="5"><strong>在线安装：国内链路（使用 install_zh 脚本安装）</strong></th></tr>
    <tr><th>目标 IP</th><th>协议</th><th>端口</th><th>访问说明</th><th>域名</th></tr>
    <tr><td><code>180.76.198.77</code><br><code>180.76.198.225</code><br><code>180.76.199.13</code></td><td>tcp</td><td>443</td><td>源码与安装脚本下载</td><td><code>gitee.com</code></td></tr>
    <tr><td><code>155.102.209.201</code><br><code>155.102.209.202</code><br><code>155.102.209.203</code></td><td>tcp</td><td>443</td><td>Python 包下载</td><td><code>mirrors.aliyun.com</code></td></tr>
    <tr><td><code>155.102.209.201</code><br><code>155.102.209.202</code><br><code>155.102.209.203</code></td><td>tcp</td><td>443</td><td>npm 包下载</td><td><code>registry.npmmirror.com</code></td></tr>
    <tr><td><code>155.102.209.201</code><br><code>155.102.209.202</code><br><code>155.102.209.203</code></td><td>tcp</td><td>443</td><td>浏览器依赖下载</td><td><code>cdn.npmmirror.com</code></td></tr>
    <tr><td><code>62.146.173.132</code></td><td>tcp</td><td>443</td><td>uv 安装脚本下载</td><td><code>astral.org.cn</code></td></tr>
    <tr><td><code>104.21.25.131</code><br><code>172.67.134.65</code></td><td>tcp</td><td>443</td><td>uv 备用源</td><td><code>uv.agentsmirror.com</code></td></tr>
    <tr><td><code>104.26.12.77</code><br><code>104.26.13.77</code><br><code>172.67.68.3</code></td><td>tcp</td><td>443</td><td>uv 官方回退源</td><td><code>astral.sh</code></td></tr>
    <tr><th colspan="5"><strong>在线安装：国际链路（使用 install 脚本安装）</strong></th></tr>
    <tr><th>目标 IP</th><th>协议</th><th>端口</th><th>访问说明</th><th>域名</th></tr>
    <tr><td><code>20.27.177.113</code></td><td>tcp</td><td>443</td><td>源码仓库、压缩包与 Release 下载</td><td><code>github.com</code></td></tr>
    <tr><td><code>185.199.108.133</code><br><code>185.199.109.133</code><br><code>185.199.110.133</code></td><td>tcp</td><td>443</td><td>一键安装脚本、nvm 安装脚本下载</td><td><code>raw.githubusercontent.com</code></td></tr>
    <tr><td><code>151.101.0.223</code><br><code>151.101.64.223</code><br><code>151.101.128.223</code></td><td>tcp</td><td>443</td><td>Python 包下载</td><td><code>pypi.org</code></td></tr>
    <tr><td><code>104.16.0.34</code><br><code>104.16.1.34</code><br><code>104.16.2.34</code></td><td>tcp</td><td>443</td><td>npm 包下载</td><td><code>registry.npmjs.org</code></td></tr>
    <tr><td><code>104.26.12.77</code><br><code>104.26.13.77</code><br><code>172.67.68.3</code></td><td>tcp</td><td>443</td><td>uv 安装脚本下载</td><td><code>astral.sh</code></td></tr>
    <tr><td><code>104.16.212.131</code><br><code>104.16.213.131</code></td><td>tcp</td><td>443</td><td>Node.js 安装包下载</td><td><code>nodejs.org</code></td></tr>
    <tr><th colspan="5"><strong>ThreatBook 相关能力</strong></th></tr>
    <tr><th>目标 IP</th><th>协议</th><th>端口</th><th>访问说明</th><th>域名</th></tr>
    <tr><td><code>106.75.20.76</code></td><td>tcp</td><td>443</td><td>调用微步模型服务</td><td><code>llm.threatbook.cn</code></td></tr>
    <tr><td><code>165.154.193.42</code></td><td>tcp</td><td>443</td><td>调用微步模型服务</td><td><code>llm.threatbook.io</code></td></tr>
    <tr><td><code>106.75.9.53</code><br><code>106.75.12.3</code><br><code>117.50.12.40</code><br><code>117.50.19.28</code></td><td>tcp</td><td>443</td><td>X 社区、引导页或服务接入</td><td><code>x.threatbook.com</code></td></tr>
    <tr><td><code>199.60.103.26</code><br><code>199.60.103.126</code></td><td>tcp</td><td>443</td><td>引导页或服务接入</td><td><code>threatbook.io</code></td></tr>
    <tr><td><code>106.75.36.224</code><br><code>106.75.36.226</code><br><code>123.59.51.113</code><br><code>123.59.72.253</code></td><td>tcp</td><td>443</td><td>MCP 服务接入</td><td><code>mcp.threatbook.cn</code></td></tr>
    <tr><td><code>106.75.93.64</code></td><td>tcp</td><td>443</td><td>检查情报更新</td><td><code>static.threatbook.cn</code></td></tr>
    <tr><td><code>106.75.86.162</code><br><code>106.75.109.189</code></td><td>tcp</td><td>443</td><td>下载情报更新</td><td><code>static-js.threatbook.cn</code></td></tr>
    <tr><td><code>106.75.109.119</code></td><td>tcp</td><td>443</td><td>云端静态资源</td><td><code>static-css.threatbook.cn</code></td></tr>
    <tr><td><code>117.50.2.211</code></td><td>tcp</td><td>443</td><td>平台更新资源</td><td><code>static-img.threatbook.cn</code></td></tr>
    <tr><td><code>106.75.36.224</code><br><code>106.75.36.226</code><br><code>123.59.51.113</code><br><code>123.59.72.253</code></td><td>tcp</td><td>443</td><td>威胁情报云 API</td><td><code>api.threatbook.cn</code></td></tr>
    <tr><td><code>106.75.21.133</code><br><code>106.75.62.233</code><br><code>106.75.85.91</code><br><code>106.75.87.106</code></td><td>tcp</td><td>443</td><td>云沙箱</td><td><code>s.threatbook.com</code></td></tr>
    <tr><th colspan="5"><strong>Flocks Pro 云账号</strong></th></tr>
    <tr><th>目标 IP</th><th>协议</th><th>端口</th><th>访问说明</th><th>域名</th></tr>
    <tr><td><code>106.75.36.224</code><br><code>106.75.36.226</code><br><code>123.59.51.113</code><br><code>123.59.72.253</code></td><td>tcp</td><td>443</td><td>云账号登录页</td><td><code>passport.threatbook.cn</code></td></tr>
    <tr><td><code>106.75.19.23</code></td><td>tcp</td><td>443</td><td>Console API、登录 exchange、心跳、节点同步</td><td><code>portalflocks.threatbook.cn</code></td></tr>
    <tr><th colspan="5"><strong>Flocks Hub 在线下载</strong></th></tr>
    <tr><th>目标 IP</th><th>协议</th><th>端口</th><th>访问说明</th><th>域名</th></tr>
    <tr><td><code>106.75.19.23</code></td><td>tcp</td><td>443</td><td>云端插件目录、插件包下载或企业交付 Hub 下载服务</td><td><code>portalflocks.threatbook.cn</code></td></tr>
    <tr><td><code>20.27.177.113</code></td><td>tcp</td><td>443</td><td>GitHub 仓库与源码下载</td><td><code>github.com</code></td></tr>
    <tr><td><code>20.27.177.116</code></td><td>tcp</td><td>443</td><td>GitHub 目录 API</td><td><code>api.github.com</code></td></tr>
    <tr><td><code>20.27.177.114</code></td><td>tcp</td><td>443</td><td>GitHub 源码压缩包下载</td><td><code>codeload.github.com</code></td></tr>
    <tr><td><code>185.199.108.133</code><br><code>185.199.109.133</code><br><code>185.199.110.133</code></td><td>tcp</td><td>443</td><td>GitHub raw 文件下载</td><td><code>raw.githubusercontent.com</code></td></tr>
    <tr><td><code>185.199.108.133</code><br><code>185.199.109.133</code><br><code>185.199.110.133</code></td><td>tcp</td><td>443</td><td>GitHub 大文件资源下载</td><td><code>objects.githubusercontent.com</code></td></tr>
    <tr><td><code>185.199.108.154</code><br><code>185.199.109.154</code><br><code>185.199.110.154</code></td><td>tcp</td><td>443</td><td>GitHub Release 资源下载</td><td><code>github-releases.githubusercontent.com</code></td></tr>
    <tr><td><code>216.150.1.1</code></td><td>tcp</td><td>443</td><td>clawhub Skill 搜索</td><td><code>clawhub.com</code></td></tr>
    <tr><td><code>104.18.10.59</code><br><code>104.18.11.59</code></td><td>tcp</td><td>443</td><td>clawhub Skill 包下载</td><td><code>wry-manatee-359.convex.site</code></td></tr>
    <tr><td><code>64.239.109.129</code><br><code>64.239.123.1</code></td><td>tcp</td><td>443</td><td>skills.sh Skill 搜索或解析</td><td><code>skills.sh</code></td></tr>
    <tr><td><code>64.239.109.65</code><br><code>64.239.123.129</code></td><td>tcp</td><td>443</td><td>skills.sh Skill 搜索或解析</td><td><code>www.skills.sh</code></td></tr>
    <tr><td><code>106.75.6.154</code></td><td>tcp</td><td>443</td><td>SafeSkill CLI 检索或下载</td><td><code>safeskill.cn</code></td></tr>
    <tr><th colspan="5"><strong>IM 通道</strong></th></tr>
    <tr><th>目标 IP</th><th>协议</th><th>端口</th><th>访问说明</th><th>域名</th></tr>
    <tr><td><code>139.177.246.206</code><br><code>139.177.246.207</code></td><td>tcp</td><td>443</td><td>飞书机器人或开放平台接口</td><td><code>open.feishu.cn</code></td></tr>
    <tr><td><code>173.222.248.68</code><br><code>173.222.248.72</code></td><td>tcp</td><td>443</td><td>飞书国际版机器人或开放平台接口</td><td><code>open.larksuite.com</code></td></tr>
    <tr><td><code>161.117.70.119</code></td><td>tcp</td><td>443</td><td>钉钉机器人或开放平台接口</td><td><code>api.dingtalk.com</code></td></tr>
    <tr><td><code>43.163.165.94</code></td><td>tcp</td><td>443</td><td>企业微信机器人 WebSocket / 回调能力</td><td><code>openws.work.weixin.qq.com</code></td></tr>
    <tr><td>按企业微信返回的 MCP Host 解析</td><td>tcp</td><td>443</td><td>企业微信 <code>wecom_mcp</code> 运行时返回的 MCP URL</td><td>按企业微信返回的 MCP Host</td></tr>
    <tr><td><code>43.163.165.187</code><br><code>43.163.179.90</code></td><td>tcp</td><td>443</td><td>微信通道</td><td><code>ilinkai.weixin.qq.com</code></td></tr>
    <tr><td><code>114.221.149.151</code><br><code>114.222.112.72</code><br><code>121.229.91.162</code></td><td>tcp</td><td>443</td><td>微信通道 CDN</td><td><code>novac2c.cdn.weixin.qq.com</code></td></tr>
    <tr><td><code>149.154.166.110</code></td><td>tcp</td><td>443</td><td>Telegram Bot API</td><td><code>api.telegram.org</code></td></tr>
  </tbody>
</table>

*IP 解析结果可能随 DNS 调度变化；出口策略支持域名白名单时建议优先按域名放行，只能按 IP 放行时以客户现场解析结果为准。*

#### 运行期最小必需外联

- 放行 WebUI / API 访问端口，加上模型服务 Host 即可。
- 其余可按实际需求开放对应网络域名。
