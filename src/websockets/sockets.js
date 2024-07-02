import { Ollama } from "ollama"
import { LLM_SERVER } from "../config/config.js"

const ollama = new Ollama({ host: LLM_SERVER })

export const sockets = io => {
  io.on('connection', (socket) => {
    console.log('user connected', socket.user)

    socket.on('chatbot', async (message) => {
      console.log(`user ${socket.user} say ${message}`)
      try {
        const botResponse = await ollama.chat({
          model: 'medic-bot',
          messages: [{ role: 'user', content: message }]
        })

        socket.emit('bot', botResponse.message.content)
      } catch (error) {
        console.log(error)
        socket.emit('bot', 'Ha ocurrido un error. Por favor pruebe de nuevo en unos momentos')
      }
    })

    socket.on('disconnect', () => {
      console.log('user disconnect')
    })
  })
}