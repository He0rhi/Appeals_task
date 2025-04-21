import { IsString,IsNumber, IsIn, IsOptional  } from "class-validator";

export class cancelAllInProgressDto{

    @IsString()
    @IsOptional()
    cancellationReason!:string;

}