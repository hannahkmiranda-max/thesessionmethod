import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

// Brand colors from the website
const colors = {
  primary: '#00D68F',
  dark: '#070C11',
  darkPanel: '#111A24',
  border: '#1B2A3A',
  text: '#1A1A1A',
  textLight: '#4A5568',
  textMuted: '#718096',
  white: '#FFFFFF',
  pageAccent: '#00D68F',
};

function createPDF() {
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

function addNewPage(pdf) {
  pdf.doc.addPage();
  pdf.currentY = 50;
}

function drawPageHeader(pdf, moduleNum, moduleTitle) {
  const { doc, pageWidth, margin } = pdf;
  
  doc.setFillColor(0, 214, 143);
  doc.rect(0, 0, pageWidth, 4, 'F');
  
  doc.setFillColor(7, 12, 17);
  doc.rect(0, 4, pageWidth, 50, 'F');
  
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

function drawPageFooter(pdf, pageNum) {
  const { doc, pageWidth, pageHeight, margin } = pdf;
  
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, pageHeight - 40, pageWidth - margin, pageHeight - 40);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`THE SESSION BLUEPRINT  |  The Session Method  |  ${pageNum}`, pageWidth / 2, pageHeight - 25, { align: 'center' });
}

function addTitle(pdf, text, fontSize = 28) {
  const { doc, margin } = pdf;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fontSize);
  doc.setTextColor(26, 26, 26);
  doc.text(text, margin, pdf.currentY);
  pdf.currentY += fontSize + 12;
}

function addSubtitle(pdf, text, fontSize = 14) {
  const { doc, margin } = pdf;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fontSize);
  doc.setTextColor(0, 214, 143);
  doc.text(text, margin, pdf.currentY);
  pdf.currentY += fontSize + 10;
}

