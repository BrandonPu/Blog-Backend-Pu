import Post from "./post.model.js";
import Course from "../course/course.model.js";
import Comment from "../comment/comment.model.js";

export const createPost = async (req, res) => {
    try {
        const { author, title, content, courseName } = req.body;

        if (!author || !title || !content || !courseName) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son obligatorios: autor, título, contenido y nombre del curso."
            });
        }

        const course = await Course.findOne({ name: courseName });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Curso no encontrado con ese nombre."
            });
        }

        const newPost = new Post({
            author,
            title,
            content,
            course: course._id
        });

        await newPost.save();

        res.status(201).json({
            success: true,
            message: "Publicación creada exitosamente.",
            post: newPost
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear la publicación.",
            error: error.message
        });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const { courseName, sortBy, page = 1, limit = 5 } = req.query;

        const filter = { state: true };
        if (courseName) {
            const course = await Course.findOne({ name: courseName });
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Curso no encontrado con ese nombre."
                });
            }
            filter.course = course._id;
        }

        let sortCriteria = { createdAt: -1 };
        if (sortBy === "course") {
            sortCriteria = { "course.name": 1 };
        }

        const skip = (page - 1) * limit;

        const total = await Post.countDocuments(filter);

        const posts = await Post.find(filter)
            .populate("course", "name")
            .populate({
                path: "comments",
                select: "name content createdAt",
                options: { sort: { createdAt: -1 } }
            })
            .sort(sortCriteria)
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            posts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las publicaciones.",
            error: error.message
        });
    }
};

export const editPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { author, title, content, courseName } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Publicación no encontrada."
            });
        }

        if (author) post.author = author;
        if (title) post.title = title;
        if (content) post.content = content;
        if (courseName) {
            const course = await Course.findOne({ name: courseName });
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Curso no encontrado."
                });
            }
            post.course = course._id;
        }

        await post.save();

        res.status(200).json({
            success: true,
            message: "Publicación actualizada exitosamente.",
            post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar la publicación.",
            error: error.message
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Publicación no encontrada."
            });
        }

        post.state = false;
        await post.save();

        res.status(200).json({
            success: true,
            message: "Publicación desactivada exitosamente.",
            post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al desactivar la publicación.",
            error: error.message
        });
    }
};