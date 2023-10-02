export class User{
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public krand?: number,
    public id?: string
  ){}
}

