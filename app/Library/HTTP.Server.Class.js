const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

class HTTPServer {
	constructor(subfolder = "public") {
		return http.createServer(function (request, response) {
			// console.log("request ", request.url);

			let reqUrlString = request.url;
			let urlObject = url.parse(reqUrlString, true, false);

			let fileName = urlObject.pathname;

			let filePath = "./" + subfolder + "/" + fileName;
			if (filePath.substr(filePath.length - 1) == "/") {
				filePath += "index.html";
			}

			let extname = String(path.extname(filePath)).toLowerCase();
			let mimeTypes = {
				".html": "text/html",
				".js": "text/javascript",
				".css": "text/css",
				".json": "application/json",
				".png": "image/png",
				".jpg": "image/jpg",
				".gif": "image/gif",
				".wav": "audio/wav",
				".mp4": "video/mp4",
				".woff": "application/font-woff",
				".ttf": "application/font-ttf",
				".eot": "application/vnd.ms-fontobject",
				".otf": "application/font-otf",
				".svg": "image/svg+xml",
				".wasm": "application/wasm",
			};

			let contentType = mimeTypes[extname] || "application/octet-stream";

			fs.readFile(filePath, function (error, content) {
				if (error) {
					if (error.code == "ENOENT") {
						fs.readFile("./" + subfolder + "/404.html", function (error, content) {
							response.writeHead(404, { "Content-Type": contentType });
							response.end(content, "utf-8");
						});
					} else {
						response.writeHead(500);
						response.end("Sorry, check with the site admin for error: " + error.code + " ..\n");
					}
				} else {
					response.writeHead(200, {
						"Access-Control-Allow-Origin": "*",
						"Content-Type": contentType,
					});
					response.end(content, "utf-8");
				}
			});
		});
	}
}

module.exports = (subfolder) => {
	return typeof subfolder === "undefined" ? new HTTPServer("public") : new HTTPServer(subfolder);
};
