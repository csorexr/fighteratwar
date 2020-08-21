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
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    shootWeapon()
})
function shootWeapon () {
    shootBulletPillar(4)
}
function shootBulletPillar (lvl: number) {
    for (let index = 0; index <= lvl; index++) {
        projectile = sprites.createProjectileFromSprite(img`
            4 c 4 
            4 5 4 
            4 5 4 
            4 5 4 
            4 5 4 
            4 5 4 
            4 5 4 
            b b b 
            `, fighter, 0, -100)
        projectile.y += -7
        projectile.x += index * 4 - lvl * 2
    }
}
let projectile: Sprite = null
let fighter: Sprite = null
scene.setBackgroundColor(13)
spawnFighter()
