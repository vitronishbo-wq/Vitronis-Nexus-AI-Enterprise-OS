import React, { useState } from 'react';
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
  HelpCircle
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Auto-fill state institution presets
  const applyStatePreset = (entityName: string, dept: string, titleStr: string, contactStr: string) => {
    setRecipientEntity(entityName);
    setRecipientDepartment(dept);
    setRecipientTitle(titleStr);
    setRecipientContact(contactStr);
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
          <h2 className="text-xl font-bold text-white">Gestão Documental, Ofícios Estatais & Assinatura Executiva</h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Elaboração de cartas e ofícios para instituições estatais com cabeçalho oficial, Rastreabilidade Legal QR e Assinatura de <strong className="text-white">Isabel Truman (Administradora Geral da Vitronis)</strong>.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4" /> Redigir Novo Ofício / Carta
        </button>
      </div>

      {/* Main Content: Vault List + Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Vault List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Cofre de Documentos ({documents.length})
            </h3>
            <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              Assinatura: Isabel Truman
            </span>
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {documents.map(doc => {
              const isSelected = selectedDoc?.id === doc.id;

              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-xl border transition cursor-pointer relative ${
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
                    <span className="text-[10px] text-slate-500 font-mono">{doc.createdAt}</span>
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
                    <div className="text-[10px] text-cyan-400 bg-cyan-950/60 p-1.5 rounded border border-cyan-900/60 flex items-center gap-1 mt-1 font-mono">
                      <Link2 className="w-3 h-3 shrink-0" /> Resposta a: {doc.relatedDocTitle}
                    </div>
                  )}

                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Assinado por Isabel Truman
                    </span>
                    <span className="text-slate-500 font-mono">SHA-256 Validado</span>
                  </div>
                </div>
              );
            })}
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
                  </div>
                  <h3 className="text-lg font-bold text-white">{selectedDoc.title}</h3>
                  {selectedDoc.subject && (
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      <strong className="text-slate-300">Assunto:</strong> {selectedDoc.subject}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOrchestrateReply(selectedDoc)}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
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
                    className="flex items-center gap-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-lg shadow-cyan-950"
                  >
                    <QrCode className="w-4 h-4" /> Rastrear QR Code
                  </button>
                </div>
              </div>

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
    </div>
  );
};
