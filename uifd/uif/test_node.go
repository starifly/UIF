package uif

import (
	"io"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"

	"github.com/gorilla/websocket"
)

type TestNodeRes struct {
	Tag   string `json:"tag"`
	Delay int    `json:"delay"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func handleWebSocket(conn *websocket.Conn) {
	defer conn.Close()

	for {
		// 读取WebSocket消息
		_, _, err := conn.ReadMessage()
		if err != nil {
			break
		}

		// 发送回复消息
		err = conn.WriteMessage(websocket.TextMessage, []byte("Hello, WebSocket!"))
		if err != nil {
			break
		}
	}
}

func testNode(config string, tags []string, w http.ResponseWriter, r *http.Request) error {
	// use websocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return err
	}
	defer conn.Close()

	// init config
	portString, err := GetUnusedPort()
	if err != nil {
		return err
	}
	apiPort := strconv.Itoa(portString)
	clashAPIAddress := "http://127.0.0.1:" + apiPort
	timeout := "6"

	// do it
	for _, v := range tags {
		go func(tag string) {
			res := &TestNodeRes{Tag: tag, Delay: 0}
			resp, err := http.Get(clashAPIAddress + "/proxies/" + tag + "/delay?timeout=" + timeout)
			if err != nil {
				return
			}
			defer resp.Body.Close()
			conn.WriteJSON(res)

			body, err := io.ReadAll(resp.Body)
			if err != nil {
				return
			}
			res.Tag = string(body)
		}(v)
	}

	return nil
}

func RunTestCore(config string, outLength int, port string) error {
	strings.ReplaceAll(config, "port", port)
	path := GetWorkSpace() + "/" + port
	os.WriteFile(path, []byte(config), 0644) // Create new if it is not exist
	defer os.Remove(path)
	defer os.Remove(path)

	testProcess := exec.Command(GetCorePath(), "run", "-c", path)
	testProcess.Dir = GetWorkSpace()

	err := testProcess.Start()
	if err != nil {
		return err
	}

	err = testProcess.Process.Kill()
	if err != nil {
		return err
	}
	return nil
}
