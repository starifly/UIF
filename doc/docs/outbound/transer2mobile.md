---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 分享节点

** 本文配有 [视频教程](https://www.youtube.com/watch?v=J4IFKoUUGWM&t=5s) （需要翻墙）**

---

假如你想将 Clash/V2rayN 的订阅也可以同时在其他电脑或手机上使用，你可以先在电脑导入订阅，生成UIF的订阅，然后分享到其他设备上。

首先你得安装了 [移动端](../quic/mobile.md) 和 [电脑端](../quic/intro.md)，然后才能进行下一步操作。

## 1 电脑端添加需要转换的订阅

去到 [我的订阅](https://uiforfreedom.github.io/#/out/subscribe)，添加订阅（你的机场订阅等节点信息）。点击启用你想要分享的节点，或者直接全部启用也可以。

## 2 在电脑端生成移动端的配置

在电脑上打开 [设置页面](https://uiforfreedom.github.io/#/settings/uif)，点击 `复制分享链接`；此时 `订阅链接` 已经生成好了。

![复制订阅](../pics/m1.png)

然后粘贴到本地浏览器，网页打开后你会看到`订阅内容`。如果打不开，请确保电脑的防火墙放行了对应端口。

![查看订阅内容](../pics/m2.png)

## 3 分享到移动端

有两种方法：

<Tabs >
<TabItem value="local" label="原始配置（Local）">

通过分享原始的配置数据。优点就是方便简约要求不高，缺点是每次更新都需重新复制粘贴，无法一键更新。

全选复制电脑端生成的`订阅内容`。通过把订阅内容存放到 txt 文件里面，然后通过微信、邮箱等方式，将电脑生成的`订阅内容`传送到你的手机上。

实际上生成的`订阅内容`就是一串文字，只要能传输到你的移动设备上就行，用户无需在意订阅内容、多余空格或者换行。

<Tabs groupId="operating-systems">
<TabItem value="android" label="安卓 Android">

打开APP，新建订阅:

import android1 from '../pics/m3.png';
import android2 from '../pics/m4.png';
import android3 from '../pics/m5.png';
import android4 from '../pics/m6.png';
import android5 from '../pics/m7.png';
import android6 from '../pics/m8.png';
import android7 from '../pics/m9.png';
import android8 from '../pics/m10.png';
import android9 from '../pics/m11.png';

<img src={android1} width="400" height="400"/>
<img src={android2} width="400" height="400"/>
<img src={android3} width="400" height="400"/>
<img src={android4} width="400" height="400"/>
<img src={android5} width="400" height="400"/>
<img src={android6} width="400" height="400"/>
<img src={android7} width="400" height="400"/>
<img src={android8} width="400" height="400"/>
<img src={android9} width="400" height="400"/>

再次使用时，无需再粘贴 `订阅内容` ，直接“启用”即可；除非`订阅内容`有更新，你需要再次复制粘贴到手机端。

</TabItem>

<TabItem value="ios" label="苹果 iPhone、iPad">

到 `应用商店` 搜索 [sing-box](https://apps.apple.com/us/app/sing-box/id6451272673) 并安装即可。但请先确保你的登录的 Apple ID 的地区不属于中国大陆，否则将无法搜索出来。

import ios1 from '../pics/ios/1.jpg';
import ios2 from '../pics/ios/2.jpg';
import ios3 from '../pics/ios/3-1.jpg';
import ios4 from '../pics/ios/3-2.jpg';
import ios5 from '../pics/ios/3-3.jpg';
import ios6 from '../pics/ios/3-4.jpg';
import ios7 from '../pics/ios/5.jpg';

<img src={ios1} width="200" height="200"/>
<img src={ios2} width="200" height="200"/>
<img src={ios3} width="200" height="200"/>
<img src={ios4} width="200" height="200"/>
<img src={ios5} width="200" height="200"/>
<img src={ios6} width="200" height="200"/>
<img src={ios7} width="200" height="200"/>

</TabItem>

</Tabs>

</TabItem>

<TabItem value="remote" label="订阅链接（Remote）">

你需要具有公网IP（VPS、开放端口的局域网），参考 。

</TabItem>

</Tabs>