function addParagraph(pdf, text, fontSize = 11) {
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

function addBulletPoint(pdf, text, indent = 0) {
  const { doc, margin, pageWidth, pageHeight } = pdf;
  const maxWidth = pageWidth - (margin * 2) - 20 - indent;
  
  if (pdf.currentY > pageHeight - 60) {
    addNewPage(pdf);
    drawPageHeader(pdf);
  }
  
  doc.setFillColor(0, 214, 143);
  doc.circle(margin + indent + 5, pdf.currentY - 4, 2.5, 'F');
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  
  const lines = doc.splitTextToSize(text, maxWidth);
  lines.forEach((line, i) => {
    doc.text(line, margin + indent + 15, pdf.currentY + (i * 15));
  });
  pdf.currentY += lines.length * 15 + 6;
}

function addKeyConceptBox(pdf, title, content) {
  const { doc, margin, pageWidth, pageHeight } = pdf;
  const boxWidth = pageWidth - (margin * 2);
  
  if (pdf.currentY > pageHeight - 120) {
    addNewPage(pdf);
    drawPageHeader(pdf);
  }
  
  doc.setFontSize(10);
  const contentLines = doc.splitTextToSize(content, boxWidth - 30);
  const boxHeight = 35 + (contentLines.length * 14);
  
  doc.setFillColor(240, 253, 249);
  doc.roundedRect(margin, pdf.currentY, boxWidth, boxHeight, 4, 4, 'F');
  
  doc.setFillColor(0, 214, 143);
  doc.rect(margin, pdf.currentY, 4, boxHeight, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 150, 100);
  doc.text(title, margin + 15, pdf.currentY + 18);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  contentLines.forEach((line, i) => {
    doc.text(line, margin + 15, pdf.currentY + 32 + (i * 14));
  });
  
  pdf.currentY += boxHeight + 16;
}

function addWarningBox(pdf, title, content) {
  const { doc, margin, pageWidth, pageHeight } = pdf;
  const boxWidth = pageWidth - (margin * 2);
  
  if (pdf.currentY > pageHeight - 120) {
    addNewPage(pdf);
    drawPageHeader(pdf);
  }
  
  doc.setFontSize(10);
  const contentLines = doc.splitTextToSize(content, boxWidth - 30);
  const boxHeight = 35 + (contentLines.length * 14);
  
  doc.setFillColor(255, 251, 235);
  doc.roundedRect(margin, pdf.currentY, boxWidth, boxHeight, 4, 4, 'F');
  
  doc.setFillColor(245, 158, 11);
  doc.rect(margin, pdf.currentY, 4, boxHeight, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(180, 100, 0);
  doc.text(title, margin + 15, pdf.currentY + 18);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 50, 40);
  contentLines.forEach((line, i) => {
    doc.text(line, margin + 15, pdf.currentY + 32 + (i * 14));
  });
  
  pdf.currentY += boxHeight + 16;
}

function addRuleBox(pdf, content) {
  const { doc, margin, pageWidth, pageHeight } = pdf;
  const boxWidth = pageWidth - (margin * 2);
  
  if (pdf.currentY > pageHeight - 100) {
    addNewPage(pdf);
    drawPageHeader(pdf);
  }
  
  doc.setFontSize(10);
  const contentLines = doc.splitTextToSize(content, boxWidth - 30);
  const boxHeight = 35 + (contentLines.length * 14);
  
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(margin, pdf.currentY, boxWidth, boxHeight, 4, 4, 'F');
  
  doc.setFillColor(239, 68, 68);
  doc.rect(margin, pdf.currentY, 4, boxHeight, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(180, 50, 50);
  doc.text('RULE', margin + 15, pdf.currentY + 18);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 40, 40);
  contentLines.forEach((line, i) => {
    doc.text(line, margin + 15, pdf.currentY + 32 + (i * 14));
  });
  
  pdf.currentY += boxHeight + 16;
}

function addTable(pdf, headers, rows, colWidths) {
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
  
  rows.forEach((row, rowIndex) => {
    if (pdf.currentY > pageHeight - 60) {
      addNewPage(pdf);
      drawPageHeader(pdf);
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
  
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(margin, pdf.currentY - (rows.length + 1) * rowHeight, tableWidth, (rows.length + 1) * rowHeight);
  
  pdf.currentY += 16;
}

function addSpacer(pdf, height = 20) {
  pdf.currentY += height;
}

function addCheckbox(pdf, text, checked = false) {
  const { doc, margin, pageHeight } = pdf;
  
  if (pdf.currentY > pageHeight - 40) {
    addNewPage(pdf);
    drawPageHeader(pdf);
  }
  
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(1);
  doc.rect(margin, pdf.currentY - 10, 12, 12);
  
  if (checked) {
    doc.setFillColor(0, 214, 143);
    doc.rect(margin + 2, pdf.currentY - 8, 8, 8, 'F');
  }
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  doc.text(text, margin + 20, pdf.currentY);
  
  pdf.currentY += 22;
}

function addNumberedItem(pdf, number, text) {
  const { doc, margin, pageWidth, pageHeight } = pdf;
  
  if (pdf.currentY > pageHeight - 60) {
    addNewPage(pdf);
    drawPageHeader(pdf);
  }
  
  doc.setFillColor(0, 214, 143);
  doc.circle(margin + 10, pdf.currentY - 4, 10, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(String(number), margin + 10, pdf.currentY, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  
  const lines = doc.splitTextToSize(text, pageWidth - margin * 2 - 35);
  lines.forEach((line, i) => {
    doc.text(line, margin + 28, pdf.currentY + (i * 15));
  });
  
  pdf.currentY += lines.length * 15 + 10;
}

// COVER PAGE
function createCoverPage(pdf) {
  const { doc, pageWidth, pageHeight } = pdf;
  
  doc.setFillColor(7, 12, 17);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setFillColor(0, 214, 143);
  doc.rect(0, 0, pageWidth, 6, 'F');
  doc.rect(0, pageHeight - 6, pageWidth, 6, 'F');
  
  doc.setDrawColor(20, 35, 50);
  doc.setLineWidth(0.3);
  for (let x = 50; x < pageWidth - 50; x += 30) {
    doc.line(x, 100, x, pageHeight - 100);
  }
  for (let y = 100; y < pageHeight - 100; y += 30) {
    doc.line(50, y, pageWidth - 50, y);
  }
  
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
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(150, 170, 190);
  doc.text('The Complete Institutional Trading System', pageWidth / 2, 400, { align: 'center' });
  doc.text('for Consistent Futures Profits', pageWidth / 2, 420, { align: 'center' });
  
  const badges = [
    'INSTITUTIONAL ORDER FLOW',
    'LIQUIDITY SWEEP MASTERY',
    '60%+ WIN RATE SYSTEM',
  ];
  
  let badgeY = 480;
  badges.forEach((badge) => {
    doc.setFillColor(17, 26, 36);
    const badgeWidth = doc.getTextWidth(badge) + 40;
    doc.roundedRect((pageWidth - badgeWidth) / 2, badgeY - 12, badgeWidth, 24, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 214, 143);
    doc.text(badge, pageWidth / 2, badgeY + 4, { align: 'center' });
    badgeY += 36;
  });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 120, 140);
  doc.text('COMPATIBLE INSTRUMENTS', pageWidth / 2, 620, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(150, 170, 190);
  doc.text('/MES  |  /MNQ  |  /MGC  |  /MCL  |  /6E  |  EUR/USD  |  GBP/USD  |  /NQ  |  /ES', pageWidth / 2, 640, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 100, 120);
  doc.text('Copyright 2026 The Session Method. All Rights Reserved.', pageWidth / 2, pageHeight - 60, { align: 'center' });
  doc.text('Version 1.0  |  Premium Edition', pageWidth / 2, pageHeight - 45, { align: 'center' });
}

// CREDIBILITY PAGE
function createCredibilityPage(pdf) {
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

// VALUE PAGE
function createValuePage(pdf) {
  addNewPage(pdf);
  drawPageHeader(pdf);
  
  addTitle(pdf, 'What You Are Getting');
  addSpacer(pdf, 10);
  
  const valueItems = [
    ['Complete Trading System', '$2,500+ Value', 'The full institutional order flow methodology'],
    ['15 In-Depth Modules', '$1,500+ Value', 'From foundation to advanced analysis'],
    ['Level Marking Framework', '$500+ Value', 'Pre-market ritual for high-probability zones'],
    ['Confluence Entry System', '$750+ Value', 'Four-factor verification system'],
    ['DOM Reading Mastery', '$800+ Value', 'See where institutional orders hide'],
    ['Risk Management Rules', '$500+ Value', 'Position sizing and daily limits'],
    ['Psychology Framework', '$400+ Value', 'Mental models for winning traders'],
    ['Daily Trade Journal', '$300+ Value', 'Professional tracking template'],
    ['180-Day Development Plan', '$250+ Value', 'Roadmap to consistent profitability'],
    ['Exercise & Assessment', '$200+ Value', 'Self-evaluation tools'],
  ];
  
  addTable(pdf, ['Component', 'Value', 'Description'], valueItems, [150, 80, 282]);
  
  addSpacer(pdf, 20);
  
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

// COPYRIGHT PAGE
function createCopyrightPage(pdf) {
  addNewPage(pdf);
  drawPageHeader(pdf);
  
  addTitle(pdf, 'Copyright & Legal Notice');
  addSpacer(pdf, 10);
  
  addParagraph(pdf, 'Copyright 2026 The Session Method. All Rights Reserved.');
  addParagraph(pdf, 'This digital product - including all text, charts, illustrations, frameworks, systems, checklists, tables, and methodologies contained within - is the exclusive intellectual property of The Session Method.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'What You Are Permitted To Do');
  addBulletPoint(pdf, 'Use this workbook for your own personal trading education and development');
  addBulletPoint(pdf, 'Reference the concepts and strategies in your own trading practice');
  addBulletPoint(pdf, 'Print one personal copy for your own study use');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'What Is Strictly Prohibited');
  addBulletPoint(pdf, 'Reselling, redistributing, or sharing this workbook in any form');
  addBulletPoint(pdf, 'Reproducing or copying any portion for commercial use');
  addBulletPoint(pdf, 'Uploading to any file-sharing or course platform');
  addBulletPoint(pdf, 'Teaching these materials as your own methodology');
  addBulletPoint(pdf, 'Removing or altering any copyright notices');
  
  addSpacer(pdf, 15);
  addRuleBox(pdf, 'Violation of these terms constitutes copyright infringement and will be pursued to the full extent of applicable law. All purchases are tracked and logged.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Disclaimer');
  addParagraph(pdf, 'Trading futures, forex, and other financial instruments involves substantial risk of loss. The strategies presented are for educational purposes only. Past results are not indicative of future performance. You are solely responsible for your own trading decisions. Only trade with capital you can afford to lose.');
  
  drawPageFooter(pdf, 4);
}

// TABLE OF CONTENTS
function createTableOfContents(pdf) {
  addNewPage(pdf);
  drawPageHeader(pdf);
  
  addTitle(pdf, 'Table of Contents');
  addSpacer(pdf, 20);
  
  const tocItems = [
    ['Why This System Works', '2'],
    ['What You Are Getting', '3'],
    ['Copyright & Legal Notice', '4'],
    ['MODULE 1 - Understanding the Foundation', '6'],
    ['MODULE 2 - Compatible Instruments', '8'],
    ['MODULE 3 - The Three Sessions', '10'],
    ['MODULE 4 - Level Marking Pre-Market Ritual', '13'],
    ['MODULE 5 - The Confluence Entry System', '16'],
    ['MODULE 6 - Liquidity Sweep Zones Mastery', '20'],
    ['MODULE 7 - Price Action & Candle Reading', '24'],
    ['MODULE 8 - Depth of Market (DOM) Mastery', '28'],
    ['MODULE 9 - Trade Management Rules', '31'],
    ['MODULE 10 - Risk Management & Position Sizing', '34'],
    ['MODULE 11 - Trading Psychology & Discipline', '37'],
    ['MODULE 12 - The Daily Routine', '41'],
    ['MODULE 13 - Advanced Concepts', '44'],
    ['MODULE 14 - Daily Trade Journal Template', '49'],
    ['MODULE 15 - Exercises & Self-Assessment', '52'],
    ['Quick Reference Cards', '56'],
    ['Closing Statement', '58'],
  ];
  
  const { doc, margin, pageWidth } = pdf;
  
  tocItems.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text(item[0], margin, pdf.currentY);
    
    const dotWidth = pageWidth - margin * 2 - doc.getTextWidth(item[0]) - 30;
    const dots = '.'.repeat(Math.floor(dotWidth / 3));
    doc.setTextColor(180, 180, 180);
    doc.text(dots, margin + doc.getTextWidth(item[0]) + 5, pdf.currentY);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 214, 143);
    doc.text(item[1], pageWidth - margin, pdf.currentY, { align: 'right' });
    
    pdf.currentY += 22;
  });
  
  drawPageFooter(pdf, 5);
}

// MODULE 1: Understanding the Foundation
function createModule1(pdf) {
  addNewPage(pdf);
  drawPageHeader(pdf, 1, 'Understanding the Foundation');
  
  addTitle(pdf, 'Module 1: Understanding the Foundation');
  addSpacer(pdf, 10);
  
  addParagraph(pdf, 'Before you can trade profitably, you must understand what actually moves markets. This is not theory - this is the fundamental reality of how institutional money operates.');
  
  addSpacer(pdf, 10);
  addSubtitle(pdf, 'The Retail Trader Trap');
  addParagraph(pdf, 'Most retail traders lose money because they are trading against the very institutions that move price. They place stops where everyone else places stops, enter where everyone else enters, and get stopped out right before price moves in their originally intended direction.');
  
  addKeyConceptBox(pdf, 'KEY INSIGHT', 'Institutional traders cannot simply buy or sell at a single price. Their orders are too large. They need liquidity - and the easiest source of liquidity is retail traders\' stop losses.');
  
  addSpacer(pdf, 10);
  addSubtitle(pdf, 'How Markets Actually Move');
  addParagraph(pdf, 'Price does not move randomly. It moves from liquidity pool to liquidity pool. Institutions engineer price moves to these pools (where retail stops are clustered), fill their orders against those stops, and then let price move in their intended direction.');
  
  addBulletPoint(pdf, 'Price sweeps above a previous high to trigger buy stops (sellers get filled)');
  addBulletPoint(pdf, 'Price sweeps below a previous low to trigger sell stops (buyers get filled)');
  addBulletPoint(pdf, 'After the sweep, price reverses and moves in the opposite direction');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'The Session Method Philosophy');
  
  addNumberedItem(pdf, 1, 'Trade with institutions, not against them - Identify where they are likely filling orders');
  addNumberedItem(pdf, 2, 'Wait for confirmation - Do not anticipate; react to what price shows you');
  addNumberedItem(pdf, 3, 'Protect capital first - Survival is more important than any single trade');
  addNumberedItem(pdf, 4, 'Session-based focus - Trade when institutional volume is highest');
  
  addSpacer(pdf, 15);
  addWarningBox(pdf, 'COMMON MISTAKE', 'Thinking you can "predict" what institutions will do. You cannot. You can only identify high-probability setups after they show their hand.');
  
  drawPageFooter(pdf, 6);
  
  // Module 1 continued
  addNewPage(pdf);
  drawPageHeader(pdf, 1, 'Understanding the Foundation');
  
  addSubtitle(pdf, 'The Three Pillars of This System');
  
  addParagraph(pdf, '1. STRUCTURE - Understanding where key levels are and why they matter');
  addParagraph(pdf, '2. CONFIRMATION - Waiting for price to show institutional involvement');
  addParagraph(pdf, '3. MANAGEMENT - Protecting capital and managing winners');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'What You Need to Succeed');
  
  addBulletPoint(pdf, 'A funded trading account (prop firm or personal)');
  addBulletPoint(pdf, 'A charting platform with DOM capability (NinjaTrader, Sierra Chart, etc.)');
  addBulletPoint(pdf, 'A quiet trading environment free from distractions');
  addBulletPoint(pdf, 'Minimum 2-3 hours of focused screen time during active sessions');
  addBulletPoint(pdf, 'Willingness to follow rules without exception');
  addBulletPoint(pdf, 'Patience to wait for A+ setups only');
  
  addSpacer(pdf, 15);
  addKeyConceptBox(pdf, 'FOUNDATION RULE', 'This system is designed for traders who are serious about consistent profitability. If you are looking for excitement or gambling, this is not the right approach. We prioritize consistency over home runs.');
  
  addSpacer(pdf, 20);
  addSubtitle(pdf, 'Module 1 Checklist');
  addCheckbox(pdf, 'I understand that institutions drive market moves');
  addCheckbox(pdf, 'I understand the concept of liquidity pools and stop hunts');
  addCheckbox(pdf, 'I commit to trading with confirmation, not anticipation');
  addCheckbox(pdf, 'I have the necessary tools and environment to trade properly');
  
  drawPageFooter(pdf, 7);
}

// MODULE 2: Compatible Instruments
function createModule2(pdf) {
  addNewPage(pdf);
  drawPageHeader(pdf, 2, 'Compatible Instruments');
  
  addTitle(pdf, 'Module 2: Compatible Instruments');
  addSpacer(pdf, 10);
  
  addParagraph(pdf, 'This system works on liquid, session-based markets where institutional order flow is predictable. Not all instruments are created equal - we focus on those with the best risk:reward characteristics.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Primary Instruments (Recommended)');
  
  const primaryInstruments = [
    ['/MES', 'Micro E-mini S&P 500', '$1.25/tick', '$5/point', 'Excellent for learning'],
    ['/MNQ', 'Micro E-mini Nasdaq', '$0.50/tick', '$2/point', 'Higher volatility'],
    ['/ES', 'E-mini S&P 500', '$12.50/tick', '$50/point', 'Full-size contracts'],
    ['/NQ', 'E-mini Nasdaq', '$5/tick', '$20/point', 'Larger moves'],
  ];
  
  addTable(pdf, ['Symbol', 'Name', 'Tick Value', 'Point Value', 'Notes'], primaryInstruments, [60, 140, 70, 70, 172]);
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Secondary Instruments');
  
  const secondaryInstruments = [
    ['/MGC', 'Micro Gold', '$1/tick', '$10/point', 'Commodity exposure'],
    ['/MCL', 'Micro Crude', '$1/tick', '$10/point', 'Oil volatility'],
    ['/6E', 'Euro FX Futures', '$6.25/tick', '$12.50/pip', 'Currency futures'],
    ['EUR/USD', 'Euro/Dollar Spot', 'Variable', 'Broker dep.', 'Forex spot'],
    ['GBP/USD', 'Pound/Dollar Spot', 'Variable', 'Broker dep.', 'Forex spot'],
  ];
  
  addTable(pdf, ['Symbol', 'Name', 'Tick Value', 'Point Value', 'Notes'], secondaryInstruments, [60, 130, 70, 70, 182]);
  
  addSpacer(pdf, 15);
  addWarningBox(pdf, 'IMPORTANT', 'Start with /MES or /MNQ. The micro contracts allow you to learn the system with minimal capital at risk. Do not trade full-size contracts until you are consistently profitable on micros.');
  
  drawPageFooter(pdf, 8);
  
  // Module 2 continued
  addNewPage(pdf);
  drawPageHeader(pdf, 2, 'Compatible Instruments');
  
  addSubtitle(pdf, 'Why These Instruments Work');
  
  addBulletPoint(pdf, 'High liquidity ensures tight spreads and reliable fills');
  addBulletPoint(pdf, 'Session-based volatility creates predictable trading windows');
  addBulletPoint(pdf, 'Institutional presence means order flow concepts apply cleanly');
  addBulletPoint(pdf, 'Transparent DOM shows real order placement');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Instruments to AVOID');
  
  addBulletPoint(pdf, 'Illiquid futures with wide spreads');
  addBulletPoint(pdf, 'Exotic forex pairs with unpredictable behavior');
  addBulletPoint(pdf, 'Cryptocurrencies (different market structure)');
  addBulletPoint(pdf, 'Penny stocks or low-volume equities');
  
  addSpacer(pdf, 15);
  addKeyConceptBox(pdf, 'SELECTION RULE', 'Master one instrument before adding another. Deep familiarity with how YOUR instrument moves, reacts to news, and behaves during different sessions is more valuable than surface-level knowledge of many instruments.');
  
  addSpacer(pdf, 20);
  addSubtitle(pdf, 'Module 2 Checklist');
  addCheckbox(pdf, 'I have selected my primary instrument to focus on');
  addCheckbox(pdf, 'I understand the tick and point values for my instrument');
  addCheckbox(pdf, 'I have access to trade this instrument on my platform');
  addCheckbox(pdf, 'I commit to mastering one instrument before adding others');
  
  drawPageFooter(pdf, 9);
}

// MODULE 3: The Three Sessions
function createModule3(pdf) {
  addNewPage(pdf);
  drawPageHeader(pdf, 3, 'The Three Sessions');
  
  addTitle(pdf, 'Module 3: The Three Sessions');
  addSpacer(pdf, 10);
  
  addParagraph(pdf, 'Markets are not equally active throughout the day. Understanding session timing is crucial because institutional volume - and therefore predictable price movement - concentrates during specific windows.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'The Asian Session (7:00 PM - 2:00 AM EST)');
  
  addParagraph(pdf, 'Characteristics:');
  addBulletPoint(pdf, 'Lowest volume of the three sessions for US index futures');
  addBulletPoint(pdf, 'Often establishes range that will be broken later');
  addBulletPoint(pdf, 'Good for level identification, not optimal for trading');
  
  addKeyConceptBox(pdf, 'ASIAN SESSION FOCUS', 'Use this time to mark key levels from the prior day. Note the Asian session high and low - these become targets for later session sweeps.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'The London Session (2:00 AM - 8:00 AM EST)');
  
  addParagraph(pdf, 'Characteristics:');
  addBulletPoint(pdf, 'Major increase in volume as European markets open');
  addBulletPoint(pdf, 'Often sweeps Asian session highs or lows');
  addBulletPoint(pdf, 'Can establish the daily direction before NY opens');
  addBulletPoint(pdf, 'High-probability setups occur during London open (2:00-4:00 AM EST)');
  
  addWarningBox(pdf, 'LONDON TRAP', 'The London session frequently creates a false move that gets reversed during the New York session. Be aware of this pattern.');
  
  drawPageFooter(pdf, 10);
  
  // Module 3 continued
  addNewPage(pdf);
  drawPageHeader(pdf, 3, 'The Three Sessions');
  
  addSubtitle(pdf, 'The New York Session (8:00 AM - 5:00 PM EST)');
  
  addParagraph(pdf, 'Characteristics:');
  addBulletPoint(pdf, 'Highest volume and most significant moves for US futures');
  addBulletPoint(pdf, 'Two distinct phases: Morning (8:00 AM - 12:00 PM) and Afternoon (12:00 PM - 4:00 PM)');
  addBulletPoint(pdf, 'Major moves often occur around economic releases');
  addBulletPoint(pdf, 'Last hour can see significant positioning before close');
  
  addKeyConceptBox(pdf, 'OPTIMAL TRADING WINDOWS', 'The highest-probability setups occur during: (1) London Open 2:00-4:00 AM EST, (2) NY Open 8:30-11:00 AM EST, and (3) NY Afternoon 2:00-3:30 PM EST. Focus your energy on these windows.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Session Overlap');
  
  addParagraph(pdf, 'The period from 8:00 AM to 12:00 PM EST sees overlap between London and New York. This is often the most volatile and liquid period of the day. Key events during this window:');
  
  addBulletPoint(pdf, '8:30 AM - Major economic releases (NFP, CPI, GDP)');
  addBulletPoint(pdf, '9:30 AM - US equity market open');
  addBulletPoint(pdf, '10:00 AM - Additional economic data');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Weekly Session Patterns');
  
  const weeklyPatterns = [
    ['Monday', 'Often sets weekly range; less predictable', 'Caution'],
    ['Tuesday', 'Typically clean moves; good trading day', 'Favorable'],
    ['Wednesday', 'FOMC days can be volatile', 'Check calendar'],
    ['Thursday', 'Often continues Tuesday/Wednesday moves', 'Favorable'],
    ['Friday', 'Position squaring before weekend', 'Lighter size'],
  ];
  
  addTable(pdf, ['Day', 'Pattern', 'Approach'], weeklyPatterns, [80, 280, 152]);
  
  drawPageFooter(pdf, 11);
  
  // Module 3 page 3
  addNewPage(pdf);
  drawPageHeader(pdf, 3, 'The Three Sessions');
  
  addSubtitle(pdf, 'News Events to Track');
  
  addParagraph(pdf, 'High-impact economic releases create volatility. Know these in advance:');
  
  addBulletPoint(pdf, 'Non-Farm Payrolls (NFP) - First Friday of each month, 8:30 AM EST');
  addBulletPoint(pdf, 'Consumer Price Index (CPI) - Monthly, 8:30 AM EST');
  addBulletPoint(pdf, 'FOMC Interest Rate Decisions - Every 6 weeks, 2:00 PM EST');
  addBulletPoint(pdf, 'GDP Reports - Quarterly, 8:30 AM EST');
  addBulletPoint(pdf, 'Weekly Jobless Claims - Every Thursday, 8:30 AM EST');
  
  addSpacer(pdf, 10);
  addRuleBox(pdf, 'Never hold a position through a high-impact news event unless you have already locked in profits and are playing with house money. The volatility can stop you out instantly.');
  
  addSpacer(pdf, 20);
  addSubtitle(pdf, 'Module 3 Checklist');
  addCheckbox(pdf, 'I know the times for each session in my local timezone');
  addCheckbox(pdf, 'I have identified which session(s) I can realistically trade');
  addCheckbox(pdf, 'I have bookmarked an economic calendar');
  addCheckbox(pdf, 'I understand the risks of trading through news events');
  
  drawPageFooter(pdf, 12);
}

// MODULE 4: Level Marking
function createModule4(pdf) {
  addNewPage(pdf);
  drawPageHeader(pdf, 4, 'Level Marking Pre-Market Ritual');
  
  addTitle(pdf, 'Module 4: Level Marking');
  addSubtitle(pdf, 'Your Pre-Market Ritual');
  addSpacer(pdf, 10);
  
  addParagraph(pdf, 'Every successful trading day begins before the market opens. Your pre-market ritual is not optional - it is the foundation of everything that follows. These levels become your roadmap for the day.');
  
  addSpacer(pdf, 10);
  addSubtitle(pdf, 'The Daily Prep Routine');
  
  addNumberedItem(pdf, 1, 'Mark the prior day high and low - These are the first liquidity targets');
  addNumberedItem(pdf, 2, 'Mark the Asian session high and low - Often swept by London');
  addNumberedItem(pdf, 3, 'Mark the prior week high and low - Weekly timeframe levels');
  addNumberedItem(pdf, 4, 'Identify clean equal highs/lows - These are liquidity magnets');
  addNumberedItem(pdf, 5, 'Note any unfilled fair value gaps - Price tends to return');
  addNumberedItem(pdf, 6, 'Check the economic calendar - Know what releases are coming');
  
  addSpacer(pdf, 15);
  addKeyConceptBox(pdf, 'LEVEL HIERARCHY', 'Not all levels are equal. Weekly levels > Daily levels > Session levels. When multiple levels cluster in the same area (confluence), that zone becomes extremely significant.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Level Types');
  
  const levelTypes = [
    ['Prior Day High (PDH)', 'Strong resistance/liquidity', 'Red'],
    ['Prior Day Low (PDL)', 'Strong support/liquidity', 'Red'],
    ['Asian High/Low', 'Session reference', 'Orange'],
    ['Weekly High/Low', 'Major structure', 'Blue'],
    ['Equal Highs/Lows', 'Liquidity pools', 'Yellow'],
    ['Fair Value Gaps (FVG)', 'Imbalance zones', 'Purple'],
  ];
  
  addTable(pdf, ['Level Type', 'Significance', 'Suggested Color'], levelTypes, [180, 220, 112]);
  
  drawPageFooter(pdf, 13);
  
  // Module 4 page 2
  addNewPage(pdf);
  drawPageHeader(pdf, 4, 'Level Marking Pre-Market Ritual');
  
  addSubtitle(pdf, 'What Makes a Level Valid');
  
  addParagraph(pdf, 'Not every swing high or low deserves a line on your chart. Quality levels have these characteristics:');
  
  addBulletPoint(pdf, 'Clear rejection - Price moved away decisively from the level');
  addBulletPoint(pdf, 'Multiple touches - The more times price respects a level, the more significant');
  addBulletPoint(pdf, 'Timeframe alignment - Levels visible on higher timeframes are stronger');
  addBulletPoint(pdf, 'Untested status - Levels that have not been revisited hold more potential energy');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Fair Value Gaps (FVG)');
  
  addParagraph(pdf, 'A Fair Value Gap occurs when price moves so aggressively that it leaves an "imbalance" - a zone where there was no two-way trading. These gaps act as magnets for price.');
  
  addBulletPoint(pdf, 'Bullish FVG: Gap between the high of candle 1 and low of candle 3 in an up move');
  addBulletPoint(pdf, 'Bearish FVG: Gap between the low of candle 1 and high of candle 3 in a down move');
  addBulletPoint(pdf, 'Price typically returns to fill these gaps before continuing');
  
  addKeyConceptBox(pdf, 'FVG TRADING', 'The best FVG entries occur when price returns to fill the gap AND the gap aligns with a key structural level. FVG alone is not enough - you need confluence.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Pre-Market Checklist Template');
  
  addCheckbox(pdf, 'Prior Day High marked:  _____________');
  addCheckbox(pdf, 'Prior Day Low marked:  _____________');
  addCheckbox(pdf, 'Asian Session High:  _____________');
  addCheckbox(pdf, 'Asian Session Low:  _____________');
  addCheckbox(pdf, 'Weekly High:  _____________');
  addCheckbox(pdf, 'Weekly Low:  _____________');
  addCheckbox(pdf, 'Key FVGs identified:  _____________');
  addCheckbox(pdf, 'Economic events today:  _____________');
  
  drawPageFooter(pdf, 14);
  
  // Module 4 page 3
  addNewPage(pdf);
  drawPageHeader(pdf, 4, 'Level Marking Pre-Market Ritual');
  
  addSubtitle(pdf, 'Confluence Zones');
  
  addParagraph(pdf, 'When multiple levels cluster within a few ticks of each other, you have found a high-probability zone. These confluence areas are where the best trades happen.');
  
  addParagraph(pdf, 'Example of confluence:');
  addBulletPoint(pdf, 'Prior week low at 4480');
  addBulletPoint(pdf, 'Unfilled bullish FVG from 4478-4482');
  addBulletPoint(pdf, 'Equal lows at 4479');
  addBulletPoint(pdf, 'This cluster (4478-4482) becomes a high-priority buy zone');
  
  addSpacer(pdf, 10);
  addWarningBox(pdf, 'OVER-MARKING', 'Having too many lines on your chart creates analysis paralysis. Limit yourself to the 6-8 most significant levels. Quality over quantity.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Updating Levels During the Day');
  
  addParagraph(pdf, 'Levels are not static. As the day progresses:');
  
  addBulletPoint(pdf, 'Levels that get swept can be removed or converted to "taken" status');
  addBulletPoint(pdf, 'New significant highs/lows created during the session should be marked');
  addBulletPoint(pdf, 'FVGs that get filled can be removed');
  addBulletPoint(pdf, 'Keep your chart clean and actionable');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Module 4 Checklist');
  addCheckbox(pdf, 'I have a consistent pre-market routine');
  addCheckbox(pdf, 'I understand all level types and their significance');
  addCheckbox(pdf, 'I can identify Fair Value Gaps correctly');
  addCheckbox(pdf, 'I know how to find confluence zones');
  addCheckbox(pdf, 'I commit to marking levels BEFORE the session starts');
  
  drawPageFooter(pdf, 15);
}

// MODULE 5: Confluence Entry System
function createModule5(pdf) {
  addNewPage(pdf);
  drawPageHeader(pdf, 5, 'The Confluence Entry System');
  
  addTitle(pdf, 'Module 5: The Confluence Entry System');
  addSpacer(pdf, 10);
  
  addParagraph(pdf, 'This is the core of the trading methodology. Every trade must pass through this four-factor verification system. If any factor is missing, you do not take the trade. No exceptions.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'The Four Confluence Factors');
  
  addKeyConceptBox(pdf, 'FACTOR 1: STRUCTURAL LEVEL', 'Price must be at a pre-marked significant level (PDH/PDL, weekly level, clean equal highs/lows, or untested FVG). Random entries in the middle of nowhere are not valid.');
  
  addSpacer(pdf, 10);
  addKeyConceptBox(pdf, 'FACTOR 2: LIQUIDITY SWEEP', 'Price must sweep through the level (take liquidity) and then reject. This confirms that institutions have filled orders at that level.');
  
  addSpacer(pdf, 10);
  addKeyConceptBox(pdf, 'FACTOR 3: PRICE ACTION CONFIRMATION', 'You must see a rejection candle or pattern - engulfing, pin bar, or clear momentum shift. Do not anticipate; wait for confirmation.');
  
  addSpacer(pdf, 10);
  addKeyConceptBox(pdf, 'FACTOR 4: DOM CONFIRMATION', 'The Depth of Market must show absorption, stacking, or pulling that supports your trade direction. This is the real-time institutional footprint.');
  
  addSpacer(pdf, 15);
  addRuleBox(pdf, 'All four factors must be present. Having 3 out of 4 is NOT a valid entry. This rule alone will save you from the majority of losing trades.');
  
  drawPageFooter(pdf, 16);
  
  // Module 5 page 2
  addNewPage(pdf);
  drawPageHeader(pdf, 5, 'The Confluence Entry System');
  
  addSubtitle(pdf, 'Factor 1: Structural Level (Deep Dive)');
  
  addParagraph(pdf, 'A valid structural level must be identifiable BEFORE price reaches it. You should have marked this level during your pre-market prep or as it formed during the session.');
  
  addParagraph(pdf, 'Strongest levels (in order):');
  addBulletPoint(pdf, 'Weekly highs/lows - Largest liquidity pools');
  addBulletPoint(pdf, 'Prior day high/low - Daily reference points');
  addBulletPoint(pdf, 'Clean equal highs/lows - Obvious stop placement areas');
  addBulletPoint(pdf, 'Session highs/lows with FVG alignment');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Factor 2: Liquidity Sweep (Deep Dive)');
  
  addParagraph(pdf, 'The sweep is what separates institutional moves from random price action. A valid sweep:');
  
  addBulletPoint(pdf, 'Pierces through the level (not just touches it)');
  addBulletPoint(pdf, 'Shows a rapid move into and rejection from the level');
  addBulletPoint(pdf, 'Often occurs with a spike in volume');
  addBulletPoint(pdf, 'Creates a wick that extends beyond the level');
  
  addWarningBox(pdf, 'FALSE SWEEPS', 'Not every move through a level is a true sweep. If price continues through without any rejection, that is a breakout, not a sweep. Wait for the rejection.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Factor 3: Price Action Confirmation (Deep Dive)');
  
  addParagraph(pdf, 'After the sweep, you need to see price action that confirms rejection:');
  
  addBulletPoint(pdf, 'Engulfing candle - Completely covers the prior candle');
  addBulletPoint(pdf, 'Pin bar/hammer - Long wick with small body');
  addBulletPoint(pdf, 'Momentum candle - Strong close away from the level');
  addBulletPoint(pdf, 'Lower timeframe break of structure');
  
  drawPageFooter(pdf, 17);
  
  // Module 5 page 3
  addNewPage(pdf);
  drawPageHeader(pdf, 5, 'The Confluence Entry System');
  
  addSubtitle(pdf, 'Factor 4: DOM Confirmation (Deep Dive)');
  
  addParagraph(pdf, 'The Depth of Market provides real-time confirmation of institutional activity. What to look for:');
  
  addBulletPoint(pdf, 'Absorption: Large resting orders that eat incoming market orders');
  addBulletPoint(pdf, 'Stacking: Institutional bids or offers building at a level');
  addBulletPoint(pdf, 'Pulling: Large orders that disappear as price approaches (spoofing)');
  addBulletPoint(pdf, 'Iceberg orders: Large prints but minimal visible book impact');
  
  addKeyConceptBox(pdf, 'DOM INTEGRATION', 'DOM is not a crystal ball. It confirms what price action is already suggesting. If price action says bullish but DOM shows aggressive selling, step aside.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Entry Execution');
  
  addParagraph(pdf, 'Once all four factors align:');
  
  addNumberedItem(pdf, 1, 'Set your stop loss first - Behind the sweep high/low');
  addNumberedItem(pdf, 2, 'Calculate position size - Based on stop distance and risk rules');
  addNumberedItem(pdf, 3, 'Enter the trade - Limit order at your planned entry level');
  addNumberedItem(pdf, 4, 'Set take profit targets - Minimum 1.5R, ideally 2R or next structure');
  addNumberedItem(pdf, 5, 'Walk away or scale - Do not micro-manage; trust the process');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Entry Types');
  
  const entryTypes = [
    ['Aggressive', 'Enter immediately on confirmation candle close', 'Tight stop, higher risk'],
    ['Standard', 'Enter on pullback to confirmation candle 50%', 'Better R:R, may miss some'],
    ['Conservative', 'Wait for lower TF structure break', 'Safest, lowest win rate'],
  ];
  
  addTable(pdf, ['Type', 'Description', 'Notes'], entryTypes, [100, 280, 132]);
  
  drawPageFooter(pdf, 18);
  
  // Module 5 page 4
  addNewPage(pdf);
  drawPageHeader(pdf, 5, 'The Confluence Entry System');
  
  addSubtitle(pdf, 'Trade Examples Framework');
  
  addParagraph(pdf, 'When reviewing potential trades, walk through this framework:');
  
  addCheckbox(pdf, 'Is there a pre-marked structural level? YES / NO');
  addCheckbox(pdf, 'Did price sweep through the level? YES / NO');
  addCheckbox(pdf, 'Is there price action confirmation? YES / NO');
  addCheckbox(pdf, 'Does DOM support the direction? YES / NO');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'If ANY answer is NO, do not take the trade. Wait for the next setup.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Common Confluence Mistakes');
  
  addBulletPoint(pdf, 'Taking trades at random levels with no pre-marked significance');
  addBulletPoint(pdf, 'Entering before the sweep completes (anticipating)');
  addBulletPoint(pdf, 'Ignoring DOM when it contradicts price action');
  addBulletPoint(pdf, 'Forcing a trade when only 3 factors align');
  addBulletPoint(pdf, 'Entering during low-volume periods');
  
  addSpacer(pdf, 15);
  addRuleBox(pdf, 'Patience is not passive. Actively waiting for all four factors while other traders take inferior setups IS the edge. Your job is to execute the system, not to trade frequently.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Module 5 Checklist');
  addCheckbox(pdf, 'I can identify all four confluence factors');
  addCheckbox(pdf, 'I understand why each factor matters');
  addCheckbox(pdf, 'I commit to never entering without all four');
  addCheckbox(pdf, 'I have a clear entry execution process');
  
  drawPageFooter(pdf, 19);
}

// MODULE 6: Liquidity Sweep Zones
function createModule6(pdf) {
  addNewPage(pdf);
  drawPageHeader(pdf, 6, 'Liquidity Sweep Zones Mastery');
  
  addTitle(pdf, 'Module 6: Liquidity Sweep Zones');
  addSpacer(pdf, 10);
  
  addParagraph(pdf, 'Liquidity is the lifeblood of institutional trading. Understanding where liquidity pools form and how they get swept is essential to reading institutional intent.');
  
  addSpacer(pdf, 10);
  addSubtitle(pdf, 'What is Liquidity?');
  
  addParagraph(pdf, 'In trading, liquidity refers to resting orders in the market. There are two types:');
  
  addBulletPoint(pdf, 'Buy-side liquidity: Buy stop orders above swing highs (gets triggered on upward sweeps)');
  addBulletPoint(pdf, 'Sell-side liquidity: Sell stop orders below swing lows (gets triggered on downward sweeps)');
  
  addKeyConceptBox(pdf, 'INSTITUTIONAL NEED', 'Large institutions cannot simply place a 5,000 contract order at market - they would move price against themselves. They need to find areas where retail traders have concentrated their stops to provide the liquidity for their large orders.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Liquidity Pool Formation');
  
  addParagraph(pdf, 'Liquidity pools form at predictable locations:');
  
  addBulletPoint(pdf, 'Equal highs - Multiple swing highs at the same level');
  addBulletPoint(pdf, 'Equal lows - Multiple swing lows at the same level');
  addBulletPoint(pdf, 'Previous day high/low - Everyone watches these');
  addBulletPoint(pdf, 'Session highs/lows - Asian, London, NY reference points');
  addBulletPoint(pdf, 'Round numbers - Psychological levels (4500, 4550, etc.)');
  addBulletPoint(pdf, 'Weekly/monthly highs and lows');
  
  drawPageFooter(pdf, 20);
  
  // Module 6 page 2
  addNewPage(pdf);
  drawPageHeader(pdf, 6, 'Liquidity Sweep Zones Mastery');
  
  addSubtitle(pdf, 'The Sweep Mechanics');
  
  addParagraph(pdf, 'A liquidity sweep follows a predictable pattern:');
  
  addNumberedItem(pdf, 1, 'Price approaches a liquidity zone slowly, building anticipation');
  addNumberedItem(pdf, 2, 'Aggressive move INTO the zone triggers stops');
  addNumberedItem(pdf, 3, 'Brief pause as orders get filled');
  addNumberedItem(pdf, 4, 'Sharp reversal away from the zone');
  addNumberedItem(pdf, 5, 'Continuation in the reversal direction');
  
  addSpacer(pdf, 10);
  addWarningBox(pdf, 'FALSE BREAKS', 'Not every move through a level is a sweep. Some are legitimate breakouts. The difference: sweeps show immediate rejection (within 1-3 candles); breakouts continue and retest the level from the other side.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Sweep Confirmation Signs');
  
  addBulletPoint(pdf, 'Volume spike on the sweep candle');
  addBulletPoint(pdf, 'Long wick extending beyond the level');
  addBulletPoint(pdf, 'Immediate opposite-direction candle');
  addBulletPoint(pdf, 'DOM shows absorption at the sweep level');
  addBulletPoint(pdf, 'Delta shift (buying to selling or vice versa)');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Multi-Timeframe Liquidity');
  
  addParagraph(pdf, 'Liquidity pools exist on all timeframes. Higher timeframe pools are more significant:');
  
  const liquidityTable = [
    ['Monthly High/Low', 'Massive institutional interest', 'Best setups'],
    ['Weekly High/Low', 'Major swing trade targets', 'High probability'],
    ['Daily High/Low', 'Day trade primary targets', 'Daily focus'],
    ['4H/1H Swing Points', 'Intraday reference', 'Confirmation'],
    ['15M/5M Equal Highs/Lows', 'Scalp targets', 'Quick moves'],
  ];
  
  addTable(pdf, ['Timeframe Level', 'Significance', 'Trading Use'], liquidityTable, [160, 200, 152]);
  
  drawPageFooter(pdf, 21);
  
  // Module 6 page 3
  addNewPage(pdf);
  drawPageHeader(pdf, 6, 'Liquidity Sweep Zones Mastery');
  
  addSubtitle(pdf, 'Inducement');
  
  addParagraph(pdf, 'Inducement is when price creates a minor high or low specifically to draw in retail traders before reversing. These are traps designed to create liquidity for the real move.');
  
  addBulletPoint(pdf, 'Often occurs just before a major liquidity sweep');
  addBulletPoint(pdf, 'Creates a "double top" or "double bottom" appearance');
  addBulletPoint(pdf, 'Retail traders see it as confirmation of direction');
  addBulletPoint(pdf, 'Smart money uses it to build their position');
  
  addKeyConceptBox(pdf, 'READING INDUCEMENT', 'If price makes a higher high but cannot hold, and then sweeps a lower level, that higher high was inducement. The real move is in the sweep direction.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Combining Sweeps with FVGs');
  
  addParagraph(pdf, 'The highest probability setups occur when:');
  
  addNumberedItem(pdf, 1, 'Price sweeps a liquidity zone');
  addNumberedItem(pdf, 2, 'The sweep fills into an FVG');
  addNumberedItem(pdf, 3, 'FVG aligns with another structural level');
  addNumberedItem(pdf, 4, 'Price shows rejection from the FVG');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'This triple confluence (sweep + FVG + structure) creates the highest probability entries in this system.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Module 6 Checklist');
  addCheckbox(pdf, 'I understand buy-side and sell-side liquidity');
  addCheckbox(pdf, 'I can identify where liquidity pools form');
  addCheckbox(pdf, 'I can differentiate sweeps from breakouts');
  addCheckbox(pdf, 'I understand inducement and how to read it');
  addCheckbox(pdf, 'I can combine sweep analysis with FVG');
  
  drawPageFooter(pdf, 22);
  
  // Module 6 page 4 - Exercises
  addNewPage(pdf);
  drawPageHeader(pdf, 6, 'Liquidity Sweep Zones Mastery');
  
  addSubtitle(pdf, 'Practice Exercises');
  
  addParagraph(pdf, 'Complete these exercises to internalize liquidity concepts:');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'EXERCISE 1: Level Identification');
  addParagraph(pdf, 'Go back 5 trading days on your instrument. Mark ONLY the levels where you see obvious liquidity pools (equal highs/lows, session levels). Count how many got swept.');
  addSpacer(pdf, 5);
  addParagraph(pdf, 'Levels marked: ______  Levels swept: ______  Percentage: ______%');
  
  addSpacer(pdf, 15);
  addParagraph(pdf, 'EXERCISE 2: Sweep Timing');
  addParagraph(pdf, 'For the next 5 trading days, note what time major sweeps occurred. Look for patterns related to session opens or economic releases.');
  addSpacer(pdf, 5);
  addParagraph(pdf, 'Day 1: ______  Day 2: ______  Day 3: ______  Day 4: ______  Day 5: ______');
  
  addSpacer(pdf, 15);
  addParagraph(pdf, 'EXERCISE 3: Sweep to Move Ratio');
  addParagraph(pdf, 'Track how far price moves after a valid liquidity sweep versus how far the sweep extended. This helps calibrate your target expectations.');
  
  const sweepExercise = [
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ];
  
  addTable(pdf, ['Date', 'Sweep Size (ticks)', 'Move After (ticks)', 'Ratio'], sweepExercise, [100, 140, 140, 132]);
  
  drawPageFooter(pdf, 23);
}

// MODULE 7: Price Action & Candle Reading
function createModule7(pdf) {
  addNewPage(pdf);
  drawPageHeader(pdf, 7, 'Price Action & Candle Reading');
  
  addTitle(pdf, 'Module 7: Price Action & Candle Reading');
  addSpacer(pdf, 10);
  
  addParagraph(pdf, 'Candles tell a story. Each candle represents a battle between buyers and sellers. Learning to read this story quickly and accurately is a fundamental skill.');
  
  addSpacer(pdf, 10);
  addSubtitle(pdf, 'Candle Anatomy');
  
  addBulletPoint(pdf, 'Body - The filled area between open and close');
  addBulletPoint(pdf, 'Wick/Shadow - Lines extending above and below the body');
  addBulletPoint(pdf, 'Bullish Candle - Close above open (typically green/white)');
  addBulletPoint(pdf, 'Bearish Candle - Close below open (typically red/black)');
  
  addKeyConceptBox(pdf, 'WHAT WICKS TELL YOU', 'Long wicks indicate rejection. A long upper wick means sellers took control. A long lower wick means buyers defended. The longer the wick, the stronger the rejection.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Key Candle Patterns');
  
  addParagraph(pdf, 'ENGULFING PATTERNS');
  addBulletPoint(pdf, 'Bullish Engulfing: Red candle followed by larger green candle that completely covers it');
  addBulletPoint(pdf, 'Bearish Engulfing: Green candle followed by larger red candle that completely covers it');
  addBulletPoint(pdf, 'Most powerful at key levels after a sweep');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'PIN BARS / HAMMERS');
  addBulletPoint(pdf, 'Long wick (2-3x body length) showing rejection');
  addBulletPoint(pdf, 'Small body near one end of the candle');
  addBulletPoint(pdf, 'Indicates strong rejection of a price level');
  
  drawPageFooter(pdf, 24);
  
  // Module 7 page 2
  addNewPage(pdf);
  drawPageHeader(pdf, 7, 'Price Action & Candle Reading');
  
  addSubtitle(pdf, 'Momentum Candles');
  
  addParagraph(pdf, 'Momentum candles show institutional commitment:');
  
  addBulletPoint(pdf, 'Large body with small or no wicks');
  addBulletPoint(pdf, 'Closes at or near the extreme (high for bullish, low for bearish)');
  addBulletPoint(pdf, 'Often followed by continuation in the same direction');
  addBulletPoint(pdf, 'Creates Fair Value Gaps');
  
  addWarningBox(pdf, 'MOMENTUM WARNING', 'Do not chase momentum candles. If you missed the entry, let it go. Entering after a big momentum candle often means you are buying the top or selling the bottom of a move.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Inside and Outside Bars');
  
  addParagraph(pdf, 'INSIDE BARS');
  addBulletPoint(pdf, 'Candle that is completely within the prior candle range');
  addBulletPoint(pdf, 'Indicates consolidation and energy building');
  addBulletPoint(pdf, 'Breakout direction often significant');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'OUTSIDE BARS');
  addBulletPoint(pdf, 'Candle that completely engulfs prior candle (both directions)');
  addBulletPoint(pdf, 'Shows volatility and indecision');
  addBulletPoint(pdf, 'Often seen at key reversal points');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Timeframe Correlation');
  
  addParagraph(pdf, 'Candle patterns on higher timeframes are more significant:');
  
  const tfTable = [
    ['Daily', 'Highest significance', 'Swing trades'],
    ['4 Hour', 'Very significant', 'Multi-day setups'],
    ['1 Hour', 'Significant', 'Day trades'],
    ['15 Min', 'Entry refinement', 'Entry/exit timing'],
    ['5 Min', 'Noise + precision', 'Scalp entries'],
  ];
  
  addTable(pdf, ['Timeframe', 'Significance', 'Use Case'], tfTable, [100, 200, 212]);
  
  drawPageFooter(pdf, 25);
  
  // Module 7 page 3
  addNewPage(pdf);
  drawPageHeader(pdf, 7, 'Price Action & Candle Reading');
  
  addSubtitle(pdf, 'Context is Everything');
  
  addParagraph(pdf, 'A pattern means nothing without context. The same pin bar can be:');
  
  addBulletPoint(pdf, 'High probability reversal (at key level after sweep)');
  addBulletPoint(pdf, 'Worthless (in the middle of a range with no structure)');
  
  addKeyConceptBox(pdf, 'CONTEXT RULE', 'Always ask: "Where in the structure is this pattern occurring?" A pattern at a pre-marked key level is worth 10x a pattern in no-man\'s land.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Volume Confirmation');
  
  addParagraph(pdf, 'Price action is more reliable when supported by volume:');
  
  addBulletPoint(pdf, 'High volume on rejection candles confirms institutional participation');
  addBulletPoint(pdf, 'Low volume patterns are less reliable');
  addBulletPoint(pdf, 'Volume climax often marks reversal points');
  addBulletPoint(pdf, 'Declining volume during a move suggests exhaustion');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Reading Sequences');
  
  addParagraph(pdf, 'Individual candles matter less than sequences:');
  
  addBulletPoint(pdf, 'Three consecutive momentum candles = strong trend');
  addBulletPoint(pdf, 'Rejection candle after momentum candles = potential reversal');
  addBulletPoint(pdf, 'Overlapping candles = consolidation');
  addBulletPoint(pdf, 'Increasing wick sizes = buyers/sellers testing each other');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Module 7 Checklist');
  addCheckbox(pdf, 'I can identify all key candle patterns');
  addCheckbox(pdf, 'I understand what wicks represent');
  addCheckbox(pdf, 'I evaluate patterns in context of structure');
  addCheckbox(pdf, 'I use volume to confirm patterns');
  addCheckbox(pdf, 'I read candle sequences, not just individual candles');
  
  drawPageFooter(pdf, 26);
  
  // Module 7 page 4 - Exercises
  addNewPage(pdf);
  drawPageHeader(pdf, 7, 'Price Action & Candle Reading');
  
  addSubtitle(pdf, 'Pattern Recognition Exercises');
  
  addParagraph(pdf, 'EXERCISE 1: Daily Pattern Review');
  addParagraph(pdf, 'Each day, screenshot 3 candle patterns you observed. Note the context and whether they led to a move or failed.');
  
  addSpacer(pdf, 10);
  const patternExercise = [
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ];
  addTable(pdf, ['Date', 'Pattern', 'Context/Level', 'Result'], patternExercise, [80, 140, 180, 112]);
  
  addSpacer(pdf, 15);
  addParagraph(pdf, 'EXERCISE 2: Wick Analysis');
  addParagraph(pdf, 'Track rejection wicks that form at your pre-marked levels. Measure the wick length relative to body length.');
  
  addSpacer(pdf, 10);
  const wickExercise = [
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ];
  addTable(pdf, ['Time', 'Level Type', 'Wick:Body Ratio', 'Follow-through'], wickExercise, [80, 140, 140, 152]);
  
  addSpacer(pdf, 15);
  addParagraph(pdf, 'EXERCISE 3: Momentum Candle Study');
  addParagraph(pdf, 'Find 5 momentum candles from the past week. Note what happened immediately after and whether chasing would have been profitable.');
  
  addParagraph(pdf, 'Momentum candles that would have been profitable to chase: _____ / 5');
  addParagraph(pdf, 'Key insight from this exercise: _________________________________');
  
  drawPageFooter(pdf, 27);
}

// MODULE 8: DOM Mastery
function createModule8(pdf) {
  addNewPage(pdf);
  drawPageHeader(pdf, 8, 'Depth of Market (DOM) Mastery');
  
  addTitle(pdf, 'Module 8: DOM Mastery');
  addSpacer(pdf, 10);
  
  addParagraph(pdf, 'The Depth of Market (DOM) shows you what price action cannot: where real orders are sitting. This is the institutional footprint in real-time.');
  
  addSpacer(pdf, 10);
  addSubtitle(pdf, 'Understanding the DOM');
  
  addParagraph(pdf, 'The DOM displays:');
  addBulletPoint(pdf, 'Bid side (left) - Resting buy orders at various prices');
  addBulletPoint(pdf, 'Ask side (right) - Resting sell orders at various prices');
  addBulletPoint(pdf, 'Volume at each price - How many contracts are sitting');
  addBulletPoint(pdf, 'Prints/Trades - Actual executed transactions');
  
  addKeyConceptBox(pdf, 'DOM REALITY', 'Not all orders on the DOM are real. Institutions use spoofing (placing and pulling orders) to manipulate perception. Learn to read THROUGH the noise.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Key DOM Patterns');
  
  addParagraph(pdf, 'ABSORPTION');
  addBulletPoint(pdf, 'Large resting orders that absorb incoming market orders');
  addBulletPoint(pdf, 'Price keeps hitting a level but cannot break through');
  addBulletPoint(pdf, 'Indicates institutional defense of a level');
  addBulletPoint(pdf, 'Often precedes reversal');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'STACKING');
  addBulletPoint(pdf, 'Orders building at a price level');
  addBulletPoint(pdf, 'If genuine, shows institutional interest');
  addBulletPoint(pdf, 'Watch whether orders stay when price approaches');
  
  drawPageFooter(pdf, 28);
  
  // Module 8 page 2
  addNewPage(pdf);
  drawPageHeader(pdf, 8, 'Depth of Market (DOM) Mastery');
  
  addSubtitle(pdf, 'More DOM Patterns');
  
  addParagraph(pdf, 'PULLING');
  addBulletPoint(pdf, 'Orders disappear as price approaches');
  addBulletPoint(pdf, 'Indicates those orders were fake (spoofing)');
  addBulletPoint(pdf, 'Price often accelerates through pulled levels');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'ICEBERG ORDERS');
  addBulletPoint(pdf, 'Large prints executing with minimal visible book impact');
  addBulletPoint(pdf, 'Institutional hiding of true order size');
  addBulletPoint(pdf, 'Watch for consistent large prints at same level');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'DELTA DIVERGENCE');
  addBulletPoint(pdf, 'Difference between buying and selling volume');
  addBulletPoint(pdf, 'Price rising on negative delta = weakness');
  addBulletPoint(pdf, 'Price falling on positive delta = strength');
  
  addWarningBox(pdf, 'DOM ADDICTION', 'Do not stare at the DOM all day. Use it to CONFIRM setups you have already identified through structure and price action. DOM alone is not a trading system.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Integrating DOM with Your System');
  
  addNumberedItem(pdf, 1, 'Identify your setup through structure and price action');
  addNumberedItem(pdf, 2, 'Check DOM at your entry level as price approaches');
  addNumberedItem(pdf, 3, 'Look for absorption or stacking that supports your bias');
  addNumberedItem(pdf, 4, 'If DOM contradicts, pass on the trade');
  addNumberedItem(pdf, 5, 'Enter with confidence when DOM confirms');
  
  drawPageFooter(pdf, 29);
  
  // Module 8 page 3
  addNewPage(pdf);
  drawPageHeader(pdf, 8, 'Depth of Market (DOM) Mastery');
  
  addSubtitle(pdf, 'DOM Setup for Trading');
  
  addParagraph(pdf, 'Recommended DOM configuration:');
  
  addBulletPoint(pdf, '10-20 price levels visible on each side');
  addBulletPoint(pdf, 'Color coding for size thresholds (large orders highlighted)');
  addBulletPoint(pdf, 'Recent trades/prints visible');
  addBulletPoint(pdf, 'Cumulative delta indicator');
  addBulletPoint(pdf, 'Clean, minimal design - avoid overload');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Practice Protocol');
  
  addParagraph(pdf, 'DOM reading is a skill that takes time to develop:');
  
  addBulletPoint(pdf, 'Week 1-2: Just watch the DOM without trading');
  addBulletPoint(pdf, 'Week 3-4: Note patterns you observe in a journal');
  addBulletPoint(pdf, 'Week 5-6: Start paper-trading with DOM confirmation');
  addBulletPoint(pdf, 'Week 7+: Integrate into live trading gradually');
  
  addKeyConceptBox(pdf, 'PATIENCE', 'You will not master DOM reading in a few days. It takes hundreds of hours of observation to develop genuine skill. Do not rush this process.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Module 8 Checklist');
  addCheckbox(pdf, 'I understand DOM layout and components');
  addCheckbox(pdf, 'I can identify absorption patterns');
  addCheckbox(pdf, 'I can spot stacking and pulling');
  addCheckbox(pdf, 'I understand delta and its implications');
  addCheckbox(pdf, 'I use DOM to confirm, not generate setups');
  
  drawPageFooter(pdf, 30);
}

