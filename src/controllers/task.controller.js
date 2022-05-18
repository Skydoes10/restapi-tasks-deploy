import Task from "../models/Task";
import { getPagination } from "../libs/getPagination";

export const findAllTasks = async (req, res) => {
    try {
        const { size, page, title } = req.query

        const { limit, offset } = getPagination(page, size)

        const condition = title ? {
            title: { $regex: new RegExp(title), $options: "i" }
        } : {}
        const data = await Task.paginate(condition, { offset, limit })
        res.json({
            totalItems: data.totalDocs,
            tasks: data.docs,
            totalPages: data.totalPages,
            currentPage: data.page - 1
        })
    } catch (error) {
        res.status(500).json({
            message: error.message || "Something goes wrong retrieving the tasks"
        })
    }
}

export const createTask = async (req, res) => {

    if (!req.body.title) {
        return res.status(400).send({ message: "Content cannot be empty" })
    }

    try {
        const newTask = new Task({
            title: req.body.title,
            description: req.body.description,
            done: req.body.done ? req.body.done : false
        })
        const taskSaved = await newTask.save()
        res.json(taskSaved)
    } catch (error) {
        res.status(500).json({
            message: error.message || "Something goes wrong creating a tasks"
        })
    }
}

export const findOneTask = async (req, res) => {
    const { id } = req.params
    try {
        const task = await Task.findById(id)

        if (!task) return res.status(404).json({ message: `Task with id ${id} does not exists` })

        res.json(task)
    } catch (error) {
        res.status(500).json({
            message: error.message || `Error retrieving a task with id: ${id}`
        })
    }
}

export const deleteTask = async (req, res) => {
    const { id } = req.params
    try {
        await Task.findByIdAndDelete(id)
        res.json({
            message: "Task were deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message || `Cannot delete task with id: ${id}`
        })
    }
}

export const findAllDoneTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ done: true })
        res.json(tasks)
    } catch (error) {
        res.status(500).json({
            message: error.message || "Something goes wrong retrieving the tasks"
        })
    }
}

export const updateTask = async (req, res) => {
    const { id } = req.params
    try {
        await Task.findByIdAndUpdate(id, req.body)
        res.json({ message: "Task was updated successfully" })
    } catch (error) {
        res.status(500).json({
            message: error.message || `Something goes wrong updating the task with id ${id}`
        })
    }
}