import { SetMetadata } from "@nestjs/common"
import { UserRole } from "src/backend/user/schemas/user.schema"

export const Roles = (...roles: UserRole[]) => SetMetadata("roles", roles)
