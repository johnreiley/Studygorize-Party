"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const registerEvents_1 = __importDefault(require("./socket/registerEvents"));
let OPTIONS = {};
const app = express_1.default();
const server = require('http').Server(app);
if (process.env.NODE_ENV !== 'production') {
    OPTIONS = {
        cors: {
            origin: "http://localhost:4200",
            methods: ["GET", "POST"]
        }
    };
}
else {
    OPTIONS = {
        cors: {
            origin: "https://studygorize.web.app",
            methods: ["GET", "POST"]
        }
    };
}
const io = new socket_io_1.Server(server, OPTIONS);
app.use('/static', express_1.default.static(path_1.default.join(__dirname, '../../client/build//static')));
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: path_1.default.join(__dirname, '../../client/build/') });
});
io.on('connection', (socket) => {
    console.log(`A user connected at socket ${socket.id}`);
    registerEvents_1.default(io, socket);
});
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
//# sourceMappingURL=index.js.map