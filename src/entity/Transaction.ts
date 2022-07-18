import { Entity, Unique, Index, PrimaryColumn, Column, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { TransactionProposalKey } from "./TransactionProposalKey"
import { TransactionSignature } from "./TransactionSignature"
import { TransactionResult } from "./TransactionResult";
import { Block } from "./Block"
import { Collection } from "./Collection"

@Entity()
@Unique(["id"])
@Index("transaction_height_desc_idx", { synchronize: false })
@Index("transaction_proposal_key_idx", { synchronize: false })
export class Transaction extends BaseEntity {
    @PrimaryColumn()
    id: string

    @Column('text')
    script: string

    @Column({type:'varchar', array:true})
    arguments: string[]

    @Column()
    @Index("transaction_block_id_idx")
    referenceBlockId: string

    @Column({ nullable: true, type: "varchar" })
    @Index("transaction_collection_id_idx")
    collectionId: string

    // @Column('bigint')
    // @Index("transaction_height_idx")
    // height: number

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

    @Column({ nullable: true, type: "jsonb" })
    transactionResult: TransactionResult

    @ManyToOne(type => Block)
    @JoinColumn({
        name: "referenceBlockId",
        referencedColumnName: "id"
    })
    expireBlock?: Block

    @ManyToOne(type => Collection)
    @JoinColumn({
        name: "collectionId",
        referencedColumnName: "id"
    })
    collection?: Collection

    @ManyToOne(type => Block)
    @JoinColumn({
        name: "height",
        referencedColumnName: "height"
    })
    block?: Block
    
}