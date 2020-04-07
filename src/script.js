let textarea;
let keyboard;

function imitateMouseDown(keyElement) {
  if (keyElement !== undefined) {
    keyElement.dispatchEvent(new Event('mousedown'));
  }
}

function imitateMouseUp(keyElement) {
  if (keyElement !== undefined) {
    keyElement.dispatchEvent(new Event('mouseup'));
  }
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

      switch (code) {
        case 'Space': {
          const keyElement = keys.find((element) => element.textContent === 'SPACE');

          imitateMouseDown(keyElement);
          isCode = true;
          break;
        }
        case 'Enter': {
          const keyElement = keys.find((element) => element.textContent === 'ENTER');

          imitateMouseDown(keyElement);
          isCode = true;
          break;
        }
        case 'Backspace': {
          const keyElement = keys.find((element) => element.textContent === 'BACKSPACE');

          imitateMouseDown(keyElement);
          isCode = true;
          break;
        }
        case 'CapsLock': {
          const keyElement = keys.find((element) => element.textContent === 'CAPSLOCK');

          imitateMouseDown(keyElement);
          keyboard.toggleCapsLock();
          isCode = true;
          break;
        }
        case 'Delete': {
          const keyElement = keys.find((element) => element.textContent === 'DEL');

          imitateMouseDown(keyElement);
          isCode = true;
          break;
        }
        case 'AltLeft': {
          const keyElement = keys.find((element) => element.textContent === 'ALT');

          isAlt = true;
          imitateMouseDown(keyElement);
          isCode = true;
          break;
        }
        case 'ShiftLeft': {
          const keyElement = keys.find((element) => element.textContent === 'SHIFT');

          imitateMouseDown(keyElement);
          if (isAlt) {
            let { locale } = keyboard.properties;
            if (locale === 'rus') {
              locale = 'en';
            } else {
              locale = 'rus';
            }
            window.localStorage.setItem('keyboardLocale', locale);
            document.body.removeChild(keyboard.elements.main);
            keyboard.init();

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

        imitateMouseDown(keyElement);
      }
    });

    textareaElement.addEventListener('keyup', (event) => {
      const { code } = event;
      const keys = [...keyboard.elements.keys];
      let isCode = false;

      switch (code) {
        case 'Space': {
          const keyElement = keys.find((element) => element.textContent === 'SPACE');

          imitateMouseUp(keyElement);
          isCode = true;
          break;
        }
        case 'Enter': {
          const keyElement = keys.find((element) => element.textContent === 'ENTER');

          imitateMouseUp(keyElement);
          isCode = true;
          break;
        }
        case 'Backspace': {
          const keyElement = keys.find((element) => element.textContent === 'BACKSPACE');

          imitateMouseUp(keyElement);
          isCode = true;
          break;
        }
        case 'CapsLock': {
          const keyElement = keys.find((element) => element.textContent === 'CAPSLOCK');

          imitateMouseUp(keyElement);
          isCode = true;
          break;
        }
        case 'Delete': {
          const keyElement = keys.find((element) => element.textContent === 'DEL');

          imitateMouseUp(keyElement);
          isCode = true;
          break;
        }
        case 'AltLeft': {
          const keyElement = keys.find((element) => element.textContent === 'ALT');

          isAlt = false;
          imitateMouseUp(keyElement);
          isCode = true;
          break;
        }
        case 'ShiftLeft': {
          const keyElement = keys.find((element) => element.textContent === 'SHIFT');

          imitateMouseUp(keyElement);
          isCode = true;
          break;
        }
        default:
          break;
      }

      if (!isCode) {
        const { key } = event;
        const keyElement = keys.find((element) => element.textContent === key);

        imitateMouseUp(keyElement);
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
    };

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
      const insertLineBreak = ['backspace', { rus: 'ъ', en: ']' }, {
        rus: 'э',
        en: '\'',
      }, 'enter', 'space'].indexOf(key) !== -1;

      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      switch (key) {
        case 'backspace': {
          keyElement.classList.add('keyboard__key_wide');
          keyElement.textContent = key.toUpperCase();

          keyElement.addEventListener('click', () => {
            const index = textarea.getCaret();
            let value = textarea.getValue();
            value = value.substring(0, index - 1) + value.substring(index, value.length);
            textarea.setValue(value);
          });

          break;
        }

        case 'capslock': {
          keyElement.classList.add('keyboard__key_wide');
          keyElement.textContent = key.toUpperCase();

          keyElement.addEventListener('click', () => {
            this.toggleCapsLock();
          });

          break;
        }

        case 'enter': {
          keyElement.classList.add('keyboard__key_wide');
          keyElement.textContent = key.toUpperCase();

          keyElement.addEventListener('click', () => {
            let value = textarea.getValue();
            value += '\n';
            textarea.setValue(value);
          });

          break;
        }

        case 'space': {
          keyElement.classList.add('keyboard__key_extra-wide');
          keyElement.textContent = key.toUpperCase();

          keyElement.addEventListener('click', () => {
            let value = textarea.getValue();
            value += ' ';
            textarea.setValue(value);
          });

          break;
        }

        case 'del': {
          keyElement.classList.add('keyboard__key_medium');
          keyElement.textContent = key.toUpperCase();

          keyElement.addEventListener('click', () => {
            const index = textarea.getCaret();
            let value = textarea.getValue();
            value = value.substring(0, index) + value.substring(index + 1, value.length);
            textarea.setValue(value);
          });

          break;
        }

        case 'shift': {
          keyElement.classList.add('keyboard__key_medium');
          keyElement.textContent = key.toUpperCase();

          keyElement.addEventListener('mousedown', () => {
            this.properties.capsLock = true;
          });

          keyElement.addEventListener('mouseup', () => {
            this.properties.capsLock = false;
          });

          break;
        }

        case 'alt': {
          keyElement.classList.add('keyboard__key_medium');
          keyElement.textContent = key.toUpperCase();

          keyElement.addEventListener('click', () => {

          });

          break;
        }

        default: {
          if (typeof key === 'object') {
            keyElement.textContent = key[this.properties.locale].toLowerCase();
          } else {
            keyElement.textContent = key.toLowerCase();
          }

          keyElement.addEventListener('click', () => {
            let value = textarea.getValue();
            value += this.properties.capsLock
              ? keyElement.textContent.toUpperCase() : keyElement.textContent.toLowerCase();
            textarea.setValue(value);
          });
        }
      }

      keyElement.addEventListener('mousedown', (event) => {
        const { target } = event;
        target.classList.add('keyboard__key_active');
      });

      keyElement.addEventListener('mouseup', (event) => {
        const { target } = event;
        target.classList.remove('keyboard__key_active');
      });

      keyElement.addEventListener('mouseout', (event) => {
        const { target } = event;
        target.classList.remove('keyboard__key_active');
      });

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  }

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    this.elements.keys.forEach((key) => {
      // if isCommonKey
      if (!(key.classList.contains('keyboard__key_medium')
                || key.classList.contains('keyboard__key_wide')
                || key.classList.contains('keyboard__key_extra-wide'))) {
        key.textContent = this.properties.capsLock
          ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    });
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
