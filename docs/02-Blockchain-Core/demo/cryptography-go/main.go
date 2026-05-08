package main

import (
	"fmt"
)

func main() {
	h := &HashFunction{}
	fmt.Println(h.SHA256("hello world"))
	fmt.Println(h.Keccak256("hello world"))
	fmt.Println(h.RIPEMD160("hello world"))
}