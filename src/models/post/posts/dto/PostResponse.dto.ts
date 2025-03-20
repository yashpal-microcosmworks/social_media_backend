import { ApiProperty } from '@nestjs/swagger';

export class PostResponseDto {
  @ApiProperty({ example: 1, description: 'Unique ID of the post' })
  id: number;

  @ApiProperty({
    example: 'This is a sample post',
    description: 'Content of the post',
  })
  content: string;

  @ApiProperty({
    example: ['https://example.com/image1.jpg'],
    description: 'List of media URLs',
  })
  mediaUrls?: string[];
}
