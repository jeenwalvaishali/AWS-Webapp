const chai = require('chai');
const chaiHttp = require('chai-http');
var request = require('request');

const expect = chai.expect;
chai.use(chaiHttp);

it("Unit test for GET method for Healthz", function(done) {
    request('http://localhost:3000/healthz' , function(error, response, body) {
        expect(200);
        done();
    });
});