// MODULE 9: Trade Management
function createModule9(pdf) {
  addNewPage(pdf);
  drawPageHeader(pdf, 9, 'Trade Management Rules');
  
  addTitle(pdf, 'Module 9: Trade Management Rules');
  addSpacer(pdf, 10);
  
  addParagraph(pdf, 'Getting into a trade is only half the battle. How you manage the trade determines whether you extract maximum profit or give it back to the market.');
  
  addSpacer(pdf, 10);
  addSubtitle(pdf, 'Stop Loss Placement');
  
  addParagraph(pdf, 'Your stop loss should be:');
  
  addBulletPoint(pdf, 'Beyond the sweep high/low that triggered your entry');
  addBulletPoint(pdf, 'Never arbitrary (like "20 ticks")');
  addBulletPoint(pdf, 'Set BEFORE you enter the trade');
  addBulletPoint(pdf, 'Never moved further away from price');
  
  addKeyConceptBox(pdf, 'STOP LOGIC', 'If your stop gets hit, your thesis was wrong. A valid setup with proper stop placement should not get stopped out and then immediately reverse in your direction.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Take Profit Strategy');
  
  addParagraph(pdf, 'Minimum target: 1.5x your risk (stop distance)');
  addParagraph(pdf, 'Standard targets:');
  
  addBulletPoint(pdf, 'Target 1: 1.5R (take partial profits)');
  addBulletPoint(pdf, 'Target 2: Next structural level or 2R');
  addBulletPoint(pdf, 'Target 3: Extended target for runners');
  
  addSpacer(pdf, 10);
  addRuleBox(pdf, 'Never accept less than 1:1 risk:reward. If you cannot identify a target at minimum 1.5x your stop distance, do not take the trade.');
  
  drawPageFooter(pdf, 31);
  
  // Module 9 page 2
  addNewPage(pdf);
  drawPageHeader(pdf, 9, 'Trade Management Rules');
  
  addSubtitle(pdf, 'Scaling Out Strategy');
  
  addParagraph(pdf, 'Recommended scaling approach:');
  
  addNumberedItem(pdf, 1, 'At 1R: Move stop to breakeven (optional)');
  addNumberedItem(pdf, 2, 'At 1.5R: Take 50% of position');
  addNumberedItem(pdf, 3, 'At 2R: Take another 25%');
  addNumberedItem(pdf, 4, 'Runner: Let final 25% run to extended target or trail');
  
  addKeyConceptBox(pdf, 'SCALING LOGIC', 'Taking partial profits locks in gains while allowing participation in bigger moves. This reduces variance and smooths your equity curve.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Trailing Stops');
  
  addParagraph(pdf, 'For runners, trail your stop using:');
  
  addBulletPoint(pdf, 'Structure: Trail behind each new swing low/high');
  addBulletPoint(pdf, 'Fixed: Trail at 1R behind current price');
  addBulletPoint(pdf, 'Time-based: Tighten during low-volume periods');
  
  addWarningBox(pdf, 'TRAILING WARNING', 'Trailing too tight will get you stopped out on normal retracements. Give the trade room to breathe. Trail behind structure, not price.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'When to Exit Early');
  
  addParagraph(pdf, 'Exit before your stop or target if:');
  
  addBulletPoint(pdf, 'Your thesis is invalidated (e.g., structure breaks the wrong way)');
  addBulletPoint(pdf, 'A high-impact news event is imminent');
  addBulletPoint(pdf, 'DOM shows aggressive absorption against your position');
  addBulletPoint(pdf, 'You are in the trade too long without progress (time stops)');
  
  drawPageFooter(pdf, 32);
  
  // Module 9 page 3
  addNewPage(pdf);
  drawPageHeader(pdf, 9, 'Trade Management Rules');
  
  addSubtitle(pdf, 'Time-Based Rules');
  
  addParagraph(pdf, 'Time affects trade validity:');
  
  addBulletPoint(pdf, 'If a trade does not work within 15-20 candles, something is wrong');
  addBulletPoint(pdf, 'Close trades before major session transitions');
  addBulletPoint(pdf, 'Avoid holding through lunch doldrums (12:00-2:00 PM EST)');
  addBulletPoint(pdf, 'Do not hold overnight unless that was your original plan');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Re-Entry Rules');
  
  addParagraph(pdf, 'If stopped out of a valid setup:');
  
  addBulletPoint(pdf, 'Wait for a new signal before re-entering');
  addBulletPoint(pdf, 'Never "chase" the move you missed');
  addBulletPoint(pdf, 'Only re-enter if all 4 confluence factors realign');
  addBulletPoint(pdf, 'Maximum 2 attempts at the same level');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Management Checklist (Per Trade)');
  
  addCheckbox(pdf, 'Stop loss placed beyond sweep point');
  addCheckbox(pdf, 'Target minimum 1.5R');
  addCheckbox(pdf, 'Scaling plan defined before entry');
  addCheckbox(pdf, 'Time-based exit rules acknowledged');
  addCheckbox(pdf, 'No news events pending during expected hold time');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Module 9 Checklist');
  addCheckbox(pdf, 'I understand proper stop placement');
  addCheckbox(pdf, 'I have a scaling strategy');
  addCheckbox(pdf, 'I know when to trail and how');
  addCheckbox(pdf, 'I have rules for early exits');
  addCheckbox(pdf, 'I understand re-entry rules');
  
  drawPageFooter(pdf, 33);
}

// MODULE 10: Risk Management
function createModule10(pdf) {
  addNewPage(pdf);
  drawPageHeader(pdf, 10, 'Risk Management & Position Sizing');
  
  addTitle(pdf, 'Module 10: Risk Management');
  addSpacer(pdf, 10);
  
  addParagraph(pdf, 'Risk management is not glamorous, but it is the single most important factor in long-term trading success. Without proper risk management, no strategy can save you.');
  
  addSpacer(pdf, 10);
  addSubtitle(pdf, 'The Core Risk Rules');
  
  addRuleBox(pdf, 'RULE 1: Never risk more than 1% of account per trade. On a $10,000 account, max risk is $100 per trade.');
  
  addSpacer(pdf, 10);
  addRuleBox(pdf, 'RULE 2: Daily loss limit of 2%. If you lose 2% of account in a day, stop trading. Walk away.');
  
  addSpacer(pdf, 10);
  addRuleBox(pdf, 'RULE 3: Weekly loss limit of 5%. If you lose 5% of account in a week, take the rest of the week off.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Position Sizing Formula');
  
  addParagraph(pdf, 'Calculate position size BEFORE every trade:');
  
  addBulletPoint(pdf, 'Step 1: Determine account risk (1% of account)');
  addBulletPoint(pdf, 'Step 2: Identify stop loss distance in ticks');
  addBulletPoint(pdf, 'Step 3: Calculate tick value for your instrument');
  addBulletPoint(pdf, 'Step 4: Contracts = Account Risk / (Stop Distance x Tick Value)');
  
  addSpacer(pdf, 10);
  addKeyConceptBox(pdf, 'EXAMPLE', 'Account: $10,000. Max risk: $100 (1%). Stop: 20 ticks. Tick value: $1.25 (/MES). Position = $100 / (20 x $1.25) = $100 / $25 = 4 contracts max.');
  
  drawPageFooter(pdf, 34);
  
  // Module 10 page 2
  addNewPage(pdf);
  drawPageHeader(pdf, 10, 'Risk Management & Position Sizing');
  
  addSubtitle(pdf, 'Position Size Table (/MES)');
  
  const posSizeTable = [
    ['$5,000', '10 ticks', '4 contracts'],
    ['$5,000', '20 ticks', '2 contracts'],
    ['$10,000', '10 ticks', '8 contracts'],
    ['$10,000', '20 ticks', '4 contracts'],
    ['$25,000', '10 ticks', '20 contracts'],
    ['$25,000', '20 ticks', '10 contracts'],
  ];
  
  addTable(pdf, ['Account Size', 'Stop Distance', 'Max Contracts (1% risk)'], posSizeTable, [160, 160, 192]);
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Correlation Risk');
  
  addParagraph(pdf, 'If trading multiple instruments:');
  
  addBulletPoint(pdf, '/ES and /NQ are highly correlated - count as one position');
  addBulletPoint(pdf, 'Reduce size when trading correlated instruments simultaneously');
  addBulletPoint(pdf, 'Total risk across all correlated positions should not exceed 1%');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Scaling Up');
  
  addParagraph(pdf, 'Only increase size when:');
  
  addBulletPoint(pdf, 'You have 3 consecutive green weeks');
  addBulletPoint(pdf, 'Increase by max 20% at a time');
  addBulletPoint(pdf, 'Return to smaller size after any weekly loss');
  
  addWarningBox(pdf, 'SIZE KILLS', 'More traders blow up from oversizing than from bad strategies. If you are ever tempted to "double down" or "make back losses," you are in a dangerous mental state. Stop trading.');
  
  drawPageFooter(pdf, 35);
  
  // Module 10 page 3
  addNewPage(pdf);
  drawPageHeader(pdf, 10, 'Risk Management & Position Sizing');
  
  addSubtitle(pdf, 'Drawdown Recovery');
  
  addParagraph(pdf, 'Understanding the math of drawdowns:');
  
  const drawdownTable = [
    ['10%', '11%'],
    ['20%', '25%'],
    ['30%', '43%'],
    ['50%', '100%'],
    ['70%', '233%'],
  ];
  
  addTable(pdf, ['Drawdown', 'Gain Needed to Recover'], drawdownTable, [256, 256]);
  
  addSpacer(pdf, 10);
  addKeyConceptBox(pdf, 'DRAWDOWN TRUTH', 'Small drawdowns are recoverable. Large drawdowns are career-ending. Every decision you make should prioritize keeping drawdowns small.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Risk Reduction Triggers');
  
  addParagraph(pdf, 'Automatically reduce size when:');
  
  addBulletPoint(pdf, 'After a losing trade (reduce 50% for next trade)');
  addBulletPoint(pdf, 'During high-volatility events');
  addBulletPoint(pdf, 'When you feel emotional or tilted');
  addBulletPoint(pdf, 'Outside your optimal trading hours');
  addBulletPoint(pdf, 'When sleep-deprived or distracted');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Module 10 Checklist');
  addCheckbox(pdf, 'I will never risk more than 1% per trade');
  addCheckbox(pdf, 'I have set daily and weekly loss limits');
  addCheckbox(pdf, 'I can calculate position size correctly');
  addCheckbox(pdf, 'I understand correlation risk');
  addCheckbox(pdf, 'I will reduce size after losses, not increase');
  
  drawPageFooter(pdf, 36);
}

// MODULE 11: Trading Psychology
function createModule11(pdf) {
  addNewPage(pdf);
  drawPageHeader(pdf, 11, 'Trading Psychology & Discipline');
  
  addTitle(pdf, 'Module 11: Trading Psychology');
  addSpacer(pdf, 10);
  
  addParagraph(pdf, 'Technical skill means nothing without psychological control. Most traders fail not because they do not know how to trade, but because they cannot execute what they know.');
  
  addSpacer(pdf, 10);
  addSubtitle(pdf, 'The Psychology Problem');
  
  addBulletPoint(pdf, 'Fear of missing out (FOMO) leads to chasing');
  addBulletPoint(pdf, 'Fear of loss leads to cutting winners early');
  addBulletPoint(pdf, 'Revenge trading after losses compounds problems');
  addBulletPoint(pdf, 'Overconfidence after wins leads to oversizing');
  addBulletPoint(pdf, 'Boredom leads to taking bad setups');
  
  addKeyConceptBox(pdf, 'THE REAL EDGE', 'Your edge is not in the strategy. Your edge is in executing the strategy consistently when every emotion tells you to deviate.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Building Mental Discipline');
  
  addNumberedItem(pdf, 1, 'Accept that losses are part of the business');
  addNumberedItem(pdf, 2, 'Detach your ego from individual trade outcomes');
  addNumberedItem(pdf, 3, 'Focus on process, not profits');
  addNumberedItem(pdf, 4, 'Develop rituals that keep you centered');
  addNumberedItem(pdf, 5, 'Know your triggers and have plans for them');
  
  addSpacer(pdf, 15);
  addRuleBox(pdf, 'If you feel ANY strong emotion before, during, or after a trade, STOP. Take a break. Emotion and good trading do not coexist.');
  
  drawPageFooter(pdf, 37);
  
  // Module 11 page 2
  addNewPage(pdf);
  drawPageHeader(pdf, 11, 'Trading Psychology & Discipline');
  
  addSubtitle(pdf, 'Common Psychological Traps');
  
  addParagraph(pdf, 'FOMO (Fear of Missing Out)');
  addBulletPoint(pdf, 'Symptom: Entering trades without confluence because "it is moving!"');
  addBulletPoint(pdf, 'Solution: Accept that you will miss moves. There is always another trade.');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'REVENGE TRADING');
  addBulletPoint(pdf, 'Symptom: Taking immediate trades after a loss to "get back" money');
  addBulletPoint(pdf, 'Solution: Mandatory 15-minute break after any loss');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'HOPING AND PRAYING');
  addBulletPoint(pdf, 'Symptom: Not taking a stop because "it might come back"');
  addBulletPoint(pdf, 'Solution: Your stop is set BEFORE entry. It executes no matter what.');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'OVERCONFIDENCE');
  addBulletPoint(pdf, 'Symptom: Increasing size after a winning streak');
  addBulletPoint(pdf, 'Solution: Stick to position sizing rules regardless of recent results');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Pre-Trade Mental Checklist');
  
  addCheckbox(pdf, 'Am I calm and focused right now?');
  addCheckbox(pdf, 'Have I followed my pre-market prep routine?');
  addCheckbox(pdf, 'Is this a valid setup per my rules?');
  addCheckbox(pdf, 'Am I okay with losing the money at risk?');
  addCheckbox(pdf, 'Have I planned my trade (entry, stop, targets)?');
  
  drawPageFooter(pdf, 38);
  
  // Module 11 page 3
  addNewPage(pdf);
  drawPageHeader(pdf, 11, 'Trading Psychology & Discipline');
  
  addSubtitle(pdf, 'Building Good Habits');
  
  addParagraph(pdf, 'Daily practices that support mental edge:');
  
  addBulletPoint(pdf, 'Wake up early enough to do proper prep');
  addBulletPoint(pdf, 'Physical exercise before trading (even 20 minutes)');
  addBulletPoint(pdf, 'No trading within 30 minutes of waking');
  addBulletPoint(pdf, 'Review prior day trades before starting');
  addBulletPoint(pdf, 'Set intention for the day (patience, discipline, etc.)');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'When to NOT Trade');
  
  addBulletPoint(pdf, 'Sleep-deprived (less than 6 hours)');
  addBulletPoint(pdf, 'Sick or feeling unwell');
  addBulletPoint(pdf, 'Major life stress (relationship, family, work)');
  addBulletPoint(pdf, 'After drinking alcohol');
  addBulletPoint(pdf, 'When emotionally charged about anything');
  addBulletPoint(pdf, 'First day back after a break');
  
  addKeyConceptBox(pdf, 'PROTECTION', 'The best trade is often no trade. Protecting your mental capital is as important as protecting your financial capital.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Journaling for Psychology');
  
  addParagraph(pdf, 'Track these mental metrics daily:');
  
  addBulletPoint(pdf, 'Sleep quality (1-10)');
  addBulletPoint(pdf, 'Stress level (1-10)');
  addBulletPoint(pdf, 'Focus level (1-10)');
  addBulletPoint(pdf, 'Rule adherence (%)');
  addBulletPoint(pdf, 'Emotional events during session');
  
  drawPageFooter(pdf, 39);
  
  // Module 11 page 4
  addNewPage(pdf);
  drawPageHeader(pdf, 11, 'Trading Psychology & Discipline');
  
  addSubtitle(pdf, 'Recovery from Bad Days');
  
  addParagraph(pdf, 'When you have a bad trading day:');
  
  addNumberedItem(pdf, 1, 'Stop trading immediately (if not already stopped by rules)');
  addNumberedItem(pdf, 2, 'Walk away from screens for at least 1 hour');
  addNumberedItem(pdf, 3, 'Do NOT review the day while emotional');
  addNumberedItem(pdf, 4, 'Physical activity to reset');
  addNumberedItem(pdf, 5, 'Review the day that evening with objectivity');
  addNumberedItem(pdf, 6, 'Identify ONE thing to improve (not everything)');
  addNumberedItem(pdf, 7, 'Next day: Start with reduced size');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Building Resilience');
  
  addParagraph(pdf, 'Long-term psychological resilience comes from:');
  
  addBulletPoint(pdf, 'Keeping detailed journals to see patterns');
  addBulletPoint(pdf, 'Having accountability (mentor, trading partner)');
  addBulletPoint(pdf, 'Celebrating process wins, not just P&L wins');
  addBulletPoint(pdf, 'Regular breaks and time away from markets');
  addBulletPoint(pdf, 'Maintaining identity beyond trading');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Module 11 Checklist');
  addCheckbox(pdf, 'I have identified my personal psychological traps');
  addCheckbox(pdf, 'I have a pre-trade mental checklist');
  addCheckbox(pdf, 'I know when NOT to trade');
  addCheckbox(pdf, 'I have a process for recovering from bad days');
  addCheckbox(pdf, 'I commit to journaling my mental state');
  
  drawPageFooter(pdf, 40);
}

