下面我一次性把 **V2/V3/V4 区别、前端必须懂的核心概念、核心业务场景、前端开发清单、可直接用的代码片段** 整理完整，全部偏前端视角、实战向，面试/写项目都能直接用。

---

## 一、Uniswap V2 / V3 / V4 核心区别（前端必背）

| 特性        | V2                                         | V3                                             | V4                                                        |
| ----------- | ------------------------------------------ | ---------------------------------------------- | --------------------------------------------------------- |
| 流动性模型  | 全区间 x·y=k                               | 集中流动性（自定义区间）                       | 集中流动性 + Hooks 可编程                                 |
| LP 凭证     | ERC20                                      | ERC721 NFT                                     | ERC6909                                                   |
| 费用        | 固定 0.3%                                  | 三档费率                                       | 可通过 Hooks 动态设置                                     |
| 架构        | Factory+Pair(每个代币对拥有独立的智能合约) | Factory+Pool (每个代币对+不同费率拥有独立合约) | 单例 (所有流动性池统一由单个 PoolManager 管理)PoolManager |
| Gas         | 中等                                       | 较高                                           | **最低**                                                  |
| 前端复杂度  | 低                                         | 中高                                           | 高（要处理 Hooks）                                        |
| 扩展性      | 不支持                                     | 不支持                                         | hooks                                                     |
| 原生ETH支持 | 必须包装成WETH                             | 必须包装成WETH                                 | 原生支持 (无需再包装成 WETH，大幅节省 Gas 费)             |

---

## 二、底层概念

### 1）AMM 自动做市商

- 没有订单簿，靠**资金池+公式**定价
- V2：`x*y=k`
- V3/V4：在选定区间内用 `x*y=k`，区间外价格不移动

### 2）流动性池（Pool）

- 两种代币按比例存入，供用户兑换
- V2：每个 Pair 一个池
- V3：每个（代币A+代币B+费率）一个池
- V4：全部池子在一个合约里

### 3）滑点 Slippage

区块链交易不是即时确认的。从用户在钱包点下“确认”到区块打包完成，中间可能有利差交易者或其他人抢先交易，导致价格变动。

- 交易时价格波动导致实际兑换变少
- **让用户设置滑点（0.1%–1%）→ 计算最小接收金额**

滑点设置（Slippage）： 前端必须提供一个 UI 允许用户设置可接受的滑点百分比（如 0.5%）。前端计算出用户最少必须收到的代币数量（amountOutMinimum）并传给合约。如果不设防，用户极易遭受夹子攻击（MEV 恶意三明治攻击），资产被白白榨干。

交易期限（Deadline）： 一个 Unix 时间戳（例如当前时间 + 10 分钟）。如果交易在打包时超过了这个时间，合约会自动拒绝（Revert），防止用户的交易在网络拥堵时卡住，在几小时后以极差的价格被动执行。

### 4）路由 Router

用户在兑换时，直接查询某一个池子往往拿不到最优价格。通常“代币 A ➔ 代币 B ➔ 代币 C”的多跳路径比直接兑换更划算。

前端不能盲目调用合约，而是需要先请求 Uniswap 官方的 Auto Router API 或 1inch 等聚合器 API，获取当前最优的路由路径、预期获得的代币数量（Quote）以及预估 Gas 费，并动态渲染到界面上。

- 前端不直接调用 Pool，而是调用 **Router（路由合约）**
- 自动找最优路径（如 ETH→USDC→DAI 比直接 ETH→DAI 更好）

### 5）V3/V4：Tick（刻度） / 价格区间

- Tick：价格的离散刻度（`price = 1.0001^tick`）
- LP 提供流动性必须选 **[tickLower, tickUpper]**
- 前端要画价格区间、选区间、计算仓位

注意事项： 当用户在 UI 输入“1000 ~ 2000”时，前端必须调用 Uniswap SDK（如 v3-sdk），将输入的价格转化为合约能看懂的最近的 TickLower 和 TickUpper。

### 6）V4 专属：Hooks

