import { jsPDF } from 'jspdf';

// Brand colors from the website
const colors = {
  primary: '#00D68F', // Green accent
  dark: '#070C11',
  darkPanel: '#111A24',
  border: '#1B2A3A',
  text: '#1A1A1A',
  textLight: '#4A5568',
  textMuted: '#718096',
  white: '#FFFFFF',
  pageAccent: '#00D68F',
};

interface PDFGenerator {
  doc: jsPDF;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  currentY: number;
}

function createPDF(): PDFGenerator {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });
  
  return {
    doc,
    pageWidth: 612,
    pageHeight: 792,
    margin: 50,
    currentY: 50,
  };
}

function addNewPage(pdf: PDFGenerator) {
  pdf.doc.addPage();
  pdf.currentY = 50;
}

function drawPageHeader(pdf: PDFGenerator, moduleNum?: number, moduleTitle?: string) {
  const { doc, pageWidth, margin } = pdf;
  
  // Top accent line
  doc.setFillColor(0, 214, 143);
  doc.rect(0, 0, pageWidth, 4, 'F');
  
  // Header area
  doc.setFillColor(7, 12, 17);
  doc.rect(0, 4, pageWidth, 50, 'F');
  
  // Brand
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 214, 143);
  doc.text('THE SESSION METHOD', margin, 34);
  
  if (moduleNum && moduleTitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(200, 200, 200);
    doc.text(`MODULE ${moduleNum}  |  ${moduleTitle.toUpperCase()}`, pageWidth - margin, 34, { align: 'right' });
  }
  
  pdf.currentY = 74;
}

function drawPageFooter(pdf: PDFGenerator, pageNum: number) {
  const { doc, pageWidth, pageHeight, margin } = pdf;
  
  // Footer line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, pageHeight - 40, pageWidth - margin, pageHeight - 40);
  
  // Page number
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`THE SESSION BLUEPRINT  |  The Session Method  |  ${pageNum}`, pageWidth / 2, pageHeight - 25, { align: 'center' });
}

function addTitle(pdf: PDFGenerator, text: string, fontSize: number = 28) {
  const { doc, margin } = pdf;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fontSize);
  doc.setTextColor(26, 26, 26);
  doc.text(text, margin, pdf.currentY);
  pdf.currentY += fontSize + 12;
}

function addSubtitle(pdf: PDFGenerator, text: string, fontSize: number = 14) {
  const { doc, margin } = pdf;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fontSize);
  doc.setTextColor(0, 214, 143);
  doc.text(text, margin, pdf.currentY);
  pdf.currentY += fontSize + 10;
}

function addParagraph(pdf: PDFGenerator, text: string, fontSize: number = 11) {
  const { doc, margin, pageWidth, pageHeight } = pdf;
  const maxWidth = pageWidth - (margin * 2);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSize);
  doc.setTextColor(50, 50, 50);
  
  const lines = doc.splitTextToSize(text, maxWidth);
  
  for (const line of lines) {
    if (pdf.currentY > pageHeight - 60) {
      addNewPage(pdf);
      drawPageHeader(pdf);
    }
    doc.text(line, margin, pdf.currentY);
    pdf.currentY += fontSize + 4;
  }
  pdf.currentY += 8;
}

function addBulletPoint(pdf: PDFGenerator, text: string, indent: number = 0) {
  const { doc, margin, pageWidth, pageHeight } = pdf;
  const maxWidth = pageWidth - (margin * 2) - 20 - indent;
  
  if (pdf.currentY > pageHeight - 60) {
    addNewPage(pdf);
    drawPageHeader(pdf);
  }
  
  // Bullet
  doc.setFillColor(0, 214, 143);
  doc.circle(margin + indent + 5, pdf.currentY - 4, 2.5, 'F');
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  
  const lines = doc.splitTextToSize(text, maxWidth);
  lines.forEach((line: string, i: number) => {
    doc.text(line, margin + indent + 15, pdf.currentY + (i * 15));
  });
  pdf.currentY += lines.length * 15 + 6;
}

function addKeyConceptBox(pdf: PDFGenerator, title: string, content: string) {
  const { doc, margin, pageWidth, pageHeight } = pdf;
  const boxWidth = pageWidth - (margin * 2);
  
  if (pdf.currentY > pageHeight - 120) {
    addNewPage(pdf);
    drawPageHeader(pdf);
  }
  
  // Calculate height needed
  doc.setFontSize(10);
  const contentLines = doc.splitTextToSize(content, boxWidth - 30);
  const boxHeight = 35 + (contentLines.length * 14);
  
  // Box background
  doc.setFillColor(240, 253, 249);
  doc.roundedRect(margin, pdf.currentY, boxWidth, boxHeight, 4, 4, 'F');
  
  // Left accent
  doc.setFillColor(0, 214, 143);
  doc.rect(margin, pdf.currentY, 4, boxHeight, 'F');
  
  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 150, 100);
  doc.text(title, margin + 15, pdf.currentY + 18);
  
  // Content
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  contentLines.forEach((line: string, i: number) => {
    doc.text(line, margin + 15, pdf.currentY + 32 + (i * 14));
  });
  
  pdf.currentY += boxHeight + 16;
}

function addWarningBox(pdf: PDFGenerator, title: string, content: string) {
  const { doc, margin, pageWidth, pageHeight } = pdf;
  const boxWidth = pageWidth - (margin * 2);
  
  if (pdf.currentY > pageHeight - 120) {
    addNewPage(pdf);
    drawPageHeader(pdf);
  }
  
  doc.setFontSize(10);
  const contentLines = doc.splitTextToSize(content, boxWidth - 30);
  const boxHeight = 35 + (contentLines.length * 14);
  
  // Box background - amber tint
  doc.setFillColor(255, 251, 235);
  doc.roundedRect(margin, pdf.currentY, boxWidth, boxHeight, 4, 4, 'F');
  
  // Left accent - amber
  doc.setFillColor(245, 158, 11);
  doc.rect(margin, pdf.currentY, 4, boxHeight, 'F');
  
  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(180, 100, 0);
  doc.text(title, margin + 15, pdf.currentY + 18);
  
  // Content
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 50, 40);
  contentLines.forEach((line: string, i: number) => {
    doc.text(line, margin + 15, pdf.currentY + 32 + (i * 14));
  });
  
  pdf.currentY += boxHeight + 16;
}

function addRuleBox(pdf: PDFGenerator, content: string) {
  const { doc, margin, pageWidth, pageHeight } = pdf;
  const boxWidth = pageWidth - (margin * 2);
  
  if (pdf.currentY > pageHeight - 100) {
    addNewPage(pdf);
    drawPageHeader(pdf);
  }
  
  doc.setFontSize(10);
  const contentLines = doc.splitTextToSize(content, boxWidth - 30);
  const boxHeight = 35 + (contentLines.length * 14);
  
  // Box background - red tint
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(margin, pdf.currentY, boxWidth, boxHeight, 4, 4, 'F');
  
  // Left accent - red
  doc.setFillColor(239, 68, 68);
  doc.rect(margin, pdf.currentY, 4, boxHeight, 'F');
  
  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(180, 50, 50);
  doc.text('RULE', margin + 15, pdf.currentY + 18);
  
  // Content
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 40, 40);
  contentLines.forEach((line: string, i: number) => {
    doc.text(line, margin + 15, pdf.currentY + 32 + (i * 14));
  });
  
  pdf.currentY += boxHeight + 16;
}

