import {IsNotEmpty, IsString, Matches, ValidateIf} from "class-validator";
import {IsValidEthereumPrivateKeyFor, MustMatch} from "../../../utils/validation";

export class RegisterAccountRequest {
    @ValidateIf((object: RegisterAccountRequest) => Boolean(object.address))
    @IsNotEmpty({message: "Address must not be empty"})
    @IsString({message: "Address must be a string"})
    @Matches(
        new RegExp("^0x[a-fA-F0-9]{40}$"),
        {
            message: "Address must be valid Ethereum address"
        }
    )
    public address?: string;

    @ValidateIf((object: RegisterAccountRequest) => Boolean(object.privateKey))
    @IsNotEmpty({message: "Private key must not be empty"})
    @IsString({message: "Private key must be a string"})
    @IsValidEthereumPrivateKeyFor("address", {message: "Invalid private key"})
    public privateKey?: string;

    @ValidateIf((object: RegisterAccountRequest) => Boolean(object.lambdaWallet))
    @IsString()
    public lambdaWallet?: string;

    @ValidateIf((object: RegisterAccountRequest) => Boolean(object.lambdaWallet))
    @IsString()
    @IsNotEmpty()
    public password?: string;

    @ValidateIf((object: RegisterAccountRequest) => Boolean(object.lambdaWallet))
    @IsString()
    @IsNotEmpty()
    @MustMatch("password")
    public passwordConfirmation?: string;

    constructor(address?: string, privateKey?: string, lambdaWallet?: string, password?: string, passwordConfirmation?: string) {
        this.address = address;
        this.privateKey = privateKey;
        this.lambdaWallet = lambdaWallet;
        this.password = password;
        this.passwordConfirmation = passwordConfirmation;
    }
}
