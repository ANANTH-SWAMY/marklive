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

const fileServer = (filepath, pdf) => {
	app.use(express.static(path.join(__dirname, "..", "public")))
	app.use(express.static(path.dirname(path.resolve(filepath))))

	app.get("/", (req, res) => {
		res.sendFile(path.join(__dirname,  "..", "index.html"))
	})

	const listen = (port) => {
		io.on("connection", (socket) => {
			updateTitle(filepath)
			update(filepath)
		})

		try {
			server.listen(port, () => {

				if (!pdf) {
					prints.printServing(port)
				}

			}).on("error", (err) => {

				if (err.errno === -13) {
					prints.printError("Permission denied")
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
