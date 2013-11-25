'use strict';

var util = require('util'),
    growl = require('growl'),
    path = require('path');

var MSG_SUCCESS = '%d tests passed in %s.',
    MSG_FAILURE = '%d/%d tests failed in %s.',
    MSG_ERROR = '';

var OPTIONS = {
  success: {
    title: 'PASSED - %s',
    image: path.join(__dirname, 'images/success.png')
  },
  failed: {
    title: 'FAILED - %s',
    image: path.join(__dirname, 'images/failed.png')
  },
  error: {
    title: 'ERROR - %s',
    image: path.join(__dirname, 'images/error.png')
  }
};


var GrowlReporter = function(helper, logger, config) {
  var log = logger.create('reporter.growl');

  var optionsFor = function(type, browser) {
    var prefix = config && config.prefix ? config.prefix : '';
    return helper.merge(OPTIONS[type], {title: prefix + util.format(OPTIONS[type].title, browser)});
  };

  this.adapters = [];

  this.onBrowserComplete = function(browser) {
    var results = browser.lastResult;
    var time = helper.formatTimeInterval(results.totalTime);

    if (results.disconnected || results.error) {
      growl(MSG_ERROR, optionsFor('error', browser.name));
      return;
    }

    if (results.failed) {
      growl(util.format(MSG_FAILURE, results.failed, results.total, time),
        optionsFor('failed', browser.name));
      return;
    }

    growl(util.format(MSG_SUCCESS, results.success, time),
      optionsFor('success', browser.name));
  };
};

GrowlReporter.$inject = ['helper', 'logger','config.growlReporter'];

module.exports = {
  'reporter:growl': ['type', GrowlReporter]
};
