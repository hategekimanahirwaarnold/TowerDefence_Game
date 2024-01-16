let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");

canvas.width = 1280
canvas.height = 768

let placements2D = []
for (let i = 0; i < placements.length; i += 20) {
    placements2D.push(placements.slice(i, i + 20));
}
let placementsArray = []
placements2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 14) {
            placementsArray.push(
                new Placement({
                    position: {
                        x: x * 64,
                        y: y * 64
                    }
                })
            )
        }
    })
})

const image = new Image()

image.src = './img/gameMap.png'

let enemies = [];
let enemyCount = 3;
let explosions = []
spawnEnemies(enemyCount)
let hearts = 10
let coins = 100

let mouse = {
    x: undefined,
    y: undefined
};

let buildings = [];
let activeTile = undefined;

function animate() {
    let animationId = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.drawImage(image, 0, 0, canvas.width, canvas.height)

    for (let i = enemies.length - 1; i >= 0; i--) {
        enemy = enemies[i]
        enemy.update()

        if (enemy.position.x > canvas.width) {
            hearts -= 1
            enemies.splice(i, 1)
            // update in html
            document.querySelector('#heartCount').innerHTML = hearts

            if (hearts === 0) {
                console.log("gameover")
                cancelAnimationFrame(animationId)
                document.querySelector('.gameOver').style.display = 'flex'
            }
        }

    }
    for (let i = explosions.length - 1; i >= 0; i--) {
        const explosion = explosions[i]
        explosion.draw()
        explosion.update()

        if (explosion.frames.current >= explosion.frames.max - 1) {
            explosions.splice(i, 1);
        }
    }

    // keep track the amount of enemies we have
    if (enemies.length === 0) {
        enemyCount += 2
        console.log("new count: ", enemyCount)
        spawnEnemies(enemyCount)
    }
    placementsArray.forEach(tile => {
        tile.update(mouse)
    })
    buildings.forEach(build => {
        build.update();
        build.target = null;

        const validEnemies = enemies.filter(enemy => {
            return rangeCollision(enemy, build)
        });
        build.target = validEnemies[0]
        for (let i = build.projectiles.length - 1; i >= 0; i--) {
            let proj = build.projectiles[i];
            proj.update();
// when a projective hit an enemy
            if (projectileCollision(proj.enemy, proj)) {
                proj.enemy.health -= 20
                if (proj.enemy.health <= 0) {
                    const enemyId = enemies.findIndex((enemy) => {
                        return proj.enemy === enemy
                    })
                    if (enemyId > -1) {
                        enemies.splice(enemyId, 1);
                        coins += 25
                        document.querySelector('#coinCount').innerHTML = coins;
                    }
                }
                explosions.push(new Sprite({
                    position: {
                        x: proj.position.x,
                        y: proj.position.y
                    },
                    frames: {
                        max: 4
                    },
                    imageSrc: './img/explosion.png',
                    offset: {
                        x: 0,
                        y: 0
                    }

                }))
                build.projectiles.splice(i, 1)
            }
        }
    })

}
animate();

canvas.addEventListener('click', () => {
    if (activeTile && !activeTile.occupied && coins >= 50) {
        coins -= 50
        document.querySelector('#coinCount').innerHTML = coins
        buildings.push(
            new Building({
                position: {
                    x: activeTile.position.x,
                    y: activeTile.position.y
                }
            })
        );
        activeTile.occupied = true;
        buildings.sort((a, b) => {
            return a.position.y - b.position.y
        })
    }
})
// event listeners
addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    activeTile = null
    for (let i = 0; i < placementsArray.length; i++) {
        let tile = placementsArray[i];
        if (mouseCollision(mouse, tile)) {
            activeTile = tile;
            break;
        }
    }
});
