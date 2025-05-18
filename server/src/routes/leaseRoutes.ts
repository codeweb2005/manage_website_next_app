import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getLeases, getLeasePayments } from "../controllers/leaseControllers";
const router = express.Router();

router.get("/leases", getLeases);
router.get("/leases/:id/payments", getLeasePayments);


export default router;
