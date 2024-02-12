# UIF

**是一个具有 代理功能 和 订阅管理 的 UI 面板**

[[在线文档]](https://uiforfreedom.github.io/UIF_help/) [[下载地址]](https://github.com/UIforFreedom/UIF/releases)

---

## 支持的协议

- Vmess
- Trojan
- Vless
- Shadowsocks
- Socks
- Http
- Tun（透明代理）
- Tuic
- Hysteria
- Hysteria2
- Wireguard

**打开 https://uiforfreedom.github.io 预览全部功能** （需要下载后端才能正常使用）

## 支持的一键订阅

- Clash
- Clash-Meta
- V2rayN
- Sing-Box
<!-- - V2ray(V4)、xray -->

---

## TODO

- 所有出站都直连
- rules 自选出口
- 优化分享的 UI
- 优化 Clash API 显示，显示流量统计

## ChangeLog

### 2024-02-13 (v0.3.8)

- 初始化密码
- Linux 自动提权
- Linux 入站开放端口
- 更多的 Linux 安装测试
- TLS 优化
- 入站自动更新 TLS 证书
- Server 端支持自生成证书
- 入站修改时不影响实际值
- 修复 share meta 数据时的错误
- 提示重复端口
- 更新文档
- 优化 V2rayN 订阅

### 2024-02-10 (v0.3.7)

**春节快乐**

- 修复定期重启
- 修复 hysteria2 入站配置错误
- 入站不显示传输层
- 优化 In2Out 测试用例
- 更新文档
- 增加“分享”按钮
- 修复 Linux 安装脚本
- 修复 hysteria2 unknown obfs type
- 输入框限制使用空格
- shadowsocks 密码长度必须为 16
- 修复 shadowsocks 入站 unknown plugin
- 分享时转换成公网 IP
- 入站加域名选项
- 优化 grpc 路径显示 undefined
- 修复分享配置错误

### 2024-02-07 (v0.3.6)

- 修复网络检测
- 更新内核版本
- 更新订阅时并发

### 2024-02-01 (v0.3.5)

- 重构测延迟
- 优化 Xray 订阅
- 优化 hysteria2 配置，默认使用 BBR，不要求用户配置网速
- 优化 V2rayN 订阅解析
- 修复 CloseCore 锁
- 使用 QUIC 时不显示传输协议

### 2024-01-31 (v0.3.4)

- 优化界面

### 2024-01-27 (v0.3.4)

- 修复网络检测 Bug
- 优化界面
- 更新内核版本
- 修复重复 Tag bug

### 2024-01-14 (v0.3.3)

- 优化自动更新
- 更新内核版本

### 2024-01-10 (v0.3.2)

- 优化 Windows 提权
- 增加 MacOS 提权
- 优化 Window，MacOS 开机启动
- 修复 Shadowsocks Plugin Options 配置 Bug

### 2024-01-05 (v0.3.1)

- 优化 Shadowsocks Plugin 配置识别问题
- 优化一键启用所有订阅
- 修复 strict_route 配置错误
- Tun 增加 MTU 设置
- 更新内核版本到 1.8.0

### 2024-01-01 (v0.3.0)

**元旦快乐**

- 更新内核版本
- 增加 hysteria2 订阅
- 增加 Xray 配置导入

### 2023-12-29 (v0.2.7)

- 优化 wireguard 配置
- 更新内核版本
- 修复初始 Tun 配置错误
- 优化 Tun 配置
- 优化 address 读取

### 2023-12-25 (v0.2.6)

- 修复定时重启 Core 功能

### 2023-12-25 (v0.2.5)

- 修复重复生成 Key 的 Bug

### 2023-12-18 (v0.2.4)

- 修复 Websock 中 Host 默认值的 Bug

### 2023-12-5 (v0.2.3)

- 修复 GRPC 无法配置 Bug
- 修复配置数组类型初始化 Bug
- 更新内核版本到 v1.7.1
- 添加内核定时自动重启，减少内存，回收垃圾

### 2023-12-3 (v0.2.2)

- 修复第一次运行时无法添加订阅的 Bug
- 优化 NTP 服务器选择
- 更新 Golang 版本，不依赖 CGO
- 更新文档

### 2023-11-26 (v0.2.1)

- 默认内网监听，可以不需要密码

### 2023-11-14 (v0.1.11)

- 增加 Clash Meta 订阅
- 更新内核版本
- 修复订阅出错

### 2023-11-11 (v0.1.10)

- 修复网页配置类型 Bug

### 2023-11-06 (v0.1.9)

- 修复内核配置生成 Bug
- 更新内核数据库
- 默认关闭 Tun 的 ipv6

### 2023-10-26 (v0.1.6)

- 优化内核配置生成逻辑
- 更新内核版本到 `1.5.4`

### 2023-10-03 (v0.1.5)

- 添加 Sing-Box 订阅，配置无缝接入
- 添加 Clash 流量统计
- 优化配置生成逻辑
- 添加 Hysteria2

### 2023-10-01 (v0.1.4)

**重大更新**

- 重构自动更新
- 添加支持 Clash 路由
- 支持远程配置，方便分享到移动端
- 添加 NTP 自动时间校准
- 修复官网 API 请求缓慢 BUG
- 增加默认网站分流
