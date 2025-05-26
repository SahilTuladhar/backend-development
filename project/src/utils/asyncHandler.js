// method 2 : With Promise

const asyncHandler = (requestHandler) => {

    return((req,res,next) => {
        Promise.resolve(requestHandler(req , res , next))
        .catch((err) => next(err))
    }
) 
}

export default asyncHandler


// Method 1: Without Promiseerror handling midd

// const aysncHandler = (requestHandler) => async(req , res , next) => {

//     try{
//         await requestHandler(req , res , next)

//     }catch(err){
//        res.status(err.code || 500)
//     }

// } 

