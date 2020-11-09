'use strict';

const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const querystring = require('querystring');

const mongo = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const app = express()
const port = 3000
const STATIC_DIR = 'statics';
const TEMPLATES_DIR = 'templates';
//app.get('/', (req, res) => res.send('Hello World!'))

app.locals.port = port;
  app.locals.base = "localhost:3000/";
  //app.locals.model = model;
  //app.use('',express.static(STATIC_DIR));
  process.chdir(__dirname);
  app.get('/',function(req,res){
  res.sendFile(__dirname +'/statics' + '/home.html');
  })
  //setupTemplates(app);
  setupRoutes(app);
  app.listen(port, function() {
    console.log(`listening on port ${port}`);
  });
  module.export = app;
  function setupRoutes(app) {
  const base = "localhost:3000/";
  //app.get(`/search-primary.html`, doSearch(app));
  //app.get(`/search-by-location.html`, doSearchLocation(app));
  //app.get(`/search-by-Long.html`, doSearchLong(app));
  //app.get(`/comp-district.html`, doCompDistrict(app));
  //app.get(`/Search-a-case.html`, doSearchCase(app));


}
