import jwt from 'jsonwebtoken'; 

const authUser = async (req, res, next) => {
    try {
         const token = req.headers.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

        if (!token || token.trim() === '') {
            return res.json({
                success: false,
                message: "Token not found"
            });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { _id: token_decode.id, role: token_decode.role };

        next();
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

export default authUser;
