# Hardhat 小白入门学习笔记

适配零基础，极简实操版

## 一、Hardhat 是什么

以太坊主流智能合约开发框架，用于**编写、编译、测试、部署、验证合约**，本地就能跑链环境，开发调试方便。

它是目前比较流行的一款开发工具，提供了很多工具、插件给开发者使用，方便开发者提高工作效率。

## 二、前置环境必备

1. 安装 Node.js（16+稳定版本）
2. 安装 npm 包管理工具
3. 基础命令行操作能力

## 三、安装 & 初始化项目

1. 新建空文件夹，命令行进入目录
2. 初始化项目

```bash
npm init -y
```

3. 全局/本地安装 Hardhat

```bash
npm install --save-dev hardhat
```

4. 创建 Hardhat 项目

```bash
npx hardhat
```

按需选择：创建基础示例项目，自动生成合约、测试、配置文件

## 四、目录基础认知

- `contracts`：存放所有智能合约代码
- `test`：合约测试脚本
- `scripts`：部署、交互脚本
- `hardhat.config.js`：框架配置、链网络、钱包信息

## 五、常用基础命令

1. 编译合约

```bash
npx hardhat compile
```

2. 运行合约测试

```bash
npx hardhat test
```

3. 启动本地私有节点

```bash
npx hardhat node
```

4. 执行部署脚本

```bash
npx hardhat ignition deploy ignition/modules/xxx.js --network xxx
```

5. 指定网络部署

```bash
npx hardhat ignition deploy ignition/modules/xxx.js --network
```

- Hardhat Ignition 是 Hardhat 官方推出的、专门用于管理智能合约部署的工具库，简单说就是帮你把 “部署合约” 这件事做得更规范、更省心、更不容易翻车。
- --verify 是可选的，它告诉 Hardhat ignition在部署成功后验证合约。

6. 检查现有部署

#### 1. 列出所有部署 ID

```bash
npx hardhat ignition deployments
```

- 作用：查看当前项目中，所有链上的部署记录（返回 `chain-xxx` 格式的部署 ID）
- 示例输出：
  ```
  chain-31337
  ```
  （这里的 `31337` 是 Hardhat 本地链的 Chain ID）

7. 查看某个部署的详细状态

```bash
npx hardhat ignition status <部署ID>
```

- 作用：查询指定部署的状态（是否成功、部署的合约地址等）
- 示例：
  ```bash
  npx hardhat ignition status chain-31337
  ```
- 示例输出：
  ```
  Deployment chain-31337 (chainId: 31337) was successful
  Deployed Addresses
  ...
  ```

---

8.可视化你的部署模块

```bash
npx hardhat ignition visualize ./ignition/modules/你的模块.js
```

- 作用：生成一个 HTML 文件，用图形化方式展示你的部署模块里的合约、依赖关系、函数调用
- 示例：
  ```bash
  npx hardhat ignition visualize ./ignition/modules/TheWebThree.js
  ```
- 小白理解：相当于给你的部署脚本画了一张“流程图”，一眼看清合约之间的关系，调试时特别好用

---

9. 清除/重置部署记录

#### 1. 完全清除指定部署（wipe）

```bash
npx hardhat ignition wipe <deploymentId> <futureId>
```

- 作用：删除 Ignition 本地记录里的部署状态，适合部署出错想“重来”的场景
- 注意：这个命令**不会自动从链上删除已部署的合约**，只是清除本地的部署记录

#### 2. 部署时强制重置（--reset）

```bash
npx hardhat ignition deploy ignition/modules/你的模块.ts --network localhost --reset
```

- 作用：部署时加上 `--reset`，会强制忽略之前的部署记录，重新执行完整的部署流程
- 适用场景：本地测试链上，想重新部署一遍所有合约，不用手动清缓存

---

10. 进阶部署（Create2 固定地址部署）

```bash
npx hardhat ignition deploy ignition/modules/Apollo.js --network sepolia --[create2相关参数]
```

- 作用：用 Create2 方式部署合约，可以提前算出合约地址，保证不同链上部署的合约地址一致
- 适用场景：跨链项目、需要固定合约地址的协议开发

## 六、核心实操步骤

### 1. 编写合约

在 contracts 文件夹新建 `.sol` 文件，书写 Solidity 代码，以ERC20代币为常用入门案例。

### 2. 本地测试

写完合约执行 test 命令，校验转账、授权、增发等功能是否正常，排查漏洞。

### 3. 本地节点部署

启动本地节点，执行部署脚本，本地验证合约可用性。

### 4. 测试网部署（Sepolia）

1. 配置文件添加测试网RPC、钱包私钥
2. 钱包领取测试代币
3. 执行命令部署上测试公链

### 5. 合约验证

部署后提交合约源码，浏览器可公开查看合约代码。

## 七、简易ERC20开发流程

1. 创建合约文件，编写代币名称、总量、转账逻辑
2. 编译无报错后编写测试用例
3. 本地测试功能无误
4. 本地节点部署试运行
5. 切换测试网正式部署
6. 区块浏览器查询、验证合约

## 八、小白避坑要点

1. 私钥严禁上传代码、公开分享，避免资产被盗
2. 部署公链前，务必先本地测试通过
3. 网络RPC地址填写正确，否则部署失败
4. 合约编译报错优先检查Solidity版本、语法格式
5. 测试网仅练手，不要转入真实资产

## 九、Hardhat 优势

- 代码调试直观，报错信息易懂
- 自带本地链，无需额外搭建节点
- 一键部署多公链，适配主流EVM网络
- 配套测试工具，降低合约出错概率
