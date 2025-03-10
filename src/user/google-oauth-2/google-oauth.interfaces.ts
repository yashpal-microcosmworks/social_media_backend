import { UserEntity } from 'src/models/user-entity';

export interface GoogleAuthRegisterUserData {
  email: string;
  firstName: string;
  lastName: string;
  googleId: string;
  isAccountVerified: boolean;
  isActive: boolean;
  avatar: string;
}

export interface GoogleUser {
  user: UserEntity;
  accessToken: string;
  expiry: number;
  profile: {
    id: string;
    emails: { value: string }[];
    photos: { value: string }[];
    name: { givenName: string; familyName: string };
  };
}
