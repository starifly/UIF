package uif

import (
	"bufio"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/prometheus-community/pro-bing"
)

var root string
var PrivateKey string
var IsTest bool
var CoreProcess *exec.Cmd
var started = false // run app onece
var AppStartTime int64
var CoreLog string
var Version string
var ApiPort = 0
var MyIp net.IP
var logMux sync.Mutex

func Log(msg string) {
	fmt.Println(msg)
}

func GetVersion() string {
	Version = "2023/09/26"
	return Version
}

// require sing-box is running.
func ProxyGet(dst string) string {
	res := ReqInfo{Status: 0}
	if dst == "" {
		res.Status = 2
		res.Res = "dst can not be empty."
	} else {
		proxyUrl, err := url.Parse("http://127.0.0.1:" + GetApiPort())
		http.DefaultTransport = &http.Transport{Proxy: http.ProxyURL(proxyUrl)}
		resp, err := http.Get(dst)
		if err != nil {
			res.Status = 1
			res.Res = err.Error()
		} else {
			defer resp.Body.Close()
			body, _ := io.ReadAll(resp.Body)
			res.Res = string(body)
		}
	}
	temp, _ := json.Marshal(res)
	return string(temp)
}

func SetAutoStartup(enable bool) string {
	res := ReqInfo{Status: 0}
	err := AutoStartup(enable)
	if err != nil {
		res.Status = 2
		res.Res = err.Error()
	}
	temp, _ := json.Marshal(res)
	return string(temp)
}

func GetWorkSpace() string {
	if root != "" {
		return root
	}
	ex, err := os.Executable()
	if err != nil {
		panic(err)
	}
	root = filepath.Dir(ex)
	if IsTest {
		root, err = os.Getwd()
	}
	Log("Working at: " + root)
	return root
}

func GetUIFConfig(config string) string {
	_, err := os.Stat(GetUIFConfigPath())
	if os.IsNotExist(err) {
		os.WriteFile(GetUIFConfigPath(), []byte(uuid.New().String()), 0644) // Create one
	}
	file, err := os.Open(GetUIFConfigPath())
	if err != nil {
		panic(err)
	}
	defer file.Close()
	content, err := io.ReadAll(file)
	config = string(content)
	if config == "" {
		config = "{}"
	}
	return config
}

func SaveUIFConfig(config string) {
	if config == "" {
		config = "{}"
	}
	os.WriteFile(GetUIFConfigPath(), []byte(config), 0644) // Create new if it is not exist
}

func GetAPIPortPath() string {
	return GetWorkSpace() + "/api_port.json"
}

func SaveUsingPort() {
	os.WriteFile(GetAPIPortPath(), []byte(GetApiPort()), 0644) // Create new if it is not exist
}

func ReadLastUsedPort() string { // read saving port
	_, err := os.Stat(GetAPIPortPath())
	if os.IsNotExist(err) {
		SaveUsingPort() // new one
	}
	file, err := os.Open(GetAPIPortPath())
	if err != nil {
		panic(err)
	}
	defer file.Close()
	content, err := io.ReadAll(file)
	apiPort := string(content)
	apiPort = strings.Split(apiPort, "\n")[0]
	return apiPort
}

func GetUIFConfigPath() string {
	return GetWorkSpace() + "/uif.json"
}

func GetCoreConfigPath() string {
	return GetWorkSpace() + "/core_config.json"
}

func GetCorePath() string {
	var path string
	if IsWindows() {
		path = GetWorkSpace() + "/core/sing-box.exe"
	} else {
		path = GetWorkSpace() + "/core/sing-box"
	}
	return path
}

func GetOutboundIP() string {
	return "127.0.0.1"
	if MyIp != nil {
		return MyIp.String()
	}
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		log.Fatal(err)
		return "127.0.0.1"
	}
	defer conn.Close()

	localAddr := conn.LocalAddr().(*net.UDPAddr)
	MyIp = localAddr.IP
	return MyIp.String()
}

func SaveCoreConfig(config string) {
	if config == "" {
		config = "{}"
	}
	config = strings.Replace(config, "\"UIFAPIPort\"", GetApiPort(), 1)
	os.WriteFile(GetCoreConfigPath(), []byte(config), 0644) // Create new if it is not exist
}

func ReadUIFConfig() string {
	path := GetWorkSpace() + "/uif.json"
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		SaveUIFConfig("{}")
	}
	file, err := os.Open(path)
	if err != nil {
		panic(err)
	}
	defer file.Close()
	content, err := io.ReadAll(file)
	return string(content)
}

func GetKey() string {
	if PrivateKey != "" {
		return PrivateKey
	}
	path := GetWorkSpace() + "/uif_key.txt"
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		os.WriteFile(path, []byte(uuid.New().String()), 0644) // Create one
	}
	file, err := os.Open(path)
	if err != nil {
		panic(err)
	}
	defer file.Close()
	content, err := io.ReadAll(file)
	PrivateKey = string(content)
	PrivateKey = strings.Split(PrivateKey, "\n")[0]
	Log("Private Key: " + PrivateKey)
	return PrivateKey
}

type ConnectInfo struct {
	Path      string `json:"path,omitempty"`
	Version   string `json:"version,omitempty"`
	CoreLog   string `json:"coreLog,omitempty"`
	Ip        string `json:"ip,omitempty"`
	StartTime int64  `json:"startTime,string,omitempty"`
}

