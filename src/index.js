const gol = require("./gol")
const { client } = require("./client")
const commands = {
	ping(args) {
		client.chat.send("Pong!")
	},
}
client.unsafe = true
client.on("join", () => {
	console.log("Ready")
	client.chat.send("/pass Clicktastic")
	client.chat.send("/nick Z's awesome bot")
	client.world.move(416, 144)
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
