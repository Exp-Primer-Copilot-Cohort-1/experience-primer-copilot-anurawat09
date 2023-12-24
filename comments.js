//create web server 
var http = require('http');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');

//create server
http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    console.log(q.pathname);
    if (q.pathname == "/") {
        filename = "./index.html";
    }
    fs.readFile(filename, function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("404 Not Found");
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });

    //write to file 
    if (q.pathname == "/comment") {
        var body = "";
        req.on("data", function (chunk) {
            body += chunk;
        });
        req.on("end", function () {
            var commentData = {
                "name": name,
                "email": email,
                "comment": comment,
                "time": time
            };
            
            var obj = querystring.parse(body);
            var comment = obj["comment"];
            var name = obj["name"];
            var email = obj["email"];
            var date = new Date();
            var time = date.toLocaleString();
            var data = {
                "name": name,
                "email": email,
                "comment": comment,
                "time": time
            };
            fs.readFile("data.json", function (err, data) {
                if (err) {
                    console.log(err);
                    return;
                }
                var json = JSON.parse(data);
                  json.push(commentData); // Use the comment data instead of the entire data object

                fs.writeFile("data.json", JSON.stringify(json), function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log("Saved");
                });
            });
        });
    }
}).listen(8080);
