import { AccountModel } from "src/domain/models/account";
import { AddAccount, AddAccountModel } from "src/domain/usecases/add-account";
import { Encrypter } from "src/presentation/protocols/encrypter";

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);
    return Promise.resolve(null);
  }
}
