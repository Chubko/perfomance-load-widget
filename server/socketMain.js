//Where socket.io listeners and (most) emitters

const socketMain = (io, pid) => {
    io.on("connection", (socket) => {
        let machineMacA;
        const auth = socket.handshake.auth;

        if (auth.token === "ghfjdse7r8fehfhw87rni09okl") {
            //valid nodeClient
            socket.join("nodeClient"); //this client is a nodeClient, put in appropriate room
        } else if (auth.token === "689iuhff7uik") {
            //valid reactClient
            socket.join("reactClient"); //this client is a reactClient, put in appropriate room
        } else {
            //you do not belong here. Go away!
            socket.disconnect();
            console.log("YOU HAVE BEEN DISCONNECTED!!!");
        }
        console.log(`Someone connected on worker ${process.pid }`);
        socket.emit("welcome", "welcome to cluster");

        socket.on("perfData", data => {
            if (!machineMacA) {
                machineMacA = data.macA;
                io.to("reactClient").emit("connectedOrNot", { machineMacA, isAlive: true });
            }
            io.to("reactClient").emit("perfData", data);
        });

        socket.on("disconnect", (reason) => {
            //a nodeClient just disconnected. Let the front end know!
            io.to("reactClient").emit("connectedOrNot", { machineMacA, isAlive: false });
        });
    });
};

module.exports = socketMain;
