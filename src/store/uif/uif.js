import {
  v4 as uuidv4
} from "uuid";
import {
  formatTime,
  GetAPIAddress,
  GetKey,
  InitSetting,
  MyPost,
  MyGet,
  MyWS,
  SetAPIAddress,
  SetKey,
  SetSession,
  GetAllSession,
  DELAY_TIMEOUT
} from '@/utils'

import {
  BuildCoreConfig,
  BuildShareCoreConfig,
  DEFAULT_DNS
} from "@/uif/template/tun_fakeip";

import {
  Notification,
  Message
} from 'element-ui';

import moment from 'moment'

import {
  configObj,
  newFreedomOut
} from './config'

import clash2UIF from "@/store/uif/clash2uif";
import V2rayN2UIF from "@/store/uif/v2rayn2uif";
import UIFRaw from "@/store/uif/uif_share";
import Sing2UIF from './sing2uif';
import {
  BuildTestNodeTemplate
} from '@/uif/template/speedtest';
import {
  getToken
} from '@/utils/auth';

const state = {
  showToolTip: false,
  apiAddress: 'http://127.0.0.1:9413',
  password: '',
  coreLog: 'empty.',
  consoleAuto: true,
  startTime: 0,
  loginSession: [{
    password: '',
    value: 'http://127.0.0.1:9413'
  }],
  usingOutObj: newFreedomOut(),
  clashConnection: [{
    chains: ["freedom", "Rules::腾讯"],
    download: 234451,
    id: "7826f9d2-210f-46a8-b78e-672bdc15cba3",
    metadata: {
      network: "tcp",
      type: "mixed/默认 HTTP/Socks 入口0",
      sourceIP: "127.0.0.1",
      destinationIP: "",
      sourcePort: "49807",
      destinationPort: "443",
      host: "wup.browser.qq.com",
      dnsMode: "normal",
      processPath: "",
    },
    rule: "domain_keyword=[weixin qq tengxun] => Rules::腾讯",
    rulePayload: "",
    start: "2023-10-02T05:26:46.5865705+08:00",
    upload: 111552,
  }, ],
  connection: {
    isConnected: false,
    isConnecting: false,
    path: '',
    version: '-',
    coreVersion: '-',
    ip: '127.0.0.1',
    coreStatus: 3,
    system_info: {
      memory: {
        used: 100,
        available: 100
      }
    },
    cert: {
      public: `
-----BEGIN CERTIFICATE-----
MIIDHzCCAgegAwIBAgIRAIs4fKp4D/WQHd55ErUDP84wDQYJKoZIhvcNAQELBQAw
HzEdMBsGA1UEAxMUcDNHUWlNc2ZyaEkyVlI0Qy5jb20wHhcNMjQwMjEwMTI1MTE3
WhcNMjYwMjExMTI1MTE3WjAfMR0wGwYDVQQDExRwM0dRaU1zZnJoSTJWUjRDLmNv
bTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAK0dM0u2cIx9fK/EWcm6
B5+VOpvvno5GNLlGZhlUsHN5z/Pbbm3UCryEuZ98IkO4ci6iElDv7OFZ8QiKJolc
tJ6w6aAe9/x7/8N5fegkjug9PzTjYwd3ihdnSOFEcDBdXGS7VPBC9j1FyGF8egz/
jnisnvvWgmBSPJgDanMFRW+m80kBowzH8DkWTgY8FumIkqXH2gCl+7lbLV6nylmJ
kbXXsxsllOpcqGxhG7y8r1OkQokKC7PhtM/be1Ne6pz/1PoIrHZrtJU1+ZMQow5g
FqMptScwNwcKRyrNxC0G9kU0HQ0d3FPOpd4mfpqxWUbNryQAHx1ETF5BVC64bK5K
LFsCAwEAAaNWMFQwDgYDVR0PAQH/BAQDAgWgMBMGA1UdJQQMMAoGCCsGAQUFBwMB
MAwGA1UdEwEB/wQCMAAwHwYDVR0RBBgwFoIUcDNHUWlNc2ZyaEkyVlI0Qy5jb20w
DQYJKoZIhvcNAQELBQADggEBAH9pyj9wWD8Z7zVP7bfiEKYNF4uV9JqTdtaU8qYG
4OqSoR3kifMD3Mp40j0IodGYD9C/8niWErpS3MLKSbTRw62QKhlKE9atRUge0sj5
Q/53mkQ1YVTvxh8XKaCa4EYUky74z8oi1XXpgXtLCfDFUnfeXJlGm0j/iEk0UOku
lcV5shffeoLtO45RA2z/tq3WpV1D3SScKTznCgG1dhW0wMclD+Rko2FHLabKcp1e
xGGH3MEYRddi842MyuRQ6SGfQVjT7O7uuel1SJtO5HEi65r107k0EPAX16WFscTF
6AE1gvGqhsTiIogKRh7Sprr/r7UUPNsjR0+CwPA0u1gTLV8=
-----END CERTIFICATE-----`,
      key: `
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCtHTNLtnCMfXyv
xFnJugeflTqb756ORjS5RmYZVLBzec/z225t1Aq8hLmffCJDuHIuohJQ7+zhWfEI
iiaJXLSesOmgHvf8e//DeX3oJI7oPT8042MHd4oXZ0jhRHAwXVxku1TwQvY9Rchh
fHoM/454rJ771oJgUjyYA2pzBUVvpvNJAaMMx/A5Fk4GPBbpiJKlx9oApfu5Wy1e
p8pZiZG117MbJZTqXKhsYRu8vK9TpEKJCguz4bTP23tTXuqc/9T6CKx2a7SVNfmT
EKMOYBajKbUnMDcHCkcqzcQtBvZFNB0NHdxTzqXeJn6asVlGza8kAB8dRExeQVQu
uGyuSixbAgMBAAECggEAXygF4kBObWss9pC/qhsPxbCJnt2AEkSVBqKjzJi4xUDY
BftAIC7GGAn83qWlUAQ6/1cnKkY3t0dxLniB5k+HGRO118YuGiMu24wUoV43D4Fb
FP9Il/oldefYL7smz+8Bsn0mm0qzf8qz8qIxlKOE9OAuI9AtqjSKCiUWhlMHb+81
mgPnCoLSX4rXRwYunfD2F4FOAJtrV8BSKJWm1u3koiN9/HM18Chhk9/9Sv4Y1SbB
dq+/VVLUA3Zm1cFC/9HUXOWeyJ2J1rfLk29XiXSZN1bjbYJT7QTQ4RtGFKlHpiDn
UMkkPxbNtUjrjNzyg+LnLRAXfEfgU/XdMg1pq6yvQQKBgQDX0UXkzNYWOx8i6eaD
jYJh8ZfyDuG9cU3Ek6mcdutmqyo2FZ+8dSza/i4ZOXjZS2say/R60Mnxm50L4un1
wGqTNRlr3ro6/9B0XWHDLKUj0x50FMy6/N+KSwom9G0uJtYdiIID1PO8V46OAoHS
H0Wz/icUS/DmSBAuAyciIXwQjwKBgQDNWILxB2vuyF/0AkH6klHjGVRO8d7Dvrsw
cnos4t5T3ElQ59aOlZqOaMmK/aQdTNhnmbbdxTsOtt7LrcxjUMCMMj60LuLcas22
P8gm8JiI3w1H+fVpK3nyNw7G5LF1O+z/G6iZ9TJ8STRGK8Rs05SjFf3ZcKB0uhsy
R7C0Dsc1dQKBgQCH5euRK7sTvJ7aqVbSN+WGL09yyRQ06ogB5MnFEM0ilV27ONqh
HVflfnEgySPkEK2c7hlAzQCc91RpC7YvXb6+e41Kc7HpPPTSkYriD9bdPC/NANv6
UwmgV6hI51lo2mOxrSfRqeLhEnFd0w5UdgS6VqvdCATlvTMTBkE6KMOq2QKBgGvG
ges5hverqVjrem+mLl5wY+SPY+j/CUZTPzah2CjRnJVfKShq8tS9wNI3b9SFCavO
bMEXDHkbl/H1BSo3LugmUuzFEwK298Mo1MdDTfvAfjsBwUFytS1golvXmiA61JfM
j4BGxjmfPlV6ET1BC2lRWIuwZjb9mtqX7/GBNCMlAoGASz8W8i0d1Nex6p/BAKCt
SN25EoE4eRXvOaFg36srIGUxn6FYulAE7FDI4eqtyOD+kLStdy3i/40+XvobMtYG
7b8DClKsCqSuTXEDxN2rUeMpCCFBikqtfcayOB+YZjZu5E3+VwLmv3vpe0QDtqKq
9PnGVRDZ9sVHS8AheRSKrZ4=
-----END PRIVATE KEY-----`,
      domain: '',
    },
    times: '00:00:00'
  },
  subscribe: {
    isAdding: false,
    isOpenSub: false,
    info: {},
  },
  share: {
    isOpenShare: false,
    isSingle: false,
    info: {},
  },
  testWebsiteList: [{
      domain: "baidu.com",
      delay: "",
      delay2: 0,
      isTesting: false
    },
    {
      domain: "github.com",
      delay: "",
      delay2: 0,
      isTesting: false
    },
    {
      domain: "youtube.com",
      delay: "",
      delay2: 0,
      isTesting: false
    },
    {
      domain: "google.com",
      delay: "",
      delay2: 0,
      isTesting: false
    },
    {
      domain: "instagram.com",
      delay: "",
      delay2: 0,
      isTesting: false
    },
    {
      domain: "netflix.com",
      delay: "",
      delay2: 0,
      isTesting: false
    },
  ],
  pannel: {
    isOpen: false,
    isAdding: false,
    isClient: false,
    isShowingJson: false,
    info: {},
    info_string: '',
    all_list: [],
    index: 0
  },
  route: {
    isOpen: false,
    isAdding: false,
    info: {},
    all_list: [],
    index: 0,
    routeType: 'route',
    matchType: 'route'
  },
  config: { // to save
    startup: false,
    popupWeb: true,
    autoUpdateUIF: true,
    autoUpdateCore: true,
    urlTest: {
      testURL: 'https://www.gstatic.com/generate_204',
      interval: '5',
      tolerance: 70
    },
    ntp: {
      enabled: false,
      server: 'ntp.aliyun.com',
      interval: '30', // minute
      server_port: 123
    },
    share: {
      domain: '',
    },
    clash: {
      enabled: false,
      apiAddress: 'http://127.0.0.1:9181',
      apiKey: '',
    },
    geoIPAddress: 'https://github.com/soffchen/sing-geoip/releases/latest/download/geoip.db',
    geoSiteAddress: 'https://github.com/soffchen/sing-geosite/releases/latest/download/geosite.db',
    uifUpdateAddress: 'https://github.com/UIforFreedom/UIF',
    coreUpdateAddress: 'https://github.com/SagerNet/sing-box',
    dnsAddress: DEFAULT_DNS,
    routeType: 'route',
    coreAutoRestart: '0',
  },
}


