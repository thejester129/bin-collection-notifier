An app that gets push notifications to remind me to put out the bins before the day they get collected.

Front End App using Expo Go - basically just registers as a listener for push notifications from server. Doesnt need to do anything else after its been installed and opened once.

Backend using an AWS Lambda function with an EventBridge rule that tickles the lambda everyday at a specified time to check if there are any bins collected tomorrow, and send a notification if so.

Notifications managed through Expo rather than directly through Firebase etc.

https://docs.expo.dev/push-notifications/overview/

https://docs.expo.dev/push-notifications/sending-notifications/

https://github.com/expo/expo-server-sdk-node

https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/RunLambdaSchedule.html
