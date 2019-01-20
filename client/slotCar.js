var vw = window.innerWidth
var vh = window.innerHeight

var app = new PIXI.Application(vw, vh, {
  view: document.getElementById('stage'),
  antialias: true
})

var graphics = new PIXI.Graphics()
  .lineStyle(2, 0xaaaaaa, 1)
  .moveTo(200, 300)
  .arcTo(150, 300, 150, 350, 50)
  .arcTo(150, 400, 200, 400, 50)
  .lineTo(350, 300)
  .arcTo(400, 300, 400, 350, 50)
  .arcTo(400, 400, 350, 400, 50)
  .lineTo(200, 300)

var points = graphics.graphicsData[0].shape.points
var values = []

for (var i = 0; i < points.length; i += 2) {
  values.push({ x: points[i], y: points[i + 1] })
}
var sprite = PIXI.Sprite.fromImage('car')
sprite.position.copy(values[0])
sprite.anchor.set(0.5)
sprite.pivot.set(0.5)
sprite.scale.set(0.5)

TweenMax.to(sprite, 2, {
  bezier: {
    type: 'quadriatic',
    values: values,
    curviness: 1,
    autoRotate: ['z', 'z', 'rotation', 0, false]
  },
  repeat: -1,
  ease: Power0.easeNone
})

app.stage.addChild(sprite, graphics)
