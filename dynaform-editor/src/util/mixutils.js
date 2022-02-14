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
        console.log('BUILD VARIABLES FINAL');
        console.log(json);
        return json;
    },
    findVariables(json, j, key, str) {
        let res = str.match(/@@[A-Za-z0-9]+/g);
        if (res) {
            res.forEach((el) => {
                let r = el.replace('@@', '');
                j[key] = j[key].replace(el, json[r] || el);
            });
        }
    },
}; 
