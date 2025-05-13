/**
 * POST /api/submit
 * Handles contact form submissions
 */
export async function onRequestPost(context) {
  try {
    // Parse form data from the request
    const formData = await context.request.formData()

    // Convert FormData to a structured object
    // This handles multiple values per key (like checkboxes)
    const formValues = {}
    for (const [key, value] of formData.entries()) {
      if (formValues[key] === undefined) {
        formValues[key] = value
      } else {
        formValues[key] = Array.isArray(formValues[key])
          ? [...formValues[key], value]
          : [formValues[key], value]
      }
    }

    // You can process the form data here
    // For example, send it to an email service or database

    // Log the submission (in development)
    console.log('Form submission received:', formValues)

    // Return a success response
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
  } catch (err) {
    // Return an error response
    console.error('Error processing form submission:', err)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error processing form submission',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      },
    )
  }
}
