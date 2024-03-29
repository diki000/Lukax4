export class User{
    UserId: number;
    Username: string;
    Password: string;
    Name: string;
    Surname: string;
    idImagePath: string;
    IBAN : string;
    Email: string;
    IsEmailConfirmed: boolean;
    RoleId: number;
    AccessToken?: string;
    //{{currentUser.name}} {{currentUser.surname}}
    constructor(UserId: number, username: string, password: string, name: string, surname: string, iban: string, email: string, isEmailConfirmed: boolean, roleId: number, accessToken?: string, idImagePath?: string){
        this.UserId = UserId;
        this.Username = username;
        this.Password = password;
        this.Name = name;
        this.Surname = surname;
        this.IBAN = iban;
        this.Email = email;
        this.IsEmailConfirmed = isEmailConfirmed;
        this.RoleId = roleId;
        this.idImagePath = idImagePath || "";
    }
}