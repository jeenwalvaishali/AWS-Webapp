const server = require("../index");
const chai = require('chai');
const chaiHttp = require('chai-http');

//Assertion
const expect = chai.expect;
chai.use(chaiHttp);


describe("Unit test for GET method for Healthz", () => {
    it("It should return response code 200", (done) => {
        chai.request(server)
        .get('/healthz')
        .end((err, res) => {
            expect(200);
            const message = res.body.message;
            expect(message).to.be.equal('Healthy!');
            done();
        })
    });
});

