import { describe, expect } from "vitest";
import { isValidEmail, isValidOTPCode, isValidPhoneNumber } from "./validation";

const validEmails = [
  "jwiza@bogan.info",
  "shawna.nitzsche@yahoo.com",
  "edgar55@johnston.com",
  "bernardo.west@yahoo.com",
  "ipadberg@jakubowski.com",
  "nmaggio@gmail.com",
  "penelope03@marks.org",
  "stamm.maximilian@wolff.st",
  "kihn.ward@abernathy.info",
  "esteban52@blanda.biz",
  "awhite@ankunding.com",
  "fermin23@gmail.com",
  "rickey.rice@yahoo.xyz",
  "julie49@rice.id",
  "sdavis@hotmail.co",
  "amber.gutkowski@yahoo.co.nz",
  "herman.elenora@yahoo.co.uk",
  "perry.okuneva@legros.eth",
  "leffler.vena@wunsch.com",
  "caitlyn08@gmail.com",
  "leland77@bernhard.org",
  "edmond.reinger@gmail.com",
  "fannie.kuphal@hotmail.com",
  "ardith81@hotmail.com",
  "shaag@yahoo.com",
  "xconnelly@yahoo.com",
  "kacie63@hotmail.com",
  "pete.ankunding@gmail.com",
  "mia.kautzer@lemke.com",
  "shanelle41@yahoo.com",
  "jorge28@hotmail.com",
  "blaise79@waters.com",
  "xdenesik@swaniawski.org",
  "morar.odessa@hotmail.com",
  "thoppe@yahoo.com",
  "logan12@yahoo.com",
  "nakia.nader@gmail.com",
  "khagenes@murazik.com",
  "donnie69@huel.com",
  "stefanie.nitzsche@hotmail.com",
  "verdie.effertz@gmail.com",
  "lelah00@hessel.biz",
  "champlin.mose@nienow.com",
  "chyna35@fritsch.biz",
  "pfannerstill.pete@mraz.com",
  "giuseppe84@yahoo.com",
  "vharvey@reilly.com",
  "prosacco.malika@jacobi.com",
  "frances.quitzon@okon.net",
  "xokuneva@gmail.com",
];

const invalidEmails = [
  "jwiza@bogan...@info",
  "shawna.nitzsche@@yahoo.com",
  "edgar55#$#@~johnston.com",
  "bernardo~~+.west@yahoo.-com",
  "ipadberg@jaku@.bowski.com",
  "stamm.maximil%ian@wolf,,f.st",
  "esteban52@bla{}nda.b1",
  "rickey.rice@yahoo<..<>xyz0-",
  "julie49@ri||ce.id||",
  "amber.gutkows^^ki@yahoo...co....nz",
  "perry.okuneva@leg__ros.eth##",
  "edmond.reinger",
  "@hotmail.com",
  "mia.kautzer@lemke..",
  "shanelle41@yahoo`.com",
];

describe.concurrent("validation tests", () => {
  it("should be valid email address", () => {
    validEmails.forEach((email) => {
      expect(isValidEmail(email)).toBe(true);
    });
  });

  it("should be invalid email address", () => {
    invalidEmails.forEach((email) => {
      expect(isValidEmail(email)).toBe(false);
    });
  });

  it("should be valid OTP code", () => {
    expect(isValidOTPCode("123456")).toBe(true);
  });

  it("should be invalid OTP code", () => {
    ["1", "1234567", "test"].forEach((code) => {
      expect(isValidOTPCode(code)).toBe(false);
    });
  });

  it("should be valid phone number", () => {
    expect(isValidPhoneNumber("+44123456789")).toBe(true);
  });

  it("should be invalid phone number", () => {
    expect(isValidPhoneNumber("")).toBe(false);
  });
});
