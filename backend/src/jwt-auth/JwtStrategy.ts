import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt";
import {JwtPayload} from "../model";
import {User} from "../model/domain";
import {UsersRepository} from "../accounts/UsersRepository";
import {config} from "../config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private readonly usersRepository: UsersRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: config.JWT_SECRET
        });
    }

    public async validate(payload: JwtPayload): Promise<User> {
        try {
            return await this.usersRepository.findById(payload.id);
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}