// MODULE 12: Daily Routine
function createModule12(pdf) {
  addNewPage(pdf);
  drawPageHeader(pdf, 12, 'The Daily Routine');
  
  addTitle(pdf, 'Module 12: The Daily Routine');
  addSpacer(pdf, 10);
  
  addParagraph(pdf, 'Consistency comes from routine. Professional traders do not wing it - they follow the same process every single day. Your routine is your framework for peak performance.');
  
  addSpacer(pdf, 10);
  addSubtitle(pdf, 'Pre-Market Routine (60-90 minutes before session)');
  
  addNumberedItem(pdf, 1, 'Physical preparation: Exercise, shower, healthy food');
  addNumberedItem(pdf, 2, 'Mental preparation: Meditation or breathing exercises (5-10 min)');
  addNumberedItem(pdf, 3, 'Review prior day: What worked, what didn\'t');
  addNumberedItem(pdf, 4, 'Check economic calendar: Know what events are coming');
  addNumberedItem(pdf, 5, 'Mark levels: PDH, PDL, Asian session, FVGs, etc.');
  addNumberedItem(pdf, 6, 'Define scenarios: What would make you long? Short? Sit out?');
  addNumberedItem(pdf, 7, 'Set intentions: One focus for the day (e.g., "patience")');
  
  addSpacer(pdf, 15);
  addKeyConceptBox(pdf, 'PREPARATION = PERFORMANCE', 'The quality of your trading session is directly proportional to the quality of your preparation. Rushed prep = rushed decisions.');
  
  drawPageFooter(pdf, 41);
  
  // Module 12 page 2
  addNewPage(pdf);
  drawPageHeader(pdf, 12, 'The Daily Routine');
  
  addSubtitle(pdf, 'During Session');
  
  addBulletPoint(pdf, 'Focus on YOUR marked levels - ignore everything else');
  addBulletPoint(pdf, 'Wait for all 4 confluence factors before any trade');
  addBulletPoint(pdf, 'No checking social media, news, or "what others think"');
  addBulletPoint(pdf, 'Log trades as they happen (entry, stop, target, rationale)');
  addBulletPoint(pdf, 'Take scheduled breaks every 60-90 minutes');
  addBulletPoint(pdf, 'Monitor your mental state - step away if tilting');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Post-Session Routine (15-30 minutes)');
  
  addNumberedItem(pdf, 1, 'Complete trade journal entries');
  addNumberedItem(pdf, 2, 'Screenshot any setups (taken or missed)');
  addNumberedItem(pdf, 3, 'Calculate daily P&L and stats');
  addNumberedItem(pdf, 4, 'Identify one lesson from the day');
  addNumberedItem(pdf, 5, 'Note any rule violations');
  addNumberedItem(pdf, 6, 'Clear charts for next day');
  addNumberedItem(pdf, 7, 'Physical activity or relaxation');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Weekly Review (Weekend)');
  
  addBulletPoint(pdf, 'Review all trades from the week');
  addBulletPoint(pdf, 'Calculate weekly stats (win rate, avg R, etc.)');
  addBulletPoint(pdf, 'Identify patterns in winners and losers');
  addBulletPoint(pdf, 'Set one focus area for next week');
  addBulletPoint(pdf, 'Plan time off and rest');
  
  drawPageFooter(pdf, 42);
  
  // Module 12 page 3
  addNewPage(pdf);
  drawPageHeader(pdf, 12, 'The Daily Routine');
  
  addSubtitle(pdf, 'Sample Daily Schedule (NY Session Trader)');
  
  const scheduleTable = [
    ['6:00 AM', 'Wake up, exercise', '45 min'],
    ['6:45 AM', 'Shower, breakfast', '30 min'],
    ['7:15 AM', 'Meditation/breathing', '15 min'],
    ['7:30 AM', 'Pre-market prep begins', '60 min'],
    ['8:30 AM', 'Session active - trading', '3.5 hours'],
    ['12:00 PM', 'Lunch break', '30 min'],
    ['12:30 PM', 'Afternoon session', '2 hours'],
    ['2:30 PM', 'Done trading', '--'],
    ['2:30 PM', 'Post-session review', '30 min'],
    ['3:00 PM', 'Day complete', '--'],
  ];
  
  addTable(pdf, ['Time (EST)', 'Activity', 'Duration'], scheduleTable, [100, 280, 132]);
  
  addSpacer(pdf, 15);
  addWarningBox(pdf, 'ADAPT TO YOUR LIFE', 'This is a template. Adjust times based on which session you trade and your life circumstances. The structure matters more than the specific times.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Module 12 Checklist');
  addCheckbox(pdf, 'I have a written pre-market routine');
  addCheckbox(pdf, 'I have a clear during-session protocol');
  addCheckbox(pdf, 'I complete a post-session review daily');
  addCheckbox(pdf, 'I do weekly reviews consistently');
  addCheckbox(pdf, 'My routine fits my lifestyle');
  
  drawPageFooter(pdf, 43);
}

