const sgMail=require('@sendgrid/mail');//npm scope

const sendgridAPikey=process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridAPikey);


const sendWelcomeEmail=async (email,name)=>{

    await sgMail.send({
        to:email,
        from:"moayadkhader99@gmail.com",
        subject:"Welcome",
        text:`Welcome to our app, ${name}.we hope you will get a good experience with us`
    })
}

const sendCancelationEmail=async(email,name)=>{

    await sgMail.send({
        to:email,
        from:'moayadkhader99@gmail.com',
        subject:'canceling account',
        text:`Hi ${name} your account has been canceled as you wish`
    })
}

module.exports={
    sendWelcomeEmail,
    sendCancelationEmail
}