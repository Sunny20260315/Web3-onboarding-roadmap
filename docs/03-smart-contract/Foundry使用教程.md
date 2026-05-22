# Foundry 小白使用指南（依据飞书文档整理）

## 一、Foundry 整体简介

EVM链高性能合约开发框架，用Rust编写，**编译、测试、部署速度远超Hardhat**，主流链合约开发常用。
包含三大核心工具：

1. **Forge**：合约编译、测试、打包核心工具
2. **Cast**：链交互工具，查询区块、转账、调用合约
3. **Anvil**：本地私有测试节点，本地调试用

## 二、安装命令

### Windows/Mac/Linux 通用安装

```bash
curl -L https://foundry.paradigm.xyz | bash
```

安装完成后初始化环境

```bash
foundryup
```

### 验证安装成功

```bash
forge --version
cast --version
anvil --version
```

## 三、基础项目初始化

1. 新建项目文件夹，进入目录

```bash
forge init
```

2. 初始化后默认目录结构

- `src`：存放智能合约源码
- `test`：合约测试代码
- `script`：合约部署、交互脚本
- `lib`：第三方合约库

## 四、常用基础命令

### 1. 编译合约

```bash
forge build
```

### 2. 运行合约测试

```bash
forge test
```

### 3. 启动本地节点 Anvil

```bash
anvil
```

默认本地链ID：31337，自动生成测试钱包地址与私钥

### 4. 部署合约

基础部署命令

```bash
forge script 脚本路径 --rpc-url 节点地址 --private-key 钱包私钥 --broadcast
```

### 5. Cast 链常用交互命令

- 查询账户余额

```bash
cast balance 钱包地址 --rpc-url 节点
```

- 调用合约只读方法

```bash
cast call 合约地址 "方法名(入参类型)" 参数 --rpc-url 节点
```

- 发起链上交易

```bash
cast send 目标地址 金额 --private-key 私钥 --rpc-url 节点
```

## 五、简易使用对比

- 速度：Foundry编译测试更快，适合高频开发
- 语法：原生Solidity测试，上手熟悉后效率极高
- 场景：大型合约、高频测试、链上脚本首选

## 六、小白简易避坑

1. 私钥切勿明文上传代码仓库
2. 本地anvil节点关闭后数据清空
3. 部署公链前必须本地测试全部通过
4. 依赖库缺失执行`forge install`安装依赖
