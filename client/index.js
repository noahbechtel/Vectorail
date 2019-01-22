// SETUP

var a = new window.keypress.Listener()
var d = new window.keypress.Listener()
var j = new window.keypress.Listener()
var l = new window.keypress.Listener()
var left = new window.keypress.Listener()
var right= new window.keypress.Listener()

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
let go = new PIXI.Sprite.fromImage('images/go.png')
let count = new PIXI.Text('3', style)

// window.addEventListener('load', function () {
//   var svgObject = document.getElementById('svg').contentDocument
//   var svg = svgObject.getElementById('svg')
//   var g = svg.getElementById('svgg')
//   console.log(g)
// })

let started = false
const graphics = new PIXI.Graphics()
  .lineStyle(3, 0xaaaaaa, 1)
  .moveTo(550, 300)
  .quadraticCurveTo(0, 600, 300, 600)
  .quadraticCurveTo(600, 600, 900, 500)
  .quadraticCurveTo(1100, 400, 1200, 600)
  .quadraticCurveTo(1450, 1000, 1300, 300)
  .quadraticCurveTo(1200, 0, 550, 300)

const points = graphics.graphicsData[0].shape.points
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
sprite1.rotation = 180

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
sprite2.rotation = 180

direct.x = 700
direct.y = 900

start.on('pointerdown', onClick)
start.position.set(900, 800)
start.anchor.set(0.5)
start.scale.set(0.75)
start.interactive = true
start.buttonMode = true

count.position.set(900, 800)

function onClick () {
  app.stage.removeChild(start)
  setTimeout(() => {
    go.position.set(825, 750)
    app.stage.addChild(go)
    started = true
  }, 1000)
}
let text
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
let n = 1
let nVal = values[n]
let pVal
if (values[n - 1]) pVal = values[n - 1]
else {
  pVal = values[n]
}
let vel = 1
let vel1 = 1

const { x: nx, y: ny } = nVal
const { px, y: py } = pVal

let running = false

let n1 = 1
let nVal1 = values[n]
let pVal1
if (values[n - 1]) pVal1 = values[n - 1]
else {
  pVal1 = values[n]
}
let laps = 3
let laps1 = 3
let running1 = false
let p1timer = 0
let p2timer = 0

// SETUP

// UPDATE POS

a.register_combo({
  keys: 'a',
  on_keydown: update1,
  prevent_default: true,
  prevent_repeat: true
})
d.register_combo({
  keys: 'd',
  on_keydown: update1,
  prevent_default: true,
  prevent_repeat: true
})
j.register_combo({
  keys: 'j',
  on_keydown: update2,
  prevent_default: true,
  prevent_repeat: true
})
l.register_combo({
  keys: 'l',
  on_keydown: update2,
  prevent_default: true,
  prevent_repeat: true
})
left.register_combo({
  keys: 'l',
  on_keydown: update1,
  prevent_default: true,
  prevent_repeat: true
})
right.register_combo({
  keys: 'l',
  on_keydown: update2,
  prevent_default: true,
  prevent_repeat: true
})
let powerUp
function update1 () {
  if (powerUp && powerUp.visible) {
    if (powerUp.position.x === nVal.x && powerUp.position.y === nVal.y) {
      switch (powerUp.type) {
        case 1:
          n = n - 10
          powerUp.visible = false
          app.stage.removeChild(powerUp)
        case 2:
          n = n + 10
          powerUp.visible = false
          app.stage.removeChild(powerUp)

        default:
          break
      }
    }
  }
  nVal = values[n]
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

    if (p1timer === 0) {
      vel = 1
    } else {
      p1timer--
    }
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

    if (values[n - 1]) pVal = values[n - 1]
    else {
      pVal = values[n]
    }

    checkPlacing()
    running = false
  }
}

function update2 () {
  nVal1 = values[n1]

  if (powerUp && powerUp.position && powerUp.visible) {
    if (powerUp.position.x === nVal1.x && powerUp.position.y === nVal1.y) {
      switch (powerUp.type) {
        case 1:
          n = n - 10
          powerUp.visible = false
          app.stage.removeChild(powerUp)
        case 2:
          n = n + 10
          powerUp.visible = false
          app.stage.removeChild(powerUp)

        default:
          break
      }
    }
  }
  if (!running && started) {
    running1 = true
    TweenMax.to(sprite2, vel1, {
      bezier: {
        type: 'thrubasic',
        values: [pVal1, nVal1],
        ease: Power0.easeNone,
        autoRotate: ['x', 'y', 'rotation', -80, true]
      }
    })

    if (p2timer === 0) {
      vel1 = 1
    } else {
      p2timer--
    }
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

    if (values[n1 - 1]) pVal1 = values[n1 - 1]
    else {
      pVal1 = values[n1]
    }
    running1 = false
  }
}

const checkPlacing = () => {
  const p1Pos = laps * values.length + (values.length - n)
  const p2Pos = laps1 * values.length + (values.length - n1)
  if (p2Pos < p1Pos) {
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

  let random = Math.floor(Math.random() * 100)

  if (random > 66 && random < 69) {
    let location = Math.floor(Math.random() * (+values.length - +0)) + +0
    let type = Math.floor(Math.random() * 10) % 2 === 0
    if (type) {
      type = 1
    } else {
      type = 2
    }
    if (!powerUp) {
      powerUp = new PIXI.Sprite.fromImage(`images/powerUps/${type}.png`)
      powerUp.position.set(values[location].x, values[location].y)
      powerUp.type = type
      powerUp.anchor.set(0.5)
      powerUp.scale.set(1.5)
      app.stage.addChild(powerUp)
    } else {
      if (!powerUp.visible) {
        powerUp = new PIXI.Sprite.fromImage(`images/powerUps/${type}.png`)
        powerUp.position.set(values[location].x, values[location].y)
        powerUp.anchor.set(0.5)
        powerUp.scale.set(1.5)
        powerUp.type = type
        app.stage.addChild(powerUp)
      }
    }
  }
}

// Assign events
// document.addEventListener('mousedown', mousedown)
// document.addEventListener('mouseup', mouseup)
