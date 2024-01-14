package uif

import (
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"
)

type TestNodeRes struct {
	Tag   string `json:"path"`
	Delay int    `json:"delay"`
}

func testNode(tag string, clashAPIAddress string) {
	// res := &TestNodeRes{Tag: tag, Delay: 0}
	resp, err := http.Get(clashAPIAddress + "/proxies/" + tag + "/delay?timeout=6")
	if err != nil {
		return
	}
	defer resp.Body.Close()

	// body, err := io.ReadAll(resp.Body)
	// if err != nil {
	// 	return
	// }

}

func RunTestCore(config string, outLength int) error {
	temp, err := GetUnusedPort()
	if err != nil {
		return err
	}
	port := strconv.Itoa(temp)

	strings.ReplaceAll(config, "port", port)
	path := GetWorkSpace() + "/" + port
	// clashAPIAddress := "http://127.0.0.1:" + port
	os.WriteFile(path, []byte(config), 0644) // Create new if it is not exist
	defer os.Remove(path)

	testProcess := exec.Command(GetCorePath(), "run", "-c", path)
	testProcess.Dir = GetWorkSpace()

	err = testProcess.Start()
	if err != nil {
		return err
	}

	err = testProcess.Process.Kill()
	if err != nil {
		return err
	}
	return nil
}
