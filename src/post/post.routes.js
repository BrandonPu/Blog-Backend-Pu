import { Router } from "express";
import { check } from "express-validator";
import { createPost, deletePost, editPost, getAllPosts } from "./post.controller.js";

const router = Router();

router.post(
    "/newPost",
    [
        check("author").notEmpty().withMessage("El autor es obligatorio"),
        check("title").notEmpty().withMessage("El título es obligatorio"),
        check("content").notEmpty().withMessage("El contenido es obligatorio"),
        check("courseName").notEmpty().withMessage("El nombre del curso es obligatorio")
    ],
    createPost
);

router.get(
    "/getPosts",
    getAllPosts
);

router.put(
    "/updatePost/:postId",
    editPost
)

router.delete(
    "/deletePost/:postId",
    deletePost
)

export default router;