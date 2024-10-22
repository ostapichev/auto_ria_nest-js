import {
  BeforeInsert,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  created: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated: Date;

  @BeforeInsert()
  setCreatedTime() {
    const localTime = new Date().toLocaleString('en-US', {
      timeZone: 'Europe/Kyiv',
    });
    this.created = new Date(localTime);
    this.updated = new Date(localTime);
  }
}
