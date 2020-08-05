const http = require("http");
http
  .createServer((request, response) => {
    let body = [];
    request
      .on("error", (err) => {
        console.log(err);
      })
      .on("data", (chunk) => {
        console.log("chunk", chunk);
        body.push(chunk.toString());
      })
      .on("end", () => {
        // body = Buffer.concat(body).toString()
        console.log("body:", body);
        response.writeHead(200, { "Content-Type": "text/html" });
        // response.end('hello world\n')
        response.end(`<html maaa=a >
    <head>
      <style>
      #container {
        width:500px;
        height:300px;
        display:flex;
        background-color:rgb(255,255,255);
      }
      #container #myid {
        height:100px; 
        width:200px;
        background-color:rgb(255,0,0);
      }
      #container .c1 {
        flex:1;
        background-color:rgb(0, 255,0);
      }
      </style>
    </head>
    <body>
        <div id="container">
          <div id="myid"></div>
          <div class="c1"></div>
        </div>
    </body>
    </html>`);
      });
  })
  .listen(8088);

console.log("server start");

// http
//   .createServer((request, response) => {
//     let body = [];

//     request
//       .on("error", (err) => {
//         console.error(err);
//       })
//       .on("data", (chunk) => {
//         body.push(chunk);
//       })
//       .on("end", () => {
//         body = Buffer.concat(body).toString();
//         console.log("body: ", body);
//         response.writeHead(200, { "Content-Type": "text/html" });
//         response.end("Hello World\n");
//       });
//   })
//   .listen(8088);

console.log("Server started");
