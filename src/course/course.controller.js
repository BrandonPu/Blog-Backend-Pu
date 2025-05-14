import Course from "./course.model.js";

export const createCourse = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: 'Nombre y descripción son obligatorios.' });
        }

        const totalCourses = await Course.countDocuments();
        if (totalCourses >= 3) {
            return res.status(400).json({ message: 'Solo se permiten 3 cursos como máximo.' });
        }

        const courseExists = await Course.findOne({ name });
        if (courseExists) {
            return res.status(400).json({ message: 'Ya existe un curso con ese nombre.' });
        }

        const newCourse = new Course({
            name,
            description
        });

        await newCourse.save();

        res.status(201).json({
            success: true,
            message: "Curso agregado correctamente.",
            course: newCourse
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al agregar el curso",
            error: error.message
        });
    }
}

export const getCourses = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { state: true };

        const [total, courses] = await Promise.all([
            Course.countDocuments(query),
            Course.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            courses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los cursos",
            error: error.message
        });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Curso no encontrado"
            });
        }

        if (name) course.name = name;
        if (description) course.description = description;

        await course.save();

        res.status(200).json({
            success: true,
            message: "Curso actualizado correctamente",
            course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el curso",
            error: error.message
        });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Curso no encontrado"
            });
        }

        course.state = false;
        await course.save();

        res.status(200).json({
            success: true,
            message: "Curso desactivado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el curso",
            error: error.message
        });
    }
};