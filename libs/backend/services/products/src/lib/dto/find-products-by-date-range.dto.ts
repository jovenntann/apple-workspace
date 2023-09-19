import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsOptional } from 'class-validator';

export class FindProductsByDateRangeDTO {
    @ApiProperty({ type: String, required: true })
    @IsDateString()
    startDate: Date;

    @ApiProperty({ type: String, required: true })
    @IsDateString()
    endDate: Date;

    @ApiProperty({ type: String, required: false })
    direction: string;

    @ApiProperty({ type: Number, required: false, default: 10 })
    @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
    limit: number;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    cursorPointer?: string;
}
