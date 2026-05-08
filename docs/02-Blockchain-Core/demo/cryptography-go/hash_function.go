package main

import (
	"crypto/sha256"
	"encoding/hex"
	"github.com/ethereum/go-ethereum/crypto"
	"golang.org/x/crypto/ripemd160"
)

type HashFunction struct {}

// 用于计算区块hash,交易ID，工作量证明，默克尔树等
func (h *HashFunction) SHA256(data string) string {
	hash := sha256.Sum256([]byte(data))
	return hex.EncodeToString(hash[:])
}

// 用于以太坊账户地址、智能合约、交易ID、事件日志、签名验证等
func (h *HashFunction) Keccak256(data string) string {
    hash := crypto.Keccak256([]byte(data))
    return hex.EncodeToString(hash)
}

// 生成比特币地址的最后一步
func (h *HashFunction) RIPEMD160(data string) string {
    // 需要额外库实现
    hash := ripemd160.New()
    hash.Write([]byte(data))
    return hex.EncodeToString(hash.Sum(nil))
}