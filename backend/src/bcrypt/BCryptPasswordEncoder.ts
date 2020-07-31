import {Injectable} from "@nestjs/common";
import {hash, compare} from "bcrypt";

@Injectable()
export class BCryptPasswordEncoder {

    public encode(data: string, rounds: number | undefined = 12): Promise<string> {
        return hash(data, rounds);
    }

    public matches(data: string, hashToCompare: string): Promise<boolean> {
        return compare(data, hashToCompare);
    }
}
