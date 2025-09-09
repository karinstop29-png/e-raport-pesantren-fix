-- Insert sample academic year
INSERT INTO public.academic_years (year, start_date, end_date, is_active) VALUES
('2024/2025', '2024-07-01', '2025-06-30', true);

-- Insert sample subjects
INSERT INTO public.subjects (code, name, description) VALUES
('QUR001', 'Al-Quran dan Hadits', 'Pembelajaran Al-Quran dan Hadits'),
('AQD001', 'Aqidah Akhlak', 'Pembelajaran Aqidah dan Akhlak'),
('FQH001', 'Fiqh', 'Pembelajaran Fiqh'),
('SKI001', 'Sejarah Kebudayaan Islam', 'Pembelajaran Sejarah Kebudayaan Islam'),
('ARB001', 'Bahasa Arab', 'Pembelajaran Bahasa Arab'),
('IND001', 'Bahasa Indonesia', 'Pembelajaran Bahasa Indonesia'),
('ENG001', 'Bahasa Inggris', 'Pembelajaran Bahasa Inggris'),
('MTK001', 'Matematika', 'Pembelajaran Matematika'),
('IPA001', 'Ilmu Pengetahuan Alam', 'Pembelajaran IPA'),
('IPS001', 'Ilmu Pengetahuan Sosial', 'Pembelajaran IPS');

-- Insert sample classes
INSERT INTO public.classes (name, level, academic_year, max_students) VALUES
('VII A', 'TSANAWIYAH', '2024/2025', 30),
('VII B', 'TSANAWIYAH', '2024/2025', 30),
('VIII A', 'TSANAWIYAH', '2024/2025', 30),
('VIII B', 'TSANAWIYAH', '2024/2025', 30),
('IX A', 'TSANAWIYAH', '2024/2025', 30),
('IX B', 'TSANAWIYAH', '2024/2025', 30),
('X IPA', 'ALIYAH', '2024/2025', 25),
('X IPS', 'ALIYAH', '2024/2025', 25),
('XI IPA', 'ALIYAH', '2024/2025', 25),
('XI IPS', 'ALIYAH', '2024/2025', 25);

-- Insert sample dormitories
INSERT INTO public.dormitories (name, gender, capacity) VALUES
('Asrama Putra A', 'MALE', 50),
('Asrama Putra B', 'MALE', 50),
('Asrama Putri A', 'FEMALE', 50),
('Asrama Putri B', 'FEMALE', 50);
