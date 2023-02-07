import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadTasks, addTask, updateTask, removeTask, startTask } from '../store/task.actions.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { taskService } from '../services/task.service.js'
import { useState } from 'react'

export function MainApp() {

    const tasks = useSelector(storeState => storeState.taskModule.tasks)
    const [filterBy, setFilterBy] = useState(taskService.getDefaultFilter())

    useEffect(() => {
        loadTasks(filterBy)
    }, [])

    async function onRemoveTask(taskId) {
        try {
            await removeTask(taskId)
            showSuccessMsg('Task removed')
        } catch (err) {
            showErrorMsg('Cannot remove task')
        }
    }

    async function onAddTask() {
        const task = taskService.getEmptyTask()
        task.title = prompt('Title?')
        try {
            const savedTask = await addTask(task)
            showSuccessMsg(`Task added (id: ${savedTask._id})`)
        } catch (err) {
            showErrorMsg('Cannot add task')
        }
    }

    async function onUpdateTask(task) {
        const importance = +prompt('Importance?')
        const status = prompt('Status?')
        const taskToSave = { ...task, importance, status }
        try {
            const savedTask = await updateTask(taskToSave)
            showSuccessMsg(`Task updated: ${savedTask}`)
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }
    
    async function onStartTask(task){
        const taskToSave = { ...task, status: 'Running' }
        try {
            const savedTask = await updateTask(taskToSave)
            await startTask(task)
            showSuccessMsg(`Task updated: ${savedTask}`)
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
        
    }

    function handleChange({ target }) {
        let { value } = target
        const field = target.name
        if (field==='importance') value = +value
        console.log('value', value)
        setFilterBy({ ...filterBy, [field]: value })
        loadTasks(filterBy)
    }


    return (
        <div>
            <h1>Mister Tasker</h1>
            <main>
                <button onClick={onAddTask}>Create new task</button>
                <input type="text" placeholder='Search for a title' name='title' value={filterBy.title} onChange={handleChange} />
                <span>Importance:</span>
                <select name="importance" id="" value={filterBy.importance} onChange={handleChange}>
                    <option value="">All</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
                <table className="task-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Importance</th>
                            <th>Status</th>
                            <th>TriesCount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task =>
                            <tr className="task-preview" key={task._id}>
                                <td>{task.title}</td>
                                <td>{task.importance.toLocaleString()}</td>
                                <td>{task.status}</td>
                                <td> {task.triesCount}</td>
                                <td>
                                    {task.status!=='Running' && 
                                    <button onClick={() => { onStartTask(task) }} style={{backgroundColor:'#5eba7d'}}>Start</button>
                                    }
                                    <button onClick={() => { onRemoveTask(task._id) }}>Delete</button>
                                    <button onClick={() => { onUpdateTask(task) }}>Edit</button>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </main>
        </div>
    )
}