- 8 个生命周期钩子：`beforeSwap` / `afterSwap` / `beforeAddLiquidity`…
- 前端要：**识别池子是否带 Hook → 展示特殊逻辑（限价、动态费）**

### 7）授权 Approval

- ERC20 代币必须先授权给 Router/NFTManger，才能交易/加流动性
- 前端流程：**检查授权 → 未授权则发起授权交易 → 授权后再执行 swap/mint**

### 8）V4 核心：解锁回调与差额管理

V4 为了省 Gas 费，采用了单例模型和闪电记账。这改变了前端或周边合约的调用逻辑：任何交易（Swap、Add Liquidity）必须先调用 PoolManager.unlock()。

合约被解锁后，会触发一个回调函数，前端（或路由合约）在回调中把“兑换”、“添加流动性”等操作打包成一个批处理指令。

## 在这系列操作中，记账系统会产生代币的借贷差额（Delta）。在整个事务结束前，Delta 必须归零（即该付的付清，该拿的拿走），否则整个交易直接回滚（Revert）。 前端在做交易模拟（如通过 eth_call 预估交易）时，必须理解这种批处理逻辑。

## 三、核心业务场景

### 1）Swap 交易（最核心）

用户输入 A 代币数量，前端实时计算并展示 B 代币的预测输出量（Quote）、价格冲击（Price Impact）、滑点保护和路由路径。

Approve 联动： 检查用户当前钱包对该代币的授权额度（Allowance），如果额度不足，UI 按钮应自动切换为 “Approve [Token]”（授权），授权成功后再切换为 “Swap”。

- 用户：用 A 换 B
- 前端：
  - 输入金额 → 调用 Quoter 算报价
  - 设置滑点 → 算最小接收额
  - 授权（如需）→ 调用 Router 执行 swap

### 2）Add Liquidity 加流动性

- V2：选两个代币 → 输入金额 → mint ERC20 LP
- V3：选代币 → 选费率 → 选价格区间 → 输入金额 → mint NFT 仓位
- V4：类似 V3，但多了 Hook 选择

### 3）Remove Liquidity 移除流动性

- V2：销毁 LP → 拿回两种代币
- V3：销毁 NFT → 按当前价格区间比例拿回代币

### 4）Pool 列表 / 仓位管理

- 展示用户所有 LP/NFT 仓位
- 实时计算并展示用户当前可提取的、尚未领取的“手续费红利（Unclaimed Fees）”，并提供一键领取（Claim）的功能。

---

## 四、开发清单

### ✅ 技术栈（必选）

- React + TypeScript
- **Wagmi + Viem**（钱包连接+合约交互，替代 ethers）
- **Uniswap SDK**（v2-sdk / v3-sdk / v4-sdk）
- **TanStack Query**（查价格、查仓位、查余额）
- **Apollo Client**（查 Uniswap Subgraph，拿池数据/历史交易）

### ✅ 页面结构

1. **Swap 页**
   - 代币选择器（Search + 常用列表）
   - 输入/输出金额
   - 滑点设置
   - 报价展示
   - Swap 按钮（含授权）

2. **Pool 页**
   - V2/V3/V4 切换
   - 我的仓位列表
   - 加流动性表单

3. **Position 详情页（V3/V4）**
   - 价格区间可视化
   - 未领取手续费
   - 移除流动性按钮

### ✅ 核心工具类

- `useTokenList`：加载代币列表
- `usePoolData`：查池价格、流动性、费率
- `useQuote`：调用 Quoter 算 swap 报价
- `useAllowance`：查授权额度
- `usePosition`：查 V3 NFT 仓位信息

补充一个工具函数：

