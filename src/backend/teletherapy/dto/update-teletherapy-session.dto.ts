import { PartialType } from "@nestjs/mapped-types"
import { CreateTeletherapySessionDto } from "./create-teletherapy-session.dto"

export class UpdateTeletherapySessionDto extends PartialType(CreateTeletherapySessionDto) {}
