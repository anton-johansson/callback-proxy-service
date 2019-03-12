import {SET_SCENE} from './actions';

const scene = (
    state = {
        current: ''
    },
    action
) => {
    switch (action.type) {
        case SET_SCENE:
            return {
                ...state,
                current: action.scene
            };
        default:
            return state;
    }
}

export default scene;
