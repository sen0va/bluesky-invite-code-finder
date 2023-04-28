import request from 'request';
import { ETwitterStreamEvent, TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi("api token");
const rules = await client.v2.streamRules();
if (rules.data?.length) {
  await client.v2.updateStreamRules({
    delete: { ids: rules.data.map(rule => rule.id) },
  });
}

await client.v2.updateStreamRules({
  add: [{ value: 'bsky social' }],
});

const stream = await client.v2.searchStream({
  'tweet.fields': ['referenced_tweets', 'author_id'],
  expansions: ['referenced_tweets.id'],
});
// Enable auto reconnect
stream.autoReconnect = true;

const persons = [
  {
    "handle": "someone.bsky.social",
    "password": "password",
    "email": "email@address.com"
  }
];

const pattern = /bsky-social-[a-zA-Z0-9]+/;
stream.on(ETwitterStreamEvent.Data, async tweet => {
  console.log(tweet.data.text);
  const match = tweet.data.text.match(pattern);
  if (match) {
    console.log('code:', match[0]);
    
    request.post(
      'https://bsky.social/xrpc/com.atproto.server.createAccount',
      { json: {
          ...persons[0],
          "inviteCode": match[0]
      } },
      function (error, response, body) {
        console.log(error);
        console.log(body);
        if(body.did) {
          persons.shift();
          if(persons.length == 0) {
            process.exit(0);
          }
        }
      }
    );
  } else {
    console.log(`skipped(Remaining Persons: ${persons.length})`);
  }
  console.log("--------");
});