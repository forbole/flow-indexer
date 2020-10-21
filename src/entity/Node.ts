import {Entity, Unique, Index, PrimaryColumn, Column, BaseEntity} from "typeorm";

@Entity()
@Unique(["nodeId"])
@Unique(["address"])
@Unique(["networkPubKey"])
@Unique(["stakingPubKey"])
export class Node extends BaseEntity{

    @PrimaryColumn()
    nodeId: string

    @PrimaryColumn()
    address: string

    @Column()
    @Index("node_role_idx")
    role: string

    @Column()
    networkPubKey: string
    
    @Column()
    stakingPubKey: string

    @Column()
    stake: number
}