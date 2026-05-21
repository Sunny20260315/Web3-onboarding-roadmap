# uniswap v4

Uniswap v4 是为以太坊虚拟机开发的非托管自动做市商协议。Uniswap v4 通过任意代码钩子提供可定制性，让开发者能够借助新功能对 Uniswap v3 中推出的集中流动性模型进行扩展。

同样是非托管、不能升级、无需许可。

但它通过以下方式降低了 gas 费：

- 钩子

```
beforeInitialize/afterInitialize、
beforeAddLiquidity/afterAddLiquidity1、
beforeRemoveLiquidity/afterRemoveLiquidity、
beforeSwap/afterSwap、
beforeDonate/afterDonate
```

- 单例模式
- 闪电记账
- 支持原生 ETH
- 定制化账户

# 总结

总而言之，Uniswap v4 是一种非托管、不可升级且无需许可的自动做市商协议。它以 Uniswap v3 中引入的集中流动性模型为基础，通过钩子（hooks）实现了自定义资金池。与钩子相辅相成的还有其他架构改进，比如将所有资金池状态集中在一个合约中的单例合约，以及能高效保障各资金池偿付能力的闪电会计（flash accounting）机制。此外，钩子开发者也可以选择完全绕过集中流动性模式，将 v4 单例合约用作任意增量解析器。其他改进还包括原生 ETH 支持、ERC-6909 余额会计核算、全新的手续费机制，以及向在价内流动性提供者捐赠的功能。

# Whitepapers

- [V4](https://uniswap.org/whitepaper-v4.pdf)
- [V3](https://uniswap.org/whitepaper-v3.pdf)
- [V2](https://uniswap.org/whitepaper.pdf)
- [V1](https://hackmd.io/C-DvwDSfSxuh-Gd4WKE_ig)
