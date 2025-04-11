import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common"
import { CheckInsService } from "./check-ins.service"
import { CreateCheckInDto } from "./dto/create-check-in.dto"
import { UpdateCheckInDto } from "./dto/update-check-in.dto"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"

@Controller("check-ins")
@UseGuards(JwtAuthGuard)
export class CheckInsController {
  constructor(private readonly checkInsService: CheckInsService) {}

  @Post()
  create(@Body() createCheckInDto: CreateCheckInDto) {
    return this.checkInsService.create(createCheckInDto);
  }

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.checkInsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkInsService.findOne(id);
  }

  @Patch(":id")
  update(@Param('id') id: string, @Body() updateCheckInDto: UpdateCheckInDto) {
    return this.checkInsService.update(id, updateCheckInDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkInsService.remove(id);
  }
}
