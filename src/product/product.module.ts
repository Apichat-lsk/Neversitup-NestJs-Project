import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/config/connectMongoDB/database.module';
import { jwtConstants } from 'src/constant/jwt.constant';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [DatabaseModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule { }
