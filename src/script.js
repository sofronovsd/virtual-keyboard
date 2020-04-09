let textarea;
let keyboard;

function onKeyDown(keyElement) {
  if (keyElement !== undefined) {
    keyElement.dispatchEvent(new Event('mousedown'));
  }
}

function onSpecialKeyDown(keyContent) {
  if (keyContent !== undefined) {
    const keys = [...keyboard.elements.keys];
    const keyElement = keys.find((element) => element.textContent === keyContent);
    keyElement.dispatchEvent(new Event('mousedown'));
  }
}

function onKeyUp(keyElement) {
  if (keyElement !== undefined) {
    keyElement.dispatchEvent(new Event('mouseup'));
  }
}

function onSpecialKeyUp(keyContent) {
  if (keyContent !== undefined) {
    const keys = [...keyboard.elements.keys];
    const keyElement = keys.find((element) => element.textContent === keyContent);
    keyElement.dispatchEvent(new Event('mouseup'));
  }
}

function handleAltShift() {
  let { locale } = keyboard.properties;
  if (locale === 'rus') {
    locale = 'en';
  } else {
    locale = 'rus';
  }
  window.localStorage.setItem('keyboardLocale', locale);
  document.body.removeChild(keyboard.elements.main);
  keyboard.init();
}

function handleBackspaceClick() {
  const index = textarea.getCaret();
  let value = textarea.getValue();
  value = value.substring(0, index - 1) + value.substring(index, value.length);
  textarea.setValue(value);
}

function handleEnterClick() {
  const value = textarea.getValue();
  textarea.setValue(`${value}\n`);
}

function handleSpaceClick() {
  const value = textarea.getValue();
  textarea.setValue(`${value} `);
}

function handleDeleteClick() {
  const index = textarea.getCaret();
  let value = textarea.getValue();
  value = value.substring(0, index) + value.substring(index + 1, value.length);
  textarea.setValue(value);
}

function handleKeyMouseDown(event) {
  const { target } = event;
  target.classList.add('keyboard__key_active');
}

function handleKeyMouseUp(event) {
  const { target } = event;
  target.classList.remove('keyboard__key_active');
}

function handleKeyMouseOut(event) {
  const { target } = event;
  target.classList.remove('keyboard__key_active');
}

function isCommonKey(key) {
  return !(key.classList.contains('keyboard__key_medium')
      || key.classList.contains('keyboard__key_wide')
      || key.classList.contains('keyboard__key_extra-wide'));
}

function handleKeyClick(event) {
  const { target } = event;
  let value = textarea.getValue();
  value += keyboard.getCapsLock()
    ? target.textContent.toUpperCase() : target.textContent.toLowerCase();
  textarea.setValue(value);
}

function handleCapslockClick() {
  const capslock = keyboard.getCapsLock();
  keyboard.setCapsLock(!capslock);

  const keys = keyboard.getKeys();

  keys.forEach((key) => {
    if (isCommonKey(key)) {
      key.textContent = keyboard.getCapsLock()
        ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
    }
  });
}

function handleShiftMouseDown() {
  keyboard.setCapsLock(true);
}

function handleShiftMouseUp() {
  keyboard.setCapsLock(false);
}

class Textarea {
  constructor() {
    this.elements = {
      textarea: null,
    };
    this.init();
  }

