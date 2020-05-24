import * as utils from './utils.js'

export const drawBasicDotMandala = paper => {
    const pointCount = 28;
    const getR = t => (Math.pow(t, 4) / (2 * Math.pow(Math.PI, 4))) + 1 / 2
    for (let theta = -Math.PI; theta < Math.PI; theta += 2 * Math.PI / pointCount) {
        const r = getR(theta);
        console.log(r, theta)
        utils.polar.drawCircle(paper, { center: { r: r * 0.95, theta: theta - Math.PI / 2 }, radius: 0.05 })

    }
}