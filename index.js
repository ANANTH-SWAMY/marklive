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

let args = minimist(process.argv.slice(2))

const PORT = 7000

if (args["_"].length > 1) {
	console.log(
		"\n",
		chalk.bgRedBright.bold.black(" ERR ")
		,"More than one file given",
		"\n"
	)
	process.exit(1)
}

if (args["_"].length == 0) {
	process.exit(1)
}

const filepath = path.join(__dirname, args["_"][0])

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const watcher = chokidar.watch(filepath)

const update = async () => {
	let file = fs.readFileSync(filepath).toString()
	io.emit("update", markdownit().render(file))
}

app.use(express.static(path.join(__dirname, 'public')))

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"))
})

io.on("connection", async (socket) => {
	await update()
})

watcher.on("change", async () => {
	await update()
})

server.listen(PORT, () => {
	console.log(
		"\n ",
		chalk.bgGreen.black.bold(" Serving at "),
		chalk.cyan("http://localhost:") + chalk.cyan.bold(`${PORT}`)
	)
})
