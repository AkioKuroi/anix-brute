import Profile from "./profile";

export default interface Response {
  code: number;
  profile: Profile;
  is_my_profile: boolean;
}
