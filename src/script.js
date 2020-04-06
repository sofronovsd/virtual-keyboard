const keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: function (currentValue) {
            textarea.setValue(currentValue);
        }
    },

    properties: {
        value: "",
        capsLock: false
    },

    init() {
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        this.elements.main.classList.add("keyboard");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
            "capslock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э",
            "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "enter",
            "ctrl", "space"
        ];

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "ъ", "э", "enter", "space"].indexOf(key) !== -1;

            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace": {
                    keyElement.classList.add("keyboard__key_wide");
                    keyElement.textContent = key.toUpperCase();

                    keyElement.addEventListener('click', () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent('oninput');
                    });

                    break;
                }

                case "capslock": {
                    keyElement.classList.add("keyboard__key_wide");
                    keyElement.textContent = key.toUpperCase();

                    keyElement.addEventListener('click', () => {
                        this._toggleCapsLock();
                    });

                    break;
                }

                case "enter": {
                    keyElement.classList.add("keyboard__key_wide");
                    keyElement.textContent = key.toUpperCase();

                    keyElement.addEventListener('click', () => {
                        this.properties.value += '\n';
                        this._triggerEvent('oninput');
                    });

                    break;
                }

                case "space": {
                    keyElement.classList.add("keyboard__key_extra-wide");
                    keyElement.textContent = key.toUpperCase();

                    keyElement.addEventListener('click', () => {
                        this.properties.value += ' ';
                        this._triggerEvent('oninput');
                    });

                    break;
                }

                case "tab": {
                    keyElement.classList.add("keyboard__key_medium");
                    keyElement.textContent = key.toUpperCase();

                    keyElement.addEventListener('click', () => {
                        this.properties.value += '\t';
                        this._triggerEvent('oninput');
                    });

                    break;
                }

                case "shift": {
                    keyElement.classList.add("keyboard__key_medium");
                    keyElement.textContent = key.toUpperCase();

                    keyElement.addEventListener('click', () => {
                        this._triggerEvent('oninput');
                    });

                    break;
                }

                case "ctrl": {
                    keyElement.classList.add("keyboard__key_medium");
                    keyElement.textContent = key.toUpperCase();

                    keyElement.addEventListener('click', () => {
                        this._triggerEvent('oninput');
                    });

                    break;
                }

                default: {
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener('click', () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent('oninput');
                    });

                }

            }

            keyElement.addEventListener('mousedown', (event) => {
                let target = event.target;
                target.classList.add('keyboard__key_active');
            });

            keyElement.addEventListener('mouseup', (event) => {
                let target = event.target;
                target.classList.remove('keyboard__key_active');
            });

            keyElement.addEventListener('mouseout', (event) => {
                let target = event.target;
                target.classList.remove('keyboard__key_active');
            });

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement('br'));
            }
        });

        return fragment;
    },

    _triggerEvent(handlerName) {
        console.log("Event triggered! Event name: " + handlerName);
        if (typeof this.eventHandlers[handlerName] === 'function') {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        console.log("CapsLock toggled!");

        this.properties.capsLock = !this.properties.capsLock;
        console.log(this.elements.keys);
        this.elements.keys.forEach(key => {
            // if isCommonKey
            if (!(key.classList.contains('keyboard__key_medium') ||
                key.classList.contains('keyboard__key_wide') ||
                key.classList.contains('keyboard__key_extra-wide'))) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        })
    }
};

const textarea = {

    elements: {
        textarea: null
    },

    init() {
        const textarea = document.createElement('textarea');
        textarea.classList.add('textarea');
        this.elements.textarea = textarea;
        document.body.appendChild(textarea);
    },

    setValue(value) {
        this.elements.textarea.textContent = value;
    }
};

window.addEventListener("DOMContentLoaded", function () {
    textarea.init();
    keyboard.init();
});

document.addEventListener('keypress', event => {
    console.log(event);
});