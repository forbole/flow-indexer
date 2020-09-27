import { Entity, Unique, Index, PrimaryColumn, Column, BaseEntity } from "typeorm";
import { AccountKey } from './AccountKey'

@Entity()
@Unique(["address"])
export class Account {
    @PrimaryColumn()
    @Index("address_idx")
    address: string

    @Column('bigint')
    balance: number

    @Column('text')
    code: string

    @Column('jsonb')
    keys: AccountKey[]
}
