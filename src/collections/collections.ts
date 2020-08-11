import { AccessAPI, GetCollectionByIDRequest, CollectionResponse } from "@onflow/protobuf"
import { unary } from "../utils/unary"
import { Collection } from "../entity/Collection"

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
    }
}