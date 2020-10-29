const {
  loadLedger,
  findUser,
  hasAlias
} = require('../utilities/ledger')
//const fs = require('fs-extra')

module.exports = async function ledger(message) {
  let alias = 'Jasper'
  let filter = 'discourse'
  const ledger = await loadLedger()
  const accounts = await ledger.accounts()
  const user = await findUser(accounts, message.author.id, 'discord')
  if(await hasAlias(user, alias, filter)) {
    message.reply(`Your account: ${alias} is already merged`)
  }
  message.reply('ledger stuff done')
}
