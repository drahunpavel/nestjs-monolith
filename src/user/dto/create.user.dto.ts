import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'test@example.com', required: true })
    email: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    @ApiProperty({ example: 'password123', required: false })
    password?: string;
}