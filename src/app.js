const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const path = require("path");
const hbs = require('hbs');
const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");
const server = require("http").createServer(app);
const io = require('socket.io')(server);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set("view engine" , "hbs");
app.set("views", templatePath);
app.use(express.static(staticPath));
hbs.registerPartials(partialPath);


io.on("connection", (socket)=>{
    socket.on("join-room" , (room,name,cb)=>{

            var roster = io.sockets.adapter.rooms.get(room)
            socket.to(room).emit("received-notification", `${name} Joined`, io.sockets.adapter.rooms.get(room) ? io.sockets.adapter.rooms.get(room).size + 1 : 1);
            socket.join(room)
            cb({status : true , room , participants : roster ? roster.size : 1})
        
        // socket.to(room).emit("received-message", room , async(res)=>{
            
        // })
    })

    socket.on("send-message", (room,name,message,cb)=>{
        socket.to(room).emit("received-message", name , message)
    })

    socket.on("typing", (room,name)=>{
        socket.to(room).emit("typing-notificaiton", name)
    })
})
app.get("/" , (req,res)=>{
    try {
        res.render("index")
    } catch (error) {
        res.send(error)   
    }
})

server.listen(port, ()=>{
    console.log("Conection is established at " + port);
})