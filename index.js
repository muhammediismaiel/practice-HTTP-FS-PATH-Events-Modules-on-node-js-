const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const eventemitter = require("node:events");
//!------------------------import package-----------------------
const userEvent = new eventemitter();
userEvent.on("userAdd", () => {
  console.log("user Add Successfully");
});
//!------------------------creat Event ADD---------------------
const server = http.createServer((req, res) => {
  //?-------------------Get Method-----------------------------
  if (req.url === "/user" && req.method === "GET") {
    fs.readFile(path.join(__dirname, "uset.txt"), "utf-8", (err, data) => {
      if (err) {
        res.end("no file");
      } else {
        res.end(`the data on file is ${data}`);
      }
    });
  }
  //?------------------post Method-------------------------------
  else if (req.url === "/user" && req.method === "POST") {
    let body = "";
    req.on("data", (chunck) => {
      body += chunck.toString();
    });
    req.on("end", () => {
      fs.appendFile(path.join(__dirname, "user.txr"), `${body}\n`, (err) => {
        if (err) {
          console.log(err);
        } else {
          userEvent.emit("userAdd", body);
          res.writeHead(201);
          res.end(`User ${body} added!`);
        }
      });
    });
  }
});
//!-------------------------Creat the server-------------------
server.listen(3000, () => {
  console.log("server is running on port 3000");
});
//!---------------------------listen----------------------------
