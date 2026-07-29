import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, X, CheckCircle2, ShieldCheck, Download, Award, FileText, UserCheck, ShieldAlert } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: string;
  hash?: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  title,
  data,
  hash
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    if (data) {
      QRCode.toDataURL(data, { width: 280, margin: 2, color: { dark: '#020617', light: '#ffffff' } })
        .then(url => setDataUrl(url))
        .catch(err => console.error('Error generating QR Code:', err));
    }
  }, [data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20 shadow-lg">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] font-mono uppercase font-bold tracking-wider">
              <Award className="w-3.5 h-3.5" /> Rastreabilidade Legal & Origem Criptográfica
            </div>
            <h3 className="font-bold text-base text-white">{title}</h3>
            <p className="text-xs text-slate-400">Validação Digital de Alta Tecnologia • República de Angola</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* QR Code Canvas */}
          <div className="flex flex-col items-center justify-center bg-white p-3.5 rounded-xl shadow-inner border border-slate-200">
            {dataUrl ? (
              <img src={dataUrl} alt="QR Code Assinatura" className="w-48 h-48 object-contain" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-slate-400">Gerando QR Code...</div>
            )}
            <span className="text-[10px] text-slate-600 font-mono font-bold mt-1 uppercase">Selo de Validação Ativo</span>
          </div>

          {/* Legal Traceability Metadata */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/90 text-xs space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> Signatária Executiva
              </div>
              <p className="text-white font-semibold text-xs">Isabel Truman</p>
              <p className="text-slate-400 text-[11px]">Administradora Geral da Vitronis</p>
            </div>

            <div>
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase mb-0.5">Emitente Legal</div>
              <p className="text-slate-200 text-[11px]">Vitronis Technologies Group S.A.</p>
              <p className="text-slate-400 text-[10px] font-mono">NIF: AO509876543 • Luanda, Angola</p>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                <CheckCircle2 className="w-3 h-3" /> Origem Auditada & Inviolável
              </span>
            </div>
          </div>
        </div>

        {/* SHA-256 Hash */}
        {hash && (
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/90 mb-4 text-xs font-mono break-all text-slate-300">
            <div className="flex items-center justify-between text-cyan-400 font-semibold mb-1">
              <span className="flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Assinatura Criptográfica SHA-256:
              </span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800 font-mono">
                Certificado Ativo
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">{hash}</p>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800 pt-3">
          <span className="flex items-center gap-1.5 text-slate-300 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> Registro Permanente no Vitronis Audit Vault
          </span>
          {dataUrl && (
            <a
              href={dataUrl}
              download="vitronis-qrcode-rastreavel.png"
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold hover:underline text-[11px]"
            >
              <Download className="w-3.5 h-3.5" /> Baixar QR
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
