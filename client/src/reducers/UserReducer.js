export const initialState1 = null

export const reducer1 = (state,action) => {
    if(action.type === "USER"){
        return action.payload
    }
    if(action.type === "UPDATEPIC"){
        return {
            ...state,
            pic: action.payload
        }
    }
    return state
}