function addTable(pdf: PDFGenerator, headers: string[], rows: string[][], colWidths?: number[]) {
  const { doc, margin, pageWidth, pageHeight } = pdf;
  const tableWidth = pageWidth - (margin * 2);
  const numCols = headers.length;
  const defaultColWidth = tableWidth / numCols;
  const widths = colWidths || headers.map(() => defaultColWidth);
  const rowHeight = 28;
  
  if (pdf.currentY > pageHeight - 100) {
    addNewPage(pdf);
    drawPageHeader(pdf);
  }
  
  // Header row
  doc.setFillColor(7, 12, 17);
  doc.rect(margin, pdf.currentY, tableWidth, rowHeight, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 214, 143);
  
  let xPos = margin + 8;
  headers.forEach((header, i) => {
    doc.text(header, xPos, pdf.currentY + 18);
    xPos += widths[i];
  });
  pdf.currentY += rowHeight;
  
  // Data rows
  rows.forEach((row, rowIndex) => {
    if (pdf.currentY > pageHeight - 60) {
      addNewPage(pdf);
      drawPageHeader(pdf);
      // Redraw header
      doc.setFillColor(7, 12, 17);
      doc.rect(margin, pdf.currentY, tableWidth, rowHeight, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(0, 214, 143);
      let headerX = margin + 8;
      headers.forEach((header, i) => {
        doc.text(header, headerX, pdf.currentY + 18);
        headerX += widths[i];
      });
      pdf.currentY += rowHeight;
    }
    
    // Alternating row colors
    doc.setFillColor(rowIndex % 2 === 0 ? 250 : 245, rowIndex % 2 === 0 ? 250 : 245, rowIndex % 2 === 0 ? 250 : 245);
    doc.rect(margin, pdf.currentY, tableWidth, rowHeight, 'F');
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    
    xPos = margin + 8;
    row.forEach((cell, i) => {
      const cellLines = doc.splitTextToSize(cell, widths[i] - 16);
      doc.text(cellLines[0] || '', xPos, pdf.currentY + 18);
      xPos += widths[i];
    });
    pdf.currentY += rowHeight;
  });
  
  // Table border
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(margin, pdf.currentY - (rows.length + 1) * rowHeight, tableWidth, (rows.length + 1) * rowHeight);
  
  pdf.currentY += 16;
}

function addSpacer(pdf: PDFGenerator, height: number = 20) {
  pdf.currentY += height;
}

// ==================== COVER PAGE ====================
function createCoverPage(pdf: PDFGenerator) {
  const { doc, pageWidth, pageHeight } = pdf;
  
  // Full dark background
  doc.setFillColor(7, 12, 17);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Accent lines
  doc.setFillColor(0, 214, 143);
  doc.rect(0, 0, pageWidth, 6, 'F');
  doc.rect(0, pageHeight - 6, pageWidth, 6, 'F');
  
  // Grid pattern (subtle)
  doc.setDrawColor(20, 35, 50);
  doc.setLineWidth(0.3);
  for (let x = 50; x < pageWidth - 50; x += 30) {
    doc.line(x, 100, x, pageHeight - 100);
  }
  for (let y = 100; y < pageHeight - 100; y += 30) {
    doc.line(50, y, pageWidth - 50, y);
  }
  
  // Title block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 214, 143);
  doc.text('THE SESSION METHOD', pageWidth / 2, 200, { align: 'center' });
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(56);
  doc.setTextColor(255, 255, 255);
  doc.text('THE SESSION', pageWidth / 2, 280, { align: 'center' });
  
  doc.setFontSize(56);
  doc.setTextColor(0, 214, 143);
  doc.text('BLUEPRINT', pageWidth / 2, 340, { align: 'center' });
  
  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(150, 170, 190);
  doc.text('The Complete Institutional Trading System', pageWidth / 2, 400, { align: 'center' });
  doc.text('for Consistent Futures Profits', pageWidth / 2, 420, { align: 'center' });
  
  // Feature badges
  const badges = [
    'INSTITUTIONAL ORDER FLOW',
    'LIQUIDITY SWEEP MASTERY',
    '60%+ WIN RATE SYSTEM',
  ];
  
  let badgeY = 480;
  badges.forEach((badge) => {
    doc.setFillColor(0, 214, 143, 0.15);
    const badgeWidth = doc.getTextWidth(badge) + 40;
    doc.roundedRect((pageWidth - badgeWidth) / 2, badgeY - 12, badgeWidth, 24, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 214, 143);
    doc.text(badge, pageWidth / 2, badgeY + 4, { align: 'center' });
    badgeY += 36;
  });
  
  // Compatible instruments
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 120, 140);
  doc.text('COMPATIBLE INSTRUMENTS', pageWidth / 2, 620, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(150, 170, 190);
  doc.text('/MES  |  /MNQ  |  /MGC  |  /MCL  |  /6E  |  EUR/USD  |  GBP/USD  |  /NQ  |  /ES  |  /SIL', pageWidth / 2, 640, { align: 'center' });
  
  // Version info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 100, 120);
  doc.text('© 2026 The Session Method. All Rights Reserved.', pageWidth / 2, pageHeight - 60, { align: 'center' });
  doc.text('Version 1.0  |  Premium Edition', pageWidth / 2, pageHeight - 45, { align: 'center' });
}

// ==================== CREDIBILITY PAGE ====================
function createCredibilityPage(pdf: PDFGenerator) {
  addNewPage(pdf);
  drawPageHeader(pdf);
  
  addTitle(pdf, 'Why This System Works');
  addSpacer(pdf, 10);
  
  addParagraph(pdf, 'The Session Blueprint is not another indicator-based trading system that promises unrealistic results. This is a complete institutional-grade methodology built on the actual mechanics of how markets move.');
  
  addSpacer(pdf, 10);
  addSubtitle(pdf, 'Built on Real Market Structure');
  addParagraph(pdf, 'Every concept in this workbook is derived from how institutional traders actually operate. Banks, hedge funds, and market makers cannot fill their large orders at a single price without moving the market against themselves. They engineer moves to areas where retail traders have placed their stops, fill their orders, and then let price move in their intended direction.');
  
  addSpacer(pdf, 10);
  addSubtitle(pdf, 'What Makes This Different');
  
  addBulletPoint(pdf, 'No indicator dependency - You will learn to read raw price action and order flow');
  addBulletPoint(pdf, 'Conservative risk management - Designed to keep you in the game long enough to succeed');
  addBulletPoint(pdf, 'Session-based approach - Trade when institutional volume creates the best opportunities');
  addBulletPoint(pdf, 'DOM integration - See where real orders are, not just where price has been');
  addBulletPoint(pdf, 'Psychology framework - Address the real reason 95% of traders fail');
  
  addSpacer(pdf, 20);
  addKeyConceptBox(pdf, 'THE FOUNDATION', 'This system targets a 60-65% win rate with 1:1.5 minimum risk:reward. This is mathematically proven to be profitable over time. We do not chase 90% win rates with terrible risk:reward - that is how accounts get destroyed.');
  
  drawPageFooter(pdf, 2);
}

// ==================== VALUE PROPOSITION PAGE ====================
function createValuePage(pdf: PDFGenerator) {
  addNewPage(pdf);
  drawPageHeader(pdf);
  
  addTitle(pdf, 'What You Are Getting');
  addSpacer(pdf, 10);
  
  const valueItems = [
    ['Complete Trading System', '$2,500+ Value', 'The full institutional order flow methodology used by professional traders'],
    ['15 In-Depth Modules', '$1,500+ Value', 'From foundation concepts to advanced multi-timeframe analysis'],
    ['Level Marking Framework', '$500+ Value', 'The exact pre-market ritual that identifies high-probability zones'],
    ['Confluence Entry System', '$750+ Value', 'Four-factor verification eliminates low-probability trades'],
    ['DOM Reading Mastery', '$800+ Value', 'See where real institutional orders are hiding'],
    ['Risk Management Rules', '$500+ Value', 'Position sizing and daily limits that protect your capital'],
    ['Psychology Framework', '$400+ Value', 'The mental models that separate winners from losers'],
    ['Daily Trade Journal', '$300+ Value', 'The exact template professionals use to track improvement'],
    ['180-Day Development Plan', '$250+ Value', 'Your roadmap from beginner to consistent profitability'],
    ['Exercise & Assessment', '$200+ Value', 'Self-evaluation tools to verify your readiness'],
  ];
  
  addTable(pdf, ['Component', 'Value', 'Description'], valueItems, [150, 80, 282]);
  
  addSpacer(pdf, 20);
  
  // Total value box
  const { doc, margin, pageWidth } = pdf;
  const boxWidth = pageWidth - (margin * 2);
  
  doc.setFillColor(7, 12, 17);
  doc.roundedRect(margin, pdf.currentY, boxWidth, 80, 6, 6, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(150, 170, 190);
  doc.text('TOTAL VALUE:', margin + 20, pdf.currentY + 35);
  
  doc.setFontSize(32);
  doc.setTextColor(0, 214, 143);
  doc.text('$7,700+', margin + 150, pdf.currentY + 40);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(150, 170, 190);
  doc.text('Your Investment: $47', margin + 20, pdf.currentY + 60);
  
  pdf.currentY += 100;
  
  drawPageFooter(pdf, 3);
}

// ==================== COPYRIGHT PAGE ====================
function createCopyrightPage(pdf: PDFGenerator) {
  addNewPage(pdf);
  drawPageHeader(pdf);
  
  addTitle(pdf, 'Copyright & Legal Notice');
  addSpacer(pdf, 10);
  
  addParagraph(pdf, '© 2026 The Session Method. All Rights Reserved.');
  addParagraph(pdf, 'This digital product — including all text, charts, illustrations, frameworks, systems, checklists, tables, and methodologies contained within — is the exclusive intellectual property of The Session Method.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'What You Are Permitted To Do');
  addBulletPoint(pdf, 'Use this workbook for your own personal trading education and development');
  addBulletPoint(pdf, 'Reference the concepts and strategies in your own trading practice');
  addBulletPoint(pdf, 'Print one personal copy for your own study use');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'What Is Strictly Prohibited');
  addBulletPoint(pdf, 'Reselling, redistributing, or sharing this workbook in any form — digital or physical');
  addBulletPoint(pdf, 'Reproducing or copying any portion of this material for commercial use');
  addBulletPoint(pdf, 'Uploading to any file-sharing platform, course platform, or public server');
  addBulletPoint(pdf, 'Teaching or presenting these materials as your own work or methodology');
  addBulletPoint(pdf, 'Removing, obscuring, or altering any copyright notices or branding');
  addBulletPoint(pdf, 'Incorporating any portion of this workbook into another product or course');
  addBulletPoint(pdf, 'Translating or adapting this material for any commercial purpose');
  
  addSpacer(pdf, 15);
  addRuleBox(pdf, 'Violation of these terms constitutes copyright infringement and will be pursued to the full extent of applicable law. All purchases are tracked and logged. Unauthorized distribution will result in immediate legal action.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Disclaimer');
  addParagraph(pdf, 'Trading futures, forex, and other financial instruments involves substantial risk of loss. The strategies, concepts, and systems presented in this workbook are for educational purposes only. Past results are not indicative of future performance. The Session Method and its creators are not registered investment advisors and nothing in this workbook constitutes financial advice. You are solely responsible for your own trading decisions and outcomes. Only trade with capital you can afford to lose.');
  
  drawPageFooter(pdf, 4);
}

// ==================== TABLE OF CONTENTS ====================
function createTableOfContents(pdf: PDFGenerator) {
  addNewPage(pdf);
  drawPageHeader(pdf);
  
  addTitle(pdf, 'Table of Contents');
  addSpacer(pdf, 20);
  
  const tocItems = [
    ['Why This System Works', '2'],
    ['What You Are Getting', '3'],
    ['Copyright & Legal Notice', '4'],
    ['MODULE 1 — Understanding the Foundation', '6'],
    ['MODULE 2 — Compatible Instruments', '8'],
    ['MODULE 3 — The Three Sessions', '10'],
    ['MODULE 4 — Level Marking — Your Pre-Market Ritual', '13'],
    ['MODULE 5 — The Complete Confluence Entry System', '16'],
    ['MODULE 6 — Liquidity Sweep Zones Mastery', '20'],
    ['MODULE 7 — Price Action & Candle Reading', '24'],
    ['MODULE 8 — Depth of Market (DOM) Mastery', '28'],
    ['MODULE 9 — Trade Management Rules', '31'],
    ['MODULE 10 — Risk Management & Position Sizing', '34'],
    ['MODULE 11 — Trading Psychology & Discipline', '37'],
    ['MODULE 12 — The Daily Routine', '41'],
    ['MODULE 13 — Advanced Concepts', '44'],
    ['MODULE 14 — Daily Trade Journal Template', '49'],
    ['MODULE 15 — Exercises & Self-Assessment', '52'],
    ['Quick Reference Cards', '56'],
    ['Closing Statement', '58'],
  ];
  
  const { doc, margin, pageWidth } = pdf;
  
  tocItems.forEach((item, index) => {
    const isModule = item[0].startsWith('MODULE');
    
    doc.setFont('helvetica', isModule ? 'bold' : 'normal');
    doc.setFontSize(11);
    doc.setTextColor(isModule ? 26 : 80, isModule ? 26 : 80, isModule ? 26 : 80);
    
    // Title
    doc.text(item[0], margin + (isModule ? 0 : 15), pdf.currentY);
    
    // Page number
    doc.text(item[1], pageWidth - margin, pdf.currentY, { align: 'right' });
    
    // Dotted line
    doc.setDrawColor(200, 200, 200);
    doc.setLineDashPattern([2, 2], 0);
    const titleWidth = doc.getTextWidth(item[0]);
    const pageNumWidth = doc.getTextWidth(item[1]);
    doc.line(margin + (isModule ? 0 : 15) + titleWidth + 10, pdf.currentY - 3, pageWidth - margin - pageNumWidth - 10, pdf.currentY - 3);
    doc.setLineDashPattern([], 0);
    
    pdf.currentY += 22;
  });
  
  drawPageFooter(pdf, 5);
}

// ==================== MODULE 1: Foundation ====================
function createModule1(pdf: PDFGenerator) {
  addNewPage(pdf);
  drawPageHeader(pdf, 1, 'Understanding the Foundation');
  
  addTitle(pdf, 'MODULE 1');
  pdf.doc.setFont('helvetica', 'normal');
  pdf.doc.setFontSize(14);
  pdf.doc.setTextColor(100, 100, 100);
  pdf.doc.text('Understanding the Foundation', pdf.margin, pdf.currentY);
  pdf.currentY += 25;
  
  addParagraph(pdf, 'The principles that make this system work on any market');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '1.1 The Core Philosophy');
  addParagraph(pdf, 'The futures market is not random. Every significant price move is deliberate. Institutions — banks, hedge funds, and market makers — cannot fill their large orders at a single price without moving the market against themselves. So they engineer moves to areas where retail traders have placed their stop orders, fill their institutional orders against those stops, and then let price move in their intended direction.');
  
  addKeyConceptBox(pdf, 'KEY CONCEPT', 'Your entire job as a retail trader is to stop thinking like a retail trader and start identifying where institutions are likely to engineer their next liquidity hunt. This system gives you the exact framework to do that.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '1.2 Why This System Targets 60%+ Win Rate');
  addParagraph(pdf, 'Most retail traders chase win rates of 80-90% and end up with terrible risk:reward ratios. This system is engineered differently:');
  
  addTable(pdf, ['Target Metric', 'This System\'s Approach', 'Why It Works'], [
    ['Win Rate', '60-65% with proper execution', 'Sustainable. Achievable. Leaves room for mistakes.'],
    ['Risk:Reward', 'Minimum 1:1.5, target 1:2+', 'Even at 50% win rate you are profitable at 1:2 R:R.'],
    ['Stop Loss', 'Defined before every entry', 'Eliminates catastrophic losses that destroy accounts.'],
    ['Entry Timing', 'Candle close confirmation only', 'Eliminates premature entries — the #1 cause of losing trades.'],
    ['Max Daily Loss', 'Hard stop at defined limit', 'Protects the account on bad days. Tomorrow always comes.'],
  ], [130, 180, 202]);
  
  drawPageFooter(pdf, 6);
  
  // Page 2 of Module 1
  addNewPage(pdf);
  drawPageHeader(pdf, 1, 'Understanding the Foundation');
  
  addSubtitle(pdf, '1.3 The Four Pillars');
  addParagraph(pdf, 'Everything in this system is built on four foundational pillars. Master each one and the system becomes second nature.');
  
  addTable(pdf, ['Pillar', 'Definition', 'Your Tool'], [
    ['Structure', 'Knowing where price has been and the levels that matter', 'Session levels, PDH/PDL, trendlines, volume profile'],
    ['Confluence', 'Multiple signals agreeing on the same trade direction', 'MA stack, level touch, candle rejection, DOM absorption'],
    ['Precision', 'Tight entries with defined risk — every single time', 'Rejection candle trigger, stop beyond the wick'],
    ['Discipline', 'Executing the rules without deviation', 'Pre-trade checklist, daily journal, two-loss rule'],
  ], [100, 206, 206]);
  
  addSpacer(pdf, 20);
  addKeyConceptBox(pdf, 'IMPORTANT', 'These four pillars are not optional components — they are the complete framework. A trade that has structure but lacks confluence is speculation. A trade with confluence but without precision is sloppy. A trade with everything except discipline is gambling. All four must be present.');
  
  drawPageFooter(pdf, 7);
}

// ==================== MODULE 2: Compatible Instruments ====================
function createModule2(pdf: PDFGenerator) {
  addNewPage(pdf);
  drawPageHeader(pdf, 2, 'Compatible Instruments');
  
  addTitle(pdf, 'MODULE 2');
  pdf.doc.setFont('helvetica', 'normal');
  pdf.doc.setFontSize(14);
  pdf.doc.setTextColor(100, 100, 100);
  pdf.doc.text('Compatible Instruments', pdf.margin, pdf.currentY);
  pdf.currentY += 25;
  
  addParagraph(pdf, 'This system works wherever institutions create liquidity sweeps');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '2.1 Why This System Is Instrument-Agnostic');
  addParagraph(pdf, 'The Session Blueprint is built on institutional behavior, not instrument-specific quirks. Institutions move ALL liquid markets the same way — engineer moves to liquidity zones, fill orders, reverse. The sessions, the sweep patterns, the MA confluence, and the DOM signals appear on every instrument below.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '2.2 Futures — Primary Recommended Instruments');
  
  addTable(pdf, ['Instrument', 'Symbol', 'Tick Value', 'Best Session', 'Volatility'], [
    ['Micro E-Mini S&P 500', '/MES', '$1.25/tick', 'NY Open (8:30 CT)', 'Medium — clean setups'],
    ['Micro Nasdaq-100', '/MNQ', '$0.50/tick', 'NY Open (8:30 CT)', 'High — fast moves'],
    ['Micro Gold', '/MGC', '$1.00/tick', 'London + NY', 'Medium — level respect'],
    ['Micro Crude Oil', '/MCL', '$1.00/tick', 'NY Open + 9:30 CT', 'High — news sensitive'],
    ['Micro Silver', '/SIL', '$1.00/tick', 'London + NY', 'High — tracks gold'],
    ['E-Mini S&P 500', '/ES', '$12.50/tick', 'NY Open', 'Medium — most liquid'],
    ['E-Mini Nasdaq', '/NQ', '$5.00/tick', 'NY Open', 'High — for scaled traders'],
    ['Euro FX Futures', '/6E', '$12.50/tick', 'London session', 'Medium — forex precision'],
  ], [120, 60, 75, 100, 157]);
  
  drawPageFooter(pdf, 8);
  
  // Page 2 of Module 2
  addNewPage(pdf);
  drawPageHeader(pdf, 2, 'Compatible Instruments');
  
  addSubtitle(pdf, '2.3 Forex — Secondary Application');
  
  addTable(pdf, ['Pair', 'Best Session', 'Why It Works', 'Notes'], [
    ['EUR/USD', 'London + NY Overlap (2-4AM CT)', 'Most liquid forex pair. Session sweeps are textbook.', 'Tightest spreads. Best for learning.'],
    ['GBP/USD', 'London session', 'London\'s own currency — moves hard during London open.', 'More volatile. Wider stops needed.'],
    ['XAU/USD (Spot Gold)', 'London + NY', 'Same structure as /MGC but on forex platforms.', 'Great alternative to futures gold.'],
    ['USD/JPY', 'Asian + London open', 'Asian session creates excellent range for London sweeps.', 'Watch for BOJ intervention risk.'],
  ], [80, 130, 160, 142]);
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '2.4 What Changes Per Instrument — Adjustment Guide');
  
  addTable(pdf, ['Variable', 'What to Adjust', 'Example'], [
    ['Stop loss size', 'Each instrument has different average volatility. Wider stops for high-volatility instruments.', '/MNQ may need 15-tick stops vs /MGC\'s 10-tick max.'],
    ['Session timing', 'Some instruments react more to specific sessions based on their geography.', '/6E (Euro) has its strongest setups during London open.'],
    ['News sensitivity', '/MCL reacts violently to oil inventory reports. /MES reacts to Fed data.', 'Check economic calendar for instrument-specific events.'],
    ['Tick calculation', 'Recalculate your risk formula for each instrument\'s tick value.', '/MES at 4 ticks = $5 risk vs /MGC at 4 ticks = $4 risk.'],
    ['DOM behavior', 'Higher-volume instruments like /ES and /NQ have more DOM activity.', 'Practice DOM reading on each new instrument before live.'],
  ], [100, 206, 206]);
  
  addSpacer(pdf, 15);
  addWarningBox(pdf, 'IMPORTANT', 'Master one instrument completely before adding another. The system is the same but each market has its own personality — its own average range, its own reaction speed, its own sensitivity to news. Spend 30+ days on your primary instrument before expanding.');
  
  drawPageFooter(pdf, 9);
}

// ==================== MODULE 3: Three Sessions ====================
function createModule3(pdf: PDFGenerator) {
  addNewPage(pdf);
  drawPageHeader(pdf, 3, 'The Three Sessions');
  
  addTitle(pdf, 'MODULE 3');
  pdf.doc.setFont('helvetica', 'normal');
  pdf.doc.setFontSize(14);
  pdf.doc.setTextColor(100, 100, 100);
  pdf.doc.text('The Three Sessions', pdf.margin, pdf.currentY);
  pdf.currentY += 25;
  
  addParagraph(pdf, 'How institutional behavior patterns repeat every single day');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '3.1 Why Sessions Create Your Edge');
  addParagraph(pdf, 'The futures market runs nearly 24 hours but not all hours are equal. Each session has distinct participants, distinct volume profiles, and distinct behavioral patterns. The relationship between sessions is what creates the sweep setups that power this system.');
  
  addParagraph(pdf, 'The pattern that repeats almost every trading day: Asian session creates the range. London hunts the Asian range to grab liquidity. New York either confirms the London reversal or creates a new setup.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '3.2 Session Breakdown (All Times CT)');
  
  addTable(pdf, ['Session', 'CT Time', 'Personality', 'Your Action'], [
    ['Asian', '6:00 PM – 12:00 AM', 'Low volume. Tight range. Sets the overnight boundaries.', 'Mark Asian High and Asian Low. These become London\'s targets.'],
    ['London', '2:00 AM – 7:00 AM', 'High volatility. Hunts Asian range liquidity. Often makes the day\'s high or low.', 'Watch for sweeps of Asian levels. The reversal is your setup.'],
    ['New York', '8:00 AM – 12:00 PM CT', 'Highest volume. Most reliable setups. Confirms or reverses London.', 'Prime trading window. Best confluence entries. Most profitable.'],
    ['NY Afternoon', '12:00 PM – 4:00 PM CT', 'Lower volume. More chop. Lower probability.', 'Reduce size or stop entirely. Default is no new positions after noon.'],
  ], [80, 100, 166, 166]);
  
  drawPageFooter(pdf, 10);
  
  // Page 2 of Module 3
  addNewPage(pdf);
  drawPageHeader(pdf, 3, 'The Three Sessions');
  
  addSubtitle(pdf, '3.3 The Session Level Priority Hierarchy');
  addParagraph(pdf, 'Not all levels are created equal. This hierarchy tells you which levels to prioritize when multiple are nearby:');
  
  addTable(pdf, ['Priority', 'Level', 'Source', 'How to Use'], [
    ['1st — Highest', 'Previous Day High (PDH)', 'Yesterday\'s NY session high', 'Primary target on longs. Primary short rejection zone.'],
    ['1st — Highest', 'Previous Day Low (PDL)', 'Yesterday\'s NY session low', 'Primary target on shorts. Primary long rejection zone.'],
    ['2nd', 'Overnight High', 'Highest point Asian + London combined', 'Short entry on sweep and failure to hold.'],
    ['2nd', 'Overnight Low', 'Lowest point Asian + London combined', 'Long entry on sweep and hold — classic setup.'],
    ['3rd', 'Asian High / Low', '6PM–12AM session extremes', 'London sweep targets. False breaks here = reversal setups.'],
    ['3rd', 'Current Session H/L', 'Developing in real time', 'Dynamic support/resistance as session progresses.'],
  ], [90, 110, 150, 162]);
  
  addSpacer(pdf, 15);
  addKeyConceptBox(pdf, 'PRO TIP', 'Your best trade of the day often comes when New York opens and CONFIRMS the London reversal. If London swept below the Asian Low and reversed up, and New York opens and holds above that London Low — that is your long setup with two full sessions of confirmation behind it.');
  
  addSpacer(pdf, 20);
  addSubtitle(pdf, '3.4 Session Transition Patterns');
  addParagraph(pdf, 'The most predictable patterns occur at session transitions:');
  
  addBulletPoint(pdf, 'Asian to London: London typically hunts one side of the Asian range first');
  addBulletPoint(pdf, 'London to New York: NY either continues the London direction or creates a complete reversal');
  addBulletPoint(pdf, 'NY to Asian: Asian typically consolidates within NY\'s range, setting up the next cycle');
  
  drawPageFooter(pdf, 11);
  
  // Page 3 of Module 3
  addNewPage(pdf);
  drawPageHeader(pdf, 3, 'The Three Sessions');
  
  addSubtitle(pdf, '3.5 Session Timing Quick Reference');
  
  addTable(pdf, ['Event', 'CT Time', 'Significance'], [
    ['Asian Session Open', '6:00 PM', 'Range building begins'],
    ['Asian Session Close', '12:00 AM', 'Asian range complete — mark H/L'],
    ['London Session Open', '2:00 AM', 'First major liquidity sweep opportunity'],
    ['London/NY Overlap Start', '7:00 AM', 'Highest liquidity period begins'],
    ['NY Pre-Market', '8:00 AM', 'Watch for level tests before main session'],
    ['NY Main Session Open', '8:30 AM', 'Primary trading window begins'],
    ['Prime Trading Window', '8:45 AM - 11:30 AM', 'Best probability setups occur here'],
    ['NY Lunch', '11:30 AM - 1:00 PM', 'Reduced activity — caution advised'],
    ['NY Afternoon', '1:00 PM - 4:00 PM', 'Lower probability — consider stopping'],
  ], [150, 100, 262]);
  
  addSpacer(pdf, 15);
  addRuleBox(pdf, 'Your trading day should be focused on the NY session from 8:45 AM to 11:30 AM CT. This is when institutional activity is highest and setups are most reliable. Trading outside this window increases your exposure to low-probability environments.');
  
  drawPageFooter(pdf, 12);
}

// ==================== MODULE 4: Level Marking ====================
function createModule4(pdf: PDFGenerator) {
  addNewPage(pdf);
  drawPageHeader(pdf, 4, 'Level Marking');
  
  addTitle(pdf, 'MODULE 4');
  pdf.doc.setFont('helvetica', 'normal');
  pdf.doc.setFontSize(14);
  pdf.doc.setTextColor(100, 100, 100);
  pdf.doc.text('Level Marking — Your Pre-Market Ritual', pdf.margin, pdf.currentY);
  pdf.currentY += 25;
  
  addParagraph(pdf, 'The foundation of every trading day');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '4.1 Why You Mark Levels Before the Session');
  addParagraph(pdf, 'Trading without pre-marked levels means making high-stakes decisions in real time under pressure with no reference points. That leads to emotional, reactive decisions. Marking levels before the open means your analysis was done when you were calm and objective — before the market was moving and before adrenaline was compromising your judgment.');
  
  addRuleBox(pdf, 'You do not analyze during the trade. Analysis happens before the session. During the trade, you only execute what you already planned.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '4.2 The Pre-Market Level Marking Ritual');
  addParagraph(pdf, 'Complete these steps every morning before the session opens:');
  
  addBulletPoint(pdf, 'Switch to 5-minute timeframe on your primary instrument');
  addBulletPoint(pdf, 'Draw horizontal line at Previous Day High (PDH) — RED, solid');
  addBulletPoint(pdf, 'Draw horizontal line at Previous Day Low (PDL) — BLUE, solid');
  addBulletPoint(pdf, 'Draw horizontal line at Previous Day Close — GRAY, dashed');
  addBulletPoint(pdf, 'Identify and mark Overnight High — ORANGE, dashed');
  addBulletPoint(pdf, 'Identify and mark Overnight Low — ORANGE, dashed');
  addBulletPoint(pdf, 'Note where the 200 MA is sitting — this is your macro bias line');
  addBulletPoint(pdf, 'Draw the dominant diagonal trendline off recent swing highs or lows');
  addBulletPoint(pdf, 'Identify the Volume Profile POC and Value Area High/Low');
  addBulletPoint(pdf, 'Write your bias: Long / Short / Neutral + three supporting reasons');
  
  drawPageFooter(pdf, 13);
  
  // Page 2 of Module 4
  addNewPage(pdf);
  drawPageHeader(pdf, 4, 'Level Marking');
  
  addSubtitle(pdf, '4.3 Volume Profile — Reading the Histogram');
  addParagraph(pdf, 'Volume profile shows you WHERE price traded the most volume — not just when. This reveals institutional positioning:');
  
  addTable(pdf, ['Component', 'Definition', 'How to Trade It'], [
    ['Point of Control (POC)', 'Price level with the most volume traded. The longest bar.', 'Price gravitates here. Expect chop. Avoid entries at POC.'],
    ['High Volume Node (HVN)', 'Area of heavy historical volume — multiple long bars.', 'Price slows here. Use as a target, not an entry zone.'],
    ['Low Volume Node (LVN)', 'Area of very little volume — thin part of histogram.', 'Price moves FAST through LVNs. Enter here for quick momentum.'],
    ['Value Area High (VAH)', 'Upper boundary of where 70% of volume occurred.', 'Strong resistance. Short entries near, long targets from below.'],
    ['Value Area Low (VAL)', 'Lower boundary of where 70% of volume occurred.', 'Strong support. Long entries near, short targets from above.'],
  ], [130, 200, 182]);
  
  addSpacer(pdf, 15);
  addKeyConceptBox(pdf, 'KEY CONCEPT', 'Your ideal entry is in a Low Volume Node targeting a High Volume Node or POC. You get fast movement to your target with minimal friction. Entering inside a High Volume Node means price immediately slows after entry — that is why mid-value-area entries are low probability.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '4.4 Level Color Coding System');
  
  addTable(pdf, ['Level Type', 'Color', 'Line Style', 'Priority'], [
    ['Previous Day High (PDH)', 'RED', 'Solid, thick', 'Highest'],
    ['Previous Day Low (PDL)', 'BLUE', 'Solid, thick', 'Highest'],
    ['Previous Day Close', 'GRAY', 'Dashed', 'Medium'],
    ['Overnight High', 'ORANGE', 'Dashed', 'High'],
    ['Overnight Low', 'ORANGE', 'Dashed', 'High'],
    ['Value Area High (VAH)', 'PURPLE', 'Dotted', 'Medium'],
    ['Value Area Low (VAL)', 'PURPLE', 'Dotted', 'Medium'],
    ['200 MA', 'WHITE', 'Solid', 'Bias indicator'],
  ], [150, 100, 130, 132]);
  
  drawPageFooter(pdf, 14);
  
  // Page 3 of Module 4
  addNewPage(pdf);
  drawPageHeader(pdf, 4, 'Level Marking');
  
  addSubtitle(pdf, '4.5 Pre-Market Checklist');
  addParagraph(pdf, 'Complete this checklist before every trading session. Do not trade until all items are checked:');
  
  addTable(pdf, ['Item', 'Status', 'Notes'], [
    ['PDH marked', '[ ]', ''],
    ['PDL marked', '[ ]', ''],
    ['Previous Day Close marked', '[ ]', ''],
    ['Overnight High marked', '[ ]', ''],
    ['Overnight Low marked', '[ ]', ''],
    ['200 MA location noted', '[ ]', ''],
    ['Volume Profile POC identified', '[ ]', ''],
    ['VAH/VAL identified', '[ ]', ''],
    ['Dominant trendline drawn', '[ ]', ''],
    ['Session bias determined', '[ ]', ''],
    ['Three reasons for bias written', '[ ]', ''],
    ['Economic calendar checked', '[ ]', ''],
    ['Mental state assessed', '[ ]', ''],
  ], [220, 60, 232]);
  
  addSpacer(pdf, 15);
  addWarningBox(pdf, 'WARNING', 'Skipping the pre-market ritual is one of the most common causes of losing trades. It takes 15-20 minutes to do properly. If you do not have time for the ritual, you do not have time to trade that day. Come back tomorrow.');
  
  drawPageFooter(pdf, 15);
}

// ==================== MODULE 5: Confluence Entry System ====================
function createModule5(pdf: PDFGenerator) {
  addNewPage(pdf);
  drawPageHeader(pdf, 5, 'Confluence Entry System');
  
  addTitle(pdf, 'MODULE 5');
  pdf.doc.setFont('helvetica', 'normal');
  pdf.doc.setFontSize(14);
  pdf.doc.setTextColor(100, 100, 100);
  pdf.doc.text('The Complete Confluence Entry System', pdf.margin, pdf.currentY);
  pdf.currentY += 25;
  
  addParagraph(pdf, 'Every factor you need — and the exact trigger to pull');
  
  addSpacer(pdf, 10);
  addSubtitle(pdf, '5.1 The Four Confluence Factors');
  addParagraph(pdf, 'No single indicator confirms a trade. This system requires a minimum of 3 out of 4 confluence factors before any entry is allowed. This one rule eliminates the majority of low-probability setups.');
  
  addSpacer(pdf, 10);
  pdf.doc.setFont('helvetica', 'bold');
  pdf.doc.setFontSize(12);
  pdf.doc.setTextColor(0, 214, 143);
  pdf.doc.text('Factor 1 — MA Stack (Directional Bias)', pdf.margin, pdf.currentY);
  pdf.currentY += 20;
  
  addParagraph(pdf, 'The 8 MA must be positioned correctly relative to the 20 and 50 MA. This shows you the short-term trend direction:');
  
  addTable(pdf, ['Direction', 'Required Stack', '200 MA Filter'], [
    ['LONG', '8 MA above 20 MA, 20 MA above 50 MA. All ascending.', 'Price above 200 MA = strong long bias. Below = extra confluence required.'],
    ['SHORT', '8 MA below 20 MA, 20 MA below 50 MA. All descending.', 'Price below 200 MA = strong short bias. Above = extra confluence required.'],
    ['NO TRADE', 'MAs tangled, crossing, within 3 ticks of each other.', 'Consolidation zone. No edge in either direction. Stand aside.'],
  ], [80, 230, 202]);
  
  addSpacer(pdf, 15);
  pdf.doc.setFont('helvetica', 'bold');
  pdf.doc.setFontSize(12);
  pdf.doc.setTextColor(0, 214, 143);
  pdf.doc.text('Factor 2 — Key Level Touch', pdf.margin, pdf.currentY);
  pdf.currentY += 20;
  
  addParagraph(pdf, 'Price must be touching one of your pre-marked levels. Entries away from defined structure are speculation. Entries at levels have institutional logic — institutions worldwide watch the same levels.');
  
  drawPageFooter(pdf, 16);
  
  // Page 2 of Module 5
  addNewPage(pdf);
  drawPageHeader(pdf, 5, 'Confluence Entry System');
  
  pdf.doc.setFont('helvetica', 'bold');
  pdf.doc.setFontSize(12);
  pdf.doc.setTextColor(0, 214, 143);
  pdf.doc.text('Factor 3 — Candle Confirmation', pdf.margin, pdf.currentY);
  pdf.currentY += 20;
  
  addTable(pdf, ['Pattern', 'Signal', 'Entry Action'], [
    ['Hammer — long lower wick at support', 'Sellers pushed down but buyers absorbed it all', 'Enter long on next candle open. Stop below wick.'],
    ['Shooting Star — long upper wick at resistance', 'Buyers pushed up but sellers crushed it back', 'Enter short on next candle open. Stop above wick.'],
    ['Bullish Engulfing — green engulfs prior red', 'Strong reversal — buyers overwhelmed sellers', 'High-conviction long. Enter on close or next open.'],
    ['Bearish Engulfing — red engulfs prior green', 'Strong reversal — sellers overwhelmed buyers', 'High-conviction short. Enter on close or next open.'],
  ], [180, 176, 156]);
  
  addSpacer(pdf, 15);
  pdf.doc.setFont('helvetica', 'bold');
  pdf.doc.setFontSize(12);
  pdf.doc.setTextColor(0, 214, 143);
  pdf.doc.text('Factor 4 — DOM Absorption', pdf.margin, pdf.currentY);
  pdf.currentY += 20;
  
  addParagraph(pdf, 'Absorption is when price is pushing against a level but the orders there keep refilling faster than they are consumed. A large institutional player is defending that price. This is your highest-confidence DOM signal.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '5.2 The Entry Trigger');
  
  addRuleBox(pdf, 'WAIT for a candle to fully CLOSE on the correct side of your level. THEN enter on the OPEN of the next candle. This single rule eliminates most premature entries and prevents you from catching falling knives.');
  
  addParagraph(pdf, 'The exact entry sequence:');
  addBulletPoint(pdf, 'Sweep candle prints the wick beyond your level');
  addBulletPoint(pdf, 'Trigger candle closes back inside the level (above support for longs, below resistance for shorts)');
  addBulletPoint(pdf, 'Entry is taken on the OPEN of the next candle');
  addBulletPoint(pdf, 'Stop is placed beyond the sweep wick + 2-3 ticks buffer');
  
  drawPageFooter(pdf, 17);
  
  // Page 3 of Module 5
  addNewPage(pdf);
  drawPageHeader(pdf, 5, 'Confluence Entry System');
  
  addSubtitle(pdf, '5.3 The Pre-Trade Checklist');
  addParagraph(pdf, 'Answer every question before entering any trade:');
  
  addTable(pdf, ['Question', 'Required Answer'], [
    ['What is my bias and why?', 'Price position relative to 200 MA + MA stack direction + trendline'],
    ['What level am I trading from?', 'PDH, PDL, overnight H/L, trendline, or key MA'],
    ['How many of 4 factors do I have?', 'Minimum 3. List each one specifically.'],
    ['Where is my stop loss?', 'Exact price — beyond the wick + 2-3 ticks'],
    ['Where is Target 1?', 'Exact price — next MA, next level, or next session extreme'],
    ['What is my Risk:Reward?', 'Minimum 1:1.5. Target 1:2 or better.'],
    ['What is my dollar risk?', 'Within today\'s daily loss budget'],
    ['Has the entry candle fully closed?', 'Yes — never enter on an open candle. Ever.'],
  ], [210, 302]);
  
  addSpacer(pdf, 15);
  addRuleBox(pdf, 'If you cannot answer all 8 questions in under 30 seconds, DO NOT take the trade. The setup is not ready or you are not ready. Either is a valid reason to pass.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '5.4 Confluence Factor Quick Reference');
  
  addTable(pdf, ['Factors Present', 'Trade Decision', 'Confidence Level'], [
    ['4 of 4', 'Strong entry — full position size', 'Highest'],
    ['3 of 4', 'Valid entry — standard position size', 'High'],
    ['2 of 4', 'NO TRADE — wait for more confluence', 'Insufficient'],
    ['1 of 4', 'NO TRADE — setup not ready', 'None'],
  ], [150, 220, 142]);
  
  drawPageFooter(pdf, 18);
  
  // Page 4 of Module 5
  addNewPage(pdf);
  drawPageHeader(pdf, 5, 'Confluence Entry System');
  
  addSubtitle(pdf, '5.5 Common Confluence Mistakes to Avoid');
  
  addBulletPoint(pdf, 'Counting the same signal twice — MA stack and "trend direction" are the same factor');
  addBulletPoint(pdf, 'Entering before candle close — the wick might extend or the candle might flip');
  addBulletPoint(pdf, 'Forcing confluence — if you have to "talk yourself into" a factor, it does not count');
  addBulletPoint(pdf, 'Ignoring the 200 MA — trades against the 200 MA need extra confluence, not less');
  addBulletPoint(pdf, 'Skipping DOM confirmation — absorption is your edge over chart-only traders');
  
  addSpacer(pdf, 20);
  addKeyConceptBox(pdf, 'KEY CONCEPT', 'The confluence system exists to protect you from yourself. When you feel the urge to enter with only 2 factors, that urge is the exact emotional impulse that blows up accounts. The system removes the option. Trust it.');
  
  addSpacer(pdf, 20);
  addSubtitle(pdf, '5.6 Entry Scenarios — Practice Examples');
  
  addParagraph(pdf, 'Scenario 1: Price at PDL, 8 MA below 20 MA below 50 MA, shooting star candle, no DOM visible');
  addBulletPoint(pdf, 'Factors: Level touch (1), MA stack (2 — but BEARISH, so this is a counter-trend long)');
  addBulletPoint(pdf, 'Decision: NO TRADE — only 1 factor for a long, and MA stack is against you');
  
  addParagraph(pdf, 'Scenario 2: Price at overnight high, 8 MA above 20 MA above 50 MA, hammer candle, DOM showing absorption');
  addBulletPoint(pdf, 'Factors: Level touch (1), MA stack (2 — BULLISH), candle confirmation (3), DOM absorption (4)');
  addBulletPoint(pdf, 'Decision: STRONG ENTRY — 4 of 4 factors aligned, take full position');
  
  drawPageFooter(pdf, 19);
}

// Continue with remaining modules...
function createModule6(pdf: PDFGenerator) {
  addNewPage(pdf);
  drawPageHeader(pdf, 6, 'Liquidity Sweep Zones Mastery');
  
  addTitle(pdf, 'MODULE 6');
  pdf.doc.setFont('helvetica', 'normal');
  pdf.doc.setFontSize(14);
  pdf.doc.setTextColor(100, 100, 100);
  pdf.doc.text('Liquidity Sweep Zones Mastery', pdf.margin, pdf.currentY);
  pdf.currentY += 25;
  
  addParagraph(pdf, 'The single most powerful setup in this entire system');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '6.1 How a Liquidity Sweep Works');
  
  addKeyConceptBox(pdf, 'KEY CONCEPT', 'Every retail trader who bought at support placed their stop just below it. Those stops are buy orders. Institutions need buy orders to fill their sell orders at a great price. So they engineer price below the level, trigger those buy orders, fill their institutional sells against them, then let price fall. Retail is stopped out at the bottom. The institution is now short from the exact level retail was long. That wick on your candle IS the entire mechanism.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '6.2 Type 1 — Support Sweep (Long Setup)');
  addParagraph(pdf, 'The support sweep is your bread-and-butter long entry:');
  
  addTable(pdf, ['Stage', 'What Happens', 'Your Action'], [
    ['Setup', 'Clear support level with 2+ prior touches. Retail longs clustered here with stops just below.', 'Mark the level. Set alert below it.'],
    ['Sweep', 'Price spikes aggressively below support on high volume.', 'WATCH ONLY. This is the trap. Do not enter.'],
    ['Hold test', 'Price tries to continue lower but cannot make a new low. Volume drops.', 'Watch DOM for bid absorption building.'],
    ['Reclaim', 'Full candle body closes back ABOVE the support level.', 'Entry trigger. Enter long on next candle open.'],
    ['Management', 'Move stop to breakeven after Target 1 hit.', 'Target the next level or MA above.'],
  ], [80, 250, 182]);
  
  drawPageFooter(pdf, 20);
  
  // Continue with more pages for Module 6...
  addNewPage(pdf);
  drawPageHeader(pdf, 6, 'Liquidity Sweep Zones Mastery');
  
  addSubtitle(pdf, '6.3 Type 2 — Resistance Sweep (Short Setup)');
  addParagraph(pdf, 'The mirror image of the support sweep. Price spikes above resistance, grabs stops of retail shorts, immediately reverses back below the level. Enter short when the candle closes back below resistance.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '6.4 Type 3 — Double Tap Sweep (Highest Probability)');
  addParagraph(pdf, 'The double tap is the highest-probability setup in this system. Price tests a level, bounces, comes back and goes just slightly beyond the first extreme — taking the stops of every trader who held through the first test — then makes the real reversal.');
  
  addBulletPoint(pdf, 'Entry: Above the second wick\'s high after candle closes');
  addBulletPoint(pdf, 'Stop: Below the second low — the absolute extreme of the pattern');
  addBulletPoint(pdf, 'Result: Only 3-8 ticks of risk for a trade targeting the full origin of the move');
  
  addKeyConceptBox(pdf, 'PRO TIP', 'The double tap gives you the clearest defined stop in all of technical trading. Two tests of the same level with a stop just beyond the second — this is the setup you hunt every day.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '6.5 Sweep vs. Breakout — The Critical Distinction');
  addParagraph(pdf, 'This distinction is what separates profitable traders from those who get repeatedly stopped out:');
  
  addTable(pdf, ['Characteristic', 'SWEEP — Fade It', 'BREAKOUT — Do Not Fade'], [
    ['Candle body', 'Wick extends beyond level, body closes back inside', 'Full body candle closes beyond level and stays'],
    ['Volume', 'Spikes on sweep, dries up immediately after', 'Stays elevated or increases on continuation'],
    ['Speed', 'Fast spike and snap-back in 1-3 candles', 'Price moves beyond and consolidates further'],
    ['DOM', 'Absorption at the extreme — bids/asks refill fast', 'No absorption — orders consumed in breakout direction'],
    ['Return', 'Price comes back to level quickly', 'Price does not return — level becomes new S/R'],
  ], [100, 206, 206]);
  
  drawPageFooter(pdf, 21);
  
  // More pages for Module 6
  addNewPage(pdf);
  drawPageHeader(pdf, 6, 'Liquidity Sweep Zones Mastery');
  
  addSubtitle(pdf, '6.6 Identifying High-Probability Sweep Zones');
  addParagraph(pdf, 'Not all levels are equal. Here is how to identify where sweeps are most likely:');
  
  addBulletPoint(pdf, 'Multiple touches: Levels with 3+ touches have more stops clustered below/above');
  addBulletPoint(pdf, 'Round numbers: Psychological levels like 4000, 4100, 4200 attract retail orders');
  addBulletPoint(pdf, 'Session extremes: PDH, PDL, Asian H/L — institutions know where retail is positioned');
  addBulletPoint(pdf, 'Equal highs/lows: When price makes identical highs or lows, stops are stacked there');
  addBulletPoint(pdf, 'Obvious trendlines: The more "perfect" a trendline looks, the more stops are behind it');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '6.7 Sweep Entry Checklist');
  
  addTable(pdf, ['Checkpoint', 'Status'], [
    ['Level has 2+ prior touches', '[ ]'],
    ['Price made a wick beyond the level', '[ ]'],
    ['Candle body closed back inside', '[ ]'],
    ['DOM showing absorption at the extreme', '[ ]'],
    ['MA stack aligns with trade direction', '[ ]'],
    ['Stop placed beyond the wick + 2-3 ticks', '[ ]'],
    ['Target identified before entry', '[ ]'],
    ['Risk:Reward is 1:1.5 or better', '[ ]'],
  ], [350, 162]);
  
  addSpacer(pdf, 15);
  addWarningBox(pdf, 'WARNING', 'The most common mistake is entering the sweep BEFORE the reclaim candle closes. The wick might extend. The body might not reclaim. Wait for confirmation. The slight delay in entry is worth avoiding the false signal.');
  
  drawPageFooter(pdf, 22);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 6, 'Liquidity Sweep Zones Mastery');
  
  addSubtitle(pdf, '6.8 Failed Sweep Recognition');
  addParagraph(pdf, 'Not every sweep reverses. Learn to recognize when a sweep has failed and becomes a breakout:');
  
  addBulletPoint(pdf, 'Multiple candles close beyond the level without reclaiming');
  addBulletPoint(pdf, 'Volume increases on the breakdown/breakout, not on the reversal');
  addBulletPoint(pdf, 'DOM shows no absorption — orders are being consumed in the breakout direction');
  addBulletPoint(pdf, 'MA stack flips in the breakout direction');
  addBulletPoint(pdf, 'Price retests the broken level from the other side and holds');
  
  addSpacer(pdf, 15);
  addKeyConceptBox(pdf, 'IMPORTANT', 'When a sweep fails and becomes a breakout, the failed level now becomes significant support/resistance from the other direction. The old support that broke becomes new resistance. Use this for your next setup.');
  
  drawPageFooter(pdf, 23);
}

// Module 7: Price Action & Candle Reading
function createModule7(pdf: PDFGenerator) {
  addNewPage(pdf);
  drawPageHeader(pdf, 7, 'Price Action & Candle Reading');
  
  addTitle(pdf, 'MODULE 7');
  pdf.doc.setFont('helvetica', 'normal');
  pdf.doc.setFontSize(14);
  pdf.doc.setTextColor(100, 100, 100);
  pdf.doc.text('Price Action & Candle Reading', pdf.margin, pdf.currentY);
  pdf.currentY += 25;
  
  addParagraph(pdf, 'What every candle is telling you — and how to listen');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '7.1 The Seven Candle Patterns You Must Know Instantly');
  
  addTable(pdf, ['Pattern', 'What It Looks Like', 'Signal', 'Trade Action'], [
    ['Hammer', 'Small body at top. Long lower wick 2x+ body.', 'Bullish reversal at support', 'Long on next candle. Stop below wick.'],
    ['Shooting Star', 'Small body at bottom. Long upper wick 2x+ body.', 'Bearish reversal at resistance', 'Short on next candle. Stop above wick.'],
    ['Bullish Engulfing', 'Large green body engulfs entire prior red body.', 'Strong bullish reversal', 'High conviction long. Enter on close.'],
    ['Bearish Engulfing', 'Large red body engulfs entire prior green body.', 'Strong bearish reversal', 'High conviction short. Enter on close.'],
    ['Inside Bar', 'Current H/L completely inside prior candle.', 'Consolidation — breakout imminent', 'Wait for break. Set alerts.'],
    ['Doji', 'Open and close nearly equal. Very small body.', 'Indecision at key level', 'Wait for next candle direction.'],
    ['Marubozu', 'Full body candle. No or minimal wicks.', 'Extreme conviction', 'Do not fade. Follow momentum.'],
  ], [100, 150, 130, 132]);
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '7.2 Market Structure — Reading the Trend');
  
  addTable(pdf, ['Structure', 'Definition', 'Bias', 'Rule'], [
    ['Higher Highs + Higher Lows', 'Each rally higher. Each pullback stops higher.', 'Bullish', 'Long setups only.'],
    ['Lower Highs + Lower Lows', 'Each rally fails lower. Each drop makes new low.', 'Bearish', 'Short setups only.'],
    ['Equal Highs + Equal Lows', 'Same highs and lows repeating — range bound.', 'Neutral', 'Buy low, sell high of range.'],
    ['Break of Structure (BOS)', 'New high or low that violates prior structure.', 'Trend change', 'Marks start of new trend.'],
  ], [130, 180, 60, 142]);
  
  drawPageFooter(pdf, 24);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 7, 'Price Action & Candle Reading');
  
  addSubtitle(pdf, '7.3 Wick Analysis — What Wicks Tell You');
  addParagraph(pdf, 'Wicks are the fingerprints of institutional activity. Learn to read them:');
  
  addBulletPoint(pdf, 'Long lower wick at support = buyers absorbed selling pressure = bullish');
  addBulletPoint(pdf, 'Long upper wick at resistance = sellers absorbed buying pressure = bearish');
  addBulletPoint(pdf, 'Equal wicks on both sides = indecision = wait for clarity');
  addBulletPoint(pdf, 'No wicks (Marubozu) = complete conviction = follow the direction');
  addBulletPoint(pdf, 'Increasing wick lengths = volatility expanding = be cautious with size');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '7.4 Body-to-Wick Ratios');
  
  addTable(pdf, ['Ratio', 'Meaning', 'Action'], [
    ['Body > Wick', 'Strong conviction in candle direction', 'Trust the direction'],
    ['Wick > Body (2x)', 'Rejection — price tried and failed', 'Potential reversal signal'],
    ['Wick > Body (3x+)', 'Extreme rejection — strong signal', 'High probability reversal'],
    ['Body ≈ Wick', 'Some conviction, some rejection', 'Wait for confirmation'],
  ], [150, 220, 142]);
  
  addSpacer(pdf, 15);
  addKeyConceptBox(pdf, 'PRO TIP', 'The candle that immediately follows a rejection candle is more important than the rejection itself. If the follow-through confirms the rejection direction, your signal is validated. If it negates the rejection, stand aside.');
  
  drawPageFooter(pdf, 25);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 7, 'Price Action & Candle Reading');
  
  addSubtitle(pdf, '7.5 Multi-Candle Patterns');
  addParagraph(pdf, 'Some patterns require reading multiple candles together:');
  
  addBulletPoint(pdf, 'Three White Soldiers: Three consecutive bullish candles with higher closes — strong uptrend confirmation');
  addBulletPoint(pdf, 'Three Black Crows: Three consecutive bearish candles with lower closes — strong downtrend confirmation');
  addBulletPoint(pdf, 'Morning Star: Bearish candle, small body/doji, bullish candle — reversal at support');
  addBulletPoint(pdf, 'Evening Star: Bullish candle, small body/doji, bearish candle — reversal at resistance');
  addBulletPoint(pdf, 'Tweezer Tops/Bottoms: Two candles with equal highs or lows — rejection at that price');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '7.6 Context Is Everything');
  addParagraph(pdf, 'The same candle pattern means different things in different contexts:');
  
  addTable(pdf, ['Pattern', 'At Key Level', 'In Middle of Range', 'Against Trend'], [
    ['Hammer', 'High probability long', 'Low probability — ignore', 'Needs extra confluence'],
    ['Shooting Star', 'High probability short', 'Low probability — ignore', 'Needs extra confluence'],
    ['Engulfing', 'Strong reversal signal', 'Continuation — follow it', 'Counter-trend risk'],
    ['Doji', 'Reversal brewing', 'Indecision — no trade', 'Possible exhaustion'],
  ], [110, 140, 130, 132]);
  
  addSpacer(pdf, 15);
  addRuleBox(pdf, 'Never trade a candle pattern in isolation. The pattern must occur at a pre-marked level with confluence factors aligned. A hammer in the middle of nowhere is noise. A hammer at PDL with MA stack bullish and DOM absorption is a setup.');
  
  drawPageFooter(pdf, 26);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 7, 'Price Action & Candle Reading');
  
  addSubtitle(pdf, '7.7 Candle Pattern Quick Reference Card');
  addParagraph(pdf, 'Print this page and keep it visible during your trading sessions:');
  
  addTable(pdf, ['Pattern', 'Location', 'Direction', 'Stop Placement', 'Target'], [
    ['Hammer', 'Support', 'LONG', 'Below wick', 'Next resistance'],
    ['Shooting Star', 'Resistance', 'SHORT', 'Above wick', 'Next support'],
    ['Bullish Engulfing', 'Support', 'LONG', 'Below engulfing low', 'Next resistance'],
    ['Bearish Engulfing', 'Resistance', 'SHORT', 'Above engulfing high', 'Next support'],
    ['Inside Bar', 'Any level', 'Breakout direction', 'Beyond IB range', 'Next level'],
    ['Double Tap', 'Any level', 'Reversal direction', 'Beyond second extreme', 'Origin of move'],
  ], [110, 90, 80, 116, 116]);
  
  drawPageFooter(pdf, 27);
}

