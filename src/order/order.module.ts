import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/config/connectMongoDB/database.module';
import { jwtConstants } from 'src/constant/jwt.constant';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [DatabaseModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule { }
