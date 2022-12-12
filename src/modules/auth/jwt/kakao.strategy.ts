import { Injectable } from '@nestjs/common';
import QueryString from 'qs';
import { KakaoTokensResDto } from '../dto/res/kakao-tokens-res.dto';
import { KakaoUserInfosResDto } from '../dto/res/kakao-userInfo-res.dto';

@Injectable()
export class KakaoStrategy {
  url: string;
  clientID: string;
  clientSecret: string;
  redirectUri: string;
  code: string;

  constructor() {
    this.url = 'https://kauth.kakao.com';
    this.clientID = `${process.env.NODE_ENV}.auth.kakao.client_id`;
    this.redirectUri = `${process.env.NODE_ENV}.auth.kakao.redirectUri`;
  }

  getToken = async (code: string): Promise<KakaoTokensResDto> => {
    let response: any;

    await fetch(this.url + '/oauth/token', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: QueryString.stringify({
        grant_type: 'authorization_code',
        client_id: this.clientID,
        redirectUri: this.redirectUri,
        code: code,
      }),
    })
      .then((res) => {
        response = res.json();
      })
      .catch((err) => {
        response = err.json();
      });

    return response;
  };
  getUserInfo = async (accessToken: string): Promise<KakaoUserInfosResDto> => {
    let response: any;

    await fetch('https://kapi.kakao.com/v2/user/me', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    })
      .then((res) => {
        response = res.json();
      })
      .catch((err) => {
        response = err;
      });
    return response;
  };
}
