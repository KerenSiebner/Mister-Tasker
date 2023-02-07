export const SET_TASKS = 'SET_TASKS'
export const REMOVE_TASK = 'REMOVE_TASK'
export const ADD_TASK = 'ADD_TASK'
export const UPDATE_TASK = 'UPDATE_TASK'
export const UNDO_REMOVE_TASK = 'UNDO_REMOVE_TASK'

const initialState = {
    tasks: [],
    lastRemovedTask: null
}

export function taskReducer(state = initialState, action) {
    var newState = state
    var tasks
    switch (action.type) {
        case SET_TASKS:
            newState = { ...state, tasks: action.tasks }
            break
        case REMOVE_TASK:
            const lastRemovedTask = state.tasks.find(task => task._id === action.taskId)
            tasks = state.tasks.filter(task => task._id !== action.taskId)
            newState = { ...state, tasks, lastRemovedTask }
            break
        case ADD_TASK:
            newState = { ...state, tasks: [...state.tasks, action.task] }
            break
        case UPDATE_TASK:
            tasks = state.tasks.map(task => (task._id === action.task._id) ? action.task : task)
            newState = { ...state, tasks }
            break
        case UNDO_REMOVE_TASK:
            if (state.lastRemovedTask) {
                newState = { ...state, tasks: [...state.tasks, state.lastRemovedTask], lastRemovedTask: null }
            }
            break
        default:
    }
    return newState
}
