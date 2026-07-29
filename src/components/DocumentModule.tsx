import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { EnterpriseDocument } from '../types';
import {
  FileCheck2,
  Plus,
  QrCode,
  ShieldCheck,
  Sparkles,
  FileText,
  UserCheck,
  Building2,
  Send,
  Link2,
  Hash,
  Award,
  BookOpen,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  HelpCircle,
  Printer,
  Search,
  Copy,
  Check,
  Clock,
  FileEdit,
  FolderArchive,
  CheckCircle2,
  Download,
  FileDown
} from 'lucide-react';

interface DocumentModuleProps {
  documents: EnterpriseDocument[];
  onAddDocument: (doc: EnterpriseDocument) => void;
  onOpenQrModal: (title: string, data: string, hash?: string) => void;
}

export const DocumentModule: React.FC<DocumentModuleProps> = ({
  documents,
  onAddDocument,
  onOpenQrModal
}) => {
  const [selectedDoc, setSelectedDoc] = useState<EnterpriseDocument | null>(documents[0] || null);

  useEffect(() => {
    if (documents.length > 0) {
      if (!selectedDoc || !documents.some(d => d.id === selectedDoc.id)) {
        // Prefer doc_pnap_01 or first document
        const pnapDoc = documents.find(d => d.id === 'doc_pnap_01');
        setSelectedDoc(pnapDoc || documents[0]);
      }
    }
  }, [documents]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const printableRef = useRef<HTMLDivElement>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'all' | 'signed' | 'pending_signature' | 'draft' | 'oficio_estatal' | 'archived'>('all');

  // Document Generator Form State
  const [docType, setDocType] = useState<EnterpriseDocument['type']>('oficio_estatal');
  const [docTitle, setDocTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [refNumber, setRefNumber] = useState(`VIT/OF/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`);
  const [targetRefNumber, setTargetRefNumber] = useState('');

  // State Institution & Recipient Contacts
  const [recipientEntity, setRecipientEntity] = useState('');
  const [recipientDepartment, setRecipientDepartment] = useState('');
  const [recipientTitle, setRecipientTitle] = useState('Exmo.(a) Senhor(a) Director(a) Nacional');
  const [recipientContact, setRecipientContact] = useState('');

  // Draft Idea & Value
  const [draftIdea, setDraftIdea] = useState('');
  const [valueKz, setValueKz] = useState<number | ''>('');
  
  // Document Linking & Threading
  const [relatedDocId, setRelatedDocId] = useState('');

  // Stats calculation
  const totalDocs = documents.length;
  const signedDocsCount = documents.filter(d => d.status === 'signed').length;
  const pendingDocsCount = documents.filter(d => d.status === 'pending_signature').length;
  const draftDocsCount = documents.filter(d => d.status === 'draft').length;
  const stateOficiosCount = documents.filter(d => d.type === 'oficio_estatal').length;
  const archivedDocsCount = documents.filter(d => d.status === 'archived').length;

  // Filtered documents
  const filteredDocuments = documents.filter(doc => {
    let matchesFilter = true;
    if (activeStatusFilter === 'signed') matchesFilter = doc.status === 'signed';
    else if (activeStatusFilter === 'pending_signature') matchesFilter = doc.status === 'pending_signature';
    else if (activeStatusFilter === 'draft') matchesFilter = doc.status === 'draft';
    else if (activeStatusFilter === 'oficio_estatal') matchesFilter = doc.type === 'oficio_estatal';
    else if (activeStatusFilter === 'archived') matchesFilter = doc.status === 'archived';

    if (!searchQuery.trim()) return matchesFilter;

    const q = searchQuery.toLowerCase();
    const matchesQuery =
      doc.title.toLowerCase().includes(q) ||
      (doc.subject && doc.subject.toLowerCase().includes(q)) ||
      (doc.refNumber && doc.refNumber.toLowerCase().includes(q)) ||
      (doc.recipientEntity && doc.recipientEntity.toLowerCase().includes(q)) ||
      doc.content.toLowerCase().includes(q);

    return matchesFilter && matchesQuery;
  });

  // Copy document text
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto-fill state institution presets
  const applyStatePreset = (entityName: string, dept: string, titleStr: string, contactStr: string) => {
    setRecipientEntity(entityName);
    setRecipientDepartment(dept);
    setRecipientTitle(titleStr);
    setRecipientContact(contactStr);
  };

  // Download document directly to user's device
  const handleDownloadDoc = (doc: EnterpriseDocument, format: 'doc' | 'txt' | 'html') => {
    let mimeType = 'text/plain;charset=utf-8';
    let fileContent = '';

    const sanitizedRef = (doc.refNumber || doc.title).replace(/[\/\\]/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '_');
    const filename = `${sanitizedRef}_VITRONIS.${format}`;

    if (format === 'txt') {
      mimeType = 'text/plain;charset=utf-8';
      fileContent = `=====================================================
VITRONIS – Robótica e Controlo, Lda.
Sede: Luanda (Boa Vida) - República de Angola • NIF: AO509876543
Email: geral@vitronis.com | Tel: +244 923 000 111
=====================================================

N/Refª: ${doc.refNumber || 'VIT/OF/2026/0204'}
${doc.targetRefNumber ? `V/Refª: ${doc.targetRefNumber}\n` : ''}Data: ${doc.createdAt || '03 de Agosto de 2026'}

DESTINATÁRIO:
${doc.recipientTitle || 'Exmo. Director Nacional da TTI do SP/MININT-Angola'}
${doc.recipientSubTitle ? `${doc.recipientSubTitle}\n` : ''}${doc.recipientEntity || 'Serviço Penitenciário de Angola'}
${doc.recipientDepartment || 'Direcção Nacional das Telecomunicações e Tecnologias de Informação'}
${doc.recipientContact || ''}

ASSUNTO: ${doc.subject?.toUpperCase() || doc.title.toUpperCase()}

-----------------------------------------------------
${doc.content}
-----------------------------------------------------

Com elevada consideração e atenciosamente,

_____________________________________________________
${doc.signatoryName || 'ISABEL TRUMAN'}
${doc.signatoryRole || 'A Administradora-Geral'}
VITRONIS – Robótica e Controlo, Lda.

[RASTREABILIDADE LEGAL DIGITAL VITRONIS]
Hash SHA-256: ${doc.hash}
Ambiente AAI: AAI-PNAP-AO-2026-VIANA
Certificado Digital ID: AO-CERT-LEGAL-VIT-2026-PNAP
`;
    } else {
      mimeType = format === 'doc' ? 'application/msword;charset=utf-8' : 'text/html;charset=utf-8';
      fileContent = `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="utf-8">
<title>${doc.title}</title>
<style>
  body { font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #0f172a; padding: 40px; max-width: 800px; margin: 0 auto; background-color: #ffffff; }
  .header { border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 25px; font-family: Arial, sans-serif; }
  .brand { font-size: 24px; font-weight: bold; font-family: Arial, sans-serif; text-transform: uppercase; color: #0f172a; letter-spacing: 2px; }
  .subbrand { font-size: 11px; font-weight: bold; font-family: Arial, sans-serif; color: #075985; text-transform: uppercase; margin-top: 2px; }
  .company-info { font-size: 11px; font-family: Arial, sans-serif; color: #475569; margin-top: 6px; }
  .ref-box { float: right; text-align: right; font-family: monospace; font-size: 12px; background: #f8fafc; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; }
  .recipient-box { margin-bottom: 25px; border-bottom: 1px solid #cbd5e1; padding-bottom: 15px; font-family: Arial, sans-serif; }
  .recipient-title { font-size: 15px; font-weight: bold; color: #0f172a; }
  .recipient-subtitle { font-size: 13px; font-weight: bold; color: #0891b2; margin-top: 2px; }
  .subject-box { background: #f8fafc; padding: 10px 14px; border-left: 4px solid #075985; font-weight: bold; font-family: Arial, sans-serif; font-size: 13px; margin-bottom: 25px; color: #0f172a; }
  .content { font-size: 14px; text-align: justify; white-space: pre-wrap; margin-bottom: 40px; line-height: 1.8; }
  .footer { border-top: 1px solid #cbd5e1; padding-top: 20px; font-family: Arial, sans-serif; }
  .signature-title { font-size: 14px; font-weight: bold; margin-top: 20px; }
  .stamp-box { background: #f8fafc; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; text-align: center; font-size: 10px; font-family: monospace; color: #475569; margin-top: 15px; }
</style>
</head>
<body>
  <div class="header">
    <div class="ref-box">
      <strong>N/Refª:</strong> ${doc.refNumber || 'VIT/OF/2026/0204'}<br>
      ${doc.targetRefNumber ? `<strong>V/Refª:</strong> ${doc.targetRefNumber}<br>` : ''}
      <span>${doc.createdAt || '03 de Agosto de 2026'}</span>
    </div>
    <div>
      <div class="brand">VITRONIS</div>
      <div class="subbrand">Robótica e Controlo, Lda. • Soluções de Missão Crítica</div>
      <div class="company-info">
        Sede: Luanda (Boa Vida) - República de Angola • NIF: AO509876543<br>
        Email: geral@vitronis.com | Tel: +244 923 000 111
      </div>
    </div>
    <div style="clear:both;"></div>
  </div>

  ${doc.recipientEntity ? `
  <div class="recipient-box">
    <div class="recipient-title">${doc.recipientTitle || 'Exmo. Director Nacional da TTI do SP/MININT-Angola'}</div>
    ${doc.recipientSubTitle ? `<div class="recipient-subtitle">${doc.recipientSubTitle}</div>` : ''}
    <div style="font-weight:bold; color:#1e293b; margin-top:2px;">${doc.recipientEntity}</div>
    ${doc.recipientDepartment ? `<div style="color:#334155;">${doc.recipientDepartment}</div>` : ''}
    ${doc.recipientContact ? `<div style="font-size:11px; color:#64748b; margin-top:6px;">${doc.recipientContact}</div>` : ''}
  </div>
  ` : ''}

  ${doc.subject ? `<div class="subject-box">ASSUNTO: ${doc.subject.toUpperCase()}</div>` : ''}

  <div class="content">${doc.content}</div>

  <div class="footer">
    <div>
      <p style="font-size:12px; color:#64748b; margin-bottom: 25px;">Com elevada consideração e atenciosamente,</p>
      <div style="width:240px; border-bottom:1px solid #0f172a; margin-bottom:6px;"></div>
      <div class="signature-title">${doc.signatoryName || 'ISABEL TRUMAN'}</div>
      <div style="font-size:12px; color:#334155;">${doc.signatoryRole || 'A Administradora-Geral'}</div>
      <div style="font-size:12px; font-weight:bold; color:#075985;">VITRONIS – Robótica e Controlo, Lda.</div>
    </div>
    <div class="stamp-box">
      <strong style="color:#0f172a;">✓ RASTREABILIDADE LEGAL DIGITAL</strong><br>
      <span style="color:#047857; font-weight:bold;">Assinatura Certificada Vitronis</span><br>
      Hash SHA-256: ${doc.hash}<br>
      República de Angola
    </div>
  </div>
</body>
</html>`;
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
  };

  // Export document directly to formatted PDF file using jsPDF and html2canvas
  const handleExportPDF = async (doc: EnterpriseDocument) => {
    setIsPdfGenerating(true);

    if (!isPrintModalOpen) {
      setIsPrintModalOpen(true);
      // Wait for DOM to render the printable paper element
      await new Promise(res => setTimeout(res, 450));
    }

    try {
      const element = printableRef.current;
      if (!element) {
        alert('Não foi possível localizar o elemento do documento para conversão PDF.');
        setIsPdfGenerating(false);
        return;
      }

      // Capture element canvas
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution crisp text
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width mm
      const pageHeight = 297; // A4 height mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const sanitizedRef = (doc.refNumber || doc.title)
        .replace(/[\/\\]/g, '_')
        .replace(/[^a-zA-Z0-9_\-]/g, '_');

      pdf.save(`${sanitizedRef}_VITRONIS.pdf`);
    } catch (err) {
      console.error('Erro ao gerar ficheiro PDF:', err);
      alert('Ocorreu um erro ao gerar o PDF. Por favor tente a opção Imprimir.');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // Handle Orchestration from an existing document
  const handleOrchestrateReply = (sourceDoc: EnterpriseDocument) => {
    setDocType('oficio_estatal');
    setDocTitle(`Resposta ao Ofício - ${sourceDoc.title}`);
    setSubject(`Resposta ao Ofício Refª ${sourceDoc.refNumber || sourceDoc.id}`);
    setRelatedDocId(sourceDoc.id);
    setTargetRefNumber(sourceDoc.refNumber || '');
    setRecipientEntity(sourceDoc.recipientEntity || sourceDoc.author);
    setRecipientDepartment(sourceDoc.recipientDepartment || 'Direcção Geral');
    setRecipientTitle(sourceDoc.recipientTitle || 'Exmo.(a) Senhor(a) Director(a)');
    setRecipientContact(sourceDoc.recipientContact || '');
    setDraftIdea(`Em resposta à comunicação de V. Exa. referente ao assunto [${sourceDoc.subject || sourceDoc.title}], vimos por este meio informar que a Vitronis concorda e apresentará as diretrizes solicitadas.`);
    setIsModalOpen(true);
  };

  const handleGenerateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle && !subject) return;

    setIsGenerating(true);
    const selectedRelatedDoc = documents.find(d => d.id === relatedDocId);

    try {
      const res = await fetch('/api/ai/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: docTitle || subject,
          docType,
          subject: subject || docTitle,
          refNumber,
          targetRefNumber,
          recipientEntity: recipientEntity || 'Instituição Estatal Destinatária',
          recipientDepartment,
          recipientTitle,
          recipientContact,
          draftIdea,
          value: valueKz || undefined,
          relatedDocTitle: selectedRelatedDoc?.title,
          relatedDocRef: selectedRelatedDoc?.refNumber
        })
      });

      const data = await res.json();
      if (data.success) {
        const newDoc: EnterpriseDocument = {
          id: `doc_${Date.now()}`,
          title: docTitle || subject,
          type: docType,
          subject: subject || docTitle,
          refNumber,
          targetRefNumber: targetRefNumber || undefined,
          recipientEntity,
          recipientDepartment,
          recipientTitle,
          recipientContact,
          author: 'Isabel Truman - Administradora Geral da Vitronis',
          signatoryName: 'Isabel Truman',
          signatoryRole: 'Administradora Geral da Vitronis',
          createdAt: data.createdAt,
          version: '1.0',
          status: 'signed',
          content: data.content,
          draftIdea,
          hash: data.hash,
          relatedDocId: selectedRelatedDoc?.id,
          relatedDocTitle: selectedRelatedDoc?.title,
          signers: data.signers
        };

        onAddDocument(newDoc);
        setSelectedDoc(newDoc);
        setIsModalOpen(false);

        // Reset Form
        setDocTitle('');
        setSubject('');
        setDraftIdea('');
        setValueKz('');
        setTargetRefNumber('');
        setRelatedDocId('');
        setRefNumber(`VIT/OF/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`);
      }
    } catch (err) {
      console.error('Error generating document:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
            <FileCheck2 className="w-4 h-4" /> AUTOMATED LEGAL & STATE DOCUMENT ENGINE • ANGOLA
          </div>
          <h2 className="text-xl font-bold text-white">Banco & Repositório de Documentos Oficiais</h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Gestão de ofícios estatais, cartas formais e contratos com consulta imediata, rastreabilidade QR e assinatura executiva de <strong className="text-white">Isabel Truman (Administradora Geral da Vitronis)</strong>.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4" /> Redigir Novo Ofício / Carta
        </button>
      </div>

      {/* Top Metric Cards: Repository Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow">
          <div className="text-slate-400 text-[11px] font-medium flex items-center justify-between">
            <span>Total no Repositório</span>
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white mt-1 font-mono">{totalDocs}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Todos os documentos</div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 bg-emerald-950/10 p-3.5 rounded-xl shadow">
          <div className="text-emerald-400 text-[11px] font-semibold flex items-center justify-between">
            <span>Finalizados & Assinados</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-300 mt-1 font-mono">{signedDocsCount}</div>
          <div className="text-[10px] text-emerald-500 mt-0.5">Prontos a enviar / expedir</div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 bg-amber-950/10 p-3.5 rounded-xl shadow">
          <div className="text-amber-400 text-[11px] font-semibold flex items-center justify-between">
            <span>Pendentes de Assinatura</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-amber-300 mt-1 font-mono">{pendingDocsCount}</div>
          <div className="text-[10px] text-amber-500 mt-0.5">A aguardar validação</div>
        </div>

        <div className="bg-slate-900 border border-cyan-500/30 bg-cyan-950/10 p-3.5 rounded-xl shadow">
          <div className="text-cyan-400 text-[11px] font-semibold flex items-center justify-between">
            <span>Ofícios Estatais</span>
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-cyan-300 mt-1 font-mono">{stateOficiosCount}</div>
          <div className="text-[10px] text-cyan-500 mt-0.5">Comunicação do Estado</div>
        </div>
      </div>

      {/* Main Content: Vault List + Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Repository Search, Filters & List */}
        <div className="space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por título, nº refª, órgão..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-[11px]">
            <button
              onClick={() => setActiveStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                activeStatusFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Todos ({totalDocs})
            </button>
            <button
              onClick={() => setActiveStatusFilter('signed')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                activeStatusFilter === 'signed'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Assinados ({signedDocsCount})
            </button>
            <button
              onClick={() => setActiveStatusFilter('pending_signature')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                activeStatusFilter === 'pending_signature'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Pendentes ({pendingDocsCount})
            </button>
            <button
              onClick={() => setActiveStatusFilter('oficio_estatal')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                activeStatusFilter === 'oficio_estatal'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Ofícios ({stateOficiosCount})
            </button>
          </div>

          <div className="flex items-center justify-between px-1 pt-1">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Repositório ({filteredDocuments.length})
            </h3>
            <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              Vitronis AO
            </span>
          </div>

          {/* Document List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredDocuments.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs">
                Nenhum documento encontrado com os filtros aplicados.
              </div>
            ) : (
              filteredDocuments.map(doc => {
                const isSelected = selectedDoc?.id === doc.id;

                let statusBadge = (
                  <span className="text-[9px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> Assinado
                  </span>
                );
                if (doc.status === 'pending_signature') {
                  statusBadge = (
                    <span className="text-[9px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800 font-bold flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-amber-400" /> Pendente
                    </span>
                  );
                } else if (doc.status === 'draft') {
                  statusBadge = (
                    <span className="text-[9px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800 font-bold flex items-center gap-1">
                      <FileEdit className="w-2.5 h-2.5 text-blue-400" /> Rascunho
                    </span>
                  );
                } else if (doc.status === 'archived') {
                  statusBadge = (
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-bold flex items-center gap-1">
                      <FolderArchive className="w-2.5 h-2.5 text-slate-400" /> Arquivado
                    </span>
                  );
                }

                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer relative ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500/60 shadow-lg shadow-cyan-950/50'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold px-2 py-0.5 bg-cyan-950 rounded border border-cyan-800">
                        {doc.type === 'oficio_estatal'
                          ? 'Ofício Estatal'
                          : doc.type === 'carta_formal'
                          ? 'Carta Formal'
                          : doc.type === 'contract'
                          ? 'Contrato'
                          : doc.type === 'parecer'
                          ? 'Parecer Técnico'
                          : doc.type}
                      </span>
                      {statusBadge}
                    </div>

                    <h4 className="font-semibold text-white text-xs mb-1 line-clamp-2">{doc.title}</h4>

                    {doc.recipientEntity && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                        <Building2 className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate">{doc.recipientEntity}</span>
                      </div>
                    )}

                    {doc.refNumber && (
                      <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mb-1">
                        <Hash className="w-3 h-3 text-slate-500 shrink-0" /> Ref: {doc.refNumber}
                      </div>
                    )}

                    {doc.relatedDocTitle && (
                      <div className="text-[10px] text-cyan-400 bg-cyan-950/60 p-1 rounded border border-cyan-900/60 flex items-center gap-1 mt-1 font-mono">
                        <Link2 className="w-3 h-3 shrink-0" /> Resposta a: {doc.relatedDocTitle}
                      </div>
                    )}

                    <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> Isabel Truman
                      </span>
                      <span className="text-slate-500 font-mono">{doc.createdAt}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Document Viewer & Orchestrator */}
        <div className="lg:col-span-2">
          {selectedDoc ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              {/* Doc Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs bg-cyan-950 text-cyan-300 px-2.5 py-0.5 rounded border border-cyan-800 font-mono uppercase font-bold">
                      {selectedDoc.type === 'oficio_estatal' ? 'Ofício Estatal' : selectedDoc.type}
                    </span>
                    {selectedDoc.refNumber && (
                      <span className="text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded font-mono">
                        N/Refª: {selectedDoc.refNumber}
                      </span>
                    )}
                    {selectedDoc.targetRefNumber && (
                      <span className="text-xs text-slate-400 font-mono">
                        V/Refª: {selectedDoc.targetRefNumber}
                      </span>
                    )}
                    <span className="text-xs text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                      ✓ Finalizado & Prontidão de Envio
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{selectedDoc.title}</h3>
                  {selectedDoc.subject && (
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      <strong className="text-slate-300">Assunto:</strong> {selectedDoc.subject}
                    </p>
                  )}
                </div>

                {/* Toolbar Buttons: Streamlined PDF / Print and Secondary Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleExportPDF(selectedDoc)}
                    disabled={isPdfGenerating}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-lg shadow-rose-950/50 disabled:opacity-50"
                    title="Baixar diretamente o documento timbrado em ficheiro PDF"
                  >
                    {isPdfGenerating ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <FileDown className="w-4 h-4" />
                    )}
                    {isPdfGenerating ? 'A Gerar PDF...' : 'Baixar PDF (.pdf)'}
                  </button>

                  <button
                    onClick={() => setIsPrintModalOpen(true)}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-lg shadow-emerald-950/50"
                    title="Visualizar documento em papel timbrado oficial para imprimir ou exportar"
                  >
                    <Printer className="w-4 h-4" /> Imprimir Documento
                  </button>

                  <button
                    onClick={() => handleDownloadDoc(selectedDoc, 'doc')}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
                    title="Descarregar ficheiro Microsoft Word (.doc)"
                  >
                    <Download className="w-4 h-4" /> Word (.doc)
                  </button>

                  <button
                    onClick={() => handleCopyText(selectedDoc.content)}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
                    title="Copiar texto do documento"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>

                  <button
                    onClick={() => handleOrchestrateReply(selectedDoc)}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
                    title="Criar um ofício de resposta vinculado a este documento"
                  >
                    <Link2 className="w-4 h-4 text-cyan-400" /> Resposta Vinculada
                  </button>

                  <button
                    onClick={() =>
                      onOpenQrModal(
                        `Rastreabilidade Legal: ${selectedDoc.title}`,
                        `VERIFIED_LEGAL_DOC|HASH:${selectedDoc.hash}|REF:${selectedDoc.refNumber || 'N/A'}|SIGNATORY:Isabel Truman (Administradora Geral da Vitronis)`,
                        selectedDoc.hash
                      )
                    }
                    className="flex items-center gap-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                    title="Ver Rastreabilidade Legal e Código QR AAI"
                  >
                    <QrCode className="w-4 h-4 text-cyan-400" /> QR AAI
                  </button>
                </div>
              </div>

              {/* Recipient & Integrated AAI QR Code Header */}
              {selectedDoc.recipientEntity && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <div className="text-cyan-400 font-bold text-sm">
                      {selectedDoc.recipientTitle || 'Exmo. Director Nacional da TTI do SP/MININT-Angola'}
                    </div>
                    {selectedDoc.recipientSubTitle && (
                      <div className="text-slate-200 font-semibold text-xs">
                        {selectedDoc.recipientSubTitle}
                      </div>
                    )}
                    <div className="text-slate-300 font-semibold">{selectedDoc.recipientEntity}</div>
                    {selectedDoc.recipientDepartment && (
                      <div className="text-slate-400">{selectedDoc.recipientDepartment}</div>
                    )}
                    {selectedDoc.recipientContact && (
                      <div className="text-slate-500 text-[11px] mt-1 max-w-xl leading-relaxed">{selectedDoc.recipientContact}</div>
                    )}
                  </div>

                  {/* Right Side: QR Code AAI */}
                  <div
                    onClick={() =>
                      onOpenQrModal(
                        `AAI – Ambiente de Avaliação Institucional (${selectedDoc.title})`,
                        `AAI-PNAP-AO-2026-VIANA|REF:${selectedDoc.refNumber}|VALIDITY:TESTES-7-DIAS-EP-VIANA`,
                        selectedDoc.hash
                      )
                    }
                    className="shrink-0 bg-slate-900 hover:bg-slate-850 p-3 rounded-xl border border-cyan-800/80 cursor-pointer transition text-center group shadow-md"
                  >
                    <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-tight mb-1 font-mono">
                      QR CODE AAI
                    </div>
                    <div className="bg-white p-1.5 rounded-lg inline-block group-hover:scale-105 transition">
                      <svg className="w-14 h-14 text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                        <rect x="0" y="0" width="100" height="100" fill="white" />
                        <rect x="5" y="5" width="28" height="28" fill="black" />
                        <rect x="9" y="9" width="20" height="20" fill="white" />
                        <rect x="13" y="13" width="12" height="12" fill="black" />

                        <rect x="67" y="5" width="28" height="28" fill="black" />
                        <rect x="71" y="9" width="20" height="20" fill="white" />
                        <rect x="75" y="13" width="12" height="12" fill="black" />

                        <rect x="5" y="67" width="28" height="28" fill="black" />
                        <rect x="9" y="71" width="20" height="20" fill="white" />
                        <rect x="13" y="75" width="12" height="12" fill="black" />

                        <rect x="38" y="10" width="6" height="6" fill="black" />
                        <rect x="50" y="10" width="6" height="6" fill="black" />
                        <rect x="10" y="38" width="6" height="6" fill="black" />
                        <rect x="10" y="50" width="6" height="6" fill="black" />

                        <rect x="38" y="38" width="10" height="10" fill="black" />
                        <rect x="52" y="38" width="8" height="8" fill="black" />
                        <rect x="65" y="38" width="10" height="6" fill="black" />
                        <rect x="80" y="38" width="10" height="10" fill="black" />

                        <rect x="38" y="52" width="6" height="10" fill="black" />
                        <rect x="48" y="52" width="12" height="6" fill="black" />
                        <rect x="65" y="50" width="8" height="12" fill="black" />
                        <rect x="78" y="52" width="12" height="6" fill="black" />

                        <rect x="38" y="67" width="10" height="10" fill="black" />
                        <rect x="52" y="67" width="8" height="14" fill="black" />
                        <rect x="65" y="67" width="25" height="6" fill="black" />
                        <rect x="38" y="82" width="14" height="8" fill="black" />
                        <rect x="65" y="78" width="8" height="12" fill="black" />
                        <rect x="78" y="78" width="12" height="12" fill="black" />
                      </svg>
                    </div>
                    <div className="text-[9px] font-mono text-cyan-300 font-bold mt-1">
                      AAI-PNAP-AO-2026
                    </div>
                    <div className="text-[8px] text-slate-400 font-mono mt-0.5">
                      Ampliar QR Code
                    </div>
                  </div>
                </div>
              )}

              {/* Legal Traceability Seal Banner */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5">
                <div className="flex items-center justify-between text-cyan-400 font-semibold">
                  <span className="flex items-center gap-1.5 text-xs">
                    <Award className="w-4 h-4 text-cyan-400" /> Selo de Origem & Validade Legal Rastreável (Angola)
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                    ✓ Criptografado & Autêntico
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                  <div>
                    <span className="text-slate-500">Signatária Legal:</span> <strong className="text-white font-sans">Isabel Truman</strong> (Administradora Geral)
                  </div>
                  <div>
                    <span className="text-slate-500">Emitente:</span> Vitronis Technologies Group S.A.
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 break-all font-mono pt-0.5 border-t border-slate-900">
                  SHA-256: {selectedDoc.hash}
                </div>
              </div>

              {/* Document Text Body */}
              <div className="bg-slate-950/90 p-6 rounded-xl border border-slate-800 text-xs text-slate-100 leading-relaxed font-mono whitespace-pre-wrap max-h-[420px] overflow-y-auto shadow-inner">
                {selectedDoc.content}
              </div>

              {/* Signers Box */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="font-semibold text-white text-xs mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-cyan-400" /> Assinantes Válidos & Termo de Autenticidade
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedDoc.signers?.map((signer, idx) => (
                    <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">{signer.name}</div>
                        <div className="text-[10px] text-slate-400">{signer.role} • {signer.email}</div>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-800 font-mono font-bold">
                        ✓ {signer.signedAt || 'Assinado'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              <FileText className="w-12 h-12 text-cyan-400 mx-auto mb-3 opacity-60" />
              <p className="text-sm">Selecione um documento no cofre para visualizar, rastrear o QR Code ou responder.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Redigir Novo Ofício / Carta */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" /> Redigir Documento Oficial com IA
                </h3>
                <p className="text-xs text-slate-400">
                  Preenchimento automático de protocolos estatais com assinatura de Isabel Truman
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateDocument} className="space-y-4 text-xs">
              {/* Presets Bar for State Institutions */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <label className="block text-[11px] font-bold text-cyan-400 font-mono uppercase flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" /> Presets RÁPIDOS de Instituições Estatais (Angola)
                </label>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => applyStatePreset(
                      'Serviço Penitenciário de Angola',
                      'Direcção Nacional das Telecomunicações e Tecnologias de Informação',
                      'Exmo. Director Nacional da TTI do SP/MININT-Angola',
                      'Avenida 11 de Novembro, Rua Nginga Mbande, Viana. Luanda - Angola | (+244) 930 985 561 | gcii@sp.gov.ao | https://sp.gov.ao/quemsomos'
                    )}
                    className="bg-cyan-950 text-cyan-300 hover:bg-cyan-900 px-2.5 py-1 rounded-lg border border-cyan-800 transition font-bold"
                  >
                    Serviço Penitenciário (PNAP-AO)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyStatePreset(
                      'Ministério das Telecomunicações, Tecnologias de Informação e Comunicação Social (MTTICS)',
                      'Direcção Nacional de Telecomunicações',
                      'Exmo.(a) Senhor(a) Director(a) Nacional',
                      'Avenida 4 de Fevereiro, Luanda • contacto@mttics.gov.ao'
                    )}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition"
                  >
                    MTTICS
                  </button>
                  <button
                    type="button"
                    onClick={() => applyStatePreset(
                      'Instituto Nacional de Fomento da Sociedade da Informação (INFOSI)',
                      'Gabinete do Director Geral',
                      'Exmo.(a) Senhor(a) Director(a) Geral',
                      'Edifício INFOSI, Luanda • geral@infosi.gov.ao'
                    )}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition"
                  >
                    INFOSI
                  </button>
                  <button
                    type="button"
                    onClick={() => applyStatePreset(
                      'Administração Geral Tributária (AGT)',
                      'Direcção dos Serviços Relevantes',
                      'Exmo.(a) Senhor(a) Administrador(a)',
                      'Edifício AGT, Luanda • apoio.contribuinte@agt.minfin.gov.ao'
                    )}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition"
                  >
                    AGT
                  </button>
                  <button
                    type="button"
                    onClick={() => applyStatePreset(
                      'Governo Provincial de Luanda (GPL)',
                      'Gabinete do Governador Provincial',
                      'Exmo.(a) Senhor(a) Governador(a) Provincial',
                      'Largo do Mutamba, Luanda'
                    )}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition"
                  >
                    GPL
                  </button>
                </div>
              </div>

              {/* Document Category & Reference Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tipo de Documento</label>
                  <select
                    value={docType}
                    onChange={e => setDocType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="oficio_estatal">Ofício a Instituição Estatal</option>
                    <option value="carta_formal">Carta Formal / Comunicação</option>
                    <option value="contract">Contrato de Prestação / Parceria</option>
                    <option value="parecer">Parecer Técnico / Jurídico</option>
                    <option value="proposta">Proposta Comercial / Orçamento</option>
                    <option value="report">Relatório Executivo</option>
                    <option value="memo">Memorando Interno</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">N/Refª (Vitronis)</label>
                  <input
                    type="text"
                    value={refNumber}
                    onChange={e => setRefNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">V/Refª (Sua Referência)</label>
                  <input
                    type="text"
                    value={targetRefNumber}
                    onChange={e => setTargetRefNumber(e.target.value)}
                    placeholder="Ex: MTTICS/DN/089/2026"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Document Linking Box */}
              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-cyan-400" /> Documento / Ofício Relacionado (Opcional)
                </label>
                <select
                  value={relatedDocId}
                  onChange={e => {
                    setRelatedDocId(e.target.value);
                    const selected = documents.find(d => d.id === e.target.value);
                    if (selected) {
                      setTargetRefNumber(selected.refNumber || '');
                      if (selected.recipientEntity) setRecipientEntity(selected.recipientEntity);
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="">Nenhum (Novo fluxo autônomo)</option>
                  {documents.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.refNumber ? `[${d.refNumber}] ` : ''}{d.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title and Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Título do Documento</label>
                  <input
                    type="text"
                    required
                    value={docTitle}
                    onChange={e => setDocTitle(e.target.value)}
                    placeholder="Ex: Ofício de Solicitação de Vistoria de Infraestrutura"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Assunto Formal (Livre / Personalizado)</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Ex: Licenciamento de Frequência de Telemetria e Sensores IoT"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Recipient Information */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-3">
                <div className="text-xs font-bold text-cyan-400 font-mono uppercase flex items-center gap-1">
                  <Building2 className="w-4 h-4" /> Dados Formais da Instituição Destinatária
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] font-medium mb-1">Instituição / Empresa</label>
                    <input
                      type="text"
                      value={recipientEntity}
                      onChange={e => setRecipientEntity(e.target.value)}
                      placeholder="Ex: Ministério das Telecomunicações"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] font-medium mb-1">Direcção / Gabinete</label>
                    <input
                      type="text"
                      value={recipientDepartment}
                      onChange={e => setRecipientDepartment(e.target.value)}
                      placeholder="Ex: Direcção Nacional de Tecnologias"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] font-medium mb-1">Tratamento Honorífico / Cargo</label>
                    <input
                      type="text"
                      value={recipientTitle}
                      onChange={e => setRecipientTitle(e.target.value)}
                      placeholder="Ex: Exmo.(a) Senhor(a) Director(a) Nacional"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] font-medium mb-1">Contactos do Destinatário</label>
                    <input
                      type="text"
                      value={recipientContact}
                      onChange={e => setRecipientContact(e.target.value)}
                      placeholder="Ex: Av. 4 de Fevereiro, Luanda • contacto@mttics.gov.ao"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Value if applicable */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">Valor do Contrato / Proposta (Kwanzas - Kz)</label>
                <input
                  type="number"
                  value={valueKz}
                  onChange={e => setValueKz(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 18240000 (para Kz 18.240.000,00)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>

              {/* Main Draft Idea Body */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 font-medium flex items-center gap-1">
                    <FileText className="w-4 h-4 text-cyan-400" /> Ideia Principal / Rascunho da Mensagem
                  </label>
                  <span className="text-[10px] text-cyan-400 font-mono">A IA expandirá o protocolo automaticamente</span>
                </div>
                <textarea
                  value={draftIdea}
                  onChange={e => setDraftIdea(e.target.value)}
                  placeholder="Coloque apenas a sua ideia aqui em texto simples. Por exemplo: 'Queremos solicitar uma reunião no dia 15 para apresentar o novo sistema de telemetria preditiva com IA e pedir autorização de teste no Porto de Luanda.'"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-cyan-400 focus:outline-none h-28 text-xs leading-relaxed"
                />
              </div>

              {/* Signatory Info Banner */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-slate-400 text-[11px]">Signatária Executiva Padrão:</span>{' '}
                    <strong className="text-white">Isabel Truman</strong> (Administradora Geral da Vitronis)
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">Assinatura Digital Ativa</span>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-cyan-500/20"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      A Elaborar Documento Formal...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Elaborar & Assinar Oficialmente
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Official Paper Modal (A4 Official Letterhead) */}
      {isPrintModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-start p-4 overflow-y-auto">
          {/* Top Control Bar (Non-printable) */}
          <div className="w-full max-w-4xl flex items-center justify-between bg-slate-900 border border-slate-700 p-4 rounded-2xl mb-4 shadow-2xl print:hidden">
            <div className="flex items-center gap-3">
              <Printer className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-white text-sm">Visualização de Impressão e Envio Oficial</h3>
                <p className="text-xs text-slate-400">Papel Timbrado da Vitronis com Assinatura Executiva de Isabel Truman e QR Code</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleExportPDF(selectedDoc)}
                disabled={isPdfGenerating}
                className="flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-rose-950/50 transition cursor-pointer disabled:opacity-50"
                title="Descarregar ficheiro PDF completo com formatação oficial e QR Code"
              >
                {isPdfGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <FileDown className="w-4 h-4" />
                )}
                {isPdfGenerating ? 'A Gerar PDF...' : 'Baixar PDF (.pdf)'}
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-emerald-950/50 transition cursor-pointer"
                title="Abrir diálogo de impressão do navegador ou salvar em PDF"
              >
                <Printer className="w-4 h-4" /> Imprimir
              </button>

              <button
                onClick={() => handleDownloadDoc(selectedDoc, 'doc')}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-semibold px-3 py-2 rounded-xl text-xs transition cursor-pointer"
                title="Descarregar documento em formato Word"
              >
                <Download className="w-4 h-4" /> Word (.doc)
              </button>

              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ml-1"
              >
                ✕ Fechar
              </button>
            </div>
          </div>

          {/* Printable A4 Paper Container */}
          <div
            ref={printableRef}
            className="bg-white text-slate-900 w-full max-w-4xl p-10 md:p-14 shadow-2xl rounded-xl border border-slate-200 print:shadow-none print:border-none print:p-0 my-2 font-serif"
          >
            {/* Letterhead Header */}
            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-black tracking-widest text-slate-900 uppercase font-sans">
                  VITRONIS
                </h1>
                <p className="text-xs font-bold font-sans text-cyan-800 uppercase tracking-wider mt-0.5">
                  Robótica e Controlo, Lda. • Soluções de Missão Crítica
                </p>
                <p className="text-[11px] font-sans text-slate-600 mt-1">
                  Sede: Luanda (Boa Vida) - República de Angola • NIF: AO509876543
                </p>
                <p className="text-[11px] font-sans text-slate-600">
                  Email: geral@vitronis.com | Tel: +244 923 000 111
                </p>
              </div>

              <div className="text-right font-sans text-xs">
                <div className="bg-slate-100 p-2 rounded border border-slate-300">
                  <div className="font-mono font-bold text-slate-900">N/Refª: {selectedDoc.refNumber || 'VIT/OF/2026/0204'}</div>
                  {selectedDoc.targetRefNumber && (
                    <div className="font-mono text-slate-600 text-[10px] mt-0.5">V/Refª: {selectedDoc.targetRefNumber}</div>
                  )}
                  <div className="text-slate-700 text-[11px] mt-1 font-semibold">{selectedDoc.createdAt || '03 de Agosto de 2026'}</div>
                </div>
              </div>
            </div>

            {/* Recipient Details Block with integrated Right-Side QR Code AAI */}
            {selectedDoc.recipientEntity && (
              <div className="mb-6 font-sans flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-slate-200 pb-5">
                <div className="space-y-0.5 text-sm max-w-xl">
                  <div className="font-bold text-slate-900 text-base leading-snug">
                    {selectedDoc.recipientTitle || 'Exmo. Director Nacional da TTI do SP/MININT-Angola'}
                  </div>
                  {selectedDoc.recipientSubTitle && (
                    <div className="font-semibold text-slate-800 text-sm text-cyan-900">
                      {selectedDoc.recipientSubTitle}
                    </div>
                  )}
                  <div className="font-semibold text-slate-800">{selectedDoc.recipientEntity}</div>
                  {selectedDoc.recipientDepartment && (
                    <div className="text-slate-700">{selectedDoc.recipientDepartment}</div>
                  )}
                  {selectedDoc.recipientContact && (
                    <div className="text-slate-600 text-xs mt-1.5 leading-relaxed">{selectedDoc.recipientContact}</div>
                  )}
                </div>

                {/* Integrated Right-Side QR Code for AAI (Ambiente de Avaliação Institucional) */}
                <div className="shrink-0 bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-center shadow-sm w-36 self-start">
                  <div className="text-[9px] font-bold text-slate-900 uppercase tracking-tight mb-1 font-mono">
                    QR CODE AAI
                  </div>
                  <div className="bg-white p-1 rounded inline-block border border-slate-200">
                    <svg className="w-16 h-16 text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                      <rect x="0" y="0" width="100" height="100" fill="white" />
                      <rect x="5" y="5" width="28" height="28" fill="black" />
                      <rect x="9" y="9" width="20" height="20" fill="white" />
                      <rect x="13" y="13" width="12" height="12" fill="black" />

                      <rect x="67" y="5" width="28" height="28" fill="black" />
                      <rect x="71" y="9" width="20" height="20" fill="white" />
                      <rect x="75" y="13" width="12" height="12" fill="black" />

                      <rect x="5" y="67" width="28" height="28" fill="black" />
                      <rect x="9" y="71" width="20" height="20" fill="white" />
                      <rect x="13" y="75" width="12" height="12" fill="black" />

                      <rect x="38" y="10" width="6" height="6" fill="black" />
                      <rect x="50" y="10" width="6" height="6" fill="black" />
                      <rect x="10" y="38" width="6" height="6" fill="black" />
                      <rect x="10" y="50" width="6" height="6" fill="black" />

                      <rect x="38" y="38" width="10" height="10" fill="black" />
                      <rect x="52" y="38" width="8" height="8" fill="black" />
                      <rect x="65" y="38" width="10" height="6" fill="black" />
                      <rect x="80" y="38" width="10" height="10" fill="black" />

                      <rect x="38" y="52" width="6" height="10" fill="black" />
                      <rect x="48" y="52" width="12" height="6" fill="black" />
                      <rect x="65" y="50" width="8" height="12" fill="black" />
                      <rect x="78" y="52" width="12" height="6" fill="black" />

                      <rect x="38" y="67" width="10" height="10" fill="black" />
                      <rect x="52" y="67" width="8" height="14" fill="black" />
                      <rect x="65" y="67" width="25" height="6" fill="black" />
                      <rect x="38" y="82" width="14" height="8" fill="black" />
                      <rect x="65" y="78" width="8" height="12" fill="black" />
                      <rect x="78" y="78" width="12" height="12" fill="black" />
                    </svg>
                  </div>
                  <div className="text-[9px] font-mono text-cyan-900 font-bold mt-1">
                    AAI-PNAP-AO-2026
                  </div>
                  <div className="text-[8px] text-slate-500 font-sans mt-0.5">
                    Avaliação Institucional
                  </div>
                </div>
              </div>
            )}

            {/* Subject */}
            {selectedDoc.subject && (
              <div className="mb-6 font-sans bg-slate-50 p-3 border-l-4 border-cyan-800 text-sm font-bold text-slate-900">
                ASSUNTO: {selectedDoc.subject.toUpperCase()}
              </div>
            )}

            {/* Main Content Body */}
            <div className="text-sm text-slate-900 leading-relaxed space-y-4 whitespace-pre-wrap mb-12 font-serif text-justify">
              {selectedDoc.content}
            </div>

            {/* Signatory Footer */}
            <div className="mt-12 pt-6 border-t border-slate-300 font-sans flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <div className="text-xs text-slate-500 uppercase font-semibold mb-6">Com elevada consideração e atenciosamente,</div>
                <div className="w-64 border-b border-slate-900 mb-2"></div>
                <div className="font-bold text-slate-900 text-sm">{selectedDoc.signatoryName || 'ISABEL TRUMAN'}</div>
                <div className="text-xs text-slate-700">{selectedDoc.signatoryRole || 'A Administradora-Geral'}</div>
                <div className="text-xs text-cyan-800 font-bold">VITRONIS – Robótica e Controlo, Lda.</div>
              </div>

              {/* QR Traceability Box */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-300 text-center font-mono text-[10px] text-slate-600 max-w-xs">
                <div className="font-bold text-slate-900 text-xs mb-1">✓ RASTREABILIDADE LEGAL DIGITAL</div>
                <div className="text-emerald-700 font-bold">Assinatura Certificada Vitronis</div>
                <div className="truncate text-[9px] mt-1 text-slate-500">Hash: {selectedDoc.hash}</div>
                <div className="mt-1 text-[9px] text-slate-400">República de Angola • Validade Institucional</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
