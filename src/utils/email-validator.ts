import { EmailValidator } from "src/presentation/protocols/email-validator";

export class EmailValidatorAdapter implements EmailValidator {
    isValid(email: string): boolean {
        return false;
    }
}