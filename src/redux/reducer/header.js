const type = {
    getValue: 'index_get_value1'
}

export const dispatchProps = (dispatch) =>  {
    return {
        dispatchFun: {
            getValue: () => {
                const state = {
                    value: 456
                };
                dispatch({type: 'index_get_value1', state})
            }
        }
    }
}

const defaultState = {
    value: 123
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case type.getValue:
            return {
                ...state,
                ...action.state
            }
        default:
            return state
    }
}