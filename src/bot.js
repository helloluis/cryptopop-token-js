const Bot = require('./lib/Bot')
const SOFA = require('sofa-js')
const Fiat = require('./lib/Fiat')

let bot = new Bot()

// ROUTING

bot.onEvent = function(session, message) {
  switch (message.type) {
    case 'Init':
      welcome(session)
      break
    case 'Message':
      onMessage(session, message)
      break
    case 'Command':
      onCommand(session, message)
      break
    case 'Payment':
      onPayment(session)
      break
    case 'PaymentRequest':
      welcome(session)
      break
  }
}

function onMessage(session, message) {
  var msg = message.body.toLowerCase();
  if (msg=="more" || msg=="toon" || msg=="gimme") {
    toon(session)
  } else {
    welcome(session)  
  }
}

function onCommand(session, command) {
  switch (command.content.value) {
    case 'ping':
      pong(session)
      break
    case 'toon':
      toon(session)
      break
    case 'count':
      count(session)
      break
    case 'donate':
      donate(session)
      break
    }
}

function onPayment(session) {
  sendMessage(session, `Thanks for the payment! 🙏`)
}

// STATES

function welcome(session) {
  sendMessage(session, `Welcome to Cryptopop - Nerdy cartoons every day by @helloluis - Check out the gallery at https://cryptopop.net!`)
}

function toon(session) {
  var toons = [ 
    ["The Bitcoin Gingerbread Man","70_market_share.png"],
    ["Antpool Announcement","Antpool.png"],
    ["Meanwhile, at the Dept. of Awesome Innovation ...","Awesome_blockchain_innovation.png"],
    ["Bitcoin Bulldogs"],["Bitcoin_bulldogs.png"],
    ["Dora's Hard Fork Survival Guide","Doras_hard_fork_survival_guide.png"],
    ["Dr. Strange and Wong","Dr._Strange_and_Wong.png"],
    ["Pennywise's Scamcoins","Pennywise.png"],
    ["Snowmen Fight","Snowmen_fight.png"],
    ["Infinite Jihan and Gmax","Infinite_jihan_and_gmax.png"],
    ["Satoshi's Final Message","Satoshis_final_message.png"],
    ["Dogs Trading Crypto","Dogs_trading_with_dialogue.png"],
    ["The Bitcoin Reddit Troll","The_reddit_troll.png"],
    ["Madonna of the Bitcoin Miners","Madonna.png"],
    ["A Weird Nightmare","The_Grady_Twins.png"],
    ["An Uber Accident","An_Uber_Accident.png"],
    ["Bear teaches Bull","Bear_teaching_bull.png"],
    ["Memento","Memento.png"],
    ["Tony and DUM-E","Tony_and_Dum-E.png"]
  ]

  var random_toon = toons[Math.floor(Math.random()*toons.length)];

  session.reply(SOFA.Message({
    body: random_toon[0],
    attachments: [{
      "type": "image",
      "url": random_toon[1]
    }]
  }))
}

function pong(session) {
  sendMessage(session, `Pong`)
}

// example of how to store state on each user
function count(session) {
  let count = (session.get('count') || 0) + 1
  session.set('count', count)
  sendMessage(session, `${count}`)
}

function donate(session) {
  // request $1 USD at current exchange rates
  Fiat.fetch().then((toEth) => {
    session.requestEth(toEth.USD(1))
  })
}

// HELPERS

function sendMessage(session, message) {
  let controls = [
    {type: 'button', label: 'Toon', value: 'toon'},
    {type: 'button', label: 'Donate', value: 'donate'}
  ]
  session.reply(SOFA.Message({
    body: message,
    controls: controls,
    showKeyboard: false,
  }))
}
