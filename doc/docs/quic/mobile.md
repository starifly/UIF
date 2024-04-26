---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 移动端

首先你需要安装：

<Tabs groupId="operating-systems">
<TabItem value="android" label="安卓 Android">

- [SFA-1.8.11-universal.apk](/assets/release/SFA-universal.apk) （常见）
- [Github 通道（可能打不开）](https://github.com/SagerNet/sing-box/releases/latest)

</TabItem>

<TabItem value="ios" label="苹果 iPhone、iPad">

直接到 `应用商店` 搜索 [sing-box](https://apps.apple.com/us/app/sing-box/id6451272673) 并安装即可。但请先确保你的登录的 Apple ID 的地区不属于中国大陆，否则将无法搜索出来。

</TabItem>

</Tabs>

## 将电脑端的 UIF 配置导入到移动端

<Tabs groupId="operating-systems">
<TabItem value="remote" label="具有公网 IP">

可以直接使用订阅的方式。去到 [设置页面](https://uiforfreedom.github.io/#/settings/uif)，点击 `复制分享链接`；此时 `订阅链接` 已经生成好了。

到 移动端APP内 -> Profiles -> New Profiles

Type 选择为 Remote -> 粘贴 `订阅链接` -> 点击 Create 按钮后更新

完成以上步骤，移动端 APP 会远程请求你的 VPS 来获取订阅内容，每次你更新时，只需点击一下 `update` 即可。最后，点击 `enabled` 即可启用。

</TabItem>

<TabItem value="local" label="本地安装的，没有公网 IP">

去到 [设置页面](https://uiforfreedom.github.io/#/settings/uif)，点击 `复制分享链接`；此时 `订阅链接` 已经生成好了。然后粘贴到本地浏览器，网页打开后你会看到`配置内容`，直接全选复制。

到 移动端APP内 -> Profiles -> New Profiles

Type 选择为 Local -> 粘贴 `配置内容` -> 点击 Create 按钮。

完成以上步骤，点击 `enabled` 即可启用。但每次更新时，你需要复制粘贴 `配置内容`，比较麻烦。

</TabItem>

</Tabs>
