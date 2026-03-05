import {NumberValidator} from './is-number.validator';
import {GreaterOrEqualValidator} from './greater-or-equal.validator';
import {LessOrEqualValidator} from './less-or-equal.validator';
import {PositiveNumberValidator} from './positive-number.validator';
import {URLValidator} from './url.validator';
import {AfterDateContractValidator} from './is-after.validator';
import {BeforeDateContratValidator} from './is-before.validator';
import {PasswordMatches} from './password.matches';
import {ArbicInputValidator} from './is-arabic.validtor';
import {FrinputValidator} from './is-french.validators';
import {GreaterValidator} from './greater.validators';
import {SchoolYearValidator} from './is-school-year';
import {Min8} from './Min8.validators';
import {haveNumber} from './isnumber.validators';
import {SpecialCarc} from './caractersSpecial.validator';
import {Minuscule} from './minuscule.validators';
import {Majuscule} from './uppercase.validators';
import {PositiveNumberNOTnULLValidator} from './StrictPositveNumber.validator';
import {EmailValidator} from './email.validators';
import {CinValidtors} from './cin.validators';
import {CaractinputValidator} from './onlyCaracter.validator';
import {Max10Code} from './max10Codevalidators';
import {MontNumb} from './monthNum.validators';
import {YearNumm} from './withoutzero.validator';
import {MonthLValidator} from './monthnumber.validators';

import {PhoneNumber} from './phoneNumber.validator';
import {AfterStrictateValidator} from './isstrictAfter.validator';
import {MatriculeValidtors} from './matricule-validator';
import {Max10Validator} from './Max10.validator';
import {lessValidator} from './less.validator';
import {ismatricule} from './matricule-format';
import {CnssValidtors} from './cnss10';
import {PassportValidator} from './passport.validator';
import {  BeforeDateConvocation } from './is-before-audience.validator';
import { B } from '@angular/cdk/keycodes';
import { BeforeDateContraSignValidator } from './is-before_sign.validator';
import { BeforeDateAudienceJugementValidator } from './is-before-audience-jugement.validator';
import { BeforeDateJugementValidator } from './is-before-jugement.validator';
import { AfterDateJugementValidator } from './is-after-jugement.validator';
import { ipAddressValidator } from './ip.validator';

export const CustomValidators = {
    Number: NumberValidator,
    ArbicInput: ArbicInputValidator,
    PositiveNumber: PositiveNumberValidator,
    GreaterOrEqual: GreaterOrEqualValidator,
    LessOrEqual: LessOrEqualValidator,
    URL: URLValidator,
    AfterDate: AfterDateContractValidator,
    AfterStrictDate: AfterStrictateValidator,
    BeforeDateConvocation : BeforeDateConvocation,
    BeforeDateAudienceJugement: BeforeDateAudienceJugementValidator,
    BeforeDateJugement : BeforeDateJugementValidator ,
    AfterDateJugement : AfterDateJugementValidator , 
    BeforeDate: BeforeDateContratValidator,
    BeforeDateSign: BeforeDateContraSignValidator,
    PasswordMatches,
    Frinput: FrinputValidator,
    Greater: GreaterValidator,
    Less: lessValidator,
    SchoolYear: SchoolYearValidator,
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
    // uniquecnsstValidator: UniquecnsstValidator,
    // saveachteurvalidator: AchteursaveeValidator,
    // cnssExistenceValidtor: CnssExistenceValidtor,
    // taxExistenceValidtor: TaxExistenceValidtor,
    cnssValidtors: CnssValidtors,
    isPassport: PassportValidator,
    ipAddressValidator,
};
