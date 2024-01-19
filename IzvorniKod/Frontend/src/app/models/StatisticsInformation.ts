export class StatisticsInformation{
    day: Date;
    reservations: number;
    moneyAmount: number;
    constructor(day: Date, reservations: number, moneyAmount: number) {
        this.day = day;
        this.reservations = reservations;
        this.moneyAmount = moneyAmount;
    }
}