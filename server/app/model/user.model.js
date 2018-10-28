'use strict';

module.exports = (sequelize, DataType) => {
    return sequelize.define('User', {
        ID: {
            type: DataType.STRING,
            unique: true,
            primaryKey: true,
            allowNull: false
        },
        FIRST_NAME: {
            type: DataType.STRING
        },
        LAST_NAME: {
            type: DataType.STRING
        },
        EMAIL: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        PASSWORD: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                min: 8
            }
        },
        SALT: {
            type: DataType.BLOB
        },
        PROVIDER: {
            type: DataType.STRING
        },
        PROVIDER_ID: {
            type: DataType.STRING
        },
        PROVIDER_DATA: {
            type: DataType.STRING
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE
    });
};