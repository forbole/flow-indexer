import { AccessAPI, GetCollectionByIDRequest, CollectionResponse } from "@onflow/protobuf"
import { unary } from "../utils/unary"
import { Collection } from "../entity/Collection"
import { GetTransaction } from "../transactions"

export const GetCollection = async (collectionId:string, height):Promise<void> => {
    try{
        const req = new GetCollectionByIDRequest()
        req.setId(collectionId)
        console.log("Get Collection with ID: %o", collectionId)
        const res:CollectionResponse = await unary(AccessAPI.GetCollectionByID, req)
        const collection = new Collection()
        collection.id = res.collection.id
        collection.transactionIds = res.collection.transactionIdsList
        collection.height = height
        try {
            console.log("Saving Collection with ID: %o", collectionId)
            await Collection.save(collection)
        }
        catch(e){
            console.log(e)
        }
    }
    catch(e){
        console.log(e)
        console.log("Error getting collection: %o", collectionId)
        const collection = new Collection()
        collection.id = collectionId
        collection.transactionIds = null
        collection.processed = false
        collection.height = height
        await Collection.save(collection)
    }
}

export const ProcessEmptyCollections = async():Promise<void> => {
    const collections = await Collection.find({transactionIds: null})
    // console.log(collections)
    collections.forEach(async collection => {
        try{
            await GetCollection(collection.id, collection.height)
        }
        catch(e){
            console.log(e)
            console.log("Error getting collections: %o", collection.id)
            // collection.processed = false
        }
    })
}


export const ProcessCollections = async ():Promise<void> => {
    const collections = await Collection.find({processed: false})
    collections.forEach(async (col) => {
        col.transactionIds?.forEach( async (txId) =>{
            try{
                await GetTransaction(txId, col)
            }
            catch(e){
                console.log(e)
            }
        })
        col.processed = true
        await Collection.save(col)
    })
}