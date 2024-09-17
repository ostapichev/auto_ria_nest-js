import * as moment from 'moment-timezone';
import {
  BeforeInsert,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;
  @BeforeInsert()
  setCreated() {
    this.created = moment().tz('Europe/Kyiv').toDate();
  }

  @UpdateDateColumn()
  updated: Date;
  @BeforeInsert()
  setUpdated() {
    this.created = moment().tz('Europe/Kyiv').toDate();
  }
}
