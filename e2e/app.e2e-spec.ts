import { WebComponentPage } from './app.po';

describe('web-component App', () => {
  let page: WebComponentPage;

  beforeEach(() => {
    page = new WebComponentPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