// Module 8: DOM Mastery
function createModule8(pdf: PDFGenerator) {
  addNewPage(pdf);
  drawPageHeader(pdf, 8, 'Depth of Market Mastery');
  
  addTitle(pdf, 'MODULE 8');
  pdf.doc.setFont('helvetica', 'normal');
  pdf.doc.setFontSize(14);
  pdf.doc.setTextColor(100, 100, 100);
  pdf.doc.text('Depth of Market (DOM) Mastery', pdf.margin, pdf.currentY);
  pdf.currentY += 25;
  
  addParagraph(pdf, 'Reading live institutional order flow in real time');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '8.1 DOM Structure');
  
  addTable(pdf, ['DOM Element', 'What It Shows', 'How to Read It'], [
    ['Bid Size (left)', 'Contracts resting to BUY at each price', 'Large bid = potential support. Watch if it holds when touched.'],
    ['Ask Size (right)', 'Contracts resting to SELL at each price', 'Large ask = potential resistance. Watch if it holds when touched.'],
    ['Highlighted row', 'Current bid/ask — where market is now', 'Bid getting hit = selling pressure. Ask lifting = buying.'],
    ['Volume Profile', 'Volume traded at each price this session', 'Clusters = where institutions traded. Confirms chart levels.'],
  ], [130, 180, 202]);
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '8.2 The Five DOM Signals');
  
  addTable(pdf, ['Signal', 'What You See', 'What It Means', 'Action'], [
    ['Absorption', 'Level hit but NOT moving. Bids/asks refill instantly.', 'Large hidden player defending that price.', 'Highest confidence entry signal.'],
    ['Stacking', 'One side shows dramatically more contracts.', 'Institutional positioning on that side.', 'Bias toward the heavy side.'],
    ['Iceberg', 'Small size at level that instantly refills when hit.', 'Large order broken into smaller pieces.', 'Trade in direction iceberg defends.'],
    ['Pulling', 'Large orders disappear before price reaches.', 'Spoofing — intentional deception.', 'Do not trade based on pulled orders.'],
    ['Momentum Shift', 'Order flow slows before price reverses.', 'Earliest warning of reversal.', 'Start watching for entry candle.'],
  ], [90, 150, 130, 142]);
  
  drawPageFooter(pdf, 28);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 8, 'Depth of Market Mastery');
  
  addWarningBox(pdf, 'WARNING', 'Never enter a trade BECAUSE of a large order showing on the DOM. Only trust DOM signals when price is AT the level and showing absorption. Large orders that have not been tested yet may be pulled. Spoofing is real and common.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '8.3 Reading Absorption in Real Time');
  addParagraph(pdf, 'Absorption is your highest-confidence signal. Here is how to identify it:');
  
  addBulletPoint(pdf, 'Price reaches your pre-marked level');
  addBulletPoint(pdf, 'Aggressive sellers (or buyers) are hitting the level repeatedly');
  addBulletPoint(pdf, 'The bid (or ask) at that price keeps refilling — it does not deplete');
  addBulletPoint(pdf, 'Price cannot break through despite the aggression');
  addBulletPoint(pdf, 'Volume spikes but price stays stuck — absorption is occurring');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '8.4 DOM + Chart Integration');
  addParagraph(pdf, 'The DOM confirms what the chart shows. Use them together:');
  
  addTable(pdf, ['Chart Shows', 'DOM Confirms', 'Result'], [
    ['Price at support', 'Bid absorption building', 'High probability long'],
    ['Price at support', 'Bids depleting rapidly', 'Support breaking — stand aside'],
    ['Price at resistance', 'Ask absorption building', 'High probability short'],
    ['Price at resistance', 'Asks depleting rapidly', 'Resistance breaking — stand aside'],
    ['Sweep wick forming', 'Absorption at extreme', 'Reversal likely — wait for reclaim'],
  ], [170, 180, 162]);
  
  drawPageFooter(pdf, 29);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 8, 'Depth of Market Mastery');
  
  addSubtitle(pdf, '8.5 DOM Practice Exercises');
  addParagraph(pdf, 'Before trading live with DOM signals, complete these practice exercises:');
  
  addBulletPoint(pdf, 'Watch the DOM for 30 minutes without trading. Call out absorption when you see it.');
  addBulletPoint(pdf, 'Note the price where absorption occurred. Check the chart — was it significant?');
  addBulletPoint(pdf, 'Identify 5 spoofing events — large orders that got pulled before being hit.');
  addBulletPoint(pdf, 'Compare DOM activity during high-volume (NY open) vs low-volume (lunch) periods.');
  addBulletPoint(pdf, 'Practice until you can spot absorption within 2-3 candles of it forming.');
  
  addSpacer(pdf, 15);
  addKeyConceptBox(pdf, 'PRO TIP', 'DOM reading is a skill that takes time to develop. Spend at least 10 hours watching the DOM before relying on it for trade decisions. Initially, use it only as a CONFIRMATION of your chart-based setup — not as the primary signal.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '8.6 DOM Settings Recommendations');
  
  addTable(pdf, ['Setting', 'Recommended Value', 'Why'], [
    ['Depth levels visible', '10-15 levels each side', 'See enough context without overload'],
    ['Color scheme', 'Blue bids, Red asks', 'Immediate visual recognition'],
    ['Update speed', 'Real-time', 'DOM moves fast — lag costs money'],
    ['Volume profile', 'Enabled', 'Confirms where institutions traded'],
    ['Position in layout', 'Right of main chart', 'Quick glance between chart and DOM'],
  ], [150, 130, 232]);
  
  drawPageFooter(pdf, 30);
}

