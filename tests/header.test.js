const puppeteer = require('puppeteer');

// test('Adds two numbers', () => {
//     const sum = 1 + 2;
//     expect(sum).toEqual(3);
// });

let browser, page;

beforeEach( async () =>{
  browser = await puppeteer.launch({
    headless: false
  });
  page = await browser.newPage();
  await page.goto('localhost:3000');
})

afterEach( async () => {
  await browser.close();
});

test('The header has the correct text', async () => {
    // const browser = await puppeteer.launch({
    //   headless: false
    // });
    // const page = await browser.newPage();
    // await page.goto('localhost:3000');

    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster');
});


test('clicking login starts oauth flow', async () => {
  await page.click('.right a');
  const url = await page.url();
  // console.log(url);
  expect(url).toMatch(/accounts\.google\.com/);


});

test('when signed in, shows logout button', async () => {
  const id = '5b672e9a5aeb420ca19b7528';
  // const Buffer = require('safe-buffer').Buffer;
  // const sessionObject = {
  //   passport: {
  //     user: id
  //   }
  // };
  //
  // const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString(
  //   'base64'
  // );
  // const Keygrip = require('keygrip');
  // const keys = require('../config/keys');
  // const keygrip = new Keygrip([keys.cookieKey]);
  // const sig = keygrip.sign('session=' + sessionString);

  // await console.log(sessionString, sig);
  // eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNWI2NzJlOWE1YWViNDIwY2ExOWI3NTI4In19
  // zYSfYZfJkkgRawUyYcb3lTnniVw

  await page.setCookie({ name: 'session', value: sessionString });
  await page.setCookie({ name: 'session.sig', value: sig });
  await page.goto('localhost:3000');
  await page.waitFor('a[href="/auth/logout"]');

  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  expect(text).toEqual('Logout');

});
