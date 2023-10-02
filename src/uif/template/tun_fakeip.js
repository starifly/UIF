import {
  Inbound,
  Outbound
} from '@/store/uif/uif2singbox.js'

import {
  DeepCopy,
  InsertArray
} from '@/utils';

var template = {
  "log": {
    "level": "debug",
    "timestamp": true
  },
  "experimental": {},
  "dns": {
    "servers": [{
      "tag": "dns_local",
      "address": "tls://1.1.1.1",
      "strategy": "ipv4_only",
      "address_resolver": "dns_direct",
      "detour": "freedom"
    }, {
      "tag": "dns_direct", // never changed
      "address": "udp://114.114.114.114",
      "strategy": "ipv4_only",
      "detour": "freedom"
    }],
    "rules": [{
      "outbound": [
        "any"
      ],
      "server": "dns_local"
    }, {
      "geosite": [
        "cn",
        "private"
      ],
      "server": "dns_local"
    }, {
      "query_type": [
        "A",
        "AAAA"
      ],
      "inbound": ["tunIn"],
      "server": "dns_fakeip"
    }],
    "independent_cache": true
  },
  "inbounds": [{
    "type": "http",
    "tag": "UIFAPI",
    "listen": "127.0.0.1",
    "sniff": true,
    "listen_port": "UIFAPIPort"
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
    "rules": [{
        "protocol": "dns",
        "outbound": "dns-out"
      },
      {
        "inbound": ["UIFAPI"],
        "outbound": "proxy"
      },
      {
        "geosite": [
          "cn",
          "private"
        ],
        "outbound": "freedom"
      }, {
        "inbound": ["tunIn"],
        "outbound": "proxy"
      },
      {
        "geoip": [
          "cn",
          "private"
        ],
        "outbound": "freedom"
      }
    ]
  }
};

function AddTun(res, config) {
  var setting = config['setting']
  var fakeip = {}

  fakeip['enabled'] = true
  fakeip['inet4_range'] = setting['inet4_range']
  var ipv6 = setting['inet6_range']
  if (ipv6 != undefined || ipv6 != "") {
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
    "tag": "tunIn",
    "interface_name": setting['interface_name'],
    "inet4_address": setting['inet4_address'],
    "stack": setting['stack'],
    "strict_route": setting['strict_route'],
    "sniff": true,
    "auto_route": setting['auto_route']
  };
  console.log(setting)
  console.log(fakeip)
  var range = [setting['inet4_address']]
  var hasIPV6 = setting['inet6_address'];
  if (hasIPV6 != undefined && hasIPV6 != '') {
    config['inet6_address'] = hasIPV6
    range.push(hasIPV6)
  }

  var route = res['route']['rules'];
  route = route[route.length - 2];
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
      throw 'duplicated port.'
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
  configObj as config
} from '@/store/uif/config'

function BuildEnableOutList(res, outbounds) {
  var urltest = {
    "type": "urltest",
    "tag": "autoSelete",
    "outbounds": [],
    "url": uif.state.config.urlTest.testURL,
    "interval": uif.state.config.urlTest.interval + "m",
    "tolerance": parseInt(uif.state.config.urlTest.tolerance)

  }
  for (var item in outbounds) {
    item = outbounds[item]
    if (!item['enabled']) {
      continue
    }
    var out = Outbound(item) // parse uif style to sing-box style.
    res['outbounds'].push(out);
    res['outbounds'][0]['outbounds'].push(out['tag'])
    urltest['outbounds'].push(out['tag'])
  }

  var defaultTag = 'freedom'
  if (urltest['outbounds'].length > 1) {
    res['outbounds'].push(urltest);
    res['outbounds'][0]['outbounds'].push('autoSelete')
    defaultTag = 'autoSelete'
  } else if (urltest['outbounds'].length == 1) {
    defaultTag = urltest['outbounds'][0]
  }
  res['outbounds'][0]['default'] = defaultTag
}

function SetOutboud(res) {
  var all_out = UpdateUniqeTag()
  BuildEnableOutList(res, all_out)
  SetProxyStyle(res)
}

function SetProxyStyle(res) {
  if (uif.state.config.routeType == 'freedom') {
    res['outbounds'][0]['default'] = 'freedom'
    // all freedom
  } else if (uif.state.config.routeType == 'proxy') {
    res['route']['rules'][2]['outbound'] = 'proxy'
    res['route']['rules'][4]['outbound'] = 'proxy'
    // all proxy
  } else {
    // Default:
    // cn freedom, !cn proxy.
  }
}

function UpdateUniqeTag() {
  var res = []
  var i = 0
  for (var item in config.state.config.outbounds) {
    item = config.state.config.outbounds[item]
    item['core_tag'] = item['tag'] + "_" + i.toString()
    item = DeepCopy(item)
    item['tag'] = item['core_tag']
    res.push(item)
    i += 1
  }

  for (var sub in config.state.config.subscribe) {
    sub = config.state.config.subscribe[sub]
    for (var out in sub['outbounds']) {
      out = sub['outbounds'][out]
      out['core_tag'] = sub['tag'] + "_" + out['tag'] + "_" + i.toString()
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
  var seletor = DeepCopy(res['outbounds'][0])
  seletor['outbounds'].push("proxy")
  seletor['default'] = 'proxy'
  for (var item in route) {
    item = route[item]
    var usingSeletor = DeepCopy(seletor)
    var tag = "Rules::" + item['tag']
    usingSeletor['default'] = item['outbound']
    item['outbound'] = tag
    usingSeletor['tag'] = tag
    res['outbounds'].push(usingSeletor)
  }
  for (var item in route) {
    delete route[item]['tag']
  }
  InsertArray(res['route']['rules'], 1, route)
}

function SetDNS(res, dns) {
  res['dns']['servers'][0]['address'] = dns
}

export {
  AddInboudList,
  SetGeo,
  SetDNS,
  SetOutboud,
  UpdateUniqeTag,
  AddRouteList
}
