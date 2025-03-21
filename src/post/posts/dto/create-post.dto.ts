import { IsString, IsOptional, IsArray, IsUrl, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'This is a sample post content',
    description: 'Content of the post',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    example: ['https://rahul/image1.jpg', 'https://example.com/image2.jpg'],
    description: 'Array of media URLs',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true, message: 'Each media URL must be a valid URL' })
  mediaFiles?: string[];

  @ApiProperty({
    example: ['image', 'video'],
    description: 'Array of media types corresponding to media URLs',
    required: false,
    enum: ['image', 'video', 'gif'],
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(['image', 'video', 'gif'], {
    each: true,
    message: 'Each media type must be image, video, or gif',
  })
  mediaTypes?: ('image' | 'video' | 'gif')[];
}