// MODULE 13: Advanced Concepts
function createModule13(pdf) {
  addNewPage(pdf);
  drawPageHeader(pdf, 13, 'Advanced Concepts');
  
  addTitle(pdf, 'Module 13: Advanced Concepts');
  addSpacer(pdf, 10);
  
  addParagraph(pdf, 'Once you have mastered the basics, these advanced concepts will refine your edge. Do NOT attempt these until you are consistently profitable with the core system.');
  
  addSpacer(pdf, 10);
  addSubtitle(pdf, 'Multi-Timeframe Analysis');
  
  addParagraph(pdf, 'Use higher timeframes for bias, lower timeframes for entry:');
  
  addBulletPoint(pdf, 'Daily: Identify the overall trend and major levels');
  addBulletPoint(pdf, '4H/1H: Find session bias and intermediate structure');
  addBulletPoint(pdf, '15M: Locate specific entry zones');
  addBulletPoint(pdf, '5M/1M: Time precise entries');
  
  addKeyConceptBox(pdf, 'ALIGNMENT', 'The best trades occur when all timeframes align. If daily is bullish, 1H is bullish, and 15M gives a buy signal - that is high confluence.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Order Flow Integration');
  
  addParagraph(pdf, 'Beyond basic DOM reading:');
  
  addBulletPoint(pdf, 'Cumulative Delta: Track buying vs. selling pressure over time');
  addBulletPoint(pdf, 'Volume Profile: See where most volume traded historically');
  addBulletPoint(pdf, 'Footprint Charts: Visual representation of volume at each price');
  addBulletPoint(pdf, 'Time & Sales: Watch actual prints for iceberg detection');
  
  drawPageFooter(pdf, 44);
  
  // Module 13 page 2
  addNewPage(pdf);
  drawPageHeader(pdf, 13, 'Advanced Concepts');
  
  addSubtitle(pdf, 'Market Profile Concepts');
  
  addParagraph(pdf, 'Market Profile shows where value is accepted:');
  
  addBulletPoint(pdf, 'Value Area High (VAH): Upper boundary of 70% volume zone');
  addBulletPoint(pdf, 'Value Area Low (VAL): Lower boundary of 70% volume zone');
  addBulletPoint(pdf, 'Point of Control (POC): Price with most volume');
  addBulletPoint(pdf, 'Single Prints: Areas of rapid price movement');
  
  addParagraph(pdf, 'Trading implications:');
  addBulletPoint(pdf, 'Price tends to rotate between VAH and VAL');
  addBulletPoint(pdf, 'Breaks above/below value area can signal trend days');
  addBulletPoint(pdf, 'POC acts as magnet for price');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Session Profiling');
  
  addParagraph(pdf, 'Different days exhibit different profiles:');
  
  const profileTable = [
    ['Trend Day', 'One-directional', 'Trade with trend, trail stops'],
    ['Range Day', 'Rotational', 'Fade extremes, target opposite side'],
    ['Expansion Day', 'Break of multi-day range', 'Trade breakout, larger targets'],
    ['Inside Day', 'Within prior day range', 'Wait for breakout or skip'],
  ];
  
  addTable(pdf, ['Day Type', 'Characteristic', 'Strategy'], profileTable, [120, 200, 192]);
  
  addSpacer(pdf, 10);
  addWarningBox(pdf, 'IDENTIFICATION', 'You cannot know the day type until it develops. Use early session clues but be flexible.');
  
  drawPageFooter(pdf, 45);
  
  // Module 13 page 3
  addNewPage(pdf);
  drawPageHeader(pdf, 13, 'Advanced Concepts');
  
  addSubtitle(pdf, 'Correlation Trading');
  
  addParagraph(pdf, 'Monitor correlated instruments for confirmation:');
  
  addBulletPoint(pdf, '/ES and /NQ: Should generally move together');
  addBulletPoint(pdf, '/ES and /DX (Dollar Index): Often inverse relationship');
  addBulletPoint(pdf, '/NQ and Big Tech: AAPL, MSFT, NVDA influence /NQ');
  addBulletPoint(pdf, 'Bonds and Equities: Historically inverse but relationship varies');
  
  addKeyConceptBox(pdf, 'DIVERGENCE SIGNAL', 'If /ES makes a new high but /NQ fails to confirm, this divergence can signal weakness. Use divergences as additional confluence, not primary signals.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Scaling Strategies');
  
  addParagraph(pdf, 'Advanced scaling approaches:');
  
  addBulletPoint(pdf, 'Scale IN: Add to winners at pullbacks within the move');
  addBulletPoint(pdf, 'Pyramid: Increase size as trade proves correct');
  addBulletPoint(pdf, 'Partial scale at structure: Take profits at each level reached');
  
  addRuleBox(pdf, 'Never scale into losers. Adding to losing positions is how accounts get destroyed. Only add to winners.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Seasonal Patterns');
  
  addParagraph(pdf, 'Markets have seasonal tendencies:');
  
  addBulletPoint(pdf, 'January Effect: Stocks often rally early January');
  addBulletPoint(pdf, 'Sell in May: Summer months often choppier');
  addBulletPoint(pdf, 'Santa Rally: Late December often bullish');
  addBulletPoint(pdf, 'FOMC: Volatility around Fed meetings');
  
  drawPageFooter(pdf, 46);
  
  // Module 13 page 4
  addNewPage(pdf);
  drawPageHeader(pdf, 13, 'Advanced Concepts');
  
  addSubtitle(pdf, 'Adapting to Market Conditions');
  
  addParagraph(pdf, 'Markets cycle through different regimes:');
  
  addBulletPoint(pdf, 'High Volatility: Wider stops, larger targets, fewer trades');
  addBulletPoint(pdf, 'Low Volatility: Tighter stops, smaller targets, range strategies');
  addBulletPoint(pdf, 'Trending: Trade with the trend, let winners run');
  addBulletPoint(pdf, 'Choppy: Reduce size, take quick profits, or sit out');
  
  addKeyConceptBox(pdf, 'ADAPTATION', 'The same setup may need different trade management depending on current volatility. Use ATR or recent range as a guide.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Building a Trading Plan');
  
  addParagraph(pdf, 'Your comprehensive trading plan should include:');
  
  addBulletPoint(pdf, 'Your specific trading hours and sessions');
  addBulletPoint(pdf, 'Instruments you trade');
  addBulletPoint(pdf, 'Entry criteria (all 4 confluence factors)');
  addBulletPoint(pdf, 'Position sizing rules');
  addBulletPoint(pdf, 'Stop and target methodology');
  addBulletPoint(pdf, 'Daily/weekly loss limits');
  addBulletPoint(pdf, 'Rules for adding size over time');
  addBulletPoint(pdf, 'When to take breaks');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Module 13 Checklist');
  addCheckbox(pdf, 'I understand multi-timeframe analysis');
  addCheckbox(pdf, 'I know basic market profile concepts');
  addCheckbox(pdf, 'I can identify day type as it develops');
  addCheckbox(pdf, 'I understand correlation and divergence');
  addCheckbox(pdf, 'I have a written trading plan');
  
  drawPageFooter(pdf, 47);
  
  // Module 13 page 5 - 180 Day Plan
  addNewPage(pdf);
  drawPageHeader(pdf, 13, 'Advanced Concepts');
  
  addSubtitle(pdf, '180-Day Development Roadmap');
  
  addParagraph(pdf, 'Your progression from beginner to consistent trader:');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'DAYS 1-30: EDUCATION PHASE');
  addBulletPoint(pdf, 'Complete all 15 modules');
  addBulletPoint(pdf, 'Paper trade only (no real money)');
  addBulletPoint(pdf, 'Focus on level marking and identification');
  addBulletPoint(pdf, 'Goal: Understand the system thoroughly');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'DAYS 31-60: SIMULATION PHASE');
  addBulletPoint(pdf, 'Continue paper trading with full position sizing rules');
  addBulletPoint(pdf, 'Track all metrics as if trading real money');
  addBulletPoint(pdf, 'Goal: 50+ simulated trades logged');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'DAYS 61-90: MICRO LIVE PHASE');
  addBulletPoint(pdf, 'Trade micros with smallest possible size');
  addBulletPoint(pdf, 'Focus on execution, not profits');
  addBulletPoint(pdf, 'Goal: Execute system consistently');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'DAYS 91-120: EVALUATION PHASE');
  addBulletPoint(pdf, 'Review all trades and statistics');
  addBulletPoint(pdf, 'Identify patterns in winners and losers');
  addBulletPoint(pdf, 'Goal: Win rate above 55%, positive expectancy');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'DAYS 121-180: SCALING PHASE');
  addBulletPoint(pdf, 'Gradually increase size (20% at a time)');
  addBulletPoint(pdf, 'Only increase after consecutive green weeks');
  addBulletPoint(pdf, 'Goal: Consistent profitability at target size');
  
  drawPageFooter(pdf, 48);
}

