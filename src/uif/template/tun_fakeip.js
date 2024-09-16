import {
  Inbound,
  Outbound
} from '@/store/uif/parser/uif2singbox.js'

import {
  DeepCopy,
  InsertArray,
} from '@/utils';

var CN_TAG = "Rules::CN"
var NOT_CN_TAG = "Rules::!CN"

var TUN_TAG_FAKEIP = "tun-FakeIP"
var TUN_TAG_REALIP = "tun-RealIP"

var DNS_PROXY_WITH_ECS = "dns_proxy_with_ecs"
var DNS_PROXY_WITHOUT_ECS = "dns_proxy_without_ecs"
var DNS_LOCAL = "dns_local"
var DNS_FREEDOM = "dns_freedom"
var DNS_RESOVLER = "dns_resovler"
var DNS_FAKEIP = "dns_fakeip"
var DOMAIN_STRATEGY = "prefer_ipv4"
var CLASH_MODE_DIRECT = "全部直连"
var CLASH_MODE_GLOBAL = "全部代理"
var CLASH_MODE_RULE = "国内直连,国外代理"

export var DEFAULT_DNS_LOCAL = "https://223.5.5.5/dns-query"
export var DEFAULT_DNS_REMOTE = "https://8.8.8.8/dns-query"
export var DEFAULT_IP_DNS = "udp://223.5.5.5"

