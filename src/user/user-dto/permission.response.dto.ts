import { ApiProperty } from "@nestjs/swagger";
import { plainToClass } from "class-transformer";

export class PermissionResDto {

    @ApiProperty({example:"Create User"})
    name:string;

    @ApiProperty({example:"CREATE_USER"})
    value:string;

    @ApiProperty({example:"This permission is specifically meant for creating a user"})
    description:string;
    
    static transform(object: any){
        let transformedObj : PermissionResDto = plainToClass(PermissionResDto, object, );
        return transformedObj;
    }
}