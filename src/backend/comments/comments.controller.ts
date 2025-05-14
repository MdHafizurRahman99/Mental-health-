import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from "@nestjs/common"
import { CommentsService } from "./comments.service"
import { CreateCommentDto } from "./dto/create-comment.dto"
import { UpdateCommentDto } from "./dto/update-comment.dto"
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger"
import { Comment } from "./schemas/comment.schema"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"

@ApiTags("comments")
@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new comment" })
  @ApiResponse({
    status: 201,
    description: "The comment has been successfully created",
    type: Comment,
  })
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: any) {
    createCommentDto.authorId = req.user.userId
    return this.commentsService.create(createCommentDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all comments with optional filtering" })
  @ApiQuery({ name: "postId", required: false, description: "Filter by post ID" })
  @ApiQuery({ name: "authorId", required: false, description: "Filter by author ID" })
  @ApiQuery({ name: "parentCommentId", required: false, description: "Filter by parent comment ID" })
  @ApiQuery({ name: "limit", required: false, description: "Number of comments to return" })
  @ApiQuery({ name: "page", required: false, description: "Page number" })
  @ApiResponse({
    status: 200,
    description: "Returns a paginated list of comments",
    schema: {
      properties: {
        comments: {
          type: "array",
          items: { $ref: "#/components/schemas/Comment" },
        },
        total: { type: "number" },
        page: { type: "number" },
        limit: { type: "number" },
      },
    },
  })
  findAll(
    @Query("postId") postId?: string,
    @Query("authorId") authorId?: string,
    @Query("parentCommentId") parentCommentId?: string,
    @Query("limit") limit?: number,
    @Query("page") page?: number,
  ) {
    return this.commentsService.findAll(postId, authorId, parentCommentId, limit, page)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a comment by ID" })
  @ApiParam({ name: "id", description: "Comment ID" })
  @ApiResponse({
    status: 200,
    description: "Returns the comment with the specified ID",
    type: Comment,
  })
  @ApiResponse({ status: 404, description: "Comment not found" })
  findOne(@Param("id") id: string) {
    return this.commentsService.findOne(id)
  }

  @Get(":id/replies")
  @ApiOperation({ summary: "Get replies to a comment" })
  @ApiParam({ name: "id", description: "Comment ID" })
  @ApiQuery({ name: "limit", required: false, description: "Number of replies to return" })
  @ApiQuery({ name: "page", required: false, description: "Page number" })
  @ApiResponse({
    status: 200,
    description: "Returns a paginated list of replies to the comment",
    schema: {
      properties: {
        replies: {
          type: "array",
          items: { $ref: "#/components/schemas/Comment" },
        },
        total: { type: "number" },
        page: { type: "number" },
        limit: { type: "number" },
      },
    },
  })
  findReplies(@Param("id") id: string, @Query("limit") limit?: number, @Query("page") page?: number) {
    return this.commentsService.findReplies(id, limit, page)
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a comment" })
  @ApiParam({ name: "id", description: "Comment ID" })
  @ApiResponse({
    status: 200,
    description: "The comment has been successfully updated",
    type: Comment,
  })
  @ApiResponse({ status: 403, description: "Forbidden: You can only update your own comments" })
  @ApiResponse({ status: 404, description: "Comment not found" })
  update(@Param("id") id: string, @Body() updateCommentDto: UpdateCommentDto, @Req() req) {
    return this.commentsService.update(id, updateCommentDto, req.user.userId)
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a comment" })
  @ApiParam({ name: "id", description: "Comment ID" })
  @ApiResponse({
    status: 200,
    description: "The comment has been successfully deleted",
    type: Comment,
  })
  @ApiResponse({ status: 403, description: "Forbidden: You can only delete your own comments" })
  @ApiResponse({ status: 404, description: "Comment not found" })
  remove(@Param("id") id: string, @Req() req) {
    return this.commentsService.remove(id, req.user.userId)
  }
}