var template = {
  "log": {
    "level": "trace",
    "timestamp": true,
    // "output": "./core.log",
  },
  "experimental": {
    "cache_file": {
      "enabled": true,
      "store_rdrc": true,
      "rdrc_timeout": "1h",
    },
    "clash_api": {
      "default_mode": CLASH_MODE_RULE
    }
  },
  "dns": {
    "servers": [{
      "tag": DNS_PROXY_WITH_ECS,
      "address": DEFAULT_DNS_REMOTE,
      "address_resolver": DNS_RESOVLER,
      "detour": "proxy",
    }, {
      "tag": DNS_LOCAL,
      "address": DEFAULT_DNS_LOCAL,
      "address_resolver": DNS_RESOVLER,
      "detour": "freedom"
    }, {
      "tag": DNS_PROXY_WITHOUT_ECS,
      "address": DEFAULT_DNS_REMOTE,
      "address_resolver": DNS_RESOVLER,
      "detour": "proxy",
    }, {
      "tag": DNS_FREEDOM,
      "address": DEFAULT_DNS_LOCAL,
      "address_resolver": DNS_RESOVLER,
      "detour": "freedom" // must be freedom
    }, {
      "tag": DNS_RESOVLER, // never changed
      "address": DEFAULT_IP_DNS,
      "detour": "freedom"
    }],
    "strategy": DOMAIN_STRATEGY,
    "reverse_mapping": true,
    "final": DNS_PROXY_WITHOUT_ECS,
    "rules": [{
        "outbound": [
          "any",
        ],
        "server": DNS_FREEDOM
      },
      {
        "clash_mode": CLASH_MODE_DIRECT,
        "server": DNS_LOCAL
      },
      {
        "inbound": [TUN_TAG_FAKEIP],
        "clash_mode": CLASH_MODE_GLOBAL,
        "server": DNS_FAKEIP
      },
      {
        "clash_mode": CLASH_MODE_GLOBAL,
        "server": DNS_PROXY_WITHOUT_ECS
      },
      {
        "rule_set": ["geosite-cn", "geosite-private"],
        "server": DNS_LOCAL
      },
      {
        "inbound": [TUN_TAG_REALIP],
        "server": DNS_PROXY_WITHOUT_ECS
      },
      {
        "query_type": [
          "A",
          "AAAA"
        ],
        "inbound": [TUN_TAG_FAKEIP],
        "server": DNS_FAKEIP
      }
    ],
    "independent_cache": true
  },
  "inbounds": [],
  "outbounds": [{
    "type": "selector",
    "tag": "proxy",
    "interrupt_exist_connections": true,

    "outbounds": [
      "freedom",
      "block",
    ],
    "default": "freedom"
  }, {
    "type": "selector",
    "tag": CN_TAG,
    "outbounds": [
      "proxy",
      "freedom",
      "block",
    ],
    "default": "freedom"
  }, {
    "type": "selector",
    "tag": NOT_CN_TAG,
    "outbounds": [
      "proxy",
      "freedom",
      "block",
    ],
    "default": "proxy"
  }, {
    "type": "block",
    "tag": "block"
  }, {
    "type": "direct",
    "tag": "freedom"
  }, {
    "type": "dns",
    "tag": "dns-out"
  }],
  "route": {
    "auto_detect_interface": true,
    "rule_set": [{
        "type": "remote",
        "tag": "geoip-cn",
        "format": "binary",
        "url": "https://fastly.jsdelivr.net/gh/SagerNet/sing-geoip@rule-set/geoip-cn.srs",
        "download_detour": "proxy",
        "update_interval": "3d"
      },
      {
        "type": "remote",
        "tag": "adguard-filter-list",
        "format": "binary",
        "url": "https://fastly.jsdelivr.net/gh/UIforFreedom/UIF@master/uifd/adguard/adguard-filter-list.srs",
        "download_detour": "proxy",
        "update_interval": "1d"
      },
      {
        "type": "remote",
        "tag": "geosite-cn",
        "format": "binary",
        "url": "https://fastly.jsdelivr.net/gh/SagerNet/sing-geosite@rule-set/geosite-geolocation-cn.srs",
        "download_detour": "proxy",
        "update_interval": "3d"
      },
      {
        "type": "remote",
        "tag": "geosite-private",
        "format": "binary",
        "url": "https://fastly.jsdelivr.net/gh/SagerNet/sing-geosite@rule-set/geosite-private.srs",
        "download_detour": "proxy",
        "update_interval": "3d"
      },
      // {
      //   "type": "remote",
      //   "tag": "geoip-private",
      //   "format": "binary",
      //   "url": "https://cdn.jsdelivr.net/gh/SagerNet/sing-geoip@rule-set/geoip-private.srs",
      //   "download_detour": "proxy",
      //   "update_interval": "3d"
      // }
    ],
    "geoip": {
      "download_url": "https://github.com/soffchen/sing-geoip/releases/latest/download/geoip.db",
      "download_detour": "proxy"
    },
    "geosite": {
      "download_url": "https://github.com/soffchen/sing-geosite/releases/latest/download/geosite.db",
      "download_detour": "proxy"
    },
    "final": NOT_CN_TAG,
    "rules": [{
        "protocol": "dns",
        "outbound": "dns-out"
      },
      {
        "inbound": ["UIFAPI"],
        "domain_suffix": ["baidu.com"],
        "outbound": "freedom"
      },
      {
        "inbound": ["UIFAPI"],
        "outbound": "proxy"
      },
      {
        "inbound": ["UIFAPIDirect"],
        "outbound": "freedom"
      },
      {
        "inbound": [TUN_TAG_FAKEIP],
        "outbound": NOT_CN_TAG
      },

      // insert custom rules at here

      {
        "rule_set": ["geosite-private"],
        "geoip": [
          "private"
        ],
        "outbound": "freedom"
      },
      {
        "clash_mode": CLASH_MODE_DIRECT,
        "outbound": CN_TAG
      },
      {
        "clash_mode": CLASH_MODE_GLOBAL,
        "outbound": NOT_CN_TAG
      },
      {
        "rule_set": ["geosite-cn"],
        "outbound": CN_TAG
      },
      {
        "rule_set": ["geoip-cn"],
        "outbound": CN_TAG
      },
    ]
  }
};

export function AddTun(res, config) {
  var setting = config['setting']
  config = {
    "type": "tun",
    "tag": TUN_TAG_FAKEIP,
    "interface_name": setting['interface_name'],
    "inet4_address": setting['inet4_address'],
    "stack": setting['stack'],
    "mtu": setting['mtu'],
    "sniff": true,
    // "gso": true,
    "strict_route": setting['strict_route'],
    "auto_route": setting['auto_route'],
  };

  if (setting['mode'] == 'fakeip') {
    var fakeip = {}
    var fakeRange = [setting['inet4_range']]
    var ipv6Address = setting['inet6_address'];
    var ipv6Range = setting['inet6_range']
    if (ipv6Address != undefined && ipv6Address != '' && ipv6Range != undefined && ipv6Range != '') {
      fakeip['inet6_range'] = ipv6Range
      config['inet6_address'] = ipv6Address
      fakeRange.push(ipv6Range)
    }

    fakeip['enabled'] = true
    fakeip['inet4_range'] = setting['inet4_range']

    res['dns']['servers'].push({
      "tag": DNS_FAKEIP,
      "address": "fakeip",
      "strategy": "ipv4_only" // todo
    })
    res['dns']['fakeip'] = fakeip
    res['experimental']['cache_file']['store_fakeip'] = true

    var route = res['route']['rules'][4];
    route['ip_cidr'] = fakeRange
  } else {
    config['tag'] = TUN_TAG_REALIP
  }

  res['inbounds'].push(config)
}

