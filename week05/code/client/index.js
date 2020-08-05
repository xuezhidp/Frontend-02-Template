const images = require("images");
const Request = require("./Request");
const parser = require("./parser");
const render = require("./render");

void (async function () {
  let request = new Request({
    method: "POST",
    // host: "127.0.0.1",
    host: "localhost",
    port: "8088",
    path: "/",
    headers: {
      ["X-Foo2"]: "customed",
    },
    body: {
      name: "winter",
    },
  });

  let response = await request.send();

  let dom = parser.parseHtml(response.body);

  let viewport = images(800, 600);

  render(viewport, dom);
  viewport.save("123.jpg");
  console.log("dom", dom);
})();
