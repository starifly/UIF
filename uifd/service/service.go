package main

import (
	"errors"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"sync"
	"time"

	"github.com/getlantern/elevate"
	"github.com/gorilla/websocket"
	"github.com/kardianos/service"
	"github.com/uif/uifd/uif"
)

var serviceMutext sync.Mutex

var APIServer http.Server
var WebServer http.Server

type ConnectInfo struct {
	Path      string `json:"path,omitempty"`
	Version   string `json:"version,string,omitempty"`
	StartTime string `json:"startTime,string,omitempty"`
}

func BuildAllowedDomain(r *http.Request) string {
	allowedDomain := "http://127.0.0.1:*"
	if uif.IsNeedKey() {
		allowedDomain = "*"
	} else {
		webPort, err := uif.GetWebAddressPort()
		if err == nil {
			allowedDomain = "http://127.0.0.1:" + webPort
		}
		if strings.Contains(r.Header.Get("Origin"), "uiforfreedom.github.io") {
			allowedDomain = "https://uiforfreedom.github.io"
		}
	}
	return allowedDomain
}

func CheckPassword(w http.ResponseWriter, r *http.Request) bool {
	// Protection.
	w.Header().Set("Access-Control-Allow-Origin", BuildAllowedDomain(r))
	w.Header().Set("Access-Control-Allow-Methods", "POST,OPTIONS,GET")
	w.Header().Set("Access-Control-Allow-Headers", "accept,x-requested-with,Content-Type")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("content-type", "application/json")

	p := r.URL.Query()
	token := p.Get("key")
	if token == "" {
		r.ParseForm()
		token = r.FormValue("key")
	}

	if uif.IsNeedKey() && token != uif.GetKey() {
		if token != "" {
			time.Sleep(3 * time.Second) // security.
		}
		fmt.Fprint(w, "{\"status\": -1}") // empty means no
		serviceMutext.Unlock()
		return false
	}
	return true
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func TestNode(w http.ResponseWriter, r *http.Request) {
	serviceMutext.Lock()
	if !CheckPassword(w, r) {
		return
	}
	serviceMutext.Unlock()
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		uif.WriteLog(err.Error())
		return
	}
	defer conn.Close()
	uif.TestNode2(conn)
}

func Service(w http.ResponseWriter, r *http.Request) {
	// {{{
	serviceMutext.Lock()
	if !CheckPassword(w, r) {
		return
	}

	path := r.URL.Path
	res := "{}"
	if path == "/get_uif_config" {
		res = uif.ReadUIFConfig()
	} else if path == "/save_uif_config" {
		config := r.FormValue("config")
		uif.SaveUIFConfig(config)
		uif.SetCoreAutoRestartTicker()
	} else if path == "/run_core" {
		config := r.FormValue("config")
		uif.SaveCoreConfig(config)
		uif.RunCore()
	} else if path == "/close_core" {
		uif.CloseCore()
	} else if path == "/auto_startup" {
		enable := r.FormValue("isInstall")
		if enable == "true" {
			res = uif.SetAutoStartup(true)
		} else {
			res = uif.SetAutoStartup(false)
		}
	} else if path == "/connect" {
		res = uif.GetInfo()
	} else if path == "/close_uif" {
		uif.CloseCore()
		CloseServer()
		serviceMutext.Unlock()
		uif.Uif_service.Stop()
	} else if path == "/proxy_get" {
		serviceMutext.Unlock()
		dst := r.FormValue("dst")
		res = uif.ProxyGet(dst)
		fmt.Fprint(w, res)
		return
	} else if path == "/ping" {
		serviceMutext.Unlock()
		address := r.FormValue("address")
		res := uif.Ping(address)
		fmt.Fprint(w, res)
		return
	} else if path == "/share" {
		res = uif.ReadCoreConfig()
	} else if path == "/update_uif" {
		res = uif.Update()
	} else if path == "/check_update" {
		res = uif.CheckUpdateReq()
	}

	fmt.Fprint(w, res)
	serviceMutext.Unlock()
	// }}}
}

