const { client } = require("./client")
const commands = {
	ping(args) {
		client.chat.send("Pong!")
	},
	eval(args, rawMsg) {
		if (rawMsg.indexOf("Z man") === -1) {
			client.chat.send("Hey! You must be Z to use >eval")
		}
		let result
		try {
			result = eval(args.join(" "))
		} catch (err) {
			result = err
		}
		client.chat.send(`Eval result: ${result}`)
	},
}
client.unsafe = true
client.on("join", () => {
	console.log("Ready")
	client.chat.send("/pass Clicktastic")
	client.chat.send("/nick Z's awesome bot")
	client.world.move(416, 144)
	require("./gol")
})
client.on("message", rawMsg => {
	let msg = rawMsg.split(": ")
	msg.shift()
	msg = msg.join(": ")
	if (msg.startsWith(">")) {
		const args = msg.substr(1).split(" ")
		const command = args.shift()
		if (command in commands) commands[command](args, rawMsg)
	}
})