type ReqInfo struct {
	Status int    `json:"status"`
	Res    string `json:"res,omitempty"`
}

var TryOnce bool

func TryFixTunFileExists() {
	if TryOnce {
		return
	}
	TryOnce = true
	RunCore() // rerun core.
}

func GetInfo() string {
	m := ConnectInfo{Path: GetWorkSpace()}
	if AppStartTime == 0 {
		AppStartTime = time.Now().Unix()
	}
	m.StartTime = AppStartTime
	m.CoreLog = ReadLog()
	m.Version = GetVersion()
	m.Ip = GetOutboundIP()
	res, _ := json.Marshal(m)
	return string(res)
}

func SaveLog(pipe io.ReadCloser) {
	reader := bufio.NewReader(pipe)
	for true {
		line, err := reader.ReadString('\n')
		if err != nil {
			return
		}
		if len(CoreLog) > 100000 {
			CoreLog = ""
		}
		logMux.Lock()
		fmt.Print(line)
		CoreLog += line
		logMux.Unlock()
		if strings.Contains(line, "configure tun interface: Cannot create a file when that file already exists") {
			TryFixTunFileExists()
		}
	}
}

func ReadLog() string {
	logMux.Lock()
	defer logMux.Unlock()
	return CoreLog
}

func IsWindows() bool {
	if runtime.GOOS == "windows" {
		return true
	}
	return false
}

func IsLinux() bool {
	if runtime.GOOS == "linux" {
		return true
	}
	return false
}

func IsMacos() bool {
	if runtime.GOOS == "darwin" {
		return true
	}
	return false
}

func OpenBrowser(url string) error {
	var err error

	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	default:
		err = fmt.Errorf("unsupported platform")
	}
	if err != nil {
		log.Fatal(err)
	}
	return err
}

func IsOpenBrowser() bool {
	if IsLinux() {
		return false
	}
	temp := ReadUIFConfig()
	if temp == "{}" {
		return true
	}
	return strings.Contains(temp, "\"popupWeb\":true")
}

func IsUseTun() bool {
	temp := ReadUIFConfig()
	return strings.Contains(temp, "tun")
}

func IsNeedAdmin() bool {
	return IsUseTun()
}

func RunCore() {
	CloseCore()

	CoreProcess = exec.Command(GetCorePath(), "run", "-c", GetCoreConfigPath())
	CoreProcess.Dir = GetWorkSpace()
	ProcessSet(CoreProcess)

	pipe, err := CoreProcess.StderrPipe()
	if err != nil {
		println(err.Error())
		return
	}
	go SaveLog(pipe)

	err = CoreProcess.Start()
	if err != nil {
		panic(err)
	}
	started = true
	AppStartTime = time.Now().Unix() // update run time.
}

func GetAppPath() string {
	exe, _ := os.Executable()
	return exe
}

func CloseCore() {
	if !started {
		return
	}

	if CoreProcess.ProcessState.ExitCode() != -1 {
		return
	}

	err := ProcessClose(CoreProcess)
	if err != nil {
		log.Println(err)
		return
	}

	err = CoreProcess.Wait()
	if err != nil {
		log.Println(err)
	}

	log.Println("core closed.")
}

func GetApiPort() (port string) {
	return "14454"
	if ApiPort == 0 {
		var err error
		ApiPort, err = GetUnusedPort()
		if err != nil {
			panic(err)
		}
		SaveUsingPort()
	}
	return strconv.Itoa(ApiPort)
}

func GetUnusedPort() (port int, err error) {
	var a *net.TCPAddr
	if a, err = net.ResolveTCPAddr("tcp", "localhost:0"); err == nil {
		var l *net.TCPListener
		if l, err = net.ListenTCP("tcp", a); err == nil {
			defer l.Close()
			return l.Addr().(*net.TCPAddr).Port, nil
		}
	}
	return 0, errors.New("failed to alloc.")
}

func Ping(addr string) string {
	if addr == "" {
		return ""
	}
	res := ReqInfo{Status: 0}
	pinger, err := probing.NewPinger(addr)
	pinger.SetPrivileged(true)
	pinger.Timeout = 3 * time.Second
	if err != nil {
		res.Status = 1
		res.Res = err.Error()
	} else {
		pinger.Count = 1
		err = pinger.Run() // Blocks until finished.
		if err != nil {
			res.Status = 2
			res.Res = err.Error()
		} else {
			stats := pinger.Statistics() // get send/receive/duplicate/rtt stats
			rtt := strconv.FormatInt(stats.AvgRtt.Milliseconds(), 10)
			res.Res = rtt
		}
	}
	temp, _ := json.Marshal(res)
	return string(temp)
}

func WriteOrRemove(isWrite bool, path, content string) error {
	var err error
	if isWrite {
		stat, _ := os.Stat(path)
		if stat == nil {
			err = os.WriteFile(path, []byte(content), 0644)
		}
	} else {
		err = os.Remove(path)
	}
	return err
}

func TCPPortCheck(port int) bool {
	l, err := net.Listen("tcp", fmt.Sprintf(":%s", strconv.Itoa(port)))

	if err != nil {
		return false
	}
	defer l.Close()
	return true
}
