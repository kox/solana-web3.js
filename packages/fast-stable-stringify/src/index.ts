const objToString = Object.prototype.toString;
const objKeys =
    Object.keys ||
    function (obj) {
        const keys = [];
        for (const name in obj) {
            keys.push(name);
        }
        return keys;
    };

function stringify(val: unknown, isArrayProp: boolean) {
    let str, keys, propVal, toStr;
    if (val === true) {
        return 'true';
    }
    if (val === false) {
        return 'false';
    }
    switch (typeof val) {
        case 'object':
            if (val === null) {
                return null;
            } else if ('toJSON' in val && typeof val.toJSON === 'function') {
                return stringify(val.toJSON(), isArrayProp);
            } else {
                toStr = objToString.call(val);
                if (toStr === '[object Array]') {
                    const array = val as unknown[];
                    const items = array
                        .map((item) => {
                            const arrayVal = stringify(item, true) as string;
                            return arrayVal !== undefined ? arrayVal : 'null';
                        })
                        .join(',');
                    return `[${items}]`;
                } else if (toStr === '[object Object]') {
                    // only object is left
                    keys = objKeys(val as Record<string, unknown>).sort();

                    str = keys
                        .map((key) => {
                            propVal = stringify((val as Record<string, unknown>)[key], false) as string;
                            return propVal !== undefined
                                ? `${key}:${propVal}`
                                : undefined;
                        })
                        .filter((item): item is string => item !== undefined)
                        .join(',');
                    return `{${str}}`;
                } else {
                    return JSON.stringify(val);
                }
            }
        case 'function':
        case 'undefined':
            return isArrayProp ? null : undefined;
        case 'bigint':
            return `${val.toString()}n`;
        case 'string':
            return JSON.stringify(val);
        default:
            return isFinite(val as number) ? val : null;
    }
}

export default function (
    val:
        | Function // eslint-disable-line @typescript-eslint/no-unsafe-function-type
        | undefined,
): undefined;
export default function (val: unknown): string;
export default function (val: unknown): string | undefined {
    const returnVal = stringify(val, false) as string;
    if (returnVal !== undefined) {
        return '' + returnVal;
    }
}
