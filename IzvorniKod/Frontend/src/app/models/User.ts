export class User{
    Username: string;
    Password: string;
    Name: string;
    Surname: string;
    //slika osobne
    IBAN : string;
    Email: string;
    IsEmailConfirmed: boolean;
    RoleId: number;

    constructor(username: string, password: string, name: string, surname: string, iban: string, email: string, isEmailConfirmed: boolean, roleId: number){
        this.Username = username;
        this.Password = password;
        this.Name = name;
        this.Surname = surname;
        this.IBAN = iban;
        this.Email = email;
        this.IsEmailConfirmed = isEmailConfirmed;
        this.RoleId = roleId;
    }
}