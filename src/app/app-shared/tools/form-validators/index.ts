import { SpecialCarc } from "./caractersDpecial.validator";
import { CinValidtors } from "./cin.validators";
import { EmailValidator } from "./email.validators";
import { ArabicInputValidator } from "./is-arabic.validator";
import { BeforeDateAudienceJugementValidator } from "./is-before-audience-jugement.validator";
import { BeforeDateConvocation } from "./is-before-audience.validator";
import { BeforeDateJugementValidator } from "./is-before-jugement.validator";
import { BeforeDateContratValidator } from "./is-before.validator";
import { BeforeDateContraSignValidator } from "./is-before_sign.validator";
import { FrinputValidator } from "./is-french.validators";
import { NumberValidator } from "./is-number.validator";
import { haveNumber } from "./isnumber.validators";
import { AfterStrictateValidator } from "./isstrictAfter.validator";
import { LessOrEqualValidator } from "./less-or-equal.validator";
import { lessValidator } from "./less.validator";
import { ismatricule } from "./matricule-format";
import { MatriculeValidtors } from "./matricule-validator";
import { Max10Validator } from "./Max10.validator";
import { Max10Code } from "./max10Codevalidators";
import { Min8 } from "./Min8.validators";
import { Minuscule } from "./minuscule.validators";
import { MontNumb } from "./monthNum.validators";
import { MonthLValidator } from "./monthnumber.validators";
import { CaractinputValidator } from "./onlyCaracter.validator";
import { PassportValidator } from "./passport.validator";
import { PasswordMatches } from "./password.matches";
import { PhoneNumber } from "./phoneNumber.validator";
import { PositiveNumberValidator } from "./positive-number.validator";
import { PositiveNumberNOTnULLValidator } from "./StrictPositveNumber.validator";
import { Majuscule } from "./uppercase.validators";
import { URLValidator } from "./url.validator";
import { YearNumm } from "./withoutzero.validator";

export const CustomValidators = {

    Number: NumberValidator,
    ArbicInput: ArabicInputValidator,
    PositiveNumber: PositiveNumberValidator,
    LessOrEqual: LessOrEqualValidator,
    URL: URLValidator(),
    AfterStrictDate: AfterStrictateValidator ,
    BeforeDateConvocation : BeforeDateConvocation,
    BeforeDateAudienceJugement: BeforeDateAudienceJugementValidator,
    BeforeDateJugement : BeforeDateJugementValidator,
    BeforeDate: BeforeDateContratValidator,
    BeforeDateSign: BeforeDateContraSignValidator,
    PasswordMatches,
    Frinput: FrinputValidator(),
    Less: lessValidator,
    min8: Min8,
    codemax10: Max10Code,
    havenumber: haveNumber,
    ismatricule: ismatricule,
    SpecialCarc,
    minuscule: Minuscule,
    majuscule: Majuscule,
    PositiveNumberNotnull: PositiveNumberNOTnULLValidator,
    emailValidator: EmailValidator,
    isCin: CinValidtors,
    isCaract: CaractinputValidator,
    monthNum: MontNumb,
    yearnum: YearNumm,
    monthValidator: MonthLValidator,
    max10Validator: Max10Validator,
    PhoneNumberValidator: PhoneNumber,
    //uniqueidentifiantValidator: UniqueidentifiantValidator,
    matriculeValidator: MatriculeValidtors,
    // uniqueMatriculeValidator: UniqueMatriculeValidator,
    isPassport: PassportValidator,
  }
