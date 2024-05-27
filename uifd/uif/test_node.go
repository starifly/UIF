package uif

import (
	"encoding/json"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type TestNodeRes struct {
	Status int    `json:"status"`
	Msg    string `json:"msg,omitempty"`
	Tag    string `json:"tag,omitempty"`
	Delay  int    `json:"delay"`
}

type TestNodeReq struct {
	Config   string   `json:"config,omitempty"`
	Tags     []string `json:"tags"`
	IsIpInfo bool     `json:"is_ip_info"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func TestMultipleNode(conn *websocket.Conn) error {
	msgJson := &TestNodeReq{}
	err := conn.ReadJSON(msgJson)
	if err != nil {
		WriteLog(err.Error())
		return err
	}

	// init config
	portInt, err := GetUnusedPort()
	if err != nil {
		WriteLog(err.Error())
		conn.WriteJSON(&TestNodeRes{Status: 1, Msg: "failed to GetUnusedPort()"})
		return err
	}
	apiPort := strconv.Itoa(portInt)
	msgJson.Config = strings.ReplaceAll(msgJson.Config, "111111", apiPort)
	configPath := GetWorkSpace() + "/" + apiPort + ".json"
	os.WriteFile(configPath, []byte(msgJson.Config), 0644) // Create new if it is not exist
	defer os.Remove(configPath)
	apiAddress := "http://127.0.0.1:" + apiPort

	// run it
	testProcess, err := RunTestCore2(configPath, apiPort)
	if err != nil {
		WriteLog(err.Error())
		conn.WriteJSON(&TestNodeRes{Status: 1, Msg: err.Error()})
		return err
	}
	defer testProcess.Process.Kill()
	time.Sleep(1 * time.Second)

	if msgJson.IsIpInfo {
		ProxyHTTP2("", apiPort)
	}

	// test it
	var writeMux sync.Mutex
	for _, v := range msgJson.Tags {
		go func(tag string) {
			res := &TestNodeRes{Tag: tag, Delay: 0, Status: 0, Msg: ""}
			body, err := HTTPGetDirect(apiAddress + "/proxies/" + tag + "/delay?timeout=10000")
			if err != nil {
				WriteLog(err.Error())
				return
			}
			res.Msg = body
			err = json.Unmarshal([]byte(body), &res)
			if err != nil {
				res.Msg = err.Error()
			}
			writeMux.Lock()
			defer writeMux.Unlock()
			conn.WriteJSON(res)
		}(v)
	}
	time.Sleep(20 * time.Second)
	return nil
}

func RunTestCore2(path string, port string) (*exec.Cmd, error) {
	testProcess := exec.Command(GetCorePath(), "run", "-c", path)
	testProcess.Dir = GetWorkSpace()
	ProcessSet(testProcess)

	pipe, err := testProcess.StderrPipe()
	if err != nil {
		return nil, err
	}
	go SaveLog(pipe)

	err = testProcess.Start()
	if err != nil {
		return nil, err
	}

	return testProcess, nil
}
