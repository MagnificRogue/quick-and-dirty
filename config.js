var config = {};

config.twitter = {};
  config.twitter.consumer_key    =  process.env.TWITTER_CONSUMER_KEY    || 'key';
  config.twitter.consumer_secret =  process.env.TWITTER_CONSUMER_SECRET || 'password';

config.reddit = {};
  config.reddit.client_id = process.env.REDDIT_ID || '';
  config.reddit.client_secret = process.env.REDDIT_SECRET || '';
  config.reddit.userAgent = process.env.REDDIT_USER_AGENT || '';
  config.reddit.refreshToken = process.env.REDDIT_REFRESH_TOKEN || '';

config.youtube = {};
  config.youtube.api_key = process.env.YOUTUBE_API_KEY || '';

config.mongo = {};
  config.mongo.url = process.env.MONGO_URL || '';

module.exports = config;
