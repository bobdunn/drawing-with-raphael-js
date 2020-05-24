import * as utils from './utils.js'

const drawBezierThing = paper => {
    var pointCount = 100;
    for (var i = -1; i <= 1; i += 2 / pointCount) {
        var counterClockwise = {
            leftSide: { x: -1, y: - i },
            bottom: { x: i, y: -1 },
            rightSide: { x: 1, y: i },
            top: { x: - i, y: 1 }
        }
        console.log(counterClockwise.leftSide)
        var rgbString = `rgb(${50 * (i + 1)}%,0%, ${100 - (50 * (i + 1)) / pointCount}%)`;
        utils.drawLine(paper, counterClockwise.leftSide, counterClockwise.bottom, { stroke: Raphael.getRGB(rgbString) })
        utils.drawLine(paper, counterClockwise.bottom, counterClockwise.rightSide, { stroke: Raphael.getRGB(rgbString) })
        utils.drawLine(paper, counterClockwise.rightSide, counterClockwise.top, { stroke: Raphael.getRGB(rgbString) })
        utils.drawLine(paper, counterClockwise.top, counterClockwise.leftSide, { stroke: Raphael.getRGB(rgbString) })
    }
}

const drawRandomSymmetry = (paper, shapeCount = 3, shapeSideMin = 3, shapeSideMax = 5) => {
    for (let shapeIndex = 0; shapeIndex < shapeCount; shapeIndex++) {
        var sideCount = utils.getRandomInt(shapeSideMax - shapeSideMin) + shapeSideMin;
        var points = [];
        for (let pointIndex = 0; pointIndex < sideCount; pointIndex++) {
            var newPoint = {
                x: Math.random() * 2 - 1,
                y: Math.random() * 2 - 1
            }
            points.push(newPoint)
        }
        var color = getRandomColor();
        var attributes = { fill: color, "fill-opacity": .225, "stroke-opacity": 0.00 }

        utils.drawShape(paper, points, attributes);
        utils.drawShape(paper, points.map(utils.getSemmetries.horizontal), attributes);
        utils.drawShape(paper, points.map(utils.getSemmetries.rotational), attributes);
        utils.drawShape(paper, points.map(utils.getSemmetries.vertical), attributes);
    }
}

const drawRandomRotationalSymmetry = (paper, shapeCount = 3, shapeSideMin = 3, shapeSideMax = 5) => {
    for (let shapeIndex = 0; shapeIndex < shapeCount; shapeIndex++) {
        var sideCount = utils.getRandomInt(shapeSideMax - shapeSideMin) + shapeSideMin;
        var points = [];
        for (let pointIndex = 0; pointIndex < sideCount; pointIndex++) {
            var newPoint = getRandomPoint();
            points.push(newPoint)
        }
        var color = getRandomColor();
        var attributes = { fill: color, "fill-opacity": .25, "stroke-opacity": 0.00 }

        utils.drawShape(paper, points, attributes);
        utils.drawShape(paper, points.map(utils.getRotations.by90), attributes);
        utils.drawShape(paper, points.map(utils.getRotations.by180), attributes);
        utils.drawShape(paper, points.map(utils.getRotations.by270), attributes);
    }
}

export const drawMoreRotationalSymmetry = (
    paper,
    shapeCount = 1,
    shapeSideMin = 3,
    shapeSideMax = 5,
    symmetryCount = 20
) => {
    var shapeCollections = [];
    for (let shapeIndex = 0; shapeIndex < shapeCount; shapeIndex++) {
        var collection = { shapeParts: { original: {}, horizontal: {}, vertical: {}, vh: {} } };
        shapeCollections.push(collection)
        collection.sideCount = utils.getRandomInt(shapeSideMax - shapeSideMin) + shapeSideMin;
        var points = utils.getPointsInCirle(collection);
        collection.color = utils.getRandomColor();
        var attributes = { fill: collection.color, "fill-opacity": .25, "stroke-opacity": 0.00 }
        for (var degrees = 0; degrees < 360; degrees += 360 / symmetryCount) {
            var rotatedPoints = points.map(p => utils.getRotations.byX(p, degrees));
            collection.shapeParts.original[degrees] = utils.drawShape(paper, rotatedPoints, attributes);

            var horizontalPoints = rotatedPoints.map(utils.getSemmetries.horizontal)
            collection.shapeParts.horizontal[degrees] = utils.drawShape(paper, horizontalPoints, attributes);
            if (symmetryCount % 2 != 0) {
                var verticalPoints = rotatedPoints.map(utils.getSemmetries.vertical)
                collection.shapeParts.vertical[degrees] = utils.drawShape(paper, verticalPoints, attributes)

                var vhPoints = horizontalPoints.map(utils.getSemmetries.vertical)
                collection.shapeParts.vh[degrees] = utils.drawShape(paper, vhPoints, attributes)
            }
        }
    }
    var animationTime = 5000
    const easing = "linear";


    var animate = () => {
        var animationRoot = Raphael.animation({}, animationTime, easing)
        for (let shapeIndex = 0; shapeIndex < shapeCount; shapeIndex++) {
            var collection = shapeCollections[shapeIndex];
            var points = utils.getPointsInCirle(collection);
            collection.color = utils.getRandomColor();
            var attributes = { fill: collection.color, "fill-opacity": .25, "stroke-opacity": 0.00 }
            for (var degrees = 0; degrees < 360; degrees += 360 / symmetryCount) {
                var rotatedPoints = points.map(p => utils.getRotations.byX(p, degrees));
                collection.shapeParts.original[degrees].animateWith(null, animationRoot, { ...attributes, path: utils.getMappedPathString(paper, rotatedPoints) }, animationTime, easing)
                var horizontalPoints = rotatedPoints.map(utils.getSemmetries.horizontal)
                collection.shapeParts.horizontal[degrees].animateWith(null, animationRoot, { ...attributes, path: utils.getMappedPathString(paper, horizontalPoints) }, animationTime, easing)

                if (symmetryCount % 2 != 0) {
                    var verticalPoints = rotatedPoints.map(utils.getSemmetries.vertical)
                    collection.shapeParts.vertical[degrees].animateWith(null, animationRoot, { ...attributes, path: utils.getMappedPathString(paper, verticalPoints) }, animationTime, easing)
                    var vhPoints = horizontalPoints.map(utils.getSemmetries.vertical)
                    collection.shapeParts.vh[degrees].animateWith(null, animationRoot, { ...attributes, path: utils.getMappedPathString(paper, vhPoints) }, animationTime, easing)
                }
            }
        }

    }
    animate()
    setInterval(animate, animationTime)


}

const drawWanderingLine = paper => {
    var points = [getRandomPoint(), getRandomPoint()]
    var line = utils.drawShape(paper, points, { stroke: "white" })
    var randomize = () => {
        var newPoints = [getRandomPoint(), getRandomPoint()];
        var pathString = getPathString(newPoints.map(p => mapPoint(p, paper)))
        line.animate({ 'path': pathString, }, 3000, "linear", randomize);
    }
    randomize()
}