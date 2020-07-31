import {IsNotEmpty, IsString} from "class-validator";
import {MustMatch} from "../../../utils/validation";

export class SignUpRequest {
    @IsNotEmpty()
    @IsString()
    lambdaWallet: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    @MustMatch("password")
    repeatedPassword: string;
}