var isStartedGlobalClock = false
var CLOCK_INTERNAL = 3000

function StartClock() {
  if (isStartedGlobalClock) {
    return
  }
  isStartedGlobalClock = true
  setTimeout(heartBeat, CLOCK_INTERNAL);
}

// only update when it is connected.
function UpdateInfo(res) {
  state.connection.isConnected = true
  state.connection.path = res.data.path
  state.connection.version = res.data.version
  state.connection.coreVersion = res.data.coreVersion
  state.connection.ip = res.data.ip
  state.connection.cert = res.data.cert
  state.connection.coreStatus = res.data.coreStatus
  state.connection.system_info = res.data.system_info
  state.startTime = moment(res.data.startTime * 1000)
  state.connection.times = `${formatTime(state.startTime.toDate(), '')}`

  if ('coreLog' in res.data && state.consoleAuto) {
    state.coreLog = res.data.coreLog
    state.connection.coreStatus = res.data.coreStatus
    state.connection.system_info = res.data.system_info
  }
  ClashConnection()
  StartClock() // update next time.
}

async function heartBeat() {
  if (state.connection.isConnected) {
    try {
      var res = await MyPost(state.apiAddress + '/connect', {});
      if ('status' in res.data) {
        ConnectErrorMsg('后端连接已断开！密码错误', 0)
        return
      }
      UpdateInfo(res)
    } catch (e) {
      console.log(e)
      ConnectErrorMsg('后端连接已断开！', 0)
    }
  }
  setTimeout(heartBeat, CLOCK_INTERNAL);
}

