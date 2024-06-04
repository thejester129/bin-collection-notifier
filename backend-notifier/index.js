const fetch = require("node-fetch");
const { Expo } = require("expo-server-sdk");

exports.handler = async (event) => {
  const EXPO_PUSH_TOKEN = process.env.EXPO_PUSH_TOKEN;
  let expo = new Expo();
  // Check that all your push tokens appear to be valid Expo push tokens
  if (!Expo.isExpoPushToken(EXPO_PUSH_TOKEN)) {
    console.error(
      `Push token ${EXPO_PUSH_TOKEN} is not a valid Expo push token`
    );
    return;
  }
  try {
    const BASE_URL = "https://www.falkirk.gov.uk/bin-calendar";
    const CUSTOM_ID = "uprn=136065096";

    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split("T")[0];
    const url = `${BASE_URL}?${CUSTOM_ID}&start=${tomorrowFormatted}&end=${tomorrowFormatted}`;

    console.log("Sending request for " + tomorrowFormatted + " at " + url);

    const response = await fetch(url);
    const results = await response.json();

    console.log("Results: " + JSON.stringify(results));

    // Time to put out some bins
    const binsToPutOut =
      results &&
      results
        .map((x) => x.title)
        .reduce((prev, current) => {
          if (prev) {
            return prev + ", " + current;
          } else {
            return current;
          }
        }, "");

    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    const message = {
      to: EXPO_PUSH_TOKEN,
      sound: "default",
      title: "HAW",
      body:
        results && results.length
          ? `Better put out the ${binsToPutOut} for tomorrow!`
          : "No bins to put out. Enjoy staying inside :)",
      data: { color: "ffffff" },
    };

    if (results && results.length) {
      console.log("Sending expo notification");
      await expo.sendPushNotificationsAsync([message]);
    }
  } catch (e) {
    console.log(e);
    const message = {
      to: EXPO_PUSH_TOKEN,
      sound: "default",
      title: "Ru-oh",
      body:"Error fetching bin data",
      data: { color: "ffffff" },
    };

    await expo.sendPushNotificationsAsync([message]);
  }
};
