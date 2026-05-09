import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Post from "../models/post.model";
import { postService } from "./admin.service";
import ApiError from "../utils/api.error";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Post.deleteMany({});
});

const validPost = {
  title: "Test Post",
  email: "test@mail.com",
  description: "Description",
  author: "Ankita",
  published: true,
  option_type: "job",
  skills: ["node"],
  tags: ["mern"],
};

describe("PostService Integration Tests", () => {

  //CREATE SUCCESS
  it("should create post successfully", async () => {
    const post = await postService.createPost(validPost);
    expect(post._id).toBeDefined();
    expect(post.email).toBe("test@mail.com");
  });

  //DUPLICATE EMAIL
  it("should throw error if email already used", async () => {
    await postService.createPost(validPost);
    await expect(postService.createPost(validPost))
      .rejects.toThrow("Email already used");
  });

  //GET ALL
  it("should fetch all posts", async () => {
    await postService.createPost(validPost);
    const posts = await postService.getPosts();
    expect(posts.length).toBe(1);
  });

  //GET ONE
  it("should fetch post by id", async () => {
    const post = await postService.createPost(validPost);
    const result = await postService.getPost(post._id.toString());
    expect(result?.title).toBe("Test Post");
  });

  // INVALID ID
  it("should throw error for invalid id", async () => {
    await expect(postService.getPost("123"))
      .rejects.toThrow("Invalid post id");
  });

  // UPDATE
  it("should update post", async () => {
    const post = await postService.createPost(validPost);
    const updated = await postService.updatePost(post._id.toString(), {
      title: "Updated Title",
    });
    expect(updated?.title).toBe("Updated Title");
  });

  // UPDATE DUPLICATE EMAIL
  it("should throw error if updating email to existing one", async () => {
    await postService.createPost(validPost);
    const second = await postService.createPost({ ...validPost, email: "new@mail.com" });

    await expect(
      postService.updatePost(second._id.toString(), { email: "test@mail.com" })
    ).rejects.toThrow("Email already used");
  });

  // DELETE
  it("should delete post", async () => {
    const post = await postService.createPost(validPost);
    await postService.deletePost(post._id.toString());

    const found = await Post.findById(post._id);
    expect(found).toBeNull();
  });

  // PAGINATION
  it("should return paginated posts with search", async () => {
    await postService.createPost(validPost);
    await postService.createPost({
      ...validPost,
      email: "react@mail.com",
      title: "React Job",
    });

    const result = await postService.getPostsWithPagination({
      search: "react",
      page: 1,
      limit: 10,
    });

    expect(result.total).toBe(1);
    expect(result.data[0].title).toBe("React Job");
  });

});