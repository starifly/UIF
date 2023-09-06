package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"sync"
	"time"

	"github.com/uif/uifd/uif"
)

var serviceMutext sync.Mutex

var APIServer http.Server
var WebServer http.Server
var WebServerPort = 9527
var APIServerPort = 9413

type ConnectInfo struct {
	Path      string `json:"path,omitempty"`
	Version   string `json:"version,string,omitempty"`
	StartTime string `json:"startTime,string,omitempty"`
}

func Service(w http.ResponseWriter, r *http.Request) {
	// {{{
	serviceMutext.Lock()

	// Protection.
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST,OPTIONS,GET")
	w.Header().Set("Access-Control-Allow-Headers", "accept,x-requested-with,Content-Type")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("content-type", "application/json")

	path := r.URL.Path
	r.ParseForm()
	token := r.FormValue("key")
	// log.Println(path)

	if token != uif.GetKey() {
		time.Sleep(3 * time.Second)       // security.
		fmt.Fprint(w, "{\"status\": -1}") // empty means no
		serviceMutext.Unlock()
		return
	}

	res := "{}"

	if path == "/get_uif_config" {
		res = uif.ReadUIFConfig()
	} else if path == "/save_uif_config" {
		config := r.FormValue("config")
		log.Println(config)
		uif.SaveUIFConfig(config)
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
		serviceMutext.Unlock() // use bug to close UIF.
		defer CloseServer()
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
	}

	fmt.Fprint(w, res)
	serviceMutext.Unlock()
	// }}}
}

func RunServer() {
	webAddress := "0.0.0.0:" + strconv.Itoa(WebServerPort)
	web := http.FileServer(http.Dir(uif.GetWorkSpace() + "/web/"))
	WebServer = http.Server{
		Addr:    webAddress,
		Handler: web,
	}
	go WebServer.ListenAndServe()

	api := http.HandlerFunc(Service)
	APIServer = http.Server{
		Addr:    "0.0.0.0:" + strconv.Itoa(APIServerPort),
		Handler: api,
	}
	APIServer.ListenAndServe()
}

func CloseServer() {
	err := WebServer.Shutdown(context.Background())
	if err != nil {
		panic(err)
	}
	err = APIServer.Shutdown(context.Background())
	if err != nil {
		panic(err)
	}
	log.Println("Server closed.")
}

func WaitQuitSnignal() {
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)

	// Waiting for SIGINT (kill -2)
	<-stop
}

func StartupCore() {
	_, err := os.Stat(uif.GetCoreConfigPath())
	if !os.IsNotExist(err) {
		uif.RunCore()
	}
}

func main() {
	if uif.IsWindows() && !uif.IsAdmin() {
		err := uif.SetAdmin()
		if err != nil {
			fmt.Println(err)
		}
	}
	go StartupCore()

	fmt.Println("<<<< UIF running >>>>")
	fmt.Printf("<<<< Visit: http://%s:%s >>>>\n", uif.GetOutboundIP().String(), strconv.Itoa(WebServerPort))
	fmt.Printf("<<<< Password: %s >>>>\n", uif.GetKey())

	if uif.IsOpenBrowser() {
		uif.OpenBrowser("http://127.0.0.1:" + strconv.Itoa(WebServerPort))
	}
	RunServer()

	uif.CloseCore()
	CloseServer()

}
