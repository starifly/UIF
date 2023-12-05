import {
  DeepCopy
} from "@/utils";

function Bound(uif_config) {
  var singBoxStyle = DeepCopy(uif_config['setting']);
  var transport = uif_config['transport']
  singBoxStyle['type'] = uif_config['protocol'];
  singBoxStyle['tag'] = uif_config['tag'];

  var transportProtocol = transport['protocol'];
  if (transportProtocol != 'tcp') {
    var transportSetting = uif_config['transport']['setting']
    transportSetting['type'] = transportProtocol
    singBoxStyle['transport'] = transportSetting
  }


  if ('multiplex' in transport) {
    if (transport['multiplex']['enabled'] != undefined) { // fix legacy bug
      delete transport['multiplex']
    } else {
      singBoxStyle['multiplex'] = transport['multiplex']
    }
  }

  if (transport['tls_type'] != 'none') {
    singBoxStyle['tls'] = transport['tls']
  }

  return singBoxStyle
}

function Inbound(uif_config) {
  var singBoxStyle = Bound(uif_config)
  singBoxStyle['listen'] = uif_config['transport']['address'];
  singBoxStyle['listen_port'] = parseInt(uif_config['transport']['port']);
  singBoxStyle['sniff'] = true;
  return singBoxStyle
}

function Outbound(uif_config) {
  var singBoxStyle = Bound(uif_config)
  var protocol = singBoxStyle['type']
  if (protocol == 'freedom') {
    singBoxStyle['type'] = 'direct'
  } else if (protocol != 'block') {
    singBoxStyle['server'] = uif_config['transport']['address'];
    singBoxStyle['server_port'] = parseInt(uif_config['transport']['port']);
  }

  if (protocol == 'hysteria2') {
    if (singBoxStyle['obfs'] != undefined && singBoxStyle['obfs']['type'] == '') {
      delete singBoxStyle['obfs']
    }
  }
  return singBoxStyle
}

export {
  Inbound,
  Outbound
}
