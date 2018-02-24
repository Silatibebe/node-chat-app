const expect = require('expect');
const {isRealString} = require('./validation');

//isRealString

describe('validate user input', () =>{
    
    it('should reject empty strings', () =>{
       var  result = isRealString('');
       expect(result).toBe(false);
    });
    it('should reject strings with only space', () =>{
        var result = isRealString(' ');
        expect(result).toBe(false);
    });
    it('should reject non-strings values', () =>{
        var result = isRealString({});
        expect(result).toBe(false);      
    });
    it('should allow strings with non-space characters', () =>{
        var result = isRealString('   foo   ');
        expect(result).toBe(true);      
    });
});
