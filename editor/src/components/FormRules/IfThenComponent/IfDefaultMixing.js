import _ from "lodash";
export default {
    data() {
        return {
            scopes: {
                items: [],
                colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange', 'red', 'yellow'],
            },
            operators: {
                items: []
            },
            logicOperators: {
                items: []
            },
            values: {
                items: [{ header: 'Create a value' }]
            },
            initialParentheses: {
                items: [{
                    text: '(',
                    value: _.random(0, 10000000),
                    color: 'orange',
                    type: 'InitialParentheses'
                }]
            },
            finalParentheses: {
                items: [{
                    text: ')',
                    value: _.random(0, 10000000),
                    color: 'orange',
                    type: 'FinalParentheses'
                }]
            },
        }
    },
    mounted() {
        this.scopes.items = this.loadScopes();
        this.operators.items = this.loadOperators();
        this.logicOperators.items = this.loadLogicOperators();
    },
    methods: {
        /**
         * Load scope fields from JSON Editor
         * @returns array
         */
        loadScopes() {
            let res = [],
                scopes = this.$store.getters['app/getScopesEditor'];
            scopes.forEach(el => {
                res.push({
                    text: el,
                    value: el,
                    color: this.scopes.colors[_.random(0, this.scopes.colors.length - 1)],
                    type: 'Field',
                })
            });
            return res;
        },
        loadOperators() {
            return [
                {
                    text: '=',
                    value: _.random(0, 10000000),
                    color: 'blue',
                    type: 'Operator',
                },
                {
                    text: '!=',
                    value: _.random(0, 10000000),
                    color: 'blue',
                    type: 'Operator',
                },
                {
                    text: '<',
                    value: _.random(0, 10000000),
                    color: 'blue',
                    type: 'Operator',
                },
                {
                    text: '>',
                    value: _.random(0, 10000000),
                    color: 'blue',
                    type: 'Operator',
                },
            ];
        },
        loadLogicOperators() {
            return [
                {
                    text: 'AND',
                    value: _.random(0, 10000000),
                    color: 'red',
                    type: 'LogicOperator',
                },
                {
                    text: 'OR',
                    value: _.random(0, 10000000),
                    color: 'red',
                    type: 'LogicOperator',
                }, {
                    text: 'XOR',
                    value: _.random(0, 10000000),
                    color: 'red',
                    type: 'LogicOperator',
                }
            ];
        },
        loadInitialParentheses() {
            return [
                {
                    text: '(',
                    value: _.random(0, 10000000),
                    color: 'orange',
                    type: 'InitialParentheses'
                }
            ];
        },
        loadFinalParentheses() {
            return [
                {
                    text: ')',
                    value: _.random(0, 10000000),
                    color: 'orange',
                    type: 'FinalParentheses'
                }
            ];
        }
    }
}
