interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
}

export const ETH_TOKEN: Token = {
  symbol: 'ETH',
  name: 'Ethereum',
  address: '0x000000000000000000000000000000000000000',
  decimals: 18,
  logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
};

export const USDC_TOKEN: Token = {
  symbol: 'USDC',
  name: 'USD Coin',
  address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  decimals: 6,
  logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
};

export const DEFAULT_SLIPPAGE = 0.5;
