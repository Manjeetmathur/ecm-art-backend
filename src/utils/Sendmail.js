import nodemailer from 'nodemailer'

const sendMail = (message,userEmail) => {
       try {
              const transport = nodemailer.createTransport({
                     service : "GMAIL",
                     auth : {
                            user : "kumanjeet779@gmail.com",
                            pass : "vuif omjc qvco dopd"
                     }
              })

              const mailOption = {
                     from :  "kumanjeet779@gmail.com",
                     to : userEmail,
                     subject : "From sketch with Manjeet ",
                     html : `<div>${message}</div>`
              }
              transport.sendMail(mailOption,(error,info) => {
                     if(error){
                            throw new Error('failed to order')
                     }
              })

       } catch (error) {
              console.log(error);
              
       }
}
export default sendMail