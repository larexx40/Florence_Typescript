//6 digit number by default
export const generateVerificationOTP = (digits: number = 6) => {
    let otp = "";
    for (let i = 0; i < digits; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return parseInt(otp);
}