// Module 9: Trade Management
function createModule9(pdf: PDFGenerator) {
  addNewPage(pdf);
  drawPageHeader(pdf, 9, 'Trade Management Rules');
  
  addTitle(pdf, 'MODULE 9');
  pdf.doc.setFont('helvetica', 'normal');
  pdf.doc.setFontSize(14);
  pdf.doc.setTextColor(100, 100, 100);
  pdf.doc.text('Trade Management Rules', pdf.margin, pdf.currentY);
  pdf.currentY += 25;
  
  addParagraph(pdf, 'How you manage a trade is where the money is really made');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '9.1 Stop Loss — Non-Negotiable');
  
  addRuleBox(pdf, 'Every trade has a stop loss set BEFORE entry. Not after. Not "if it goes against me." BEFORE. The moment your order fills, your stop loss order is already in the market. A trade without a stop is not a trade — it is a gamble.');
  
  addSpacer(pdf, 10);
  addBulletPoint(pdf, 'Shorts from resistance: Stop above sweep wick high + 2 ticks');
  addBulletPoint(pdf, 'Longs from support: Stop below sweep wick low + 2 ticks');
  addBulletPoint(pdf, 'Maximum stop for this system: 10 ticks');
  addBulletPoint(pdf, 'If the logical stop requires more than 10 ticks — SKIP THE TRADE');
  addBulletPoint(pdf, 'Never widen a stop after a trade is live');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '9.2 The T1 / T2 / T3 Target System');
  addParagraph(pdf, 'This scaling system captures profit while leaving room for the trade to run:');
  
  addTable(pdf, ['Target', 'When to Take', 'Size', 'Stop Action'], [
    ['T1', 'Next MA, next minor level, 10-15 tick gain', '50% of position', 'Move stop to BREAKEVEN immediately'],
    ['T2', 'Next major level, session H/L, 20-30 tick gain', '30% of position', 'Trail stop to behind last candle'],
    ['T3 — Runner', 'PDH/PDL, session extreme, 40+ tick gain', 'Final 20%', 'Trail aggressively — let it run'],
  ], [90, 200, 100, 122]);
  
  drawPageFooter(pdf, 31);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 9, 'Trade Management Rules');
  
  addKeyConceptBox(pdf, 'PRO TIP', 'The breakeven move after T1 is what separates this system from random trading. You are now playing with free risk on the remainder. Even if T2 never hits and you get stopped at breakeven — you already booked profit on T1. This rule alone makes the system mathematically positive.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '9.3 Trailing Stop Mechanics');
  addParagraph(pdf, 'After T1 is hit and your stop moves to breakeven, here is how to trail:');
  
  addBulletPoint(pdf, 'Move stop to behind the low of each completed bullish candle (for longs)');
  addBulletPoint(pdf, 'Move stop to behind the high of each completed bearish candle (for shorts)');
  addBulletPoint(pdf, 'Never move the stop backwards — only forward');
  addBulletPoint(pdf, 'If price consolidates, keep stop at current position until new swing forms');
  addBulletPoint(pdf, 'At T2, tighten trail to behind the last 2 candles');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '9.4 When to Move to Breakeven Early');
  addParagraph(pdf, 'Sometimes you should move to breakeven before T1 is hit:');
  
  addBulletPoint(pdf, 'News event approaching within 10 minutes — protect the position');
  addBulletPoint(pdf, 'Price stalls at a clear level for 5+ candles — momentum fading');
  addBulletPoint(pdf, 'DOM shows absorption forming against your position');
  addBulletPoint(pdf, 'Major support/resistance approaching that was not in your original plan');
  
  addSpacer(pdf, 15);
  addWarningBox(pdf, 'WARNING', 'Moving to breakeven too early is almost as bad as not using stops. If you consistently get stopped at breakeven before T1, your entries are too late or your stop is too tight. Review your entry timing, not your stop placement.');
  
  drawPageFooter(pdf, 32);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 9, 'Trade Management Rules');
  
  addSubtitle(pdf, '9.5 Trade Management Decision Tree');
  
  addTable(pdf, ['Situation', 'Decision', 'Reasoning'], [
    ['Price hits T1', 'Take 50%, move stop to breakeven', 'Lock in profit, trade remainder risk-free'],
    ['Price reverses before T1', 'Let stop trigger', 'Stop was placed correctly — honor it'],
    ['Price stalls at T1 zone', 'Take profit, exit full position', 'Momentum is gone — capture what you have'],
    ['Price blasts through T1', 'Take 50%, hold rest for T2/T3', 'Momentum strong — let runner run'],
    ['News event incoming', 'Move to breakeven or exit 50%', 'Protect against volatility spike'],
    ['End of session approaching', 'Take remaining profit', 'Overnight risk not worth runner'],
  ], [150, 180, 182]);
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '9.6 Position Scaling Rules');
  addParagraph(pdf, 'If you trade multiple contracts, here is how to scale properly:');
  
  addTable(pdf, ['Total Contracts', 'T1 Exit', 'T2 Exit', 'Runner'], [
    ['1', '1 contract (100%)', 'N/A', 'N/A'],
    ['2', '1 contract (50%)', '1 contract (50%)', 'N/A'],
    ['3', '2 contracts (66%)', '1 contract (33%)', 'N/A'],
    ['4', '2 contracts (50%)', '1 contract (25%)', '1 contract (25%)'],
    ['5+', '50%', '30%', '20%'],
  ], [120, 130, 130, 132]);
  
  drawPageFooter(pdf, 33);
}

