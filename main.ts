namespace SpriteKind {
    export const weapon = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.weapon, SpriteKind.Enemy, function (sprite, otherSprite) {
    otherSprite.destroy()
    info.changeScoreBy(100)
    if (Math.percentChance(30) && weaponLevel < maxWeaponLevel) {
        powerUp = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . 5 5 5 5 5 5 5 . . . . . . 
            . . . 5 5 5 5 5 5 5 5 5 . . . . 
            . . . 5 5 4 . . . 5 5 5 5 . . . 
            . . . 5 5 4 . . . . . 5 5 4 . . 
            . . . 5 5 4 . . . . . 5 5 4 . . 
            . . . 5 5 4 . . . . . 5 5 4 . . 
            . . . 5 5 4 . . . . . 5 5 4 . . 
            . . . 5 5 4 . . . 5 5 5 5 4 . . 
            . . . 5 5 5 5 5 5 5 5 5 4 . . . 
            . . . 5 5 5 5 5 5 5 4 4 . . . . 
            . . . 5 5 4 4 4 4 4 . . . . . . 
            . . . 5 5 4 . . . . . . . . . . 
            . . . 5 5 4 . . . . . . . . . . 
            . . . 5 5 4 . . . . . . . . . . 
            `, SpriteKind.Food)
        powerUp.setPosition(otherSprite.x, otherSprite.y)
        powerUp.setVelocity(0, 50)
    }
})
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
    weaponLevel = 0
    bFighterDown = false
}
function cleanBullets () {
    if (listBullet.length > 0) {
        locBullet = listBullet.pop()
        while (locBullet.y < 0 && listBullet.length > 0) {
            locBullet.destroy()
            locBullet = listBullet.pop()
        }
        listBullet.push(locBullet)
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(bFighterDown) && listBullet.length < 20) {
        shootWeapon()
    }
})
function checkOutOfScreen () {
    for (let value of listGhost) {
        if (value.x < 0 || (value.x > 160 || value.y > 120)) {
            value.destroy()
        }
    }
}
info.onCountdownEnd(function () {
    if (countDownType == 0) {
        spawnFighter()
    } else {
        if (countDownType < 0) {
            game.over(false)
        } else {
            if (countDownType == 1) {
                game.over(true)
            }
        }
    }
})
function destroyFighter () {
    fighter.destroy(effects.fire, 200)
    bFighterDown = true
    info.changeLifeBy(-1)
    info.startCountdown(1)
    music.playTone(196, music.beat(BeatFraction.Whole))
}
function shootWeapon () {
    shootBulletPillar(weaponLevel, 1)
}
function s1clearboard () {
    while (listGhost.length > 0) {
        locGhost = listGhost.pop()
        locGhost.destroy(effects.disintegrate, 500)
    }
}
function spawnGhost () {
    if (Math.percentChance(70)) {
        if (currentStage == 1) {
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
                locGhost.setVelocity(0.6 * (fighter.x - locGhost.x), randint(60, 90))
                listGhost.push(locGhost)
            }
        }
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function (sprite, otherSprite) {
    otherSprite.destroy()
    destroyFighter()
})
info.onLifeZero(function () {
    game.over(false)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    otherSprite.destroy()
    sprite.startEffect(effects.halo, 500)
    if (weaponLevel < maxWeaponLevel) {
        weaponLevel += 1
    }
})
sprites.onDestroyed(SpriteKind.Enemy, function (sprite) {
    enemyGhostQuota += 1
    s1enemycount += -1
    if (s1enemycount <= 0) {
        currentStage = 2
        s1clearboard()
        if (countDownType != 1) {
            countDownType = 1
            info.startCountdown(1)
        }
    }
    listGhost.removeAt(listGhost.indexOf(sprite))
})
function ghostFire () {
    for (let value of listGhost) {
        if (value.y < 95) {
            if (Math.percentChance(7)) {
                projectile = sprites.createProjectileFromSprite(img`
                    . . 5 . . 
                    . 5 5 5 . 
                    5 5 5 5 5 
                    . 5 5 5 . 
                    . . 5 . . 
                    `, value, 0.8 * (fighter.x - value.x), 0.9 * (fighter.y - value.y))
            }
        }
    }
}
function shootBulletPillar (lvl: number, spread: number) {
    for (let index = 0; index <= lvl; index++) {
        bullet = sprites.createProjectileFromSprite(img`
            4 b 4 4 
            4 5 5 4 
            4 5 5 4 
            4 5 5 4 
            4 5 5 4 
            4 5 5 4 
            4 5 5 4 
            4 5 5 4 
            4 5 5 4 
            4 2 2 4 
            `, fighter, 0, -100)
        bullet.setKind(SpriteKind.weapon)
        bullet.setFlag(SpriteFlag.AutoDestroy, false)
        bullet.y += -7
        bullet.x += index * 4 - lvl * 2
        if (spread > 0) {
            bullet.vx += index * 4 - lvl * 2
        }
        listBullet.unshift(bullet)
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    otherSprite.destroy(effects.fire, 100)
    destroyFighter()
})
let bullet: Sprite = null
let projectile: Sprite = null
let locGhost: Sprite = null
let locBullet: Sprite = null
let bFighterDown = false
let fighter: Sprite = null
let powerUp: Sprite = null
let weaponLevel = 0
let maxWeaponLevel = 0
let listBullet: Sprite[] = []
let listGhost: Sprite[] = []
let enemyGhostQuota = 0
let countDownType = 0
let currentStage = 0
let s1enemycount = 0
game.splash("Stage 1: Ghosts")
s1enemycount = 23
currentStage = 1
scene.setBackgroundColor(15)
countDownType = 0
spawnFighter()
enemyGhostQuota = 8
listGhost = []
listBullet = []
maxWeaponLevel = 2
game.onUpdateInterval(50, function () {
    cleanBullets()
})
game.onUpdateInterval(500, function () {
    spawnGhost()
    checkOutOfScreen()
    ghostFire()
})