function ClashConnection() {
  if (!state.config.clash.enabled) {
    return
  }
  MyGet(state.config.clash.apiAddress + "/connections", {}).then(function(r) {
    state.clashConnection = r.data
  });
}

function ConnectErrorMsg(msg, duration) {
  DisConnect()
  Notification({
    message: msg,
    type: "error",
    duration: duration, // 0 means forever
  });
}

function CloseCore() {
  if (!state.connection.isConnected) {
    return;
  }
  MyPost(state.apiAddress + '/close_core', {}).then(function(_) {
    Message({
      type: 'success',
      message: '内核已关闭！'
    });
  }).catch(function(error) {
    console.log(error)
    Message.error({
      message: '内核关闭失败！' + error
    });
  });
}

function CloseUIF() {
  if (!state.connection.isConnected) {
    return;
  }
  MyPost(state.apiAddress + '/close_uif', {}).then(function(_) {
    Message({
      type: 'success',
      message: 'UIF 已关闭！'
    });
  }).catch(function(error) {
    console.log(error)
    Message.error({
      message: 'UIF 关闭失败！' + error
    });
  });
}

function GetUIFConfig() {
  if (!state.connection.isConnected) {
    return;
  }
  MyPost(state.apiAddress + '/get_uif_config', {}).then(function(res) {
    if (res.data == '') {
      return
    }
    state.config = InitSetting(res.data.uif, state.config)
    if (res.data.data != undefined) {
      configObj.state.config = res.data.data
    }
  }).catch(function(error) {
    console.log(error)
    Message.error({
      message: 'UIF 配置获取失败！' + error
    });
  });
}

