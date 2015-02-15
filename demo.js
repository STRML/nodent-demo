var nodent = require('nodent')() ;
var http = require('http') ;
var fs = require('fs') ;

function handle(req,res) {
  var url = req.url.split("?") ;
  switch(url[0]) {
  case '/':
    res.body = "" ;
    req.on('data',function(data){ res.body += data.toString() }) ;
    req.on('end',function(){
      res.statusCode = 200 ;
      res.setHeader("Content-type","text/html") ;
      fs.readFile('www/index.html',function(err,data){
        res.end(data.toString()) ;
      }) ;    
    }) ;
    break ;

  case '/es7':
  case '/promise':
    res.body = "" ;
    req.on('data',function(data){ res.body += data.toString() }) ;
    req.on('end',function(){
      try {
        var result = {} ;
        result.compiled = nodent.compile(res.body,"source.js",3,{es7:true,promises:req.url=='/promise'}).code ;
        res.statusCode = 200 ;
        res.setHeader("Content-type","application/json") ;
        res.end(JSON.stringify(result)) ;
      } catch (ex) {
        res.statusCode = 500 ;
        res.setHeader("Content-type","text/plain") ;
        res.end(ex.message) ;
      }
    }) ;
    break ;

  default:
    res.statusCode = 404 ;
    res.setHeader("Content-type","text/plain") ;
    res.end("Not found: "+req.url) ;
    break;
  }
} ;

http.createServer(handle).listen(8080) ;
