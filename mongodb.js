/**
 * Created by oliverg on 30/06/2016.
 */

//mongodb://mm_recruitment_user_readonly:rebelMutualWhistle@ds037551.mongolab.com:37551/mm-recruitment

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://mm_recruitment_user_readonly:rebelMutualWhistle@ds037551.mongolab.com:37551/mm-recruitment';

var findCompanies = function(db, callback) {
    var cursor =db.collection('company').find( );
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            console.dir(doc);
        } else {
            callback();
        }
    });
};

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    findCompanies(db, function() {
        db.close();
    });
});