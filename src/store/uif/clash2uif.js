import yaml from 'js-yaml'

function clash2UIF(input) {
  var res = yaml.load(input);
  var outbounds = [];
  for (var item in res['proxies']) {
    item = res['proxies'][item];
    var protocol = item['type'];
    var protocolMap = {
      'ss': 'shadowsocks',
      'trojan': 'trojan',
      'socks5': 'socks',
      'http': 'http',
      'vmess': 'vmess'
    };
    if (!(protocol in protocolMap)) {
      console.log(protocol + ' is not supported.')
      continue
    }
    protocol = protocolMap[protocol];
    var enabledTLS = 'none';
    var tlsSetting = {};
    if (protocol == 'trojan' || ('tls' in item && item['tls'])) {
      enabledTLS = 'tls';
      if ('sni' in item) {
        tlsSetting['server_name'] = item['sni']
      } else if ('servername' in item) {
        tlsSetting['server_name'] = item['servername']
      }

      if ('alpn' in item) {
        tlsSetting['alpn'] = item['alpn']
      }

      if ('skip-cert-verify' in item) {
        tlsSetting['insecure'] = item['skip-cert-verify']
      }
    } else if (protocol == 'shadowsocks' && ('plugin' in item && 'mode' in item['plugin-opts'])) {
      var pluginOpts = item['plugin-opts']
      if (pluginOpts['mode'] == 'tls' || ('tls' in pluginOpts && pluginOpts['tls'])) {
        enabledTLS = 'tls';
        if ('host' in pluginOpts) {
          tlsSetting['server_name'] = pluginOpts['host']
        }
        if ('skip-cert-verify' in pluginOpts) {
          tlsSetting['insecure'] = pluginOpts['skip-cert-verify']
        }
      }
    }

    var network = 'tcp';
    if ('network' in item) {
      network = item['network'];
      if (network == 'h2' || network == 'http') {
        throw 'h2 and http is not supported.'
      }
    }

    var networkSetting = {};
    if (network == 'grpc' && 'grpc-opts' in item) {
      networkSetting['serviceName'] =
        item['grpc-opts']['grpc-service-name']
    } else if (network == 'ws' && 'ws-opts' in item) {
      var wsOpts = item['ws-opts']
      if ('path' in item['ws-opts']) {
        networkSetting['path'] = wsOpts['path'];
      } else {
        networkSetting['path'] = '/';
      }
      var host = getHost(wsOpts)
      if (host != '') {
        networkSetting['headers'] = {
          "Host": host
        }
      }
    } else if ('plugin-opts' in item && 'mode' in item['plugin-opts']) {
      var pluginOpts = item['plugin-opts']
      if (pluginOpts['mode'] == 'websocket') {
        network = 'ws'
        if ('path' in pluginOpts) {
          networkSetting['path'] = pluginOpts['path'];
        } else {
          networkSetting['path'] = '/';
        }
        var host = getHost(pluginOpts)
        if (host != '') {
          networkSetting['headers'] = {
            "Host": host
          }
        }
      }
      if ('mux' in pluginOpts) {
        throw 'mux is not supported.'
      }
    }

    if (enabledTLS == 'tls') {
      tlsSetting['enabled'] = true
    }
    var transport = {
      address: item['server'],
      port: item['port'],
      tls_type: enabledTLS,
      tls: tlsSetting,
      protocol: network,
      setting: networkSetting
    };

    var protocolSetting = {};
    if (protocol == 'trojan') {
      protocolSetting['password'] = item['password']
    } else if (protocol == 'vmess') {
      protocolSetting['security'] = item['cipher']
      protocolSetting['alter_id'] = item['alterId']
      protocolSetting['uuid'] = item['uuid']
    } else if (protocol == 'shadowsocks') {
      protocolSetting['method'] = item['cipher']
      protocolSetting['password'] = item['password']
    }

    outbounds.push({
      tag: item['name'],
      protocol: protocol,
      transport: transport,
      setting: protocolSetting
    });
  }
  return outbounds
}

function getHost(opts) {
  var host = ''

  if ('host' in opts) {
    host = opts['host']
  } else if ('Host' in opts) {
    host = opts['Host']
  } else if ('headers' in opts) {
    return getHost(opts['headers'])
  }
  return host
}

export default clash2UIF
