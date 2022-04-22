import _ from "lodash";
export default {
    data() {
        return {
        }
    },
    methods: {
        /**
         * When the expression is erased
         */
        eraseExpression(val, prev) {
            let res = [];
            if (val.length % 4 == 0) {
                res = this.scopes.items;
            }
            if (val.length % 4 == 1) {
                res = this.operators.items;
            }
            if (val.length == 2) {
                res = this.values.items;
            }
            return res;
        },
        /**
         * When the expression is added
         */
        addExpression(val, prev) {
            let res = [];
            if (val.length % 4 == 0) {
                res = this.scopes.items;
            }
            if (val.length % 4 == 1) {
                res = this.loadOperators();
            }
            if (val.length % 4 == 2) {
                res = this.values.items;
            }
            if (val.length % 4 == 3) {
                this.model = val.map((v) => {
                    if (typeof v === 'string') {
                        v = {
                            text: v,
                            color: 'grey',
                            type: 'value',
                        };
                        this.items.push(v);
                        this.nonce++;
                    }
                    return v;
                });
                this.$emit('updateIf', this.model);
                res = this.loadLogicOperators();
            }
            return res;
        }
    }
}
