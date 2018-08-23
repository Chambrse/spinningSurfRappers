
exports.twitter = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

exports.indico = {
    api_key: process.env.INDICO_API_KEY
};

exports.google = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
}

exports.IBM = {
    IBMUsername: process.env.IBM_USERNAME,
    IBMPassword: process.env.IBM_PASSWORD
}