# 以太坊EIP协议讲解

## EIP

EIP（Ethereum Improvement Proposal）是指以太坊的改进提案，用于改进以太坊的协议，涵盖所有层面的变更。

> EIP = ERC（应用层） + RIP（Layer 2层） + 核心/网络/接口等（Layer 1层）

代表：

- EIP-1559: gas费优化机制
- EIP-4895:质押提款
- EIP-4844: 数据可用层协议
- EIP-4788
- EIP-7702

## ERC（代币标准）

ERC (Ethereum Request for Comments)是 EIP 的特殊类型，规范DApp、钱包、代币等应用层交互规则的“标准化接口”。

### 代币协议

- ERC-20: 同质化代币标准
- ERC-721: 非同质化代币标准，NFT
  - 独一无二的数字艺术作品
  - 推文和社交媒体帖子
  - 游戏藏品、角色
- ERC-1155: 多重代币标准、支持多种代币类型（如同质化、非同质化、多重代币等）
- ERC-4337: 账户抽象标准

### 合约调用优化协议

- ERC-712: 是一种通用的结构化签名标准，为离线签名和量上验证提供了高效工具
- ERC-2612:是基于ERC-712的扩展版本，专注于代币授权优化，特别适用于DeFi和钱包应用场景

#### ERC-712

ERC-712提供了一种对结构化数据进行离线签名的标准。它通过定义签名的格式和数据结构，确保签名的安全性和可
验证性，并显著提高了用户交互的便利性。

**（1）数据结构**

ERC-712 允许开发者定义数据结构，并使用哈希算法将其转换为签名消息。

- 域分隔符（Domain Separator）
  用于区分不同的合约调用或网络环境，防止签名跨合约或跨链被滥用

  ```
  byte32 DOMIAN_SEPARATOR = keccak256(
    abi.encode(
      keccak256("EIP712Domain(string name, string version, unit256 chainId,address verifyingContract)"),
      keccak256(bytes("TokenName")), // 合约名称
      keccak256(bytes("1")), //  合约版本
      chainId,
      address(this) // 合约地址
    )
  )
  ```

- 消息结构
  用户自定义的结构化数据，可以是交易信息、授权请求等。

```
struct Permit{
  address owner;
  address spender;
  unit256 value;
  unit256 nonce;
  unit256 deadline;
}
```

**（2）签名步骤**

- 计算消息hash

```
bytes32 hashStruct = keccak256(
  abi.encode(
    keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
    owner,
    spender,
    value,
    nonce,
    deadline
  )
)
```

- 计算完整签名的hash

```
bytes32 digest = keccak256(
  abi.encodePacked(
    "\x19\x01"，
    DOMAIN_SEPARATOR,
    hashStruct
  )
)
```

- 通过签名工具（如钱包）生成钱包。

**（3）验证签名**
链上验证签名是否由合法地址生成。

```
address signer = ecrecover(digest, v, r, s);
require(signer == owner, "Invalid signature");
```

**应用场景**

- 代币授权：与ERC-2612结合，实现无gas授权，通过离线签完成代币授权。
- 去中心化身份认证（DID）：利用结构化签名验证用户身份
- 多重签名钱包：简化多重签名中的签名和验证流程

#### ERC-2612

##### 介绍

ERC-2612是对ERC-20的扩展，利用ERC-712的结构化签名标准引入permit方法，使得用户无需调用approve方
法即可离线授权代币转账。它简化了授权流程，节省了交易费用。

##### 核心内容

（1）permit 方法

permit 方法是 ERC-2612 的核心功能，用于离线完成代币授权

```solidity
function permit(
    address owner,
    address spender,
    uint256 value,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
) external;
```

**参数说明**

- **owner**：授权代币的所有者
- **spender**：被授权的地址
- **value**：授权的代币数量
- **deadline**：签名的有效时间
- **v, r, s**：签名的分量，是以太坊签名的三个组成部分，任何以太坊签名，拆分后都是这 3 个数字：v、r、s，用来验证签名是否有效。

**功能**：

- 验证签名是否有效

（2）状态变量

- **nonces**：每个地址都有一个唯一的 nonce，防止签名重放

```solidity
mapping(address => uint256) public nonces;
```

- **DOMAIN_SEPARATOR**：用于与 EIP-712 的签名格式对接，确保安全性

（3）工作流程

1. 用户构造一条授权数据，并离线签名（通过钱包工具）
2. 用户将签名数据发送给链上合约，调用 permit 方法完成授权
3. 合约验证签名的合法性，并记录授权信息

##### 代码实战

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Permit is ERC20 {
    mapping(address => uint256) public nonces;
    bytes32 public DOMAIN_SEPARATOR;

    bytes32 public constant PERMIT_TYPEHASH =
        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes(name)),
                keccak256(bytes("1")),
                chainId,
                address(this)
            )
        );
    }

    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(block.timestamp <= deadline, "Permit: expired deadline");

        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                keccak256(
                    abi.encode(PERMIT_TYPEHASH, owner, spender, value, nonces[owner]++, deadline)
                )
            )
        );

        address recoveredAddress = ecrecover(digest, v, r, s);
        require(recoveredAddress != address(0) && recoveredAddress == owner, "Permit: invalid signature");

        _approve(owner, spender, value);
    }
}
```

### RIP

RIP（Rollup Improvement Proposal）是指rollup改进提案。
L2加速器：专门为以太坊二层网络（Rollup）提效率、降成本的“优化方案”

代表：

- RIP-7560:原声账户抽象
- RIP-1:
