// src/components/ReportExporter.tsx
import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@mui/material';

interface ReportExporterProps {
	reportId?: string;
}

const ReportExporter: React.FC<ReportExporterProps> = ({ reportId = '' }) => {
	const handleExport = async () => {
		if (!reportId) return alert('No se proporcionó reportId');
		const el = document.getElementById(reportId);
		if (!el) return alert('No se encontró el elemento del reporte');

		try {
			const canvas = await html2canvas(el, { scale: 2 });
			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF('portrait', 'pt', 'a4');
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
			pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
			pdf.save('reporte.pdf');
		} catch (error) {
			console.error('Error exportando reporte:', error);
			alert('Error exportando reporte. Revisa la consola.');
		}
	};

	return (
		<Button variant="contained" onClick={handleExport}>
			Exportar reporte (PDF)
		</Button>
	);
};

export default ReportExporter;
