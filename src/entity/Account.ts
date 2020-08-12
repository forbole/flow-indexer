import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm";
import { AccountKey } from './AccountKey'

@Entity()
export class Account {
    @PrimaryColumn()
    address: string

    @Column('bigint')
    balance: number

    @Column('text')
    code: string

    @Column('jsonb')
    keys: AccountKey[]
}
