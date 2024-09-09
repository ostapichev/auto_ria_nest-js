import { CarListQueryDto } from '../req/car-list.query.dto';
import { CarListItemResDto } from './car-list-item.res.dto';

export class CarListResDto extends CarListQueryDto {
  data: CarListItemResDto[];
  total: number;
}
