export class RemoveUserError extends Error {
    public readonly name = 'RemoveUserError'
  
    constructor(){
      super('Error to remove, user is renting')
    }
}
