import requests

def DownLoad(src_url, dst):
    r = requests.get(src_url)
    open(dst, 'wb').write(r.content)

url = 'https://github.com/SagerNet/sing-box/releases/latest/download/'

file_name = ''
