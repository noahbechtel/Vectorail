// SETUP

var a = new window.keypress.Listener()
var d = new window.keypress.Listener()
var j = new window.keypress.Listener()
var l = new window.keypress.Listener()

var vw = window.innerWidth
var vh = window.innerHeight

var app = new PIXI.Application(vw, vh, {
  view: document.getElementById('stage'),
  antialias: true,
  backgroundColor: 0x130035
})

var style = new PIXI.TextStyle({
  fontFamily: 'futura',
  fontSize: 36,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: '#dddddd',
  dropShadow: true,
  dropShadowColor: '#646464',
  dropShadowBlur: 0,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 2,
  wordWrap: true,
  wordWrapWidth: 440
})
let crown = new PIXI.Sprite.fromImage('images/crown.png')
let player1logo = new PIXI.Sprite.fromImage('images/p1.png')
let player2logo = new PIXI.Sprite.fromImage('images/p2.png')
let sprite1 = new PIXI.Sprite.fromImage('images/p1.png')
let sprite2 = new PIXI.Sprite.fromImage('images/p2.png')
let checker = new PIXI.Sprite.fromImage('images/checker.png')
let logo = new PIXI.Sprite.fromImage('images/rail.png')
let direct = new PIXI.Text('Use A+D/J+L to Move', style)
let start = new PIXI.Sprite.fromImage('images/start.png')
let count = new PIXI.Text('3', style)

let started = false
var graphics = new PIXI.Graphics()
  .lineStyle(3, 0xaaaaaa, 1)
  .moveTo(550, 300)
  .quadraticCurveTo(0, 600, 700, 600)
  .quadraticCurveTo(800, 600, 900, 500)
  .quadraticCurveTo(1000, 400, 1200, 600)
  .quadraticCurveTo(1500, 875, 1300, 300)
  .quadraticCurveTo(1200, 0, 550, 300)

var points = graphics.graphicsData[0].shape.points
var values = []

for (var i = 0; i < points.length; i += 2) {
  values.push({ x: points[i], y: points[i + 1] })
}

checker.position.copy(values[0])
checker.anchor.set(0.5)
checker.pivot.set(0.5)
checker.scale.set(0.05)
checker.rotation = 130

crown.position.set(1500, 300)
crown.anchor.set(0.5)
crown.pivot.set(0.5)
crown.scale.set(0.15)

sprite1.position.copy(values[0])
sprite1.anchor.set(0.5)
sprite1.pivot.set(0.5)
sprite1.scale.set(0.5)

logo.position.set(200, 75)
logo.anchor.set(0.5)
logo.pivot.set(0.5)
logo.scale.set(0.75)

player1logo.position.set(1500, 400)
player1logo.anchor.set(0.5)
player1logo.pivot.set(0.5)
player1logo.scale.set(1)

player2logo.position.set(1600, 400)
player2logo.anchor.set(0.5)
player2logo.pivot.set(0.5)
player2logo.scale.set(1)

sprite2.position.copy(values[0])
sprite2.anchor.set(0.5)
sprite2.pivot.set(0.5)
sprite2.scale.set(0.5)

direct.x = 700
direct.y = 900

start.on('pointerdown', onClick)
start.position.set(900, 800)
start.anchor.set(0.5)
start.scale.set(0.5)
start.interactive = true
start.buttonMode = true

count.position.set(900, 800)

function onClick () {
  app.stage.removeChild(start)
  count.position.set(900, 800)
  count = new PIXI.Text('GO!', style)
  setTimeout(() => {
    app.stage.addChild(count)
    started = true
  }, 1000)
}
app.stage.addChild(
  checker,
  graphics,
  sprite1,
  sprite2,
  logo,
  direct,
  player1logo,
  player2logo,
  start
)
let finished = false
let n = 0
let nVal = values[n]
let pVal
if (values[n - 1]) pVal = values[n - 1]
else {
  pVal = values[n]
}
let vel = 1

const { x: nx, y: ny } = nVal
const { px, y: py } = pVal

let running = false

let n1 = 0
let nVal1 = values[n]
let pVal1
if (values[n - 1]) pVal1 = values[n - 1]
else {
  pVal1 = values[n]
}
let laps = 3
let laps1 = 3
let running1 = false

// SETUP

// UPDATE POS

a.register_combo({
  keys: 'a',
  on_keydown: update1,
  prevent_default: true,
  prevent_repeat: false
})
d.register_combo({
  keys: 'd',
  on_keydown: update1,
  prevent_default: true,
  prevent_repeat: false
})
j.register_combo({
  keys: 'j',
  on_keydown: update2,
  prevent_default: true,
  prevent_repeat: false
})
l.register_combo({
  keys: 'l',
  on_keydown: update2,
  prevent_default: true,
  prevent_repeat: false
})
function update1 () {
  if (!running && started) {
    running = true
    TweenMax.to(sprite1, vel, {
      bezier: {
        type: 'thrubasic',
        values: [pVal, nVal],
        ease: Power0.easeNone,
        autoRotate: ['x', 'y', 'rotation', -80, true]
      }
    })
    if (n === values.length - 1) {
      n = 0
      laps--
    } else {
      n++
    }

    if (laps === 0 && !finished) {
      text = new PIXI.Text('Orange Wins!', style)
      text.x = 30
      text.y = 180
      finished = true
      app.stage.addChild(text)
    }
    nVal = values[n]
    if (values[n - 1]) pVal = values[n - 1]
    else {
      pVal = values[n]
    }
    checkPlacing()
    running = false
  }
}

function update2 () {
  if (!running && started) {
    running1 = true
    TweenMax.to(sprite2, vel, {
      bezier: {
        type: 'thrubasic',
        values: [pVal1, nVal1],
        ease: Power0.easeNone,
        autoRotate: ['x', 'y', 'rotation', -80, true]
      }
    })
    if (n1 === values.length - 1) {
      n1 = 0
      laps1--
    } else {
      n1++
    }

    if (laps1 === 0 && !finished) {
      text = new PIXI.Text('Pink Wins!', style)
      text.x = 1500
      text.y = 180
      finished = true

      app.stage.addChild(text)
    }
    checkPlacing()

    nVal1 = values[n1]
    if (values[n1 - 1]) pVal1 = values[n1 - 1]
    else {
      pVal1 = values[n1]
    }
    running1 = false
  }
}
const checkPlacing = () => {
  if (laps1 <= laps && n1 >= n) {
    app.stage.removeChild(crown)
    crown.x = 1600
    crown.y = 320
    app.stage.addChild(crown)
  } else {
    app.stage.removeChild(crown)
    crown.x = 1500
    crown.y = 320
    app.stage.addChild(crown)
  }
}

// Assign events
// document.addEventListener('mousedown', mousedown)
// document.addEventListener('mouseup', mouseup)
