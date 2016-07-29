/**
 * Created by oliverg on 26/07/2016.
 */
var expect = require('chai').expect;
var webdriverio = require('webdriverio');
var options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

describe('Feedback page', () => {

    it('Title', (done) => {

    webdriverio
        .remote(options)
        .init()
        .url('http://localhost:8765')
        .getTitle().then(function(title) {
        console.log('Title was: ' + title);
        expect(title).to.be.equal('Homework')
        done();
        })
        .end();
    });


});

describe('Input data', () => {
    let browser;
    beforeEach(() => {

        browser =  webdriverio
            .remote(options)
            .init()
            .url('http://localhost:8765')
    });

    it('should return error if stock ticker code is not recognised', (done) => {

        browser
            .setValue('#ticker', 'GUBK')
            .click('#button')
            .getHTML('body').then(function(body) {
            expect(body).to.contain("error: Unknown stock ticker.")

            done();
            })
            .end();
    });

    it('should render /company if ticker code is correct', (done) => {

        browser
            .setValue('#ticker', 'GOOG')
            .click('#button')
            .getHTML('body').then(function(body) {
            expect(body).to.contain("Google")
   
            done();
            })
            .end();
    });



});
