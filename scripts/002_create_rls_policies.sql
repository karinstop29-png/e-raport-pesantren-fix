-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Students policies
CREATE POLICY "Students can view their own data" ON public.students
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('ADMIN', 'TEACHER')
    )
  );

CREATE POLICY "Admins can manage students" ON public.students
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Teachers policies
CREATE POLICY "Teachers can view their own data" ON public.teachers
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can manage teachers" ON public.teachers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Subjects policies
CREATE POLICY "All authenticated users can view subjects" ON public.subjects
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage subjects" ON public.subjects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Classes policies
CREATE POLICY "All authenticated users can view classes" ON public.classes
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage classes" ON public.classes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Class students policies
CREATE POLICY "Students can view their class assignments" ON public.class_students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.students s 
      WHERE s.id = student_id AND s.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('ADMIN', 'TEACHER')
    )
  );

CREATE POLICY "Admins can manage class assignments" ON public.class_students
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Dormitories policies
CREATE POLICY "All authenticated users can view dormitories" ON public.dormitories
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage dormitories" ON public.dormitories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Dormitory students policies
CREATE POLICY "Students can view their dormitory assignments" ON public.dormitory_students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.students s 
      WHERE s.id = student_id AND s.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('ADMIN', 'TEACHER')
    )
  );

CREATE POLICY "Admins can manage dormitory assignments" ON public.dormitory_students
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Schedules policies
CREATE POLICY "All authenticated users can view schedules" ON public.schedules
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and teachers can manage schedules" ON public.schedules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('ADMIN', 'TEACHER')
    )
  );

-- Grades policies
CREATE POLICY "Students can view their own grades" ON public.grades
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.students s 
      WHERE s.id = student_id AND s.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('ADMIN', 'TEACHER')
    )
  );

CREATE POLICY "Teachers can manage grades for their subjects" ON public.grades
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.teachers t 
      WHERE t.id = teacher_id AND t.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Attendance policies
CREATE POLICY "Students can view their own attendance" ON public.attendance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.students s 
      WHERE s.id = student_id AND s.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('ADMIN', 'TEACHER')
    )
  );

CREATE POLICY "Teachers can manage attendance for their subjects" ON public.attendance
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.teachers t 
      WHERE t.id = teacher_id AND t.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Academic years policies
CREATE POLICY "All authenticated users can view academic years" ON public.academic_years
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage academic years" ON public.academic_years
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Announcements policies
CREATE POLICY "All authenticated users can view published announcements" ON public.announcements
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND is_published = true
  );

CREATE POLICY "Admins can manage all announcements" ON public.announcements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- File uploads policies
CREATE POLICY "Users can view their own uploads" ON public.file_uploads
  FOR SELECT USING (
    uploaded_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Authenticated users can upload files" ON public.file_uploads
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own uploads" ON public.file_uploads
  FOR DELETE USING (
    uploaded_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