function ApplyCoreConfig() {
  if (!state.connection.isConnected) {
    return;
  }
  var coreConfig = BuildCoreConfig(state.config, configObj.state.config)

  var inboudPorts = []
  for (var item in coreConfig['inbounds']) {
    item = coreConfig['inbounds'][item]
    if (item['listen'] != '0.0.0.0') {
      continue
    }
    inboudPorts.push(item['listen_port'].toString())
  }

  MyPost(state.apiAddress + '/run_core', {
    config: coreConfig,
    inboudPorts: inboudPorts,
  }).then(function(_) {
    Message({
      type: 'success',
      message: '内核已更新！'
    });
  }).catch(function(error) {
    console.log(error)
    Message.error({
      message: '内核更新失败！' + error
    });
  });
}

// save and apply UIF config, then apply this config to core config.
function SaveUIFConfig() {
  if (!state.connection.isConnected) {
    return;
  }
  var shareConfig = {}
  try {
    shareConfig = BuildShareCoreConfig(state.config, configObj.state.config)
  } catch (e) {
    console.log(e)
  }

  MyPost(state.apiAddress + '/save_uif_config', {
    config: {
      uif: state.config,
      data: configObj.state.config
    },
    shareConfig: shareConfig
  }).then(function(_) {
    Message({
      type: 'success',
      message: 'UIF 配置保存成功！'
    });
  }).catch(function(error) {
    console.log(error)
    Message.error({
      message: 'UIF 配置更新失败！' + error
    });
  });
}


