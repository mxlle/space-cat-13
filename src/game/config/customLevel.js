import { GameObject, ObjectType } from '../gameObjects/gameObject';
import { Cat } from '../gameObjects/cat';
import { ALL_CATS } from './players';
import { LEVEL_OBJECTS } from './levels';
import { getStoredCustomGoal, getStoredCustomLevelConfig } from '../store';

export const CUSTOM_LEVEL_ID = 13;

export function getCurrentCustomLevelConfig() {
  const BONUS_LEVEL_DEFAULT_CONFIG = ALL_CATS.join('') + LEVEL_OBJECTS.join('') + LEVEL_OBJECTS.join('') + '👽👽🐙🐙🍔🍔🍔🍔🍔';
  return getStoredCustomLevelConfig() || BONUS_LEVEL_DEFAULT_CONFIG;
}

export function getCurrentCustomGoal() {
  return getStoredCustomGoal() || CUSTOM_LEVEL_ID;
}

export function getSupportedLevelConfigArray(levelConfig) {
  let emojiArray = splitEmojis(levelConfig);
  emojiArray = filterDuplicatePlayers(emojiArray);

  if (!emojiArray.some(isPlayerEmoji)) {
    emojiArray.unshift(ALL_CATS[0]); // at least one cat
  }

  if (!emojiArray.includes(ObjectType.SYNTH)) {
    emojiArray.push(ObjectType.SYNTH);
  }

  return emojiArray;
}

export function getGameObjectsFromConfigArray(configLevelArray, size) {
  return configLevelArray
    .filter(isNotPlayerEmoji)
    .map((emoji) => (emojiLives(emoji) ? new Cat({ character: emoji, size }) : new GameObject({ type: emoji, size })));
}

function emojiLives(emoji) {
  const regexExp =
    /([\u{02603}\u{026c4}\u{026f4}-\u{026f9}\u{02708}\u{1f385}\u{1f3c2}-\u{1f3c4}\u{1f3c7}\u{1f400}-\u{1f43d}\u{1f43f}\u{1f466}-\u{1f47f}\u{1f481}-\u{1f483}\u{1f486}-\u{1f487}\u{1f574}-\u{1f575}\u{1f577}\u{1f57a}\u{1f600}-\u{1f64c}\u{1f64d}-\u{1f64e}\u{1f680}-\u{1f68e}\u{1f690}-\u{1f6a4}\u{1f6b2}\u{1f6b4}-\u{1f6b5}\u{1f6e5}\u{1f6e9}\u{1f691}-\u{1f697}\u{1f920}-\u{1f931}\u{1f934}-\u{1f93e}\u{1f970}-\u{1f97a}\u{1f980}-\u{1f9ae}\u{1f9cd}\u{1f9cf}-\u{1f9df}\u{1fab0}-\u{1fab3}])/giu;

  return regexExp.test(emoji);
}

function filterDuplicatePlayers(emojiArray) {
  return emojiArray.filter((emoji, index) => {
    return isNotPlayerEmoji(emoji) || emojiArray.indexOf(emoji) === index;
  });
}

function isPlayerEmoji(emoji) {
  return ALL_CATS.includes(emoji);
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
    if (characterIsEmoji(char)) {
      list.push(char);
    }
    string = string.slice(char.length);
  }
  return list;
}

function characterIsEmoji(char) {
  const regexExp = /\p{Emoji}/u;

  return regexExp.test(char);
}
