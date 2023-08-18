import { auth, checkRole } from "../middlewares.js";
import {
  create,
  getBlog,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  relatedBlog,
} from "../blog/blog.entity.js";

export default function blog() {
  /**
   * POST /blog
   * @description This route is used to create a blog.
   * @response {Object} 201 - create new blog
   */
  this.route.post("/blog", auth, checkRole(["admin"]), create(this));

  /**
   * GET /blogs
   * @description This route is used to find blog with and without pagination.
   * @response {Object} 200 - blog list
   */
  this.route.get("/blogs", getBlog(this));

  /**
   * GET /blogs/:slug
   * @description This route is used to find single blog.
   * @response {Object} 200 - single blog object
   */
  this.route.get("/blogs/:slug", getSingleBlog(this));

  /**
   * PATCH /blogs/:slug
   * @description This route is used for update blog. only admin can update blogs
   * @response {Object} 200 - updated blog object
   */
  this.route.patch(
    "/blogs/:slug",
    auth,
    checkRole(["admin"]),
    updateBlog(this)
  );

  /**
   * DELETE /blogs/:id
   * @description This route is used for delete blog. only admin can delete blogs
   * @response {Object} 200 - updated blog object
   */
  this.route.delete("/blogs/:id", auth, checkRole(["admin"]), deleteBlog(this));

  /**
   * GET /blogs/:id/related
   * @description This route is used for related blog. when customer open single blog user also can see some related blog.
   * @response {Object} 200 - related blog object
   */
  this.route.get("/blogs/:id/related", relatedBlog(this));
}
