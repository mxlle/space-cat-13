import { bindKeys, Text } from 'kontra';
import { GameObject, ObjectType } from './gameObject';
import { GOAL } from './score';
import { SWAP_TIME } from './game';

export class Cat extends GameObject {
  _character;
  _score = 0;
  _leftKey;
  _rightKey;
  _swapMarker;
  _trophyMarker;
  _random = true;
  _swappedControls = false;
  _swapTimeout;

  constructor(character, leftKey, rightKey) {
    super(ObjectType.CAT, character);

    this._character = character;

    this._swapMarker = new Text({ text: '↔️', font: '30px sans-serif', x: this.obj.width - 30 });
    this._trophyMarker = new Text({ text: '🏆️', font: '30px sans-serif', x: this.obj.width - 30 });
    this.obj.children.push(this._swapMarker, this._trophyMarker);
    this._swapMarker.opacity = 0;
    this._trophyMarker.opacity = 0;

    bindKeys(leftKey, () => {
      this.controlManually();
      if (!this._swappedControls) {
        this.turnLeft();
      } else {
        this.turnRight();
      }
    });

    bindKeys(rightKey, () => {
      this.controlManually();
      if (!this._swappedControls) {
        this.turnRight();
      } else {
        this.turnLeft();
      }
    });

    this._leftKey = leftKey === 'left' ? '&larr;' : leftKey.toUpperCase();
    this._rightKey = rightKey === 'right' ? '&rarr;' : rightKey.toUpperCase();
  }

  controlManually() {
    this._random = false;
  }

  deceleratingWormhole() {
    this.wormhole();
    this.startMoving();
  }

  startMoving() {
    if (Math.random() < 0.5) {
      this.obj.dx = getStartVelocity();
      this.obj.dy = 0;
    } else {
      this.obj.dx = 0;
      this.obj.dy = getStartVelocity();
    }
  }

  move() {
    this.obj.update();
    wrapObjectOnEdge(this.obj);

    if (this._random && Math.random() < 0.02) {
      Math.random() < 0.5 ? this.turnRight() : this.turnLeft();
    }
  }

  turnLeft() {
    const obj = this.obj;
    const velocity = Math.abs(obj.dx) || Math.abs(obj.dy);
    if (obj.dx === 0) {
      obj.dx = obj.dy < 0 ? -1 * velocity : velocity;
      obj.dy = 0;
    } else {
      obj.dy = obj.dx < 0 ? velocity : -1 * velocity;
      obj.dx = 0;
    }
    //obj.rotation = Math.abs(obj.rotation - Math.PI/2);
  }

  turnRight() {
    const obj = this.obj;
    const velocity = Math.abs(obj.dx) || Math.abs(obj.dy);
    if (obj.dx === 0) {
      obj.dx = obj.dy < 0 ? velocity : -1 * velocity;
      obj.dy = 0;
    } else {
      obj.dy = obj.dx < 0 ? -1 * velocity : velocity;
      obj.dx = 0;
    }
    //obj.rotation = (obj.rotation + Math.PI/2) % (Math.PI*2);
  }

  speedUp() {
    if (this.obj.dx === 0 && this.obj.dy === 0) {
      this.startMoving();
    } else if (this.obj.dx === 0) {
      this.obj.dy = this.obj.dy > 0 ? this.obj.dy + 1 : this.obj.dy - 1;
    } else {
      this.obj.dx = this.obj.dx > 0 ? this.obj.dx + 1 : this.obj.dx - 1;
    }
  }

  swapControls() {
    this._swappedControls = true;
    this._swapMarker.opacity = 1;

    if (this._swapTimeout) clearTimeout(this._swapTimeout);

    this._swapTimeout = setTimeout(() => {
      this._swapMarker.opacity = 0;
      this._swappedControls = false;
      this._swapTimeout = undefined;
    }, SWAP_TIME);
  }

  stop() {
    this.obj.dx = 0;
    this.obj.dy = 0;
    this._random = true;
    this._swapMarker.opacity = 0;
  }

  incScore() {
    this._score++;
    return this._score === GOAL;
  }

  resetScore() {
    this._score = 0;
    this._trophyMarker.opacity = 0;
  }

  getScoreOutput() {
    return `${this._character}&nbsp;[${this._leftKey}]&nbsp;[${this._rightKey}]&nbsp;Score:&nbsp;${this._score}`;
  }

  hasWon() {
    const hasWon = this._score >= GOAL;
    if (hasWon) this._trophyMarker.opacity = 1;
    return hasWon;
  }
}

function getStartVelocity() {
  return Math.random() < 0.5 ? -3 : 3;
}

function wrapObjectOnEdge(obj) {
  if (obj.x > window.innerWidth) {
    obj.x = -obj.width;
  }
  if (obj.x < -obj.width) {
    obj.x = window.innerWidth;
  }
  if (obj.y > window.innerHeight) {
    obj.y = -obj.height;
  }
  if (obj.y < -obj.height) {
    obj.y = window.innerHeight;
  }
}