export function AddInboudList(inboundList) {
  var res = DeepCopy(template)
  var existPort = [];
  var i = 0
  for (var item in inboundList) {
    item = inboundList[item]
    if (!item['enabled']) {
      continue;
    }
    var port = item['transport']['port']
    if (existPort.includes(port)) {
      // throw 'duplicated port.'
      continue
    }
    existPort.push(port);

    if (item['protocol'] == 'tun') {
      AddTun(res, item)
    } else {
      var temp = Inbound(item)
      temp['tag'] += i.toString()
      temp['sniff'] = true
      temp['domain_strategy'] = DOMAIN_STRATEGY
      res['inbounds'].push(temp)
    }
    i += 1
  }
  return res
}

import uif from '@/store/uif/uif'
import {
  FindOutByID,
  configObj as config,
  newDefaultRoute,
  newDefaultTunIn
} from '@/store/uif/config'

import {
  In2Out
} from '@/store/uif/parser/uif_in_2_out';

export function BuildEnableOutList(res, outbounds) {
  var urlTestTag = "autoSelete"
  var urltest = {
    "type": "urltest",
    "tag": urlTestTag,
    "outbounds": [],
    "url": uif.state.config.urlTest.testURL,
    "interval": uif.state.config.urlTest.interval + "m",
    "tolerance": parseInt(uif.state.config.urlTest.tolerance)

  }
  var proxy = res['outbounds'][0]
  var enabledOutTag = []
  for (var item in outbounds) {
    item = outbounds[item]
    if (!item['enabled']) {
      continue
    }
    var out = Outbound(item) // parse uif style to sing-box style.
    var tag = out['tag']
    res['outbounds'].push(out);
    enabledOutTag.push(tag)
  }

  var defaultTag = 'freedom'
  if (enabledOutTag.length > 1) {
    proxy['outbounds'].push(urlTestTag)
    proxy['outbounds'] = proxy['outbounds'].concat(enabledOutTag)

    res['outbounds'].push(urltest);
    urltest['outbounds'] = enabledOutTag

    defaultTag = urlTestTag
  } else if (enabledOutTag.length == 1) {
    defaultTag = enabledOutTag[0]
    proxy['outbounds'].push(defaultTag)
  }
  proxy['default'] = defaultTag
}

export function SetOutboud(res, boundConfig, isShare) {
  var all_out = UpdateUniqeTagAndID(boundConfig)
  for (var item in all_out) {
    item = all_out[item]
    if (isShare && ['wireguard'].includes(item['protocol'])) {
      item['enabled'] = false
    }
  }
  BuildEnableOutList(res, all_out)
}

export function SetProxyStyle(res, uifConfig) {
  if (uifConfig.routeType == 'freedom') {
    // all freedom
    res['outbounds'][1]['default'] = 'freedom'
    res['outbounds'][2]['default'] = 'freedom'
    res['experimental']['clash_api']['default_mode'] = CLASH_MODE_DIRECT
  } else if (uifConfig.routeType == 'proxy') {
    // all proxy
    res['outbounds'][1]['default'] = 'proxy'
    res['outbounds'][2]['default'] = 'proxy'
    res['experimental']['clash_api']['default_mode'] = CLASH_MODE_GLOBAL
  } else {
    // Default:
    // cn freedom, !cn proxy.
  }
}

export function InitDetour(out) {
  if (!out['enabled'] || !('dial' in out) || !('detour' in out['dial'])) {
    return
  }
  var id = out['dial']['detour']['id']
  out['dial']['detour']['tag'] = ''
  if (id.length == 0) {
    return
  }
  id = id[id.length - 1]

  var detour = FindOutByID(id)
  if (detour != null && detour['enabled']) {
    out['dial']['detour']['tag'] = detour['core_tag']
  }
}

