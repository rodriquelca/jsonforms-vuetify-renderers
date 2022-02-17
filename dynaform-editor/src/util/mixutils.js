import _ from "lodash";
export let VariableBuilder = {
    build(jsonVariables, json) {
        _.map(json, (value, key) => {
            if (key != 'parent') {
                if (typeof value == 'string') {
                    console.log(json);
                    this.findVariables(jsonVariables, json, key, value);
                } else if (typeof value == 'object') {
                    this.build(jsonVariables,value);
                }
            }
        });
        return json;
    },
    findVariables(json, j, key, str) {
        let res = str.match(/{{\s*[A-Za-z0-9]+\s*}}/g);
        if (res) {
            res.forEach((el) => {
                let r = el.replace('{{', '').replace('}}', '').trim();
                j[key] = j[key].replace(el, json[r] || el);
            });
        }
    },
}; 
