const owop = require("better-owop-js")
const client = new owop.Client({
	reconnect: true,
	ws: "ws://dashnetpixels.duckdns.org/",
	controller: true,
	log: false,
})
const commands = {
	ping(args) {
		client.chat.send("Pong!")
	},
}

client.unsafe = true
client.on("join", () => {
	client.chat.send("/pass Clicktastic")
	client.chat.send("/nick Z's awesome bot")
})
client.on("message", rawMsg => {
	let msg = rawMsg.split(": ")
	msg.shift()
	msg = msg.join(": ")
	if (msg.startsWith(">")) {
		const args = msg.substr(1).split(" ")
		if (args[0] in commands) commands[args[0]](args)
	}
})
