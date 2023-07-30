require('@nomiclabs/hardhat-waffle');

module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {
    },
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/W5EQbGF7eTTgGG4nuWgkga0_p5VIkMbZ'
      accounts: [ '0efbca7f34339b53839c5a51b29217ab9920a34abafde9431d5cdb73e3820cec' ]
    }
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
}