func CheckPort() error {
	port, err := uif.GetWebAddressPort()
	if err != nil {
		return err
	}
	res, err := uif.TCPPortCheck(port)
	if err != nil {
		return err
	}
	if !res {
		return errors.New("web Port is in used.")
	}

	port, err = uif.GetAPIAddressPort()
	if err != nil {
		return err
	}
	res, err = uif.TCPPortCheck(port)
	if err != nil {
		return err
	}
	if !res {
		return errors.New("api Port is in used.")
	}
	return nil
}

func RunServer() error {
	web := http.FileServer(http.Dir(uif.GetWebPath()))
	WebServer = http.Server{
		Addr:    uif.GetWebAddress(),
		Handler: web,
	}
	go WebServer.ListenAndServe()

	api := http.NewServeMux()
	api.HandleFunc("/delay", TestNode)
	api.HandleFunc("/", Service)

	APIServer = http.Server{
		Addr:    uif.GetAPIAddress(),
		Handler: api,
	}
	go APIServer.ListenAndServe()
	return nil
}

func CloseServer() {
	err := WebServer.Close()
	if err != nil {
		panic(err)
	}
	err = APIServer.Close()
	if err != nil {
		panic(err)
	}
}

func WaitQuitSnignal() {
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)

	// Waiting for SIGINT (kill -2)
	<-stop
}

func StartupCore() {
	if !uif.IsFirstTime() {
		err := uif.RunCore()
		if err != nil {
			uif.WriteLog(err.Error())
		}
	}

	if uif.IsAutoUpdateUIF() {
		time.Sleep(10 * time.Second) // let core to be ready
		uif.Update()
	}
}

func Elevate() {
	isElevated := flag.Bool("is_elevated", false, "not for user.")
	flag.Parse()

	if uif.IsLinux() || !uif.IsNeedAdmin() || *isElevated {
		return
	}
	// err := uif.SetAdmin()
	path, err := os.Executable()
	cmd := elevate.Command(path, "--is_elevated")
	err = cmd.Run()
	if err != nil {
		fmt.Println(err)
	}
	os.Exit(0)
}

func CheckAndInit() error {
	if err := CheckPort(); err != nil {
		return err
	}
	if ip := uif.GetDefaultInterface(); ip == nil {
		uif.WriteLog("missing network interface.")
		// return errors.New("missing interface.")
	}
	return nil
}

func main() {
	SetupService()
}

type program struct{}

var logger service.Logger

func (p *program) Start(s service.Service) error {
	if err := CheckAndInit(); err != nil {
		uif.WriteLog(err.Error())
		return err
	}
	Elevate()
	RunServer()
	go StartupCore()
	uif.WriteLog("<<<< UIF running >>>>")
	if uif.IsOpenBrowser() {
		uif.WriteLog("Opening Web")
		err := uif.OpenBrowser("http://" + uif.GetWebAddress())
		if err != nil {
			uif.WriteLog("Can not open broswer.")
			uif.WriteLog(err.Error())
		}
	} else {
		uif.WriteLog("Setting not to open web.")
	}
	return nil // will not block
}
func (p *program) Stop(s service.Service) error {
	uif.WriteLog("UIF service closed.")
	return nil
}

func SetupService() {
	svcConfig := &service.Config{
		Name:        "uif_service",
		DisplayName: "uif_service",
		Description: "Checkout 'github.com/UIforFreedom/UIF' for more info.",
		Executable:  uif.GetUIFPath(),
	}

	prg := &program{}
	var err error
	uif.Uif_service, err = service.New(prg, svcConfig)
	if err != nil {
		log.Fatal(err)
	}
	logger, err = uif.Uif_service.Logger(nil)
	if err != nil {
		log.Fatal(err)
	}
	err = uif.Uif_service.Run()
	if err != nil {
		logger.Error(err)
	}
}