// Module 10: Risk Management
function createModule10(pdf: PDFGenerator) {
  addNewPage(pdf);
  drawPageHeader(pdf, 10, 'Risk Management');
  
  addTitle(pdf, 'MODULE 10');
  pdf.doc.setFont('helvetica', 'normal');
  pdf.doc.setFontSize(14);
  pdf.doc.setTextColor(100, 100, 100);
  pdf.doc.text('Risk Management & Position Sizing', pdf.margin, pdf.currentY);
  pdf.currentY += 25;
  
  addParagraph(pdf, 'The rules that keep you in the game long enough to succeed');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '10.1 The 1% Risk Rule');
  addParagraph(pdf, 'Risk no more than 1% of your account on any single trade. This is not a suggestion — it is the mathematical foundation that keeps you solvent through losing streaks.');
  
  addTable(pdf, ['Account Size', '1% Risk', 'Max Contracts (10-tick stop)', 'Recommended Starting Size'], [
    ['$25,000', '$250', '25 contracts', '1 contract — build the process'],
    ['$50,000', '$500', '50 contracts', '1-3 contracts — prove consistency'],
    ['$100,000', '$1,000', '100 contracts', '3-5 contracts — after 90+ profitable days'],
  ], [100, 80, 150, 182]);
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '10.2 Daily Loss Limit Calculation');
  addParagraph(pdf, 'Calculate this every morning before you open the platform:');
  
  addTable(pdf, ['Step', 'Formula', 'Example'], [
    ['Current Balance', 'Check your platform', '$48,678.70'],
    ['Maximum Loss Limit', 'Fixed by your account rules', '$48,000.00'],
    ['Full Daily Budget', 'Balance minus MLL', '$678.70'],
    ['Conservative Daily Limit', '50% of budget (recommended)', '$339.35'],
    ['Hard Stop Point', 'Close platform if hit', 'Done for the day — no exceptions'],
  ], [150, 200, 162]);
  
  drawPageFooter(pdf, 34);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 10, 'Risk Management');
  
  addRuleBox(pdf, 'When you hit your daily loss limit — close the platform. Do not watch the market. Do not think about recovering. Your job is now to protect your account for tomorrow. Recovery trading is how accounts get destroyed.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '10.3 The Two-Loss Rule');
  addParagraph(pdf, 'If you take two consecutive losing trades in a session, stop trading for the day regardless of P&L. Two losses in a row mean one of three things:');
  
  addBulletPoint(pdf, 'Your setup identification is off today — your reads are wrong');
  addBulletPoint(pdf, 'Market conditions do not match the strategy parameters');
  addBulletPoint(pdf, 'Your mental state is compromised and you are not seeing clearly');
  
  addParagraph(pdf, 'None of these improve by taking more trades. The market will be open tomorrow.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '10.4 Position Sizing Formula');
  addParagraph(pdf, 'Use this formula for every trade:');
  
  addKeyConceptBox(pdf, 'FORMULA', 'Position Size = (Account Risk $) ÷ (Stop Loss in Ticks × Tick Value). Example: $250 risk ÷ (8 ticks × $1.25/tick on /MES) = $250 ÷ $10 = 25 contracts maximum.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '10.5 Risk Management Quick Reference');
  
  addTable(pdf, ['Rule', 'Value', 'Non-Negotiable'], [
    ['Max risk per trade', '1% of account', 'Yes'],
    ['Max daily loss', '2-3% of account', 'Yes'],
    ['Max stop loss', '10 ticks', 'Yes'],
    ['Min R:R ratio', '1:1.5', 'Yes'],
    ['Consecutive losses to stop', '2', 'Yes'],
    ['Position scale after loss', 'Reduce by 50%', 'Recommended'],
  ], [180, 150, 182]);
  
  drawPageFooter(pdf, 35);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 10, 'Risk Management');
  
  addSubtitle(pdf, '10.6 Drawdown Recovery Protocol');
  addParagraph(pdf, 'When you hit a drawdown, follow this protocol to recover safely:');
  
  addTable(pdf, ['Drawdown Level', 'Action Required'], [
    ['5% drawdown', 'Reduce position size by 50%. Review last 10 trades for patterns.'],
    ['10% drawdown', 'Stop trading for 2-3 days. Complete full system review. Paper trade to rebuild.'],
    ['15% drawdown', 'Stop trading for 1 week minimum. Full psychological reset required.'],
    ['20%+ drawdown', 'Fundamental system breakdown. Do not trade live until complete rebuild.'],
  ], [130, 382]);
  
  addSpacer(pdf, 15);
  addKeyConceptBox(pdf, 'IMPORTANT', 'The goal during drawdown recovery is NOT to make back the money. The goal is to rebuild the PROCESS. If the process is correct, the money follows. Chasing losses is the fastest path to account destruction.');
  
  drawPageFooter(pdf, 36);
}

// Module 11: Psychology
function createModule11(pdf: PDFGenerator) {
  addNewPage(pdf);
  drawPageHeader(pdf, 11, 'Trading Psychology');
  
  addTitle(pdf, 'MODULE 11');
  pdf.doc.setFont('helvetica', 'normal');
  pdf.doc.setFontSize(14);
  pdf.doc.setTextColor(100, 100, 100);
  pdf.doc.text('Trading Psychology & Discipline', pdf.margin, pdf.currentY);
  pdf.currentY += 25;
  
  addParagraph(pdf, 'The real reason most traders fail — and how you will not');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '11.1 The Five Psychological Traps');
  
  addTable(pdf, ['Trap', 'How It Feels', 'The Escape'], [
    ['Revenge Trading', 'After a loss you feel angry and want to immediately get it back. You take the next trade without a setup.', 'Invoke the two-loss rule. Step away. Walk, breathe, move. Return only after full calm is restored.'],
    ['FOMO', 'A big move happens without you. You chase it late and get immediately trapped at the extreme.', 'Accept that every missed move is free education. A missed trade costs nothing. A bad entry costs real money.'],
    ['Overconfidence', 'After 3-4 winners you feel invincible and start bending rules — fewer confluence factors, past targets, oversizing.', 'Winning streaks are when you must be MOST disciplined. They are when your system faces its biggest test.'],
    ['Loss Aversion', 'When a trade goes against you, you refuse to take the stop because it makes the loss real.', 'Your stop was set with a clear head. Honor that clear-headed decision. The loss became real when price moved.'],
    ['Analysis Paralysis', 'A perfect setup forms but you cannot pull the trigger out of fear. You watch it work without you.', 'Trust the process. You defined the rules when calm. Execute the defined rules. One trade outcome is irrelevant.'],
  ], [90, 200, 222]);
  
  drawPageFooter(pdf, 37);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 11, 'Trading Psychology');
  
  addSubtitle(pdf, '11.2 The Three Mental States');
  
  addTable(pdf, ['State', 'Signs', 'Trade?'], [
    ['GREEN — Optimal', 'Calm. Clear. No emotional residue from prior trades. Following rules without internal debate.', 'Yes. Full size. This is when your best trading happens.'],
    ['YELLOW — Caution', 'Slightly frustrated or distracted. Minor urge to deviate. Not fully in control.', 'Reduced size only. One setup maximum. Extra checklist review.'],
    ['RED — Stop', 'Angry, desperate, overexcited, or disconnected. Rules feel like obstacles.', 'No trading. Close the platform. Come back tomorrow.'],
  ], [120, 250, 142]);
  
  addSpacer(pdf, 15);
  addRuleBox(pdf, 'Before every session, say out loud: "What state am I in right now?" If the honest answer is yellow or red, adjust accordingly. This five-second check prevents the majority of catastrophic trading days.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '11.3 Building Emotional Resilience');
  addParagraph(pdf, 'Trading is an emotional marathon. Build your resilience with these practices:');
  
  addBulletPoint(pdf, 'Morning routine: 10 minutes of meditation or breathing before trading');
  addBulletPoint(pdf, 'Physical movement: Short walk between losses to reset nervous system');
  addBulletPoint(pdf, 'Gratitude practice: Write 3 things you are grateful for regardless of P&L');
  addBulletPoint(pdf, 'Separation: Trading P&L does not define your worth as a person');
  addBulletPoint(pdf, 'Long-term view: One day means nothing. One month matters. One year defines.');
  
  drawPageFooter(pdf, 38);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 11, 'Trading Psychology');
  
  addSubtitle(pdf, '11.4 The Discipline Framework');
  addParagraph(pdf, 'Discipline is not willpower. Discipline is systems. Build these systems:');
  
  addBulletPoint(pdf, 'Pre-trade checklist: Physical paper you mark before every entry');
  addBulletPoint(pdf, 'Alarms: Set audible alerts when approaching daily loss limit');
  addBulletPoint(pdf, 'Accountability: Share your daily results with a trading partner or group');
  addBulletPoint(pdf, 'Environment: Trading space free from distractions and interruptions');
  addBulletPoint(pdf, 'Ritual: Same routine every day — consistency breeds discipline');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '11.5 After a Losing Trade');
  addParagraph(pdf, 'Every losing trade should trigger this exact sequence:');
  
  addBulletPoint(pdf, 'Step away from the screen for 2-3 minutes minimum');
  addBulletPoint(pdf, 'Take 5 deep breaths — physiologically reset your nervous system');
  addBulletPoint(pdf, 'Ask: Was this a valid setup that failed or a rule violation?');
  addBulletPoint(pdf, 'If valid setup: No change needed. Losses happen. Next opportunity.');
  addBulletPoint(pdf, 'If rule violation: Write it in journal immediately. What triggered the deviation?');
  addBulletPoint(pdf, 'Check mental state: Am I still GREEN? If not, reduce size or stop.');
  
  addSpacer(pdf, 15);
  addKeyConceptBox(pdf, 'KEY CONCEPT', 'A clean loss on a valid setup is a SUCCESS. You followed the rules and the market did not cooperate. That happens. A winning trade from a rule violation is a FAILURE. You got lucky. Luck runs out. Process endures.');
  
  drawPageFooter(pdf, 39);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 11, 'Trading Psychology');
  
  addSubtitle(pdf, '11.6 The Psychology Journal');
  addParagraph(pdf, 'In addition to your trade journal, keep a psychology journal with these entries:');
  
  addTable(pdf, ['Entry', 'When to Write', 'What to Include'], [
    ['Morning State', 'Before session', 'Mental state, sleep quality, stress level, any emotional residue'],
    ['Pre-Trade', 'Before each entry', 'Confidence level 1-10, any hesitation, reason for taking this setup'],
    ['Post-Trade', 'After each exit', 'How you feel, any urge to revenge trade, was it clean?'],
    ['End of Day', 'After session close', 'Overall psychology grade, what triggered emotional moments'],
    ['Weekly Review', 'Sunday', 'Patterns in emotional trading, psychological wins and losses'],
  ], [100, 110, 302]);
  
  addSpacer(pdf, 15);
  addWarningBox(pdf, 'IMPORTANT', 'Your psychology journal reveals patterns your trade journal cannot. You might notice that all your rule violations happen on Mondays, or after 3 winners, or when you slept poorly. These insights prevent future failures.');
  
  drawPageFooter(pdf, 40);
}

