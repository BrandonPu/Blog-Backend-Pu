import { Router } from "express";
import { check } from "express-validator";
import { createComment, deleteComment, editComment } from "./comment.controller.js";

const router = Router();

router.post(
    "/newComment",
    createComment
)

router.put(
    "/updateComment/:commentId",
    editComment
)

router.delete(
    "/deleteComment/:commentId",
    deleteComment
)

export default router;