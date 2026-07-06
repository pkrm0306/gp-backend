import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsEmail, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ description: 'Company name', required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ description: 'Vendor name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Designation', required: false })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiPropertyOptional({
    description:
      '**GST certificate** as a public URL path (e.g. `/uploads/manufacturers/vendor-gst-….pdf`) or absolute `https://…` URL. ' +
      'If you send a plain GST number (no leading `/` or `http`), it is treated as **gstNumber** for backward compatibility. ' +
      'Prefer **gstNumber** for the GST id text and **gst** for the document URL. Multipart uploads for this field must be **PDF or JPEG** only.',
    example: '/uploads/manufacturers/vendor-gst-123.pdf',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  gst?: string;

  @ApiPropertyOptional({
    description:
      'GST identification text (trimmed / uppercased for storage; no fixed format). Omit when you only upload a certificate file.',
    example: '29AABCU9603R1ZM',
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  gstNumber?: string;

  @ApiPropertyOptional({
    description:
      'Company logo image URL path (e.g. `/uploads/manufacturers/company-logo-….png`).',
    example: '/uploads/manufacturers/company-logo-456.png',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  companyLogo?: string;

  @ApiPropertyOptional({
    description:
      'PAN **document** URL path (e.g. `/uploads/manufacturers/...` or `https://…`) after upload, **or** a plain PAN id string for backward compatibility. Multipart uploads for the PAN file must be **PDF or JPEG** only.',
    example: '/uploads/manufacturers/1730000000000_pan.jpg',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  pan?: string;

  @ApiPropertyOptional({
    description:
      'Optional PAN id / reference text (trimmed / uppercased; no fixed pattern). **Omit** when you only upload a scan (**pan** / **panDocument**). Multipart may send this as an array — first non-empty value is used.',
    example: 'ABCDE1234F',
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null) {
      return undefined;
    }
    if (Array.isArray(value)) {
      const first = value.find(
        (v) => v !== undefined && v !== null && String(v).trim() !== '',
      );
      if (first === undefined) {
        return undefined;
      }
      const s = String(first).trim();
      return s === '' ? undefined : s;
    }
    const s = String(value).trim();
    return s === '' ? undefined : s;
  })
  @IsOptional()
  @IsString()
  panNumber?: string;

  @ApiProperty({ description: 'Email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Mobile number', required: false })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiPropertyOptional({
    description: 'Facebook page URL. Send an empty string to clear.',
    example: 'https://www.facebook.com/yourcompany',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  facebook?: string;

  @ApiPropertyOptional({
    description: 'Alias of `facebook` (vendor panel).',
    example: 'https://www.facebook.com/yourcompany',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  facebookUrl?: string;

  @ApiPropertyOptional({
    description: 'YouTube channel URL. Send an empty string to clear.',
    example: 'https://www.youtube.com/@yourcompany',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  youtube?: string;

  @ApiPropertyOptional({
    description: 'Alias of `youtube` (vendor panel).',
    example: 'https://www.youtube.com/@yourcompany',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  youtubeUrl?: string;

  @ApiPropertyOptional({
    description: 'Twitter / X profile URL. Send an empty string to clear.',
    example: 'https://x.com/yourcompany',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  twitter?: string;

  @ApiPropertyOptional({
    description: 'Alias of `twitter` (vendor panel).',
    example: 'https://x.com/yourcompany',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  twitterUrl?: string;

  @ApiPropertyOptional({
    description: 'LinkedIn company page URL. Send an empty string to clear.',
    example: 'https://www.linkedin.com/company/yourcompany',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  linkedin?: string;

  @ApiPropertyOptional({
    description: 'Alias of `linkedin` (vendor panel).',
    example: 'https://www.linkedin.com/company/yourcompany',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  linkedinUrl?: string;
}
