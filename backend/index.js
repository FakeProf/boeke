import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory demo data (migrate to DB later)
const scenarios = [
  { 
    id: 'buchhaltung', 
    title: 'Buchhaltung - Digitale Belegverarbeitung', 
    industry: 'finance', 
    difficulty: 'beginner',
    description: 'Digitale Buchhaltungslösung mit GoBD-Konformität verkaufen',
    situation: 'Sie präsentieren eine Lösung zur digitalen Belegverarbeitung an ein mittelständisches Unternehmen',
    challenge: 'Die Buchhaltung zweifelt an GoBD-Konformität und Datenqualität',
    goal: 'Vertrag über 15.000€/Jahr für digitale Buchhaltungslösung abschließen',
    timeLimit: 12,
    stakeholders: ['Buchhalter', 'Geschäftsführer', 'Steuerberater'],
    objections: ['GoBD-Konformität unklar', 'Zu teuer für kleine Firma', 'Datenschutz-Bedenken', 'Zu komplex'],
    questions: [
      'Wie verwalten Sie aktuell Ihre Belege?',
      'Welche GoBD-Anforderungen sind Ihnen wichtig?',
      'Wie hoch ist Ihr manueller Aufwand?',
      'Wer prüft Ihre Buchhaltung?'
    ]
  },
  { 
    id: 'pflege', 
    title: 'Pflege - Dienstplan- und Dokumentationssystem', 
    industry: 'healthcare', 
    difficulty: 'intermediate',
    description: 'Pflegesystem in Einrichtung einführen',
    situation: 'Sie führen ein neues Dienstplan-/Dokumentationssystem in einer Pflegeeinrichtung ein',
    challenge: 'Pflegekräfte befürchten Mehraufwand und technische Komplexität',
    goal: 'System erfolgreich einführen und Akzeptanz schaffen',
    timeLimit: 18,
    stakeholders: ['Pflegedienstleitung', 'Pflegekräfte', 'Geschäftsführung'],
    objections: ['Zu kompliziert', 'Mehraufwand im Alltag', 'Technik-Probleme', 'Schulungsaufwand'],
    questions: [
      'Wie planen Sie aktuell Ihre Dienste?',
      'Welche Dokumentation ist wichtig?',
      'Wie digital sind Sie bereits?',
      'Wer entscheidet über neue Systeme?'
    ]
  },
  { 
    id: 'kita', 
    title: 'Kita - Elternkommunikations- und Abrechnungs-App', 
    industry: 'education', 
    difficulty: 'intermediate',
    description: 'Kita-App mit Datenschutz verkaufen',
    situation: 'Eine Kita prüft eine Elternkommunikations- und Abrechnungs-App',
    challenge: 'Leitung sorgt sich um Datenschutz und Bedienbarkeit',
    goal: 'App erfolgreich einführen und Eltern begeistern',
    timeLimit: 15,
    stakeholders: ['Kitaleitung', 'Erzieherinnen', 'Elternbeirat'],
    objections: ['Datenschutz-Bedenken', 'Zu teuer', 'Zu kompliziert', 'Eltern-Akzeptanz unklar'],
    questions: [
      'Wie kommunizieren Sie aktuell mit Eltern?',
      'Welche Datenschutz-Anforderungen haben Sie?',
      'Wie digital sind Ihre Eltern?',
      'Wer entscheidet über neue Tools?'
    ]
  },
  { 
    id: 'export', 
    title: 'Export - Ursprung, Präferenzen und Sanktionslisten', 
    industry: 'logistics', 
    difficulty: 'advanced',
    description: 'Export-Compliance-Lösung verkaufen',
    situation: 'Sie verkaufen eine Export-Compliance-Software an ein Handelsunternehmen',
    challenge: 'Komplexe Zoll- und Sanktionsregelungen verstehen und kommunizieren',
    goal: 'Software-Lizenz für 50.000€/Jahr verkaufen',
    timeLimit: 25,
    stakeholders: ['Export-Leiter', 'Compliance-Officer', 'Geschäftsführung'],
    objections: ['Zu komplex', 'Hohe Kosten', 'Unklarer ROI', 'Implementierungsaufwand'],
    questions: [
      'Welche Länder exportieren Sie?',
      'Wie handhaben Sie aktuell Compliance?',
      'Welche Sanktionslisten sind relevant?',
      'Wer ist für Export-Entscheidungen zuständig?'
    ]
  },
  { 
    id: 'sekretaerin', 
    title: 'Sekretärin - Gatekeeper überwinden', 
    industry: 'sales', 
    difficulty: 'beginner',
    description: 'Gatekeeper überwinden und Termin vereinbaren',
    situation: 'Sie versuchen einen Termin mit dem Geschäftsführer zu vereinbaren',
    challenge: 'Die Sekretärin blockiert alle Verkaufsgespräche',
    goal: 'Termin mit Entscheidungsträger vereinbaren',
    timeLimit: 8,
    stakeholders: ['Sekretärin', 'Geschäftsführer'],
    objections: ['Keine Zeit', 'Nicht interessiert', 'Bereits andere Anbieter', 'Zu teuer'],
    questions: [
      'Wie erreiche ich den Geschäftsführer?',
      'Was ist der beste Zeitpunkt?',
      'Wie überzeuge ich die Sekretärin?',
      'Welche Argumente helfen?'
    ]
  },
  { 
    id: 'datenschutz', 
    title: 'Datenschutz - DSB-Bewertung einer SaaS-Lösung', 
    industry: 'compliance', 
    difficulty: 'intermediate',
    description: 'DSGVO-konforme SaaS-Lösung verkaufen',
    situation: 'Sie verkaufen eine SaaS-Lösung an ein Unternehmen mit DSB',
    challenge: 'Datenschutzbeauftragter prüft DSGVO-Konformität',
    goal: 'Vertrag über 30.000€/Jahr abschließen',
    timeLimit: 20,
    stakeholders: ['DSB', 'Geschäftsführung', 'IT-Leiter', 'Rechtsabteilung'],
    objections: ['DSGVO-Risiko', 'Subprozessoren unklar', 'Löschkonzept unzureichend', 'AVV fehlt'],
    questions: [
      'Welche Daten verarbeiten Sie?',
      'Wie ist Ihr aktueller Datenschutz organisiert?',
      'Welche Subprozessoren nutzen Sie?',
      'Wie lange speichern Sie Daten?'
    ]
  }
];

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/scenarios', (_req, res) => {
  res.json({ scenarios });
});

app.get('/api/scenarios/:id', (req, res) => {
  const scenario = scenarios.find(s => s.id === req.params.id);
  if (scenario) {
    res.json(scenario);
  } else {
    res.status(404).json({ error: 'Szenario nicht gefunden' });
  }
});

app.get('/api/quiz', (_req, res) => {
  res.json({ items: [] });
});

app.get('/api/quiz/:topic', (req, res) => {
  // Placeholder for quiz data by topic
  res.json({ 
    topic: req.params.topic,
    questions: [],
    message: 'Quiz-System wird implementiert'
  });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});


