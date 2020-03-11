const proxy = require("http-proxy-middleware");
const bodyParser = require("body-parser");

module.exports = function(app) {
  // app.use(
  //   bodyParser.urlencoded({
  //     extended: false
  //   })
  // );
  //  app.use(bodyParser.json());
  var parseJSON = bodyParser.json({ limit: "900kb" });
  app.use((req, res, next) => (false ? parseJSON(req, res, next) : next()));

  // // var bodyParser = express.bodyParser;

  // redefine handler for Content-Type: multipart/form-data
  // bodyParser.parse("multipart/form-data") = function(req, options, next) {
  //   // parse request body your way; example of such action:
  //   // https://github.com/senchalabs/connect/blob/master/lib/middleware/multipart.js

  //   // for your needs it will probably be this:
  //   if () {
  //     req._body = true;
  //   }

  //   next();
  // };

  app.use(
    "/sparql",
    proxy({
      target: "http://130.211.58.252:3030/ds/",
      changeOrigin: true
    })
  );

  app.use(
    "/couchdb",
    proxy({
      target: "http://130.211.58.252:5984/",
      changeOrigin: true
    })
  );

  app.use(
    "/api/report",
    proxy({
      target: "http://130.211.58.252:9998/prepareReportJob",
      changeOrigin: true
    })
  );

  app.use(
    "/api/sparqlgen",
    proxy({
      target: "http://130.211.58.252:19998/sparqlGenerate",

      changeOrigin: true
    })
  );
};