import { MissingParamError } from "../errors/missing-param-error"
import { SignUpController } from "./signup"

const makeSut = () => {
    return new SignUpController()
}

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', () => {
        const sut = makeSut()
        const httpRequest = {
            body: {
                email: 'any_email',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })
})