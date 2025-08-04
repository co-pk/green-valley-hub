const sendPostRequest = async (url: string, data: any) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

export const sendSmsMessage = async (
  phoneNumbers: string[] | string,
  message: string,
  key: string,
  sender: string = "GreenValley"
) => {
  // Ensure phoneNumbers is an array
  const recipientArray = Array.isArray(phoneNumbers)
    ? phoneNumbers
    : [phoneNumbers];

  const payload = {
    recipient: recipientArray,
    sender: sender,
    message: message,
    is_schedule: "false",
    schedule_date: "",
  };

  const response = await sendPostRequest(
    `https://api.mnotify.com/api/sms/quick?key=${key}`,
    payload
  );
  return response;
};
