export const initialState2 = null

export const reducer2 = (convId,action) => {
    if(action.type === "CONVERSATION"){
        return action.payload
    }
    return convId
}