// Module 12: Daily Routine
function createModule12(pdf: PDFGenerator) {
  addNewPage(pdf);
  drawPageHeader(pdf, 12, 'The Daily Routine');
  
  addTitle(pdf, 'MODULE 12');
  pdf.doc.setFont('helvetica', 'normal');
  pdf.doc.setFontSize(14);
  pdf.doc.setTextColor(100, 100, 100);
  pdf.doc.text('The Daily Routine', pdf.margin, pdf.currentY);
  pdf.currentY += 25;
  
  addParagraph(pdf, 'What professionals do before, during, and after every session');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '12.1 The Complete Daily Schedule');
  
  addTable(pdf, ['Time (CT)', 'Activity', 'Duration'], [
    ['7:00 AM', 'Market review — overnight action, news events, scheduled economic releases', '15 min'],
    ['7:15 AM', 'Level marking ritual — PDH, PDL, overnight H/L, trendlines on 5m chart', '15 min'],
    ['7:30 AM', 'Volume profile — identify POC, value area, LVNs for the session', '10 min'],
    ['7:40 AM', 'Bias determination — write Long / Short / Neutral + three reasons why', '5 min'],
    ['7:45 AM', 'Mental state check — Green / Yellow / Red?', '5 min'],
    ['8:00 AM', 'Platform setup — DOM open, timeframes loaded, alerts set at levels', '15 min'],
    ['8:30 AM', 'Watch only — NO trades in first 15 minutes of main session', '15 min'],
    ['8:45 AM - 11:30 AM', 'Active trading — execute only pre-planned setups from your markup', '~3 hours'],
    ['11:30 AM', 'Evaluate — daily limit hit? Two losses? If yes, STOP.', '5 min'],
    ['After session', 'Journal — log every trade taken and every setup missed', '15 min'],
  ], [120, 310, 82]);
  
  drawPageFooter(pdf, 41);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 12, 'The Daily Routine');
  
  addSubtitle(pdf, '12.2 The Weekly Review');
  addParagraph(pdf, 'Every weekend, complete this full review of your trading week:');
  
  addBulletPoint(pdf, 'Calculate total P&L — ahead or behind for the week?');
  addBulletPoint(pdf, 'Count trades taken and setups passed');
  addBulletPoint(pdf, 'Calculate win rate — trending toward 60%?');
  addBulletPoint(pdf, 'Average winner vs. average loser — is R:R positive?');
  addBulletPoint(pdf, 'Every losing trade: rule violation or valid setup that failed?');
  addBulletPoint(pdf, 'Every missed setup: passed for valid reasons or out of fear?');
  addBulletPoint(pdf, 'Set one specific improvement goal for the coming week');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '12.3 Monthly Performance Review');
  
  addTable(pdf, ['Metric', 'Target', 'Your Result'], [
    ['Total trades', '40-80 (avoid overtrading)', ''],
    ['Win rate', '60%+', ''],
    ['Average R:R', '1:1.5+', ''],
    ['Rule violations', '0', ''],
    ['Days with losses > daily limit', '0', ''],
    ['Consecutive loss rule triggers', 'Track occurrences', ''],
    ['Best trade of the month', 'Analyze why it worked', ''],
    ['Worst trade of the month', 'Analyze what went wrong', ''],
  ], [200, 180, 132]);
  
  drawPageFooter(pdf, 42);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 12, 'The Daily Routine');
  
  addSubtitle(pdf, '12.4 The Trading Day Mindset');
  addParagraph(pdf, 'Enter each trading day with these principles:');
  
  addBulletPoint(pdf, 'Today\'s goal is to follow the process perfectly — not to make money');
  addBulletPoint(pdf, 'I am prepared for the market to do anything — I have no predictions');
  addBulletPoint(pdf, 'I will only take setups that meet ALL my criteria — no exceptions');
  addBulletPoint(pdf, 'A day with zero trades but no rule violations is a successful day');
  addBulletPoint(pdf, 'If I hit my daily loss limit, I will close the platform without hesitation');
  
  addSpacer(pdf, 15);
  addKeyConceptBox(pdf, 'DAILY AFFIRMATION', 'I trade the process, not the outcome. I have prepared thoroughly. I will execute my plan. Whatever the market gives me today is exactly what I was meant to experience. Tomorrow is another opportunity.');
  
  drawPageFooter(pdf, 43);
}

