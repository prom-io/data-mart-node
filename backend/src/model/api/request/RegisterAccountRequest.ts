import {IsNotEmpty, IsString, Matches} from "class-validator";
import {IsValidEthereumPrivateKey} from "../../../utils/validation";

export class RegisterAccountRequest {
    @IsNotEmpty({message: "Address must not be empty"})
    @IsString({message: "Address must be a string"})
    @Matches(
        new RegExp("^0x[a-fA-F0-9]{40}$"),
        {
            message: "Address must be valid Ethereum address"
        }
    )
    public address: string;

    @IsNotEmpty({message: "Private key must not be empty"})
    @IsString({message: "Private key must be a string"})
    @IsValidEthereumPrivateKey("address")
    public privateKey: string;
}
