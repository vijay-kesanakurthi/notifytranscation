import * as PushAPI from "@pushprotocol/restapi";
const getSubscriptions = async (address: String) => {
  const subscriptions = await PushAPI.user.getSubscriptions({
    user: `eip155:5:${address}`, // user address in CAIP
    env: "staging",
  });
  console.log(subscriptions);
  return subscriptions;
};

const channelData = async (address: String) => {
  const details = await PushAPI.channels.getChannel({
    channel: `eip155:5:${address}`, // channel address in CAIP
    env: "staging",
  });
  console.log(details);
  return details;
};

export { getSubscriptions, channelData };
