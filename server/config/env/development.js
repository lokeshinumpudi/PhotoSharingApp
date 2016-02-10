var port = 3000;

module.exports = {
    port: port,
    db: 'mongodb://127.0.0.1/instagram_app',
    corsorigin: 'http://localhost:8000',
    clientSecret: process.env.clientSecret || '',
    tokenSecret: process.env.tokenSecret || 'imlokis',
    sendgridApiKey: ''
}
