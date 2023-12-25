export default function Xray2UIF(rawData) {
  rawData = JSON.parse(rawData)
  var outbounds = rawData['outbounds']

  var res = [];
  for (var item in outbounds) {
    item = outbounds[item]
    var protocol = item['protocol']
    var uif = {
      'transport': {},
      'protocol': protocol,
      'tag': item['tag'],
    }
    var stream = {}
    if ('streamSettings' in stream) {
      stream = rawData['streamSettings']
    }
    var network = 'tcp'
    if ('network' in stream) {
      network = rawData['network']
    }
    var tls_type = 'none'
    if ('security' in stream) {
      tls_type = stream['security']
    }

    var address = ''
    var port = 80

    var proxySetting = rawData['settings']

    if (protocol == 'shadowsocks') {
      proxySetting = proxySetting['servers'][0]
    } else if (protocol == 'vmess') {
      proxySetting = proxySetting['vnext'][0]
    } else if (protocol == 'vless') {
      proxySetting = proxySetting['vnext'][0]
    } else if (protocol == 'trojan') {
      proxySetting = proxySetting['servers'][0]
    }

    address = proxySetting['address']
    port = proxySetting['port']

    var transport = {
      setting: {},
      protocol: network,
      tls_type: tls_type,
      tls: {},
      address: address,
      port: port,
    }
    uif['transport'] = transport

    res.push(uif)
  }
  return res
}
