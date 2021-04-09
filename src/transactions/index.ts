import { AccessAPI, GetTransactionRequest, TransactionResponse, TransactionResultResponse, TransactionStatus } from "@onflow/protobuf"
import { unary } from "../utils/unary"
import { Transaction } from "../entity/Transaction"
import { TransactionResult } from "../entity/TransactionResult"
import { Collection } from "../entity/Collection"

const getStatus = (status:number):string => {
    for (let s in TransactionStatus){
        if (TransactionStatus[s] === status)
            return s
    }
}

export const GetTransaction = async (txId:string, collection:Collection):Promise<void> => {
    try{
        const req = new GetTransactionRequest()
        req.setId(txId)
        console.log("Get transaction ID: %o", txId)
        const res:TransactionResponse = await unary(AccessAPI.GetTransaction, req)

        const tx:Transaction = new Transaction()

        tx.id = txId
        tx.script = res.transaction.script
        tx.arguments = res.transaction.argumentsList
        tx.referenceBlockId = res.transaction.referenceBlockId
        tx.gasLimit = res.transaction.gasLimit
        tx.proposalKey = res.transaction.proposalKey
        tx.payer = res.transaction.payer
        tx.authorizers = res.transaction.authorizersList
        tx.payloadSignatures = res.transaction.payloadSignaturesList
        tx.envelopeSignatures = res.transaction.envelopeSignaturesList
        tx.collectionId = collection.id
        tx.height = collection.height
        try{
            tx.transactionResult = await GetTransactionResult(txId)
        }
        catch (e){
            console.log(e)
            tx.transactionResult = null
        }
        
        
        await Transaction.save(tx)

        
    }
    catch(e){
        console.log("Getting transaction %o", txId)
        console.log(e)
    }
}

export const GetTransactionResult = async (txId:string):Promise<TransactionResult> => {
    try{
        const req = new GetTransactionRequest()
        req.setId(txId)
        console.log("Get result of transaction ID: %o", txId)
        const res:TransactionResultResponse = await unary(AccessAPI.GetTransactionResult, req)

        const txRes = new TransactionResult()
        txRes.status = getStatus(res.status)
        txRes.statusCode = res.statusCode
        txRes.errorMessage = res.errorMessage
        txRes.events = res.eventsList

        return txRes
    }
    catch(e){
        console.log("Getting transaction result of %o", txId)
        console.log(e)
    }
}