export function UpdateUniqeTagAndID(boundConfig) {
  var usedTagMap = {
    'freedom': 1,
    'dns-out': 1,
    'block': 1,
    'proxy': 1,
  }
  var res = []
  var i = 0
  for (var item in boundConfig.outbounds) {
    item = boundConfig.outbounds[item]

    var tag = item['tag']
    item['core_tag'] = tag
    if (tag in usedTagMap) {
      item['core_tag'] += i.toString()
    }
    usedTagMap[tag] = item

    item = DeepCopy(item)
    item['tag'] = item['core_tag']
    InitDetour(item)
    res.push(item)
    i += 1
  }

  for (var sub in boundConfig.subscribe) {
    sub = boundConfig.subscribe[sub]
    for (var out in sub['outbounds']) {
      out = sub['outbounds'][out]

      // var tag = sub['tag'] + "/" + out['tag']
      var tag = out['tag']
      out['core_tag'] = tag
      if (tag in usedTagMap) {
        out['core_tag'] += i.toString()
      }
      usedTagMap[tag] = out

      out = DeepCopy(out)
      out['tag'] = out['core_tag']
      InitDetour(out)
      res.push(out)
      i += 1
    }
  }
  return res
}

export function SetGeo(res, geoip, geosite) {
  res['route']['geoip']['download_url'] = geoip
  res['route']['geosite']['download_url'] = geosite
  SetNTP(res)
  SetClashApi(res)
}

export function SetNTP(res) {
  if (!uif.state.config.ntp.enabled) {
    return
  }
  res['ntp'] = {
    'enabled': true,
    'server': uif.state.config.ntp.server,
    'interval': uif.state.config.ntp.interval + "m",
    'server_port': uif.state.config.ntp.server_port
  }
}

export function SetClashApi(res) {
  var clash = uif.state.config.clash
  if (!clash.enabled) {
    return
  }
  var clash_api = res['experimental']['clash_api']
  clash_api['external_controller'] = clash.apiIP + ":" + clash.apiPort
  clash_api['secret'] = clash.apiKey
  if ('external_ui_download_url' in clash && clash['external_ui_download_url'] != '') {
    clash_api['external_ui_download_url'] = clash['external_ui_download_url']
    clash_api['external_ui_download_detour'] = 'proxy'
    var dirName = clash.external_ui_download_url.split('/')
    dirName = dirName[dirName.length - 3]
    clash_api['external_ui'] = "clashWeb/" + dirName
  }
}

export function SetAllOutboudFreedom(res) {
  var destList = []
  for (var item in res['outbounds']) {
    item = res['outbounds'][item]
    var address = item['server']
    if (address == undefined) {
      continue
    }
    destList.push(address)
  }
  return destList
}

function NewSelector(enabledOutTagList) {
  var n = {
    "type": "selector",
    "tag": "",
    "outbounds": [
      "proxy",
    ],
    "default": "proxy"
  }
  n['outbounds'] = n['outbounds'].concat(enabledOutTagList)
  return n
}

export function AddRouteList(res, uifConfig, routeList, isShare) {
  var route = DeepCopy(routeList)
  var enabledOutTagList = res['outbounds'][0]['outbounds']

  var outList = SetAllOutboudFreedom(res)
  if (outList.length != 0) {
    // let apiAddress route to freedom
    var apiOutboudRule = newDefaultRoute()
    apiOutboudRule['tag'] = 'API'
    apiOutboudRule['domain'] = outList
    route.push(apiOutboudRule)
  }

  for (var item in route) {
    item = route[item]
    var usingSeletor = NewSelector(enabledOutTagList)
    var tag = "Rules::" + item['tag']
    usingSeletor['tag'] = tag
    var out = item['outbound']
    if ('id' in item) {
      var id = item['id'][item['id'].length - 1]
      if (['freedom', 'proxy', 'block'].includes(id)) {
        out = id
      } else {
        id = FindOutByID(id)
        if (id != null && id['enabled']) {
          if (isShare && ['wireguard'].includes(id['protocol'])) {
            out = 'proxy'
          } else {
            out = id['core_tag']
          }
        } else {
          out = 'proxy'
        }
      }
    }
    // usingSeletor['default'] = item['outbound']
    usingSeletor['default'] = out
    item['outbound'] = tag
    res['outbounds'].push(usingSeletor)
  }
  for (var item in route) {
    delete route[item]['tag']
    if ('id' in route[item]) {
      delete route[item]['id']
    }
  }

  if (uifConfig['useAdguardRule']) {
    route.push({
      "rule_set": "adguard-filter-list",
      "outbound": "block"
    })
  }
  InsertArray(res['route']['rules'], 4, route)
}

