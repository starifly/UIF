---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 快速搭建翻墙节点

** 本文配有 [视频教程](https://www.youtube.com/watch?v=w1AoAahpp6o) （需要翻墙）**

---

2024 年了，自建翻墙服务器的技术该更新更新。不要再使用 x-ui、V2rayN 等落后过时的东西。**跟着本文一步步学习有史以来最简单（傻瓜式）、最安全、最有效的自建翻墙 VPS 方法。** 破除封建迷信，其实你并不需要了解 GFW 防封伪装，更不需要购买域名才能搭建，** 我们会帮你选择出最佳最有性价比的方案**。

本文的最后，你会搭建一个使用 TLS 自签名证书的 [Hysteria2 服务器](https://hysteria.network/zh/)，并且拥有自己的专属订阅链接，不限制设备数量和上网人数，自己独享并完全控制属于自己的安全翻墙服务器。

**如遇到任何困难，请不用客气，随时可以去 [讨论区](https://github.com/UIforFreedom/UIF/issues) 寻求帮助，我们保证你的问题一定会得到回复。**

## 1 注册并购买搬瓦工 VPS

去到 [搬瓦工官网](https://bwh81.net/aff.php?aff=75590) 注册，邮箱和密码填对了就行，地址和电话可以随便填。如果你已有搬瓦工的账号，但也请注册一个新的，因为搬瓦工只支持账号注册 30 天内允许退款，为了权益最大化，不喜欢时随时可以退款。

### 1.1 选择购买 VPS 套餐

2024-07-08 最新报价，可以使用支付宝购买：

| 线路         | 落地          | 价格                               | 时长       | 解锁                  | 链接                                                            |
| ------------ | ------------- | ---------------------------------- | ---------- | --------------------- | --------------------------------------------------------------- |
| 多人共享     | 美国          | 49.99 美元（约 29 人民币/月）      | 一年       | Chatgpt、 Netflix     | [购买](https://bwh81.net/aff.php?aff=75590&pid=44)              |
| **优先分配** | **美国/日本** | **49.99 美元（约 116 人民币/月）** | **3 个月** | **Chatgpt、 Netflix** | **[购买](https://bwh81.net/aff.php?aff=75590&pid=87) 👍 **      |
| **市面最强** | **香港**      | **89.99 美元（约 629 人民币/月）** | **1 个月** | **Chatgpt、 Netflix** | **[购买](https://bwh81.net/aff.php?aff=75590&pid=95) 😱 顶级 ** |

### 1.2 通过终端面板连接

购买完成后，[搬瓦工](https://bwh81.net/aff.php?aff=75590)后台会提供远程登录的功能。选择在网页控制台操作，也可以使用 SSH 客户端远程登录。

## 2 安装 `UIF` 主程序

使用一键脚本安装；支持 Ubuntu 和 Centos 操作系统（ARM64 和 x64），推荐使用 Ubuntu x64，也是最常见的：

```bash
# 在终端或网页控制台中输入：
bash <(curl https://raw.githubusercontent.com/UIforFreedom/UIF/master/uifd/linux_install.sh)
```

**成功安装后，UIF 所有的东西都会放在目录 `/usr/bin/uif/`，可自行检查是否出错。**

## 3 启动

一键脚本安装成功后，会输出本机对应的`API 地址`和`密码`。你也可以使用 `systemd` 命令，开启或关闭 `uif`。

一些常用命令：

```bash
systemctl restart uiforfreedom # 重启 uif
systemctl stop uiforfreedom # 关闭 uif
```

### 3.1 查看密码

如果你忘记了密码，使用命令查看 UIF 自动生成的密码：

```bash
# 在终端中输入：
cat /usr/bin/uif/uif_key.txt
```

使用上面命令，应该会输出 UIF 的密码；如果显示的是该文件不存在，那么就意味着 UIF 未启动或未正确安装。

## 4 打开 Web 前端

选择以下任一方式，打开 UIF 的前端；也就是说，任意一台电脑或手机都可以使用 Web 前端操作已安装 UIF 的翻墙服务器。

<Tabs >
<TabItem value="local" label="本机（推荐）">

如果你本地电脑已安装并运行了 UIF，那么浏览器打开 [http://127.0.0.1:9527](http://127.0.0.1:9527) 或在右下角托盘里点击`打开面板`即可看到 UIF 面板。

</TabItem>

<TabItem value="remote" label="官网">

你也可以直接访问 [http://ui4freedom.org](http://ui4freedom.org) 也同样可以使用 UIF 面板。但是官网可能会被屏蔽打不开，建议本地安装 UIF，以防失联。

</TabItem>

</Tabs>

### 4.1 添加节点接口

到 `主页`，点击 `接口管理`，点击 `添加`，粘贴一键脚本生成的接口地址和密码，点击 `切换` 即可。如无意外，Web 会连接上翻墙节点的后端。

<!-- ![pic alt](../pics/66.gif) -->

## 5 设置入站

到 [入站页面](https://uiforfreedom.github.io/#/in/my)，点击右上角 `添加`，选择你喜欢的 `代理协议`，协议类型选择 Hysteria2， 选择启用 TLS，点击保存。最后`启用`即可。

## 6 分享到其他设备

去到 [设置](https://uiforfreedom.github.io/#/setting) ，点击 `复制订阅链接`；此时，一台翻墙服务器和订阅已经生成好了。参考怎么分享到 [移动端](../outbound/transer2mobile.md) 和 [电脑端](../quic/intro.md)，不限使用设备的数量。
