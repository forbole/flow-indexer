import "reflect-metadata";
import { AccessAPI, GetBlockByHeightRequest, BlockResponse } from "@onflow/protobuf"
import { unary } from "../utils/unary"
import { blockTime } from "../utils/timestamp"
import { Block } from "../entity/Block";
import { ChainState } from "../entity/ChainState"
import { GetCollection } from "../collections/collections"


export const UpdateBlocks = async (targetHeight:number, chainId: string, genesisHeight: number):Promise<number> => {
    
    // get largest height in the database
    // if empty, start form genesis height
    // if target height = largest hight, return
    // else start from largest height+1

    const largestHeight = await Block.findOne({
        select: ["height"],
        order: {
            height: "DESC"
        }
    })

    console.log("largestHeight: %o",largestHeight)

    let startHeight:number

    if (!largestHeight || (largestHeight.height < genesisHeight)){
        // table is empty
        startHeight = genesisHeight
        console.log("Table is empty. Start from genesis height: %o ", genesisHeight)
    }
    else if (largestHeight.height && largestHeight.height < targetHeight){
        startHeight = largestHeight.height+1
        console.log("Start from %o: ", startHeight)
    }
    else return targetHeight

    // loop from start to targetHeight
    for (let height=startHeight; height<=targetHeight; height++) {
        // get the block
        try{
            const req = new GetBlockByHeightRequest()
            req.setHeight(height)
            console.log("Get block height: %o", height)
            const res:BlockResponse = await unary(AccessAPI.GetBlockByHeight, req)
            const block = new Block()
            block.id = res.block.id
            block.parentId = res.block.parentId
            block.height = res.block.height
            block.timestamp = res.block.timestamp
            block.collectionGuarantees = res.block.collectionGuaranteesList
            block.blockSeals = res.block.blockSealsList
            block.signatures = res.block.signaturesList


            // and save it
            // make sure Block is saved before Collections and Transactions are being processed.

            // if current height == genesis, don't calculate block time
            if (height != genesisHeight){
                // get the current block time from chain state
                // get previous block timestamp
                try{
                    const pBlock:Block = await Block.findOne({height:height-1})
                    // block time = current timestamp - previous timestamp
                    block.blockTime = blockTime(block.timestamp, pBlock.timestamp)
                    
                    await Block.save(block);

                    // average block time = (block time + (current height - 1 - genesis height) * average block time) / (current height - genesis height)

                    let chain = await ChainState.findOne({chainId: chainId})

                    chain.averageBlockTime = ( block.blockTime + (height - 1 - genesisHeight) * chain.averageBlockTime ) / (height - genesisHeight)

                    ChainState.save(chain)

                    // if there is collection guarantee, there are transactions in this block
                    // save the collection


                }
                catch(e){
                    console.log("Get previous block at height %o error: %", height-1, e)
                    return height
                }
            }
            else{
                await Block.save(block);
            }

            if (block.collectionGuarantees.length > 0){
                // index transactions
                block.collectionGuarantees.forEach(async collectionGuarantee => {
                    await GetCollection(collectionGuarantee.collectionId, height)
                })
            }
        }
        catch(e){
            console.log("Get block at height %o error: %o", height, e)
            return height
        }
    }

    return targetHeight
    
} 
