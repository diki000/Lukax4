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
    AccessToken: string;
    //{{currentUser.name}} {{currentUser.surname}}
    constructor(username: string, password: string, name: string, surname: string, iban: string, email: string, isEmailConfirmed: boolean, roleId: number, accessToken:string){
        this.Username = username;
        this.Password = password;
        this.Name = name;
        this.Surname = surname;
        this.IBAN = iban;
        this.Email = email;
        this.IsEmailConfirmed = isEmailConfirmed;
        this.RoleId = roleId;
        this.AccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imx1a2EiLCJwYXNzd29yZCI6Imxvemlua2ExIiwicm9sZUlEIjoiMSJ9.vLnJdDsQcYlWOf-Ng5Jw6DkAwPYM7PUb1x-Z-K3C1Uk";
    }
}