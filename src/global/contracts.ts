import '../utils/env'

const mainnetContracts = {
    FungibleToken: '0xf233dcee88fe0abe',
    FlowToken: '0x1654653399040a61',
    FlowFee: '0xf919ee77447b7497',
    StakingTable: '0x8624b52f9ddcd04a',
    LockedTokens: '0x8d0e87b65159ae63',
    NonFungibleToken: '0x1d7e57aa55817448',
    StakingProxy: '0x62430cf28c26d095'
}

const testnetContracts = {
    FungibleToken: '0x9a0766d93b6608b7',
    FlowToken: '0x7e60df042a9c0868',
    FlowFee: '0x912d5440f7e3769e',
    StakingTable: '0x9eca2b38b18b5dfe',
    LockedTokens: '0x95e019a17d0e23d7',
    NonFungibleToken: '0x631e88ae7f1d7c20',
    StakingProxy: '0x7aad92e5a0715d21'
}

let contracts

if (process.env.NETWORK_TYPE == "mainnet"){
    contracts = mainnetContracts
}
else{
    contracts = testnetContracts
}

export default contracts