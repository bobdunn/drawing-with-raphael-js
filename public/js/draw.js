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
        drawLine(paper, counterClockwise.leftSide, counterClockwise.bottom, { stroke: Raphael.getRGB(rgbString) })
        drawLine(paper, counterClockwise.bottom, counterClockwise.rightSide, { stroke: Raphael.getRGB(rgbString) })
        drawLine(paper, counterClockwise.rightSide, counterClockwise.top, { stroke: Raphael.getRGB(rgbString) })
        drawLine(paper, counterClockwise.top, counterClockwise.leftSide, { stroke: Raphael.getRGB(rgbString) })
    }
}

const drawRandomSymmetry = (paper, shapeCount = 3, shapeSideMin = 3, shapeSideMax = 5) => {
    for (let shapeIndex = 0; shapeIndex < shapeCount; shapeIndex++) {
        var sideCount = getRandomInt(shapeSideMax - shapeSideMin) + shapeSideMin;
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

        drawShape(paper, points, attributes);
        drawShape(paper, points.map(getSemmetries.horizontal), attributes);
        drawShape(paper, points.map(getSemmetries.rotational), attributes);
        drawShape(paper, points.map(getSemmetries.vertical), attributes);
    }
}

const drawRandomRotationalSymmetry = (paper, shapeCount = 3, shapeSideMin = 3, shapeSideMax = 5) => {
    for (let shapeIndex = 0; shapeIndex < shapeCount; shapeIndex++) {
        var sideCount = getRandomInt(shapeSideMax - shapeSideMin) + shapeSideMin;
        var points = [];
        for (let pointIndex = 0; pointIndex < sideCount; pointIndex++) {
            var newPoint = getRandomPoint();
            points.push(newPoint)
        }
        var color = getRandomColor();
        var attributes = { fill: color, "fill-opacity": .25, "stroke-opacity": 0.00 }

        drawShape(paper, points, attributes);
        drawShape(paper, points.map(getRotations.by90), attributes);
        drawShape(paper, points.map(getRotations.by180), attributes);
        drawShape(paper, points.map(getRotations.by270), attributes);
    }
}

const drawMoreRotationalSymmetry = (
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
        collection.sideCount = getRandomInt(shapeSideMax - shapeSideMin) + shapeSideMin;
        var points = getPointsInCirle(collection);
        collection.color = getRandomColor();
        var attributes = { fill: collection.color, "fill-opacity": .25, "stroke-opacity": 0.00 }
        for (var degrees = 0; degrees < 360; degrees += 360 / symmetryCount) {
            var rotatedPoints = points.map(p => getRotations.byX(p, degrees));
            collection.shapeParts.original[degrees] = drawShape(paper, rotatedPoints, attributes);

            var horizontalPoints = rotatedPoints.map(getSemmetries.horizontal)
            collection.shapeParts.horizontal[degrees] = drawShape(paper, horizontalPoints, attributes);
            if (symmetryCount % 2 != 0) {
                var verticalPoints = rotatedPoints.map(getSemmetries.vertical)
                collection.shapeParts.vertical[degrees] = drawShape(paper, verticalPoints, attributes)

                var vhPoints = horizontalPoints.map(getSemmetries.vertical)
                collection.shapeParts.vh[degrees] = drawShape(paper, vhPoints, attributes)
            }
        }
    }
    var animationTime = 8000
    const easing = "linear";


    var animate = () => {
        var animationRoot = Raphael.animation({}, animationTime, easing)
        for (let shapeIndex = 0; shapeIndex < shapeCount; shapeIndex++) {
            var collection = shapeCollections[shapeIndex];
            var points = getPointsInCirle(collection);
            collection.color = getRandomColor();
            var attributes = { fill: collection.color, "fill-opacity": .25, "stroke-opacity": 0.00 }
            for (var degrees = 0; degrees < 360; degrees += 360 / symmetryCount) {
                var rotatedPoints = points.map(p => getRotations.byX(p, degrees));
                collection.shapeParts.original[degrees].animateWith(null, animationRoot, { ...attributes, path: getMappedPathString(paper, rotatedPoints) }, animationTime, easing)
                var horizontalPoints = rotatedPoints.map(getSemmetries.horizontal)
                collection.shapeParts.horizontal[degrees].animateWith(null, animationRoot, { ...attributes, path: getMappedPathString(paper, horizontalPoints) }, animationTime, easing)

                if (symmetryCount % 2 != 0) {
                    var verticalPoints = rotatedPoints.map(getSemmetries.vertical)
                    collection.shapeParts.vertical[degrees].animateWith(null, animationRoot, { ...attributes, path: getMappedPathString(paper, verticalPoints) }, animationTime, easing)
                    var vhPoints = horizontalPoints.map(getSemmetries.vertical)
                    collection.shapeParts.vh[degrees].animateWith(null, animationRoot, { ...attributes, path: getMappedPathString(paper, vhPoints) }, animationTime, easing)
                }
            }
        }

    }
    animate()
    setInterval(animate, animationTime)


}

