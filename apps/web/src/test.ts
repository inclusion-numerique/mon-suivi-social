import {v4} from "uuid";

export const theTestFunction = () => {
    const id = v4()

    return {id, hello: 'world'}
}
