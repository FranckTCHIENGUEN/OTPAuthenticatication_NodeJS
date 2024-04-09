// const { Body, Get, Post, Request, Route, Security, Tags } = require("tsoa");
const { My_Controller } = require("./controller");
const UserType = require("../types/userType");
const jwt = require("jsonwebtoken");
const {userCreateSchema } = require("../validations/user.alidation");
const {UserModel } = require("../models/user");
const ResponseHandler = require("../../src/config/responseHandler");
const code = require("../../src/config/code");
const { TokenModel } = require("../models/token");
const { otpModel } = require("../models/otp");
const { sendSmsData } = require("../../src/core/notification/sms/sendSms");

const response = new ResponseHandler();
const OTP_EXPIRATION_TIME = 3600*8; // 8 hours in seconds

// @Tags("Auth Controller")
// @Route("/auth")
// class AuthController extends My_Controller {

    // @Post('login')
  const login = async(req, res, next ) =>{
      let body = req.body;
      console.log(body)
        try {
            const foundUser = await UserModel.findFirst({ where: { email: body.email } });
            console.log(await UserModel.findMany())
            if (!foundUser)
                return res
                    .send(response.liteResponse(code.NOT_FOUND, 'Invalid email')) ;

            /*const compare = bcrypt.compareSync(body.password, foundUser.password);
            if (!compare)
                return res.send( response.liteResponse(code.FAILURE, "Invalid login or password");*/

            const otp = generateOTP(foundUser.email);
            await sendOTP(foundUser, await otp);

            return res.send(response.liteResponse(code.SUCCESS, "OTP code was sent to your number")) ;
        } catch (e) {
          console.log(e)
            return res.send(response.catchHandler(e)) ;
        }
    }

   /* @Post('forgot_password')
    async forgotPassword(@Body() body) {
        try {
            const foundUser = await UserModel.findFirst({ where: { email: body.email } });
            if (!foundUser)
                return res.send( response.liteResponse(code.NOT_FOUND, 'Incorrect email');

            const otp = this.generateOTP(foundUser.email);
            await this.sendOTP(foundUser, await otp);

            return res.send( response.liteResponse(code.SUCCESS, "OTP code was sent to your email", { email: foundUser.email });
        } catch (e) {
            return res.send( response.catchHandler(e);
        }
    }
*/

    // @Post("verify-otp")
    const verifyOtp = async (req, res, next) => {
        let body = req.body;

        try {
            const foundUser = await UserModel.findFirst({ where: { email: body.email } });
            if (!foundUser)
                return res.send(response.liteResponse(code.NOT_FOUND, 'User not found, Invalid email !')) ;

            const foundOTP = await otpModel.findFirst({ where: { otp: body.otp, userEmail: body.email, use:false } });
            if (!foundOTP)
                return res.send(response.liteResponse(code.NOT_FOUND, "Incorrect OTP, try again !")) ;

            if (foundOTP.expiredIn < Math.round(new Date().getTime() / 1000))
                return res.send(response.liteResponse(code.FAILURE, "This OTP has expired. Resend OTP !")) ;

            const user={
                email:foundUser.email,
                lastName:foundUser.lastName,
                firstName:foundUser.firstName
        }

            const otpUpdate = await otpModel.update({
                where: { id: foundOTP.id },
                data: { use:true }
            });
            if (!otpUpdate)
                return res.send(response.liteResponse(code.FAILURE, "An error occurred. Retry later!", null)) ;


            const jwtToken = await generateToken(foundUser.id, foundUser.email, res);
            return res.send(response.liteResponse(code.SUCCESS, "Success request login", { user: user, token: jwtToken })) ;
        } catch (e) {
            console.warn(e)
            return res.send(response.catchHandler(e)) ;
        }
    }

    // @Post('resend-otp')
    const resendotp = async (req, res, next )  =>{

        let body = req.body;

        try {
            const foundUser = await UserModel.findFirst({ where: { email: body.email } });
            if (!foundUser)
                return res.send(response.liteResponse(code.NOT_FOUND, 'User not found, Invalid email')) ;

            await otpModel.deleteMany({
                where: {
                    userEmail: body.email,
                    expiredIn: { gt: Math.round(new Date().getTime() / 1000)}
                }
            });

            const otp = generateOTP(foundUser.email, res);
            await sendOTP(foundUser, await otp);

            return res.send(response.liteResponse(code.SUCCESS, "OTP code is resent", { otp })) ;
        } catch (e) {
            return res.send(response.catchHandler(e)) ;
        }
    }

   /* @Post('change_password')
    @Security(AUTHORIZATION.TOKEN)
    async changePassword(@Body() body) {
        try {
            let validate = this.validate(changePasswordSchema, body);

            if (body.oldPassword == null){
                validate = this.validate(changForgotePasswordSchema, body);
            }
            if (validate !== true)
                return res.send( response.liteResponse(code.VALIDATION_ERROR, "Validation Error !", validate);

            const foundUser = await UserModel.findFirst({ where: { email: body.email } });
            if (!foundUser)
                return res.send( response.liteResponse(code.NOT_FOUND, 'User not found, Invalid email!');

            if (body.oldPassword != null){
                if (!bcrypt.compareSync(body.oldPassword, foundUser.password))
                    return res.send( response.liteResponse(code.FAILURE, 'Invalid password!');
            }

            const updatedUser = await UserModel.update({
                data: { password: bcrypt.hashSync(body.newPassword, SALT_ROUND) },
                where: { id: foundUser.id }
            });

            if (!updatedUser)
                return res.send( response.liteResponse(code.FAILURE, 'Something went wrong, try Again !', null);

            return res.send( response.liteResponse(code.SUCCESS, "Your password is updated", null);
        } catch (e) {
            return res.send( response.catchHandler(e);
        }
    }
*/

    // @Post("register")
    const register = async (req, res, next )  =>{

        const body = req.body;
        try {
            const validate = new My_Controller().validate(userCreateSchema, body);
            if (validate !== true)
                return res.send(response.liteResponse(code.VALIDATION_ERROR, "Validation Error !", validate)) ;

            const existingUser = await UserModel.findFirst({
                where: {
                    OR:[
                        {
                            email: body.email
                        },
                        {
                            phoneNumber: body.phoneNumber
                        }
                    ]
                }
            });
            if (existingUser)
                return res.send(response.liteResponse(code.FAILURE, "Email or phone number already exists, try with another email")) ;

            // const hashedPassword = await bcrypt.hash(body.password, SALT_ROUND);
            const newUser = await UserModel.create({ data: { ...body} });

            if (!newUser)
                return res.send(response.liteResponse(code.FAILURE, "An error occurred while creating the user. Retry later!", null)) ;

            return res.send(response.liteResponse(code.SUCCESS, "User registered successfully !", newUser)) ;
        } catch (e) {
            console.warn(e)
            return res.send(response.catchHandler(e)) ;
        }
    }

    // @Get('logout')
    // @Security(AUTHORIZATION.TOKEN)
    const logout = async ( req, res)  =>{
        try {
            const authorization = req.headers['authorization'];
            const token = await TokenModel.findFirst({ where: { jwt: authorization.split(' ').pop() } });
            if (!token)
                return res.send(response.liteResponse(code.FAILURE, "Token not found", null)) ;

            const expiry = Math.round(new Date().getTime() / 1000) / 2;
            await TokenModel.update({ where: { id: token.id }, data: { expireIn: expiry } });

            return res.send( response.liteResponse(code.SUCCESS, "Logout successful !", null));
        } catch (e) {
            return res.send(response.catchHandler(e));
        }
    }

    const generateToken = async (user_id, email, res)  =>{
        const payload = { userId: user_id, email: email };
        const token = jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: '8h' });
        const decoded = jwt.decode(token);

        const savedToken = await TokenModel.create({
            data: { userId: user_id, jwt: token, expireIn: decoded.exp },
            select: { jwt: true }
        });

        if (!savedToken)
            return res.send(response.liteResponse(code.FAILURE, 'Something went wrong, try Again !', null)) ;

        return token;
    }

    const generateOTP = async (mail, res)  =>{
        // Implement OTP generation logic here
        const otp = new My_Controller().generate_otp(); // Example OTP generation (6 digits)
        const savedOtp = await otpModel.create({
            data: {
                otp: otp,
                expiredIn: (Math.round(new Date().getTime() / 1000)) + OTP_EXPIRATION_TIME,
                userEmail: mail,
                use:false
            }
        });

        if (!savedOtp)
            return res.send(response.liteResponse(code.FAILURE, 'Something went wrong, try Again !', null)) ;

        return otp;
    }

    const sendOTP = async (user, otp)  =>{
        const config = {
            to: user.region + user.phoneNumber,
            from: 'Digisoft',
            text: `your otp code is : ${otp}`
        };
        // await this.sendSms(config);
        console.log(`OTP sent to ${user.region}${user.phoneNumber}: ${otp}`);
    }
// }

module.exports = {
    login,
   logout,
    register,
    verifyOtp,
    resendotp
} ;
