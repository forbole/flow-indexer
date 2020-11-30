import "./utils/env"
import { unary } from "./utils/unary"
import { AccessAPI, GetLatestBlockHeaderRequest, BlockHeaderResponse } from "@onflow/protobuf"
import "reflect-metadata";
import { createConnection } from "typeorm";
import { ChainState } from "./entity/ChainState"
import { UpdateBlocks } from "./blocks/blocks"
import { ProcessCollections } from "./collections/collections"
import { getNodeInfos } from "./nodes/nodes"
import { startApolloServer } from "./apollo"

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

const indexTransactions = () => {
    ProcessCollections().then(() => {
        console.log("Index latest transactions done")
    })
}


const main = async() => {
    console.log("Connecting to database...")
    await createConnection()
    console.log("Start...")

    // get node information
    getNodeInfos()

    // start getting blocks
    timer = global.setInterval(startIndex, 3000)

    // get transactions
    colTimer = global.setInterval(indexTransactions, 10000)
    
    // start Apollo server
    startApolloServer()
}

let timer, colTimer:NodeJS.Timer

main()