const drawWanderingLine = paper => {
    var points = [getRandomPoint(), getRandomPoint()]
    var line = drawShape(paper, points, { stroke: "white" })
    var randomize = () => {
        var newPoints = [getRandomPoint(), getRandomPoint()];
        var pathString = getPathString(newPoints.map(p => mapPoint(p, paper)))
        line.animate({ 'path': pathString, }, 3000, "linear", randomize);
    }
    randomize()
}

const getCartesianFromPolar = p => ({
    x: p.r * Math.cos(p.theta),
    y: p.r * Math.sin(p.theta)
})

const getSemmetries = {
    horizontal: p => ({ x: p.x, y: -p.y }),
    vertical: p => ({ x: - p.x, y: p.y }),
    rotational: p => ({ x: - p.x, y: -p.y }),
}
const rotateBy90 = p => {
    return { x: p.y, y: -p.x }
}

const getRotations = {
    by90: rotateBy90,
    by180: p => rotateBy90(rotateBy90(p)),
    by270: p => rotateBy90(rotateBy90(rotateBy90(p))),
    byX: (p, d) => {
        var radians = Math.PI * d / 180;
        var sin = Math.sin(radians);
        var cos = Math.cos(radians);
        return {
            x: p.x * cos - p.y * sin,
            y: p.x * sin + p.y * cos
        }
    }
}

const getHorizontalSymmetricalPoint = p => ({ x: p.x, y: -p.y })

const drawShape = (paper, points, attributes) => {
    var mappedPoints = points.map(p => mapPoint(p, paper));
    var pathString = getPathString(mappedPoints);
    var shape = paper.path(pathString);
    if (attributes) shape.attr(attributes)
    return shape
}



const drawLine = (paper, p1, p2, attributes) => drawShape(paper, [p1, p2], attributes)

const mapPoint = (point, canvas) => (
    // given a canvas with properties width and height, and 
    // a point on a unit square (that is, (-1, -1) to (1, 1)), 
    // return the point mapped onto the canvas

    {
        x: (canvas.width * point.x) / 2 + canvas.width / 2,
        y: (canvas.height * (-point.y)) / 2 + canvas.height / 2
    }
)

const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const getRandomPoint = () => ({
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1
})

const getPointsInCirle = collection => {
    var points = [];
    for (let pointIndex = 0; pointIndex < collection.sideCount; pointIndex++) {
        var newPolar = {
            r: Math.random(),
            theta: Math.random() * 2 * Math.PI
        };
        points.push(getCartesianFromPolar(newPolar));
    }
    return points;
}

const getMappedPathString = (paper, points) => getPathString(points.map(p => mapPoint(p, paper)))

const getPathString = (points, lineType="L") => {
    var pathString = `M${points[0].x},${points[0].y}`;
    for (var p of points.slice(1)) {
        pathString += `${lineType}${p.x},${p.y}`;
    }
    pathString += "Z";
    return pathString;
}

