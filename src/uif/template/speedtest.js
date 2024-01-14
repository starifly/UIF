import {
  DeepCopy
} from '@/utils'

export var clashAPIAddress = '127.0.0.1:port'

export var template = {
  "experimental": {
    "clash_api": {
      "external_controller": clashAPIAddress
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
  "outbounds": []
}

export function BuildTestNodeTemplate(uifStyleNodeConfig) {
  var res = DeepCopy(template)
  var rawOutboudList = []
  for (var item in uifStyleNodeConfig) {
    res['outbound'].push(Outbound(rawOutboudList[item]))
  }
  return res
}
