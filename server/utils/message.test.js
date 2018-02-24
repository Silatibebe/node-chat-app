var expect = require('expect');
var {generateMessage,generateLocationMessage} = require('./message.js');
describe('generateMessage',() =>{
    it('should generate correct message object',() =>{
        var from = 'Jen';
        var text = 'Some message';
        var message = generateMessage(from,text);
        expect(message).toInclude({from,text});
        expect(message.createdAt).toBeA('number');
    });
});


describe('generateLocationMessage',() =>{
    it('should generate correct location object',() =>{
var lat = 15;
var long = 19;
var from = 'user';
var url = `https://www.google.com/maps?q=15,19`;

        var message = generateLocationMessage(from,lat,long);
        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from,url});
    });
});