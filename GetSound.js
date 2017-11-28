const api = require('google-translate-api');
var https = require('https');
var fs = require('fs');

var download = function(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = https.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(cb);  // close() is async, call cb after close completes.
      });
    }).on('error', function(err) { // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });
};


var readFile = function(filename,lang) {
    var res = null;
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        console.log('OK: ' + filename);
        res = data.split('\n');
        if(!!res){
            for (let i = 0; i < res.length; i++) {
                const element = res[i];
                console.error(element);
                api.sound(element, {to: lang}).then(res => {
                    download(res, './sound/' + element + '.mp3');
                }).catch(err => {
                    console.error(err);
                });
            }
        }
    });
}

var onRun = function (lang) {
    readFile('./data/sound.txt', lang);
}
//

onRun('id');