export function SetDNS(res, uifConfig, isShare) {
  var remote = uifConfig.remoteDNSAddress
  var local = uifConfig.dnsAddress
  if (isShare) {
    remote = uifConfig.share.remoteDNSAddress
    local = uifConfig.share.localDNSAddress
  }
  res['dns']['servers'][0]['address'] = remote
  res['dns']['servers'][2]['address'] = remote
  res['dns']['servers'][1]['address'] = local
  res['dns']['servers'][3]['address'] = local


  var ip_mode = uifConfig.subnet.ip_mode_local
  if (isShare) {
    ip_mode = uifConfig.subnet.ip_mode_share
  }
  if (ip_mode != '') {
    var mode = {
      "rule_set": ["geoip-cn"],
      "server": DNS_LOCAL
    }
    if (ip_mode == 'remote_without_ecs') {
      mode['server'] = DNS_PROXY_WITH_ECS
    }
    InsertArray(res['dns']['rules'], 5, mode)
  }
}

export function BuildClientSubnet(res, uifConfig, isShare) {
  var subnet = uifConfig.subnet.client
  var ip_mode = uifConfig.subnet.ip_mode_local
  if (isShare) {
    subnet = uifConfig.subnet.share
    ip_mode = uifConfig.subnet.ip_mode_share
  }
  if (ip_mode == 'remote_without_ecs') {
    subnet = '114.114.114.114'
  }
  if (subnet != '') {
    res['dns']['servers'][0]['client_subnet'] = subnet
  }
}

export function BuildCoreConfig(uifConfig, boundConfig, useHttpApi, isShare) {
  var coreConfig = AddInboudList(boundConfig.inbounds);
  SetOutboud(coreConfig, boundConfig, isShare)
  SetProxyStyle(coreConfig, uifConfig)
  SetGeo(coreConfig, uifConfig.geoIPAddress, uifConfig.geoSiteAddress)
  AddRouteList(coreConfig, uifConfig, boundConfig.routes, isShare)
  SetDNS(coreConfig, uifConfig, isShare)
  BuildClientSubnet(coreConfig, uifConfig, isShare)

  if (useHttpApi) {
    coreConfig['inbounds'].push({
      "type": "http",
      "tag": "UIFAPI",
      "listen": "127.0.0.1",
      "sniff": true,
      "listen_port": "UIFAPIPort"
    })

    coreConfig['inbounds'].push({
      "type": "http",
      "tag": "UIFAPIDirect",
      "listen": "127.0.0.1",
      "sniff": true,
      "listen_port": "UIFAPIPortDirect"
    })
  }
  return coreConfig
}

export function BuildShareIP() {
  var address = new URL(uif.state.apiAddress)
  if (['127.0.0.1', '0.0.0.0'].includes(address.hostname)) {
    return uif.state.connection.ip
  }
  return address.hostname
}

export function ParseInboud2Outboud(uifInboud) {
  var res = []
  for (var item in uifInboud) {
    item = uifInboud[item]
    var address = item['transport']['address']
    var protocol = item['protocol']
    if (!item['enabled'] ||
      !['hysteria2', 'trojan', 'vmess', 'shadowsocks', 'tuic', 'vless', 'hysteria'].includes(protocol) ||
      address.includes('127.0.0.1')) {
      continue
    }
    var out = In2Out(item)
    out['enabled'] = true
    res.push(out)
  }
  return res
}

export function BuildShareCoreConfig(uifConfig, boundConfig) {
  boundConfig = DeepCopy(boundConfig)
  uifConfig = DeepCopy(uifConfig)
  uifConfig['routeType'] = 'route'

  // some of Android API will not allow to use dhcp
  if (uifConfig.dnsAddress == 'dhcp://auto') {
    uifConfig.dnsAddress = DEFAULT_DNS_LOCAL
  }

  // prepare outbound
  var inbounds = boundConfig['inbounds']
  boundConfig['outbounds'] = boundConfig['outbounds'].concat(ParseInboud2Outboud(inbounds))

  // prepare inbound
  var tunIn = null
  for (var item in inbounds) {
    item = inbounds[item]
    if (item['protocol'] != 'tun') {
      continue
    }

    if (tunIn == null || item['protocol']['enabled']) {
      tunIn = item
    }
  }
  if (tunIn == null) {
    tunIn = newDefaultTunIn(uifConfig.share.tunShareMode)
  }
  tunIn['enabled'] = true
  boundConfig['inbounds'] = [tunIn]

  for (var item in boundConfig['outbounds']) {
    item = boundConfig['outbounds'][item]
    if (['wireguard'].includes(item['protocol'])) {
      item['enabled'] = false
    }
  }

  var coreConfig = BuildCoreConfig(uifConfig, boundConfig, false, true)
  return coreConfig
}