// MODULE 14: Trade Journal
function createModule14(pdf) {
  addNewPage(pdf);
  drawPageHeader(pdf, 14, 'Daily Trade Journal Template');
  
  addTitle(pdf, 'Module 14: Trade Journal');
  addSpacer(pdf, 10);
  
  addParagraph(pdf, 'This is your daily trade journal template. Print multiple copies or recreate in a spreadsheet. Complete this for EVERY trade.');
  
  addSpacer(pdf, 10);
  addSubtitle(pdf, 'Daily Header');
  
  addParagraph(pdf, 'Date: _____________  Session: _____________  Sleep (1-10): _____');
  addParagraph(pdf, 'Stress Level (1-10): _____  Focus (1-10): _____  Market Condition: _____________');
  addParagraph(pdf, 'Pre-Market Prep Complete: YES / NO  Intention for Today: _________________________');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Trade Entry');
  
  addParagraph(pdf, 'Trade #: _____  Instrument: _____________  Direction: LONG / SHORT');
  addParagraph(pdf, 'Entry Time: _____________  Entry Price: _____________');
  addParagraph(pdf, 'Position Size: _____ contracts  Stop Loss: _____________  Target: _____________');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'CONFLUENCE CHECKLIST:');
  addCheckbox(pdf, 'Factor 1 - Structural Level: _________________________');
  addCheckbox(pdf, 'Factor 2 - Liquidity Sweep: YES / NO');
  addCheckbox(pdf, 'Factor 3 - Price Action Confirmation: _________________________');
  addCheckbox(pdf, 'Factor 4 - DOM Confirmation: _________________________');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'Trade Rationale (why you took this trade):');
  addParagraph(pdf, '_____________________________________________________________');
  addParagraph(pdf, '_____________________________________________________________');
  
  drawPageFooter(pdf, 49);
  
  // Module 14 page 2
  addNewPage(pdf);
  drawPageHeader(pdf, 14, 'Daily Trade Journal Template');
  
  addSubtitle(pdf, 'Trade Exit');
  
  addParagraph(pdf, 'Exit Time: _____________  Exit Price: _____________');
  addParagraph(pdf, 'Exit Type: STOP / TARGET / EARLY  Reason: _________________________');
  addParagraph(pdf, 'P&L (ticks): _____________  P&L ($): _____________  R-Multiple: _____');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'What went well:');
  addParagraph(pdf, '_____________________________________________________________');
  addParagraph(pdf, '_____________________________________________________________');
  
  addSpacer(pdf, 5);
  addParagraph(pdf, 'What could improve:');
  addParagraph(pdf, '_____________________________________________________________');
  addParagraph(pdf, '_____________________________________________________________');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Daily Summary');
  
  addParagraph(pdf, 'Total Trades: _____  Wins: _____  Losses: _____  Win Rate: _____%');
  addParagraph(pdf, 'Total P&L (ticks): _____  Total P&L ($): _____  Average R: _____');
  addParagraph(pdf, 'Rule Violations Today: YES / NO  If yes, explain: _________________________');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'Key Lesson from Today:');
  addParagraph(pdf, '_____________________________________________________________');
  addParagraph(pdf, '_____________________________________________________________');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'One Thing to Improve Tomorrow:');
  addParagraph(pdf, '_____________________________________________________________');
  
  drawPageFooter(pdf, 50);
  
  // Module 14 page 3 - Weekly Summary
  addNewPage(pdf);
  drawPageHeader(pdf, 14, 'Daily Trade Journal Template');
  
  addSubtitle(pdf, 'Weekly Summary Template');
  
  addParagraph(pdf, 'Week of: _____________ to _____________');
  
  addSpacer(pdf, 10);
  const weeklyStatsTable = [
    ['Monday', '', '', '', ''],
    ['Tuesday', '', '', '', ''],
    ['Wednesday', '', '', '', ''],
    ['Thursday', '', '', '', ''],
    ['Friday', '', '', '', ''],
    ['TOTAL', '', '', '', ''],
  ];
  
  addTable(pdf, ['Day', 'Trades', 'Wins', 'Losses', 'P&L ($)'], weeklyStatsTable, [100, 80, 80, 80, 172]);
  
  addSpacer(pdf, 15);
  addParagraph(pdf, 'Weekly Win Rate: _____%  Average R-Multiple: _____');
  addParagraph(pdf, 'Largest Win: $_____  Largest Loss: $_____');
  addParagraph(pdf, 'Rule Violations This Week: _____');
  
  addSpacer(pdf, 15);
  addParagraph(pdf, 'Best Trade of the Week:');
  addParagraph(pdf, '_____________________________________________________________');
  addParagraph(pdf, '_____________________________________________________________');
  
  addParagraph(pdf, 'Worst Trade of the Week:');
  addParagraph(pdf, '_____________________________________________________________');
  addParagraph(pdf, '_____________________________________________________________');
  
  addParagraph(pdf, 'Key Pattern Noticed:');
  addParagraph(pdf, '_____________________________________________________________');
  
  addParagraph(pdf, 'Focus for Next Week:');
  addParagraph(pdf, '_____________________________________________________________');
  
  drawPageFooter(pdf, 51);
}

