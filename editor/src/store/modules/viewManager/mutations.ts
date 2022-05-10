import _ from 'lodash';
const mutations = {
    SET_ACTIVE_ACTIVITY_BAR: (state: any, value: any) => {
        const activeSideBar = state.activityBar.items[value]["sideBar"];
        const cloneSideBar = _.cloneDeep(state.sideBar.items);
        const indexSideBar = _.findIndex(cloneSideBar, (o: any) => { return o.id == activeSideBar; });
        const activeMainPanel = cloneSideBar[indexSideBar]["mainPanel"];
        const cloneMainPanel = _.cloneDeep(state.mainPanel.items);
        const indexMainPanel = _.findIndex(cloneMainPanel, (o: any) => { return o.id == activeMainPanel; });

        //Update the sideBar & the main panel
        state.activityBar.active = value;
        state.sideBar.active = indexSideBar;
        state.mainPanel.active = indexMainPanel;
    },
    SET_DATA_MAIN_PANEL: (state: any, value: any) => {
        const index = _.findIndex(state.mainPanel.items, (o: any) => { return o.id == value.id; });
        state.mainPanel.items[index].data = _.extend({}, state.mainPanel.items[index].data, value.data);
    },
};
export default mutations;
