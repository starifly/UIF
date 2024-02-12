import {
  Inbound,
  Outbound
} from '@/store/uif/uif2singbox.js'

import {
  DeepCopy,
  InsertArray
} from '@/utils';

var CNTAG = "Rules::CN"
var NOTCNTAG = "Rules::!CN"
var TUNTAG = "tunIn"

var template = {
  "log": {
    "level": "trace",
    "timestamp": true
  },
  "experimental": {},
  "dns": {
    "servers": [{
      "tag": "dns_local_proxy",
      "address": "udp://8.8.8.8",
      "address_resolver": "dns_direct",
      "strategy": "prefer_ipv4",
      "detour": "proxy"
    }, {
      "tag": "dns_local_freedom",
      "address": "udp://8.8.8.8",
      "address_resolver": "dns_direct",
      "strategy": "prefer_ipv4",
      "detour": "freedom"
    }, {
      "tag": "dns_direct", // never changed
      "address": "udp://114.114.114.114",
      "strategy": "prefer_ipv4",
      "detour": "freedom"
    }],
    "rules": [{
      "outbound": [
        "any"
      ],
      "server": "dns_local_freedom" // must be freedom
    }, {
      "geosite": [
        "cn",
        "private"
      ],
      "server": "dns_local_freedom"
    }, {
      "query_type": [
        "A",
        "AAAA"
      ],
      "inbound": [TUNTAG],
      "server": "dns_fakeip"
    }],
    "independent_cache": true
  },
  "inbounds": [{
    "type": "http",
    "tag": "UIFAPI",
    "listen": "127.0.0.1",
    "sniff": true,
    "listen_port": 14454
  }, {
    "type": "http",
    "tag": "UIFAPIDirect",
    "listen": "127.0.0.1",
    "sniff": true,
    "listen_port": 14455
  }],
  "outbounds": [{
    "type": "selector",
    "tag": "proxy",

    "outbounds": [
      "freedom",
      "block",
    ],
    "default": "freedom"
  }, {
    "type": "selector",
    "tag": CNTAG,
    "outbounds": [
      "proxy",
      "freedom",
      "block",
    ],
    "default": "freedom"
  }, {
    "type": "selector",
    "tag": NOTCNTAG,
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
    "geoip": {
      "download_url": "https://github.com/soffchen/sing-geoip/releases/latest/download/geoip.db",
      "download_detour": "proxy"
    },
    "geosite": {
      "download_url": "https://github.com/soffchen/sing-geosite/releases/latest/download/geosite.db",
      "download_detour": "proxy"
    },
    "final": NOTCNTAG,
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
        "inbound": [TUNTAG],
        "outbound": NOTCNTAG
      },

      // insert at here

      {
        "geosite": [
          "private"
        ],
        "geoip": [
          "private"
        ],
        "outbound": "freedom"
      },
      {
        "geosite": [
          "cn"
        ],
        "geoip": [
          "cn"
        ],
        "outbound": CNTAG
      },
    ]
  }
};

function AddTun(res, config) {
  var setting = config['setting']
  var fakeip = {}

  fakeip['enabled'] = true
  fakeip['inet4_range'] = setting['inet4_range']
  var ipv6 = setting['inet6_range']
  if (ipv6 != undefined && ipv6 != "") {
    fakeip['inet6_range'] = ipv6
  }
  res['dns']['servers'].push({
    "tag": "dns_fakeip",
    "address": "fakeip",
    "strategy": "ipv4_only"
  })
  res['dns']['fakeip'] = fakeip
  config = {
    "type": "tun",
    "tag": TUNTAG,
    "interface_name": setting['interface_name'],
    "inet4_address": setting['inet4_address'],
    "stack": setting['stack'],
    "mtu": setting['mtu'],
    "sniff": true,
    "strict_route": setting['strict_route'],
    "auto_route": setting['auto_route'],
  };
  var range = [setting['inet4_address']]
  var hasIPV6 = setting['inet6_address'];
  if (hasIPV6 != undefined && hasIPV6 != '') {
    config['inet6_address'] = hasIPV6
    range.push(hasIPV6)
  }

  var route = res['route']['rules'];
  route = route[4];
  route['ip_cidr'] = range

  res['inbounds'].push(config)
}

function AddInboudList(inboundList) {
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
      res['inbounds'].push(temp)
    }
    i += 1
  }
  return res
}

import uif from '@/store/uif/uif'
import {
  configObj as config,
  newDefaultTunIn
} from '@/store/uif/config'
import In2Out from '@/store/uif/uif_in_2_out';

