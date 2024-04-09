const { Vonage } = require('@vonage/server-sdk');

const vonage = new Vonage({
    apiKey: "7b4e8f0c",
    apiSecret: "testAuthApi1"
});

class Sms {
    async sendSMS(to, from, text) {
        await vonage.message.sendSms(from, to, text)
            .then((resp) => {
                console.log('Message sent successfully');
                console.log(resp);
            })
            .catch((err) => {
                console.log('There was an error sending the messages.');
                console.error(err);
            });
    }

    async sendSms(smsData) {
        await this.sendSMS(smsData.to, smsData.from, smsData.text);
    }
}

module.exports = new Sms();
