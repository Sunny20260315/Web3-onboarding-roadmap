# 安装 Homebrew
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

# 安装docker 
这里我只安装了纯命令行，没有界面
```bash
# 安装 docker + docker-compose
brew install docker docker-compose

# 后台启动 Docker 服务（开机自启）
brew services start docker

# 验证
docker --version
docker compose version
```
只装了 docker 命令行工具，缺少守护进程 dockerd。可以尝试docker-machine 或 Colima,跑 docker 守护进程，但现代编程更推荐 Colima,因为它更轻量级，更易用。
```bash
# 安装 Colima
brew install colima

# 启动 Colima
colima start

# 验证
docker --version
docker compose version
``` 