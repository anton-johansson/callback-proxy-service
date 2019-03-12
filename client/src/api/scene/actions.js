export const SET_SCENE = 'SET_SCENE';
export const setScene = scene => {
    return dispatch => {
        dispatch({
            type: SET_SCENE,
            scene
        });
    };
};
