import { Todo } from "../models/todo.models.js";
import ApiError from "../utils/apiError.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sendTodo = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const userId = user._id;

  const todos = await Todo.find({createdBy: userId}).select("-__v");

  if (todos.length === 0) return res.status(269).json(new ApiResponse(200, [], "no todo found"))

  res.status(200).json(new ApiResponse(200, todos, "todo fetched successfully"))
})
const deleteTodo = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const {_id} = req.body

  const userId = user._id;

  const deletedTodo =  await Todo.findOneAndDelete({ _id, createdBy: req.user._id });

  if (!deletedTodo) throw new ApiError(500, "because of some reason todo is not deleted")

  const todos = await Todo.find({createdBy: userId}).select("-__v");


  res.status(200).json(new ApiResponse(201, todos, "todo Deleted successfully"))
})
const saveTodo = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const {title, subTitle, priority, isCompleted} = req.body
  if (!title?.trim()) throw new ApiError(400, "title cant be empty");
  const userId = user._id;

  const createdBy = userId;

  const createdTodo = await Todo.create({title, subTitle, priority, isCompleted, createdBy});

  if (!createdTodo) throw new ApiError(500, "for some reason todo is not created")

  const todos = await Todo.find({createdBy: userId}).select("-__v");


  res.status(201).json(new ApiResponse(201, todos, "todo created successfully"))
})
const updateTodo = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const {isCompleted, _id} = req.body
  const userId = user._id;

 const todo = await Todo.findById(_id);
 if (!todo) throw new ApiError(400, "unathorized or todo not found")

 todo.isCompleted = isCompleted;
 await todo.save()


  res.status(201).json(new ApiResponse(201, [], "todo updated successfully"))
})

export { sendTodo, 
  saveTodo,
  deleteTodo,
  updateTodo
 }