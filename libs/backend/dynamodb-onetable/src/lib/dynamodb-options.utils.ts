import { BadRequestException } from '@nestjs/common';

interface DbOptions {
  limit?: number;
  follow?: boolean;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  [key: string]: any;
  index?: string;
}

export function createDynamoDbOptionWithPKSKIndex(
  limit: number,
  indexName?: string,
  direction?: string,
  cursorPointer?: string
): DbOptions {
  const dbOptions: DbOptions = {};
  dbOptions.limit = limit;
  dbOptions.follow = true;

  if (direction != null) {
    if (cursorPointer == null) {
      throw new BadRequestException(
        "Cursor Pointer Can't be null if direction is not null"
      );
    }
    dbOptions[direction] = JSON.parse(cursorPointer);
  }

  if (indexName != null) {
    dbOptions.index = indexName;
  }

  return dbOptions;
}
