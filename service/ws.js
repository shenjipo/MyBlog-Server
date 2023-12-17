const WebSocket = require('ws')

const server = new WebSocket.Server({ port: 3001 })

let currOnoline = []
let interval
let mp = new Map()
const broadcastMessage = (message, actionName) => {
    // 广播消息给所有客户端
    server.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                code: 200,
                data: message,
                actionName
            }));
        }
    });
}

server.on('connection', (ws, req) => {
    const ip = req.connection.remoteAddress;
    const port = req.connection.remotePort;
    const clientName = ip + port;


    ws.on('message', function incoming(message) {
        try {
            message = JSON.parse(message)
            console.log('received: %s from %s', message, clientName);
            switch (message.actionName) {
                case 'count':
                    currOnoline.push(message.username)
                    mp.set(ws, message.username)
                    interval && clearInterval(interval)
                    interval = setInterval(() => {
                        broadcastMessage(currOnoline, 'count')
                    }, 1000)

                    break
                default:
                    break
            }


        } catch {
            console.log('ws数据解析失败')
        }
    });

    ws.on('close', (code, msg) => {
        let username = mp.get(ws)
        currOnoline = currOnoline.filter(item => item !== username)
    });
})


module.exports = server
