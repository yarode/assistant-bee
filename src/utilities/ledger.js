const sc = require('sourcecred').default
//const fs = require('fs-extra')
const request = require('request-promise')

const Ledger = sc.ledger.ledger.Ledger

const NodeAddress = sc.core.address.makeAddressModule({
  name: 'NodeAddress',
  nonce: 'N',
  otherNonces: new Map().set('E', 'EdgeAddress'),
})

async function loadLedger() {
  const ledgerJSON = await request.get('https://raw.githubusercontent.com/1Hive/pollen/master/data/ledger.json')
  const ledger = await Ledger.parse(ledgerJSON)
  return ledger
}

async function getAliases(user, filter) {
  const aliases = user.identity.aliases.filter(
    alias => {
      const parts = NodeAddress.toParts(alias.address)
      return parts.indexOf(filter) > 0
    },
  )
  return aliases
}

async function hasAlias(user, username, filter) {
  let res = false
  console.log(user)
  const aliases = await getAliases(user, filter)
  if(!aliases.length) return res

  let id
  aliases.forEach(alias => {
    id = NodeAddress.toParts(alias.address)[4]

    if(id === username) {
      res = true
    }
  })
  return res
}

async function findUser(accounts, userId, filter) {
  let user
  for(let i = 0; i < accounts.length; i++) {
    if(accounts[i].identity.subtype !== 'USER') continue

    const aliases = await getAliases(accounts[i], filter)
    if(!aliases.length) continue

    let id
    aliases.forEach(alias => {
      id = NodeAddress.toParts(alias.address)[4]

      if(id === userId) {
        user = accounts[i]
      }
    })
  }
  return user
}

module.exports = { loadLedger, findUser, getAliases, hasAlias }
