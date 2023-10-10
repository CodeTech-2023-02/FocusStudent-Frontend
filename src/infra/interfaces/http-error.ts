class HttpError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public title: string = ""
  ) {
    super("Ocurrio un error al solicitar el servicio");
    this.name = "HttpError";
  }
}

export { HttpError };
