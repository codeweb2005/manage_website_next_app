import express from "express";
import { PaypalService } from "../controllers/paypalController";
// import { authMiddleware } from "../middleware/authMiddleware";
import { approveApplication } from "../services/applicationService";    
import paypal from "paypal-rest-sdk";

const router = express.Router();
// Create a payment
router.post("/", PaypalService);
router.post("/paypal/execute", async (req, res) => {
  const { paymentId, payerId, applicationId } = req.body;

  try {
    const execute_payment_json = {
      payer_id: payerId,
    };

    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
      if (error) {
        console.error("PayPal Execute Error:", error.response);
        return res.status(500).json({ error: error.response });
      }

      // ✅ Gọi approveApplication để cập nhật trạng thái đơn và tạo lease
      const updatedApplication = await approveApplication(Number(applicationId));

      res.json({
        message: "Payment executed and application approved.",
        application: updatedApplication,
      });
    });
  } catch (err: any) {
    res.status(500).json({ message: `Error executing payment: ${err.message}` });
  }
});

export default router;