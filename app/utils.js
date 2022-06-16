// Add zero in front of numbers < 10
export function zeroPad(i) {
    return (i < 10) ? `0${i}` : i;
}

// Replace root's `namespace__*` with `namespace__className` while preserving other classes
export function swapClass(root, namespace, className) {
    const oldClassesString = root.class;
    const newClassName = `${namespace}__${className}`;

    // If the class is already on the element, we can skip removing and adding it back.
    if (oldClassesString.indexOf(newClassName) !== -1) {
        return;
    }

    const oldClasses = oldClassesString.trim().split(' ');

    const newClasses = oldClasses.filter((oldClass) => oldClass.indexOf(`${namespace}__`) !== 0);
    newClasses.push(newClassName);

    root.class = newClasses.join(' ');
}

export function numberFormat(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
