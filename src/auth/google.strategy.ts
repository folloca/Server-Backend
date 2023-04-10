import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleStrategy {
  clientID: string;
  clientSecret: string;
  redirectUri: string;

  constructor(private readonly configService: ConfigService) {
    this.clientID = configService.get(
      `${process.env.NODE_ENV}.auth.google.client_id`,
    );
    this.clientSecret = configService.get(
      `${process.env.NODE_ENV}.auth.google.client_secret`,
    );
    this.redirectUri = configService.get(
      `${process.env.NODE_ENV}.auth.google.redirect_uri`,
    );
  }

  getUserId = async (idToken: string) => {
    const client = new OAuth2Client(this.clientID);

    const ticket = await client.verifyIdToken({
      idToken: idToken,
    });
    const payload = ticket.getPayload();

    // oAuthId = payload['sub']
    // email = payload['email_verified'] && payload['email']
    // profile = payload['picture']
    const userId = payload['sub'];
    return {
      oauthId: userId,
      email: payload['email_verified'] && payload['email'],
      profile_image: payload['picture'],
    };
  };
}