// MODULE 15: Exercises
function createModule15(pdf) {
  addNewPage(pdf);
  drawPageHeader(pdf, 15, 'Exercises & Self-Assessment');
  
  addTitle(pdf, 'Module 15: Self-Assessment');
  addSpacer(pdf, 10);
  
  addParagraph(pdf, 'Complete this assessment before going live. Be honest with yourself - there is no benefit to cheating. A score below 80% means you need more study time.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Knowledge Quiz');
  
  addParagraph(pdf, '1. What are the four confluence factors required for every trade?');
  addParagraph(pdf, '_____________________________________________________________');
  addParagraph(pdf, '_____________________________________________________________');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, '2. What is the maximum risk per trade in this system?');
  addParagraph(pdf, '_____________________________________________________________');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, '3. What is a liquidity sweep and why does it matter?');
  addParagraph(pdf, '_____________________________________________________________');
  addParagraph(pdf, '_____________________________________________________________');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, '4. Name three times you should NOT trade:');
  addParagraph(pdf, '_____________________________________________________________');
  addParagraph(pdf, '_____________________________________________________________');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, '5. What is the minimum risk:reward ratio you should accept?');
  addParagraph(pdf, '_____________________________________________________________');
  
  drawPageFooter(pdf, 52);
  
  // Module 15 page 2
  addNewPage(pdf);
  drawPageHeader(pdf, 15, 'Exercises & Self-Assessment');
  
  addParagraph(pdf, '6. What is a Fair Value Gap and how do you identify one?');
  addParagraph(pdf, '_____________________________________________________________');
  addParagraph(pdf, '_____________________________________________________________');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, '7. What does DOM absorption indicate?');
  addParagraph(pdf, '_____________________________________________________________');
  addParagraph(pdf, '_____________________________________________________________');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, '8. What is your daily loss limit and what do you do when you hit it?');
  addParagraph(pdf, '_____________________________________________________________');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, '9. Name the optimal trading windows for the New York session:');
  addParagraph(pdf, '_____________________________________________________________');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, '10. What should you do after a losing trade before taking another?');
  addParagraph(pdf, '_____________________________________________________________');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, '11. How do you calculate position size?');
  addParagraph(pdf, '_____________________________________________________________');
  addParagraph(pdf, '_____________________________________________________________');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, '12. What levels should you mark in your pre-market prep?');
  addParagraph(pdf, '_____________________________________________________________');
  addParagraph(pdf, '_____________________________________________________________');
  
  drawPageFooter(pdf, 53);
  
  // Module 15 page 3
  addNewPage(pdf);
  drawPageHeader(pdf, 15, 'Exercises & Self-Assessment');
  
  addParagraph(pdf, '13. What is inducement and how do you recognize it?');
  addParagraph(pdf, '_____________________________________________________________');
  addParagraph(pdf, '_____________________________________________________________');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, '14. When should you move your stop to breakeven?');
  addParagraph(pdf, '_____________________________________________________________');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, '15. What is the difference between a sweep and a breakout?');
  addParagraph(pdf, '_____________________________________________________________');
  addParagraph(pdf, '_____________________________________________________________');
  
  addSpacer(pdf, 20);
  addSubtitle(pdf, 'Self-Assessment Scoring');
  
  addParagraph(pdf, 'Score each question: 2 points for complete answer, 1 for partial, 0 for wrong/blank');
  addParagraph(pdf, 'Total Points: _____ / 30');
  addParagraph(pdf, 'Percentage: _____%');
  
  addSpacer(pdf, 10);
  const scoringTable = [
    ['90-100%', 'Ready to begin simulation trading'],
    ['80-89%', 'Review weak areas, then proceed'],
    ['70-79%', 'Re-read relevant modules and retake'],
    ['Below 70%', 'Complete re-study required'],
  ];
  
  addTable(pdf, ['Score', 'Action'], scoringTable, [120, 392]);
  
  drawPageFooter(pdf, 54);
  
  // Module 15 page 4 - Go-Live Checklist
  addNewPage(pdf);
  drawPageHeader(pdf, 15, 'Exercises & Self-Assessment');
  
  addSubtitle(pdf, 'Go-Live Readiness Checklist');
  
  addParagraph(pdf, 'Complete ALL items before trading real money:');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'EDUCATION');
  addCheckbox(pdf, 'Read all 15 modules completely');
  addCheckbox(pdf, 'Scored 80%+ on knowledge quiz');
  addCheckbox(pdf, 'Can explain all 4 confluence factors from memory');
  addCheckbox(pdf, 'Understand position sizing calculation');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'SIMULATION');
  addCheckbox(pdf, 'Completed minimum 50 paper trades');
  addCheckbox(pdf, 'Paper trading win rate above 55%');
  addCheckbox(pdf, 'Paper trading shows positive expectancy');
  addCheckbox(pdf, 'Followed all rules for 2+ consecutive weeks');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'SETUP');
  addCheckbox(pdf, 'Trading platform configured properly');
  addCheckbox(pdf, 'DOM display set up and understood');
  addCheckbox(pdf, 'Journal template ready to use');
  addCheckbox(pdf, 'Trading environment free from distractions');
  addCheckbox(pdf, 'Written trading plan completed');
  
  addSpacer(pdf, 10);
  addParagraph(pdf, 'MENTAL READINESS');
  addCheckbox(pdf, 'I am prepared to follow all rules without exception');
  addCheckbox(pdf, 'I accept that losses are part of the process');
  addCheckbox(pdf, 'I will not risk money I cannot afford to lose');
  addCheckbox(pdf, 'I have realistic expectations for my first 90 days');
  
  addSpacer(pdf, 10);
  addRuleBox(pdf, 'Date you are declaring yourself ready to begin live trading: _____________');
  
  drawPageFooter(pdf, 55);
}

