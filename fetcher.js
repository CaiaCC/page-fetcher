const request = require('request');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const input = process.argv.slice(2);
const localPath = input[1];
const url = input[0];


const fetcher = function (url, localPath, callback) {
	if (!fs.existsSync(localPath)) {
		throw Error("Invalid local file path.")
	}

	request(url, (error, response, body) => {
		if (error) {
			callback(error, null);
			return;
		}
		if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
			callback(Error(msg), null);
			return;
    }
    
		let data = body;
		let bytes = response.headers["content-length"]

		
		fs.writeFile(localPath, data, (error) => {
      if (error) {
				callback(error, null);
				return ;
			}
     
      callback(null, bytes);
		});
  });
};

const callback = (error, bytes) => {
	if (error) {
		console.log("Somethind wrong: " + error);
	} else {
		console.log(`Downloaded and saved ${bytes} bytes to ${localPath}`);
	}
};
fetcher(url, localPath, callback);
