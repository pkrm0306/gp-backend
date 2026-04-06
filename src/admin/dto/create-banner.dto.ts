import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({ example: 'https://cdn.example.com/banner.jpg', description: 'Banner image URL' })
  @IsString()
  @IsNotEmpty()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  imageUrl: string;

  @ApiProperty({ example: 'https://example.com/promo', description: 'Link opened when the banner is clicked' })
  @IsString()
  @IsNotEmpty()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  targetUrl: string;

  @ApiProperty({ example: 'Summer sale', description: 'Banner heading' })
  @IsString()
  @IsNotEmpty()
  heading: string;

  @ApiProperty({ example: 'Up to 50% off selected items.', description: 'Banner description' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