```
import { BigintIsh, Price, Token } from '@uniswap/sdk-core';
import { TickMath, tickToPrice } from '@uniswap/v3-sdk';

/**
 * 前端核心工具：将合约里的 tick 转换为用户看得懂的 Price 字符串
 * @param token0 交易对中的代币0
 * @param token1 交易对中的代币1
 * @param tick 合约当前或区间的 tick
 */
export function convertTickToHumanPrice(token0: Token, token1: Token, tick: number): string {
  try {
    // 1. 使用 Uniswap 官方 SDK 将离散的 tick 转换为 Price 对象
    const priceObj: Price<Token, Token> = tickToPrice(token0, token1, tick);

    // 2. 转换成人类直观的十进制字符串（自动处理了 token0 和 token1 的 decimals 精度差异）
    return priceObj.toSignificant(6);
  } catch (error) {
    console.error("Tick 转换价格失败", error);
    return "0";
  }
}

/**
 * 避坑公式（背诵）：
 * 合约里的价格并不是普通的浮点数，而是以 X96 形式存储的固定小数点数。
 * sqrtPriceX96 = sqrt(price) * 2^96
 * 前端展示当前池子价格时，如果不想调用 SDK，可以用以下公式纯手工转换：
 * price = (sqrtPriceX96 / 2^96) ^ 2 * (10^decimalsToken0 / 10^decimalsToken1)
 */
```

---

## 五、可直接复制的代码片段（Wagmi + Viem，V3 为主）

### 1）连接钱包（Wagmi）

```tsx
import { useConnect, useDisconnect, useAccount } from "wagmi";
import { metaMask } from "wagmi/connectors";

export function WalletConnect() {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  if (isConnected) {
    return (
      <div>
        {address}
        <button onClick={() => disconnect()}>断开</button>
      </div>
    );
  }
  return (
    <button onClick={() => connect({ connector: metaMask() })}>
      连接 MetaMask
    </button>
  );
}
```

### 2）查询 Swap 报价（V3 Quoter）

```ts
import { useReadContract } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { QUOTER_ABI, QUOTER_ADDRESS } from "./constants";

export function useQuote(
  tokenIn: `0x${string}`,
  tokenOut: `0x${string}`,
  amountIn: string,
  fee: number = 3000, // 0.3%
) {
  const amountInWei = parseUnits(amountIn, 18);

  const { data, isLoading } = useReadContract({
    address: QUOTER_ADDRESS,
    abi: QUOTER_ABI,
    functionName: "quoteExactInputSingle",
    args: [
      {
        tokenIn,
        tokenOut,
        fee,
        amountIn: amountInWei,
        sqrtPriceLimitX96: 0,
      },
    ],
  });

  if (!data) return { quote: "0", isLoading };
  const [amountOut] = Array.isArray(data) ? data[0] : data;
  return { quote: formatUnits(amountOut, 18), isLoading };
}
```

### 3）执行 Swap（V3 Router）

```ts
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { ROUTER_ABI, ROUTER_ADDRESS } from "./constants";

export function useSwap() {
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const swap = async (
    tokenIn: `0x${string}`,
    tokenOut: `0x${string}`,
    amountIn: string,
    amountOutMin: string,
    fee: number = 3000,
  ) => {
    const amountInWei = parseUnits(amountIn, 18);
    const amountOutMinWei = parseUnits(amountOutMin, 18);

    writeContract({
      address: ROUTER_ADDRESS,
      abi: ROUTER_ABI,
      functionName: "exactInputSingle",
      args: [
        {
          tokenIn,
          tokenOut,
          fee,
          recipient: "0x...", // 用户地址
          deadline: BigInt(Math.floor(Date.now() / 1000) + 60 * 20),
          amountIn: amountInWei,
          amountOutMinimum: amountOutMinWei,
          sqrtPriceLimitX96: 0,
        },
      ],
    });
  };

  return { swap, isConfirming, isSuccess };
}
```

### 4）查询授权额度

```ts
import { useReadContract } from "wagmi";
import { ERC20_ABI } from "./constants";

export function useAllowance(
  token: `0x${string}`,
  owner: `0x${string}`,
  spender: `0x${string}`,
) {
  const { data } = useReadContract({
    address: token,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [owner, spender],
  });
  return data ?? 0n;
}
```

---

如果你愿意，我可以再给你整理一份：

- **V3 完整前端项目目录结构**
- **V3 加流动性（选价格区间）完整代码**
- **V4 Hooks 前端适配示例（最稀缺）**

你要我把这三部分也补全吗？
