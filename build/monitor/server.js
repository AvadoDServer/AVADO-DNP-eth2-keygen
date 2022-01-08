const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware");
const exec = require("child_process").exec;
const fs = require('fs');
const path = require("path");

console.log("Monitor starting...");

const server = restify.createServer({
    name: "MONITOR",
    version: "1.0.0"
});

const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: [
        /^http:\/\/localhost(:[\d]+)?$/,
        "http://*.my.ava.do",
    ]
});

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser());

server.post("/mkkeys", (req, res, next) => {
    if (!req.body) {
        res.send(400, "not enough parameters");
        return next();
    }

    mkkeys(req.body.language, req.body.password, req.body.amount).then((stdout) => {
        res.send(200, stdout);
    }).catch((e) => {
        res.send(500, e);
    })
});

server.get("/reset", (req, res, next) => {
    const vpath = path.join(__dirname, "validator_keys");
    console.log(`Deleting path ${vpath}`);
    if (!fs.existsSync(vpath)) {
        console.log(`path does not exist`);
        res.send(200);
    } else {
        console.log(`path exists`);
        fs.rmdir(vpath, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
            res.send(200);
            console.log(`${vpath} is deleted!`);
        });
    }
})

const mkkeys = (language, password, amount) => {
    return new Promise((resolve, reject) => {
        const cmd = `/usr/src/app/scripts/mkkeys.sh "${language}" "${password}" ${amount}`;
        console.log(`Running ${cmd}`);
        const child = exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return reject(error.message);
            }
            if (stderr) {
                return reject(stderr);
            }
            return resolve(stdout);
        });
        child.stdout.on('data', function(data) {
            console.log(data.toString()); 
        });
    });

}

server.listen(82, function () {
    console.log("%s listening at %s", server.name, server.url);
});
