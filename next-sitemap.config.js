module.exports = {
  siteUrl: process.env.WEBSITE_URL || 'https://phantasy.bot',
  generateRobotsTxt: true, // (optional)
  exclude: ['/_debug/*', '/about', '/home'], // Exclude removed pages and redirect routes
}
