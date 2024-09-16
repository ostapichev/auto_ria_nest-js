import { ListQueryDto } from '../req/list-query.dto';
import { CarListItemResDto } from './car-list-item.res.dto';

export class CarListResDto extends ListQueryDto {
  data: CarListItemResDto[];
  total: number;
}
