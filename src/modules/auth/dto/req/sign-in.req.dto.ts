import { IsNotEmpty, IsString } from 'class-validator';

export class SignInReqDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  readonly deviceId: string;
}
