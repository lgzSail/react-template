import axios from '../../require';
const type = {
    getValue: 'index_get_value'
}

export const dispatchProps = (dispatch) =>  {
    return {
        dispatchFun: {
            getValue: () => {
                axios({
                    url: '//jh.upk.net:12080/sys/dictionary',
                    method: 'get'
                }).then(() => {
                    const state = {
                        value: 456
                    };
                    dispatch({type: 'index_get_value', state})
                })
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
            return {
                ...state,
                ...action.state
            }
    }
}