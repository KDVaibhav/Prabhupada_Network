import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModule } from './modules/blog/blog.module';
import { EventModule } from './modules/event/event.module';
import { DonationModule } from './modules/donation/donation.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { CourseModule } from './modules/course/course.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { QuoteModule } from './modules/quote/quote.module';
import { QueryModule } from './modules/query/query.module';
import { SubscriberModule } from './modules/subscriber/subscriber.module';
import { JoinUsModule } from './modules/join-us/join-us.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    BlogModule,
    EventModule,
    DonationModule,
    GalleryModule,
    CourseModule,
    AuthModule,
    JwtModule,
    QuoteModule,
    QueryModule,
    SubscriberModule,
    JoinUsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
