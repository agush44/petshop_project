import { Router } from "express";
import {
  getPosts,
  getAllPostsAdmin,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { authToken, requireAdmin } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { postSchema } from "../validations/postValidation.js";

const postRoutes = Router();

postRoutes.get("/", getPosts);
postRoutes.get("/admin", authToken, requireAdmin, getAllPostsAdmin);
postRoutes.get("/:slug", getPostBySlug);
postRoutes.post("/", authToken, requireAdmin, validate(postSchema), createPost);
postRoutes.put("/:id", authToken, requireAdmin, validate(postSchema), updatePost);
postRoutes.delete("/:id", authToken, requireAdmin, deletePost);

export { postRoutes };
