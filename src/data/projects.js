export const projects = [
  {
    id: 1,
    title: 'KirimDOKU – Fund Transfer Platform',
    description:
      'REST API platform powering domestic disbursement, incoming/outgoing remittances, bank account validation, and bill payments for 150+ merchants. Integrated 9+ Indonesian banks (BCA, BNI, BRI, Mandiri, OVO, and others) via SNAP-compliant and custom connectors, alongside internal admin and merchant-facing web portals.',
    tech: ['Java', 'Spring Boot', 'Spring Webflux', 'R2DBC', 'PostgreSQL', 'Redis', 'Kafka', 'Alicloud OSS'],
    githubUrl: null,
    liveUrl: null,
  },
  {
    id: 2,
    title: 'Refund Service',
    description:
      'Automated cross-bank refund system for DOKU\'s payment aggregator, enabling merchants to process customer refunds across multiple banks without managing separate bank accounts. Handles refund routing, status tracking, and reconciliation end-to-end.',
    tech: ['Java', 'Spring Boot', 'Angular', 'Thymeleaf', 'Javascript', 'Hibernate', 'Spring JPA', 'PostgreSQL'],
    githubUrl: null,
    liveUrl: null,
  },
  {
    id: 3,
    title: 'QRIS Merchant Onboarding',
    description:
      'Merchant self-registration and back-office system for DOKU\'s QRIS (Indonesia\'s national QR payment standard). Covers a web app for merchant onboarding, a mobile feature for transaction history and settlement summaries, and a back-office with user management, registration approval, cashback engine, and scheduler configuration.',
    tech: ['Java', 'Spring Boot', 'Angular', 'Javascript', 'Spring JPA', 'PostgreSQL'],
    githubUrl: null,
    liveUrl: null,
  },
  {
    id: 4,
    title: 'Portfolio Website',
    description:
      'This portfolio site. A personal project to learn Vue.js frontend development after years of backend work. Vibe coded using Claude Code with Vue 3, Vite, and plain CSS.',
    tech: ['Vue 3', 'Vite', 'JavaScript', 'CSS', 'Claude Code'],
    githubUrl: 'https://github.com/alexanderang24/portfolio',
    liveUrl: 'https://alexanderang.vercel.app/',
  },
]
