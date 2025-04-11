import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common"
import { TeletherapyService } from "./teletherapy.service"
import { CreateTeletherapySessionDto } from "./dto/create-teletherapy-session.dto"
import { UpdateTeletherapySessionDto } from "./dto/update-teletherapy-session.dto"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
import { SessionStatus } from "./schemas/teletherapy-session.entity"

@Controller("teletherapy")
@UseGuards(JwtAuthGuard)
export class TeletherapyController {
  constructor(private readonly teletherapyService: TeletherapyService) {}

  @Post()
  create(@Body() createTeletherapySessionDto: CreateTeletherapySessionDto) {
    return this.teletherapyService.create(createTeletherapySessionDto);
  }

  @Get()
  findAll(
    @Query('userId') userId: string,
    @Query('therapistId') therapistId: string,
    @Query('status') status: SessionStatus,
  ) {
    return this.teletherapyService.findAll(userId, therapistId, status)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teletherapyService.findOne(id);
  }

  @Patch(":id")
  update(@Param('id') id: string, @Body() updateTeletherapySessionDto: UpdateTeletherapySessionDto) {
    return this.teletherapyService.update(id, updateTeletherapySessionDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teletherapyService.remove(id);
  }
}
