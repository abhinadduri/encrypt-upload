const express = require('express')
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation
const app = express()

app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/download', function(req, res) {
  res.download(__dirname + '/img/test.txt');
});

app.route('/upload')
    .post(function (req, res, next) {

        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);

            //Path where image will be uploaded
            fstream = fs.createWriteStream(__dirname + '/img/' + filename);
            file.pipe(fstream);
            fstream.on('close', function () {    
                console.log("Upload Finished of " + filename);              
                res.redirect('/');           //where to go next
            });
        });
    });



app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

