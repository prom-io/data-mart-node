import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {UsersRepository} from "../accounts/UsersRepository";
import {BCryptPasswordEncoder} from "../bcrypt";
import {User} from "../model/domain";

@Injectable()
export class AuthService {
    constructor(private readonly usersRepository: UsersRepository,
                private readonly passwordEncoder: BCryptPasswordEncoder,
                private readonly jwtService: JwtService) {
    }

    public async validate(username: string, password: string): Promise<User | null> {
        const user = await this.usersRepository.findByLambdaWallet(username);

        if (!user) {
            return null;
        }

        if (await this.passwordEncoder.matches(password, user.passwordHash)) {
            return user;
        }

        return null;
    }

    public async login(user: User): Promise<{accessToken: string}> {
        const payload = {
            id: user.id,
            lambdaWallet: user.lambdaWallet
        };

        return {
            accessToken: await this.jwtService.signAsync(payload)
        }
    }
}
