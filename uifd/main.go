package main

import (
	"fmt"
	"os/exec"

	"github.com/uif/uifd/uif"
)

var process *exec.Cmd

func GetServicePath() string {
	res := uif.GetWorkSpace() + "/uifd/" + uif.GetCurrentUIFVersion() + "/uif_service"
	if uif.IsWindows() {
		res += ".exe"
	}
	return res
}

func StartService() {
	servicePath := GetServicePath()
	fmt.Println(servicePath)

	process := exec.Command(servicePath)
	err := process.Start()
	process.Wait()
	fmt.Println(err)
}

func main() {
	StartService()
}
