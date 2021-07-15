const http = require('http');
const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require('mongoose');
const dbConfig = require("./config/dbConfig");

const hostname = '127.0.0.1';
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.json({ message: "Server Running" });
});

// socket connection for video call
const server = http.createServer(app);

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());

io.on("connection", (socket) => {

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("messageSent", () => {
		socket.broadcast.emit("updateChat")
	});

	socket.on("contactListUpdated", () => {
		socket.broadcast.emit("updateContact")
	});

	socket.on("callUser", ({ userToCall, signalData, from, myName, myUserId, myAvatar }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, myName, myUserId, myAvatar });
	});

	socket.on("answerCall", ({to, signal, myName, myId, myAvatar}) => {
		io.to(to).emit("callAccepted", {signal, myName, myId, myAvatar})
	});

	socket.on("rejectCall", (data) => {
		io.to(data.to).emit("callRejected")
	});
});

// connecting to mongoDB Atlas
mongoose.connect(
	`mongodb+srv://${dbConfig.USER}:${dbConfig.PASS}@cluster0.g6xp9.mongodb.net/${dbConfig.DB}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

app.use('/api/', require('./routes'));

server.listen(PORT, hostname, () => {
  console.log(`Server running at http://${hostname}:${PORT}/`);
});