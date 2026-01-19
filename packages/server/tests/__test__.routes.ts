import { Router } from "express";

const router = Router();

router.get("/crash", () => {
    throw new Error("Forced crash for testing purposes");
})

export default router;