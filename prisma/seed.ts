import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting seed...")

  // Create Mata Pelajaran
  const mataPelajaran = await prisma.mataPelajaran.createMany({
    data: [
      { nama: "Matematika", jenis: "UMUM" },
      { nama: "Bahasa Indonesia", jenis: "UMUM" },
      { nama: "Bahasa Inggris", jenis: "UMUM" },
      { nama: "IPA", jenis: "UMUM" },
      { nama: "IPS", jenis: "UMUM" },
      { nama: "Fiqih", jenis: "AGAMA" },
      { nama: "Aqidah Akhlak", jenis: "AGAMA" },
      { nama: "Sejarah Islam", jenis: "AGAMA" },
      { nama: "Bahasa Arab", jenis: "AGAMA" },
      { nama: "Al-Quran", jenis: "HAFALAN" },
      { nama: "Hadits", jenis: "HAFALAN" },
    ],
    skipDuplicates: true,
  })

  // Create Indikator Kehadiran
  const indikatorKehadiran = await prisma.indikatorKehadiran.createMany({
    data: [
      { nama: "Sholat Berjamaah" },
      { nama: "Kegiatan Belajar" },
      { nama: "Kegiatan Ekstrakurikuler" },
      { nama: "Kegiatan Asrama" },
    ],
    skipDuplicates: true,
  })

  // Create Indikator Sikap
  const indikatorSikap = await prisma.indikatorSikap.createMany({
    data: [
      { kategori: "SOSIAL", nama: "Kejujuran" },
      { kategori: "SOSIAL", nama: "Kedisiplinan" },
      { kategori: "SOSIAL", nama: "Tanggung Jawab" },
      { kategori: "SOSIAL", nama: "Toleransi" },
      { kategori: "SOSIAL", nama: "Gotong Royong" },
      { kategori: "SPIRITUAL", nama: "Ketaqwaan" },
      { kategori: "SPIRITUAL", nama: "Ibadah" },
      { kategori: "SPIRITUAL", nama: "Akhlak" },
    ],
    skipDuplicates: true,
  })

  // Create Guru
  const guru1 = await prisma.guru.create({
    data: {
      nip: "198501012010011001",
      nama: "Ustadz Ahmad Fauzi",
      jenisKelamin: "LAKI_LAKI",
      tempatLahir: "Jakarta",
      tanggalLahir: new Date("1985-01-01"),
      alamat: "Jl. Raya Pesantren No. 123",
      telepon: "081234567890",
      email: "ahmad.fauzi@pesantren.ac.id",
    },
  })

  const guru2 = await prisma.guru.create({
    data: {
      nip: "198702152011012002",
      nama: "Ustadzah Siti Aminah",
      jenisKelamin: "PEREMPUAN",
      tempatLahir: "Bandung",
      tanggalLahir: new Date("1987-02-15"),
      alamat: "Jl. Pesantren Putri No. 456",
      telepon: "081234567891",
      email: "siti.aminah@pesantren.ac.id",
    },
  })

  // Create Kelas
  const kelasPutra = await prisma.kelas.create({
    data: {
      nama: "1A Putra",
      tingkat: 1,
      jenis: "PUTRA",
      kapasitas: 30,
      tahunAjaran: "2024/2025",
    },
  })

  const kelasPutri = await prisma.kelas.create({
    data: {
      nama: "1A Putri",
      tingkat: 1,
      jenis: "PUTRI",
      kapasitas: 25,
      tahunAjaran: "2024/2025",
    },
  })

  // Create Wali Kelas
  await prisma.waliKelas.create({
    data: {
      guruId: guru1.id,
      kelasId: kelasPutra.id,
      tahunAjaran: "2024/2025",
    },
  })

  await prisma.waliKelas.create({
    data: {
      guruId: guru2.id,
      kelasId: kelasPutri.id,
      tahunAjaran: "2024/2025",
    },
  })

  // Create Kamar
  const kamarPutra = await prisma.kamar.create({
    data: {
      nama: "Kamar Putra 1A",
      jenis: "PUTRA",
      kapasitas: 8,
    },
  })

  const kamarPutri = await prisma.kamar.create({
    data: {
      nama: "Kamar Putri 1A",
      jenis: "PUTRI",
      kapasitas: 6,
    },
  })

  // Create Sample Students
  const siswa1 = await prisma.siswa.create({
    data: {
      nis: "2024001",
      nama: "Muhammad Rizki Pratama",
      jenisKelamin: "LAKI_LAKI",
      agama: "Islam",
      alamat: "Jl. Mawar No. 123, Jakarta",
      tempatLahir: "Jakarta",
      tanggalLahir: new Date("2010-05-15"),
      namaAyah: "Budi Pratama",
      pekerjaanAyah: "Pegawai Swasta",
      namaIbu: "Sari Dewi",
      pekerjaanIbu: "Ibu Rumah Tangga",
    },
  })

  const siswa2 = await prisma.siswa.create({
    data: {
      nis: "2024002",
      nama: "Fatimah Azzahra",
      jenisKelamin: "PEREMPUAN",
      agama: "Islam",
      alamat: "Jl. Melati No. 456, Bandung",
      tempatLahir: "Bandung",
      tanggalLahir: new Date("2010-08-20"),
      namaAyah: "Ahmad Hidayat",
      pekerjaanAyah: "Guru",
      namaIbu: "Khadijah",
      pekerjaanIbu: "Guru",
    },
  })

  // Create Riwayat Kelas
  await prisma.riwayatKelas.create({
    data: {
      siswaId: siswa1.id,
      kelasId: kelasPutra.id,
      tahunAjaran: "2024/2025",
      semester: "GANJIL",
    },
  })

  await prisma.riwayatKelas.create({
    data: {
      siswaId: siswa2.id,
      kelasId: kelasPutri.id,
      tahunAjaran: "2024/2025",
      semester: "GANJIL",
    },
  })

  // Create Penempatan Kamar
  await prisma.penempatanKamar.create({
    data: {
      siswaId: siswa1.id,
      kamarId: kamarPutra.id,
      tahunAjaran: "2024/2025",
    },
  })

  await prisma.penempatanKamar.create({
    data: {
      siswaId: siswa2.id,
      kamarId: kamarPutri.id,
      tahunAjaran: "2024/2025",
    },
  })

  // Create Promotion Policy
  await prisma.promotionPolicy.create({
    data: {
      tahunAjaran: "2024/2025",
      minRataRataNilai: 70.0,
      maxTotalAbsensi: 15,
      requiredHafalanStatus: "BAIK",
    },
  })

  console.log("✅ Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
