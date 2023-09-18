import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class FindAllQueryDTO {
    @ApiProperty({ type: Number, required: false, default: 10 })
    @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
    limit: number;
  
    @ApiProperty({ type: String, required: false })
    direction: string;
  
    @ApiProperty({ type: String, required: false })
    cursorPointer: string;
  }
  