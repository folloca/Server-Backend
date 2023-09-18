import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { KakaoTokensResDto } from '../dto/res/kakao-tokens-res.dto';
import { KakaoUserInfosResDto } from '../dto/res/kakao-userInfo-res.dto';

@Injectable()
export class KakaoStrategy {
  url: string;
  clientID: string;
  clientSecret: string;
  redirectUri: string;
  code: string;

  constructor(private readonly configService: ConfigService) {
    this.url = 'https://kauth.kakao.com';
    this.clientID = configService.get(
      `${process.env.NODE_ENV}.auth.kakao.client_id`,
    );
    this.redirectUri = configService.get(
      `${process.env.NODE_ENV}.auth.kakao.redirect_uri`,
    );
  }

  getToken = async (code: string): Promise<KakaoTokensResDto> => {
    let response: any;

    await axios
      .post(
        this.url + '/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: this.clientID,
          redirectUri: this.redirectUri,
          code: code,
        },
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      )
      .then((res) => {
        response = res.data;
      })
      .catch((err) => {
        response = err;
      });

    return response;
  };

  getUserInfo = async (accessToken: string): Promise<KakaoUserInfosResDto> => {
    let response: any;

    await axios
      .get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      })
      .then((res) => {
        response = res.data;
      })
      .catch((err) => {
        response = err;
      });
    return response;
  };
}
