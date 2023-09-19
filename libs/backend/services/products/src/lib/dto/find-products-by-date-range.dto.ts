import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

import { PaginationQueryDTO } from './pagination-query.dto';

export class FindProductsByDateRangeDTO extends PaginationQueryDTO {
    @ApiProperty({ type: String, required: true })
    @IsDateString()
    startDate: Date;

    @ApiProperty({ type: String, required: true })
    @IsDateString()
    endDate: Date;
}