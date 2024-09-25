const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    profilePicture: { type: String },
    roles: [{ type: String, enum: ['admin', 'editor', 'viewer'] }],
    permissions: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    lastLogin: { type: Date },
    bio: { type: String },
    phoneNumber: { type: String },
    passwordChangedAt: Date,
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String }
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("passwordHash")) return next();
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    if (this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next()
})

userSchema.pre("findOneAndUpdate", async (next) => {
    if (this._update?.passwordHash) {
        const hashed = await bcrypt.hash(this._update.passwordHash, 12);
        this._update.passwordHash = hashed;
        this._update.passwordChangedAt = Date.now() - 1000;
    }
    next();
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = async (JWTTimestamp) => {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = async (next) => {
    const otp = crypto.randomInt(1000, 9999).toString();
    this.passwordResetToken = crypto.createHash('sha256').update(otp).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return otp;
}

module.exports = mongoose.model('User', userSchema);
