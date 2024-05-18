import axios from "axios";
import Response from "./interfaces/response";
import Profile from "./interfaces/profile";
import * as fs from "fs";

const apiUrl: string = "https://api.anixart.tv/profile/";
const minId: number = 1;
const maxId: number = 1e9;

const isValid = async (url: string): Promise<boolean> => {
  const checkUrl = /^https:\/\/api.anixart.tv\/profile\/\d+/;
  if (!checkUrl.test(url)) return false;

  const response: Response = await axios
    .get(url)
    .then((response) => response.data);

  const code = response.code;
  if (code === 0) return true;
  return false;
};

const getProfile = async (id: number): Promise<Profile | null> => {
  const url: string = `${apiUrl}${id}`;
  if (!(await isValid(url))) return null;
  const response: Response = await axios
    .get(url)
    .then((response) => response.data);

  return response.profile;
};

const writeTotal = (fileStream: fs.WriteStream, users: number): void => {
  fileStream.writable
    ? fileStream.write(`\n\nTotal users: ${users}`)
    : console.error("Not writable");
};

(async () => {
  const fileStream: fs.WriteStream = fs.createWriteStream(
    "./src/users/users.txt",
    { flags: "a" }
  );
  let errors: number = 0;
  let users: number = 0;
  let roles: any = [];

  process.on("SIGINT", () => {
    writeTotal(fileStream, users);
    fileStream.close();
    process.exit();
  });

  console.log("Brute started");
  for (let i: number = minId; i < maxId; i++) {
    const profile: Profile | null = await getProfile(i);
    if (profile !== null) {
      errors = 0;
      users++;
      profile.roles
        ? profile.roles.forEach((role) => roles.push(role.name))
        : null;
      fileStream.writable
        ? fileStream.write(
            `User № ${profile.id}: ${profile.login} (${
              profile.friend_count
            } friends${profile.roles.length > 0 ? ", roles: [" : ""}${
              profile.roles.length > 0 ? roles.join(", ") + "]" : ""
            }${
              profile.is_sponsor
                ? ", sponsor until " +
                  (profile.sponsorshipExpires === 0
                    ? "PERMANENT"
                    : new Date(profile.sponsorshipExpires))
                : ""
            })\n`
          )
        : console.error("Not writable");
      roles = [];
    } else {
      errors++;
    }

    if (errors > 20) {
      writeTotal(fileStream, users);
      fileStream.close();
      break;
    }
  }
})();
