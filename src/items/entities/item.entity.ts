import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('int')
  amount: number;

  @Column('decimal')
  price: number;

  @Column({ nullable: true })
  contactMobileNo: string;

  @CreateDateColumn({ type: 'timestamp' }) // Automatically sets the timestamp when a row is created
  timestamp: Date;
}