function BuildEnableOutList(res, outbounds) {
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
    res['outbounds'].push(out);
    urltest['outbounds'].push(out['tag'])
    enabledOutTag.push(out['tag'])
  }

  var defaultTag = 'freedom'
  if (enabledOutTag.length > 1) {
    res['outbounds'].push(urltest);
    proxy['outbounds'].push(urlTestTag)
    proxy['outbounds'] = proxy['outbounds'].concat(enabledOutTag)

    defaultTag = urlTestTag
  } else if (enabledOutTag.length == 1) {
    defaultTag = urltest['outbounds'][0]
    proxy['outbounds'].push(defaultTag)
  }
  proxy['default'] = defaultTag
}

function SetOutboud(res, boundConfig) {
  var all_out = UpdateUniqeTag(boundConfig)
  BuildEnableOutList(res, all_out)
}

function SetProxyStyle(res, uifConfig) {
  if (uifConfig.routeType == 'freedom') {
    // all freedom
    res['outbounds'][1]['default'] = 'freedom'
    res['outbounds'][2]['default'] = 'freedom'
  } else if (uifConfig.routeType == 'proxy') {
    // all proxy
    res['outbounds'][1]['default'] = 'proxy'
    res['outbounds'][2]['default'] = 'proxy'
  } else {
    // Default:
    // cn freedom, !cn proxy.
  }
}

function UpdateUniqeTag(boundConfig) {
  var usedTagMap = {}
  var res = []
  var i = 0
  for (var item in boundConfig.outbounds) {
    item = boundConfig.outbounds[item]

    var tag = item['tag']
    item['core_tag'] = tag
    if (tag in usedTagMap) {
      item['core_tag'] += "_" + i.toString()
    }
    usedTagMap[tag] = 1

    item = DeepCopy(item)
    item['tag'] = item['core_tag']
    res.push(item)
    i += 1
  }

  for (var sub in boundConfig.subscribe) {
    sub = boundConfig.subscribe[sub]
    for (var out in sub['outbounds']) {
      out = sub['outbounds'][out]

      var tag = sub['tag'] + "_" + out['tag']
      out['core_tag'] = tag
      if (tag in usedTagMap) {
        out['core_tag'] += "_" + i.toString()
      }
      usedTagMap[tag] = 1

      out = DeepCopy(out)
      out['tag'] = out['core_tag']
      res.push(out)
      i += 1
    }
  }
  return res
}

function SetGeo(res, geoip, geosite) {
  res['route']['geoip']['download_url'] = geoip
  res['route']['geosite']['download_url'] = geosite
  SetNTP(res)
  SetClashApi(res)
}

function SetNTP(res) {
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

function SetClashApi(res) {
  if (!uif.state.config.clash.enabled) {
    return
  }
  var url = new URL(uif.state.config.clash.apiAddress);
  res['experimental']['clash_api'] = {
    "external_controller": url.host,
  }
}

function AddRouteList(res, routeList) {
  var route = DeepCopy(routeList)
  var proxy = DeepCopy(res['outbounds'][0])
  proxy['outbounds'] = ["proxy"].concat(proxy['outbounds'])
  proxy['default'] = 'proxy'
  for (var item in route) {
    item = route[item]
    var usingSeletor = DeepCopy(proxy)
    var tag = "Rules::" + item['tag']
    usingSeletor['default'] = item['outbound']
    item['outbound'] = tag
    usingSeletor['tag'] = tag
    res['outbounds'].push(usingSeletor)
  }
  for (var item in route) {
    delete route[item]['tag']
  }
  InsertArray(res['route']['rules'], 4, route)
}

function SetDNS(res, dns) {
  res['dns']['servers'][0]['address'] = dns
  res['dns']['servers'][1]['address'] = dns
}

function BuildCoreConfig(uifConfig, boundConfig) {
  var coreConfig = AddInboudList(boundConfig.inbounds);
  SetOutboud(coreConfig, boundConfig)
  SetProxyStyle(coreConfig, uifConfig)
  SetGeo(coreConfig, uifConfig.geoIPAddress, uifConfig.geoSiteAddress)
  AddRouteList(coreConfig, boundConfig.routes)
  SetDNS(coreConfig, uifConfig.dnsAddress)
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
    if (!item['enabled'] ||
      !['hysteria2', 'trojan', 'vmess', 'shadowsocks', 'tuic', 'vless', 'hysteria'].includes(item['protocol']) ||
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

  // prepare outbound
  var inbounds = boundConfig['inbounds']
  boundConfig['outbounds'] = boundConfig['outbounds'].concat(ParseInboud2Outboud(inbounds))

  // prepare inbound
  var tunIn = newDefaultTunIn()
  tunIn['enabled'] = true
  boundConfig['inbounds'] = [tunIn]

  var coreConfig = BuildCoreConfig(uifConfig, boundConfig)
  console.log(coreConfig)
  return coreConfig
}

export {
  AddInboudList,
  BuildCoreConfig,
  SetGeo,
  SetDNS,
  SetOutboud,
  AddRouteList
}
