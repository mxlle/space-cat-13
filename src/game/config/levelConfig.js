import { GameObject } from '../gameObjects/gameObject';
import { getAllPlayers } from './players';
import { MovingObject } from '../gameObjects/movingObject';
import { getValidObjectTypes, ObjectType } from './objectType';
import { initLevelValidator } from '../globals';

function getSupportedLevelConfigArray(levelConfig) {
  let emojiArray = splitEmojis(levelConfig);
  let configArray = getAllPlayers().filter((player) => emojiArray.includes(player));
  configArray.push(...emojiArray.filter(isNotPlayerEmoji));

  if (!configArray.some(isPlayerEmoji)) {
    configArray.unshift(getAllPlayers()[0]); // at least one player
  }

  if (!configArray.includes(ObjectType.TARGET)) {
    configArray.push(ObjectType.TARGET);
  }

  return configArray;
}

initLevelValidator(getSupportedLevelConfigArray);

export function getGameObjectsFromConfigArray(configLevelArray, size) {
  return configLevelArray.filter(isNotPlayerEmoji).map((emoji) => {
    if (getValidObjectTypes().includes(emoji)) {
      // predefined type
      return new GameObject({ type: emoji, size });
    } else {
      // custom object
      return emojiLives(emoji) ? new MovingObject({ emoji, size }) : new GameObject({ type: emoji, size });
    }
  });
}

function emojiLives(emoji) {
  const regexExp =
    /([\u{1F3CE}\u{02603}\u{026c4}\u{026f4}-\u{026f9}\u{02708}\u{1f385}\u{1f3c2}-\u{1f3c4}\u{1f3c7}\u{1f400}-\u{1f43d}\u{1f43f}\u{1f466}-\u{1f47f}\u{1f481}-\u{1f483}\u{1f486}-\u{1f487}\u{1f574}-\u{1f575}\u{1f577}\u{1f57a}\u{1f600}-\u{1f64c}\u{1f64d}-\u{1f64e}\u{1f680}-\u{1f68e}\u{1f690}-\u{1f6a4}\u{1f6b2}\u{1f6b4}-\u{1f6b5}\u{1f6e5}\u{1f6e9}\u{1f691}-\u{1f697}\u{1f920}-\u{1f931}\u{1f934}-\u{1f93e}\u{1f970}-\u{1f97a}\u{1f980}-\u{1f9ae}\u{1f9cd}\u{1f9cf}-\u{1f9df}\u{1fab0}-\u{1fab3}])/giu;

  return regexExp.test(emoji);
}

function isPlayerEmoji(emoji) {
  return getAllPlayers().includes(emoji);
}

function isNotPlayerEmoji(emoji) {
  return !isPlayerEmoji(emoji);
}

function splitEmojis(string) {
  const list = [];
  while (string.length) {
    const [char] = string.match(
      /^[\u{1F1E6}-\u{1F1FF}]{2}|.[\ufe0e\ufe0f]?[\u{1F3FB}-\u{1F3FF}]?(\u200d\p{Emoji}[\ufe0e\ufe0f]?|[\u{E0020}-\u{E007F}])*[\ufe0e\ufe0f]?/u
    );
    if (isCharacterEmoji(char)) {
      list.push(char);
    }
    string = string.slice(char.length);
  }
  return list;
}

function isCharacterEmoji(char) {
  const regexExp = /\p{Emoji}/u;

  return regexExp.test(char);
}
