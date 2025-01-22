const root = document.getElementById("root")

const socket = io()

socket.on("update", (msg) => {
	root.innerHTML = msg
})
