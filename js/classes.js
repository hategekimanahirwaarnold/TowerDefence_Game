class Sprite {
    constructor({ 
        position = { x: 0, y: 0}, 
        imageSrc, 
        frames = { max: 1 },
        offset = {
            x: 0,
            y: 0
        }
    }) {
        this.image = new Image()
        this.image.src = imageSrc
        this.position = position
        this.frames = {
            max: frames.max,
            current: 0,
            elapsed: 0,
            hold: 4
        }
        this.offset = offset
    }

    draw() {
        let cropWidth = this.image.width / this.frames.max
        const crop = {
            position: {
                x: cropWidth * this.frames.current,
                y: 0
            },
            width: cropWidth,
            height: this.image.height
        }
        c.drawImage(
            this.image, 
            crop.position.x, 
            crop.position.y,
            crop.width,
            crop.height,
            this.position.x + this.offset.x,
            this.position.y + this.offset.y,
            crop.width,
            crop.height,
        )
    }

    update () {
        this.frames.elapsed++;
        if (this.frames.elapsed % this.frames.hold === 0) {
            this.frames.current++
        }
        if (this.frames.current >= this.frames.max) {
            this.frames.current = 0
        }
    }
}

class Enemy extends Sprite{

    constructor({ position}) {
        super({
            position,
            imageSrc : './img/orc.png',
            frames: {
                max: 7
            }
        })
        this.width = 100;
        this.height = 100;
        this.wayId = 0;
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }
        this.radius = 50
        this.health = 100
        this.speed = 2
        this.velocity = {
            x: 0,
            y: 0
        }
    }

    draw() {
        super.draw()
        super.update()

        // health bar
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y - 15, this.width, 10)
        
        c.fillStyle = 'green'
        c.fillRect(this.position.x, this.position.y - 15, this.width * this.health / 100, 10)
        
    }
    update() {
        this.draw();
        let wayPoint = ways[this.wayId]
        let yDist = wayPoint.y - this.center.y;
        let xDist = wayPoint.x - this.center.x
        let angle = atan2(yDist, xDist)
        this.velocity.x = cos(angle) * this.speed
        this.velocity.y = sin(angle) * this.speed
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }

        if (
            abs(round(this.center.x) - round(wayPoint.x)) < abs(this.velocity.x * this.speed) &&
            abs(round(this.center.y) - round(wayPoint.y)) < abs(this.velocity.y * this.speed) &&
            this.wayId < ways.length - 1
            ) {
                this.wayId++
            }
    }
}

class Placement {
    constructor({ position = {x: 0, y: 0}}) {
        this.position = position;
        this.size = 64;
        this.color = `rgba(255, 255, 255, .15)`;
        this.occupied = false;
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.size, this.size)
    }

    update(mouse) {
        this.draw()
        if (mouseCollision(mouse, this)
        ) {
            //handle mouse collision
            this.color = 'white'
            // this.alpha = 1
        } else {
            this.alpha = .15
            this.color = `rgba(255, 255, 255, .15)`
        }
    }
}

class Projectile extends Sprite {
    constructor({ position = { x: 0, y: 0}, enemy}) {
        super({
            position,
            imageSrc: './img/projectile.png'
        })
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0
        };
        this.radius = 10
        this.color = 'orange'
        this.enemy = enemy
        this.power = 5
    }

    update() {
        this.draw()
        let angle = Math.atan2(
            this.enemy.center.y - this.position.y,
            this.enemy.center.x - this.position.x)

        this.velocity.x = cos(angle)
        this.velocity.y = sin(angle)
        
        this.position.x += this.velocity.x * this.power
        this.position.y += this.velocity.y * this.power
    }
}

class Building extends Sprite{
    constructor({ position = {x: 0, y: 0}}) {
        super({
            position,
            imageSrc: './img/tower.png',
            frames: {
                max: 19,
                elapsed: 0,
                hold: 5
            },
            offset: {
                x: 0,
                y: -80
            }
        })
        this.width = 64 * 2;
        this.height = 64;
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        };
        this.projectiles = [];
        this.radius = 250;
        this.color = 'rgba(0, 0, 255, .2)';
        this.target;
        this.time = 0
    }

    draw() {
        super.draw()
        if (this.target || this.frames.current !== 0)
        super.update()

        // c.beginPath()
        // c.fillStyle = this.color;
        // c.arc(this.center.x, this.center.y, this.radius, 0, 2 * PI)
        // c.fill()
        // c.closePath()
    }
    
    update() {
        this.draw()
        if (this.target && this.frames.current === 6 &&
            this.frames.elapsed % this.frames.hold === 0
        ) {
            this.projectiles.push(
                new Projectile({
                    position: {
                        x: this.center.x - 20,
                        y: this.center.y - 110
                    },
                    enemy: this.target
                }))
        }
    }
}

