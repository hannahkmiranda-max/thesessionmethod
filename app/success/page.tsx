"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading check
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #070C11 0%, #0D1419 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      fontFamily: "'Barlow', sans-serif"
    }}>
      <style jsx>{`
        @keyframes checkmark {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes circle {
          0% { stroke-dashoffset: 314; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .success-box {
          background: rgba(13, 20, 25, 0.95);
          border: 1px solid rgba(0, 214, 143, 0.3);
          border-radius: 8px;
          padding: 48px;
          max-width: 520px;
          width: 100%;
          text-align: center;
          animation: fadeIn 0.6s ease-out;
        }
        .checkmark-circle {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
        }
        .checkmark-circle svg circle {
          stroke: #00D68F;
          stroke-width: 3;
          fill: none;
          stroke-dasharray: 314;
          stroke-dashoffset: 314;
          animation: circle 0.6s ease-out forwards;
        }
        .checkmark-circle svg path {
          stroke: #00D68F;
          stroke-width: 4;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: checkmark 0.4s ease-out 0.4s forwards;
        }
        .success-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 12px;
          letter-spacing: 0.02em;
        }
        .success-subtitle {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 32px;
          line-height: 1.5;
        }
        .order-info {
          background: rgba(0, 214, 143, 0.08);
          border: 1px solid rgba(0, 214, 143, 0.2);
          border-radius: 6px;
          padding: 20px;
          margin-bottom: 32px;
        }
        .order-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .order-product {
          font-size: 18px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 4px;
        }
        .order-price {
          font-family: 'JetBrains Mono', monospace;
          font-size: 24px;
          font-weight: 700;
          color: #00D68F;
        }
        .download-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(180deg, #00D68F 0%, #00B377 100%);
          color: #070C11;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 16px 40px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          margin-bottom: 24px;
        }
        .download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 214, 143, 0.3);
        }
        .email-note {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1.6;
        }
        .email-note strong {
          color: rgba(255, 255, 255, 0.7);
        }
        .back-link {
          display: inline-block;
          margin-top: 24px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
          text-decoration: none;
          transition: color 0.2s;
        }
        .back-link:hover {
          color: #00D68F;
        }
      `}</style>

      <div className="success-box">
        {loading ? (
          <div style={{ padding: "40px 0" }}>
            <div style={{
              width: 40,
              height: 40,
              border: "3px solid rgba(0, 214, 143, 0.2)",
              borderTopColor: "#00D68F",
              borderRadius: "50%",
              margin: "0 auto",
              animation: "spin 1s linear infinite"
            }} />
            <style jsx>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          <>
            <div className="checkmark-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" />
                <path d="M30 50 L45 65 L70 35" />
              </svg>
            </div>

            <h1 className="success-title">Payment Successful!</h1>
            <p className="success-subtitle">
              Thank you for your purchase. Your download is ready.
            </p>

            <div className="order-info">
              <div className="order-label">Your Order</div>
              <div className="order-product">The Session Blueprint</div>
              <div className="order-price">$47.00</div>
            </div>

            <a href="#" className="download-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Your Workbook
            </a>

            <p className="email-note">
              A confirmation email with your download link has also been sent to your email address.
              <br /><br />
              <strong>Having trouble?</strong> Contact support@thesessionmethod.com
            </p>

            <Link href="/" className="back-link">
              ← Back to Home
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
