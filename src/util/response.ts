
export interface responseInterface {
  err?: {} | null;
  resCode: number;
  success: {};
  message: string;
  origin?: string;
}

export const sendResponseBody = ({
  err = null,
  resCode,
  success,
  message,
}: responseInterface) => {

  const headers = {
    'Access-Control-Allow-Origin': process.env.ORIGIN,
    'Access-Control-Allow-Credentials': true
  };
  return {
    statusCode: resCode,
    headers,
    body: JSON.stringify(
      {
        message,
        response: err ? err : success,
      },
      null,
      2
    ),
  };
};


export async function internalServerError(error: any) {

  if (process.env.APP_ENV == 'local' || process.env.APP_ENV == 'development') {
    console.log(error);
  }

  let message = 'Internal server error';

  if (error && error.message) {
    message = error.message;
  }

  //Attempt to give a better response message
  if (error?.errors && error?.errors.length) {
    message = `${error?.errors[0]?.message?.toUpperCase()}. Please check ${error?.errors[0]?.value}`;
  }

  return sendResponseBody({
    err: {
      type: Object.getPrototypeOf(error).constructor.name,
      message: Object.getPrototypeOf(error).constructor.message
    },
    resCode: 500,
    success: {},
    message: message,
  });
}

export async function badRequest(message: string) {
  return sendResponseBody({
    err: null,
    resCode: 400,
    success: {},
    message: message,
  });
}
