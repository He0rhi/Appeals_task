import { IsString,MinLength} from "class-validator";

export class CompleteAppealDto {
    @IsString()
    @MinLength(5)  
    resolution!: string;
}