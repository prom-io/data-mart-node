import {IteratingAsyncFilteringCallback} from "./internal/callback-types";

export const asyncFilter = async <T>(array: T[], callback: IteratingAsyncFilteringCallback<T>): Promise<T[]> => {
    const result: T[] = [];

    for (let index = 0; index < array.length; index++) {
        const filterResult = await callback(array[index], index, array);

        if (filterResult) {
            result.push(array[index]);
        }
    }

    return result;
}
