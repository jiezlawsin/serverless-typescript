import { db, getDBInstance, getTransaction } from "../db/db"
import { Status } from "../interfaces/statusType"
import { User } from "../models/User"
const { Op, Sequelize } = require('sequelize')

export class UserRepository {
    static async Find(sub: string, attributes: string[] = [], raw: boolean = true) {
        const DB: db = await getDBInstance()
        let user
        let props: any = {}
        if (sub) {
            props.where = {
                sub: sub
            }
            props.raw = raw
            let defaultExclude = ['loginAttemptsCounter', 'otpAttemptsCounter', 'otpToken', 'refreshToken', 'forgotPasswordtoken', 'confirmationtoken']
            props.attributes = { exclude: defaultExclude }
            if (attributes.length > 0) {
                props.attributes = attributes
            }
            user = await DB.User.findOne(props)
        }
        return user
    }


    static async UpdateUserEntity(sub: string, role: string, juridicalEntityId: number) {
        const DB: db = await getDBInstance();
        const tx = await getTransaction();

        let User = await DB.User.findOne({
            where: {
                sub: sub
            }
        })
        if (User) {
            User.role = role;
            User.juridicalEntityId = juridicalEntityId;
            User = await User.save({ transaction: tx })

            return User;
        }
        return false;
    }

    /**
    * Save Login Attempts
    * Increments the login attempts on call. Optional @reset param to set loginAttempts of @User to 0 
    * @param  userNameOrSub Optional. User sub indentifier or username
    * @param  reset Optional. If set to TRUE, sets the loginAttempts column of User to 0.
    * @param  attributes Optional. Default set to [sub, loginattempts], set the desired attributes in the returned user object
    * @param  maxFailedLogins Optional. max number of failed login attempts allowed. 
    * @param  userModel optional User Model from another repository function. 
    * @param  saveModel optional default to True, if False, the returned user object will not run the save() operation
    * @return User model
    */
    static async SaveLoginAttempts(
        userNameOrSub: string = '',
        reset: boolean = false,
        attributes: string[] = ['sub', 'loginAttemptsCounter', 'status'],
        maxFailedLogins: number = 0,
        userModel: any = null,
        saveModel: boolean = true) {
        const DB: db = await getDBInstance()

        let user: any = null;
        if (userNameOrSub && userNameOrSub != '') {
            if (userModel && userModel.sub) {
                user = userModel
            } else {
                const where: any = {
                    [Op.or]: [
                        {
                            userName: {
                                [Op.iLike]: userNameOrSub
                            }
                        },
                        {
                            sub: {
                                [Op.iLike]: userNameOrSub
                            }
                        }
                    ]
                }
                if (!attributes.includes('status')) attributes.push('status')
                user = await DB.User.findOne({
                    where,
                    attributes,
                })
            }
            const userStatus: Status = user && user.status !== undefined ? user.status : ''
            if (reset || (userStatus === 'Active' && user && user !== null && user.loginAttempts !== undefined)) {
                if (reset || (maxFailedLogins && maxFailedLogins <= 0)) {
                    // Reset Login Attempts
                    user.loginAttempts = 0;
                    user.otpAttemptsCounter = 0;
                    if (user.status === 'Locked') {
                        user.status = 'Active'
                    }
                } else {
                    // Increment user login attempts.
                    user.loginAttempts = user.loginAttempts + 1;
                    if (maxFailedLogins && maxFailedLogins > 0 && user.loginAttempts >= maxFailedLogins) {
                        user.status = 'Locked'
                    }
                }
                if (saveModel) {
                    await user.save();
                }
            }
        }

        return user;
    }
}