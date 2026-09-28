const colors = require("./colors")
const express = require("express")
const fs = require("fs")
const http = require("http")
const { md } = require("./markdown")
const path = require("path")
const prints = require("./prints")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const updateTitle = (filepath) => {
	io.emit("title", path.basename(filepath))
}

const update = (filepath) => {
	const file = fs.readFileSync(filepath).toString()
	io.emit("update", md.render(file))
}

const fileServer = (filepath) => {
	const resolvedFilepath = path.resolve(filepath)
	const markdownBasename = path.basename(resolvedFilepath)

	app.use(express.static(path.join(__dirname, "..", "public")))

	app.get(`/${markdownBasename}`, (req, res) => {
		res.sendFile(resolvedFilepath)
	})

	app.get("/", (req, res) => {
		res.sendFile(path.join(__dirname, "..", "index.html"))
	})

	const listen = (port) => {
		io.on("connection", (socket) => {
			updateTitle(filepath)
			update(filepath)
		})

		try {
			server.listen(port, () => {

					prints.printServing(port)

			}).on("error", (err) => {

				if (err.code === "EACCES") {
					prints.printError("Permission denied")
				} else if (err.code === "EADDRINUSE") {
					prints.printError("Port in use")
				}

				process.exit(1)
			})

		} catch(err) {

			if (err.code === "ERR_SOCKET_BAD_PORT") {
				prints.printError("Invalid port number")
			}

			process.exit(1)
		}
	}

	return {
		listen: listen
	}
}


module.exports = {
	updateTitle,
	update,
	fileServer,
}
