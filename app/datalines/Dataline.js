import { swapClass } from '../utils';

export default function Dataline({ name, updateValue, start, stop, checkPermissions }) {
    this.isActive = false;

    this.name = name;
    this.updateValue = updateValue.bind(this);
    this.start = start.bind(this);
    this.stop = stop.bind(this);

    if (checkPermissions) {
        this.checkPermissions = checkPermissions.bind(this);
    }

    Object.defineProperty(this, 'update', {
        get: () => function(labelRef, valueRef, theme) {
            this.labelRef = labelRef;
            this.valueRef = valueRef;
            this.theme = theme;

            this.labelRef.text = `[${name}]`;
            swapClass(this.labelRef.root, 'theme', theme);
            swapClass(this.valueRef.root, 'theme', theme);

            if (typeof this.checkPermissions === 'function' && !this.checkPermissions()) {
                this.valueRef.text = 'no permissions!';
                swapClass(this.LabelRef.root, 'color', 'red');
                swapClass(this.valueRef.root, 'color', 'red');
                return;
            }

            if (!this.isActive) {
                this.start();
                this.isActive = true;
            }

            this.updateValue();
        },
    });

    Object.defineProperty(this, 'disable', {
        get: () => function() {
            if (this.isActive) {
                this.stop();
                this.isActive = false;

                delete this.labelRef;
                delete this.valueRef;
                delete this.theme;
            }
        },
    });
};
