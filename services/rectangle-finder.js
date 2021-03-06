const findPossiblePoints = (field = []) => {
    const topStartPoints = {};
    const topEndPoints = {};
    const bottomStartPoints = {};
    const bottomEndPoints = {};

    const topStartJHashMap = {};
    const topEndJHashMap = {};

    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            if (i !== field.length - 1 && j !== field[i].length - 1 && field[i][j] && field[i + 1][j] && field[i][j + 1]) {
                if (!topStartPoints[i]) {
                    topStartPoints[i] = [];
                }

                if (!topStartJHashMap[j]) {
                    topStartJHashMap[j] = [];
                }

                topStartPoints[i].push([i, j]);
                topStartJHashMap[j].push([i, j]);
            }

            if (topStartPoints[i] && i !== field.length - 1 && j !== 0 && field[i][j] && field[i + 1][j] && field[i][j - 1]) {
                if (!topEndPoints[i]) {
                    topEndPoints[i] = [];
                }

                if (!topEndJHashMap[j]) {
                    topEndJHashMap[j] = [];
                }

                topEndPoints[i].push([i, j]);
                topEndJHashMap[j].push([i, j]);
            }

            if (topStartJHashMap[j] && i !== 0 && j !== field[i].length - 1 && field[i][j] && field[i - 1][j] && field[i][j + 1]) {
                if (!bottomStartPoints[i]) {
                    bottomStartPoints[i] = [];
                }

                bottomStartPoints[i].push([i, j]);
            }

            if (bottomStartPoints[i] && topEndJHashMap[j] && i !== 0 && j !== 0 && field[i][j] && field[i - 1][j] && field[i][j - 1]) {
                if (!bottomEndPoints[i]) {
                    bottomEndPoints[i] = [];
                }

                bottomEndPoints[i].push([i, j]);
            }
        }
    }

    return { topStartPoints, topEndPoints, bottomStartPoints, bottomEndPoints };
};

const findPossibleLines = (points, field) => {
    const { topEndPoints, topStartPoints, bottomEndPoints, bottomStartPoints } = points;

    const topLines = [];
    const bottomLines = [];


    Object.keys(topEndPoints).forEach(line => {
        topStartPoints[line].forEach(startPoint => {
            topEndPoints[line].forEach(horizontalPoint => {
                let isLine = startPoint[1] < horizontalPoint[1];

                for (let j = startPoint[1] + 1; j < horizontalPoint[1]; j++) {
                    if (isLine && !field[line][j]) {
                        isLine = false;
                    }
                }

                if (isLine) {
                    topLines.push([startPoint, horizontalPoint]);
                }
            });
        });
    });

    Object.keys(bottomEndPoints).forEach(line => {
        bottomStartPoints[line].forEach(verticalPoint => {
            bottomEndPoints[line].forEach(endPoint => {
                let isLine = verticalPoint[1] < endPoint[1];

                for (let j = verticalPoint[1] + 1; j < endPoint[1]; j++) {
                    if (isLine && !field[line][j]) {
                        isLine = false;
                    }
                }

                if (isLine) {
                    bottomLines.push([verticalPoint, endPoint]);
                }
            });
        });
    });

    return { topLines, bottomLines };
};

const findRectanglesFromLines = (lines, field) => {
    const { topLines, bottomLines } = lines;

    const rectangles = [];

    topLines.forEach(topLine => {
        bottomLines.forEach(bottomLine => {
            if (topLine[0][0] < bottomLine[0][0] && topLine[0][1] === bottomLine[0][1] && topLine[1][1] === bottomLine[1][1]) {
                let isRectangle = true;
                let j = topLine[0][1];

                for (let i = topLine[0][0] + 1; i < bottomLine[0][0]; i++) {
                    if (isRectangle && !field[i][j]) {
                        isRectangle = false;
                    }
                }

                j = topLine[1][1];

                for (let i = topLine[1][0] + 1; i < bottomLine[1][0]; i++) {
                    if (isRectangle && !field[i][j]) {
                        isRectangle = false;
                    }
                }

                if (isRectangle) {
                    rectangles.push([topLine, bottomLine]);
                }
            }
        });
    });

    return rectangles;
};

const findRectangles = (field) => {
    const points = findPossiblePoints(field);
    const lines = findPossibleLines(points, field);

    return findRectanglesFromLines(lines, field);
};

const getMaxRectangle = (rectangles) => {
    const maxRectangle = {
        maxArea: 0
    };

    rectangles.forEach(rectangle => {
        const area = (rectangle[0][1][1] - rectangle[0][0][1]) * (rectangle[1][0][0] - rectangle[0][0][0]);

        if (area > maxRectangle.maxArea) {
            maxRectangle.maxArea = area;
            maxRectangle.coordinates = rectangle[0].concat(rectangle[1].reverse());
        }
    });

    return maxRectangle;
};

module.exports = { findRectangles, getMaxRectangle };
