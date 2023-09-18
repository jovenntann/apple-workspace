import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

/**
 * PaginatedDataDTO is a generic class that represents a paginated response.
 * It contains an array of data and pointers to the next and previous pages.
 */
export class PaginatedDataDTO<DataType> {
  @IsArray()
  @ApiProperty({ isArray: true, description: 'Array of data items of the specified type' })
  readonly data: DataType[];

  @ApiProperty({ description: 'Cursor pointer to the next page' })
  nextCursorPointer: string;

  @ApiProperty({ description: 'Cursor pointer to the previous page' })
  prevCursorPointer: string;

  /**
   * Constructor to initialize the PaginatedDataDTO instance.
   * 
   * @param data - Array of data items of the specified type
   * @param nextCursorPointer - Cursor pointer to the next page
   * @param prevCursorPointer - Cursor pointer to the previous page
   */
  constructor(data: DataType[], nextCursorPointer: string, prevCursorPointer: string) {
    this.data = data;
    this.nextCursorPointer = nextCursorPointer;
    this.prevCursorPointer = prevCursorPointer;
  }
}
