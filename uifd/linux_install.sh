#!/usr/bin/env bash

# 打印带颜色的文本的函数
print_colored_text() {
  local color=$1
  local style=$2
  shift 2
  local text="$@"

  case $color in
    "black")   color=0;;
    "red")     color=1;;
    "green")   color=2;;
    "yellow")  color=3;;
    "blue")    color=4;;
    "magenta") color=5;;
    "cyan")    color=6;;
    "white")   color=7;;
    *)         color=9;;
  esac

  case $style in
    "normal")    style=0;;
    "bold")      style=1;;
    "underline") style=4;;
    "reverse")   style=7;;
    *)           style=0;;
  esac

  echo -e "\033[${style};3${color}m${text}\033[0m"
}

get_random_available_port() {
  while true; do
    # 生成一个随机端口号，范围在1024到65535之间
    port=$((1024 + RANDOM % 64512))

    # 检查该端口是否可用
    if ! ss -tuln | grep -q ":$port"; then
        echo $port
        return 0
    fi
  done
}

get_public_ip() {
  local public_ip=$(curl -s https://api.ipify.org)

  if [ -z "$public_ip" ]; then
      echo "{YourIPAddress}" 
  else
      echo "$public_ip"
  fi
}


quit_with_error(){
  echo "UIF Install Error: "
  print_colored_text "red" "normal" "$1"
  echo ""
  exit 1
}

check_arch(){
  arch=$(uname -m)
  if [[ $arch == "x86_64" || $arch == "x64" || $arch == "amd64" ]]; then
      UIFARCH="amd64"
  elif [[ $arch == "aarch64" || $arch == "arm64" ]]; then
      UIFARCH="arm64"
  else
      UIFARCH="amd64"
  fi

  print_colored_text "green" "bold" "Arch: ${UIFARCH}"
}

# check sudo
if [[ "$(id -u)" != "0" ]]; then
  quit_with_error 'Need Root User!'
fi

# check systemd
if ! command -v systemctl &> /dev/null; then
  quit_with_error 'Missing "systemd"'
fi

# check pkg installer
if command -v yum &> /dev/null; then
  manager="rpm"
elif command -v apt &> /dev/null; then
  manager="deb"
else
  quit_with_error "Required 'yum' or 'apt'"
fi
check_arch

FILE_NAME="uif-linux-$UIFARCH.$manager"
CACHE_SAVE_PATH="./$FILE_NAME"

download_uif() {
  DOWNLOAD_LINK="https://github.com/UIforFreedom/UIF/releases/latest/download/$FILE_NAME"
  print_colored_text "green" "bold" "Downloading from: $DOWNLOAD_LINK"
  if ! curl -R -L -H 'Cache-Control: no-cache' -o "$1"  "$DOWNLOAD_LINK"; then
    quit_with_error 'Download failed! Please check your network or try again.'
  fi
}
download_uif "$CACHE_SAVE_PATH"

# 先关掉
sudo systemctl stop uiforfreedom || true

if [[ $manager == "deb" ]]; then
  sudo apt remove -y uiforfreedom || true
  if ! sudo apt install -y "$CACHE_SAVE_PATH"; then
    quit_with_error "Failed to install 'uif' by 'apt'."
  fi
else
  sudo yum remove -y uiforfreedom || true
  if ! sudo yum localinstall -y "$CACHE_SAVE_PATH"; then
    quit_with_error "Failed to install 'uif' by 'yum'."
  fi
fi

extract_port_from_file() {
  local file_path="$1"

  # 检查文件是否存在
  if [ -e "$file_path" ]; then
    local file_content=$(cat "$file_path")

    # 使用awk提取端口号
    local port=$(echo "$file_content" | awk -F: '{print $2}')

    echo "$port"
    return 0
  else
    # 文件不存在时返回空值
    return 1
  fi
}

# 放行端口的函数
allow_port() {
  local port="$1"
  local network="$2"

  # 检查系统使用的防火墙工具
  if systemctl is-active --quiet firewalld; then
      # 使用 firewalld 放行端口
      echo "Using firewalld to allow port $port"
      
      sudo firewall-cmd --permanent --add-port="${port}/${network}"
      sudo firewall-cmd --reload

  elif command -v iptables >/dev/null; then
      # 使用 iptables 放行端口
      echo "Using iptables to allow port $port"
      
      sudo iptables -A INPUT -p $network --dport "$port" -j ACCEPT
      
      # 保存 iptables 规则（路径根据系统配置可能会有所不同）
      sudo iptables-save | sudo tee /etc/iptables/rules.v4 >/dev/null

  else
    quit_with_error "can not open port."
  fi
}

API_ADDRESS_PATH="/usr/bin/uif/uif_api_address.txt"

# 初始化API端口
api_port=$(extract_port_from_file "$API_ADDRESS_PATH")
if [ $? -eq 0 ]; then
  print_colored_text "yellow" "bold" "Extracted port: $api_port"
else
  #不存在时初始化一个可用端口
  api_port=$(get_random_available_port)
fi
# 写API address 配置
echo "0.0.0.0:$api_port" | sudo tee $API_ADDRESS_PATH > /dev/null
#放行端口
# allow_port $api_port "tcp"

# 确保都有权限
sudo chmod -R 755 /usr/bin/uif/

# systemctl stop uiforfreedom
# rm -R /usr/bin/uif/

#启用
sudo systemctl restart uiforfreedom
public_ip=$(get_public_ip)

print_uif_password() {
  echo "Password:\t "
  cat /usr/bin/uif/uif_key.txt
  echo ""
  echo ""
}

echo ""
print_colored_text "green" "bold" "API Address:\thttp://$public_ip:$api_port"
print_uif_password
