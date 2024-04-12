const { Vonage } = require('@vonage/server-sdk');

const vonage = new Vonage({
    apiKey: "7b4e8f0c",
    apiSecret: "testAuthApi1"
});


    let from = "Vonage APIs"
    let to = "237691877617"
    let text = 'A text message sent using the Vonage SMS API'

    async function  sendSMS() {
        await vonage.sms.send({to, from, text})
            .then(resp => {
                console.log('Message sent successfully');
                console.log(resp);
            })
            .catch(err => {
                console.log('There was an error sending the messages.');
                console.error(err);
            });
    }



    async function sendSmsData(smsData) {
        to = smsData.to
        from = smsData.from
        text = smsData.text
        sendSMS();
    }


module.exports = {
    sendSmsData
};
