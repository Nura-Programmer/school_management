import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
    res.status(201).json({
        id: 1,
        name: req.body.name,
        address: req.body.address,
    });
});

export default router;