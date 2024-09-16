---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import MyVideoUrl from './myself.mp4';
import ReactPlayer from 'react-player'

# 快速搭建翻墙节点

** 本文 4K 高清视频已上传到 [Youtube](https://www.youtube.com/watch?v=w1AoAahpp6o)**

<ReactPlayer controls url={MyVideoUrl}  width="100%" height="100%" />

---

2024 年了，自建翻墙服务器的技术该更新更新。不要再使用 x-ui、V2rayN 等落后过时的东西。**跟着本文一步步学习有史以来最简单（傻瓜式）、最安全、最有效的一键自建翻墙 VPS 方法。** 破除封建迷信，其实你并不需要了解 GFW 防封伪装，更不需要购买域名才能搭建，** 我们会帮你选择出最佳最有性价比的方案**。

本文的最后，你会使用一键脚本搭建好一个 TLS 自签名证书的 [Hysteria2 服务器](https://hysteria.network/zh/)，并且拥有自己的专属订阅链接，不限制设备数量和上网人数，自己独享并完全控制属于自己的安全翻墙服务器。

**如遇到任何困难，请不用客气，随时可以去 [讨论区](https://github.com/UIforFreedom/UIF/issues) 寻求帮助，我们保证你的问题一定会得到回复。**

## 1 注册并购买搬瓦工 VPS

去到 [搬瓦工官网](https://bwh81.net/aff.php?aff=75590) 注册，邮箱和密码填对了就行，地址和电话可以随便填。如果你已有搬瓦工的账号，但也请注册一个新的，因为搬瓦工只支持账号注册 30 天内允许退款，为了权益最大化，不喜欢时随时可以退款。

### 1.1 选择购买 VPS 套餐

2024 年 8 月最新报价，可以使用支付宝购买：

| 线路         | 落地          | 价格                               | 时长       | 解锁                  | 链接                                                            |
| ------------ | ------------- | ---------------------------------- | ---------- | --------------------- | --------------------------------------------------------------- |
| 多人共享     | 美国          | 49.99 美元（约 29 人民币/月）      | 一年       | Chatgpt、 Netflix     | [购买](https://bwh81.net/aff.php?aff=75590&pid=44)              |
| **优先分配** | **美国/日本** | **49.99 美元（约 116 人民币/月）** | **3 个月** | **Chatgpt、 Netflix** | **[购买](https://bwh81.net/aff.php?aff=75590&pid=87) 👍 **      |
| **市面最强** | **香港**      | **89.99 美元（约 629 人民币/月）** | **1 个月** | **Chatgpt、 Netflix** | **[购买](https://bwh81.net/aff.php?aff=75590&pid=95) 😱 顶级 ** |

### 1.2 通过终端面板连接

购买完成后，[搬瓦工](https://bwh81.net/aff.php?aff=75590)后台会提供远程登录的功能。选择在网页控制台操作，也可以使用 SSH 客户端远程登录。

## 2 一键脚本安装 `UIF` 主程序

使用一键脚本安装；支持具有 [systemd](https://zh.wikipedia.org/zh-cn/Systemd) 或 [openWrt/procd](https://github.com/openwrt/procd) 的 Linux 操作系统；**一键脚本成功安装后，UIF 所有的东西都会放在目录 `/usr/bin/uif/`，可自行检查是否出错。该一键脚本也可以作为更新脚本。**

根据自己的类型选择：

<Tabs >
<TabItem value="linux" label="Ubuntu、Centos 等常见 Linux">

```bash
# 运行前确保安装了bash、tar 和 curl，并具有 sudo 权限
curl -L -O "https://fastly.jsdelivr.net/gh/UIforFreedom/UIF@master/uifd/linux_install.sh" && chmod 755 ./linux_install.sh && bash ./linux_install.sh
```

</TabItem>

<TabItem value="openwrt" label="openWrt 等软路由">

```bash
# 运行前确保安装了bash、tar 和 curl，并具有 sudo 权限
opkg update
opkg install bash
opkg install curl
opkg install tar

curl -L -O "https://fastly.jsdelivr.net/gh/UIforFreedom/UIF@master/uifd/linux_install.sh" && chmod 755 ./linux_install.sh && bash ./linux_install.sh
```

</TabItem>

<TabItem value="custom" label="自定义安装">

只要是 Linux 系统，都可以正常运行 UIF。如果一键脚本不能在你的系统上正常使用，那么可以选择手动安装：

**- 第一步，下载压缩包**

先确定你机器的架构，比如说是 `arm64`，那么可以使用 `curl` 或者 `wget`（先确保已安装了） 根据包名`uif-linux-arm64.tar.gz` 下载；去 [这里](https://github.com/UIforFreedom/UIF/releases) 查看全部已编译好可用的架构，如果没有你对应机器的架构，请移步到 [讨论区](https://github.com/UIforFreedom/UIF/issues)。

```bash
# 举例：
curl -L -O https://github.com/UIforFreedom/UIF/releases/latest/download/uif-linux-arm64.tar.gz
```

Github 可能被屏蔽了，可以选择另一个下载地址：

```bash
curl -L -O https://ui4freedom.org/UIF_help/assets/release/uif-linux-arm64.tar.gz
```

** - 第二步，解压**

先确保 `tar` 是正常使用的。你可以解压到任意地方。

```bash
# 举例：
tar -xzf "./uif-linux-arm64.tar.gz"
```

** - 第三步，设置 `uif_api_address.txt`**

在 UIF 的目录里新建一个名叫 `uif_api_address.txt` 的文本文件，往里面写入你想要使用的端口。

```bash
# 举例：
# 必须设置为 0.0.0.0，意味着公网可见
echo "0.0.0.0:1234" | tee "./uif_api_address.txt" > /dev/null
```

** - 第四步，运行并查看密码**

可以在 UIF 的目录中看到一个名叫 `uif` 的可运行主程序。首先得确保有运行的权限，然后直接运行即可。

```bash
chmod -R 755 ./    # 确保 UIF 的目录都有足够的权限
./uif              # 运行 UIF 的主程序
```

成功运行后，在 UIF 的目录中有一个名为 `uif_key.txt` 的密码。

```bash
cat ./uif_key.txt # 查看自动生成的密码
```

</TabItem>

</Tabs>

## 3 启动

**一键脚本安装成功后，会输出本机对应的`API 地址`和`密码`**。你也可以使用固定命令，开启或关闭 `uif`。一些常用命令：

<Tabs >
<TabItem value="linux" label="Ubuntu、Centos 等常见 Linux">

```bash
systemctl restart ui4freedom # 运行
systemctl stop ui4freedom # 关闭
systemctl enable ui4freedom # 开机自启
systemctl disable ui4freedom # 取消开机自启
```

</TabItem>

<TabItem value="openwrt" label="openWrt 等软路由">

```bash
/etc/init.d/ui4freedom.sh start # 运行
/etc/init.d/ui4freedom.sh stop # 关闭
/etc/init.d/ui4freedom.sh enable # 开机自启
/etc/init.d/ui4freedom.sh disable # 取消开机自启
```

</TabItem>

<TabItem value="custom" label="自定义安装">

你可以使用 `nohup` 命令或者写一个系统服务，让启动关闭更加简单。

```bash
# 举例：
nohup ./uif
```

</TabItem>

</Tabs>

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

### 4.1 填写节点接口信息

到 `主页`，点击 `接口管理`，点击 `添加`，粘贴一键脚本生成的接口地址 **(http://IP地址:端口)** 和密码，点击 `切换` 即可。如无意外，Web 会连接上翻墙节点的后端。

<!-- ![pic alt](../pics/66.gif) -->

## 5 设置入站

确保成功连接到了后端，去 [入站页面](https://uiforfreedom.github.io/#/in/my)，点击右上角 `添加`，`代理协议` 选择 Hysteria2， 选择启用 TLS，点击保存。最后`启用`即可。

## 6 分享到其他设备

此时，一台翻墙服务器和订阅服务器已经生成好了。去到 [设置](https://uiforfreedom.github.io/#/setting) ，点击 `复制订阅链接`，然后导入到其他设备上就可以使用，参考 [移动端](https://www.url.com) 和 [电脑端](https://www.url.com) 的安装使用教程，将自己的 `订阅链接` 分享到其他设备上使用。
