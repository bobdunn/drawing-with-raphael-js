import * as utils from './utils.js'

export const drawBasicDotMandala = (
    paper,
    options = {
        originalPointCount: 50,
        largestRadius: .15,
        minimumScale: .2,
        maximumScale: 1,
        scaleDelta: .1,
        shouldScaleDotCount: true,
        fillOpacity: .75,
        scaleToFit: .85,
        hue: null
    }, translationOptions = {
        scale: 1,
        rotation: 0,
        centerR: 0,
        centerTheta: 0
    }) => {
    const getR = (t, scalar = 1) => scalar * (scalar * Math.pow(t, 4) / (2 * Math.pow(Math.PI, 4)) + 1 / 2)
    const getCircleRadius = (t, scalar = 1) => scalar * ((options.largestRadius - .01) * Math.pow(t / Math.PI, 2) + .01)
    const hue = options.hue ?? (100 * Math.random()).toFixed(4);
    for (var currentScale = 1; currentScale >= options.minimumScale; currentScale -= options.scaleDelta) {
        var theta = -Math.PI

        const startColor = utils.color.HSLToHex(hue, 100, (options.maximumScale - currentScale) / (options.maximumScale - options.minimumScale) * 50 + 50)
        const attributes = { fill: startColor, "fill-opacity": options.fillOpacity, "stroke-opacity": 0.00 }

        const pointCount = options.shouldScaleDotCount ?
            (options.originalPointCount * currentScale).toFixed(0)
            : options.originalPointCount

        const scale = pointCount / 2 + Math.pow(pointCount, 2) / 4

        for (var circleIndex = -pointCount / 2; circleIndex < pointCount / 2; circleIndex++) {
            const r = getR(theta, currentScale);
            utils.polar.drawCircle(paper, {
                center: {
                    r: r * options.scaleToFit * translationOptions.scale,
                    theta: theta - Math.PI / 2 + translationOptions.rotation
                },
                radius: getCircleRadius(theta, currentScale * translationOptions.scale),
                attributes: attributes
            })
            theta += (2 * Math.PI / scale) * (Math.abs(circleIndex + .5) + .5)
        }
    }
}

export const drawSixDotMandalas = (paper, options) => {
    const points = 6;
    for (var i = 0; i < points; i++) {
        const rotation = 2 * Math.PI * i / points;
        drawBasicDotMandala(paper, options, { scale: 1, rotation: rotation })
    }
}