  init() {
    const textareaElement = document.createElement('textarea');
    textareaElement.classList.add('textarea');

    let isAlt = false;
    textareaElement.addEventListener('keydown', (event) => {
      const { code } = event;
      const keys = [...keyboard.elements.keys];
      let isCode = false;
      const keyMap = keyboard.getKeyMap();

      switch (code) {
        case 'Space': {
          onSpecialKeyDown(keyMap.get('Space'));
          isCode = true;
          break;
        }
        case 'Enter': {
          onSpecialKeyDown(keyMap.get('Enter'));
          isCode = true;
          break;
        }
        case 'Backspace': {
          onSpecialKeyDown(keyMap.get('Backspace'));
          isCode = true;
          break;
        }
        case 'CapsLock': {
          onSpecialKeyDown(keyMap.get('CapsLock'));
          handleCapslockClick();
          isCode = true;
          break;
        }
        case 'Delete': {
          onSpecialKeyDown(keyMap.get('Delete'));
          isCode = true;
          break;
        }
        case 'AltLeft': {
          onSpecialKeyDown(keyMap.get('AltLeft'));
          isAlt = true;
          isCode = true;
          break;
        }
        case 'ShiftLeft': {
          onSpecialKeyDown(keyMap.get('ShiftLeft'));
          if (isAlt) {
            handleAltShift();
            isAlt = false;
          }

          isCode = true;
          break;
        }
        default:
          break;
      }

      if (!isCode) {
        const { key } = event;
        const keyElement = keys.find((element) => element.textContent === key);
        onKeyDown(keyElement);
      }
    });

    textareaElement.addEventListener('keyup', (event) => {
      const { code } = event;
      const keys = [...keyboard.elements.keys];
      let isCode = false;
      const keyMap = keyboard.getKeyMap();

      switch (code) {
        case 'Space': {
          onSpecialKeyUp(keyMap.get('Space'));
          isCode = true;
          break;
        }
        case 'Enter': {
          onSpecialKeyUp(keyMap.get('Enter'));
          isCode = true;
          break;
        }
        case 'Backspace': {
          onSpecialKeyUp(keyMap.get('Backspace'));
          isCode = true;
          break;
        }
        case 'CapsLock': {
          onSpecialKeyUp(keyMap.get('CapsLock'));
          isCode = true;
          break;
        }
        case 'Delete': {
          onSpecialKeyUp(keyMap.get('Delete'));
          isCode = true;
          break;
        }
        case 'AltLeft': {
          onSpecialKeyUp(keyMap.get('AltLeft'));
          isAlt = false;
          isCode = true;
          break;
        }
        case 'ShiftLeft': {
          onSpecialKeyUp(keyMap.get('ShiftLeft'));
          isCode = true;
          break;
        }
        default:
          break;
      }

      if (!isCode) {
        const { key } = event;
        const keyElement = keys.find((element) => element.textContent === key);
        onKeyUp(keyElement);
      }
    });

    textareaElement.value = '';
    this.elements.textarea = textareaElement;
    document.body.appendChild(textareaElement);
  }

  setValue(value) {
    this.elements.textarea.value = value;
  }

  getValue() {
    return this.elements.textarea.value;
  }

  getCaret() {
    this.elements.textarea.focus();
    return this.elements.textarea.selectionStart !== undefined
      ? this.elements.textarea.selectionStart : this.elements.textarea.value.length;
  }
}

class Keyboard {
  constructor() {
    this.init();
  }

