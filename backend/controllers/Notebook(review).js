import asyncHandler from "express-async-handler";
import Notebook from "../model/Notebook.js";
import mongoose from "mongoose";
import Page from "../model/Page.js";

export const getNotebookDetailsById = asyncHandler(async (req, res) => {
  try {
    const { notebookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(notebookId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid notebook" });
    }

    const notebook = await Notebook.findById(notebookId);

    if (!notebook) {
      res.status(401);
      throw new Error("Can't find any notebooks");
    }

    res.status(200).json({ success: true, data: notebook });
  } catch (error) {
    console.error("Error getting notebook by ID:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export const createNotebook = asyncHandler(async (req, res) => {
  try {
    const { title } = req.body;

    const userId = req.user?._id;
    console.log(userId);
    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    const newNotebook = new Notebook({
      title,
      user: new mongoose.Types.ObjectId(userId),
    });

    const savedNotebook = await newNotebook.save();

    res.status(201).json({ data: savedNotebook });
  } catch (error) {
    console.error("Error creating notebook:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export const createPageToNotebookById = asyncHandler(async (req, res) => {
  try {
    const { notebookId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Provide Title" });
    }

    const newPage = new Page({
      title,
      notebook: new mongoose.Types.ObjectId(notebookId),
    });

    const savedPage = await newPage.save();

    await Notebook.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(notebookId) },
      {
        $push: {
          page: new mongoose.Types.ObjectId(savedPage._id),
        },
      }
    );

    res.status(201).json({ data: savedPage });
  } catch (error) {
    console.error("Error adding content to notebook:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export const getNotebooksWithPreviewForUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    const notebook = await Notebook.find({ user: userId });

    if (!notebook) {
      res.status(401);
      throw new Error("Can't fetch notebooks");
    }

    res.status(200).json({ success: true, data: notebook });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message:
        "There's some problem fetching notebooks for user, please contact support",
    });
  }
});
