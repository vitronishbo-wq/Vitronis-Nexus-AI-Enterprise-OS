import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = 3000;

// Lazy initialized Gemini client
function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// API Health
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    system: 'VITRONIS NEXUS AI ENTERPRISE OS',
    version: '4.0.0-PROD',
    timestamp: new Date().toISOString()
  });
});

// Autopilot Core AI Route
app.post('/api/ai/autopilot', async (req, res) => {
  try {
    const { enterpriseState, manualPrompt } = req.body;
    const ai = getGenAIClient();

    const systemPrompt = `Você é o Núcleo Autônomo Autopilot do VITRONIS NEXUS AI ENTERPRISE OS.
Você supervisiona uma corporação inteira com módulos de ERP Financeiro, CRM, Gestão Documental, RH, Inventário, Engenharia Robótica/IoT e BI.

Analise o estado atual da empresa e determine ações executivas autônomas.
Responda ESTRITAMENTE em formato JSON com a seguinte estrutura:
{
  "summary": "Resumo executivo do estado da empresa (2-3 frases)",
  "healthScore": 95,
  "topRisks": ["Risco 1", "Risco 2"],
  "topOpportunities": ["Oportunidade 1", "Oportunidade 2"],
  "autopilotActions": [
    {
      "agentName": "Agente Financeiro ERP",
      "category": "Finance",
      "message": "Descrição detalhada da ação",
      "severity": "info" | "success" | "warning" | "action_required",
      "automatedActionTaken": "Ação executada no sistema"
    }
  ],
  "strategicAdvice": "Recomendação estratégica de longo prazo"
}`;

    const promptText = manualPrompt
      ? `Solicitação manual do usuário: ${manualPrompt}\nEstado atual da empresa: ${JSON.stringify(enterpriseState || {})}`
      : `Realize a varredura autônoma periódica do estado da empresa: ${JSON.stringify(enterpriseState || {})}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json'
      }
    });

    const outputText = response.text || '{}';
    const parsed = JSON.parse(outputText);
    res.json({ success: true, result: parsed });
  } catch (error: any) {
    console.error('Error in autopilot AI:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao executar o piloto automático da IA'
    });
  }
});

// Specialized Agent Task Route
app.post('/api/ai/agent-task', async (req, res) => {
  try {
    const { agentId, agentRole, taskType, inputData } = req.body;
    const ai = getGenAIClient();

    const systemPrompt = `Você é o ${agentRole || 'Agente Especializado'} do VITRONIS NEXUS AI ENTERPRISE OS.
Você possui autoridade técnica e executiva para tomar decisões, elaborar relatórios, analisar documentos, simular cenários e recomendar ações.
Mantenha um tom profissional, rigoroso, corporativo e focado em alta eficiência e conformidade.`;

    const prompt = `Executar tarefa da categoria "${taskType || 'Análise Gerais'}":
Dados de Entrada:
${typeof inputData === 'object' ? JSON.stringify(inputData, null, 2) : inputData}

Forneça um diagnóstico estruturado, plano de ação e recomendação executiva clara.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt
      }
    });

    res.json({
      success: true,
      agentId,
      agentRole,
      analysis: response.text,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in agent task:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao processar tarefa do agente'
    });
  }
});

