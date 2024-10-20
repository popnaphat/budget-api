//create-item.dto
import { IsNotEmpty, IsNumber, IsOptional, IsString ,ValidationArguments} from "class-validator";
const isNumberMessage = (validationArguments: ValidationArguments): string => {
    return `${validationArguments.property}: ต้องเป็นตัวเลข`
  }
export class CreateItemDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber({}, { message: isNumberMessage})
    @IsNotEmpty()
    amount: number;

    @IsNumber({}, { message: isNumberMessage})
    @IsNotEmpty()
    price: number;

    @IsOptional()
    contactMobileNo: string;

    createdby?: string;
}