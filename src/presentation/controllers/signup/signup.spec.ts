import { MissingParamError, InvalidParamError } from "../../errors";
import { ServerError } from "../../errors/server-error";
import { SignUpController } from "./signup";
import {
  EmailValidator,
  AccountModel,
  AddAccount,
  AddAccountModel,
} from "./signup-protocols";

interface StutTypes {
  sut: SignUpController;
  emailValidator: EmailValidator;
  addAccount: AddAccount;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      return {
        id: "valid_id",
        name: "valid_name",
        email: "XXXXXXXXXXXXXXXXXXXX",
        password: "XXXXXXXXXXXXXXXXXXXX",
      };
    }
  }

  return new AddAccountStub();
};

const makeSut = (): StutTypes => {
  const emailValidator = makeEmailValidator();
  const addAccount = makeAddAccount();
  const sut = new SignUpController(emailValidator, addAccount);

  return {
    sut,
    emailValidator,
    addAccount,
  };
};

describe("SignUp Controller", () => {
  test("Should return 400 if no name is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  test("Should return 400 if no password is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email",
        name: "any_name",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("Should return 400 if password confirmation fails", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "invalid_passoword",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError("passwordConfirmation")
    );
  });

  test("Should return 400 if a invalid e-mail is provided", () => {
    const { sut, emailValidator } = makeSut();
    jest.spyOn(emailValidator, "isValid").mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        email: "any_email",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });

  test("Should call EmailValidator with correct e-mail", () => {
    const { sut, emailValidator } = makeSut();
    const isValidSpy = jest.spyOn(emailValidator, "isValid");
    const httpRequest = {
      body: {
        email: "any_email@gmail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith("any_email@gmail.com");
  });

  test("Should return 500 if EmailValidator throws a ServerError", () => {
    const { sut, emailValidator } = makeSut();

    jest.spyOn(emailValidator, "isValid").mockImplementationOnce(() => {
      throw new Error(); // Simula um erro no servidor.
    });

    const httpRequest = {
      body: {
        email: "any_email",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should call AddAccoint with correct values", () => {
    const { sut, addAccount } = makeSut();
    const addSpy = jest.spyOn(addAccount, "add");
    const httpRequest = {
      body: {
        email: "any_email@gmail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      email: "any_email@gmail.com",
      name: "any_name",
      password: "any_password",
    });
  });
});
