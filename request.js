var express = require('express');
var request = require('superagent');

request.post('http://localhost:3000/collections/stupid')
  .send({name: 'jerry', age: 23})
  .end(function (err, res) {
    if (err) console.log(err)
  })