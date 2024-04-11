const { Body, Get, Put, Route, Security, Tags } = require("tsoa");
const { My_Controller } = require("./controller");
const { UserModel } = require("../models/user");
const ResponseHandler  = require("../../src/config/responseHandler");
const code = require("../../src/config/code");
const UserType = require("../types/userType");
const { userUpdateSchema } = require("../validations/user.alidation");

const response = new ResponseHandler();

/*@Tags("User Controller")
@Route("/user")
class UserController extends My_Controller {
    @Security(AUTHORIZATION.TOKEN)
    @Get("")
    async index() {
        try {
            let findUser = await UserModel.findMany();
            if (!findUser)
                return response.liteResponse(code.FAILD, "Error occurred during Finding ! Try again", null);

            return response.liteResponse(code.SUCCESS, "User found with success !", findUser);
        } catch (e) {
            return response.catchHandler(e);
        }
    }*/

    // @Put("edit")
    // @Security(AUTHORIZATION.TOKEN)
     const edit = async (req, res, next )=> {
         let body = req.body;

        try {
            const validate = new My_Controller().validate(userUpdateSchema, body);
            if (validate !== true)
                return res.send(
                    response.liteResponse(code.VALIDATION_ERROR, "Validation Error !", validate)
                ) ;

            let userData = body;
            console.log(userData)
            //found user
            const foundUser = await UserModel.findFirst({ where: { email: body.email } });
            if (!foundUser)
                return res.send(response.liteResponse(code.NOT_FOUND, 'User not found, Invalid email!'));

            const userUpdate = await UserModel.update({
                where: { id: foundUser.id },
                data: { ...userData }
            });
            if (!userUpdate)
                return res.send(response.liteResponse(code.FAILURE, "An error occurred, on user update. Retry later!", null));

            console.log("edit user Success");

            const user = {
                email: userUpdate.email,
                lastName: userUpdate.lastName,
                firstName: userUpdate.firstName
            };
            return res.send(response.liteResponse(code.SUCCESS, "User update with Success !", { user: user }));
        } catch (e) {
            return res.send(response.catchHandler(e));
        }
    }
// }

module.exports ={
     edit
}
