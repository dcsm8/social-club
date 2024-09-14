import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersModule } from './members/members.module';
import { ClubsModule } from './clubs/clubs.module';
import { ClubMembersModule } from './club-members/club-members.module';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(__dirname, '..', 'data', 'socialclub.sqlite'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MembersModule,
    ClubsModule,
    ClubMembersModule,
  ],
})
export class AppModule {}
