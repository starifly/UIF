package uif

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestLoadRoot(t *testing.T) {
	IsTest = true

	assert.NotEqual(t, GetWorkSpace(), "")
	// cwd, _ := os.Getwd()
	// assert.Equal(t, GetWorkSpace(), cwd)
}

func TestGetVersion(t *testing.T) {
	log.Println(GetVersion())
}

func TestUnusedPort(t *testing.T) {
	_, err := GetUnusedPort()
	assert.Nil(t, err)
}

func TestGetKey(t *testing.T) {
	defer os.Remove(GetWorkSpace() + "/uif_key.txt")

	key1 := GetKey()
	assert.Equal(t, GetKey(), key1)
}

func TestCloseCore(t *testing.T) {
}

func TestUIFConfig(t *testing.T) {
	defer os.Remove(GetWorkSpace() + "/uif.json")

	config := ReadUIFConfig()
	assert.Equal(t, config, "{}")
	assert.Equal(t, ReadUIFConfig(), config)

	testConfig := "{\"abc\": 1}"
	SaveUIFConfig(testConfig)
	config = ReadUIFConfig()
	assert.Equal(t, testConfig, config)
}

func TestAppInfo(t *testing.T) {
	var m ConnectInfo
	json.Unmarshal([]byte(GetInfo()), &m)

	log.Println(string(GetInfo()))
	assert.NotEmpty(t, m.Path)
	assert.NotEmpty(t, m.StartTime)
	assert.NotEmpty(t, m.Version)
}

func TestPing(t *testing.T) {
	fmt.Println(Ping("www.google.com"))
}
