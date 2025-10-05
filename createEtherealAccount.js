const nodemailer = require('nodemailer');

async function createTestAccount() {
  let testAccount = await nodemailer.createTestAccount();
  console.log('Ethereal Email Account Created:');
  console.log('User:', testAccount.user);
  console.log('Pass:', testAccount.pass);
}

createTestAccount().catch(console.error);
