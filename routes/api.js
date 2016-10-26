var express = require('express');
var router = express.Router();

var fs = require('fs');

function keyToObj(key){
  return {
    key: key,
    value: fs.readFileSync("links/"+key).toString()
  };
}

router.get('/list', function(req, res, next) {
  //console.log(data);
  res.contentType("text/json")
    .send(
      fs.readdirSync("links")
        .map(keyToObj));
});

router.get('/key/:key', function(req, res, next) {

  console.log(req.params);
  //console.log(data);
  res.contentType("text/json")
    .send(keyToObj(req.params.key));
});

router.put('/key', handlePut);
router.put('/key/:key', handlePut);

function handlePut(req, res, next) {

  var key = req.params.key || req.body.key;

  if (!key || !req.body.key.match(/[a-z0-9_]+/).length)
    res.status(400).send("Bad Request");

  if (!(req.body.pw && req.body.pw === process.env.pw)) {
    res.status(401).send("Unauthorized");
  }

  if (!req.body.value) {
    res.status(400).send("Bad Request");
  }

  fs.writeFileSync(`links/${key}`, req.body.value);
  res.status(200).send("Okay");
}

router.delete('/key/:key', function(req,res,next){
  fs.('links/'+req.params.key, function() {
    res.send(200);
  });
});

module.exports = router;
