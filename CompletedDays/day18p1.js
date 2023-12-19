"use strict";
let fs = require('fs');
let commands = fs.readFileSync("./Inputs/input18.txt").toString().split('\n').map(x => ({direction:x.split(' ')[0], distance:parseInt(x.split(' ')[1]), colour:x.split(' ')[2]}));
let originalPoints = [];
let edges = [];
let x = 0;
let y = 0;

originalPoints.push({x:x,y:y});

let lastPoint = originalPoints[0];

for (let i = 0; i < commands.length; i++) {
    let command = commands[i];

    switch(command.direction) {
        case 'R':
            x += command.distance;
            break;
        case 'D':
            y -= command.distance;
            break;
        case 'L':
            x -= command.distance;
            break;
        case 'U':
            y += command.distance;
            break;
    }

    let newPoint = {x:x,y:y, direction:command.direction};

    if (!(newPoint.x == originalPoints[0].x && newPoint.y == originalPoints[0].y)) {
        originalPoints.push(newPoint);
        edges.push({p1:lastPoint,p2:newPoint,length:command.distance});
        lastPoint = newPoint;
    }
    else {
        originalPoints[0].direction = command.direction;
    }
}

edges.push({p1:lastPoint,p2:originalPoints[0],length:commands[commands.length-1].distance});

for (let i=0;i < originalPoints.length; i++) {
    let yBonus = 0;
    let xBonus = 0;
    let point = originalPoints[i];
    let nextPoint;
    if (i+1 == originalPoints.length) nextPoint = originalPoints[0];
    else nextPoint = originalPoints[i+1];

    switch(point.direction) {
        case 'R':
            switch(nextPoint.direction) {
                case 'D':
                    yBonus = 0.5;
                    xBonus = 0.5;
                    break;
                case 'U':
                    yBonus = 0.5;
                    xBonus = -0.5;
                    break;
            }
            break;
        case 'D':
            switch(nextPoint.direction) {
                case 'R':
                    yBonus = 0.5;
                    xBonus = 0.5;
                    break;
                case 'L':
                    yBonus = -0.5;
                    xBonus = 0.5;
                    break;
            }
            break;
        case 'L':
            switch(nextPoint.direction) {
                case 'D':
                    yBonus = -0.5;
                    xBonus = 0.5;
                    break;
                case 'U':
                    yBonus = -0.5;
                    xBonus = -0.5;
                    break;
            }
            break;
        case 'U':
            switch(nextPoint.direction) {
                case 'R':
                    yBonus = 0.5;
                    xBonus = -0.5;
                    break;
                case 'L':
                    yBonus = -0.5;
                    xBonus = -0.5;
                    break;
            }
            break;
    }

    originalPoints[i].x += xBonus;
    originalPoints[i].y += yBonus;
}

let area = 0;

for (let i=0;i<originalPoints.length;i++) {
    let x1 = originalPoints[i].x;
    let x2 = (i == originalPoints.length-1 ? originalPoints[0].x : originalPoints[i+1].x);

    let y1 = originalPoints[i].y;
    let y2 = (i == originalPoints.length-1 ? originalPoints[0].y : originalPoints[i+1].y);

    area += ((x1*y2) - (x2*y1));
}

area = Math.abs(area/2);

console.log(area);