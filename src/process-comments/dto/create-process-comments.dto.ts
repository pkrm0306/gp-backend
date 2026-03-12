import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProcessCommentsDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({
    description: 'Product design comment',
    example: 'Please provide more details on eco-design strategies',
    required: false,
  })
  @IsString()
  @IsOptional()
  productDesign?: string;

  @ApiProperty({
    description: 'Product performance comment',
    example: 'Test report needs to be updated',
    required: false,
  })
  @IsString()
  @IsOptional()
  productPerformance?: string;

  @ApiProperty({
    description: 'Manufacturing process comment',
    example: 'Energy consumption data is incomplete',
    required: false,
  })
  @IsString()
  @IsOptional()
  manfacturingProcess?: string;

  @ApiProperty({
    description: 'Waste management comment',
    example: 'Waste management implementation details required',
    required: false,
  })
  @IsString()
  @IsOptional()
  wasteManagement?: string;

  @ApiProperty({
    description: 'Life cycle approach comment',
    example: 'Life cycle assessment report needs revision',
    required: false,
  })
  @IsString()
  @IsOptional()
  lifeCycleApproach?: string;

  @ApiProperty({
    description: 'Product stewardship comment',
    example: 'EPR implementation details missing',
    required: false,
  })
  @IsString()
  @IsOptional()
  productStewardship?: string;

  @ApiProperty({
    description: 'Product innovation comment',
    example: 'Innovation implementation details required',
    required: false,
  })
  @IsString()
  @IsOptional()
  productInnovation?: string;

  @ApiProperty({
    description: 'Raw materials 3.1 comment',
    example: 'Raw materials 3.1 comment',
    required: false,
  })
  @IsString()
  @IsOptional()
  rawMaterials31?: string;

  @ApiProperty({
    description: 'Raw materials 3.2 comment',
    example: 'Raw materials 3.2 comment',
    required: false,
  })
  @IsString()
  @IsOptional()
  rawMaterials32?: string;

  @ApiProperty({
    description: 'Raw materials 3.3 comment',
    example: 'Raw materials 3.3 comment',
    required: false,
  })
  @IsString()
  @IsOptional()
  rawMaterials33?: string;

  @ApiProperty({
    description: 'Raw materials 3.4 comment',
    example: 'Raw materials 3.4 comment',
    required: false,
  })
  @IsString()
  @IsOptional()
  rawMaterials34?: string;

  @ApiProperty({
    description: 'Raw materials 3.5 comment',
    example: 'Raw materials 3.5 comment',
    required: false,
  })
  @IsString()
  @IsOptional()
  rawMaterials35?: string;

  @ApiProperty({
    description: 'Raw materials 3.6 comment',
    example: 'Raw materials 3.6 comment',
    required: false,
  })
  @IsString()
  @IsOptional()
  rawMaterials36?: string;

  @ApiProperty({
    description: 'Raw materials 3.7 comment',
    example: 'Raw materials 3.7 comment',
    required: false,
  })
  @IsString()
  @IsOptional()
  rawMaterials37?: string;

  @ApiProperty({
    description: 'Raw materials 3.8 comment',
    example: 'Raw materials 3.8 comment',
    required: false,
  })
  @IsString()
  @IsOptional()
  rawMaterials38?: string;

  @ApiProperty({
    description: 'Raw materials 3.9 comment',
    example: 'Raw materials 3.9 comment',
    required: false,
  })
  @IsString()
  @IsOptional()
  rawMaterials39?: string;

  @ApiProperty({
    description: 'Raw materials 3.10 comment',
    example: 'Raw materials 3.10 comment',
    required: false,
  })
  @IsString()
  @IsOptional()
  rawMaterials310?: string;

  @ApiProperty({
    description: 'Raw materials 3.11 comment',
    example: 'Raw materials 3.11 comment',
    required: false,
  })
  @IsString()
  @IsOptional()
  rawMaterials311?: string;

  @ApiProperty({
    description: 'Raw materials 3.12 comment',
    example: 'Raw materials 3.12 comment',
    required: false,
  })
  @IsString()
  @IsOptional()
  rawMaterials312?: string;

  @ApiProperty({
    description: 'Raw materials 3.13 comment',
    example: 'Raw materials 3.13 comment',
    required: false,
  })
  @IsString()
  @IsOptional()
  rawMaterials313?: string;

  @ApiProperty({
    description: 'Raw materials 3.14 comment',
    example: 'Raw materials 3.14 comment',
    required: false,
  })
  @IsString()
  @IsOptional()
  rawMaterials314?: string;

  @ApiProperty({
    description: 'Raw materials 3.15 comment',
    example: 'Raw materials 3.15 comment',
    required: false,
  })
  @IsString()
  @IsOptional()
  rawMaterials315?: string;
}
