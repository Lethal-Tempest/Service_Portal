import workerModel from "../models/workerModel.js";


export const fetchAllWorkers = async (req, res) => {
    try {
        const response = await workerModel.find({});
        if(response.length){
            res.json({
                success: true,
                message: "Workers fetched successfully",
                workers: response,
            })
        }
        else{
            res.json({
                success: true,
                message: "No worker found"
            })
        }
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
        console.error(error);
    }
}



