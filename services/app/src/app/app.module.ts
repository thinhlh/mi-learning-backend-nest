import { MiddlewareConsumer, Module, NestModule, OnApplicationShutdown, OnModuleDestroy, OnModuleInit, RequestMethod } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggerMiddleware } from '../config/middlewares/logger.middleware';
import { CommonController } from './common/common.controller';
import { ConfigFactory, ConfigModule, ConfigService } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { ArticleModule } from './article/article.module';
import { CourseModule } from './course/course.module';
import { LessonModule } from './lesson/lesson.module';
import { SectionModule } from './section/section.module';
import { StudentCourseModule } from './student_course/student_course.module';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { MulterModule } from '@nestjs/platform-express';
import * as path from "path"
import { RatingModule } from './rating/rating.module';
import { EntityManager } from 'typeorm';
import { CourseService } from './course/course.service';
import { DataInitializerModule } from '../data/data-initializer.module';
import { AcceptLanguageResolver, I18n, I18nContext, I18nModule, I18nService, QueryResolver } from 'nestjs-i18n';
import { UserModule } from './user/user.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    // MulterModule.register({
    //   dest: "./static",
    //   preservePath: true,
    // }),
    ConfigModule.forRoot({
      envFilePath:
        `../../env/${process.env.ENV}.env`,
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        path: path.join(__dirname, "../i18n/"),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver, QueryResolver],
      logging: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      async useFactory(configService: ConfigService): Promise<TypeOrmModuleOptions> {
        return {
          host: process.env.POSTGRES_HOST,
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          port: +process.env.POSTGRES_PORT,
          type: 'postgres',
          logger: "advanced-console",
          // logging: process.env.ENV === 'dev' ? true : false,
          autoLoadEntities: true,
          synchronize: process.env.ENV === 'dev' ? true : false,
        }
      },
    }),
    TypeOrmModule.forRoot({
      host: process.env.POSTGRES_HOST,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      port: +process.env.POSTGRES_PORT,
      type: 'postgres',
      logger: "advanced-console",
      // logging: process.env.ENV === 'dev' ? true : false,
      autoLoadEntities: true,
      synchronize: process.env.ENV === 'dev' ? true : false,
    }),
    CategoryModule,
    ArticleModule,
    CourseModule,
    LessonModule,
    SectionModule,
    StudentCourseModule,
    RatingModule,
    UserModule,
    DataInitializerModule,
  ],

  controllers: [CommonController]
})
export class AppModule implements NestModule, OnModuleDestroy, OnModuleInit {

  constructor(
    private readonly manager: EntityManager,
    private readonly configService: ConfigService,
    private readonly courseService: CourseService,
  ) {

  }


  onModuleInit() {
  }
  async onModuleDestroy() {
    // 
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      LoggerMiddleware
    ).forRoutes({
      path: "",
      method: RequestMethod.ALL
    });
  }
}