// Module 13: Advanced Concepts
function createModule13(pdf: PDFGenerator) {
  addNewPage(pdf);
  drawPageHeader(pdf, 13, 'Advanced Concepts');
  
  addTitle(pdf, 'MODULE 13');
  pdf.doc.setFont('helvetica', 'normal');
  pdf.doc.setFontSize(14);
  pdf.doc.setTextColor(100, 100, 100);
  pdf.doc.text('Advanced Concepts', pdf.margin, pdf.currentY);
  pdf.currentY += 25;
  
  addParagraph(pdf, 'The deeper layers that separate good traders from great ones');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '13.1 Multi-Timeframe Confirmation Pyramid');
  
  addTable(pdf, ['Timeframe', 'Role', 'What to Check'], [
    ['5-Minute', 'Macro structure + primary level identification', 'Key levels, dominant structure (HH/HL or LH/LL), 200 MA position, volume profile'],
    ['3-Minute', 'Trend confirmation + entry zone setup', 'MA stack alignment, approach to level from correct direction'],
    ['2-Minute', 'Entry timing + trigger execution', 'Rejection candle, DOM absorption, execute on candle close'],
  ], [90, 180, 242]);
  
  addSpacer(pdf, 15);
  addKeyConceptBox(pdf, 'KEY CONCEPT', 'Trade direction must be confirmed on BOTH 5m and 3m before moving to 2m for entry. If 5m says short and 3m says long — you are not aligned. No trade. Alignment across timeframes is non-negotiable.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '13.2 Economic Calendar Integration');
  
  addTable(pdf, ['Event', 'Impact', 'Rule'], [
    ['FOMC Rate Decision', 'Extreme — 50+ point moves in seconds', 'No open positions 5 min before. No entries for 10 min after.'],
    ['Non-Farm Payrolls (NFP)', 'Very high — violent gold and equity reactions', 'Same as FOMC. Watch for post-NFP setup after 5 minutes.'],
    ['CPI / Inflation Data', 'High — directly impacts gold and equity pricing', 'No positions 5 minutes before. Wait for spike to settle.'],
    ['Fed Chair Speaking', 'High — words move markets more than data sometimes', 'Monitor in real time. Ready to flatten if speaking begins.'],
    ['GDP / PMI Data', 'Medium — 10-20 point potential moves', 'Reduce size 10 min before. Keep stops tight.'],
  ], [130, 180, 202]);
  
  drawPageFooter(pdf, 44);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 13, 'Advanced Concepts');
  
  addWarningBox(pdf, 'WARNING', 'Check the economic calendar at 7:00 AM every single morning. Use forexfactory.com or investing.com. Mark all red-flag events on your chart as vertical lines before the session opens.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '13.3 Scaling — When to Add Contract Size');
  
  addTable(pdf, ['Condition', 'Requirement Before Scaling'], [
    ['Minimum consecutive rule-following days', '30 trading days with zero rule violations'],
    ['Minimum performance threshold', 'Positive net P&L with 55%+ win rate over those 30 days'],
    ['Psychological stability', 'No emotional trading days, no revenge trades, no ignored stops'],
    ['Scale increment', 'One contract at a time. Trade new size for 10 sessions before adding another.'],
  ], [200, 312]);
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '13.4 The 180-Day Development Roadmap');
  
  addTable(pdf, ['Phase', 'Days', 'Primary Focus', 'Milestone'], [
    ['Foundation', '1-30', 'Follow rules exactly. Build the habit loop.', 'All 7 candle patterns identified instantly'],
    ['Pattern Recognition', '31-90', 'Identify which setups have your highest win rate.', 'DOM absorption spotted within 2-3 candles'],
    ['Intuition Building', '91-180', 'Understand WHY setups work and fail.', 'Session levels predicted accurately daily'],
    ['Mastery', '180+', 'Refine the system from your data. Make it your own.', 'Entries feel obvious. Rules feel natural.'],
  ], [110, 55, 180, 167]);
  
  drawPageFooter(pdf, 45);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 13, 'Advanced Concepts');
  
  addSubtitle(pdf, '13.5 Advanced Sweep Patterns');
  addParagraph(pdf, 'Once you master basic sweeps, look for these advanced patterns:');
  
  addBulletPoint(pdf, 'Triple tap: Three tests of the same level, each going slightly further — extremely high probability');
  addBulletPoint(pdf, 'Sweep and flip: Level gets swept, reclaimed, then becomes support/resistance from the other side');
  addBulletPoint(pdf, 'Session trap: London sweeps Asian range, NY sweeps London\'s extreme — enter on NY reclaim');
  addBulletPoint(pdf, 'Volume profile sweep: Price sweeps into a LVN, gets absorbed at HVN boundary, reverses');
  addBulletPoint(pdf, 'MA confluence sweep: Price sweeps a level that also aligns with a major MA — double significance');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '13.6 Reading Market Context');
  addParagraph(pdf, 'Advanced traders read the broader context before taking any trade:');
  
  addBulletPoint(pdf, 'Range day: Price moving between defined high and low — trade reversals at range boundaries');
  addBulletPoint(pdf, 'Trend day: Sustained directional movement — trade pullbacks in trend direction only');
  addBulletPoint(pdf, 'Breakout day: Range boundaries fail — follow the breakout, do not fade');
  addBulletPoint(pdf, 'Chop day: No clear structure, random moves — reduce size or stand aside entirely');
  
  addSpacer(pdf, 15);
  addKeyConceptBox(pdf, 'PRO TIP', 'By 9:30 AM CT, you should be able to identify which type of day you are in. Adjust your expectations and trade selection accordingly. Trying to trade reversals on a trend day is fighting the tape.');
  
  drawPageFooter(pdf, 46);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 13, 'Advanced Concepts');
  
  addSubtitle(pdf, '13.7 Correlation Trading');
  addParagraph(pdf, 'Some instruments move together. Use correlations to confirm your bias:');
  
  addTable(pdf, ['Relationship', 'How to Use'], [
    ['/ES and /NQ', 'Should move together. Divergence = one will catch up or both reverse.'],
    ['/MES and SPY', 'Futures lead cash market at open. Watch /MES for SPY direction.'],
    ['/MGC and USD', 'Inverse correlation. Weak dollar = gold up. Use DXY to confirm gold bias.'],
    ['/MCL and /ES', 'Oil spike often precedes equity weakness. Watch oil for risk-off signal.'],
    ['EUR/USD and /6E', 'Same instrument. Use forex for overnight context, futures for session.'],
  ], [130, 382]);
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '13.8 Building Your Edge Database');
  addParagraph(pdf, 'After 90+ days, analyze your data to find your personal edge:');
  
  addBulletPoint(pdf, 'Which session produces your highest win rate?');
  addBulletPoint(pdf, 'Which confluence combination works best for you?');
  addBulletPoint(pdf, 'Which instrument has your cleanest entries?');
  addBulletPoint(pdf, 'What time of day do you make most mistakes?');
  addBulletPoint(pdf, 'What is your average R:R on winning vs. losing trades?');
  
  addParagraph(pdf, 'Your data tells you where YOUR edge is strongest. Double down there. Reduce exposure where you struggle.');
  
  drawPageFooter(pdf, 47);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 13, 'Advanced Concepts');
  
  addSubtitle(pdf, '13.9 Adapting to Market Conditions');
  
  addTable(pdf, ['Market Condition', 'Signs', 'Adjustment'], [
    ['High volatility', 'Large candles, wide ranges, fast moves', 'Widen stops slightly, take partial profits faster'],
    ['Low volatility', 'Small candles, tight ranges, slow moves', 'Tighten targets, be patient for setups'],
    ['Trending', 'Clear HH/HL or LH/LL structure', 'Trade pullbacks only in trend direction'],
    ['Ranging', 'Equal highs and lows, chop', 'Trade range boundaries, expect reversals'],
    ['News-driven', 'Spikes on headlines, erratic moves', 'Reduce size, widen stops, or stand aside'],
  ], [110, 200, 202]);
  
  addSpacer(pdf, 15);
  addKeyConceptBox(pdf, 'IMPORTANT', 'The system does not change. Your EXPECTATIONS change based on conditions. In high volatility, the same setup might need 12 ticks of stop instead of 8. In low volatility, T1 might be 8 ticks instead of 15. Adapt the parameters, not the process.');
  
  drawPageFooter(pdf, 48);
}

// Module 14: Trade Journal Template
function createModule14(pdf: PDFGenerator) {
  addNewPage(pdf);
  drawPageHeader(pdf, 14, 'Daily Trade Journal');
  
  addTitle(pdf, 'MODULE 14');
  pdf.doc.setFont('helvetica', 'normal');
  pdf.doc.setFontSize(14);
  pdf.doc.setTextColor(100, 100, 100);
  pdf.doc.text('Daily Trade Journal Template', pdf.margin, pdf.currentY);
  pdf.currentY += 25;
  
  addParagraph(pdf, 'The tool that turns experience into expertise');
  
  addRuleBox(pdf, 'Complete this journal every single trading day. The journal is not optional. It is the mechanism through which screen time converts to skill. Without it, you repeat the same mistakes indefinitely. With it, you compound improvements daily.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Section A — Pre-Session');
  
  addTable(pdf, ['Field', 'Your Notes'], [
    ['Date', ''],
    ['Account Balance at Open', ''],
    ['Daily Loss Budget (Balance minus MLL)', ''],
    ['Key Economic Events Today', ''],
    ['Previous Day High (PDH)', ''],
    ['Previous Day Low (PDL)', ''],
    ['Overnight High', ''],
    ['Overnight Low', ''],
    ['200 MA Location', ''],
    ['Volume Profile POC', ''],
    ['Session Bias (Long / Short / Neutral)', ''],
    ['Three Reasons for Bias', ''],
    ['Mental State (Green / Yellow / Red)', ''],
  ], [250, 262]);
  
  drawPageFooter(pdf, 49);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 14, 'Daily Trade Journal');
  
  addSubtitle(pdf, 'Section B — Trade Log');
  
  addTable(pdf, ['Field', 'Trade 1', 'Trade 2', 'Trade 3'], [
    ['Time of Entry', '', '', ''],
    ['Direction (Long / Short)', '', '', ''],
    ['Entry Price', '', '', ''],
    ['Stop Loss Price', '', '', ''],
    ['T1 Target Price', '', '', ''],
    ['T2 Target Price', '', '', ''],
    ['Confluence Factors', '', '', ''],
    ['Contracts', '', '', ''],
    ['T1 Exit Price', '', '', ''],
    ['Final Exit Price', '', '', ''],
    ['P&L on Trade', '', '', ''],
    ['All Rules Followed? (Y/N)', '', '', ''],
    ['What Went Well?', '', '', ''],
    ['What to Improve?', '', '', ''],
  ], [150, 120, 120, 122]);
  
  drawPageFooter(pdf, 50);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 14, 'Daily Trade Journal');
  
  addSubtitle(pdf, 'Section C — Post-Session Summary');
  
  addTable(pdf, ['Field', 'Your Notes'], [
    ['Total Trades', ''],
    ['Winners / Losers', ''],
    ['Win Rate Today', ''],
    ['Total P&L', ''],
    ['Balance at Close', ''],
    ['Daily Limit Hit? (Y/N)', ''],
    ['Any Rule Violations? (Y/N + details)', ''],
    ['Best Trade — Why it Worked', ''],
    ['Worst Trade — What Went Wrong', ''],
    ['Setups Missed and Why You Passed', ''],
    ['One Improvement Goal for Tomorrow', ''],
    ['Mental State at Session End', ''],
  ], [250, 262]);
  
  addSpacer(pdf, 15);
  addKeyConceptBox(pdf, 'PRO TIP', 'Print 20 copies of this journal template. Keep them next to your trading station. Fill one out COMPLETELY every single day for 30 days. The patterns you discover will be worth more than any course.');
  
  drawPageFooter(pdf, 51);
}

