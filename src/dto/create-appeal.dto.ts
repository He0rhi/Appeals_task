import { IsString, MinLength, MaxLength  } from "class-validator";

export class CreateAppealDto{

    @IsString()
    @MinLength(3)
    @MaxLength(100)
    theme!:string;

    @IsString()
    @MinLength(10)
    text!:string;
}