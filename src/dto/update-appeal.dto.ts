import { IsString, IsOptional  } from "class-validator";

export class UpdateAppealDto{

    @IsOptional()
    @IsString()
    resolution?:string;

    @IsOptional()
    @IsString()
    cancellationReason!:string;
}