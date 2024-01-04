import { DbAddAccount } from "./db-add-account";

describe("DbAddAccount Usecase", () => {
  test("Should call Encrypter with correct password", async () => {
    class EncrypterStub {
        async encrypt(value: string): Promise<string> {
            return Promise.resolve("hashed_password");
        }
    }
    const encrypterSub = new EncrypterStub();
    const sut = new DbAddAccount(encrypterSub);
    const encryptSpy = jest.spyOn(encrypterSub, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });
});
