class Player {
  constructor(game, character, x, y) {
    this.game = game;

    let bodyContainer = this.game.add.container(x, y);
    this.bodyContainer = bodyContainer;

    let eyeContainter = this.game.add.container(0, 0);
    this.eyeContainter = eyeContainter;

    let socketContainer = this.game.add.container(0, 0);
    this.socketContainer = socketContainer;

    this.eyes = character.eyes;

    let type = character.type.toLowerCase();
    let colour = character.colour;
    let size = character.size;

    this.rotation = this.isRotated(x, y);

    this.generateBody(type, size, this.eyes, colour, this.rotation);
  }

  isRotated(x, y) {
    if (x < 300) return 90;
    if (x > 500) return -90;
    if (y < 300) return 180;
    return 0;
  }

  generateBody(type, size, eyes, colour, rotation) {
    let xPos = this.placeSprites(size, 38, 0, `${type}Middle`, this.bodyContainer, colour);
    let leftEdge = this.game.add.sprite(xPos * -1, 0, `${type}Left`).setOrigin(0.5, 0.5);

    if (colour != null) leftEdge.tint = colour;

    let endOffset = (leftEdge.width - 38) / 2;
    leftEdge.x = leftEdge.x - endOffset;
    this.bodyContainer.add(leftEdge);

    let rightEdge = this.game.add.sprite(xPos, 0, `${type}Right`).setOrigin(0.5, 0.5);

    if (colour != null) rightEdge.tint = colour;

    let yOffset = rightEdge.height - 49;
    rightEdge.x = rightEdge.x + endOffset;
    this.bodyContainer.add(rightEdge);

    this.placeSprites(eyes, 32, -20, 'eye', this.eyeContainter);
    this.placeSprites(eyes, 32, -20, 'socket', this.socketContainer, colour);

    this.bodyContainer.add(this.eyeContainter);
    this.bodyContainer.add(this.socketContainer);

    this.socketContainer.each(this.toggleEyes, '', true);

    this.bodyContainer.each(object => { object.y = object.y += yOffset });
    this.bodyContainer.angle = rotation;
  }

  toggleEyes(socket, shouldOpen) {
    shouldOpen ? socket.setFrame('SocketOpen') : socket.setFrame('SocketClosed');
  }

  loseLife() {
    let socket = this.socketContainer.list[this.eyes - 1];
    if (socket) socket.setFrame('SocketClosed');
    this.eyes--;
  }

  placeSprites(spriteCount, widthOffset, heightOffset, sprite, container, colour = null) {
    let xPos = widthOffset / 2;

    if (spriteCount == 0) {
      //
    } else if (spriteCount % 2 == 1 && spriteCount != 0) {
      xPos = 0;
      let middleSprite = this.game.add.sprite(xPos, heightOffset, sprite).setOrigin(0.5, 0.5);

      if (colour != null) middleSprite.tint = colour;

      container.add(middleSprite);
      xPos = widthOffset;
      spriteCount--;
    }

    for (let i = 0; i < spriteCount / 2; i++) {
      let rightSprite = this.game.add.sprite(xPos, heightOffset, sprite).setOrigin(0.5, 0.5);
      let leftSprite = this.game.add.sprite(xPos * -1, heightOffset, sprite).setOrigin(0.5, 0.5);

      if (colour != null) rightSprite.tint = colour;
      if (colour != null) leftSprite.tint = colour;

      container.add(rightSprite);
      container.add(leftSprite);
      xPos += widthOffset;
    }

    return xPos;
  }

  animateMovement(direction) {
    this.bodyContainer.each(this.chooseAnimation, '', direction);
  }

  chooseAnimation(sprite, direction) {
    if (sprite.type == 'Sprite') {
      let spriteName = sprite.texture.key;
      sprite.anims.play(`${spriteName}${direction}`, true);
    }
  }

  move(newX, newY) {
    let x = this.bodyContainer.x;
    let y = this.bodyContainer.y;

    switch (true) {
      case (x < newX || y < newY):
        (this.rotation == 0 || this.rotation == 90) ? this.animateMovement('Right') : this.animateMovement('Left');
        break;
      case (x == newX && y == newY):
        this.animateMovement('Idle');
        break;
      case (x > newX || y > newY):
        (this.rotation == 0 || this.rotation == 90) ? this.animateMovement('Left') : this.animateMovement('Right');
        break;
    }

    this.bodyContainer.x = newX;
    this.bodyContainer.y = newY;
  }

  destroy() {
    this.eyeContainter.destroy();
    this.socketContainer.destroy();
    this.bodyContainer.destroy();
  }
}