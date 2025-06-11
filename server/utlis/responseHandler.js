import { error } from "console"

export const responseHandler={
    success:(res,data,message="Success",statusCode=200)=>{
        return res.status(statusCode).json({
            status: "success",
            message: message,
            data: data
        })
    },
    
  error: (res, error, message = "Server Error", statusCode = 500) => {
    console.error(message, error);
    return res.status(statusCode).json({ 
        status: "error",
         message
     });
  },

  badRequest: (res, message = "Resource not found",statusCode=404) => {
    return res.status(statusCode).json({ 
        status: "error", 
        message 
    });
  },
  notFound: (res, message = "Resource not found",statusCode=404) => {
    return res.status(statusCode).json({ 
        status: "error", 
        message 
    });
  },

  unauthorized: (res, message = "Unauthorized access",statusCode=401) => {
    return res.status(statusCode).json({ 
        status: "error", 
        message 
    });
  },
}