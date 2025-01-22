#! /usr/bin/env node

const chalk = require("chalk")
const chokidar = require("chokidar")
const express = require("express")
const fs = require("fs")
const http = require("http")
const markdownit = require("markdown-it")
const minimist = require("minimist")
const path = require("path")
const { Server } = require("socket.io")

const printError = (err) => {
	console.log(
		"\n",
		chalk.bgRedBright.bold.black(" ERROR "),
		err,
		"\n"
	)
}

let args = minimist(process.argv.slice(2))

if (args["port"] == true) {
	printError("Missing port number")

	process.exit(1)
}

const PORT = args["port"] || 7000

if (args["_"].length > 1) {
	printError("More than one file given")

	process.exit(1)
}

if (args["_"].length === 0) {
	process.exit(1)
}

const filepath = path.join(__dirname, args["_"][0])

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const watcher = chokidar.watch(filepath)

const updateTitle = () => {
	io.emit("title", args["_"][0])
}

const update = () => {
	let file = fs.readFileSync(filepath).toString()
	io.emit("update", markdownit().render(file))
}

app.use(express.static(path.join(__dirname, 'public')))

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"))
})

io.on("connection", (socket) => {
	updateTitle()
	update()
})

watcher.on("change", async () => {
	update()
})

try {
	server.listen(PORT, () => {

		console.log(
			"\n ",
			chalk.bgGreen.black.bold(" Serving at "),
			chalk.cyan("http://localhost:") + chalk.cyan.bold(`${PORT}`),
			"\n"
		)

	}).on("error", (err) => {

		if (err.errno === -13) {
			printError("Permission denied")
		}

		process.exit(1)
	})

} catch(err) {
	if (err.code === "ERR_SOCKET_BAD_PORT") {
		printError("Invalid port number")
	}

	process.exit(1)
}

// help
// highlight
// markdownit-checkbox
// markdownit-emoji
// pdf
