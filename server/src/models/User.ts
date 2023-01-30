const sequelize = require('../db');
import {DataTypes, Op} from 'sequelize';

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    login: {type: DataTypes.STRING, unique: true, allowNull: false},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    firstName: {type: DataTypes.STRING, allowNull: false},
    lastName: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: 'USER', allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    isDeleted: {type: DataTypes.BOOLEAN, defaultValue: false},
    isBanned: {type: DataTypes.BOOLEAN, defaultValue: false},
});
const getUsers = async (login?: string, email?: string, firstName?: string, lastName?: string,
                        role?: string, isDeleted = false, isBanned = false) => {
    let where: {login?: {}, email?: {}, firstName?: {}, lastName?: {}, role?: {}, isDeleted?: {}, isBanned?: {}} = {};

    if (login) {
        where.login = {
            [Op.like]: `%${login}%`
        }
    }
    if (email) {
        where.email = {
            [Op.like]: `%${email}%`
        }
    }
    if (firstName) {
        where.firstName = {
            [Op.like]: `%${firstName}%`
        }
    }
    if (lastName) {
        where.lastName = {
            [Op.like]: `%${lastName}%`
        }
    }
    if (role) {
        where.role = {
            [Op.like]: `%${role}%`
        }
    }
    where.isDeleted = isDeleted;
    where.isBanned = isBanned;

    return User.findAll({where});
}

export default User;
export {
    User,
    getUsers
}