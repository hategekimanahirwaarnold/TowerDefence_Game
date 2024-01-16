
let { random, hypot, atan2, sin, cos, round, PI, abs } = Math;

function mouseCollision(mouse, object) {
    return (
        mouse.x > object.position.x &&
        mouse.x < object.position.x + object.size &&
        mouse.y > object.position.y &&
        mouse.y < object.position.y + object.size
    )
}

function projectileCollision(circle1, circle2) {

    const xDist = circle1.center.x - circle2.position.x;
    const yDist = circle1.center.y - circle2.position.y;
    let distance = hypot(xDist, yDist)
    if (distance < circle1.radius + circle2.radius) {
        return true
    }
    return false
}

function rangeCollision(circle1, circle2) {

    const xDist = circle1.center.x - circle2.center.x;
    const yDist = circle1.center.y - circle2.center.y;
    let distance = hypot(xDist, yDist)
    if (distance < circle1.radius + circle2.radius) {
        return true
    }
    return false
}


function spawnEnemies(n) {

    for (let i = 1; i < n + 1; i++) {
        let xOffset = i * 200
        let enemy = new Enemy({
            position: {
                x: ways[0].x - xOffset,
                y: ways[0].y
            }
        });
        enemies.push(enemy)
    }
}