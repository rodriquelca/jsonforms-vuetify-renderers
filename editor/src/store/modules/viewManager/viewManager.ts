import { RootState } from "@/store/types";
import { Module } from "vuex";
import { make } from 'vuex-pathify';
import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

export interface ViewManagerState {
    menuBar: any,
    sideBar: any,
    statusBar: any,
    activityBar: any,
    sidePanel: any,
    mainPanel: any
}

const state: ViewManagerState = {
    // Menu Up
    menuBar: {},
    // Menu left
    activityBar: {
        items: [
            {
                title: 'Pallete Panel',
                icon: 'mdi-view-dashboard',
                sideBar: 'pallete-panel',
            },
            {
                title: 'Properties Panel',
                icon: 'mdi-pencil',
                sideBar: 'properties-panel',
            },
            {
                title: 'Translation',
                icon: 'mdi-translate',
                sideBar: 'side-bar-i18n',
            },
        ],
        active: 0
    },
    //Panel bottom
    statusBar: {},
    // Panel properties
    sideBar: {
        active: 0,
        items: [
            {
                id: "pallete-panel",
                mainPanel: 'dynaform-editor',
            },
            {
                id: 'properties-panel',
                mainPanel: 'dynaform-editor',
            },
            {
                id: 'side-bar-i18n',
                mainPanel: 'main-panel-i18n',
            },
        ],
    },
    sidePanel: {
        component: "div"
    },
    mainPanel: {
        active: 0,
        items: [
            {
                id: "dynaform-editor",
                data: {}
            },
            {
                id: 'main-panel-i18n',
                data: {
                    locale: "en"
                }
            },
        ],
    }
};

const viewManager: Module<ViewManagerState, RootState> = {
    namespaced: true,
    state,
    ...{
        mutations: {
            ...make.mutations(state),
            ...mutations
        }
    },
    ...{
        actions: {
            ...make.actions(state),
            ...actions
        }
    },
    ...{
        getters: {
            ...make.getters(state),
            ...getters
        }
    }
};

export default viewManager;
