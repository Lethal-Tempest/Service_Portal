import jwt from 'jsonwebtoken'; 

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token || token.trim() === '') {
            return res.json({
                success: false,
                message: "Token not found"
            });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decode.id;
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