// Document Generation & Digital Signature Route
app.post('/api/ai/generate-document', async (req, res) => {
  try {
    const {
      title,
      docType,
      subject,
      refNumber,
      targetRefNumber,
      recipientEntity,
      recipientDepartment,
      recipientTitle,
      recipientContact,
      draftIdea,
      value,
      guidelines,
      relatedDocTitle,
      relatedDocRef
    } = req.body;

    const signatoryName = 'Isabel Truman';
    const signatoryRole = 'Administradora Geral da Vitronis';
    const defaultRef = refNumber || `VIT/OF/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleDateString('pt-AO', { year: 'numeric', month: 'long', day: 'numeric' });

    let content = '';

    // Check if Gemini AI key is available
    let aiClient: GoogleGenAI | null = null;
    try {
      aiClient = getGenAIClient();
    } catch {
      aiClient = null;
    }

    if (aiClient) {
      try {
        const systemPrompt = `Você é o Agente Jurídico e de Relações Institucionais do VITRONIS NEXUS AI ENTERPRISE OS em Angola.
Sua função é redigir documentos empresariais e comunicações oficiais formais com o Estado (Ofícios, Cartas Formais, Contratos, Pareceres, Propostas e Memorandos).
A signatária do documento é SEMPRE "Isabel Truman, Administradora Geral da Vitronis".
A moeda corporativa é SEMPRE o Kwanza (AOA / Kz).
Quando o utilizador fornece apenas uma ideia ou rascunho no corpo da mensagem, expanda essa ideia transformando-a num texto formal, extremamente profissional, respeitando todos os protocolos administrativos e honoríficos da administração pública e do meio empresarial angolano.`;

        const prompt = `Gere o texto completo para o documento do tipo "${docType || 'oficio_estatal'}".
Título/Resumo: ${title}
Assunto: ${subject || title}
N/Refª (Vitronis): ${defaultRef}
V/Refª (Sua Refª): ${targetRefNumber || 'N/A'}
Instituição/Empresa Destinatária: ${recipientEntity || 'Ministério / Entidade Destinatária'}
Direcção/Departamento: ${recipientDepartment || 'Direcção Geral'}
Tratamento/Cargo Destinatário: ${recipientTitle || 'Exmo.(a) Senhor(a) Director(a)'}
Contactos do Destinatário: ${recipientContact || 'Luanda - República de Angola'}
${relatedDocTitle ? `Documento/Ofício Relacionado em Resposta: ${relatedDocTitle} (Ref: ${relatedDocRef || 'N/A'})` : ''}
Ideia / Rascunho da Mensagem do Utilizador: ${draftIdea || guidelines || 'Apresentação formal e solicitação de colaboração institucional'}
Valor do Contrato/Proposta (se aplicável): ${value ? `Kz ${Number(value).toLocaleString('pt-AO')}` : 'N/A'}

Formate o texto com:
- Cabeçalho formal com dados da VITRONIS TECHNOLOGIES GROUP S.A. (NIF AO509876543, Luanda, Angola)
- N/Refª, V/Refª e Data
- Endereçamento formal com o cargo e instituição
- Assunto em destaque
- Corpo da mensagem numerado em parágrafos claros e elegantes
- Fecho cerimonioso ("Apresentamos os nossos mais elevados protestos de auto estima e consideração")
- Bloco de Assinatura com "Isabel Truman - Administradora Geral da Vitronis"
- Selo e Código de Rastreabilidade Legal de Última Geração`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            systemInstruction: systemPrompt
          }
        });

        content = response.text || '';
      } catch (geminiError) {
        console.warn('Gemini API call failed, utilizing high-precision offline document engine:', geminiError);
        content = ''; // Trigger fallback below
      }
    }

    // High-precision Fallback Document Engine (Offline / No API Key)
    if (!content) {
      const formattedIdea = draftIdea || guidelines || 'Apresentação de proposta técnica de automação com inteligência artificial e solicitação de audiência institucional.';
      const formattedValue = value ? `Kz ${Number(value).toLocaleString('pt-AO')}` : null;

      if (docType === 'oficio_estatal' || docType === 'carta_formal') {
        content = `VITRONIS TECHNOLOGIES GROUP S.A.
Edifício Vitronis Tower, Av. 4 de Fevereiro nº 180, Luanda - Angola
NIF: AO509876543 | Tel: +244 923 000 111 | Email: geral@vitronis.com

N/Refª: ${defaultRef}
${targetRefNumber ? `V/Refª: ${targetRefNumber}\n` : ''}Data: ${nowStr}

À
${recipientDepartment ? `${recipientDepartment}\n` : ''}${recipientEntity || 'INSTITUIÇÃO ESTATAL DESTINATÁRIA'}
${recipientContact || 'Luanda - República de Angola'}

ASSUNTO: ${subject || title}
${relatedDocTitle ? `[EM RESPOSTA AO DOCUMENTO: ${relatedDocTitle} - REF: ${relatedDocRef || 'N/A'}]` : ''}

${recipientTitle || 'Exmo.(a) Senhor(a) Director(a)'},

1. Cumprimentando cordialmente V. Exa., serve o presente documento para expor e formalizar a seguinte comunicação:

2. ${formattedIdea}

3. Reafirmamos o compromisso da Vitronis Technologies Group S.A. no desenvolvimento do ecossistema tecnológico e industrial nacional, colocando à disposição os nossos recursos de engenharia, inteligência artificial e automação rastreável.

${formattedValue ? `4. O valor estimado envolvido na presente proposta é de ${formattedValue}, devidamente discriminado nas especificações técnicas em anexo.\n` : ''}
5. Ficamos ao dispor para prestar quaisquer esclarecimentos adicionais que V. Exa. julgar convenientes.

Apresentamos a V. Exa. os nossos mais elevados protestos de auto estima e consideração.

Atenciosamente,

_____________________________________________________
ISABEL TRUMAN
Administradora Geral da Vitronis
Vitronis Technologies Group S.A.

[SELO DE RASTREABILIDADE LEGAL DIGITAL QR CODE]
Hash SHA-256: sha256_${crypto.createHash('sha256').update(defaultRef + Date.now().toString()).digest('hex')}
Certificado Digital de Origem: AO-CERT-LEGAL-VIT-${new Date().getFullYear()}-OFFLINE`;
      } else {
        content = `VITRONIS TECHNOLOGIES GROUP S.A.
Sistemas Autónomos & Inteligência Artificial Empresarial
Luanda - República de Angola

DOCUMENTO: ${title.toUpperCase()}
N/Refª: ${defaultRef} | Data: ${nowStr}
Assunto: ${subject || title}

1. OBJETO E CONTEXTO
${formattedIdea}

${formattedValue ? `2. VALOR E CONDIÇÕES FINANCEIRAS\nO montante global associado ao presente documento fixa-se em ${formattedValue}.\n` : ''}
3. VALIDADE E ASSINATURA DIGITAL
O presente documento entra em vigor imediatamente após a aposição da assinatura digital da gerência executiva.

Luanda, ${nowStr}.

_____________________________________________________
ISABEL TRUMAN
Administradora Geral da Vitronis
Vitronis Technologies Group S.A.`;
      }
    }

    // Generate digital hash SHA-256 for document integrity
    const docHash = 'sha256_' + crypto.createHash('sha256').update(content + Date.now().toString()).digest('hex');

    res.json({
      success: true,
      content,
      hash: docHash,
      createdAt: new Date().toISOString().split('T')[0],
      signers: [
        {
          name: signatoryName,
          role: signatoryRole,
          email: 'isabel.truman@vitronis.com',
          status: 'signed',
          signedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
      ]
    });
  } catch (error: any) {
    console.error('Error generating document:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao gerar documento contratual'
    });
  }
});

// BI Predictive Forecasting Route
app.post('/api/ai/predictive-bi', async (req, res) => {
  try {
    const { metrics, historicalData, horizonDays } = req.body;
    const ai = getGenAIClient();

    const systemPrompt = `Você é o Agente de Business Intelligence & Analytics Preditivo do VITRONIS NEXUS AI ENTERPRISE OS.
Analise os KPIs financeiros e métricas operacionais para projetar receitas, riscos e otimização de fluxo de caixa para os próximos ${horizonDays || 30} dias.
Retorne um JSON estruturado:
{
  "projectedRevenue": 58000,
  "projectedExpenses": 24000,
  "estimatedNetProfit": 34000,
  "cashFlowStatus": "positivo_estavel",
  "recommendedActions": [
    "Recomendação 1",
    "Recomendação 2"
  ],
  "riskAssessment": "Avaliação de risco detalhada em 2 frases."
}`;

    const prompt = `Métricas atuais: ${JSON.stringify(metrics || {})}
Histórico recente: ${JSON.stringify(historicalData || {})}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json'
      }
    });

    res.json({ success: true, prediction: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    console.error('Error in predictive BI:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro na análise preditiva BI'
    });
  }
});

// Vite Middleware for Dev / Static serving for Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[VITRONIS NEXUS AI OS] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
