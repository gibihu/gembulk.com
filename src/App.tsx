import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  ShieldCheck,
  Zap,
  Clock,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
  Code,
  Terminal,
  Check
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion';
import { Button } from './components/ui/button';

const LandingPage = () => {
  const PORTAL_URL = "https://portal.gembulk.com";

  // 1. State สำหรับเก็บตำแหน่งเมาส์
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const plans = [
    { name: "Starter", price: "1,000", rate: "0.33", total: "3,030", duration: "3 เดือน", star: false },
    { name: "Basic", price: "10,000", rate: "0.28", total: "35,714", duration: "6 เดือน", star: false },
    { name: "Corporate", price: "50,000", rate: "0.24", total: "208,333", duration: "6 เดือน", star: true },
    { name: "Corporate Special", price: "100,000", rate: "0.20", total: "500,000", duration: "12 เดือน", star: false },
    { name: "Enterprise", price: "300,000", rate: "0.18", total: "1,666,667", duration: "ไม่จำกัด", star: false },
  ];

  const faqs = [
    { question: "เชื่อมต่อ API ยากไหม?", answer: "ไม่ยากเลย! เรามีเอกสาร API ที่ครบถ้วนและตัวอย่างโค้ดสำหรับภาษาต่างๆ รวมถึงทีมสนับสนุนที่พร้อมช่วยเหลือคุณ" },
    { question: "รองรับเครือข่ายอะไรบ้าง?", answer: "รองรับทุกเครือข่ายหลักในประเทศไทย รวมถึง AIS, DTAC, True และเครือข่ายอื่นๆ เพื่อให้มั่นใจว่าข้อความของคุณจะถึงผู้รับได้อย่างรวดเร็ว" },
    { question: "เครดิตไม่มีวันหมดอายุทำได้ไหม?", answer: "ได้ค่ะ! เครดิตของเรามีอายุการใช้งานไม่จำกัด คุณสามารถใช้เมื่อไหร่ก็ได้ตามความต้องการทางธุรกิจ" }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    // เพิ่ม relative และ overflow-x-hidden เพื่อไม่ให้ลูกบอลหลุดขอบจอ
    <div className="relative min-h-screen w-full bg-slate-50 text-slate-900 scroll-smooth overflow-x-hidden">

      {/* 2. BACKGROUND MOUSE TRACKER (ลูกบอลสีฟ้าเบลอหลังสุด) */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute w-[500px] h-[500px] bg-primary/80 rounded-full blur-[200px] transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${mousePos.x - 250}px, ${mousePos.y - 250}px)`,
          }}
        />
      </div>

      {/* Content ทั้งหมดต้องมี z-index หรืออยู่ใน flow ปกติที่อยู่เหนือพื้นหลัง */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed w-full z-50 bg-white/20 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">GEMBULK</div>
            <div className="hidden md:flex space-x-8 font-medium">
              <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }} className="hover:text-blue-600 transition">About</a>
              <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }} className="hover:text-blue-600 transition">Services</a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="hover:text-blue-600 transition">Pricing</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="hover:text-blue-600 transition">Contact</a>
            </div>
            <a href={PORTAL_URL} className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition">Get Started</a>
          </div>
        </nav>

        {/* 1. Hero Section */}
        <section id="home" className="relative pt-32 pb-20 flex items-center justify-center min-h-[90vh]">
          {/* Static Hero Box Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-600 rounded-[40px] rotate-12 opacity-50 blur-xl -z-10" />

          <div className="container mx-auto px-4 relative text-center">
            <div className="inline-block p-[1px] rounded-3xl bg-white/50 backdrop-blur-xl border border-white shadow-2xl">
              <div className="bg-white/40 backdrop-blur-md p-10 md:p-20 rounded-3xl">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  Fast & Reliable <br />SMS Solutions
                </h1>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                  ยกระดับธุรกิจของคุณด้วยบริการส่ง SMS และ OTP API ที่รวดเร็ว ปลอดภัย และราคาคุ้มค่าที่สุดในตลาด
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <a href={PORTAL_URL}>
                    <Button className="px-24 py-6 hover:scale-105 transition-transform">
                      <span className="flex items-center gap-2">
                        เริ่มใช้งานเลย <ArrowRight />
                      </span>
                    </Button>
                  </a>

                  <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>
                    <Button variant="outline" className="px-24 py-6 hover:scale-105 transition-transform bg-white/50 backdrop-blur-sm">
                      ดูแพ็กเกจ
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. About Us */}
        <section id="about" className="py-20">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-6 italic text-blue-600 underline">About Gembulk</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              เราคือผู้เชี่ยวชาญด้านระบบสื่อสารผ่านข้อความ (Messaging Solution) ที่มุ่งเน้นการเชื่อมต่อธุรกิจกับลูกค้าอย่างมีประสิทธิภาพ ด้วยระบบโครงสร้างพื้นฐานที่แข็งแกร่ง ทำให้เราสามารถส่งข้อความถึงผู้รับได้อย่างแม่นยำและรวดเร็ว
            </p>
          </div>
        </section>

        {/* 3. SMS & 4. OTP API */}
        <section id="services" className="py-20">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
            <div className="bg-white/50 backdrop-blur-md p-10 rounded-3xl shadow-sm border border-white">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <MessageSquare className="text-blue-600 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Bulk SMS Marketing</h3>
              <p className="text-slate-600">ส่งข้อความประชาสัมพันธ์หาลูกค้ากลุ่มใหญ่ในคลิกเดียว รองรับทุกเครือข่าย พร้อมระบบรายงานผลแบบ Real-time</p>
            </div>
            <div className="bg-white/50 backdrop-blur-md p-10 rounded-3xl shadow-sm border border-white">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="text-indigo-600 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">OTP Verification API</h3>
              <p className="text-slate-600">ระบบยืนยันตัวตนผ่านรหัสผ่านใช้ครั้งเดียว เชื่อมต่อง่ายผ่าน API ความเร็วสูง มั่นใจด้วยอัตราการส่งถึง 99.9%</p>
            </div>
          </div>
        </section>

        {/* 4.5 API Integration Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Column: Content */}
              <div>
                <div className="inline-block p-3 rounded-2xl bg-blue-100 text-blue-600 mb-6">
                  <Terminal className="w-8 h-8" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-6">
                  Developer Friendly API <br />
                  <span className="text-blue-600">Integrate in Minutes</span>
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  เชื่อมต่อระบบของคุณเข้ากับ Gateway คุณภาพสูงของเราได้ง่ายๆ ด้วย REST API ที่ได้มาตรฐาน รองรับทุกภาษาโปรแกรม พร้อม Documentation ที่เข้าใจง่าย
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    "Simple HTTP REST API",
                    "High Performance Gateway",
                    "Real-time Delivery Status webhook",
                    "SDKs for PHP, Node.js, Python, Go"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center text-slate-700 font-medium">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Check className="w-3 h-3 text-blue-500" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>

                <a href={PORTAL_URL}>
                  <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50/50 hover:border-blue-300">
                    <Code className="w-4 h-4 mr-2" /> Read Documentation
                  </Button>
                </a>
              </div>

              {/* Right Column: Code Example */}
              <div className="relative group">
                {/* Decor elements */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                <div className="relative rounded-2xl bg-[#1E1E1E] shadow-2xl overflow-hidden border border-slate-800">
                  {/* Window Header */}
                  <div className="flex items-center px-4 py-3 bg-[#2D2D2D] border-b border-slate-700">
                    <div className="flex space-x-2 mr-4">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                    </div>
                    <div className="text-xs text-slate-400 font-mono flex items-center">
                      <Terminal className="w-3 h-3 mr-2" />
                      send-sms.js
                    </div>
                  </div>

                  {/* Code Area */}
                  <div className="p-6 overflow-x-auto">
                    <pre className="font-mono text-sm leading-relaxed">
                      <code className="block">
                        <span className="text-[#C586C0]">const</span> <span className="text-[#9CDCFE]">response</span> <span className="text-[#D4D4D4]">=</span> <span className="text-[#C586C0]">await</span> <span className="text-[#9CDCFE]">fetch</span><span className="text-[#D4D4D4]">(</span><br />
                        <span className="text-[#CE9178]">&nbsp;&nbsp;'https://api.gembulk.com/v1/send'</span><span className="text-[#D4D4D4]">,</span> <span className="text-[#D4D4D4]">{'{'}</span><br />
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#9CDCFE]">method</span><span className="text-[#9CDCFE]">:</span> <span className="text-[#CE9178]">'POST'</span><span className="text-[#D4D4D4]">,</span><br />
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#9CDCFE]">headers</span><span className="text-[#9CDCFE]">:</span> <span className="text-[#D4D4D4]">{'{'}</span><br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">'Content-Type'</span><span className="text-[#9CDCFE]">:</span> <span className="text-[#CE9178]">'application/json'</span><br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">'x-api-key'</span><span className="text-[#9CDCFE]">:</span> <span className="text-[#CE9178]">'YOUR_API_KEY'</span><span className="text-[#D4D4D4]">,</span><br />
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#D4D4D4]">{'}'}</span><span className="text-[#D4D4D4]">,</span><br />
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#9CDCFE]">body</span><span className="text-[#9CDCFE]">:</span> <span className="text-[#9CDCFE]">JSON</span><span className="text-[#D4D4D4]">.</span><span className="text-[#DCDCAA]">stringify</span><span className="text-[#D4D4D4]">({'{'}</span><br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#9CDCFE]">receiver</span><span className="text-[#9CDCFE]">:</span> <span className="text-[#CE9178]">'66891234567'</span><span className="text-[#D4D4D4]">,</span><br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#9CDCFE]">sender_name</span><span className="text-[#9CDCFE]">:</span> <span className="text-[#CE9178]">'Your Sender Name'</span><br />
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#D4D4D4]">{'}'})</span><br />
                        <span className="text-[#D4D4D4]">{'}'});</span>
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Table (All Plans) */}
        <section id="pricing" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-blue-900 italic">เลือกแพ็กเกจที่เหมาะกับคุณ</h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {plans.map((plan, index) => (
                <div key={index} className={`relative p-6 rounded-3xl border transition-all hover:-translate-y-2 backdrop-blur-md ${plan.star ? 'border-blue-500 shadow-xl bg-blue-50/90' : 'border-slate-200 bg-white/70'}`}>
                  {plan.star && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 border-2 border-yellow-400 bg-white text-xs text-yellow-400 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      ⭐️ แนะนำ ⭐️
                    </div>
                  )}
                  <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
                  <div className="text-3xl font-black text-blue-600 mb-1">{plan.price} ฿</div>
                  <div className="text-sm text-slate-500 mb-6 font-medium underline">เฉลี่ย {plan.rate} / SMS</div>
                  <ul className="space-y-3 mb-8 text-sm">
                    <li className="flex items-center text-slate-600"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> ส่งได้ {plan.total} ข้อความ</li>
                    <li className="flex items-center text-slate-600"><Clock className="w-4 h-4 mr-2 text-blue-500" /> อายุ {plan.duration}</li>
                  </ul>
                  <a href={PORTAL_URL}>
                    <Button className={`w-full h-12 rounded-xl font-bold text-center ${plan.star ? 'bg-blue-600 text-white shadow-lg' : 'border border-primary bg-white text-slate-700 hover:bg-primary hover:text-white'}`}>
                      เริ่มใช้งานแพ็กเกจนี้
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* 5. Features */}
        <section className="py-20 bg-slate-900/70 text-white relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div>
                <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-2 text-blue-400 italic">ส่งไวใน 3 วินาที</h3>
                <p className="text-slate-400">ระบบ Low-latency มั่นใจว่า OTP ถึงมือลูกค้าทันเวลาแน่นอน</p>
              </div>
              <div>
                <ShieldCheck className="w-12 h-12 text-blue-400 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-2 text-blue-400 italic">ความปลอดภัยระดับสากล</h3>
                <p className="text-slate-400">ระบบเข้ารหัสข้อมูล และป้องกันการโจมตีทาง Cyber ทุกรูปแบบ</p>
              </div>
              <div>
                <MessageSquare className="w-12 h-12 text-green-400 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-2 text-blue-400 italic">รายงานครบถ้วน</h3>
                <p className="text-slate-400">Dashboard แสดงสถานะการส่งแบบละเอียดยิบ พร้อม Export ไฟล์ได้</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FAQ */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-10 italic">คำถามที่พบบ่อย (FQA)</h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border bg-white/50 backdrop-blur-sm rounded-xl">
                  <AccordionTrigger className="px-4 py-4 hover:bg-slate-50 transition-colors text-left text-xl font-medium text-slate-700">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-slate-600 text-lg">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* 7. Contact */}
        <section id="contact" className="py-20 bg-blue-600/90 backdrop-blur-sm text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-10 italic underline underline-offset-8">ติดต่อเรา</h2>
            <div className="flex flex-col md:flex-row justify-center gap-10">
              <div className="flex items-center justify-center gap-3">
                <Mail /> contact@gembulk.com
              </div>
              <div className="flex items-center justify-center gap-3">
                <Phone /> 02-xxx-xxxx
              </div>
            </div>
          </div>
        </section>

        {/* 8. Footer */}
        <footer className="py-10 bg-white/80 backdrop-blur-md border-t">
          <div className="container mx-auto px-4 text-center">
            <p className="text-slate-500">© 2024 GEMBULK Co., Ltd. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-6 text-sm text-slate-400 underline">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;