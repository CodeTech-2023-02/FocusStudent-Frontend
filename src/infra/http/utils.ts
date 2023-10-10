

export class UtilsHttp {
  
  static getAccessToken() {
    return "token"
  }

  static getRoleUser(): string {
    return "user"
  }

  static BaseHeaders() {
    return {
      Authorization: `Bearer ${this.getAccessToken()}`, 
    };
  }

}
