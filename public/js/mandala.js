import * as utils from './utils.js'

export const drawBasicDotMandala = paper => {
    const originalPointCount = 50;
    const getR = (t, scalar = 1) => scalar * (scalar * Math.pow(t, 4) / (2 * Math.pow(Math.PI, 4)) + 1 / 2)
    const getCircleRadius = (t, scalar = 1) => scalar * (.14 * Math.pow(t / Math.PI, 2) + .01)
    const hue = (100 * Math.random()).toFixed(4);
    const scaleMinimum = .2
    const scaleMaximum = 1
    for (var currentScale = 1; currentScale >= scaleMinimum; currentScale -= .1) {
        const startColor = utils.color.HSLToHex(hue, 100, (scaleMaximum - currentScale) / (scaleMaximum - scaleMinimum) * 50 + 50)
        var theta = -Math.PI
        var attributes = { fill: startColor, "fill-opacity": .75, "stroke-opacity": 0.00 }
        const pointCount = originalPointCount
        // const pointCount = (originalPointCount * currentScale).toFixed(0);
        var scale = pointCount / 2 + Math.pow(pointCount, 2) / 4
        for (var circleIndex = -pointCount / 2; circleIndex < pointCount / 2; circleIndex++) {
            const r = getR(theta, currentScale);
            // console.log(r, theta, pointCount)
            utils.polar.drawCircle(paper, {
                center: {
                    r: r * 0.85, theta: theta - Math.PI / 2
                },
                radius: getCircleRadius(theta, currentScale),
                attributes: attributes
            })
            theta += (2 * Math.PI / scale) * (Math.abs(circleIndex + .5) + .5)
        }
    }
}