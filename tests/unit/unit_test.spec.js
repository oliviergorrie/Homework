/**
 * Created by oliverg on 26/07/2016.
 */
var application = require('../../app.js');
var chai = require('chai');
var assert = chai.assert;

describe('story tone', function() {

    it('stories should have correct tone', function(){
        let stories = [{
            body: "blah blah grow blah success blah blah happy"
        },{
            body: "blah blah grow blah success blah blah feared"
        },{
            body: "blah blah slump blah drag blah blah feared"
        }];
        
        const processStories = application.processStories(stories);
        assert.equal(processStories[0].tone, 3);
        assert.equal(processStories[1].tone, 1);
        assert.equal(processStories[2].tone, -3);
        
    });

    it('stories should have appropriate pictures', function(){
        let stories = [{
            body: "blah blah grow blah success blah blah happy"
        },{
            body: "blah blah grow blah success blah blah feared"
        },{
            body: "blah blah slump blah drag blah blah feared"
        }];

        const processStories = application.processStories(stories);
        assert.equal(processStories[0].img_url, "http://localhost:8765/happy-face.jpg");
        assert.equal(processStories[1].img_url, "http://localhost:8765/neutral-face.jpg");
        assert.equal(processStories[2].img_url, "http://localhost:8765/sad-face.jpeg");
    });
    
});

