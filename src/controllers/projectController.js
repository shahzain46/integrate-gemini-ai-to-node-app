const Project = require('../models/Project');

// Create a new project
const createProject = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id; 

    const newProject = await Project.create({ name, createdBy: userId });
    res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get a project by ID
const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId)
    // .populate('createdBy');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all projects for the authenticated user
const getProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const projects = await Project.find({ createdBy: userId, isDeleted:false });

    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a project by ID
const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await Project.findOneAndUpdate(
      { _id: projectId, createdBy: userId },
      { isDeleted: true },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found or unauthorized' });
    }

    res.status(200).json({ success: true, message: 'Project marked as deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};



module.exports = {
    createProject,
    getProjectById,
    getProjects,
    deleteProject
}