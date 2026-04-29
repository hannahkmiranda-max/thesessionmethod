import { generateWorkbookPDF } from '@/lib/generate-workbook-pdf';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pdfBuffer = generateWorkbookPDF();
    
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="The-Session-Blueprint-Premium-2026.pdf"',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response('Error generating PDF', { status: 500 });
  }
}
