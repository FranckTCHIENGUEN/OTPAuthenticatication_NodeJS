

const UserType = {
    userCreateFields: {
        firstName: "string",
        lastName: "string",
        email: "string",
        phoneNumber: "string",
        region: "string",
    },
    userUpdateFields: {
        firstName: "string",
        lastName: "string",
        email: "string",
    },
    // verifiedFields: {
    //     new_password: "string",
    //     email: "string",
    //     token: "string",
    // },
    loginFields: {
        email: "string",
    },
    // changePasswordFields: {
    //     email: "string",
    //     oldPassword: "string",
    //     newPassword: "string",
    // },
    verifyOtp: {
        email: "string",
        otp: "string",
    },
    resendOtp: {
        email: "string",
    },
};

module.exports = UserType;
