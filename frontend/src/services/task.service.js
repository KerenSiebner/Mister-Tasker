
// import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
// import { utilService } from './util.service.js'
import { userService } from './user.service.js'


const STORAGE_KEY = 'task'

export const taskService = {
    query,
    getById,
    save,
    remove,
    getEmptyTask,
    getDefaultFilter,
    start
}
window.cs = taskService


async function query(filterBy = { title: '', importance: '' }) {
    return httpService.get(STORAGE_KEY, filterBy)
}

function getById(taskId) {
    // return storageService.get(STORAGE_KEY, taskId)
    return httpService.get(`task/${taskId}`)
}

async function remove(taskId) {
    // await storageService.remove(STORAGE_KEY, taskId)
    return httpService.delete(`task/${taskId}`)
}
async function save(task) {
    var savedTask
    try {
        if (task._id) {
            // savedTask = await storageService.put(STORAGE_KEY, task)
            savedTask = await httpService.put(`task/${task._id}`, task)

        } else {
            // Later, owner is set by the backend
            task.owner = userService.getLoggedinUser()
            // savedTask = await storageService.post(STORAGE_KEY, task)
            savedTask = await httpService.post('task', task)
        }
        return savedTask
    } catch (err) {
        console.log('Failed to save task', err)
    }
}

async function start(task) {
    let runningTask
    try {
        runningTask = await httpService.put(`task/${task._id}/start`, task)
        return runningTask
    } catch (err) {
        console.log('Failed to start task', err)
    }
}



function getEmptyTask() {
    return {
        title: '',
        status: '',
        description: '',
        importance: 0,
        createdAt: Date.now(),
        lastTriedAt: null,
        triesCount: null,
        doneAt: null,
        errors: ['']
    }
}

function getDefaultFilter() {
    return {
        title: '',
        importance: ''
    }
}





