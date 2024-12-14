import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { HashModule } from './hash.module';
import * as passport from 'passport';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '60s' },
    }),
    HashModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {
  constructor(private authService: AuthService) {
    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id: number, done) => {
      const user = await this.authService.findUserById(id);
      done(null, user);
    });
  }
}
