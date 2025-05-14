import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from "@nestjs/common"
import { PostsService } from "./posts.service"
import { CreatePostDto } from "./dto/create-post.dto"
import { UpdatePostDto } from "./dto/update-post.dto"
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger"
import { Post as PostEntity } from "./schemas/post.schema"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new post" })
  @ApiResponse({
    status: 201,
    description: "The post has been successfully created",
    type: PostEntity,
  })
  create(@Body() createPostDto: CreatePostDto, @Req() req: any) {
    // Override authorId with the authenticated user's ID
    createPostDto.authorId = req.user.userId
    return this.postsService.create(createPostDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all posts with optional filtering" })
  @ApiQuery({ name: "limit", required: false, description: "Number of posts to return" })
  @ApiQuery({ name: "page", required: false, description: "Page number" })
  @ApiQuery({ name: "authorId", required: false, description: "Filter by author ID" })
  @ApiQuery({ name: "groupId", required: false, description: "Filter by group ID" })
  @ApiQuery({ name: "tags", required: false, description: "Filter by tags (comma-separated)" })
  @ApiResponse({
    status: 200,
    description: "Returns a paginated list of posts",
    schema: {
      properties: {
        posts: {
          type: "array",
          items: { $ref: "#/components/schemas/Post" },
        },
        total: { type: "number" },
        page: { type: "number" },
        limit: { type: "number" },
      },
    },
  })
  findAll(
    @Query("limit") limit?: number,
    @Query("page") page?: number,
    @Query("authorId") authorId?: string,
    @Query("groupId") groupId?: string,
    @Query("tags") tags?: string,
  ) {
    const parsedTags = tags ? tags.split(",") : undefined
    return this.postsService.findAll(limit, page, authorId, groupId, parsedTags)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a post by ID" })
  @ApiParam({ name: "id", description: "Post ID" })
  @ApiResponse({
    status: 200,
    description: "Returns the post with the specified ID",
    type: PostEntity,
  })
  @ApiResponse({ status: 404, description: "Post not found" })
  findOne(@Param("id") id: string) {
    return this.postsService.findOne(id)
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a post" })
  @ApiParam({ name: "id", description: "Post ID" })
  @ApiResponse({
    status: 200,
    description: "The post has been successfully updated",
    type: PostEntity,
  })
  @ApiResponse({ status: 403, description: "Forbidden: You can only update your own posts" })
  @ApiResponse({ status: 404, description: "Post not found" })
  update(@Param("id") id: string, @Body() updatePostDto: UpdatePostDto, @Req() req) {
    return this.postsService.update(id, updatePostDto, req.user.userId)
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a post" })
  @ApiParam({ name: "id", description: "Post ID" })
  @ApiResponse({
    status: 200,
    description: "The post has been successfully deleted",
    type: PostEntity,
  })
  @ApiResponse({ status: 403, description: "Forbidden: You can only delete your own posts" })
  @ApiResponse({ status: 404, description: "Post not found" })
  remove(@Param("id") id: string, @Req() req) {
    return this.postsService.remove(id, req.user.userId)
  }
}
