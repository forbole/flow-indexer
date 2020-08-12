import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm";
import { TransactionProposalKey } from "./TransactionProposalKey"
import { TransactionSignature } from "./TransactionSignature"

@Entity()
export class Transaction extends BaseEntity {
    @PrimaryColumn()
    hash: string

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
}