// Module 15: Exercises
function createModule15(pdf: PDFGenerator) {
  addNewPage(pdf);
  drawPageHeader(pdf, 15, 'Exercises & Self-Assessment');
  
  addTitle(pdf, 'MODULE 15');
  pdf.doc.setFont('helvetica', 'normal');
  pdf.doc.setFontSize(14);
  pdf.doc.setTextColor(100, 100, 100);
  pdf.doc.text('Exercises & Self-Assessment', pdf.margin, pdf.currentY);
  pdf.currentY += 25;
  
  addParagraph(pdf, 'The drills that turn knowledge into automatic execution');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, '15.1 Daily Drills');
  
  pdf.doc.setFont('helvetica', 'bold');
  pdf.doc.setFontSize(11);
  pdf.doc.setTextColor(50, 50, 50);
  pdf.doc.text('Exercise 1 — Blind Level Identification', pdf.margin, pdf.currentY);
  pdf.currentY += 18;
  
  addBulletPoint(pdf, 'Open a chart with no indicators visible');
  addBulletPoint(pdf, 'Mark where you believe support and resistance are — eyes only');
  addBulletPoint(pdf, 'Now add your indicators. How close were you?');
  addBulletPoint(pdf, 'This builds instrument intuition independent of tools');
  
  addSpacer(pdf, 10);
  pdf.doc.setFont('helvetica', 'bold');
  pdf.doc.setFontSize(11);
  pdf.doc.setTextColor(50, 50, 50);
  pdf.doc.text('Exercise 2 — Historical Sweep Hunt', pdf.margin, pdf.currentY);
  pdf.currentY += 18;
  
  addBulletPoint(pdf, 'Open your primary chart and scroll back 2 weeks');
  addBulletPoint(pdf, 'Mark every single sweep that occurred — level broken, then immediately reversed');
  addBulletPoint(pdf, 'Note: Was it a double tap? What was the wick size? How many candles to reversal?');
  addBulletPoint(pdf, 'This builds pattern recognition for your specific instrument');
  
  addSpacer(pdf, 10);
  pdf.doc.setFont('helvetica', 'bold');
  pdf.doc.setFontSize(11);
  pdf.doc.setTextColor(50, 50, 50);
  pdf.doc.text('Exercise 3 — DOM Observation Session', pdf.margin, pdf.currentY);
  pdf.currentY += 18;
  
  addBulletPoint(pdf, 'During a session where you are NOT trading, watch only the DOM for 30 minutes');
  addBulletPoint(pdf, 'Call out absorption events when you see them — out loud');
  addBulletPoint(pdf, 'Note the price where absorption occurred');
  addBulletPoint(pdf, 'Check the chart afterward — was that price significant?');
  
  drawPageFooter(pdf, 52);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 15, 'Exercises & Self-Assessment');
  
  addSubtitle(pdf, '15.2 The 15-Question Knowledge Quiz');
  addParagraph(pdf, 'Answer every question below without referring to this workbook. You must pass before trading with real capital:');
  
  addTable(pdf, ['#', 'Question', 'Your Answer'], [
    ['1', 'What are the four confluence factors?', ''],
    ['2', 'Minimum confluence factors required to enter?', ''],
    ['3', 'What time does New York session open (CT)?', ''],
    ['4', 'What is a sweep vs. a breakout?', ''],
    ['5', 'Where does your stop go on a long from support?', ''],
    ['6', 'What do you do immediately after T1 is hit?', ''],
    ['7', 'What is absorption on the DOM?', ''],
    ['8', 'What is the two-loss rule and why does it exist?', ''],
    ['9', 'What is a Low Volume Node and why enter there?', ''],
    ['10', 'What are the three mental states?', ''],
    ['11', 'What is a double tap sweep?', ''],
    ['12', 'If 5m is bearish and 3m is bullish, what do you do?', ''],
    ['13', 'Maximum stop loss size for this system?', ''],
    ['14', 'What does HH/HL mean? What is your bias?', ''],
    ['15', 'What is the exact entry trigger rule?', ''],
  ], [25, 280, 207]);
  
  drawPageFooter(pdf, 53);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 15, 'Exercises & Self-Assessment');
  
  addSubtitle(pdf, '15.3 Go-Live Readiness Checklist');
  addParagraph(pdf, 'All answers must be YES before trading with real capital:');
  
  addTable(pdf, ['Readiness Question', 'Yes / No'], [
    ['Can I identify all 7 candle patterns instantly without looking them up?', ''],
    ['Can I mark full session levels in under 10 minutes?', ''],
    ['Can I explain a liquidity sweep to someone else in plain English?', ''],
    ['Do I know my daily loss limit for tomorrow\'s session right now?', ''],
    ['Have I paper traded for at least 2 weeks with consistent results?', ''],
    ['Can I read DOM absorption in real time?', ''],
    ['Do I have a journal entry for every practice session?', ''],
    ['Can I answer all 15 quiz questions above from memory?', ''],
    ['Do I know my current mental state and would I trade in it?', ''],
    ['Am I focused on following the rules — not on making money today?', ''],
  ], [400, 112]);
  
  addSpacer(pdf, 15);
  addWarningBox(pdf, 'IMPORTANT', 'If any answer is No, spend more time on that module. There is no deadline. Every day of preparation is worth 10 days of expensive on-the-job learning.');
  
  drawPageFooter(pdf, 54);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 15, 'Exercises & Self-Assessment');
  
  addSubtitle(pdf, '15.4 30-Day Challenge Tracker');
  addParagraph(pdf, 'Track 30 consecutive days of rule-following. Reset to Day 1 if you violate any rule:');
  
  const days: string[][] = [];
  for (let i = 1; i <= 30; i++) {
    days.push([`Day ${i}`, '', '', '']);
  }
  
  addTable(pdf, ['Day', 'Date', 'Rules Followed?', 'Notes'], days.slice(0, 15), [60, 100, 100, 252]);
  
  drawPageFooter(pdf, 55);
  
  addNewPage(pdf);
  drawPageHeader(pdf, 15, 'Exercises & Self-Assessment');
  
  addTable(pdf, ['Day', 'Date', 'Rules Followed?', 'Notes'], days.slice(15), [60, 100, 100, 252]);
  
  addSpacer(pdf, 15);
  addKeyConceptBox(pdf, 'GOAL', 'Complete 30 consecutive days with ALL rules followed before scaling position size. This proves you have internalized the system. Anything less means the habits are not yet automatic.');
  
  drawPageFooter(pdf, 56);
}

// Quick Reference Cards
function createQuickReferenceCards(pdf: PDFGenerator) {
  addNewPage(pdf);
  drawPageHeader(pdf);
  
  addTitle(pdf, 'Quick Reference Cards');
  addParagraph(pdf, 'Print these cards and keep them visible during trading sessions:');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Card 1: Pre-Trade Checklist');
  
  const { doc, margin, pageWidth } = pdf;
  const cardWidth = (pageWidth - margin * 2 - 20) / 2;
  
  // Card 1
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(margin, pdf.currentY, cardWidth, 180, 4, 4, 'F');
  doc.setDrawColor(0, 214, 143);
  doc.setLineWidth(2);
  doc.roundedRect(margin, pdf.currentY, cardWidth, 180, 4, 4, 'S');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 214, 143);
  doc.text('PRE-TRADE CHECKLIST', margin + 10, pdf.currentY + 20);
  
  const checklistItems = [
    '[ ] Bias determined?',
    '[ ] Level identified?',
    '[ ] 3+ confluence factors?',
    '[ ] Stop loss set?',
    '[ ] T1 target set?',
    '[ ] R:R 1:1.5+?',
    '[ ] Within daily budget?',
    '[ ] Candle closed?',
  ];
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  checklistItems.forEach((item, i) => {
    doc.text(item, margin + 15, pdf.currentY + 38 + (i * 17));
  });
  
  // Card 2
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(margin + cardWidth + 20, pdf.currentY, cardWidth, 180, 4, 4, 'F');
  doc.setDrawColor(0, 214, 143);
  doc.setLineWidth(2);
  doc.roundedRect(margin + cardWidth + 20, pdf.currentY, cardWidth, 180, 4, 4, 'S');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 214, 143);
  doc.text('THE 4 CONFLUENCE FACTORS', margin + cardWidth + 30, pdf.currentY + 20);
  
  const confluenceItems = [
    '1. MA Stack (8 > 20 > 50)',
    '2. Key Level Touch',
    '3. Candle Confirmation',
    '4. DOM Absorption',
    '',
    'MIN 3 OF 4 REQUIRED',
    '',
    'NO EXCEPTIONS',
  ];
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  confluenceItems.forEach((item, i) => {
    if (item.includes('MIN') || item.includes('NO EXCEPTIONS')) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(200, 50, 50);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
    }
    doc.text(item, margin + cardWidth + 35, pdf.currentY + 38 + (i * 17));
  });
  
  pdf.currentY += 200;
  
  addSubtitle(pdf, 'Card 2: Entry Rules');
  
  // Card 3
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(margin, pdf.currentY, cardWidth, 150, 4, 4, 'F');
  doc.setDrawColor(0, 214, 143);
  doc.setLineWidth(2);
  doc.roundedRect(margin, pdf.currentY, cardWidth, 150, 4, 4, 'S');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 214, 143);
  doc.text('ENTRY RULES', margin + 10, pdf.currentY + 20);
  
  const entryRules = [
    'Wait for CANDLE CLOSE',
    'Enter on NEXT candle open',
    'Stop BEYOND the wick + 2-3',
    'Max stop: 10 TICKS',
    'Min R:R: 1:1.5',
  ];
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  entryRules.forEach((item, i) => {
    doc.text(item, margin + 15, pdf.currentY + 38 + (i * 20));
  });
  
  // Card 4
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(margin + cardWidth + 20, pdf.currentY, cardWidth, 150, 4, 4, 'F');
  doc.setDrawColor(0, 214, 143);
  doc.setLineWidth(2);
  doc.roundedRect(margin + cardWidth + 20, pdf.currentY, cardWidth, 150, 4, 4, 'S');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 214, 143);
  doc.text('TARGET SYSTEM', margin + cardWidth + 30, pdf.currentY + 20);
  
  const targetRules = [
    'T1: 50% → Move to BE',
    'T2: 30% → Trail stop',
    'T3: 20% → Let it run',
    '',
    'ALWAYS take T1',
  ];
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  targetRules.forEach((item, i) => {
    if (item.includes('ALWAYS')) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(200, 50, 50);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
    }
    doc.text(item, margin + cardWidth + 35, pdf.currentY + 38 + (i * 20));
  });
  
  drawPageFooter(pdf, 57);
}

// Closing Statement
function createClosingStatement(pdf: PDFGenerator) {
  addNewPage(pdf);
  
  const { doc, pageWidth, pageHeight, margin } = pdf;
  
  // Dark background
  doc.setFillColor(7, 12, 17);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Accent lines
  doc.setFillColor(0, 214, 143);
  doc.rect(0, 0, pageWidth, 4, 'F');
  doc.rect(0, pageHeight - 4, pageWidth, 4, 'F');
  
  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(0, 214, 143);
  doc.text('CLOSING STATEMENT', pageWidth / 2, 100, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(150, 170, 190);
  doc.text('From The Session Method', pageWidth / 2, 125, { align: 'center' });
  
  // Main quote
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text('Trading is a skill —', pageWidth / 2, 200, { align: 'center' });
  doc.setTextColor(0, 214, 143);
  doc.text('not a lottery.', pageWidth / 2, 235, { align: 'center' });
  
  // Body text
  const bodyText = [
    'Every consistent profitable trader you have ever seen got there by',
    'doing the unglamorous work: marking levels when they would rather',
    'sleep, journaling losses when it was painful, staying flat when every',
    'instinct screamed to trade, and following rules on the days when',
    'breaking them would have felt better.',
    '',
    'This workbook contains everything you need to build a legitimate',
    'edge. The strategy is sound. The risk management is conservative',
    'enough to keep you in the game long enough to learn. The psychological',
    'framework is built from the real patterns that destroy most traders',
    'before they ever get consistent.',
  ];
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(180, 190, 200);
  bodyText.forEach((line, i) => {
    doc.text(line, pageWidth / 2, 300 + (i * 22), { align: 'center' });
  });
  
  // Final statement
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 214, 143);
  doc.text('Master the rules first.', pageWidth / 2, 560, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.text('The money follows the process.', pageWidth / 2, 590, { align: 'center' });
  
  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 100, 120);
  doc.text('THE SESSION BLUEPRINT  |  The Session Method  |  © 2026  |  All Rights Reserved', pageWidth / 2, pageHeight - 40, { align: 'center' });
}

// Main export function
export function generateWorkbookPDF(): Uint8Array {
  const pdf = createPDF();
  
  // Cover page
  createCoverPage(pdf);
  
  // Credibility & Value pages
  createCredibilityPage(pdf);
  createValuePage(pdf);
  createCopyrightPage(pdf);
  createTableOfContents(pdf);
  
  // All modules
  createModule1(pdf);
  createModule2(pdf);
  createModule3(pdf);
  createModule4(pdf);
  createModule5(pdf);
  createModule6(pdf);
  createModule7(pdf);
  createModule8(pdf);
  createModule9(pdf);
  createModule10(pdf);
  createModule11(pdf);
  createModule12(pdf);
  createModule13(pdf);
  createModule14(pdf);
  createModule15(pdf);
  
  // Reference cards and closing
  createQuickReferenceCards(pdf);
  createClosingStatement(pdf);
  
  return pdf.doc.output('arraybuffer') as unknown as Uint8Array;
}
