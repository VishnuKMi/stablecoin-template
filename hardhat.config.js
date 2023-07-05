require('@nomicfoundation/hardhat-toolbox')
/** @type import('hardhat/config').HardhatUserConfig */

INFURA_API_KEY = '706a935fdbfb480dadd4e5a0ffce362a'
SEPOLIA_PRIVATE_KEY =
  '3843c9c87cde27464fff9c4316d63ad70a3553ee3d2c9d97cc615a676a05a438'

module.exports = {
  solidity: '0.8.18',
  defaultNetwork: 'sepolia',
  networks: {
    hardhat: {},
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }
}
