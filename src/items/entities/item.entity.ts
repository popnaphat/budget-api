import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
export enum ItemStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  // @Column({ nullable: true })
  // description: string;

  @Column('int')
  amount: number;

  @Column('decimal')
  price: number;

  @Column({ nullable: true })
  contactMobileNo: string;

  @Column({
    nullable: false,
    default: ItemStatus.PENDING,
  })
  status: ItemStatus;
  
  @CreateDateColumn({ type: 'timestamp' }) // Automatically sets the timestamp when a row is created
  timestamp: Date;

  @Column({ nullable: false })
  createdBy: string;
}
