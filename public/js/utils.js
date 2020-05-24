

export const getCartesianFromPolar = p => ({
    x: p.r * Math.cos(p.theta),
    y: p.r * Math.sin(p.theta)
})

export const getSemmetries = {
    horizontal: p => ({ x: p.x, y: -p.y }),
    vertical: p => ({ x: - p.x, y: p.y }),
    rotational: p => ({ x: - p.x, y: -p.y }),
}

const rotateBy90 = p => {
    return { x: p.y, y: -p.x }
}

export const getRotations = {
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


export const drawShape = (paper, points, attributes) => {
    var mappedPoints = points.map(p => mapPoint(p, paper));
    var pathString = getPathString(mappedPoints);
    var shape = paper.path(pathString);
    if (attributes) shape.attr(attributes)
    return shape
}



export const drawLine = (paper, p1, p2, attributes) => drawShape(paper, [p1, p2], attributes)

export const mapPoint = (point, canvas) => (
    // given a canvas with properties width and height, and 
    // a point on a unit square (that is, (-1, -1) to (1, 1)), 
    // return the point mapped onto the canvas

    {
        x: (canvas.width * point.x) / 2 + canvas.width / 2,
        y: (canvas.height * (-point.y)) / 2 + canvas.height / 2
    }
)

const mapDistance = (distance, canvas) => {
    // we have to assume this is a square canvas, and we use the input distance as a measurement in the unit square, 
    // scaling against the width of the canvas
    return distance * canvas.width / 2
}

export const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

export const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export const getRandomPoint = () => ({
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1
})

export const getPointsInCirle = collection => {
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

export const getMappedPathString = (paper, points) => getPathString(points.map(p => mapPoint(p, paper)))

export const getPathString = (points, lineType = "L") => {
    var pathString = `M${points[0].x},${points[0].y}`;
    for (var p of points.slice(1)) {
        pathString += `${lineType}${p.x},${p.y}`;
    }
    pathString += "Z";
    return pathString;
}

export const polar = {
    drawCircle: (paper, options) => {
        var center = mapPoint(getCartesianFromPolar(options.center), paper)
        return paper.circle(center.x, center.y, mapDistance(options.radius, paper))
    }
}
