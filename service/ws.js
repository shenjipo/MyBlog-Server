const WebSocket = require('ws')

const server = new WebSocket.Server({ port: 3001 })

let currOnoline = new Map()
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

            switch (message.actionName) {
                case 'count':
                    mp.set(ws, message.username)
                    if (currOnoline.get(message.username)) {
                        currOnoline.set(message.username, {
                            count: currOnoline.get(message.username).count + 1
                        })

                    } else {
                        currOnoline.set(message.username, {
                            count: 1
                        })
                    }


                    interval && clearInterval(interval)
                    interval = setInterval(() => {
                        console.log(currOnoline)
                        broadcastMessage(Array.from(currOnoline.keys()), 'count')
                    }, 1000)

                    break
                default:
                    break
            }


        } catch (err) {
            console.log('ws数据解析失败', err)
        }
    });

    ws.on('close', (code, msg) => {
        let username = mp.get(ws)
        currOnoline.set(username, { count: --currOnoline.get(username).count })
        console.log(currOnoline, username)
        if (currOnoline.get(username).count === 0) {
            currOnoline.delete(username)
        }

    });
})


module.exports = server
