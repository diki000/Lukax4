export class User{
    Id: number;
    Username: string;
    Password: string;
    Name: string;
    Surname: string;
    idImagePath: string;
    IBAN : string;
    Email: string;
    IsEmailConfirmed: boolean;
    RoleId: number;

    constructor(id: number ,username: string, password: string, name: string, surname: string, iban: string, email: string, isEmailConfirmed: boolean, roleId: number, idImagePath: string){
        this.Id = id;
        this.Username = username;
        this.Password = password;
        this.Name = name;
        this.Surname = surname;
        this.IBAN = iban;
        this.Email = email;
        this.IsEmailConfirmed = isEmailConfirmed;
        this.RoleId = roleId;
        this.idImagePath = idImagePath;
    }
}