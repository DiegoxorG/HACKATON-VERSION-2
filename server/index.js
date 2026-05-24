const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })

const app = express()
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }))
app.use(express.json())

app.post('/api/claude', async (req, res) => {
  const { systemPrompt, userMessage, history = [] } = req.body
  if (!userMessage) return res.status(400).json({ error: 'userMessage is required' })

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt || 'Eres FinConfia, un asistente financiero empatico.',
        messages: [...history, { role: 'user', content: userMessage }]
      })
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(response.status).json({ error: err.error?.message || 'API error' })
    }

    const data = await response.json()
    res.json({ reply: data.content[0].text })
  } catch (err) {
    console.error('[FinConfia backend error]', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.get('/health', (_, res) => res.json({ status: 'ok', model: 'claude-sonnet-4-20250514' }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`FinConfia backend ready on port ${PORT}`))