  init() {
    this.elements = {
      main: null,
      keysContainer: null,
      keys: [],
    };

    this.properties = {
      capsLock: false,
      locale: null,
      keyMap: null,
    };

    this.initKeyMap();

    const keyboardLocale = window.localStorage.getItem('keyboardLocale');
    this.properties.locale = keyboardLocale !== null ? keyboardLocale : 'rus';

    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    this.elements.main.classList.add('keyboard');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);
  }

  initKeyMap() {
    const keyMap = new Map();
    keyMap.set('Space', 'SPACE');
    keyMap.set('Enter', 'ENTER');
    keyMap.set('Backspace', 'BACKSPACE');
    keyMap.set('CapsLock', 'CAPSLOCK');
    keyMap.set('Delete', 'DEL');
    keyMap.set('AltLeft', 'ALT');
    keyMap.set('ShiftLeft', 'SHIFT');
    this.properties.keyMap = keyMap;
  }

  getKeyMap() {
    return this.properties.keyMap;
  }

  getKeys() {
    return this.elements.keys;
  }

  getCapsLock() {
    return this.properties.capsLock;
  }

  setCapsLock(capslock) {
    this.properties.capsLock = capslock;
  }

  createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      { rus: 'ё', en: '`' }, '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace',
      'del', { rus: 'й', en: 'q' }, { rus: 'ц', en: 'w' }, { rus: 'у', en: 'e' }, { rus: 'к', en: 'r' }, {
        rus: 'е',
        en: 't',
      },
      { rus: 'н', en: 'y' }, { rus: 'г', en: 'u' }, { rus: 'ш', en: 'i' }, { rus: 'щ', en: 'o' }, { rus: 'з', en: 'p' },
      { rus: 'х', en: '[' }, { rus: 'ъ', en: ']' },
      'capslock', { rus: 'ф', en: 'a' }, { rus: 'ы', en: 's' }, { rus: 'в', en: 'd' }, { rus: 'а', en: 'f' }, {
        rus: 'п',
        en: 'g',
      },
      { rus: 'р', en: 'h' }, { rus: 'о', en: 'j' }, { rus: 'л', en: 'k' }, { rus: 'д', en: 'l' }, { rus: 'ж', en: ';' },
      { rus: 'э', en: '\'' },
      'shift', { rus: 'я', en: 'z' }, { rus: 'ч', en: 'x' }, { rus: 'с', en: 'c' }, { rus: 'м', en: 'v' }, {
        rus: 'и',
        en: 'b',
      },
      { rus: 'т', en: 'n' }, { rus: 'ь', en: 'm' }, { rus: 'б', en: ',' }, { rus: 'ю', en: '.' }, 'enter',
      'alt', 'space',
    ];

    keyLayout.forEach((key) => {
      const keyElement = document.createElement('button');

      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      switch (key) {
        case 'backspace': {
          keyElement.classList.add('keyboard__key_wide');
          keyElement.textContent = key.toUpperCase();

          keyElement.addEventListener('click', handleBackspaceClick);
          break;
        }

        case 'capslock': {
          keyElement.classList.add('keyboard__key_wide');
          keyElement.textContent = key.toUpperCase();

          keyElement.addEventListener('click', handleCapslockClick);
          break;
        }

        case 'enter': {
          keyElement.classList.add('keyboard__key_wide');
          keyElement.textContent = key.toUpperCase();

          keyElement.addEventListener('click', handleEnterClick);
          break;
        }

        case 'space': {
          keyElement.classList.add('keyboard__key_extra-wide');
          keyElement.textContent = key.toUpperCase();

          keyElement.addEventListener('click', handleSpaceClick);
          break;
        }

        case 'del': {
          keyElement.classList.add('keyboard__key_medium');
          keyElement.textContent = key.toUpperCase();

          keyElement.addEventListener('click', handleDeleteClick);
          break;
        }

        case 'shift': {
          keyElement.classList.add('keyboard__key_medium');
          keyElement.textContent = key.toUpperCase();

          keyElement.addEventListener('mousedown', handleShiftMouseDown);
          keyElement.addEventListener('mouseup', handleShiftMouseUp);
          break;
        }

        case 'alt': {
          keyElement.classList.add('keyboard__key_medium');
          keyElement.textContent = key.toUpperCase();
          break;
        }

        default: {
          if (typeof key === 'object') {
            keyElement.textContent = key[this.properties.locale].toLowerCase();
          } else {
            keyElement.textContent = key.toLowerCase();
          }

          keyElement.addEventListener('click', handleKeyClick);
        }
      }

      keyElement.addEventListener('mousedown', handleKeyMouseDown);
      keyElement.addEventListener('mouseup', handleKeyMouseUp);
      keyElement.addEventListener('mouseout', handleKeyMouseOut);

      fragment.appendChild(keyElement);
    });

    return fragment;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const text = document.createElement('p');
  text.innerHTML = 'Клавиатура создана в операционной системе Windows. '
      + 'Для ввода необходимо сфокусироваться на поле ввода. '
      + 'Для переключения языка комбинация: левыe alt + shift';
  document.body.appendChild(text);
  textarea = new Textarea();
  keyboard = new Keyboard();
});
