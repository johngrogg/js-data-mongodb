/*global assert:true */
'use strict';

var assert = require('chai').assert;
var mocha = require('mocha');
var sinon = require('sinon');
var DSMongoDBAdapter = require('./');
var JSData = require('js-data');

var adapter, store, DSUtils, DSErrors, User, Post, Comment;

var globals = module.exports = {
  fail: function (msg) {
    assert.equal('should not reach this!: ' + msg, 'failure');
  },
  TYPES_EXCEPT_STRING: [123, 123.123, null, undefined, {}, [], true, false, function () {
  }],
  TYPES_EXCEPT_STRING_OR_ARRAY: [123, 123.123, null, undefined, {}, true, false, function () {
  }],
  TYPES_EXCEPT_STRING_OR_NUMBER: [null, undefined, {}, [], true, false, function () {
  }],
  TYPES_EXCEPT_STRING_OR_OBJECT: [123, 123.123, null, undefined, [], true, false, function () {
  }],
  TYPES_EXCEPT_STRING_OR_NUMBER_OBJECT: [null, undefined, [], true, false, function () {
  }],
  TYPES_EXCEPT_STRING_OR_ARRAY_OR_NUMBER: [null, undefined, {}, true, false, function () {
  }],
  TYPES_EXCEPT_NUMBER: ['string', null, undefined, {}, [], true, false, function () {
  }],
  TYPES_EXCEPT_OBJECT: ['string', 123, 123.123, null, undefined, true, false, function () {
  }],
  TYPES_EXCEPT_BOOLEAN: ['string', 123, 123.123, null, undefined, {}, [], function () {
  }],
  TYPES_EXCEPT_FUNCTION: ['string', 123, 123.123, null, undefined, {}, [], true, false],
  assert: assert,
  sinon: sinon,
  adapter: undefined
};

var test = new mocha();

var testGlobals = [];

for (var key in globals) {
  global[key] = globals[key];
  testGlobals.push(globals[key]);
}
test.globals(testGlobals);

beforeEach(function () {
  store = new JSData.DS({
    log: false
  });
  adapter = new DSMongoDBAdapter('mongodb://localhost:27017');
  DSUtils = JSData.DSUtils;
  DSErrors = JSData.DSErrors;
  globals.User = global.User = User = store.defineResource({
    name: 'user',
    idAttribute: '_id',
    relations: {
      hasMany: {
        post: {
          localField: 'posts',
          foreignKey: 'post'
        }
      }
    }
  });
  globals.Post = global.Post = Post = store.defineResource({
    name: 'post',
    idAttribute: '_id',
    relations: {
      belongsTo: {
        user: {
          localField: 'user',
          localKey: 'userId'
        }
      },
      hasMany: {
        comment: {
          localField: 'comments',
          foreignKey: 'postId'
        }
      }
    }
  });
  globals.Comment = global.Comment = Comment = store.defineResource({
    name: 'comment',
    idAttribute: '_id',
    relations: {
      belongsTo: {
        post: {
          localField: 'post',
          localKey: 'postId'
        },
        user: {
          localField: 'user',
          localKey: 'userId'
        }
      }
    }
  });

  globals.adapter = adapter;
  global.adapter = globals.adapter;

  globals.DSUtils = DSUtils;
  global.DSUtils = globals.DSUtils;

  globals.DSErrors = DSErrors;
  global.DSErrors = globals.DSErrors;
});

afterEach(function (done) {
  globals.adapter = null;
  global.adapter = null;

  adapter.destroyAll(User, {}).then(function () {
    done();
  }, done);
});
