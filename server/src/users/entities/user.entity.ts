import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";


export class UserEntity {
    constructor(
        partial: Partial<UserEntity>

    ) {
        Object.assign(this, partial);
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @Exclude()
    password: string;
}