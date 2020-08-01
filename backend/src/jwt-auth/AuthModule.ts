import {Module} from "@nestjs/common";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {AuthController} from "./AuthControler";
import {AuthService} from "./AuthService";
import {LocalStrategy} from "./LocalStrategy";
import {OptionalJwtStrategy} from "./OptionalJwtStrategy";
import {OptionalJwtAuthGuard} from "./OptionalJwtAuthGuard";
import {AccountsModule} from "../accounts";
import {config} from "../config";
import {JwtStrategy} from "./JwtStrategy";

@Module({
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, OptionalJwtStrategy, OptionalJwtAuthGuard, JwtStrategy],
    imports: [
        AccountsModule,
        PassportModule,
        JwtModule.register({
            secret: config.JWT_SECRET,
            signOptions: {
                expiresIn: "3600000000s"
            }
        })
    ]
})
export class AuthModule {
}
