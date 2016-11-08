var bcrypt = require('bcrypt');

function CryptrObject(encryption) {
    if (!(this instanceof CryptrObject)) {
        return new CryptrObject(encryption);
    }
    this.init(encryption);
}

// export module
module.exports = CryptrObject;

CryptrObject.prototype.init = function(encryption) {
    this.encryption = encryption;
};

CryptrObject.prototype.setPassword = function(password, callback) {
	bcrypt.genSalt(this.encryption.saltSize, function(err, salt) {
		if (err)
			return callback(err);

		bcrypt.hash(password, salt, function(err, hash) {
			return callback(err, hash);
		});
	});
};


CryptrObject.prototype.comparePassword = function(password, userPassword, callback) {
	bcrypt.compare(password, userPassword, function(err, isPasswordMatch) {
		if (err)
			return callback(err);
		return callback(null, isPasswordMatch);
	});
};