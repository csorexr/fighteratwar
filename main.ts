namespace SpriteKind {
    export const weapon = SpriteKind.create()
    export const Bosses = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.weapon, SpriteKind.Enemy, function (sprite, otherSprite) {
    cleanSingleBullet(sprite)
    info.changeScoreBy(100)
    dropPowerUp(30, otherSprite)
    otherSprite.destroy()
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
function dropPowerUp (percentage: number, enmy: Sprite) {
    if (Math.percentChance(percentage) && weaponLevel < maxWeaponLevel) {
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
        powerUp.setPosition(enmy.x, enmy.y)
        powerUp.setVelocity(0, 50)
        powerUp.setFlag(SpriteFlag.AutoDestroy, true)
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(bFighterDown) && listBullet.length < 20) {
        shootWeapon()
    }
})
function cleanSingleBullet (blt: Sprite) {
    if (listBullet.length > 0) {
        listBullet.removeAt(listBullet.indexOf(blt))
        blt.destroy()
    }
}
function bossFire () {
    if (curBossPhase == 2) {
        if (bossFireCounter == 0) {
            maxEnemyScatterBullet = 2
            for (let index = 0; index <= maxEnemyScatterBullet; index++) {
                projectile = sprites.createProjectileFromSprite(img`
                    . . 5 . . 
                    . 5 5 5 . 
                    5 5 5 5 5 
                    . 5 5 5 . 
                    . . 5 . . 
                    `, curBoss, (index - maxEnemyScatterBullet / 2) * 33 + 0.8 * (fighter.x - curBoss.x), 0.9 * (fighter.y - curBoss.y))
                projectile.setFlag(SpriteFlag.AutoDestroy, true)
            }
            bossFireCounter = 3
        } else {
            bossFireCounter += -1
        }
    }
}
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
                chgStage(currentStage)
            }
        }
    }
})
function destroyFighter () {
    fighter.destroy(effects.fire, 200)
    countDownType = 0
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
                    ........................
                    ........................
                    ........................
                    ........................
                    ..........ffff..........
                    ........ff1111ff........
                    .......fb111111bf.......
                    .......f11111111f.......
                    ......fd11111111df......
                    ......fd11111111df......
                    ......fddd1111dddf......
                    ......fbdbfddfbdbf......
                    ......fcdcf11fcdcf......
                    .......fb111111bf.......
                    ......fffcdb1bdffff.....
                    ....fc111cbfbfc111cf....
                    ....f1b1b1ffff1b1b1f....
                    ....fbfbffffffbfbfbf....
                    .........ffffff.........
                    ...........fff..........
                    ........................
                    ........................
                    ........................
                    ........................
                    `, SpriteKind.Enemy)
                locGhost.setFlag(SpriteFlag.AutoDestroy, false)
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
function chgPhase () {
    if (currentStage == 2) {
        if (curBossPhase == 1) {
            if (curBoss.y >= 28) {
                curBoss.setVelocity(0, 0)
                curBossPhase = 2
            }
        }
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    otherSprite.destroy()
    sprite.startEffect(effects.halo, 500)
    if (weaponLevel < maxWeaponLevel) {
        weaponLevel += 1
    }
})
function bossBeShot () {
    curBossHP += -1
    if (curBossHP <= 0) {
        curBoss.destroy()
    }
}
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
function spawnBossS1 () {
    game.splash("WARNING: Boss approaching")
    curBoss = sprites.create(img`
        ................................................
        ................................................
        ................................................
        ..................fffffffffff...................
        .................fdddddddddddf..................
        ...............ffdd111111111ddff................
        ..............f11111111111111111f...............
        .............f1111111111111111111f..............
        .............f1111111111111111111f..............
        ............f111111111111111111111f.............
        ...........fddd11111111111111111dddf............
        ...........fddd11111111111111111dddf............
        ...........fddd11111111111111111dddf............
        ...........fddd11111111111111111dddf............
        ...........fddd11111111111111111dddf............
        ...........fddd11111111111111111dddf............
        ...........fddd1111fff1111fff111dddf............
        ...........fddd1111fff1111fff111dddf............
        ...........fdddddd1fff1111fff111dddf............
        ...........fcddddd1fff1111fff11ddccf............
        ...........fccddddcfff1111fffc1ddccf............
        ............fcddddcfff1111fffcddccf.............
        .............fcddddfff1111fffddccf..............
        .............fdddddddddddddddddccf..............
        ..............fdddddddddddddddddf...............
        ...............ffddcdcdcdcdcddff................
        ...........ffff11fdcdcdcdcdcdf11ffffff.f........
        ........ffff111111fffffffffff1111111ffffff......
        ......fff11111111111111111111111111111111ff.....
        .....ff11111111111111111111111111111111111ff....
        ...fff11dddddddddddd1111111ddddddddd1111111ff...
        ...f1111dddddddddddd1111111ddddddddd11111111f...
        ..f11111ddddddddddddfffffffddddddddd11111111ff..
        .ffbbbbbbbffbbb1f11fffffffff111bbbfbbbbffbbb1f..
        .f1bbbbbbbffbbb1f11fffffffff111bbbfbbbbffbbb11f.
        .ffbbbbbbbffbbb1ff1fffffffff111bbbfbbbbffbbb1ff.
        ..ffffffffffffffffffffffffffffffffffffffffffff..
        .................ffffffffffffffff...........f...
        .................fffffffffffff..................
        ..................ffffffffff.f..................
        ....................ffffffffff..................
        ....................fffffffff...................
        ....................fffffffff...................
        ....................f.fffff.....................
        ......................fffff.....................
        .......................ffff.....................
        ........................fff.....................
        .........................ffff...................
        `, SpriteKind.Bosses)
    curBoss.setPosition(80, -1)
    curBoss.setVelocity(0, 50)
    curBossHP = 150
    curBossPhase = 1
    bossFireCounter = 0
}
function chgStage (stg: number) {
    if (stg == 2) {
        spawnBossS1()
    }
}
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
                projectile.setFlag(SpriteFlag.AutoDestroy, true)
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
sprites.onOverlap(SpriteKind.weapon, SpriteKind.Bosses, function (sprite, otherSprite) {
    cleanSingleBullet(sprite)
    info.changeScoreBy(10)
    dropPowerUp(1, otherSprite)
    bossBeShot()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    otherSprite.destroy(effects.fire, 100)
    destroyFighter()
})
let bullet: Sprite = null
let curBossHP = 0
let locGhost: Sprite = null
let curBoss: Sprite = null
let projectile: Sprite = null
let maxEnemyScatterBullet = 0
let bossFireCounter = 0
let curBossPhase = 0
let powerUp: Sprite = null
let locBullet: Sprite = null
let bFighterDown = false
let weaponLevel = 0
let fighter: Sprite = null
let maxWeaponLevel = 0
let listBullet: Sprite[] = []
let listGhost: Sprite[] = []
let enemyGhostQuota = 0
let countDownType = 0
let currentStage = 0
let s1enemycount = 0
game.splash("Stage 1: Ghosts")
s1enemycount = 3
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
    chgPhase()
})
game.onUpdateInterval(500, function () {
    if (currentStage == 1) {
        spawnGhost()
        ghostFire()
    }
    if (currentStage == 2) {
        bossFire()
    }
    checkOutOfScreen()
})
