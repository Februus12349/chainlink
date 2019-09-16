const pupExpect = require('expect-puppeteer')

module.exports = class PupHelper {
  constructor(page) {
    this.page = page
    this.page.on('console', msg => {
      console.log(`PAGE LOG url: ${page.url()} | msg: ${msg.text()}`)
    })
  }

  async clickLink(text) {
    await this.clickNavigationTag('a', text)
  }
  async clickButton(text) {
    await this.clickNavigationTag('button', text)
  }

  async clickNavigationTag(tagName, text) {
    // XXX: Some buttons/links don't do anything if you click them too quickly,
    // so for, now, add a small delay
    await this.page.waitFor(500)
    await pupExpect(this.page).toClick(tagName, { text })
  }

  async clickTransactionsMenuItem() {
    return pupExpect(this.page).toClick('li > a', { text: 'Transactions' })
  }

  async signIn(email = 'notreal@fakeemail.ch', password = 'twochains') {
    await pupExpect(this.page).toFill('form input[id=email]', email)
    await pupExpect(this.page).toFill('form input[id=password]', password)
    return pupExpect(this.page).toClick('form button')
  }

  async waitForNotification(notification) {
    const xpath = `//p[contains(text(), '${notification}')]`
    try {
      return await this.page.waitForXPath(xpath)
    } catch {
      throw `Unable to find notification: ${notification}`
    }
  }
}