async function ResetAll() {
  if (!state.connection.isConnected) {
    return;
  }
  await MyPost(state.apiAddress + '/save_uif_config', {
    config: {}
  });

  SetAPIAddress("undefined")
  SetKey("undefined");
  CloseCore()
  location.reload();
}

function Connect() {
  Notification.closeAll()
  if (state.connection.isConnected) {
    DisConnect()
    return;
  }
  var url = new URL(state.apiAddress)
  state.apiAddress = url.origin

  state.connection.isConnecting = true
  SetKey(state.password)

  MyPost(state.apiAddress + '/connect', {}).then(function(res) {
    state.connection.isConnecting = false

    if ('status' in res.data) { // failed to check.
      if (state.password == '') {
        Notification({
          message: 'UIF 后端已运行，请先输入密码 验证登录',
          type: "warning",
          duration: 0, // 0 means forever
        });
      } else {
        Notification({
          message: `验证失败！UIF密码 错误`,
          type: "error",
          duration: 0, // 0 means forever
        });
      }
      return
    }


    UpdateInfo(res)
    SetKey(state.password)
    SetAPIAddress(state.apiAddress)
    SetSession({
      'password': state.password,
      'value': state.apiAddress
    })

    if (res.data.isFirstTime) {
      SaveUIFConfig()
      ApplyCoreConfig()
    } else {
      GetUIFConfig()
    }
    Notification({
      message: "连接 UIF 成功！",
      type: "success",
      duration: 3000,
    });
  }).catch(function(error) {
    console.log(error)
    ConnectErrorMsg("无法连接后端，UIF 功能不可用，请确保本机正确地安装 UIF 并启动！", 0)
  });

}

function DisConnect() {
  Notification.closeAll()
  state.connection.isConnected = false
  state.connection.isConnecting = false
}

function Ping(row) {
  if (!state.connection.isConnected || row == undefined) {
    return;
  }

  row.delay = "";
  MyPost(state.apiAddress + '/ping', {
      address: row['transport']['address']
    })
    .then(function(res) {
      var rtt = res.data.res;
      if (rtt == "0") {
        rtt = "-1";
      }
      row.delay = rtt;
    })
    .catch(function(_) {});

}

function TryParse(inputData) {
  try {
    var res = UIFRaw(inputData);
    if (res.length > 0) {
      return res
    }
  } catch (error) {
    console.log("failed to parse as uif " + error);
  }

  try {
    var res = clash2UIF(inputData);
    if (res.length > 0) {
      return res
    }
  } catch (error) {
    console.log("failed to parse as clash " + error);
  }

  try {
    var res = V2rayN2UIF(inputData);
    if (res.length > 0) {
      return res
    }
  } catch (error) {
    console.log("failed to parse as v2rayn " + error);
  }

  try {
    var res = Sing2UIF(inputData);
    if (res.length > 0) {
      return res
    }
  } catch (error) {
    console.log("failed to parse as sing-box " + error);
  }
  return [];
}

async function UpdateSub() {

  var rawData = state.subscribe.info.data
  if (state.subscribe.info.type == 'link') {
    if (!state.connection.isConnected) {
      Message.error({
        message: "需先连接后端！"
      });
      return;
    }
    try {
      var res = await MyPost(state.apiAddress + "/proxy_get", {
        dst: state.subscribe.info.data,
      });
    } catch (error) {
      console.log(error);
      Message.error({
        message: '请求出错！' + error
      });
      return false;
    }
    if (res.data["status"] != 0) {
      console.log(res);
      Message.error({
        message: res.data["res"]
      });
      return false;
    }
    console.log(res.data);
    rawData = res.data["res"]
  }

  var outList = TryParse(rawData);
  console.log(outList)
  if (outList.length == 0) {
    Message.error({
      message: "导入数据解析出错！可能不支持该订阅格式"
    });
    return false;
  }

  for (var item in outList) {
    item = outList[item];
    item["enabled"] = false;
    item["delay"] = '';
    item["core_tag"] = '';
    item["id"] = uuidv4();
  }
  state.subscribe.info.outbounds = outList;
  state.subscribe.info.updateTime = new Date().valueOf();
  return true
}

