export default async function handler(req, res) {
  try {
    // Mock successful response
    const mockResponse = {
      id: 'mock-deal-id',
      properties: {
        dealname: 'Mock Deal',
        pipeline: 'default',
        dealstage: 'appointmentscheduled',
        amount: '1000',
        dealtype: 'newbusiness',
        createdate: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log('Mock deal created:', mockResponse)

    // Return a successful response with mock data
    res.status(200).json(mockResponse)
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error })
  }
}
