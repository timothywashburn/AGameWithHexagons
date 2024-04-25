const NameErrorType = Object.freeze({
    BAD_NAME: { code: 0x01, message: 'Illegal Name' },
    TOO_SHORT: { code: 0x02, message: 'Name Too Short (3 Characters Minimum)' },
    TOO_LONG: { code: 0x03, message: 'Name Too Long (30 Characters Maximum)' },
});


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { NameErrorType };
} else {
    window.NameErrorType = NameErrorType;
}
