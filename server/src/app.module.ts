import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './connection/prisma.service';


@Module({
  imports: [UserModule, AuthModule],
  providers: [PrismaService],
})
export class AppModule {}