function TestWeb1(t, start) {
  t["isTesting"] = true;
  MyPost(state.apiAddress + "/proxy_get", {
      dst: "https://www." + t["domain"],
    })
    .then(function(r) {
      t["isTesting"] = false;
      var end = new Date().getTime()
      if (r.data['status'] != 0) {
        t["delay2"] = -1;
      } else {
        t["delay2"] = end - start;
      }
      t["delay"] = `[ ${t.delay2}ms ]`;
    }).catch(function(e) {
      t["isTesting"] = false;
      t["delay2"] = -1;
      console.log(e)
    });
}


function TestWeb() {
  if (!state.connection.isConnected) {
    Message.error({
      message: "需先连接后端！"
    });
    return;
  }
  for (var item in state.testWebsiteList) {
    TestWeb1(state.testWebsiteList[item], new Date().getTime())
  }
}

function BuildShareLink() {
  if (!state.connection.isConnected) {
    Message.error({
      message: "需先连接后端！"
    });
    return '';
  }
  var apiAddress = new URL(state.apiAddress)
  return apiAddress.origin +
    "/share?key=" +
    encodeURIComponent(getToken());
}

async function InstallAutoStartup() {
  try {
    var res = await MyPost(state.apiAddress + "/auto_startup", {
      isInstall: state.config.startup,
    });
  } catch (error) {
    console.log(error);
    Message.error({
      message: '请求出错！' + error
    });
    return false;
  }
  if (res.data["status"] != 0) {
    console.log(res);
    Message.error({
      message: res.data["res"]
    });
    return false;
  }
  Message({
    type: 'success',
    message: '设置开机自启成功！'
  });
  return true
}

function TestNode(uifStyleNodeConfig) {
  if (!state.connection.isConnected) {
    return;
  }
  for (var item in uifStyleNodeConfig) {
    uifStyleNodeConfig[item]['delay'] = ' '
  }

  var tags = []
  var i = 0
  var config = BuildTestNodeTemplate(uifStyleNodeConfig)
  for (var item in config['outbounds']) {
    if (item == 0) {
      continue
    }
    item = config['outbounds'][item]
    item['tag'] = i.toString()
    tags.push(i.toString())
    i += 1
  }

  setTimeout(function() {
    for (var item in uifStyleNodeConfig) {
      if (uifStyleNodeConfig[item]['delay'] == ' ') {
        uifStyleNodeConfig[item]['delay'] = '-1'
      }
    }
  }, DELAY_TIMEOUT)

  MyWS(state.apiAddress + '/delay', {
    config: JSON.stringify(config),
    tags: tags,
  }, function(response) {
    console.log(response)
    var data = JSON.parse(response.data)
    var i = parseInt(data['tag'])
    var item = uifStyleNodeConfig[i]
    if (data['status'] == 0 && data['delay'] != 0) {
      item.delay = data['delay'].toString();
    } else {
      item.delay = '-1'
    }
  }, function(error) {
    Message.error({
      message: '测速出错：' + error
    });
  });
}

function Init() {
  var address = GetAPIAddress()
  if (address != '') {
    state.apiAddress = address
  }
  state.password = GetKey()
  var session = GetAllSession()
  if (session.length != 0) {
    state.loginSession = session
  }
  Connect()
}

Init()



const actions = {
  Connect,
  SaveUIFConfig,
  GetUIFConfig,
  ApplyCoreConfig,
  ResetAll,
  UpdateSub,
  Ping,
  CloseCore,
  CloseUIF,
  TestWeb,
  BuildShareLink,
  TestNode,
  InstallAutoStartup
}

export default {
  namespaced: true,
  state,
  actions
}
