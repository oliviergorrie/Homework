/**
 * Created by oliverg on 28/06/2016.
 */

var request = require('request-json');


var express = require("express"); 
var exphbs  = require('express-handlebars');
var helpers = require('handlebars-helpers')();
var Tokenizer = require('tokenize-text');
var tokenize = new Tokenizer();


var app = express();
app.use(express.static('public'));



app.engine('.hbs', exphbs({defaultLayout: 'main', extname:'.hbs'}));
app.set('view engine', '.hbs');

app.get('/', function(req,res){
    res.render('homepage')

});




const processStory = function(story) {
    var tone = 0;

    var punctuationless = story.body.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    var finalString = punctuationless.replace(/\s{2,}/g, " ");
    console.log(finalString);


    var positive = ["success", "gains", "grow", "positive", "healthy", "happy"];
    var negative = ["slump", "drag", "decline", "concerns", "disappointing", "feared"];


    for (var a in positive) {
        if (finalString.indexOf(positive[a]) !== -1) {
            tone++
        }
    }

    for (var b in negative) {
        if (finalString.indexOf(negative[b]) !== -1) {
            tone--
        }
    }


    story.tone = tone;


    if (tone >= 2) {
        story.img_url = "http://localhost:8765/happy-face.jpg"
    }

    else if (tone >= 0) {
        story.img_url = "http://localhost:8765/neutral-face.jpg"
    }

    else {
        story.img_url = "http://localhost:8765/sad-face.jpeg"
    }
    return story;

};

const processStories = function(stories) {
    for (var s in stories) {

        stories[s] = processStory(stories[s]);

    }
    return stories;
};

const buildTickerUrl = function (ticker) {
    var url = 'http://mm-recruitment-stock-price-api.herokuapp.com';
    var path = '/company/' + ticker;
    var page = url + path;
    console.log('Getting ticker info from', page);
    return page;
};


const getCompNameFromTicker = function(ticker, cb) {
    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');
    var uri = 'mongodb://mm_recruitment_user_readonly:rebelMutualWhistle@ds037551.mongolab.com:37551/mm-recruitment';
    var findCompany = function (db, callback) {
        var cursor = db.collection('company').findOne({"tickerCode": ticker}, function (err, doc) {
            if (doc != null) {
                callback(doc.name);
                console.log(doc.name);

            } else {
                callback('error');
            }

        });

    };

    MongoClient.connect(uri, function (err, db) {
        assert.equal(null, err);
        findCompany(db, function (name) {
            db.close()
            cb(name);
        });
    });
};



app.get('/:ticker', function(req, res) {
    console.log('ticker requested');

    const ticker = req.params.ticker;
    const tickerUrl = buildTickerUrl(ticker);



    var client = request.createClient(tickerUrl);


    client.get('/company/'+ticker, function (err, companyRes, body) {



        if (typeof body.storyFeedUrl == "undefined") {
            res.send("error: Unknown stock ticker.")
        }
        else {


            console.log('info: ', body);


            client.get(body.storyFeedUrl, function (error, storyRes, stories) {


                stories = processStories(stories);


                getCompNameFromTicker(ticker, function(name) {

                    
                        var data = {
                            ticker: ticker,
                            latestPrice: body.latestPrice,
                            priceUnits: body.priceUnits,
                            stories: stories,
                            name: name,


                        };

                        res.render('company', data);

                    
                });

            });


        }

    });




});


console.log('loaded...')


app.listen(8765);



module.exports = {
    processStory: processStory,
    processStories: processStories,
    getCompNameFromTicker: getCompNameFromTicker,
};