# 源码

```solidity
pragma solidity =0.5.16;

import './interfaces/IUniswapV2Factory.sol'; // 工厂合约的接口定义
import './UniswapV2Pair.sol'; // 交易对合约

contract UniswapV2Factory is IUniswapV2Factory {
    address public feeTo; // 接收协议费用的地址
    address public feeToSetter; // 有权修改 feeTo 的地址

    // 快速查找交易对,通过两个代币地址可以直接获得对应的交易对地址
    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs; // 存储所有创建的交易对地址。

    // 定义事件，当新交易对创建时触发。indexed 关键字使得 token0 和 token1 可被搜索。
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    constructor(address _feeToSetter) public {
        feeToSetter = _feeToSetter;
    }

    // 外部只读函数，返回已创建交易对的总数。view 表示不修改链上数据。
    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    function createPair(address tokenA, address tokenB) external returns (address pair) {
        // 验证：两个代币必须不同，否则抛出错误。
        require(tokenA != tokenB, 'UniswapV2: IDENTICAL_ADDRESSES');
        // 排序：这样做的好处是无论输入顺序如何，同一对代币总是对应同一个交易对。
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'UniswapV2: ZERO_ADDRESS');
        require(getPair[token0][token1] == address(0), 'UniswapV2: PAIR_EXISTS'); // single check is sufficient
        // 获取 UniswapV2Pair 合约的字节码（创建代码）。
        bytes memory bytecode = type(UniswapV2Pair).creationCode;
        // 生成盐值：对两个代币地址进行 keccak256 哈希运算。盐值用于 CREATE2 操作码，确保相同输入总是生成相同地址。
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        // 在新创建的交易对上调用 initialize 函数，初始化两个代币。
        IUniswapV2Pair(pair).initialize(token0, token1);
        // 更新映射，使得两个方向都能查找到该交易对：
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        // 触发事件，通知链外监听者有新交易对被创建，并记录当前交易对总数。
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    // 设置费用接收地址。只有 feeToSetter 有权调用，否则抛出 FORBIDDEN 错误。
    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        feeTo = _feeTo;
    }
    // 更新 feeToSetter 地址。同样需要验证调用者是当前的 feeToSetter，否则抛出 FORBIDDEN 错误。
    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        feeToSetter = _feeToSetter;
    }
}
```

# 交易对创建流程

## 1. 用户调用入口

用户调用 `createPair(tokenA地址, tokenB地址)` 函数，比如要创建 DAI 和 USDC 的交易对。

## 2. 第一道检查 - 地址是否相同

合约首先检查 tokenA 是否等于 tokenB。如果用户传入的是同一个代币地址，直接抛出错误 "IDENTICAL_ADDRESSES"，交易回滚，流程结束。

## 3. 排序操作

将两个代币地址进行排序。比较 tokenA 和 tokenB 的大小，小的赋值给 token0，大的赋值给 token1。这样确保同一对代币无论用户怎么输入，都会得到相同的结果。

## 4. 第二道检查 - 零地址验证

检查排序后的 token0 是否为零地址。如果是，说明输入有问题，抛出错误 "ZERO_ADDRESS"。

## 5. 第三道检查 - 交易对是否已存在

查询映射表 `getPair[token0][token1]` 看是否已经存在这个交易对。如果返回的不是零地址，说明交易对已经创建过了，抛出错误 "PAIR_EXISTS"。

## 6. 准备合约创建的原料

获取 UniswapV2Pair 合约的字节码，这是创建新合约需要的二进制代码。

## 7. 生成盐值

对 token0 和 token1 进行 keccak256 哈希运算，生成一个盐值。这个盐值的作用是确保同样的两个代币输入，CREATE2 操作码总是生成同一个确定的合约地址。

## 8. 使用 CREATE2 创建新合约

在汇编代码中，利用 CREATE2 操作码创建新的 UniswapV2Pair 合约。CREATE2 就像一个工厂，输入相同的材料（字节码和盐值），每次都生成相同地址的新合约实例。

## 9. 初始化新合约

在刚创建的交易对合约上调用 initialize 函数，传入 token0 和 token1，让这个交易对知道自己管理的是哪两个代币。

## 10. 更新双向映射

将新创建的交易对地址存入映射表。从 token0 到 token1 的方向存一份，从 token1 到 token0 的方向也存一份。这样用户无论用哪种顺序查询，都能找到这个交易对。

## 11. 添加到全局记录

将新交易对地址追加到 allPairs 数组的末尾，保持一个完整的交易对列表。

## 12. 发出事件通知

触发 PairCreated 事件，将创建的两个代币地址、新交易对地址和当前的交易对总数广播出去。链外的应用（比如前端、数据索引器）监听这个事件，可以实时知道有新交易对被创建了。

## 13. 返回结果

函数返回新创建的交易对地址给调用者。

---

简述：交易对创建流程
工厂合约通过 CREATE2 操作码根据两个代币地址生成唯一确定的交易对合约地址，初始化后将其存入映射表供后续查询使用。

```
1. 验证输入的两个代币地址不相同
   ↓
2. 将两个代币地址排序（小→token0，大→token1）
   ↓
3. 验证 token0 不是零地址
   ↓
4. 验证该交易对还不存在（getPair[token0][token1] == 0x0）
   ↓
5. 获取 UniswapV2Pair 合约的字节码
   ↓
6. 使用 keccak256(token0, token1) 生成盐值
   ↓
7. 使用 CREATE2 操作码创建新合约
   ↓
8. 调用新合约的 initialize(token0, token1) 初始化
   ↓
9. 存储正向映射：getPair[token0][token1] = pair
   ↓
10. 存储反向映射：getPair[token1][token0] = pair
   ↓
11. 将交易对地址添加到 allPairs 数组
   ↓
12. 触发 PairCreated 事件
   ↓
13. 返回新交易对地址
```
