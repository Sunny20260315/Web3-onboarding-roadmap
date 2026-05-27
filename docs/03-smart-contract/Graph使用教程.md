# Graph使用教程
Graph 是一种区块链数据解决方案，它为 80 多个区块链上的各种应用程序、分析系统和人工智能系统提供支持。

**核心产品：**
- 用于 Web3 应用程序的 Token API
- 用于智能合约索引的 Subgraphs（子图）
- 用于实时和历史数据传输的 Substreams（子流）

## 子图
子图是链上数据的定制化索引与查询层，把杂乱的链数据变成好用的 API，是 Web3 数据基础设施的核心；在溯源、审计、追责场景里，它是底层数据来源和聚合工具。
[官方链接](https://thegraph.com/docs/en/subgraphs/developing/creating/subgraph-manifest/)

### 子图解决了什么问题
**（1）链上数据太难查**
原始链数据：十六进制、日志、事件散在一起；
子图：直接给你 用户地址、转账金额、时间、NFT ID、手续费 等结构化字段。

**（2）不用自己跑全节点**
自己搭节点：成本高、同步慢、维护麻烦；
子图：去中心化网络帮你索引，直接用。

**（3）前端 / 分析工具刚需**
Uniswap、Sushi、AAVE、OpenSea 的数据看板，全是靠子图跑的；
你看到的 “交易量、持仓、历史记录”，都是子图查出来的。

### 如何创建子图

**子图的生命周期**
![alt text](images/image.png)

**步骤**
1. 前往 [Subgraph Studio](https://thegraph.com/studio/) 创建子图
2. 创建子图
3. 安装 Graph Cli
```bash
npm install -g @graphprotocol/graph-cli@latest
// 或
yarn global add @graphprotocol/graph-cli
//验证
graph --version
```
4. 初始化子图
```bash
graph init --graph-name <graph-name> --schema <schema-file>
```
项目结构：
```bash
your-subgraph/
├── abi/                # 合约ABI文件目录（必填）
│   └── Contract.json   # 目标智能合约ABI
├── src/                # 映射逻辑代码目录（业务核心）
│   └── mapping.ts      # 事件监听、数据解析、实体写入逻辑
├── subgraph.yaml       # 子图**配置入口文件**（核心配置）
├── schema.graphql      # 数据模型定义（GraphQL 实体）
├── package.json        # 依赖、脚本命令
├── tsconfig.json       # TypeScript 配置
└── .gitignore
```

## 子流

## Token API

## Graph Node

## Firehose

# 关键字

- GRT：是 The Graph 协议的“燃料”和“经济引擎”，用于支付查询费用。