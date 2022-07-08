kaboom({
  fullscreen: true,
  clearColor: [0, 0.7, 1, 1],
  global: true,
  scale: 2,
});

loadRoot("./sprites/");
loadSprite("mario", "mario.png");
loadSprite("block", "block.png");
loadSprite("coin", "coin.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("suprise", "surprise.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("evil_mushroom", "evil_mushroom.png");
loadSound("jump", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");

let score = 0;

scene("game", () => {
  play("gameSound");
  layers(["bg", "obj", "ui"], "obj");
  const map = [
    "                                                                ",
    "                                                                ",
    "                                                                ",
    "                                                                ",
    "                                                                ",

    "                                                                ",
    "                                                                ",
    "             s                                                   ",
    "                                                                ",
    "                                                                ",

    "                                                                ",
    "                                      !                           ",
    "                                                            ",
    "                                                                                  =  =                                        ",
    "                                      = =   $                                  =     =  =   =                                        ",
    "                                  =         =                              ?  =      =            =                              ",
    "                       ==P ==  =               =  $          $        ! =            =                                                   ",
    "    vvv  $          =                              =   =    = =                P     =               =                  P                   ",
    "                                      ==      =          =         =                 =                                                   ",
    "===========================                                         ==================          ============================",
  ];
  const mapSymbole = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid()],
    $: [sprite("coin"), "coins"],
    v: [sprite("unboxed"), solid()],
    "?": [sprite("suprise"), solid(), "coin_surpise"],
    "!": [sprite("suprise"), solid(), "mushroom_surpise"],
    P: [sprite("pipe"), solid(), "pipe"],
    m: [sprite("mushroom"), solid(), "cool_mushroom", body()],
    s: [sprite("evil_mushroom"), solid(), body(), "evil_mushroom"],
  };

  const gameLevel = addLevel(map, mapSymbole);

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
  ]);

  const scoreLabel = add([text("score" + score)]);

  keyDown("right", () => {
    player.move(120, 0);
  });

  keyDown("left", () => {
    player.move(-120, 0);
  });
  keyDown("space", () => {
    if (player.grounded()) {
      play("jump");
      player.jump(300);
    }
  });

  player.collides("pipe", (obj) => {
    keyDown("down", () => {
      go("win");
    });
  });

  player.on("headbump", (obj) => {
    if (obj.is("coin_surpise")) {
      destroy(obj);
      gameLevel.spawn("v", obj.gridPos);
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
    }
    if (obj.is("mushroom_surpise")) {
      destroy(obj);
      gameLevel.spawn("v", obj.gridPos);
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));
    }
  });
  action("cool_mushroom", (obj) => {
    obj.move(20, 0);
  });

  player.collides("coins", (obj) => {
    score += 5;
    destroy(obj);
  });

  player.collides("cool_mushroom", (obj) => {
    destroy(obj);
    player.biggify(15);
  });
  const FALL_DOWN = 700;
  player.action(() => {
    camPos(player.pos);
    if (player.pos.y >= FALL_DOWN) {
      go("lose");
    }
  });
  player.action(() => {
    camPos(player.pos);
    scoreLabel.pos = player.pos.sub(400, 200);
    scoreLabel.text = "score: " + score;
  });

  action("evil_mushroom", (obj) => {
    obj.move(-20, 0);
  });

  let isJumping = false;

  player.collides("evil_mushroom", (obj) => {
    if (isJumping) {
      destroy(obj);
    } else {
      go("lose");
    }
  });
  player.action(() => {
    isJumping = !player.grounded();
  });
});

scene("lose", () => {
  add([
    text("Game Over\nTry again", 64),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  keyDown("space", () => {
    go("game");
  });
});

scene("win", () => {
  add([text("Wiiiin", 64), origin("center"), pos(width() / 2, height() / 2)]);

  keyDown("space", () => {
    go("game");
  });
});

start("game");
