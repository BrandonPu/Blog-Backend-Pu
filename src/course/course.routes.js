import { Router } from "express";
import { check } from "express-validator";
import { createCourse, deleteCourse, getCourses, updateCourse } from "./course.controller.js";

const router = Router();

router.post(
    "/newCourse",
    createCourse
)

router.get("/getCourses", getCourses);

router.put(
    "/updateCourse/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
    ],
    updateCourse
)

router.delete(
    "/deleteCourse/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
    ],
    deleteCourse
)

export default router;