import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";


export class AuthEntity {
    constructor(
        partial: Partial<AuthEntity>

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

    @ApiProperty()
    accessToken?: string;
}