import "./utils/env"
import { unary } from "./utils/unary"
import { AccessAPI, GetLatestBlockHeaderRequest, BlockHeaderResponse } from "@onflow/protobuf"
import "reflect-metadata";
import { createConnection } from "typeorm";
import { ChainState } from "./entity/ChainState"
import { UpdateBlocks } from "./blocks/blocks"

import { GetTransaction, GetTransactionResult } from "./transactions/transactions"
import { GetAccount } from "./accounts/accounts"

const getLatestHeight = async ():Promise<number> => {
    const req = new GetLatestBlockHeaderRequest()
    const res:BlockHeaderResponse = await unary(AccessAPI.GetLatestBlockHeader, req)
    // console.log(res)
    let latestHeight = -1 // return -1 if error

    try {
        const chainState:ChainState = new ChainState()
        chainState.chainId = process.env.CHAIN_ID
        chainState.latestHeightId = res.block.id
        chainState.latestParentId = res.block.parentId
        chainState.latestHeight = res.block.height
        chainState.latestTimestamp = res.block.timestamp.seconds.toString()+res.block.timestamp.nanos.toString()
    
        await chainState.save();
        latestHeight = chainState.latestHeight
    
    }
    catch(error){
        console.log(error)
    }

    return latestHeight
}


const startIndex = () => {
    // start update blocks
    // until it return
    // wait for timeout
    // start again
    global.clearInterval(timer)
    getLatestHeight().then(height => {
        console.log("Latest height: %o", height)
    
        UpdateBlocks(height, process.env.CHAIN_ID, parseInt(process.env.GENESIS_HEIGHT)).then(number => {
            console.log("Finsihed indexing block to height %o.", number) 
            timer = global.setInterval(startIndex, 3000)
        })
        .catch(e => {
            console.log(e)
            timer = global.setInterval(startIndex, 3000)
        })
    })
    .catch(e => {
        console.log(e)
        timer = global.setInterval(startIndex, 3000)
    })
}

const main = async() => {
    await createConnection()
    console.log("Start...")
    timer = global.setInterval(startIndex, 3000)

    // await GetTransaction("OjS376M0jEd+sSu/prZy6n2+eO4jNZWdE2jZjgU5DyU=", "ZZZScxbn2OMZGpST8gqw6MsW0vfs04fPKVrV7UaKvbU=")
    // await GetTransactionResult("OjS376M0jEd+sSu/prZy6n2+eO4jNZWdE2jZjgU5DyU=")
    // await GetAccount("GOtO5rPAJtI=")
}

let timer:NodeJS.Timer

main()
