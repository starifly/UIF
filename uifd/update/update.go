package main

import (
	"fmt"
	"os"

	"github.com/uif/uifd/uif"
)

func main() {
	archURL := "https://github.com/SagerNet/sing-box/releases/download/"
	version := uif.GetCurrentCoreVersion()
	osType := []string{"windows", "linux", "darwin"}
	arche := []string{"amd64", "arm64", "armv7"}

	for o := range osType {
		for a := range arche {
			if osType[o] != "linux" && arche[a] == "armv7" {
				continue
			}

			name := "sing-box-" + version + "-" + osType[o] + "-" + arche[a]
			substr := ".tar.gz"
			if osType[o] == "windows" {
				substr = ".zip"
			}
			url := archURL + "v" + version + "/" + name + substr
			downloadPath := uif.GetWorkSpace() + "/" + name + substr
			fmt.Println(url)
			fmt.Println(downloadPath)
			if err, _ := uif.DownloadFile(downloadPath, url); err != nil {
				panic(err)
			}
			saveArch := arche[a]
			if saveArch == "armv7" {
				saveArch = "arm"
			}
			decompressPath := uif.GetWorkSpace() + "/cores/" + osType[o] + "/" + saveArch + "/"
			if err := uif.Decompress(downloadPath, decompressPath); err != nil {
				panic(err)
			}
			if err := os.Rename(decompressPath+name, decompressPath+version); err != nil {
				panic(err)
			}
			os.WriteFile(decompressPath+"tag.txt", []byte(version), 0644) // Create new if it is not exist
			os.Remove(downloadPath)
		}
	}
}
