const root = document.getElementById("root")

const socket = io()

socket.on("title", (msg) => {
	document.title = msg
})

socket.on("update", (msg) => {
	root.innerHTML = msg
})