// Quick Reference Cards
function createQuickReference(pdf) {
  addNewPage(pdf);
  drawPageHeader(pdf);
  
  addTitle(pdf, 'Quick Reference Cards');
  addParagraph(pdf, 'Print and keep these cards at your trading desk.');
  
  addSpacer(pdf, 15);
  addSubtitle(pdf, 'Pre-Trade Checklist (Laminate This)');
  
  addCheckbox(pdf, 'Is price at a pre-marked structural level?');
  addCheckbox(pdf, 'Did a liquidity sweep occur?');
  addCheckbox(pdf, 'Is there price action confirmation (engulfing, pin bar)?');
  addCheckbox(pdf, 'Does DOM confirm direction (absorption, stacking)?');
  addCheckbox(pdf, 'Is my stop placed correctly (beyond sweep)?');
  addCheckbox(pdf, 'Is my target minimum 1.5R?');
  addCheckbox(pdf, 'Is my position size correct (max 1% risk)?');
  addCheckbox(pdf, 'Am I calm and focused?');
  
  addSpacer(pdf, 10);
  addRuleBox(pdf, 'ALL BOXES MUST BE CHECKED TO TAKE THE TRADE');
  
  addSpacer(pdf, 20);
  addSubtitle(pdf, 'Risk Rules (Never Break These)');
  
  addBulletPoint(pdf, 'Maximum 1% risk per trade');
  addBulletPoint(pdf, 'Daily loss limit: 2%');
  addBulletPoint(pdf, 'Weekly loss limit: 5%');
  addBulletPoint(pdf, 'Minimum target: 1.5R');
  addBulletPoint(pdf, 'Never add to a losing position');
  addBulletPoint(pdf, 'Never move stop further from entry');
  addBulletPoint(pdf, 'Mandatory 15-minute break after a loss');
  
  drawPageFooter(pdf, 56);
  
  // Quick Reference page 2
  addNewPage(pdf);
  drawPageHeader(pdf);
  
  addSubtitle(pdf, 'Session Times Reference (EST)');
  
  const sessionTimes = [
    ['Asian', '7:00 PM - 2:00 AM', 'Level marking, low volume'],
    ['London', '2:00 AM - 8:00 AM', 'First major volume, sweeps Asian'],
    ['NY Open', '8:30 AM - 11:00 AM', 'Highest probability window'],
    ['NY Lunch', '11:00 AM - 2:00 PM', 'Avoid or reduce size'],
    ['NY Close', '2:00 PM - 4:00 PM', 'Second opportunity window'],
  ];
  
  addTable(pdf, ['Session', 'Time (EST)', 'Notes'], sessionTimes, [120, 160, 232]);
  
  addSpacer(pdf, 20);
  addSubtitle(pdf, 'Level Types to Mark');
  
  const levelTypes = [
    ['PDH / PDL', 'Prior Day High / Low'],
    ['PWH / PWL', 'Prior Week High / Low'],
    ['Asian H / L', 'Asian Session High / Low'],
    ['EQ Highs/Lows', 'Equal Highs or Lows'],
    ['FVG', 'Fair Value Gap'],
  ];
  
  addTable(pdf, ['Abbreviation', 'Meaning'], levelTypes, [150, 362]);
  
  addSpacer(pdf, 20);
  addSubtitle(pdf, 'Position Sizing Quick Reference (/MES)');
  
  const posRef = [
    ['$5,000', '10 ticks', '4 contracts'],
    ['$10,000', '20 ticks', '4 contracts'],
    ['$25,000', '20 ticks', '10 contracts'],
    ['$50,000', '20 ticks', '20 contracts'],
  ];
  
  addTable(pdf, ['Account', 'Stop Distance', 'Max Contracts'], posRef, [170, 170, 172]);
  
  drawPageFooter(pdf, 57);
}

// Closing Page
function createClosingPage(pdf) {
  addNewPage(pdf);
  const { doc, pageWidth, pageHeight } = pdf;
  
  // Dark background
  doc.setFillColor(7, 12, 17);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Top accent
  doc.setFillColor(0, 214, 143);
  doc.rect(0, 0, pageWidth, 6, 'F');
  
  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text('Your Journey Starts Now', pageWidth / 2, 150, { align: 'center' });
  
  // Message
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(180, 190, 200);
  
  const message = [
    'You now have everything you need to trade profitably.',
    '',
    'The system is complete. The rules are clear.',
    'The only variable is your execution.',
    '',
    'Remember: consistency beats intensity.',
    'Small, disciplined steps every day compound into mastery.',
    '',
    'Trust the process. Follow the rules.',
    'The results will come.',
  ];
  
  let y = 220;
  message.forEach((line) => {
    doc.text(line, pageWidth / 2, y, { align: 'center' });
    y += 24;
  });
  
  // Quote box
  doc.setFillColor(17, 26, 36);
  doc.roundedRect(60, 480, pageWidth - 120, 80, 6, 6, 'F');
  
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(0, 214, 143);
  doc.text('"The market rewards patience and discipline."', pageWidth / 2, 515, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(150, 160, 170);
  doc.text('- The Session Method', pageWidth / 2, 540, { align: 'center' });
  
  // Footer
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 214, 143);
  doc.text('THE SESSION METHOD', pageWidth / 2, pageHeight - 80, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 110, 120);
  doc.text('www.thesessionmethod.com', pageWidth / 2, pageHeight - 60, { align: 'center' });
  doc.text('Copyright 2026. All Rights Reserved.', pageWidth / 2, pageHeight - 45, { align: 'center' });
}

// MAIN GENERATION FUNCTION
function generateWorkbookPDF() {
  const pdf = createPDF();
  
  // Create all pages
  createCoverPage(pdf);
  createCredibilityPage(pdf);
  createValuePage(pdf);
  createCopyrightPage(pdf);
  createTableOfContents(pdf);
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
  createQuickReference(pdf);
  createClosingPage(pdf);
  
  return pdf.doc;
}

// Generate and save the PDF
console.log('Generating PDF...');
const doc = generateWorkbookPDF();
const pdfOutput = doc.output('arraybuffer');
const buffer = Buffer.from(pdfOutput);

const outputPath = path.join(process.cwd(), 'public', 'The-Session-Blueprint-Premium.pdf');
fs.writeFileSync(outputPath, buffer);
console.log(`PDF saved to: ${outputPath}`);
console.log(`File size: ${(buffer.length / 1024).toFixed(2)} KB`);
