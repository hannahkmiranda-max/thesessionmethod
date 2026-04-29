"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"

const Checkout = dynamic(() => import("@/components/checkout"), { ssr: false })

export default function TheSessionMethod() {
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [downloadOpen, setDownloadOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [processing, setProcessing] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [confirmEmail, setConfirmEmail] = useState("")
  const [discount, setDiscount] = useState(0)
  const [couponApplied, setCouponApplied] = useState(false)
  const [hiddenReviews, setHiddenReviews] = useState(false)
  
  // Social proof popup state
  const [showPopup, setShowPopup] = useState(false)
  const [popupData, setPopupData] = useState({ name: "", location: "", action: "" })

  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [email2, setEmail2] = useState("")
  const [cardName, setCardName] = useState("")
  const [card, setCard] = useState("")
  const [exp, setExp] = useState("")
  const [cvv, setCvv] = useState("")
  const [zip, setZip] = useState("")
  const [coupon, setCoupon] = useState("")

  const bookRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)

  // Book parallax effect
  useEffect(() => {
    const scene = sceneRef.current
    const book = bookRef.current
    if (!scene || !book) return

    const handleMouseMove = (e: MouseEvent) => {
      const r = scene.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      book.style.animation = "none"
      book.style.transform = `rotateY(${-28 + x * 22}deg) rotateX(${6 - y * 14}deg) translateY(-8px)`
    }

    const handleMouseLeave = () => {
      book.style.animation = "bookFloat 6s ease-in-out infinite, bookSpin 14s ease-in-out infinite"
      book.style.transform = ""
    }

    scene.addEventListener("mousemove", handleMouseMove)
    scene.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      scene.removeEventListener("mousemove", handleMouseMove)
      scene.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCheckoutOpen(false)
        setDownloadOpen(false)
      }
    }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [])

  // Body overflow
  useEffect(() => {
    document.body.style.overflow = checkoutOpen || downloadOpen ? "hidden" : ""
  }, [checkoutOpen, downloadOpen])

  // Social proof popup effect
  useEffect(() => {
    const names = [
      { name: "Marcus T.", location: "New York, NY" },
      { name: "Sarah K.", location: "Los Angeles, CA" },
      { name: "James R.", location: "Chicago, IL" },
      { name: "Emma L.", location: "Houston, TX" },
      { name: "David M.", location: "Phoenix, AZ" },
      { name: "Jennifer W.", location: "Philadelphia, PA" },
      { name: "Michael B.", location: "San Antonio, TX" },
      { name: "Ashley G.", location: "San Diego, CA" },
      { name: "Chris P.", location: "Dallas, TX" },
      { name: "Amanda H.", location: "Austin, TX" },
      { name: "Ryan S.", location: "Denver, CO" },
      { name: "Nicole F.", location: "Seattle, WA" },
      { name: "Andrew C.", location: "Boston, MA" },
      { name: "Stephanie D.", location: "Nashville, TN" },
      { name: "Kevin Z.", location: "Portland, OR" },
    ]
    
    const actions = [
      "just purchased the workbook",
      "is downloading the blueprint",
      "completed checkout",
      "just bought the workbook",
    ]

    const showRandomPopup = () => {
      const randomPerson = names[Math.floor(Math.random() * names.length)]
      const randomAction = actions[Math.floor(Math.random() * actions.length)]
      
      setPopupData({
        name: randomPerson.name,
        location: randomPerson.location,
        action: randomAction
      })
      setShowPopup(true)

      setTimeout(() => {
        setShowPopup(false)
      }, 4000)
    }

    // Initial popup after 5 seconds
    const initialTimeout = setTimeout(showRandomPopup, 5000)
    
    // Then show popup every 12-20 seconds
    const interval = setInterval(() => {
      showRandomPopup()
    }, 12000 + Math.random() * 8000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [])

  const openCheckout = () => {
    setCheckoutOpen(true)
    setStep(1)
  }

  const goToPayment = () => {
    if (!name.trim()) {
      alert("Please enter your name.")
      return
    }
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email.")
      return
    }
    if (email !== email2) {
      alert("Email addresses do not match.")
      return
    }
    setStep(2)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\D/g, "").substring(0, 16)
    return v.replace(/(.{4})/g, "$1  ").trim()
  }

  const formatExpiry = (value: string) => {
    let v = value.replace(/\D/g, "").substring(0, 4)
    if (v.length >= 2) v = v.substring(0, 2) + " / " + v.substring(2)
    return v
  }

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "LAUNCH20") {
      setDiscount(9.4)
      setCouponApplied(true)
      setCoupon("LAUNCH20 ✓ Applied")
    }
  }

  const processPayment = () => {
    const cardClean = card.replace(/\s/g, "")
    if (!cardName.trim()) {
      alert("Please enter the name on your card.")
      return
    }
    if (cardClean.length < 15) {
      alert("Please enter a valid card number.")
      return
    }
    if (!exp || exp.length < 4) {
      alert("Please enter a valid expiry date.")
      return
    }
    if (!cvv || cvv.length < 3) {
      alert("Please enter your CVV.")
      return
    }
    if (!zip) {
      alert("Please enter your billing ZIP code.")
      return
    }

    setProcessing(true)

    setTimeout(() => {
      setProcessing(false)
      setCheckoutOpen(false)
      const newOrderId = "SB-2026-" + Math.floor(1000 + Math.random() * 9000)
      setOrderId(newOrderId)
      setConfirmEmail(email)
      setStep(3)
      setDownloadOpen(true)
    }, 2800)
  }

  const downloadWorkbook = () => {
    // Download the static premium PDF file
    const a = document.createElement("a")
    a.href = "/product.pdf"
    a.download = "The-Session-Blueprint-Premium-2026.pdf"
    a.click()
  }

  const total = 47 - discount

  return (
    <>
      <style jsx global>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:#070C11;--bg2:#0B1017;--bg3:#0F1520;
          --panel:#111A24;--panel2:#172030;
          --border:#1B2A3A;--border2:#243547;
          --green:#00D68F;--green-dim:rgba(0,214,143,0.09);--green-glow:rgba(0,214,143,0.22);
          --cyan:#00B4D8;--red:#FF4D6A;--amber:#F59E0B;
          --text:#E4EAF2;--text2:#7D97B0;--text3:#3D5468;
          --white:#fff;
          --ff:'Barlow',sans-serif;--fd:'Barlow Condensed',sans-serif;--fm:'JetBrains Mono',monospace;
        }
        html{scroll-behavior:smooth}
        body{font-family:var(--ff);background:var(--bg);color:var(--text);overflow-x:hidden;line-height:1.6}
        a{text-decoration:none}
        
        body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:9999;
          background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.012) 2px,rgba(0,0,0,0.012) 4px)}
        
        .social-proof-popup{position:fixed;bottom:24px;left:24px;z-index:1000;
          background:var(--panel);border:1px solid var(--border2);
          padding:14px 18px;display:flex;align-items:center;gap:14px;
          box-shadow:0 8px 32px rgba(0,0,0,0.4),0 0 0 1px rgba(0,214,143,0.1);
          transform:translateX(-120%);opacity:0;transition:all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          max-width:340px}
        .social-proof-popup.show{transform:translateX(0);opacity:1}
        .social-proof-icon{width:42px;height:42px;border-radius:50%;
          background:var(--green-dim);border:1px solid rgba(0,214,143,0.25);
          display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .social-proof-icon svg{width:20px;height:20px;color:var(--green)}
        .social-proof-content{display:flex;flex-direction:column;gap:2px}
        .social-proof-name{font-family:var(--ff);font-size:14px;font-weight:600;color:var(--white)}
        .social-proof-action{font-family:var(--ff);font-size:13px;color:var(--text2)}
        .social-proof-location{font-family:var(--fm);font-size:10px;color:var(--text3);letter-spacing:0.05em;margin-top:2px}
        .social-proof-time{font-family:var(--fm);font-size:9px;color:var(--green);letter-spacing:0.08em;text-transform:uppercase;margin-top:4px}
        
        nav{position:fixed;top:0;left:0;right:0;z-index:200;height:58px;
          background:rgba(7,12,17,0.94);backdrop-filter:blur(20px);
          border-bottom:1px solid var(--border);
          display:flex;align-items:center;justify-content:space-between;padding:0 40px}
        .nav-brand{display:flex;align-items:center;gap:10px;
          font-family:var(--fd);font-size:16px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--white)}
        .live-dot{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 7px var(--green);
          animation:blink 2.2s ease-in-out infinite}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.4}}
        .nav-links{display:flex;gap:28px}
        .nav-links a{font-size:13px;font-weight:500;color:var(--text2);letter-spacing:.04em;transition:color .15s}
        .nav-links a:hover{color:var(--text)}
        .nav-btn{background:var(--green);color:#000;font-family:var(--ff);font-weight:700;font-size:13px;
          letter-spacing:.07em;text-transform:uppercase;padding:9px 24px;border:none;cursor:pointer;
          clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);transition:opacity .2s}
        .nav-btn:hover{opacity:.85}
        
        .hero-wrap{min-height:100vh;display:flex;align-items:center;position:relative;overflow:hidden;
          padding:80px 40px 60px;max-width:1280px;margin:0 auto}
        .hero-wrap::before{content:'';position:absolute;inset:0;pointer-events:none;
          background-image:
            linear-gradient(var(--border) 1px,transparent 1px),
            linear-gradient(90deg,var(--border) 1px,transparent 1px);
          background-size:60px 60px;opacity:.35}
        .hero-wrap::after{content:'';position:absolute;top:10%;right:5%;width:580px;height:580px;border-radius:50%;
          background:radial-gradient(circle,rgba(0,214,143,.06) 0%,transparent 65%);pointer-events:none}
        
        .hero-left{flex:1;position:relative;z-index:2;max-width:600px}
        .hero-right{flex:0 0 460px;display:flex;align-items:center;justify-content:center;position:relative;z-index:2}
        
        .badge{display:inline-flex;align-items:center;gap:8px;
          background:var(--green-dim);border:1px solid rgba(0,214,143,.22);
          padding:5px 13px;margin-bottom:26px}
        .badge-dot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:blink 2.2s ease-in-out infinite}
        .badge span{font-family:var(--fm);font-size:11px;color:var(--green);letter-spacing:.18em;text-transform:uppercase}
        
        h1{font-family:var(--fd);font-size:clamp(54px,5.8vw,78px);font-weight:800;line-height:.93;
          letter-spacing:-.005em;text-transform:uppercase;color:var(--white);margin-bottom:26px}
        h1 .g{color:var(--green)} h1 .d{color:var(--text2)}
        
        .hero-sub{font-size:16px;color:var(--text2);font-weight:400;line-height:1.72;max-width:500px;margin-bottom:36px}
        .hero-sub b{color:var(--text);font-weight:600}
        
        .cta-row{display:flex;align-items:center;gap:18px;flex-wrap:wrap;margin-bottom:44px}
        .btn-g{background:var(--green);color:#000;font-family:var(--ff);font-weight:700;font-size:14px;
          letter-spacing:.07em;text-transform:uppercase;padding:14px 38px;border:none;cursor:pointer;
          clip-path:polygon(12px 0,100% 0,calc(100% - 12px) 100%,0 100%);transition:opacity .2s,transform .15s;
          display:inline-flex;align-items:center;gap:9px}
        .btn-g:hover{opacity:.87;transform:translateY(-2px)}
        .btn-ghost{border:1px solid var(--border2);color:var(--text2);font-size:13px;font-weight:500;
          letter-spacing:.05em;padding:13px 28px;display:inline-flex;align-items:center;gap:8px;
          transition:all .2s;background:transparent;cursor:pointer}
        .btn-ghost:hover{border-color:var(--text2);color:var(--text)}
        
        .stat-strip{display:flex;align-items:center;gap:0;border-top:1px solid var(--border);padding-top:28px}
        .stat-it{padding-right:28px;margin-right:28px;border-right:1px solid var(--border)}
        .stat-it:last-child{border-right:none;padding-right:0;margin-right:0}
        .stat-n{font-family:var(--fd);font-size:32px;font-weight:800;color:var(--green);line-height:1}
        .stat-l{font-family:var(--fm);font-size:10px;color:var(--text3);letter-spacing:.14em;text-transform:uppercase;margin-top:3px}
        
        .book-scene{width:340px;height:420px;perspective:900px;cursor:grab}
        .book-scene:active{cursor:grabbing}
        .book{width:100%;height:100%;position:relative;transform-style:preserve-3d;
          animation:bookFloat 6s ease-in-out infinite, bookSpin 14s ease-in-out infinite}
        @keyframes bookFloat{0%,100%{transform:rotateY(-28deg) rotateX(6deg) translateY(0px)}
          50%{transform:rotateY(-28deg) rotateX(6deg) translateY(-18px)}}
        @keyframes bookSpin{0%{transform:rotateY(-28deg) rotateX(6deg) translateY(0px)}
          25%{transform:rotateY(-48deg) rotateX(10deg) translateY(-12px)}
          50%{transform:rotateY(-28deg) rotateX(6deg) translateY(-18px)}
          75%{transform:rotateY(-12deg) rotateX(3deg) translateY(-10px)}
          100%{transform:rotateY(-28deg) rotateX(6deg) translateY(0px)}}
        
        .book-front{position:absolute;width:260px;height:360px;top:30px;left:40px;
          transform-origin:left center;transform:translateZ(14px);
          background:linear-gradient(145deg,#0d2137 0%,#091929 60%,#050e18 100%);
          border:1px solid rgba(0,214,143,.3);overflow:hidden;
          box-shadow:8px 12px 40px rgba(0,0,0,.7),0 0 30px rgba(0,214,143,.1)}
        .book-front::before{content:'';position:absolute;inset:0;
          background-image:linear-gradient(rgba(0,214,143,.04) 1px,transparent 1px),
            linear-gradient(90deg,rgba(0,214,143,.04) 1px,transparent 1px);
          background-size:18px 18px}
        .book-front::after{content:'';position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;
          background:radial-gradient(circle,rgba(0,214,143,.12) 0%,transparent 70%)}
        
        .cover-inner{position:relative;z-index:1;padding:22px 20px;height:100%;display:flex;flex-direction:column}
        .cover-top-bar{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
        .cover-brand{font-family:var(--fm);font-size:9px;color:rgba(0,214,143,.6);letter-spacing:.2em;text-transform:uppercase}
        .cover-live{display:flex;align-items:center;gap:5px;font-family:var(--fm);font-size:9px;color:var(--green)}
        .cover-live-dot{width:5px;height:5px;border-radius:50%;background:var(--green);animation:blink 2s infinite}
        
        .cover-chart{height:55px;margin-bottom:14px;position:relative;overflow:hidden}
        .cover-chart svg{width:100%;height:100%}
        
        .cover-title-block{margin-bottom:auto}
        .cover-label{font-family:var(--fm);font-size:8px;color:rgba(0,214,143,.5);letter-spacing:.2em;text-transform:uppercase;margin-bottom:5px}
        .cover-title{font-family:var(--fd);font-size:28px;font-weight:800;line-height:.92;text-transform:uppercase;color:#fff;letter-spacing:.01em}
        .cover-title .cg{color:var(--green)}
        .cover-subtitle{font-family:var(--ff);font-size:10px;color:var(--text2);margin-top:7px;line-height:1.4;font-style:italic}
        
        .cover-pills{display:flex;flex-direction:column;gap:5px;margin-top:14px}
        .cover-pill{display:flex;align-items:center;gap:7px;padding:5px 8px;
          background:rgba(0,214,143,.07);border:1px solid rgba(0,214,143,.15)}
        .cpill-dot{width:4px;height:4px;border-radius:50%;background:var(--green);flex-shrink:0}
        .cpill-text{font-family:var(--fm);font-size:8px;color:var(--text2);letter-spacing:.08em}
        
        .cover-footer{margin-top:12px;padding-top:10px;border-top:1px solid rgba(0,214,143,.15);
          display:flex;justify-content:space-between;align-items:center}
        .cover-footer-brand{font-family:var(--fd);font-size:10px;font-weight:700;color:rgba(255,255,255,.5);letter-spacing:.1em}
        .cover-year{font-family:var(--fm);font-size:9px;color:var(--text3)}
        
        .book-spine{position:absolute;width:28px;height:360px;top:30px;left:40px;
          transform-origin:left center;transform:rotateY(-90deg) translateZ(0px);
          background:linear-gradient(180deg,#061320 0%,#0a1e30 50%,#040d17 100%);
          border-left:1px solid rgba(0,214,143,.2);border-top:1px solid rgba(0,214,143,.2);border-bottom:1px solid rgba(0,214,143,.2);
          display:flex;align-items:center;justify-content:center}
        .spine-text{font-family:var(--fd);font-size:10px;font-weight:700;letter-spacing:.3em;
          text-transform:uppercase;color:rgba(0,214,143,.7);writing-mode:vertical-rl;transform:rotate(180deg)}
        
        .book-back{position:absolute;width:260px;height:360px;top:30px;left:40px;
          transform-origin:left center;transform:translateZ(-14px) rotateY(180deg);
          background:linear-gradient(145deg,#060f18,#091929);
          border:1px solid rgba(0,214,143,.12);
          box-shadow:-6px 10px 30px rgba(0,0,0,.6)}
        
        .book-pages{position:absolute;width:12px;height:354px;top:33px;left:286px;
          transform:rotateY(0deg);
          background:repeating-linear-gradient(180deg,#d4c9b0 0px,#d4c9b0 1px,#bfb49a 1px,#bfb49a 3px);
          box-shadow:inset -2px 0 4px rgba(0,0,0,.3)}
        
        .book-shadow{position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);
          width:200px;height:30px;border-radius:50%;
          background:radial-gradient(ellipse,rgba(0,214,143,.15) 0%,transparent 70%);
          animation:shadowPulse 6s ease-in-out infinite}
        @keyframes shadowPulse{0%,100%{opacity:1;transform:translateX(-50%) scaleX(1)}50%{opacity:.5;transform:translateX(-50%) scaleX(.75)}}
        
        .float-badge{position:absolute;background:var(--panel);border:1px solid var(--border2);padding:8px 12px;
          font-family:var(--fm);white-space:nowrap;animation:floatBadge 5s ease-in-out infinite;z-index:3}
        .float-badge .fb-label{font-size:9px;color:var(--text3);letter-spacing:.1em;text-transform:uppercase;margin-bottom:2px}
        .float-badge .fb-val{font-size:13px;font-weight:500}
        .fb-green{color:var(--green)}.fb-amber{color:var(--amber)}.fb-white{color:var(--white)}
        @keyframes floatBadge{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .fb-1{top:8%;left:-8%;animation-delay:0s}
        .fb-2{top:42%;right:-12%;animation-delay:1.5s}
        .fb-3{bottom:12%;left:-5%;animation-delay:.8s}
        
        .ticker-outer{background:var(--panel);border-top:1px solid var(--border);border-bottom:1px solid var(--border);overflow:hidden;padding:9px 0;position:relative}
        .ticker-outer::before,.ticker-outer::after{content:'';position:absolute;top:0;bottom:0;width:100px;z-index:2;pointer-events:none}
        .ticker-outer::before{left:0;background:linear-gradient(to right,var(--panel),transparent)}
        .ticker-outer::after{right:0;background:linear-gradient(to left,var(--panel),transparent)}
        .ticker-track{display:flex;white-space:nowrap;animation:ticker 32s linear infinite}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .ti{display:inline-flex;align-items:center;gap:10px;padding:0 26px;font-family:var(--fm);font-size:11px;color:var(--text2);letter-spacing:.05em}
        .ti .s{color:var(--white);font-weight:500} .ti .u{color:var(--green)} .ti .dn{color:var(--red)}
        
        .wrap{max-width:1200px;margin:0 auto;padding:0 40px}
        .sec{padding:88px 0}
        
        .eyebrow{font-family:var(--fm);font-size:11px;color:var(--green);letter-spacing:.2em;text-transform:uppercase;
          margin-bottom:14px;display:flex;align-items:center;gap:10px}
        .eyebrow::before{content:'//';color:var(--text3)}
        h2{font-family:var(--fd);font-size:clamp(36px,3.8vw,52px);font-weight:800;text-transform:uppercase;
          color:var(--white);line-height:1;margin-bottom:14px}
        .sub{font-size:16px;color:var(--text2);line-height:1.72;max-width:560px;margin-bottom:52px}
        
        .metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border:1px solid var(--border);margin-bottom:70px}
        .m-card{background:var(--panel);padding:26px 22px;position:relative}
        .m-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--green);opacity:.35}
        .m-val{font-family:var(--fd);font-size:40px;font-weight:800;color:var(--green);line-height:1;margin-bottom:5px}
        .m-lbl{font-family:var(--fm);font-size:10px;color:var(--text3);letter-spacing:.14em;text-transform:uppercase}
        
        .pillars{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border:1px solid var(--border);margin-top:52px}
        .p-card{background:var(--panel);padding:28px 22px;border-top:2px solid transparent;transition:background .2s}
        .p-card:hover{background:var(--panel2)}
        .p-c1{border-top-color:var(--green)}.p-c2{border-top-color:var(--cyan)}.p-c3{border-top-color:#7C6CFA}.p-c4{border-top-color:var(--amber)}
        .p-name{font-family:var(--fd);font-size:20px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin-bottom:8px}
        .p-c1 .p-name{color:var(--green)}.p-c2 .p-name{color:var(--cyan)}.p-c3 .p-name{color:#7C6CFA}.p-c4 .p-name{color:var(--amber)}
        .p-body{font-size:13px;color:var(--text2);line-height:1.6}
        
        .pain-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border)}
        .pain-card{background:var(--bg3);padding:30px 26px;border-top:2px solid rgba(255,77,106,.4)}
        .pain-t{font-size:15px;font-weight:600;color:var(--text);margin-bottom:8px}
        .pain-b{font-size:13px;color:var(--text2);line-height:1.6}
        
        .sys-split{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start}
        .check-list{display:flex;flex-direction:column;gap:10px;margin-top:32px}
        .ci{display:flex;gap:13px;padding:13px 15px;background:var(--panel);border:1px solid var(--border);
          border-left:2px solid var(--green);font-size:14px;color:var(--text2);line-height:1.5;transition:background .2s}
        .ci:hover{background:var(--panel2)} .ci b{color:var(--text);font-weight:600}
        .ci-g{color:var(--green);font-family:var(--fm);font-size:12px;flex-shrink:0;padding-top:1px}
        
        .terminal{background:var(--panel);border:1px solid var(--border);overflow:hidden}
        .t-bar{background:var(--bg);border-bottom:1px solid var(--border);padding:10px 16px;display:flex;align-items:center;gap:7px}
        .td{width:9px;height:9px;border-radius:50%} .tdr{background:#FF5F57} .tdy{background:#FFBD2E} .tdg{background:#28CA41}
        .t-title{font-family:var(--fm);font-size:11px;color:var(--text3);margin-left:7px;letter-spacing:.06em}
        .t-tabs{display:flex;gap:1px;background:var(--border);border-bottom:1px solid var(--border)}
        .t-tab{font-family:var(--fm);font-size:11px;padding:8px 15px;letter-spacing:.08em;cursor:pointer}
        .t-tab.on{background:var(--panel);color:var(--green)} .t-tab:not(.on){background:var(--bg);color:var(--text3)}
        .t-body{padding:18px}
        .t-head{font-family:var(--fm);font-size:10px;letter-spacing:.15em;color:var(--text3);text-transform:uppercase;
          margin-bottom:9px;padding-bottom:6px;border-bottom:1px solid var(--border)}
        .t-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px}
        .t-row:last-child{border-bottom:none}
        .t-k{color:var(--text2)} .t-v{font-family:var(--fm);font-size:12px;color:var(--text)}
        .t-v.g{color:var(--green)} .t-v.r{color:var(--red)} .t-v.a{color:var(--amber)}
        .t-checks{margin-top:14px;display:flex;flex-direction:column;gap:5px}
        .tc{display:flex;align-items:center;gap:9px;font-family:var(--fm);font-size:11px;color:var(--text2);padding:6px 9px;border:1px solid var(--border)}
        .tcb{width:13px;height:13px;border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:8px;flex-shrink:0}
        .tcb.ok{background:var(--green-dim);border-color:rgba(0,214,143,.4);color:var(--green)}
        .tcb.wait{border-color:var(--amber);background:rgba(245,158,11,.08);color:var(--amber)}
        .t-foot{margin-top:12px;padding:11px 10px;background:var(--bg);border:1px solid var(--border);
          display:flex;justify-content:space-between;align-items:center}
        .tf-l{font-family:var(--fm);font-size:10px;color:var(--text3);letter-spacing:.1em}
        .tf-v{font-family:var(--fm);font-size:14px;font-weight:500;color:var(--green)}
        
        .mods-bg{background:var(--bg2);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
        .mods-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border:1px solid var(--border)}
        .mc{background:var(--panel);padding:22px 18px;transition:background .2s;cursor:default}
        .mc:hover{background:var(--panel2)} .mc:hover .mn{color:var(--green)}
        .mn{font-family:var(--fm);font-size:10px;color:var(--text3);letter-spacing:.12em;margin-bottom:7px;transition:color .2s}
        .mt{font-size:14px;font-weight:600;color:var(--text);margin-bottom:5px}
        .md{font-size:12px;color:var(--text2);line-height:1.55}
        
        .testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:52px}
        .testi{background:var(--panel);border:1px solid var(--border);padding:26px 22px}
        .stars{color:var(--amber);font-size:12px;letter-spacing:2px;margin-bottom:14px}
        .testi-q{font-size:14px;color:var(--text2);line-height:1.65;font-style:italic;margin-bottom:18px}
        .testi-q b{color:var(--text);font-style:normal;font-weight:600}
        .testi-who{display:flex;align-items:center;gap:10px}
        .testi-av{width:34px;height:34px;border-radius:50%;background:var(--green-dim);border:1px solid rgba(0,214,143,.3);
          display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-size:13px;color:var(--green);font-weight:700}
        .testi-n{font-size:13px;font-weight:600;color:var(--text)}
        .testi-m{font-size:11px;color:var(--text3)}
        
        .price-wrap{max-width:500px;margin:0 auto;text-align:center}
        .price-card{background:var(--panel);border:1px solid rgba(0,214,143,.35);padding:48px 40px;margin-top:52px;position:relative}
        .price-card::before{content:'LAUNCH PRICE';position:absolute;top:-13px;left:50%;transform:translateX(-50%);
          background:var(--green);color:#000;font-family:var(--fm);font-size:10px;font-weight:500;letter-spacing:.15em;padding:4px 18px}
        .p-old{font-family:var(--fm);font-size:15px;color:var(--text3);text-decoration:line-through;margin-bottom:4px}
        .p-num{font-family:var(--fd);font-size:86px;font-weight:800;color:var(--green);line-height:1;letter-spacing:-.02em}
        .p-num sup{font-family:var(--ff);font-size:28px;font-weight:300;vertical-align:super;margin-right:2px}
        .p-note{font-size:13px;color:var(--text2);margin-top:6px;margin-bottom:34px}
        .p-feats{list-style:none;text-align:left;display:flex;flex-direction:column;gap:12px;margin-bottom:36px}
        .p-feats li{display:flex;gap:11px;font-size:14px;color:var(--text2)}
        .p-feats li::before{content:'✓';color:var(--green);font-weight:700;font-size:14px;flex-shrink:0}
        .p-feats li b{color:var(--text);font-weight:600}
        .btn-buy{display:block;width:100%;background:var(--green);color:#000;font-family:var(--ff);font-weight:700;
          font-size:15px;letter-spacing:.07em;text-transform:uppercase;padding:18px;border:none;cursor:pointer;
          transition:opacity .2s,transform .15s}
        .btn-buy:hover{opacity:.87;transform:translateY(-2px)}
        .p-secure{margin-top:16px;font-size:12px;color:var(--text3);font-family:var(--fm)}
        
        .faq-list{max-width:700px}
        .faq-item{border-bottom:1px solid var(--border)}
        .faq-q{padding:22px 0;font-size:15px;font-weight:600;color:var(--text);cursor:pointer;
          display:flex;justify-content:space-between;align-items:center;gap:16px;user-select:none}
        .faq-q:hover{color:var(--green)}
        .faq-icon{font-size:18px;color:var(--green);flex-shrink:0;transition:transform .2s}
        .faq-a{max-height:0;overflow:hidden;transition:max-height .3s ease}
        .faq-a p{font-size:14px;color:var(--text2);line-height:1.7;padding-bottom:22px}
        .faq-item.open .faq-icon{transform:rotate(45deg)}
        .faq-item.open .faq-a{max-height:180px}
        
        .final{background:var(--bg2);border-top:1px solid var(--border);text-align:center;padding:110px 40px;position:relative;overflow:hidden}
        .final::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
          width:700px;height:700px;border-radius:50%;
          background:radial-gradient(circle,rgba(0,214,143,.04) 0%,transparent 65%);pointer-events:none}
        .final h2{font-size:clamp(44px,5.5vw,72px);margin-bottom:18px}
        .final p{font-size:17px;color:var(--text2);max-width:480px;margin:0 auto 44px;font-weight:400}
        
        footer{background:var(--bg);border-top:1px solid var(--border);padding:36px 40px;
          display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px}
        .foot-brand{font-family:var(--fd);font-size:16px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--green)}
        .foot-legal{font-size:12px;color:var(--text3);max-width:520px;line-height:1.6}
        
        .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:36px}
        .chip{font-family:var(--fm);font-size:11px;color:var(--green);
          background:var(--green-dim);border:1px solid rgba(0,214,143,.18);padding:5px 13px;letter-spacing:.08em}
        
        @media(max-width:900px){
          .hero-wrap{flex-direction:column;gap:40px;padding-top:100px}
          .hero-right{width:100%;justify-content:center}
          .book-scene{width:280px;height:340px}
          .metrics{grid-template-columns:1fr 1fr}
          .pillars,.mods-grid{grid-template-columns:1fr 1fr}
          .sys-split,.pain-grid,.testi-grid{grid-template-columns:1fr}
          .nav-links{display:none}
        }
        
        .reviews-section{background:var(--bg2);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
        .review-summary{display:flex;align-items:center;gap:40px;margin-bottom:52px;padding:28px 30px;background:var(--panel);border:1px solid var(--border)}
        .rs-score{text-align:center;flex-shrink:0}
        .rs-num{font-family:var(--fd);font-size:72px;font-weight:800;color:var(--green);line-height:1}
        .rs-stars{color:var(--amber);font-size:18px;letter-spacing:3px;margin:4px 0}
        .rs-count{font-family:var(--fm);font-size:10px;color:var(--text3);letter-spacing:.12em}
        .rs-divider{width:1px;height:80px;background:var(--border);flex-shrink:0}
        .rs-bars{flex:1;display:flex;flex-direction:column;gap:6px}
        .rb-row{display:flex;align-items:center;gap:10px;font-family:var(--fm);font-size:10px;color:var(--text3)}
        .rb-label{width:28px;text-align:right;flex-shrink:0}
        .rb-bar{flex:1;height:5px;background:var(--border);position:relative;overflow:hidden}
        .rb-fill{position:absolute;top:0;left:0;height:100%;background:var(--amber);animation:barIn .8s ease forwards}
        @keyframes barIn{from{width:0}}
        .rb-pct{width:28px;color:var(--text2);flex-shrink:0}
        .rs-verified{flex-shrink:0;text-align:center;font-family:var(--fm);font-size:10px;color:var(--text3);line-height:1.8}
        .rs-verified strong{display:block;font-size:22px;color:var(--green);font-family:var(--fd);font-weight:800}
        
        .reviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .rev-card{background:var(--panel);border:1px solid var(--border);padding:24px 20px;transition:background .2s;position:relative}
        .rev-card:hover{background:var(--panel2);border-color:var(--border2)}
        .rev-card.featured{border-color:rgba(0,214,143,.35);grid-column:span 1}
        .rev-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
        .rev-av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;
          font-family:var(--fd);font-size:14px;font-weight:700;flex-shrink:0}
        .av-a{background:rgba(0,214,143,.12);border:1px solid rgba(0,214,143,.3);color:var(--green)}
        .av-b{background:rgba(0,180,216,.12);border:1px solid rgba(0,180,216,.3);color:var(--cyan)}
        .av-c{background:rgba(245,158,11,.12);border:1px solid rgba(245,158,11,.3);color:var(--amber)}
        .av-d{background:rgba(124,108,250,.12);border:1px solid rgba(124,108,250,.3);color:#7C6CFA}
        .av-e{background:rgba(255,77,106,.1);border:1px solid rgba(255,77,106,.25);color:var(--red)}
        .rev-meta{flex:1;margin-left:11px}
        .rev-name{font-size:13px;font-weight:600;color:var(--text)}
        .rev-inst{font-family:var(--fm);font-size:10px;color:var(--text3);letter-spacing:.08em;margin-top:2px}
        .rev-stars{color:var(--amber);font-size:11px;letter-spacing:1.5px}
        .rev-date{font-family:var(--fm);font-size:10px;color:var(--text3);white-space:nowrap}
        .rev-tag{font-family:var(--fm);font-size:9px;letter-spacing:.14em;text-transform:uppercase;padding:3px 9px;margin-bottom:10px;display:inline-block}
        .tag-verified{background:var(--green-dim);border:1px solid rgba(0,214,143,.2);color:var(--green)}
        .tag-purchase{background:rgba(0,180,216,.08);border:1px solid rgba(0,180,216,.2);color:var(--cyan)}
        .rev-title{font-size:13px;font-weight:700;color:var(--text);margin-bottom:7px;line-height:1.35}
        .rev-body{font-size:13px;color:var(--text2);line-height:1.65}
        .rev-body b{color:var(--text);font-weight:600}
        .rev-footer{margin-top:14px;padding-top:12px;border-top:1px solid var(--border);
          display:flex;justify-content:space-between;align-items:center;font-family:var(--fm);font-size:10px;color:var(--text3)}
        .rev-helpful{cursor:pointer;display:flex;align-items:center;gap:5px;transition:color .15s}
        .rev-helpful:hover{color:var(--green)}
        .rev-helpful svg{width:11px;height:11px;fill:currentColor}
        .reviews-show-more{display:block;width:100%;margin-top:14px;padding:14px;background:transparent;
          border:1px solid var(--border);color:var(--text2);font-family:var(--fm);font-size:11px;
          letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:all .2s}
        .reviews-show-more:hover{border-color:var(--green);color:var(--green)}
        
        .modal-overlay{position:fixed;inset:0;background:rgba(4,8,14,.88);z-index:9000;
          display:flex;align-items:center;justify-content:center;padding:20px;
          opacity:0;pointer-events:none;transition:opacity .25s;backdrop-filter:blur(6px)}
        .modal-overlay.open{opacity:1;pointer-events:all}
        .modal-box{background:var(--bg2);border:1px solid var(--border2);width:100%;max-width:880px;
          max-height:90vh;overflow-y:auto;position:relative;
          transform:translateY(24px);transition:transform .3s;scrollbar-width:thin}
        .modal-overlay.open .modal-box{transform:translateY(0)}
        .stripe-checkout-box{background:#fff;border-radius:8px;width:100%;max-width:500px;
          max-height:90vh;overflow-y:auto;position:relative;padding:24px;
          transform:translateY(24px);transition:transform .3s}
        .modal-overlay.open .stripe-checkout-box{transform:translateY(0)}
        .modal-close{position:absolute;top:16px;right:18px;background:none;border:none;
          color:var(--text3);font-size:22px;cursor:pointer;z-index:10;padding:4px;line-height:1;
          transition:color .15s}
        .modal-close:hover{color:var(--text)}
        .modal-inner{display:grid;grid-template-columns:1fr 380px}
        .modal-left{padding:36px;border-right:1px solid var(--border);position:relative}
        .modal-right{padding:36px;background:var(--panel)}
        
        .checkout-steps{display:flex;gap:0;margin-bottom:28px;border:1px solid var(--border)}
        .cs{padding:10px 18px;font-family:var(--fm);font-size:10px;letter-spacing:.12em;text-transform:uppercase;
          color:var(--text3);display:flex;align-items:center;gap:7px;flex:1;justify-content:center;border-right:1px solid var(--border)}
        .cs:last-child{border-right:none}
        .cs.active{background:var(--green-dim);color:var(--green)}
        .cs.done{color:var(--text2)}
        .cs-num{width:18px;height:18px;border-radius:50%;border:1px solid currentColor;
          display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0}
        .cs.active .cs-num{background:var(--green);color:#000;border-color:var(--green)}
        .cs.done .cs-num{background:var(--green);color:#000;border-color:var(--green)}
        
        .modal-title{font-family:var(--fd);font-size:24px;font-weight:800;text-transform:uppercase;
          color:var(--white);margin-bottom:6px}
        .modal-sub{font-size:13px;color:var(--text2);margin-bottom:26px}
        
        .field-group{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
        .field-group.full{grid-template-columns:1fr}
        .field-wrap{display:flex;flex-direction:column;gap:6px}
        .field-label{font-family:var(--fm);font-size:10px;color:var(--text3);letter-spacing:.12em;text-transform:uppercase}
        .field-input{background:var(--bg);border:1px solid var(--border2);color:var(--text);
          font-family:var(--ff);font-size:14px;padding:11px 14px;width:100%;outline:none;
          transition:border-color .2s}
        .field-input:focus{border-color:rgba(0,214,143,.5);box-shadow:0 0 0 3px rgba(0,214,143,.06)}
        .field-input::placeholder{color:var(--text3)}
        .field-card-row{display:grid;grid-template-columns:1fr 80px 70px;gap:14px;margin-bottom:14px}
        
        .card-brands{display:flex;gap:8px;margin-bottom:22px}
        .card-brand{background:var(--border);padding:4px 10px;font-family:var(--fm);font-size:10px;
          color:var(--text2);letter-spacing:.06em;border:1px solid var(--border2)}
        
        .order-title{font-family:var(--fm);font-size:10px;color:var(--text3);letter-spacing:.15em;
          text-transform:uppercase;margin-bottom:18px;padding-bottom:10px;border-bottom:1px solid var(--border)}
        .order-item{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--border)}
        .oi-name{font-size:14px;font-weight:600;color:var(--text);margin-bottom:3px}
        .oi-desc{font-size:12px;color:var(--text3)}
        .oi-price{font-family:var(--fd);font-size:22px;font-weight:800;color:var(--green);white-space:nowrap}
        .order-line{display:flex;justify-content:space-between;font-size:13px;margin-bottom:8px}
        .order-line.total{padding-top:12px;border-top:1px solid var(--border);font-weight:700;font-size:15px;color:var(--white);margin-top:4px}
        .ol-k{color:var(--text2)} .ol-v{font-family:var(--fm);color:var(--text)} .ol-v.green{color:var(--green)}
        .order-inclusions{margin-top:18px;padding:14px;background:var(--bg);border:1px solid var(--border)}
        .oi-feat{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);margin-bottom:7px;font-family:var(--fm)}
        .oi-feat:last-child{margin-bottom:0}
        .oi-feat::before{content:'✓';color:var(--green);flex-shrink:0}
        .order-guarantee{margin-top:14px;padding:12px 14px;background:var(--green-dim);border:1px solid rgba(0,214,143,.2);
          font-family:var(--fm);font-size:10px;color:var(--green);letter-spacing:.08em;text-align:center}
        
        .btn-pay{width:100%;margin-top:24px;background:var(--green);color:#000;font-family:var(--ff);
          font-weight:800;font-size:15px;letter-spacing:.06em;text-transform:uppercase;
          padding:17px;border:none;cursor:pointer;transition:opacity .2s,transform .15s;
          display:flex;align-items:center;justify-content:center;gap:10px}
        .btn-pay:hover{opacity:.9;transform:translateY(-1px)}
        .btn-pay:active{transform:translateY(0)}
        .pay-security{margin-top:12px;text-align:center;font-family:var(--fm);font-size:10px;color:var(--text3);letter-spacing:.08em}
        
        .coupon-row{display:flex;gap:8px;margin-bottom:20px}
        .coupon-input{flex:1;background:var(--bg);border:1px solid var(--border2);color:var(--text);
          font-family:var(--fm);font-size:12px;padding:10px 12px;outline:none;letter-spacing:.06em}
        .coupon-input::placeholder{color:var(--text3)}
        .coupon-btn{background:transparent;border:1px solid var(--border2);color:var(--text2);
          font-family:var(--fm);font-size:10px;letter-spacing:.12em;padding:0 14px;cursor:pointer;
          text-transform:uppercase;white-space:nowrap;transition:all .2s}
        .coupon-btn:hover{border-color:var(--green);color:var(--green)}
        
        .dl-modal{position:fixed;inset:0;background:rgba(4,8,14,.95);z-index:10000;
          display:flex;align-items:center;justify-content:center;padding:20px;
          opacity:0;pointer-events:none;transition:opacity .3s;backdrop-filter:blur(12px)}
        .dl-modal.open{opacity:1;pointer-events:all}
        .dl-box{background:var(--panel);border:1px solid rgba(0,214,143,.4);max-width:540px;width:100%;padding:52px 48px;
          text-align:center;position:relative;
          box-shadow:0 0 80px rgba(0,214,143,.08);
          transform:scale(.96);transition:transform .35s}
        .dl-modal.open .dl-box{transform:scale(1)}
        .dl-success-ring{width:72px;height:72px;border-radius:50%;border:2px solid var(--green);
          display:flex;align-items:center;justify-content:center;margin:0 auto 22px;
          background:var(--green-dim);
          animation:ringPop .5s ease .1s both}
        @keyframes ringPop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
        .dl-check{font-size:30px;color:var(--green)}
        .dl-title{font-family:var(--fd);font-size:32px;font-weight:800;text-transform:uppercase;color:var(--white);margin-bottom:8px}
        .dl-title span{color:var(--green)}
        .dl-sub{font-size:14px;color:var(--text2);line-height:1.7;margin-bottom:28px;max-width:360px;margin-left:auto;margin-right:auto}
        .dl-items{text-align:left;background:var(--bg);border:1px solid var(--border);padding:18px 20px;margin-bottom:28px}
        .dl-item{display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--border);font-size:13px}
        .dl-item:last-child{border-bottom:none;padding-bottom:0}
        .dl-item-name{display:flex;align-items:center;gap:9px;color:var(--text2);font-family:var(--fm);font-size:11px;letter-spacing:.06em}
        .dl-btn-main{display:flex;width:100%;background:var(--green);color:#000;font-family:var(--ff);
          font-weight:800;font-size:15px;letter-spacing:.06em;text-transform:uppercase;
          padding:17px;border:none;cursor:pointer;transition:opacity .2s,transform .15s;
          margin-bottom:12px;text-decoration:none;align-items:center;justify-content:center;gap:9px}
        .dl-btn-main:hover{opacity:.9}
        .dl-btn-sec{background:transparent;border:1px solid var(--border2);color:var(--text2);
          font-family:var(--fm);font-size:11px;letter-spacing:.1em;text-transform:uppercase;
          width:100%;padding:12px;cursor:pointer;transition:all .2s;text-decoration:none;display:block}
        .dl-btn-sec:hover{border-color:var(--text2);color:var(--text)}
        .dl-note{margin-top:18px;font-family:var(--fm);font-size:10px;color:var(--text3);letter-spacing:.08em}
        .dl-order-id{font-family:var(--fm);font-size:10px;color:var(--text3);margin-bottom:6px}
        .dl-order-id span{color:var(--green)}
        
        .spinner{display:inline-block;width:16px;height:16px;border:2px solid rgba(0,0,0,.3);border-top-color:#000;border-radius:50%;animation:spin .6s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        
        .processing-overlay{position:absolute;inset:0;background:rgba(7,12,17,.82);
          display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;
          opacity:0;pointer-events:none;transition:opacity .2s;backdrop-filter:blur(2px)}
        .processing-overlay.show{opacity:1;pointer-events:all}
        .proc-spinner{width:44px;height:44px;border:3px solid var(--border);border-top-color:var(--green);border-radius:50%;animation:spin .7s linear infinite}
        .proc-txt{font-family:var(--fm);font-size:12px;color:var(--green);letter-spacing:.15em;text-transform:uppercase}
        
        @media(max-width:700px){
          .modal-inner{grid-template-columns:1fr}
          .modal-right{border-top:1px solid var(--border);border-right:none}
          .field-card-row{grid-template-columns:1fr 1fr}
          .reviews-grid{grid-template-columns:1fr}
          .review-summary{flex-direction:column;gap:20px}
          .rs-divider{width:100%;height:1px}
          .dl-box{padding:36px 24px}
        }
      `}</style>

      {/* NAV */}
      <nav>
        <div className="nav-brand">
          <div className="live-dot"></div>
          The Session Method
        </div>
        <div className="nav-links">
          <a href="#system">The System</a>
          <a href="#modules">Modules</a>
          <a href="#pricing">Pricing</a>
        </div>
        <button onClick={openCheckout} className="nav-btn">
          Get Blueprint →
        </button>
      </nav>

      {/* HERO */}
      <div className="hero-wrap">
        <div className="hero-left">
          <div className="badge">
            <div className="badge-dot"></div>
            <span>Institutional Order Flow · 2026 Edition</span>
          </div>
          <h1>
            <span className="d">Trade</span>
            <br />
            <span className="g">Like an</span>
            <br />
            Institution.
          </h1>
          <p className="hero-sub">
            The complete futures & forex trading system for <b>60%+ win rates</b>, institutional sweep mastery, and
            DOM-confirmed entries — built for serious day traders.
          </p>
          <div className="cta-row">
            <a href="#pricing" className="btn-g">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1v10M3 7l5 5 5-5"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Get Instant Access — <s style={{opacity:0.5}}>$97</s> $47
            </a>
            <a href="#modules" className="btn-ghost">
              See all 15 modules →
            </a>
          </div>
          <div className="stat-strip">
            <div className="stat-it">
              <div className="stat-n">15</div>
              <div className="stat-l">Modules</div>
            </div>
            <div className="stat-it">
              <div className="stat-n">60%+</div>
              <div className="stat-l">Win Rate Target</div>
            </div>
            <div className="stat-it">
              <div className="stat-n">10+</div>
              <div className="stat-l">Instruments</div>
            </div>
            <div className="stat-it">
              <div className="stat-n">1:2+</div>
              <div className="stat-l">Risk:Reward</div>
            </div>
          </div>
        </div>

        {/* 3D Book */}
        <div className="hero-right">
          <div style={{ position: "relative", width: 340, height: 440 }}>
            <div className="float-badge fb-1" style={{ animationDelay: "0s" }}>
              <div className="fb-label">Win Rate</div>
              <div className="fb-val fb-green">62.4%</div>
            </div>
            <div className="float-badge fb-2" style={{ animationDelay: "1.8s", top: "38%", right: "-14%" }}>
              <div className="fb-label">R:R Ratio</div>
              <div className="fb-val fb-amber">1 : 2.4</div>
            </div>
            <div className="float-badge fb-3" style={{ animationDelay: "0.9s", bottom: "10%", left: "-6%" }}>
              <div className="fb-label">Session</div>
              <div className="fb-val fb-white">NY Open ●</div>
            </div>

            <div className="book-scene" ref={sceneRef}>
              <div className="book" ref={bookRef}>
                <div className="book-pages"></div>
                <div className="book-back"></div>
                <div className="book-spine">
                  <div className="spine-text">Session Blueprint</div>
                </div>
                <div className="book-front">
                  <div className="cover-inner">
                    <div className="cover-top-bar">
                      <div className="cover-brand">The Session Method</div>
                      <div className="cover-live">
                        <div className="cover-live-dot"></div>LIVE
                      </div>
                    </div>
                    <div className="cover-chart">
                      <svg viewBox="0 0 240 55" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00D68F" stopOpacity=".3" />
                            <stop offset="100%" stopColor="#00D68F" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0 45 L12 40 L24 42 L36 38 L48 35 L60 37 L72 30 L84 32 L96 28 L108 22 L120 25 L132 18 L144 20 L156 14 L168 16 L180 10 L192 13 L204 8 L216 11 L228 6 L240 8 L240 55 L0 55 Z"
                          fill="url(#cg)"
                        />
                        <polyline
                          points="0,45 12,40 24,42 36,38 48,35 60,37 72,30 84,32 96,28 108,22 120,25 132,18 144,20 156,14 168,16 180,10 192,13 204,8 216,11 228,6 240,8"
                          fill="none"
                          stroke="#00D68F"
                          strokeWidth="1.5"
                        />
                        <line
                          x1="0"
                          y1="14"
                          x2="240"
                          y2="14"
                          stroke="#FF4D6A"
                          strokeWidth=".8"
                          strokeDasharray="4,3"
                          opacity=".7"
                        />
                        <line
                          x1="0"
                          y1="46"
                          x2="240"
                          y2="46"
                          stroke="#F59E0B"
                          strokeWidth=".8"
                          strokeDasharray="4,3"
                          opacity=".7"
                        />
                        <circle cx="180" cy="10" r="3" fill="#00D68F" opacity=".9" />
                        <circle cx="180" cy="10" r="5" fill="none" stroke="#00D68F" strokeWidth=".8" opacity=".4" />
                      </svg>
                    </div>
                    <div className="cover-title-block">
                      <div className="cover-label">The Complete System</div>
                      <div className="cover-title">
                        THE
                        <br />
                        SESSION
                        <br />
                        <span className="cg">BLUEPRINT</span>
                      </div>
                      <div className="cover-subtitle">Institutional Order Flow · Liquidity Sweeps · DOM Mastery</div>
                    </div>
                    <div className="cover-pills">
                      <div className="cover-pill">
                        <div className="cpill-dot"></div>
                        <div className="cpill-text">60%+ WIN RATE FRAMEWORK</div>
                      </div>
                      <div className="cover-pill">
                        <div className="cpill-dot"></div>
                        <div className="cpill-text">LIQUIDITY SWEEP MASTERY</div>
                      </div>
                      <div className="cover-pill">
                        <div className="cpill-dot"></div>
                        <div className="cpill-text">15 MODULES · 50+ PAGES</div>
                      </div>
                    </div>
                    <div className="cover-footer">
                      <div className="cover-footer-brand">SESSION METHOD</div>
                      <div className="cover-year">© 2026</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="book-shadow"></div>
          </div>
        </div>
      </div>

      {/* TICKER */}
      <div className="ticker-outer">
        <div className="ticker-track">
          {[...Array(2)].map((_, i) => (
            <span key={i} style={{ display: "contents" }}>
              <div className="ti">
                <span className="s">/MES</span>
                <span className="u">+0.34%</span>
                <span style={{ color: "var(--text3)" }}>◆</span>
              </div>
              <div className="ti">
                <span className="s">/MNQ</span>
                <span className="u">+0.61%</span>
                <span style={{ color: "var(--text3)" }}>◆</span>
              </div>
              <div className="ti">
                <span className="s">/MGC</span>
                <span className="dn">-0.12%</span>
                <span style={{ color: "var(--text3)" }}>◆</span>
              </div>
              <div className="ti">
                <span className="s">EUR/USD</span>
                <span className="u">+0.22%</span>
                <span style={{ color: "var(--text3)" }}>◆</span>
              </div>
              <div className="ti">
                <span className="s">/ES</span>
                <span className="u">+0.28%</span>
                <span style={{ color: "var(--text3)" }}>◆</span>
              </div>
              <div className="ti">
                <span className="s">/NQ</span>
                <span className="u">+0.55%</span>
                <span style={{ color: "var(--text3)" }}>◆</span>
              </div>
              <div className="ti">
                <span className="s">GBP/USD</span>
                <span className="dn">-0.08%</span>
                <span style={{ color: "var(--text3)" }}>◆</span>
              </div>
              <div className="ti">
                <span className="s">/MCL</span>
                <span className="u">+1.14%</span>
                <span style={{ color: "var(--text3)" }}>◆</span>
              </div>
              <div className="ti">
                <span style={{ color: "var(--green)", fontSize: "10px", letterSpacing: ".15em" }}>
                  INSTITUTIONAL ORDER FLOW
                </span>
                <span style={{ color: "var(--text3)" }}>◆</span>
              </div>
              <div className="ti">
                <span style={{ color: "var(--text2)", fontSize: "10px", letterSpacing: ".12em" }}>
                  LIQUIDITY SWEEP MASTERY
                </span>
                <span style={{ color: "var(--text3)" }}>◆</span>
              </div>
            </span>
          ))}
        </div>
      </div>

      {/* METRICS */}
      <div className="wrap">
        <div className="sec" style={{ paddingBottom: 0 }}>
          <div className="metrics">
            <div className="m-card">
              <div className="m-val">60%+</div>
              <div className="m-lbl">Target Win Rate</div>
            </div>
            <div className="m-card">
              <div className="m-val">1:2+</div>
              <div className="m-lbl">Risk:Reward Target</div>
            </div>
            <div className="m-card">
              <div className="m-val">15</div>
              <div className="m-lbl">Complete Modules</div>
            </div>
            <div className="m-card">
              <div className="m-val">10+</div>
              <div className="m-lbl">Compatible Instruments</div>
            </div>
          </div>
        </div>
      </div>

      {/* THE PROBLEM */}
      <div className="wrap">
        <div className="sec">
          <div className="eyebrow">The Problem</div>
          <h2>
            Why Retail
            <br />
            Traders Keep Losing
          </h2>
          <p className="sub">
            {
              "You're not being beaten by skill. You're being systematically hunted by institutions who engineered every move to take your stops."
            }
          </p>
          <div className="pain-grid">
            <div className="pain-card">
              <div className="pain-t">Chasing Impossible Win Rates</div>
              <div className="pain-b">
                Obsessing over 80–90% win rates destroys risk:reward and wipes accounts the moment a losing streak hits.
                Sustainability is built on 60%, not 90%.
              </div>
            </div>
            <div className="pain-card">
              <div className="pain-t">No Pre-Marked Levels</div>
              <div className="pain-b">
                Trading in real time under pressure with zero reference points is pure emotion. Analysis must happen
                before the session opens — not during.
              </div>
            </div>
            <div className="pain-card">
              <div className="pain-t">Entering on Open Candles</div>
              <div className="pain-b">
                The single most common account-killer. Entering before candle close confirmation is how traders catch
                knives and get stopped out of perfectly good setups.
              </div>
            </div>
            <div className="pain-card">
              <div className="pain-t">Not Understanding Institutions</div>
              <div className="pain-b">
                Every significant price move is deliberate. Institutions engineer sweeps to fill orders against your
                stops. Without the framework, you are the liquidity.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* THE SYSTEM */}
      <div id="system" className="wrap">
        <div className="sec">
          <div className="sys-split">
            <div>
              <div className="eyebrow">The Solution</div>
              <h2>
                The Session
                <br />
                <span style={{ color: "var(--green)" }}>Blueprint</span>
                <br />
                System
              </h2>
              <p className="sub" style={{ marginBottom: 0 }}>
                Flip the script. Stop being the target and start reading institutional order flow the same way the banks
                do.
              </p>
              <div className="check-list">
                <div className="ci">
                  <span className="ci-g">→</span>
                  <span>
                    <b>4-factor confluence rule</b> — 3 of 4 required before any entry is allowed, ever
                  </span>
                </div>
                <div className="ci">
                  <span className="ci-g">→</span>
                  <span>
                    <b>Candle-close confirmation</b> — the one rule that eliminates 90% of premature entries
                  </span>
                </div>
                <div className="ci">
                  <span className="ci-g">→</span>
                  <span>
                    <b>Session level hierarchy</b> — PDH/PDL, overnight H/L, Asian range, current session
                  </span>
                </div>
                <div className="ci">
                  <span className="ci-g">→</span>
                  <span>
                    <b>Liquidity sweep mastery</b> — spot the exact sequence before the reversal fires
                  </span>
                </div>
                <div className="ci">
                  <span className="ci-g">→</span>
                  <span>
                    <b>DOM absorption signals</b> — see institutional defense in the order book in real time
                  </span>
                </div>
                <div className="ci">
                  <span className="ci-g">→</span>
                  <span>
                    <b>Minimum 1:1.5 R:R</b> — required on every trade before position is opened
                  </span>
                </div>
              </div>
            </div>

            {/* Terminal */}
            <div className="terminal">
              <div className="t-bar">
                <div className="td tdr"></div>
                <div className="td tdy"></div>
                <div className="td tdg"></div>
                <div className="t-title">SESSION BLUEPRINT — PRE-TRADE CHECKLIST</div>
              </div>
              <div className="t-tabs">
                <div className="t-tab on">CHECKLIST</div>
                <div className="t-tab">JOURNAL</div>
                <div className="t-tab">LEVELS</div>
              </div>
              <div className="t-body">
                <div className="t-head">Active Setup — /MNQ · NY Open 08:31 CT</div>
                <div className="t-row">
                  <div className="t-k">Instrument</div>
                  <div className="t-v a">/MNQ — Micro Nasdaq</div>
                </div>
                <div className="t-row">
                  <div className="t-k">Bias</div>
                  <div className="t-v g">LONG · Above 200 MA ↑</div>
                </div>
                <div className="t-row">
                  <div className="t-k">Level</div>
                  <div className="t-v">PDL Touch + London Sweep</div>
                </div>
                <div className="t-row">
                  <div className="t-k">Stop Loss</div>
                  <div className="t-v r">21,847 (below sweep wick)</div>
                </div>
                <div className="t-row">
                  <div className="t-k">Target 1</div>
                  <div className="t-v g">21,940 (+4.2R projected)</div>
                </div>
                <div className="t-row">
                  <div className="t-k">Risk : Reward</div>
                  <div className="t-v g">1 : 2.4 ✓</div>
                </div>
                <div className="t-head" style={{ marginTop: 14 }}>
                  Confluence Confirmation
                </div>
                <div className="t-checks">
                  <div className="tc">
                    <div className="tcb ok">✓</div>MA Stack aligned — 8 above 20 above 50, all ascending
                  </div>
                  <div className="tc">
                    <div className="tcb ok">���</div>Key level touch — PDL confirmed at 21,850
                  </div>
                  <div className="tc">
                    <div className="tcb ok">✓</div>Hammer rejection candle on 5M — buyers absorbed the wick
                  </div>
                  <div className="tc">
                    <div className="tcb wait">◐</div>DOM absorption — large bid refreshing at 21,848
                  </div>
                  <div className="tc">
                    <div className="tcb ok">✓</div>Candle fully CLOSED — entering next open only
                  </div>
                </div>
                <div className="t-foot">
                  <div className="tf-l">CONFLUENCE SCORE</div>
                  <div className="tf-v">3 / 4 → ENTRY VALID</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pillars */}
          <div className="pillars" style={{ marginTop: 64 }}>
            <div className="p-card p-c1">
              <div className="p-name">Structure</div>
              <div className="p-body">
                Session levels, PDH/PDL, trendlines, volume profile — your complete pre-market map.
              </div>
            </div>
            <div className="p-card p-c2">
              <div className="p-name">Confluence</div>
              <div className="p-body">MA stack + key level + candle signal + DOM. Three of four, minimum. Every time.</div>
            </div>
            <div className="p-card p-c3">
              <div className="p-name">Precision</div>
              <div className="p-body">
                Tight entries, stop beyond the wick, defined risk before any position is opened.
              </div>
            </div>
            <div className="p-card p-c4">
              <div className="p-name">Discipline</div>
              <div className="p-body">Pre-trade checklist, daily journal, two-loss rule. Execute without deviation.</div>
            </div>
          </div>
        </div>
      </div>

      {/* MODULES */}
      <div id="modules" className="mods-bg">
        <div className="wrap">
          <div className="sec">
            <div className="eyebrow">The Curriculum</div>
            <h2>
              15 Modules.
              <br />
              Everything You Need.
            </h2>
            <p className="sub">
              A complete A-to-Z institutional trading education — from core philosophy through advanced concepts,
              psychology, and daily structure.
            </p>
            <div className="mods-grid">
              {[
                { n: "01", t: "Understanding the Foundation", d: "Institutional philosophy, the 60%+ win rate approach, and the four pillars of the system." },
                { n: "02", t: "Compatible Instruments", d: "Full guide: /MES, /MNQ, /MGC, /MCL, /SIL, /ES, /NQ, /6E, EUR/USD, GBP/USD." },
                { n: "03", t: "The Three Sessions", d: "Asian range creation, London liquidity hunt, New York confirmation — the daily pattern." },
                { n: "04", t: "Level Marking — Pre-Market Ritual", d: "The exact ritual: PDH/PDL, overnight H/L, POC, 200 MA, trendlines. Before adrenaline hits." },
                { n: "05", t: "Confluence Entry System", d: "All 4 factors. 3 required. MA stack, level touch, candle confirmation, DOM absorption." },
                { n: "06", t: "Liquidity Sweep Zones", d: "The exact sweep sequence, trigger rules, entry timing, and stop placement every time." },
                { n: "07", t: "Price Action & Candle Reading", d: "Hammer, shooting star, engulfing — what each pattern means in context and how to act." },
                { n: "08", t: "Depth of Market Mastery", d: "Absorption, iceberg orders, stacked bids/offers — reading institutional order book defense." },
                { n: "09", t: "Trade Management Rules", d: "Scaling out, runner management, break-even stops, and protecting profits once you're in." },
                { n: "10", t: "Risk Management & Position Sizing", d: "Tick-value formulas, daily loss limits, position sizing that keeps the account alive." },
                { n: "11", t: "Trading Psychology & Discipline", d: "Two-loss rule, revenge trading, FOMO — the mental framework separating pros from gamblers." },
                { n: "12", t: "The Daily Routine", d: "Morning ritual to afternoon close — the exact daily structure for prepared, objective trading." },
                { n: "13", t: "Advanced Concepts", d: "Order blocks, fair value gaps, market structure shifts, and advanced confluence stacking." },
                { n: "14", t: "Daily Trade Journal Template", d: "The exact journaling framework for reviewing, tracking, and systematically improving." },
                { n: "15", t: "Exercises & Self-Assessment", d: "Backtesting drills, setup identification practice, and self-assessment tools to accelerate growth." },
              ].map((m, i) => (
                <div key={i} className="mc">
                  <div className="mn">MODULE {m.n}</div>
                  <div className="mt">{m.t}</div>
                  <div className="md">{m.d}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 44 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>
                Compatible with
              </div>
              <div className="chips">
                {["/MES", "/MNQ", "/MGC", "/MCL", "/SIL", "/ES", "/NQ", "/6E", "EUR/USD", "GBP/USD"].map((c) => (
                  <div key={c} className="chip">
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="reviews-section">
        <div className="wrap">
          <div className="sec">
            <div className="eyebrow">Verified Reviews</div>
            <h2>
              What Traders
              <br />
              Are Saying
            </h2>
            <p className="sub">
              Reviews from verified purchasers. Unedited. These are real traders sharing what changed for them.
            </p>
            <div className="review-summary">
              <div className="rs-score">
                <div className="rs-num">4.9</div>
                <div className="rs-stars">★★★★★</div>
                <div className="rs-count">OVERALL RATING</div>
              </div>
              <div className="rs-divider"></div>
              <div className="rs-bars">
                {[
                  { star: 5, pct: 89 },
                  { star: 4, pct: 8 },
                  { star: 3, pct: 2 },
                  { star: 2, pct: 1 },
                  { star: 1, pct: 0 },
                ].map((r) => (
                  <div key={r.star} className="rb-row">
                    <span className="rb-label">{r.star}★</span>
                    <div className="rb-bar">
                      <div className="rb-fill" style={{ width: `${r.pct}%` }}></div>
                    </div>
                    <span className="rb-pct">{r.pct}%</span>
                  </div>
                ))}
              </div>
              <div className="rs-divider"></div>
              <div className="rs-verified">
                <strong>347</strong>
                verified
                <br />
                purchasers
              </div>
              <div className="rs-divider"></div>
              <div className="rs-verified">
                <strong>100%</strong>
                digital
                <br />
                delivery
              </div>
            </div>

            <div className="reviews-grid">
              {[
                { av: "MR", avc: "av-a", name: "Marcus R.", inst: "/MES FUTURES · CHICAGO, IL", date: "Mar 14, 2026", tag: "verified", title: "The pre-market ritual alone was worth 10x the price", body: "I've bought 4 courses before this. None gave me actual pre-session structure I could run every morning. The <b>level marking ritual in Module 4</b> changed my entire approach. I now mark PDH/PDL, overnight highs and lows, and POC before anything opens — and I stopped entering trades I had no business being in.", helpful: 32, yrs: "3 yrs" },
                { av: "JL", avc: "av-b", name: "Jessica L.", inst: "/MNQ + EUR/USD · AUSTIN, TX", date: "Apr 2, 2026", tag: "verified", title: "DOM mastery section is what nobody else teaches", body: "I've been trading NQ for two years and never understood the order book beyond basic bid/ask. <b>Module 8 on DOM absorption signals</b> genuinely blew my mind. Seeing large bid refreshing at a level before a big move happens — once you can read it, you cannot unsee it.", helpful: 27, yrs: "2 yrs" },
                { av: "DK", avc: "av-c", name: "Devon K.", inst: "/MGC GOLD FUTURES · DENVER, CO", date: "Feb 28, 2026", tag: "verified", title: "3-of-4 confluence rule fixed my overtrading overnight", body: "I was averaging 12+ trades a day and constantly getting chopped. The <b>3-of-4 confluence requirement</b> was the single rule that fixed my psychology. Trade count dropped from 12 to under 4 per session. Win rate went from 44% to 61% in six weeks.", helpful: 41, yrs: "4 yrs" },
                { av: "TR", avc: "av-d", name: "Tyler R.", inst: "/ES + /NQ · NASHVILLE, TN", date: "Apr 11, 2026", tag: "purchase", title: "Finally a workbook with actual structure, not theory", body: "What separates this from the YouTube rabbit holes is that it tells you exactly what to do and in what order. <b>The daily routine in Module 12</b> gave me a pre-market ritual I've run every morning for two months now.", helpful: 19, yrs: "5 yrs" },
                { av: "SM", avc: "av-e", name: "Sarah M.", inst: "EUR/USD · LONDON, UK", date: "Mar 5, 2026", tag: "verified", title: "Shifted my entire understanding of liquidity sweeps", body: "As a forex trader the section on <b>Asian range creation and the London liquidity hunt</b> was exactly what I'd been missing. I always knew the patterns existed but never had a framework for reading them in real time.", helpful: 23, yrs: "18 mo" },
                { av: "CC", avc: "av-a", name: "Chris C.", inst: "/MCL CRUDE OIL · HOUSTON, TX", date: "Jan 19, 2026", tag: "purchase", title: "I've read it four times. It gets better every read.", body: "The information density per page is insane — there's no padding. I'm on my fourth read-through and I'm still pulling out nuances I missed. <b>The candle-close confirmation rule alone</b> cut my false entries by what I estimate is about 80%.", helpful: 38, yrs: "6 yrs" },
              ].map((r, i) => (
                <div key={i} className="rev-card">
                  <div className="rev-top">
                    <div className={`rev-av ${r.avc}`}>{r.av}</div>
                    <div className="rev-meta">
                      <div className="rev-name">{r.name}</div>
                      <div className="rev-inst">{r.inst}</div>
                      <div className="rev-stars">★★★★★</div>
                    </div>
                    <div className="rev-date">{r.date}</div>
                  </div>
                  <span className={`rev-tag ${r.tag === "verified" ? "tag-verified" : "tag-purchase"}`}>
                    {r.tag === "verified" ? "✓ Verified Purchase" : "📦 Verified Download"}
                  </span>
                  <div className="rev-title">{r.title}</div>
                  <div className="rev-body" dangerouslySetInnerHTML={{ __html: r.body }}></div>
                  <div className="rev-footer">
                    <span className="rev-helpful">
                      <svg viewBox="0 0 24 24">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                      </svg>{" "}
                      Helpful ({r.helpful})
                    </span>
                    <span>Trading: {r.yrs}</span>
                  </div>
                </div>
              ))}
            </div>

            {!hiddenReviews && (
              <button className="reviews-show-more" onClick={() => setHiddenReviews(true)}>
                Load More Reviews (338 remaining) ↓
              </button>
            )}

            {hiddenReviews && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 14 }}>
                {[
                  { av: "LH", avc: "av-e", name: "Lena H.", inst: "GBP/USD · SEATTLE, WA", title: "Finally consistent after 18 months of losing", body: "I was about to quit trading. Spent $1,200+ on courses that gave me indicators and nothing else. This workbook is different — it gave me a <b>repeatable process</b>, not a magic formula." },
                  { av: "PG", avc: "av-a", name: "Paul G.", inst: "/ES S&P 500 · PHOENIX, AZ", title: "The runner management section is elite", body: "I've always known how to get into trades. I never knew how to manage them once in. <b>Module 9 on trade management</b> — scaling out, break-even stops, protecting the runner — is the content I've been searching for." },
                  { av: "RA", avc: "av-b", name: "Riya A.", inst: "/MNQ · DALLAS, TX", title: "Instant download, read it in one sitting, applied it next morning", body: "The checkout was smooth, PDF downloaded immediately, no issues on mobile or desktop. <b>The checklist template is formatted perfectly</b> — I printed it and use it as a physical checklist every session now." },
                ].map((r, i) => (
                  <div key={i} className="rev-card">
                    <div className="rev-top">
                      <div className={`rev-av ${r.avc}`}>{r.av}</div>
                      <div className="rev-meta">
                        <div className="rev-name">{r.name}</div>
                        <div className="rev-inst">{r.inst}</div>
                        <div className="rev-stars">★★★★★</div>
                      </div>
                    </div>
                    <span className="rev-tag tag-verified">✓ Verified Purchase</span>
                    <div className="rev-title">{r.title}</div>
                    <div className="rev-body" dangerouslySetInnerHTML={{ __html: r.body }}></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap">
          <div className="sec">
            <div className="price-wrap">
              <div className="eyebrow" style={{ justifyContent: "center" }}>
                Get the Blueprint
              </div>
              <h2>
                One Investment.
                <br />
                The Complete System.
              </h2>
              <p className="sub" style={{ margin: "0 auto", textAlign: "center", maxWidth: 420 }}>
                Immediate digital delivery. Everything in one workbook. No subscription.
              </p>
              <div className="price-card">
                <div className="p-old">$97 regular price</div>
                <div className="p-num">
                  <sup>$</sup>47
                </div>
                <div className="p-note">One-time · Instant PDF Download</div>
                <ul className="p-feats">
                  <li>
                    <b>Complete 15-module workbook</b> — 50+ pages of institutional frameworks
                  </li>
                  <li>
                    <b>Pre-trade checklist template</b> — run it every morning before market open
                  </li>
                  <li>
                    <b>Daily trade journal template</b> — the review system that builds edge over time
                  </li>
                  <li>
                    <b>Session level hierarchy chart</b> — PDH/PDL through current session structure
                  </li>
                  <li>
                    <b>All 4-factor confluence guides</b> with visual setup examples
                  </li>
                  <li>
                    <b>Works on 10+ instruments</b> — futures, micro contracts, forex pairs
                  </li>
                  <li>
                    <b>Lifetime access</b> — download once, yours forever
                  </li>
                </ul>
                <button onClick={openCheckout} className="btn-buy">
                  Get Instant Access — <s style={{opacity:0.5}}>$97</s> $47
                </button>
                <div className="p-secure">Secure checkout · Instant PDF · © 2026 The Session Method</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="wrap">
        <div className="sec">
          <div className="eyebrow">FAQ</div>
          <h2>Questions</h2>
          <FAQList />
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="final">
        <div className="eyebrow" style={{ justifyContent: "center" }}>
          Make the move
        </div>
        <h2>
          You Know Which
          <br />
          Side You Want
          <br />
          <span style={{ color: "var(--green)" }}>To Be On.</span>
        </h2>
        <p>Stop trading against institutions. Get the playbook and start trading alongside them.</p>
        <button onClick={openCheckout} className="btn-g" style={{ margin: "0 auto", fontSize: 15, padding: "16px 48px" }}>
          Get the Session Blueprint — <s style={{opacity:0.5}}>$97</s> $47
        </button>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="foot-brand">The Session Method</div>
        <div className="foot-legal">
          © 2026 The Session Method. All Rights Reserved. Trading futures and forex involves substantial risk of loss.
          For educational purposes only. Past performance is not indicative of future results. Nothing herein
          constitutes financial advice.
        </div>
      </footer>

      {/* CHECKOUT MODAL */}
      <div className={`modal-overlay ${checkoutOpen ? "open" : ""}`} onClick={(e) => e.target === e.currentTarget && setCheckoutOpen(false)}>
        <div className="stripe-checkout-box">
          <button className="modal-close" onClick={() => setCheckoutOpen(false)}>
            ✕
          </button>
          <Checkout 
            productId="session-method-workbook" 
            onComplete={() => {
              setCheckoutOpen(false)
              setOrderId(`TSM-${Date.now().toString(36).toUpperCase()}`)
              setConfirmEmail(email || "your email")
              setDownloadOpen(true)
            }}
          />
        </div>
      </div>

      {/* DOWNLOAD MODAL */}
      <div className={`dl-modal ${downloadOpen ? "open" : ""}`}>
        <div className="dl-box">
          <div className="dl-order-id">
            ORDER CONFIRMED · ID: <span>{orderId}</span>
          </div>
          <div className="dl-success-ring">
            <div className="dl-check">✓</div>
          </div>
          <div className="dl-title">
            Payment <span>Complete</span>
          </div>
          <div className="dl-sub">
            Your workbook is ready. Click below to download your PDF instantly. A copy has also been sent to{" "}
            <span style={{ color: "var(--green)" }}>{confirmEmail}</span>.
          </div>
          <div className="dl-items">
            <div className="dl-item">
              <div className="dl-item-name">The Session Blueprint — Full Workbook</div>
              <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--green)" }}>PDF · Ready</div>
            </div>
            <div className="dl-item">
              <div className="dl-item-name">Pre-Trade Checklist Template</div>
              <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--green)" }}>Included</div>
            </div>
            <div className="dl-item">
              <div className="dl-item-name">Daily Journal Template</div>
              <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--green)" }}>Included</div>
            </div>
          </div>
          <button className="dl-btn-main" onClick={downloadWorkbook}>
            ↓ Download The Session Blueprint PDF
          </button>
          <button className="dl-btn-sec" onClick={() => setDownloadOpen(false)}>
            Close this window
          </button>
          <div className="dl-note">LIFETIME ACCESS · SAVE TO ANY DEVICE · PRINT-FRIENDLY</div>
        </div>
      </div>

      {/* Social Proof Popup */}
      <div className={`social-proof-popup ${showPopup ? "show" : ""}`}>
        <div className="social-proof-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>
        <div className="social-proof-content">
          <div className="social-proof-name">{popupData.name}</div>
          <div className="social-proof-action">{popupData.action}</div>
          <div className="social-proof-location">{popupData.location}</div>
          <div className="social-proof-time">Just now</div>
        </div>
      </div>
    </>
  )
}

function FAQList() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    { q: "Do I need experience to use this?", a: "Intermediate and up is ideal. Module 1 covers the foundational philosophy, but traders with some chart-reading experience will immediately apply the confluence and DOM modules to live markets." },
    { q: "Which instruments does this cover?", a: "The system is instrument-agnostic — built on institutional behavior that appears in every liquid market. Futures (/MES, /MNQ, /MGC, /MCL, /ES, /NQ, /6E, /SIL) and forex (EUR/USD, GBP/USD, XAU/USD) are all explicitly covered with per-instrument adjustment guides." },
    { q: "Is this signals, copy trading, or a subscription?", a: "None of the above. This is an educational workbook that teaches you a complete, self-sufficient trading system. You learn to read the market yourself. No signals, no subscriptions, no ongoing dependency." },
    { q: "How is it delivered?", a: "Immediately after checkout you receive a download link for the full digital workbook in PDF format. Save it to any device, print a personal copy, access it forever." },
    { q: "Is there a refund policy?", a: "Due to instant digital delivery, all sales are final. The workbook delivers the complete 15-module institutional trading system as described throughout this page." },
  ]

  return (
    <div className="faq-list">
      {faqs.map((faq, i) => (
        <div key={i} className={`faq-item ${openIndex === i ? "open" : ""}`}>
          <div className="faq-q" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
            {faq.q} <span className="faq-icon">+</span>
          </div>
          <div className="faq-a">
            <p>{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
