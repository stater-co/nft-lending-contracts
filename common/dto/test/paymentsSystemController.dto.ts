import { Payments, PaymentsConstructor } from "../../../typechain-types/Payments";
import { PaymentsMethods } from "../../../typechain-types/PaymentsMethods";

export interface PaymentsSystemController {
    payments: Payments;
    paymentMethods: PaymentsMethods;
    constructor: PaymentsConstructor.StructStruct;
    houndsAddress: string;
    queuesAddress: string;
    arenasAddress: string;
}