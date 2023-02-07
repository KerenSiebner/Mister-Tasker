import { taskService } from "../services/task.service.js";
import { userService } from "../services/user.service.js";
import { store } from './store.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { ADD_TASK, REMOVE_TASK, SET_TASKS, UNDO_REMOVE_TASK, UPDATE_TASK } from "./task.reducer.js";
import { SET_SCORE } from "./user.reducer.js";

// Action Creators:
export function getActionRemoveTask(taskId) {
    return {
        type: REMOVE_TASK,
        taskId
    }
}
export function getActionAddTask(task) {
    return {
        type: ADD_TASK,
        task
    }
}
export function getActionUpdateTask(task) {
    return {
        type: UPDATE_TASK,
        task
    }
}

export async function loadTasks(filterBy = { title: '', importance: null}) {
    console.log('filterBy', filterBy)
    try {
        const tasks = await taskService.query(filterBy)
        console.log('Tasks from DB:', tasks)
        store.dispatch({
            type: SET_TASKS,
            tasks
        })

    } catch (err) {
        console.log('Cannot load tasks', err)
        throw err
    }

}

export async function removeTask(taskId) {
    try {
        await taskService.remove(taskId)
        store.dispatch(getActionRemoveTask(taskId))
    } catch (err) {
        console.log('Cannot remove task', err)
        throw err
    }
}

export async function addTask(task) {
    try {
        const savedTask = await taskService.save(task)
        console.log('Added Task', savedTask)
        store.dispatch(getActionAddTask(savedTask))
        return savedTask
    } catch (err) {
        console.log('Cannot add task', err)
        throw err
    }
}

export async function updateTask(task) {
    try {
        const savedTask = await taskService.save(task)
        console.log('Updated Task:', savedTask)
        store.dispatch(getActionUpdateTask(savedTask))
        return savedTask
    } catch (err) {
        console.log('Cannot save task', err)
        throw err
    }
}

export async function startTask(task) {
    try {
        const savedTask = await taskService.start(task)
        console.log('Updated Task:', savedTask)
        store.dispatch(getActionUpdateTask(savedTask))
        return savedTask
    } catch (err) {
        console.log('Cannot save task', err)
        throw err
    }
}


export async function checkout(total) {
    try {
        const score = await userService.changeScore(-total)
        store.dispatch({ type: SET_SCORE, score })
        return score
    } catch (err) {
        console.log('TaskActions: err in checkout', err)
        throw err
    }
}


// Demo for Optimistic Mutation 
// (IOW - Assuming the server call will work, so updating the UI first)
export function onRemoveTaskOptimistic(taskId) {
    store.dispatch({
        type: REMOVE_TASK,
        taskId
    })
    showSuccessMsg('Task removed')

    taskService.remove(taskId)
        .then(() => {
            console.log('Server Reported - Deleted Succesfully');
        })
        .catch(err => {
            showErrorMsg('Cannot remove task')
            console.log('Cannot load tasks', err)
            store.dispatch({
                type: UNDO_REMOVE_TASK,
            })
        })
}
