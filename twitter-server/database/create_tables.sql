CREATE TABLE IF NOT EXISTS tweets (
	tweet_id INT NOT NULL,
	tweet_text TEXT NOT NULL,
	created_at TEXT NOT NULL, 
	user_id INT NOT NULL,
	screen_name TEXT NOT NULL,
	name TEXT DEFAULT NULL,
	profile_image_url TEXT DEFAULT NULL,
	CONSTRAINT PK_tweets PRIMARY KEY (tweet_id ASC)
);

CREATE TABLE IF NOT EXISTS tweet_mentions (
	tweet_mention_id INT NOT NULL,
	source_user_id INT NOT NULL,
	target_user_id INT NOT NULL,
	CONSTRAINT PK_tweet_mentions PRIMARY KEY (tweet_mention_id ASC)
);

CREATE TABLE IF NOT EXISTS tweet_tags (
	tweet_tag_id INT NOT NULL,
	tag TEXT NOT NULL,
	CONSTRAINT PK_user PRIMARY KEY (tweet_tag_id ASC)
);

CREATE TABLE IF NOT EXISTS tweet_urls (
	tweet_url_id INT NOT NULL,
	url TEXT NOT NULL,
	CONSTRAINT PK_user PRIMARY KEY (tweet_url_id ASC)
);

CREATE TABLE IF NOT EXISTS users (
	user_id INT NOT NULL,
	screen_name TEXT NOT NULL,
	name TEXT DEFAULT NULL,
	profile_image_url TEXT DEFAULT NULL,
	email TEXT DEFAULT NULL,
	url TEXT DEFAULT NULL,
	description TEXT DEFAULT NULL,
	created_at TEXT NOT NULL,
	followers_count INT DEFAULT NULL,
	friends_count INT DEFAULT NULL,
	CONSTRAINT PK_user PRIMARY KEY (user_id ASC)
)