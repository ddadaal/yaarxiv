const http = require("http");

const authHeader = "x-deploy-agent-key";
const dataLengthLimit = 20;

const deployAgentKey = process.env.DEPLOY_AGENT_KEY;
const port = process.env.DEPLOY_AGENT_PORT;
const { spawn } = require("child_process");

const server = http.createServer((req, res) => {
  // validate the deploy request
  if (
    req.method !== "POST" || 
    req.headers["content-type"] !== "text/plain" ||
    req.headers[authHeader] !== deployAgentKey
  ) {
    res.writeHead(403).end();
    return;
  }

  let data = "";
  req.on("data", (d) => {
    data += d;
    if(data.length > dataLengthLimit) {
      data = "";
      res.writeHead(413, {'Content-Type': 'text/plain'}).end();
      req.connection.destroy();
    }
  });

  req.on("end", () => {
    if (data === "frontend" || data === "backend") {
      console.log(`${data} deployment requested. Trying to update deployment.`);
      spawn(`docker-compose pull ${data} && docker-compose up -d ${data}`, { stdio: "inherit", shell: true });
      res.writeHead(200);
    } else {
      res.writeHead(400);
    }
    res.end();
  });
});

server.listen(port).on("listening", () => {
  console.log(`deploy agent listening on port ${port}`)
});