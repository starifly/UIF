import {
  DeepCopy
} from '@/utils'

import {
  Outbound
} from '@/store/uif/uif2singbox.js'

export var template = {
  "experimental": {
    "clash_api": {
      "external_controller": '127.0.0.1:pportportportportportort'
    }
  },
  "dns": {
    "servers": [{
      "tag": "dns_direct",
      "address": "udp://114.114.114.114",
      "detour": "freedom"
    }],
    "independent_cache": true
  },
  "outbounds": [{
    'tag': 'freedom',
    'type': 'direct'
  }],
  "route": {
    "auto_detect_interface": true
  }
}

export function BuildTestNodeTemplate(uifStyleNodeConfig) {
  var res = DeepCopy(template)
  var rawOutboudList = []
  for (var item in uifStyleNodeConfig) {
    res['outbounds'].push(Outbound(uifStyleNodeConfig[item]))
  }
  return res
}
