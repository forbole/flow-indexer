import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm";
import { TransactionProposalKey } from "./TransactionProposalKey"
import { TransactionSignature } from "./TransactionSignature"
import { TransactionResult } from "./TransactionResult";

@Entity()
export class Transaction extends BaseEntity {
    @PrimaryColumn()
    id: string

    @Column('text')
    script: string

    @Column({type:'varchar', array:true})
    arguments: string[]

    @Column()
    referenceBlockId: string

    @Column('bigint')
    gasLimit: number

    @Column('jsonb')
    proposalKey: TransactionProposalKey

    @Column()
    payer: string

    @Column({type:'varchar', array:true})
    authorizers: string[]

    @Column('jsonb')
    payloadSignatures: TransactionSignature[]

    @Column('jsonb')
    envelopeSignatures: TransactionSignature[]

    @Column('jsonb')
    transactionResult: TransactionResult
}