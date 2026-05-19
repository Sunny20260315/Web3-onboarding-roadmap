# Uniswap 自定义链接指南

基于 [Uniswap 开发者文档](https://developers.uniswap.org/docs/trading/custom-interface-links)

## 概述

Uniswap 前端支持 URL 查询参数，允许开发者和用户通过自定义链接打开 Uniswap 并预填充设置。这对于集成场景非常有用。

### 重要规则

- 每个页面有特定的可用 URL 参数
- 全局参数可用于所有页面
- 在错误的页面使用参数不会产生效果
- 未设置的参数使用默认值

---

## 全局参数（Global）

所有页面都适用的参数。

| 参数    | 类型   | 说明                                  |
| ------- | ------ | ------------------------------------- |
| `theme` | String | 设置深色或浅色模式：`light` 或 `dark` |

### 示例

```
https://app.uniswap.org/#/swap?theme=dark
```

---

## Swap 页面（交换页面）

### 默认行为

- ETH 默认作为输入货币
- 当选择不同的代币时，另一侧会默认使用 ETH

### 约束条件

| 约束项           | 说明                                              |
| ---------------- | ------------------------------------------------- |
| **地址格式**     | 必须是有效的 ERC20 地址                           |
| **Slippage**     | 范围：0 或 10～9999 bips（对应 0% 或 0.01%～99%） |
| **数值格式**     | 金额和滑点值必须是前端接受的有效数字              |
| **ETH 作为输出** | 若选择 ETH 为输出，inputCurrency 不能是 ETH       |
| **设置金额**     | 必须同时设置 `field` 和 `value`，否则无效         |

### Swap 参数

| 参数             | 类型           | 说明                                    |
| ---------------- | -------------- | --------------------------------------- |
| `inputCurrency`  | address        | 输入货币（要被交换的）                  |
| `outputCurrency` | address 或 ETH | 输出货币（要换入的）                    |
| `value`          | number         | 交换金额                                |
| `field`          | string         | 指定金额适用的字段：`input` 或 `output` |

### 设置金额说明

`field` 和 `value` 两个参数必须**同时设置**，用于指定要卖出或买入的代币数量。

### Swap 示例

**场景**：预填充 10 个 USDM（一个代币）准备交换

```
https://app.uniswap.org/#/swap?field=input&value=10&inputCurrency=0x0F5D2fB29fb7d3CFeE444a200298f468908cC942
```

**说明**：

- `field=input`：设置输入字段
- `value=10`：输入 10 个代币
- `inputCurrency=0x0F5D2fB29fb7d3CFeE444a200298f468908cC942`：USDM 代币地址

### Swap 完整示例

交换 USDC 换 DAI，金额 50：

```
https://app.uniswap.org/#/swap?inputCurrency=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&outputCurrency=0x6B175474E89094C44Da98b954EedeAC495271d0F&field=input&value=50
```

---

## Pool 页面（流动性页面）

Pool 页面有两个子路由：`add`（添加）和 `remove`（移除）

### 添加流动性（Add Liquidity）

URL 格式：`https://app.uniswap.org/#/add/v2/{token0}/{token1}`

| 参数     | 类型    | 说明                                              |
| -------- | ------- | ------------------------------------------------- |
| `Token0` | address | 池的第一个代币地址（必须是有效的 ERC20 且已存在） |
| `Token1` | address | 池的第二个代币地址（必须是有效的 ERC20 且已存在） |

### 添加流动性示例

USDC + USDT 池：

```
https://app.uniswap.org/#/add/v2/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/0xdAC17F958D2ee523a2206206994597C13D831ec7
```

---

## 移除流动性（Remove Liquidity）

URL 格式：`https://app.uniswap.org/#/remove/{token0}-{token1}`

| 参数     | 类型    | 说明                                                 |
| -------- | ------- | ---------------------------------------------------- |
| `Token0` | address | 要从其中移除流动性的池的代币 0（必须是有效的 ERC20） |
| `Token1` | address | 要从其中移除流动性的池的代币 1（必须是有效的 ERC20） |

### 移除流动性示例

DAI + WETH 池：

```
https://app.uniswap.org/#/remove/0x6B175474E89094C44Da98b954EedeAC495271d0F-0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
```

---

## 实战应用场景

### 场景 1：DApp 中嵌入交换链接

在你的 DApp 中提供一个快速交换按钮：

```javascript
const swapUrl = (inputToken, outputToken, amount) => {
  const baseUrl = "https://app.uniswap.org/#/swap";
  const params = new URLSearchParams({
    inputCurrency: inputToken,
    outputCurrency: outputToken,
    field: "input",
    value: amount,
    theme: "dark",
  });
  return `${baseUrl}?${params.toString()}`;
};

// 使用
const link = swapUrl(
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
  "100",
);
```

### 场景 2：营销活动链接

创建预填充的交换链接以简化用户操作：

```
https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&field=input&value=1&theme=dark
```

### 场景 3：流动性提供者快速入口

```
https://app.uniswap.org/#/add/v2/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
```

---

## 常见错误和注意事项

| 错误           | 原因                                    | 解决方案                                          |
| -------------- | --------------------------------------- | ------------------------------------------------- |
| 参数不生效     | 在错误页面使用了参数                    | 检查参数是否适用于当前页面                        |
| 金额未预填     | 只设置了 `value` 没设置 `field`         | 必须同时设置两个参数                              |
| ETH 出现在两侧 | outputCurrency=ETH 且 inputCurrency=ETH | 改为 outputCurrency=其他代币                      |
| 无效交易       | 代币地址或 Slippage 值不合法            | 使用有效的 ERC20 地址，Slippage 范围 0 或 10-9999 |

---

## 相关资源

- [Uniswap 开发者文档](https://developers.uniswap.org/docs)
- [Uniswap 交换 FAQ](https://developers.uniswap.org/docs/trading/swapping-api/faqs)
- [Uniswap GitHub](https://github.com/uniswap)
- [Uniswap Discord](https://discord.gg/uniswap)
