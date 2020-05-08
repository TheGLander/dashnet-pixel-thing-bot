const { client, saveImg, writeImg } = require("./client")
const commands = {
	ping(args) {
		client.chat.send("Pong!")
	},
	async clone(args) {
		args = args.splice(0, 3)
		for (const i in args) {
			try {
				args[i] = JSON.parse(args[i])
			} catch {
				client.chat.send("Malformed input")
				return
			}
			if (!(args[i] instanceof Array) || args[i].length !== 2) {
				client.chat.send("Malformed input")
				return
			}
		}
		if (args.length !== 3) {
			client.chat.send("Malformed input")
			return
		}
		await writeImg(args[2], await saveImg(args[0], args[1]))
	},
	async eval(args, rawMsg) {
		if (rawMsg.indexOf("Z man") === -1) {
			client.chat.send("Hey! You must be Z to use >eval")
		}
		let result
		try {
			result = await eval(`(async () => ${args.join(" ")})()`)
		} catch (err) {
			result = err
		}
		client.chat.send(`Eval result: ${result}`)
	},
}
client.unsafe = true
globalThis.cUtils = require("./client")
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
