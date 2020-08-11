import {Entity, PrimaryColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class ChainState extends BaseEntity{

    @PrimaryColumn()
    chainId: string

    @Column()
    latestHeight: number

    @Column()
    latestHeightId: string

    @Column()
    latestParentId: string

    @Column()
    latestTimestamp: string

    @Column({type:"float", default: 0})
    averageBlockTime
    
}