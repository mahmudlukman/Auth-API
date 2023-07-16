import nodemailer from 'nodemailer'

export const generateOTP = () => {
  let otp = ''
  for(let i = 0; i <= 3; i++){
    const randVal = Math.round(Math.random() * 9)
     otp = otp + randVal
  }
  return otp
}

export const mailTransport = () => nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD
  }
});

export const generateEmailTemplate = code => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <style>
        @media only screen and (max-width: 620px){
          h1{
            font-size: 20px;
            padding: 5px;
          }
        }
        </style>
      </head>
      <body>
        <div style="max-width: 620px; margin: 0 auto; font-family: sans-serif; color: #272727">
          <h1 style="background: #f6f6f6; padding: 10px; text-align: center; color: #272727;">
            We are delighted to welcome you to our team!
          </h1>
          <p>Please Verify your email to continue. Your verification code is:</p>
          <p style="width: 80px; margin: 0 auto; font-weight: bold; text-align: center; background: #f6f6f6; border-radius: 5px; font-size: 25px;">${code}</p>
        </div>
      </body>
    </html>
  
  `
}

export const plainEmailTemplate = (heading, message) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <style>
      @media only screen and (max-width: 620px){
        h1{
          font-size: 20px;
          padding: 5px;
        }
      }
      </style>
    </head>
    <body>
      <div style="max-width: 620px; margin: 0 auto; font-family: sans-serif; color: #272727">
        <h1 style="background: #f6f6f6; padding: 10px; text-align: center; color: #272727;">
          ${heading}
        </h1>
        <p style="text-align: center; color: #272727;">${message}</p>
      </div>
    </body>
  </html>
  `
}
