const Page = require('./helpers/page');
let page;
//creates a new broswer window and tab
beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterEach (async () => {
  await page.close();
});

describe('when logged in', async () => {

  beforeEach( async () => {
      await page.login();
      await page.click('a.btn-floating');
  });
  test('when logged in, can see blog create form', async () => {
      const label = await page.getContentsOf('form label');
      expect(label).toEqual('Blog Title');
  });
})
