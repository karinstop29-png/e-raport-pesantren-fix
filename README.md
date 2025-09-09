# Pesantren Management System

A comprehensive academic management system for Islamic boarding schools (pesantren) built with Next.js, TypeScript, Prisma, and Supabase.

## Features

- **Student Management**: Complete student profiles with academic and personal information
- **Teacher & Class Management**: Teacher assignments and class management with capacity validation
- **Dormitory Management**: Room assignments with gender-based validation
- **Academic Records**: Grades, memorization (hafalan), attendance, and behavior tracking
- **Report Generation**: Automated report card generation in DOCX format
- **Excel Import/Export**: Bulk data import/export with validation
- **Class Promotion**: Automated class promotion based on configurable policies

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Document Generation**: docxtemplater, exceljs
- **Testing**: Jest, Supertest

## Database Schema

The system includes comprehensive models for:
- Students (Siswa) with personal and academic information
- Teachers (Guru) with assignments and roles
- Classes (Kelas) with capacity and type management
- Dormitories (Kamar) with gender-based assignments
- Academic records (Nilai, Hafalan, Kehadiran, Sikap)
- Report cards (Raport) and class promotion (KenaikanKelas)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or Supabase)
- Supabase account (for production)

### Local Development Setup

1. **Clone and install dependencies**:
\`\`\`bash
git clone <repository-url>
cd pesantren-management
npm install
\`\`\`

2. **Environment Setup**:
\`\`\`bash
cp .env.example .env
# Edit .env with your database and Supabase credentials
\`\`\`

3. **Database Setup**:
\`\`\`bash
# Generate Prisma client
npm run db:generate

# Run migrations (for local PostgreSQL)
npm run db:migrate

# Or push schema to Supabase
npm run db:push

# Seed sample data
npm run db:seed
\`\`\`

4. **Start development server**:
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application.

### Supabase Setup

1. Create a new Supabase project
2. Copy your project URL and anon key to `.env`
3. Run `npm run db:push` to sync schema
4. Enable Row Level Security (RLS) policies as needed
5. Set up storage buckets for file uploads

### Production Deployment

#### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Database Migration

For production database setup:
\`\`\`bash
# Generate migration files
npx prisma migrate dev --name init

# Apply migrations to production
npx prisma migrate deploy
\`\`\`

## API Endpoints

### Core CRUD Operations
- `GET/POST /api/students` - Student management
- `GET/POST /api/teachers` - Teacher management  
- `GET/POST /api/classes` - Class management
- `GET/POST /api/dormitories` - Dormitory management

### Academic Records
- `GET/POST /api/grades` - Grade management
- `GET/POST /api/attendance` - Attendance tracking
- `GET/POST /api/behavior` - Behavior assessment

### Import/Export
- `GET /api/export/class/[classId]/template` - Excel template generation
- `POST /api/import/class/[classId]/upload` - Excel data import with validation

### Report Generation
- `POST /api/reports/generate` - DOCX report generation
- `GET /api/reports/[reportId]` - Download generated reports

## Business Rules

### Validation Rules
- **Class Capacity**: Students cannot exceed class capacity limits
- **Dormitory Assignment**: Students must be assigned to gender-appropriate dormitories
- **Teacher Assignment**: One teacher can only be homeroom teacher for one class per academic year
- **Gender Matching**: Homeroom teacher gender must match class type (Putra/Putri)

### Class Promotion Logic
1. Admin creates new academic year
2. System calculates average grades, attendance, and memorization status
3. Compares against PromotionPolicy criteria
4. Generates promotion recommendations
5. Admin approves/modifies recommendations
6. System updates class assignments and creates history records

## File Structure

\`\`\`
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (dashboard)/       # Dashboard pages
│   └── globals.css        # Global styles
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Seed data
├── src/
│   ├── lib/              # Shared utilities
│   ├── server/           # Server-side utilities
│   └── components/       # React components
├── templates/            # DOCX templates
└── tests/               # Test files
\`\`\`

## Testing

Run tests with:
\`\`\`bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Integration tests
npm run test:integration
\`\`\`

## Document Conversion

For DOCX to PDF conversion, two options are provided:

### Option A: Docker Worker (Recommended)
Use the provided Docker worker with LibreOffice for server-side PDF conversion.

### Option B: Third-party API
Integrate with services like CloudConvert or similar for PDF conversion.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Assumptions

- Academic year format: "YYYY/YYYY" (e.g., "2024/2025")
- Semester system: Ganjil (Odd) and Genap (Even)
- Grade scale: 0-100 (Float values)
- Attendance tracking by activity type (Prayer, Study, Extracurricular, Dormitory)
- Behavior assessment using predicate system (Sangat Baik, Baik, Cukup, Kurang)
- Memorization tracking with book/chapter boundaries and predicate assessment
