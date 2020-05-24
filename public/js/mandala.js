import * as utils from './utils.js'

export const drawBasicDotMandala = paper => {
    const pointCount = 28;
    const getR = t => (Math.pow(t, 4) / (2 * Math.pow(Math.PI, 4))) + 1 / 2
    const getCircleRadius = t => .14 * Math.pow(t / Math.PI, 2) + .01
    // for (let theta = -Math.PI; theta < Math.PI; theta += 2 * Math.PI / pointCount) {
    var theta = -Math.PI
    for (var i = -14; i < 14; i++) {
        const r = getR(theta);
        console.log(r, theta)
        utils.polar.drawCircle(paper, { center: { r: r * 0.85, theta: theta - Math.PI / 2 }, radius: getCircleRadius(theta) })
        theta += (2 * Math.PI / 210) * (Math.abs(i + .5) + .5)
    }
}