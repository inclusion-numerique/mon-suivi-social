import {theTestFunction} from "./test";

describe('test', ()=>{
    it('Can test stuff', ()=>{
    const result = theTestFunction()
        expect(result.id).toBeString()
        expect(result.hello).toEqual('world')
    })
})
