// Filename - index.js

// Requiring module
const bcrypt = require('bcrypt')

const password = 'pass123';
let hashedPassword;

// Encryption of the string password
bcrypt.genSalt(10, function (err, Salt) {
    console.log({ Salt })
    // The bcrypt is used for encrypting password.
    bcrypt.hash(password, Salt, function (err, hash) {

        if (err) {
            return console.log('Cannot encrypt');
        }

        hashedPassword = hash;
        console.log(hash);

        bcrypt.compare(password, hashedPassword,
            async function (err, isMatch) {

                // Comparing the original password to
                // encrypted password
                if (isMatch) {
                    console.log('Encrypted password is: ', password);
                    console.log('Decrypted password is: ', hashedPassword);
                }

                if (!isMatch) {

                    // If password doesn't match the following
                    // message will be sent
                    console.log(hashedPassword + ' is not encryption of '
                        + password);
                }
            })
    })
})
