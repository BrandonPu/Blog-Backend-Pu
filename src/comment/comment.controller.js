import Comment from "./comment.model.js";
import Post from "../post/post.model.js";

export const createComment = async (req, res) => {
    try {
        const { name, content, postId } = req.body;

        // Si no se proporciona 'name', asignar "Anónimo" por defecto
        const authorName = name || "Anónimo";

        if (!content || !postId) {
            return res.status(400).json({
                success: false,
                message: "Los campos 'content' y 'postId' son obligatorios."
            });
        }

        const post = await Post.findById(postId);
        if (!post || !post.state) {
            return res.status(404).json({
                success: false,
                message: "Publicación no encontrada o inactiva."
            });
        }

        const newComment = new Comment({
            name: authorName,  // Asignamos el nombre, o "Anónimo" si no se proporciona
            content,
            post: postId
        });

        await newComment.save();

        post.comments.push(newComment._id);
        await post.save();

        res.status(201).json({
            success: true,
            message: "Comentario agregado exitosamente.",
            comment: newComment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al agregar el comentario.",
            error: error.message
        });
    }
};


export const editComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { name, content } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comentario no encontrado."
            });
        }

        if (name) comment.name = name;
        if (content) comment.content = content;

        await comment.save();

        res.status(200).json({
            success: true,
            message: "Comentario actualizado exitosamente.",
            comment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el comentario.",
            error: error.message
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comentario no encontrado."
            });
        }

        const postId = comment.post;

        await Comment.findByIdAndDelete(commentId);

        await Post.findByIdAndUpdate(postId, {
            $pull: { comments: commentId }
        });

        res.status(200).json({
            success: true,
            message: "Comentario eliminado exitosamente."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el comentario.",
            error: error.message
        });
    }
};