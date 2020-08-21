function spawnFighter () {
    fighter = sprites.create(img`
        . . . . . . . c 2 . . . . . . . 
        . . . . . . . 2 2 . . . . . . . 
        . . . . . . 2 2 2 2 . . . . . . 
        . . . . . . 2 c b 2 . . . . . . 
        . . . . . 2 2 f f 2 . . . . . . 
        . . . . . 2 2 c 2 2 2 . . . . . 
        . . . . 2 2 2 f f 2 2 . . . . . 
        . . . . 2 2 2 e 2 2 2 2 . . . . 
        . . . 2 2 2 e e 4 e 2 2 2 . . . 
        . . 2 2 2 2 e 2 4 e 2 2 2 2 . . 
        . 2 2 2 2 c c c e e e 2 2 2 . . 
        2 2 2 2 e e 2 2 2 4 e e 2 2 2 . 
        2 2 2 f f f c c e e f f e e 2 2 
        f f f f . . . 2 2 2 . . f f f f 
        . . . . . c e e 2 2 2 . . . . . 
        . . . c c c e e 2 2 2 2 4 2 . . 
        `, SpriteKind.Player)
    controller.moveSprite(fighter)
    fighter.setPosition(76, 91)
    fighter.setFlag(SpriteFlag.StayInScreen, true)
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    shootWeapon()
})
function checkOutOfScreen () {
    for (let value of listGhost) {
        if (value.x < 0 || (value.x > 160 || value.y > 120)) {
            value.destroy()
        }
    }
}
info.onCountdownEnd(function () {
    spawnFighter()
})
function shootWeapon () {
    shootBulletPillar(4, 1)
}
info.onLifeZero(function () {
    game.over(false)
})
sprites.onDestroyed(SpriteKind.Enemy, function (sprite) {
    enemyGhostQuota += 1
    listGhost.removeAt(listGhost.indexOf(sprite))
})
function shootBulletPillar (lvl: number, spread: number) {
    for (let index = 0; index <= lvl; index++) {
        projectile = sprites.createProjectileFromSprite(img`
            4 b 4 
            4 5 4 
            4 5 4 
            4 5 4 
            4 5 4 
            4 5 4 
            4 5 4 
            b 2 b 
            `, fighter, 0, -100)
        projectile.y += -7
        projectile.x += index * 4 - lvl * 2
        projectile.vx += index * 4 - lvl * 2
    }
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    otherSprite.destroy(effects.fire, 100)
    info.changeScoreBy(100)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    otherSprite.destroy(effects.fire, 100)
    sprite.destroy(effects.disintegrate, 200)
    info.changeLifeBy(-1)
    info.startCountdown(1)
})
let locGhost: Sprite = null
let projectile: Sprite = null
let fighter: Sprite = null
let listGhost: Sprite[] = []
game.splash("Stage 1: Ghosts")
scene.setBackgroundColor(15)
spawnFighter()
let enemyGhostQuota = 8
listGhost = []
game.onUpdate(function () {
    checkOutOfScreen()
})
game.onUpdateInterval(500, function () {
    if (enemyGhostQuota > 0) {
        enemyGhostQuota += -1
        locGhost = sprites.create(img`
            . . . . . . . . . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . . . . . . . . . 
            . . . . . . . . . . f f f f . . . . . . . . . . 
            . . . . . . . . f f 1 1 1 1 f f . . . . . . . . 
            . . . . . . . f b 1 1 1 1 1 1 b f . . . . . . . 
            . . . . . . . f 1 1 1 1 1 1 1 1 f . . . . . . . 
            . . . . . . f d 1 1 1 1 1 1 1 1 d f . . . . . . 
            . . . . . . f d 1 1 1 1 1 1 1 1 d f . . . . . . 
            . . . . . . f d d d 1 1 1 1 d d d f . . . . . . 
            . . . . . . f b d b f d d f b d b f . . . . . . 
            . . . . . . f c d c f 1 1 f c d c f . . . . . . 
            . . . . . . . f b 1 1 1 1 1 1 b f . . . . . . . 
            . . . . . . f f f c d b 1 b d f f f f . . . . . 
            . . . . f c 1 1 1 c b f b f c 1 1 1 c f . . . . 
            . . . . f 1 b 1 b 1 f f f f 1 b 1 b 1 f . . . . 
            . . . . f b f b f f f f f f b f b f b f . . . . 
            . . . . . . . . . f f f f f f . . . . . . . . . 
            . . . . . . . . . . . f f f . . . . . . . . . . 
            . . . . . . . . . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . . . . . . . . . 
            `, SpriteKind.Enemy)
        locGhost.setPosition(randint(0, 160), 0)
        locGhost.setVelocity(1 * (fighter.x - locGhost.x), randint(80, 150))
        listGhost.push(locGhost)
    }
})
