import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common"
import { GamificationService } from "./gamification.service"
import { CreateGamificationDto } from "./dto/create-gamification.dto"
import { UpdateGamificationDto } from "./dto/update-gamification.dto"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"

@Controller("gamification")
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Post()
  create(@Body() createGamificationDto: CreateGamificationDto) {
    return this.gamificationService.create(createGamificationDto);
  }

  @Get()
  findAll() {
    return this.gamificationService.findAll()
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.gamificationService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamificationService.findOne(id);
  }

  @Patch(":id")
  update(@Param('id') id: string, @Body() updateGamificationDto: UpdateGamificationDto) {
    return this.gamificationService.update(id, updateGamificationDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gamificationService.remove(id);
  }
}
