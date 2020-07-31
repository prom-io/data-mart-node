import {Injectable} from "@nestjs/common";
import uuid from "uuid/v4";
import {UsersRepository} from "./UsersRepository";
import {SignUpRequest} from "../model/api/request";
import {Account, AccountType, User} from "../model/domain";
import {BCryptPasswordEncoder} from "../bcrypt";
import {AccountsRepository} from "./AccountsRepository";
import {WalletGeneratorApiClient} from "../wallet-generator/WalletGeneratorApiClient";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository,
                private readonly accountsRepository: AccountsRepository,
                private readonly bCryptPasswordEncoder: BCryptPasswordEncoder,
                private readonly walletGeneratorApiClient: WalletGeneratorApiClient) {
    }

    public async signUp(signUpRequest: SignUpRequest): Promise<void> {
        try {
            const wallet = await this.walletGeneratorApiClient.generateWallet();
            const user: User = {
                id: uuid(),
                lambdaWallet: signUpRequest.lambdaWallet,
                passwordHash: await this.bCryptPasswordEncoder.encode(signUpRequest.password)
            };
            await this.usersRepository.save(user);
            const account: Account = {
                userId: user.id,
                address: wallet.address,
                privateKey: wallet.privateKey,
                type: AccountType.DATA_MART
            };
            await this.accountsRepository.save(account);
        } catch (e) {
            
        }
    }
}
