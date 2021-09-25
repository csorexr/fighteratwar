namespace SpriteKind {
    export const weapon = SpriteKind.create()
    export const Bosses = SpriteKind.create()
    export const Missiles = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.weapon, SpriteKind.Enemy, function (sprite, otherSprite) {
    info.changeScoreBy(100)
    dropPowerUp(30, otherSprite)
    otherSprite.destroy()
    sprite.destroy()
})
function sustainBossS1Phase3 () {
    // if already finished several shots, change back to phase-2;
    // else keep following the plane
    if (bossPhaseFireCounter <= 0) {
        curBoss.setVelocity(0, 0)
        curBossPhase = 2
        bossPhaseFireCounter = 4
    } else {
        ensureBossFollowPlayer()
    }
}
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
function s1clearboard () {
    sprite_list = sprites.allOfKind(SpriteKind.Enemy)
    for (let value of sprite_list) {
        value.destroy(effects.disintegrate, 500)
    }
}
function cleanBullets () {
    sprite_list2 = sprites.allOfKind(SpriteKind.weapon)
    for (let value2 of sprite_list2) {
        if (value2.y < 0) {
            value2.destroy()
        }
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
    sprite_list2 = sprites.allOfKind(SpriteKind.weapon)
    if (!(bFighterDown) && sprite_list2.length < 20) {
        shootWeapon()
    }
})
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
            bossPhaseFireCounter += -1
        } else {
            bossFireCounter += -1
        }
    }
    if (curBossPhase == 3) {
        if (bossFireCounter == 0) {
            projectile = sprites.createProjectileFromSprite(img`
                9 9 9 9 9 9 9 9 9 9 9 9 
                9 9 9 9 9 9 9 9 9 9 9 9 
                9 9 9 9 9 9 9 9 9 9 9 9 
                9 9 9 9 9 9 9 9 9 9 9 9 
                9 9 9 9 9 9 9 1 9 9 9 9 
                9 9 9 9 9 9 9 1 9 9 9 9 
                9 9 9 9 9 9 9 1 9 9 9 9 
                9 9 9 9 9 9 9 1 9 9 9 9 
                9 9 9 9 9 9 9 1 9 9 9 9 
                9 9 9 1 9 9 9 1 9 9 9 9 
                9 9 9 1 9 9 9 1 9 9 9 9 
                9 9 9 1 9 9 9 1 9 9 9 9 
                9 9 9 1 9 9 9 1 9 9 9 9 
                9 9 9 1 9 9 9 1 9 9 9 9 
                9 9 9 9 9 9 9 1 9 9 9 9 
                9 9 9 9 9 9 9 1 9 9 9 9 
                9 9 9 9 9 9 9 1 9 9 9 9 
                9 9 9 9 9 9 9 9 9 9 9 9 
                9 9 9 9 9 9 9 9 9 9 9 9 
                9 9 9 9 9 9 9 9 9 9 9 9 
                `, curBoss, 0, 1.5 * (fighter.y - curBoss.y))
            projectile.setFlag(SpriteFlag.AutoDestroy, true)
            bossFireCounter = 2
            bossPhaseFireCounter += -1
        } else {
            bossFireCounter += -1
        }
    }
}
function ensureBossFollowPlayer () {
    if (Math.abs(fighter.x - curBoss.x) < 10) {
        curBoss.setVelocity(0, 0)
    } else {
        if (fighter.x < curBoss.x) {
            curBoss.setVelocity(-100, 0)
        } else {
            curBoss.setVelocity(100, 0)
        }
    }
}
function sustainBossS1 () {
    if (curBossPhase == 1) {
        sustainBossS1Phase1()
    } else if (curBossPhase == 2) {
        sustainBossS1Phase2()
    } else if (curBossPhase == 3) {
        sustainBossS1Phase3()
    }
}
sprites.onOverlap(SpriteKind.Missiles, SpriteKind.Bosses, function (sprite, otherSprite) {
    sprite.destroy()
    info.changeScoreBy(10)
    dropPowerUp(1, otherSprite)
    bossBeShot()
})
function destroyFighter () {
    if (!(bFighterDown)) {
        bFighterDown = true
        fighter.destroy(effects.fire, 200)
        info.changeLifeBy(-1)
        if (info.life() > 0) {
            timer.after(500, function () {
                spawnFighter()
            })
        } else {
            game.over(false)
        }
        music.playTone(196, music.beat(BeatFraction.Whole))
    }
}
function shootWeapon () {
    shootBulletPillar(weaponLevel, 1)
    shoot_missile("missile", 2)
}
statusbars.onZero(StatusBarKind.Health, function (status) {
    status.spriteAttachedTo().destroy(effects.disintegrate, 500)
    timer.after(500, function () {
        game.over(true)
    })
})
function spawnGhost () {
    if (Math.percentChance(70) && (currentStage == 1 && enemyGhostQuota > 0)) {
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
        locGhost.setFlag(SpriteFlag.AutoDestroy, true)
        locGhost.setPosition(randint(0, 160), 0)
        locGhost.setVelocity(0.6 * (fighter.x - locGhost.x), randint(60, 90))
    }
}
function shoot_missile (missile_type: string, num: number) {
    if ("missile" == missile_type) {
        for (let index2 = 0; index2 <= num - 1; index2++) {
            new_missle = sprites.createProjectileFromSprite(img`
                . . 1 1 . . 
                . d 1 1 1 . 
                d 1 1 1 1 . 
                d 1 1 1 1 . 
                d 1 1 1 1 . 
                d 1 1 d 1 . 
                d 1 1 d 1 . 
                d 1 1 d 1 . 
                d 1 1 d 1 1 
                1 1 1 1 1 1 
                1 1 1 1 1 1 
                1 . 4 4 . 1 
                `, fighter, Math.map(index2, 0, num - 1, -20, 20), 70)
            new_missle.setKind(SpriteKind.Missiles)
            new_missle.ay = -200
        }
    } else if ("homing" == missile_type) {
        for (let index2 = 0; index2 <= num - 1; index2++) {
            new_missle = sprites.createProjectileFromSprite(img`
                . . 6 6 . . 
                . d 6 6 6 . 
                d 6 6 6 6 . 
                d 6 6 6 6 . 
                d 6 6 6 6 . 
                d 6 6 d 6 . 
                d 6 6 d 6 . 
                d 6 6 d 6 . 
                d 6 6 d 6 6 
                6 6 6 6 6 6 
                6 6 6 6 6 6 
                6 . 4 4 . 6 
                `, fighter, Math.map(index2, 0, num - 1, -20, 20), 20)
            new_missle.setKind(SpriteKind.Missiles)
            find_target(new_missle)
        }
    }
}
sprites.onOverlap(SpriteKind.Missiles, SpriteKind.Enemy, function (sprite, otherSprite) {
    info.changeScoreBy(100)
    dropPowerUp(30, otherSprite)
    otherSprite.destroy()
    sprite.destroy()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function (sprite, otherSprite) {
    otherSprite.destroy()
    destroyFighter()
})
function sustainBossS1Phase1 () {
    if (curBoss.y >= 28) {
        curBoss.setVelocity(0, 0)
        curBossPhase = 2
        bossPhaseFireCounter = 4
    }
}
function chgPhase () {
    if (currentStage == 2) {
        sustainBossS1()
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    otherSprite.destroy()
    sprite.startEffect(effects.halo, 500)
    if (weaponLevel < maxWeaponLevel) {
        weaponLevel += 1
    }
})
function sustainBossS1Phase2 () {
    if (bossPhaseFireCounter <= 0) {
        curBossPhase = 3
        bossPhaseFireCounter = 8
    }
}
function bossBeShot () {
    statusbars.getStatusBarAttachedTo(StatusBarKind.Health, curBoss).value += -1
    info.changeScoreBy(10)
}
sprites.onDestroyed(SpriteKind.Enemy, function (sprite) {
    enemyGhostQuota += 1
    s1enemycount += -1
    if (s1enemycount <= 0) {
        if (currentStage < 2) {
            currentStage = 2
            s1clearboard()
            timer.after(500, function () {
                spawnBossS1()
            })
        }
    }
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
    statusbar = statusbars.create(20, 4, StatusBarKind.Health)
    statusbar.attachToSprite(curBoss)
    statusbar.value = 200
    curBossPhase = 1
    bossFireCounter = 0
}
function ghostFire () {
    let listGhost: Sprite[] = []
    for (let value22 of listGhost) {
        if (value22.y < 95) {
            if (Math.percentChance(7)) {
                projectile = sprites.createProjectileFromSprite(img`
                    . . 5 . . 
                    . 5 5 5 . 
                    5 5 5 5 5 
                    . 5 5 5 . 
                    . . 5 . . 
                    `, value22, 0.8 * (fighter.x - value22.x), 0.9 * (fighter.y - value22.y))
                projectile.setFlag(SpriteFlag.AutoDestroy, true)
            }
        }
    }
}
function find_target (spr_missile: Sprite) {
    if (currentStage == 1) {
        if (sprites.allOfKind(SpriteKind.Enemy).length > 0) {
            spr_missile.follow(sprites.allOfKind(SpriteKind.Enemy)._pickRandom())
        } else {
            spr_missile.ay = 200
        }
    } else if (currentStage == 2) {
        spr_missile.follow(sprites.allOfKind(SpriteKind.Bosses)._pickRandom())
    }
}
function shootBulletPillar (lvl: number, spread: number) {
    for (let index22 = 0; index22 <= lvl; index22++) {
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
        bullet.x += index22 * 4 - lvl * 2
        if (spread > 0) {
            bullet.vx += index22 * 4 - lvl * 2
        }
    }
}
sprites.onOverlap(SpriteKind.weapon, SpriteKind.Bosses, function (sprite, otherSprite) {
    sprite.destroy()
    info.changeScoreBy(10)
    dropPowerUp(1, otherSprite)
    bossBeShot()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    otherSprite.destroy(effects.fire, 100)
    destroyFighter()
})
let bullet: Sprite = null
let statusbar: StatusBarSprite = null
let new_missle: Sprite = null
let locGhost: Sprite = null
let projectile: Sprite = null
let maxEnemyScatterBullet = 0
let bossFireCounter = 0
let powerUp: Sprite = null
let sprite_list2: Sprite[] = []
let sprite_list: Sprite[] = []
let bFighterDown = false
let weaponLevel = 0
let fighter: Sprite = null
let curBossPhase = 0
let curBoss: Sprite = null
let bossPhaseFireCounter = 0
let maxWeaponLevel = 0
let enemyGhostQuota = 0
let currentStage = 0
let s1enemycount = 0
game.splash("Stage 1: Ghosts")
s1enemycount = 23
currentStage = 1
scene.setBackgroundColor(15)
spawnFighter()
enemyGhostQuota = 8
maxWeaponLevel = 2
info.setLife(3)
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
})
