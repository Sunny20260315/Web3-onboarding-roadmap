import { ethers } from "ethers";

/**
 * HD 钱包 = Hierarchical Deterministic 分层确定性钱包
 * 生成助记词 → 派生私钥 / 地址 全程不需要联网、和区块链完全无关 **，纯本地密码学运算。
*/

// 生成随机助记词
// 本地生成安全随机熵 → BIP39 → 12/24 个助记词
// const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
const mnemonic = "parent stock imitate brother range tip unusual reduce peanut wage bubble swarm";
// console.log('🔑 生成的助记词 (12 words):', mnemonic);

// 从助记词创建 HD 钱包
// Wallet.fromMnemonic(mnemonic, path)
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
// console.log('🔑 助记词对应的钱包地址:', wallet.address); // 0xC6599df4364Cb218D2A00B287f77B573Bc93A40D

// 派生指定路径的地址
// BIP44 标准路径: m / purpose' / coin_type' / account' / change / address_index
// const path0 = "m/44'/60'/0'/0/0";
// const path1 = "m/44'/60'/0'/0/1";

// console.log('🔑 派生指定路径的公钥:', wallet.publicKey); // 0x04dce8589536c6c1aa5a4558a88d7d949489b579d5c1741e672707f4ebabb2e8e62d50506f82c637550b50618fdfa35d8fc94e18f38a86a3b643d3f464a439e49c
// console.log('🔑 mnemonic:', wallet.mnemonic);