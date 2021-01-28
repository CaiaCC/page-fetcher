const request = require('request');
const fs = require('fs');
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const input = process.argv.slice(2);
const url = input[0];
const filePath = input[1];

const fetcher = (url, filePath, callback) => {
    if (!fs.existsSync(filePath)) {
      throw Error("Invalid local file path.");
    };

    request(url, (err, res, body) => {
        if (err) {
            callback(err, null);
            return
        }

        if (res.statusCode !== 200) {
            const errMsg = `Status Code ${res.statusCode} when fetching data. Response: ${body}`;
            callback(err(errMsg), null);
            return;
        }
        const bytes = res.headers['content-length'];

        fs.access(filePath, fs.F_OK, (err) => {
            if (err) {
                callback(error, null);
                return;
            }
            rl.question(
            "File already exists! Do you want to overwrite it? (y/n)",
            (key) => {
                switch (key) {
                    case "y":
                        fs.writeFile(filePath, body, (err) => {
                        if (err) {
                            callback(error, null);
                            return;
                        }
                        });
                        
                        callback(null, bytes);
                        rl.close();
                        break;

                    case "n":
                        console.log("File not saved!");
                        rl.close();
                }
            });
        });
    });
};

const callback = (err, bytes) => {
    if(!err) {
        console.log(`Downloaded and saved ${bytes} bytes to ${filePath}`);
    } else {
        console.log("Something wrong: " + err);
    }
}

fetcher(url, filePath, callback);