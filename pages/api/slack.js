export default async function handler(req, res) {
  try {
    // Log the message that would have been sent to Slack
    console.log('Mock Slack Message:', JSON.parse(req.body))

    // Return a successful response
    const mockResponse = {
      ok: true,
      channel: 'mock-channel',
      ts: new Date().getTime() / 1000,
      message: {
        text: 'This is a mock message',
        username: 'mock-bot',
        bot_id: 'mock-bot-id',
        type: 'message',
      },
    }

    res.status(200).json(mockResponse)
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error })
  }
}
