# 🦈 MatShark BJJ - PWA

Sistema completo de gerenciamento para academias de Brazilian Jiu-Jitsu com código de barras.

## ✨ Features

### 📱 PWA (Progressive Web App)
- ✅ Instala no celular/desktop (Add to Home Screen)
- ✅ Funciona offline
- ✅ Sincronização automática
- ✅ Notificações push

### 🎫 Sistema de Código de Barras
- ✅ Geração automática de códigos únicos
- ✅ Carteirinhas com código de barras
- ✅ Scanner via câmera do celular
- ✅ Check-in rápido

### 👥 Gestão de Alunos
- ✅ Cadastro completo (nome, email, telefone)
- ✅ Controle de faixas e stripes
- ✅ Histórico de presença
- ✅ Status ativo/inativo

### 📊 Dashboard
- ✅ Estatísticas em tempo real
- ✅ Controle de presença
- ✅ Progressão de alunos
- ✅ Relatórios

## 🚀 Como Usar

### 1. Instalar
```bash
npm install
```

### 2. Configurar API Gemini (opcional)
Crie um arquivo `.env.local`:
```
GEMINI_API_KEY=sua_chave_aqui
```

### 3. Rodar localmente
```bash
npm run dev
```

### 4. Build para produção
```bash
npm run build
```

## 📱 Instalar como App

### iOS (iPhone/iPad)
1. Abra o site no Safari
2. Toque no botão "Compartilhar" (quadrado com seta)
3. Selecione "Adicionar à Tela de Início"
4. Pronto! O app aparece na home screen

### Android
1. Abra o site no Chrome
2. Toque nos 3 pontos (menu)
3. Selecione "Adicionar à tela inicial"
4. Pronto!

### Desktop (Chrome/Edge)
1. Abra o site
2. Clique no ícone de instalação na barra de endereço
3. Ou vá em Menu > Instalar MatShark BJJ

## 🎫 Fluxo de Uso

### Cadastrar Novo Aluno
1. Acesse "Gerenciar Alunos"
2. Clique em "Novo"
3. Preencha os dados
4. O sistema gera código de barras automaticamente
5. Imprima a carteirinha

### Check-in de Aluno
1. Acesse "Gerenciar Alunos"
2. Clique em "Scan"
3. Aponte a câmera para o código de barras
4. Check-in confirmado!

### Ver Carteirinha
1. Encontre o aluno na lista
2. Clique no ícone de código de barras
3. Mostre para o aluno ou imprima

## 🛠️ Tecnologias

- **React 18** + TypeScript
- **Vite** (build tool)
- **PWA** (vite-plugin-pwa)
- **IndexedDB** (Dexie) - persistência offline
- **Código de Barras** (jsbarcode + html5-qrcode)
- **Animações** (Framer Motion)
- **Charts** (Recharts)
- **AI** (Google Gemini)

## 📂 Estrutura

```
SharkBJJ-PWA/
├── src/
│   ├── components/
│   │   ├── BarcodeGenerator.tsx    # Gera código de barras
│   │   ├── BarcodeScanner.tsx      # Scanner de câmera
│   │   ├── MemberManagement.tsx    # Gestão de alunos
│   │   └── BeltVisual.tsx          # Visual de faixas
│   ├── db/
│   │   └── database.ts             # IndexedDB com Dexie
│   ├── services/
│   │   └── geminiService.ts        # Integração AI
│   ├── types.ts                    # Tipagens TypeScript
│   └── App.tsx                     # App principal
├── public/
│   └── icons/                      # Ícones PWA
├── vite.config.ts                  # Config PWA
└── package.json
```

## 🎯 Roadmap

### Fase 1 ✅ (Pronto)
- [x] PWA configurado
- [x] Código de barras (gerar + scan)
- [x] Cadastro de alunos
- [x] Check-in via código
- [x] Persistência offline

### Fase 2 (Em breve)
- [ ] Firebase Auth (login)
- [ ] Firebase Firestore (sync)
- [ ] Múltiplos dispositivos
- [ ] Backup na nuvem

### Fase 3 (Futuro)
- [ ] Pagamentos integrados
- [ ] Notificações push
- [ ] Relatórios avançados
- [ ] App nativo (Capacitor)

## 🤝 Contribuir

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

MIT License - use à vontade!

---

**Criado com ❤️ para a comunidade BJJ**
