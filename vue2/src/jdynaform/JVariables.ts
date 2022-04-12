import _ from 'lodash';
const JVariables = {
    build(jsonVariables: any, json: any) {
        _.map(json, (value, key) => {
            if (key != 'parent') {
                if (typeof value == 'string') {
                    this.findVariables(jsonVariables, json, key, value);
                } else if (typeof value == 'object') {
                    this.build(jsonVariables, value);
                }
            }
        });
        return json;
    },
    findVariables(json: any, j: any, key: any, str: any) {
        const res = str.match(/{{\s*[A-Za-z0-9]+\s*}}/g);
        if (res) {
            res.forEach((el: any) => {
                const r = el.replace('{{', '').replace('}}', '').trim();
                j[key] = j[key].replace(el, json[r] || el);
            });
        }
    },
    /**
     * Return the values into braces
     * @param json 
     * @param str 
     */
    removeBraces(json: any) {
        let valuesInBraces: any = [];
        _.map(json, (value, key) => {
            if (typeof value == 'string') {
                let res = value.match(/{{\s*[A-Z\.\_a-z0-9]+\s*}}/g);

                if (res) {
                    res.forEach((el: any) => {
                        const r = el.replace('{{', '').replace('}}', '').trim();
                        valuesInBraces.push(r);
                        json[key] = json[key].replace(el, r || el);
                    });
                }

            }
        });
        return valuesInBraces;
    },
    /**
    * Return the values into braces
    * @param json 
    * @param bracesStart
    * @param bracesEnd 
    */
    replaceBraces(json: any, bracesStart: string, bracesEnd: string) {
        let valuesInBraces: any = [];
        _.map(json, (value, key) => {
            if (typeof value == 'string') {
                let res = value.match(/{{\s*[A-Z\.\_a-z0-9]+\s*}}/g);
                if (res) {
                    res.forEach((el: any) => {
                        const r = el.replace('{{', '').replace('}}', '').trim();
                        valuesInBraces.push(r);
                        json[key] = json[key].replace(el, bracesStart + r + bracesEnd || el);
                    });
                }

            }
        });
        return valuesInBraces;
    }
};
export default JVariables;
