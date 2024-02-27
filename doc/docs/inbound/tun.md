---
sidebar_position: 2
---

# TUN 方式

该方式侵入式很强，会接管系统所有流量，且开启时需要管理员权限，不建议非程序员使用。

:::tip
目前支持 Windows 和 macOS 自动启动并提权，Linux 请自行使用 Systemd
:::

## 开启/关闭

- 首次使用时，请到 [入站页面](https://uiforfreedom.github.io/#/in/my)，选择 `Tun` 点击 `启用`，然后右上角关闭`uif`，最后重启 `uif`；

因为 Windows 和 macOS 首次使用时是没有提权，Linux 用户不受限制。

- 非首次使用，直接点击 `启用` 开关即可

## 开机启动

## 设置 IP 路由

TUN 会帮你设置一个网卡，需要设置你的操作系统，使所有的 IP 流量都转发到你的网卡。

UIF 会默认帮你设置好 IP 路由；

在 Windows 中使用 `route print`，在 Linux 中使用 `iptable` 即可查看。

如果你不想自动设置好 IP 路由，到 [入站页面](https://uiforfreedom.github.io/#/in/my)；选择 `Tun` 点击 `详情` -> `代理设置` -> `自动配置`。
