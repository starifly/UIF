package auto_update

import (
	"fmt"

	"github.com/melbahja/got"
	"github.com/uif/uifd/uif"
)

func GetFileName() string {
	var name = "uif-"
	if uif.IsWindows() {
		name += "windows-amd64.zip"
	} else if uif.IsMacos() {
		name += "darwin-amd64.tar.gz"
	} else {
		name += "linux-amd64.tar.gz"
	}
	return name
}

func main() {

	DistList := []string{"https://github.com/UIforFreedom/UIF/releases/latest/download/" + GetFileName(), "b", "c", "d"}
	g := got.New()

	for _, s := range DistList {
		fmt.Println("正在尝试：" + s)
		err := g.Download(s, uif.GetWorkSpace()+"/uif_new_version")

		if err != nil {
			continue
		}
	}

}
