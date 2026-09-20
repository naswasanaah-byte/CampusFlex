-- CampusFlex Sample Data Seeding

-- 1. Insert Skills
INSERT INTO skills (id, skill_name, category) VALUES
(1, 'Java', 'IT'),
(2, 'Python', 'IT'),
(3, 'Communication', 'Soft Skills'),
(4, 'MS Office', 'Admin'),
(5, 'Graphic Design', 'Design'),
(6, 'Mathematics', 'Education'),
(7, 'Content Writing', 'Media'),
(8, 'Social Media', 'Marketing'),
(9, 'Customer Service', 'Support'),
(10, 'Data Entry', 'Admin'),
(11, 'Video Editing', 'Design'),
(12, 'Web Development', 'IT');

-- 2. Insert Job Categories
INSERT INTO job_categories (id, name, description) VALUES
(1, 'Tutoring & Education', 'Academic tutoring, lab instruction, and teaching assistant roles'),
(2, 'Software & IT', 'Software development, web design, and tech support'),
(3, 'Media & Design', 'Graphic design, content creation, and video editing'),
(4, 'Office & Administration', 'Data entry, documentation, and office assistance'),
(5, 'Marketing & Sales', 'Social media management, campus ambassadorship, and outreach'),
(6, 'Customer Support', 'Voice and chat customer service support');

-- 3. Insert Users (Password hash for demo passwords: 'Student123!', 'Employer123!', 'Admin123!')
-- Note: Password salt/hash algorithm in PasswordUtils supports matching plain/SHA-256
INSERT INTO users (id, email, phone, password_hash, role) VALUES
(1, 'student@campusflex.com', '+91 9876543210', 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f', 'STUDENT'),
(2, 'employer@campusflex.com', '+91 9876543211', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'EMPLOYER'),
(3, 'admin@campusflex.com', '+91 9876543212', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'ADMIN'),
(4, 'rahul@campusflex.com', '+91 9876543213', 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f', 'STUDENT'),
(5, 'brightacademy@campusflex.com', '+91 9876543214', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'EMPLOYER');

-- 4. Insert Student Profiles
INSERT INTO student_profiles (id, user_id, full_name, college, department, semester, bio, profile_photo, preferred_work_type, preferred_location, target_hourly_rate) VALUES
(1, 1, 'Ananya Verma', 'NIT Calicut', 'Computer Science & Engineering', 5, 'Passionate 5th sem CS student with strong Java, web dev & communication skills. Looking for flexible evening part-time roles.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'HYBRID', 'Calicut', 150.00),
(2, 4, 'Rahul Nair', 'Farook College Calicut', 'Commerce & Finance', 3, 'Detailed-oriented commerce student experienced in MS Excel, data entry, and accounting principles.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'REMOTE', 'Calicut', 100.00);

-- 5. Insert Employer Profiles
INSERT INTO employer_profiles (id, user_id, company_name, company_description, industry, company_size, website, logo_url, location, verification_status) VALUES
(1, 2, 'TechWorks Kerala', 'Premier technology solutions provider offering software development and training programs across Kerala.', 'Information Technology', '50-100', 'https://techworkskerala.com', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150', 'Calicut', 'VERIFIED'),
(2, 5, 'Bright Academy', 'Leading educational coaching institute in Kozhikode specializing in High School & Higher Secondary tutoring.', 'Education', '10-20', 'https://brightacademy.in', 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150', 'Calicut', 'VERIFIED');

-- 6. Insert Admin
INSERT INTO admins (id, user_id, full_name, department) VALUES
(1, 3, 'CampusFlex Admin', 'Platform Operations');

-- 7. Insert Student Skills
INSERT INTO student_skills (student_id, skill_id, proficiency_level) VALUES
(1, 1, 'ADVANCED'),     -- Java
(1, 3, 'ADVANCED'),     -- Communication
(1, 5, 'INTERMEDIATE'), -- Graphic Design
(1, 6, 'EXPERT'),       -- Mathematics
(1, 12, 'INTERMEDIATE'),-- Web Development
(2, 4, 'EXPERT'),       -- MS Office
(2, 10, 'ADVANCED');    -- Data Entry

-- 8. Insert Jobs
INSERT INTO jobs (id, employer_id, category_id, title, description, requirements, salary_amount, salary_type, location, work_type, start_time, end_time, working_days, vacancies, status, is_verified, deadline) VALUES
(1, 2, 1, 'Online Math Tutor', 'Teach 10th standard Mathematics to small student batches. Flexible online sessions.', 'Strong math background, good communication skills in English/Malayalam.', 600.00, 'DAILY', 'Calicut', 'REMOTE', '17:00:00', '19:00:00', 'MONDAY,WEDNESDAY,FRIDAY', 3, 'ACTIVE', TRUE, '2026-10-15'),
(2, 1, 2, 'Java Lab Assistant', 'Assist junior students during practical Java coding exercises in our Calicut center.', 'Strong Java OOP basics, data structures knowledge.', 750.00, 'DAILY', 'Calicut', 'ON_SITE', '14:00:00', '17:00:00', 'TUESDAY,THURSDAY', 2, 'ACTIVE', TRUE, '2026-10-20'),
(3, 1, 3, 'Graphic Design Assistant', 'Create social media posters, promotional flyers, and banner graphics.', 'Proficiency in Photoshop/Canva/Figma, creative mindset.', 500.00, 'DAILY', 'Kochi', 'REMOTE', '18:00:00', '20:00:00', 'MONDAY,TUESDAY,WEDNESDAY', 2, 'ACTIVE', TRUE, '2026-10-10'),
(4, 2, 4, 'Data Entry Specialist', 'Digitize and categorize student attendance and exam records.', 'Fast typing speed, basic MS Excel knowledge.', 400.00, 'DAILY', 'Kannur', 'HYBRID', '09:00:00', '13:00:00', 'SATURDAY', 4, 'ACTIVE', FALSE, '2026-10-30'),
(5, 1, 5, 'Campus Brand Ambassador', 'Promote TechWorks workshops and tech contests inside college campuses.', 'Outgoing personality, active on social media.', 450.00, 'DAILY', 'Calicut', 'HYBRID', '16:00:00', '18:00:00', 'FRIDAY', 5, 'ACTIVE', TRUE, '2026-11-01');

-- 9. Insert Job Skills Required
INSERT INTO job_skills (job_id, skill_id) VALUES
(1, 6), (1, 3), -- Math, Communication
(2, 1), (2, 3), -- Java, Communication
(3, 5), (3, 7), -- Graphic Design, Content Writing
(4, 10), (4, 4),-- Data Entry, MS Office
(5, 8), (5, 3); -- Social Media, Communication

-- 10. Insert Ananya's College Timetable
INSERT INTO timetables (id, student_id, day_of_week, start_time, end_time, subject_name, type) VALUES
(1, 1, 'MONDAY', '09:00:00', '12:00:00', 'Data Structures Lecture', 'Lecture'),
(2, 1, 'MONDAY', '13:00:00', '16:00:00', 'Java Programming Lab', 'Lab'),
(3, 1, 'TUESDAY', '09:00:00', '12:00:00', 'DBMS Lecture', 'Lecture'),
(4, 1, 'WEDNESDAY', '09:00:00', '12:00:00', 'Operating Systems', 'Lecture'),
(5, 1, 'WEDNESDAY', '13:00:00', '15:00:00', 'Algorithms Analysis', 'Lecture'),
(6, 1, 'THURSDAY', '10:00:00', '13:00:00', 'Web Tech Lab', 'Lab'),
(7, 1, 'FRIDAY', '09:00:00', '12:00:00', 'Software Engineering', 'Lecture');

-- 11. Insert Sample Applications
INSERT INTO applications (id, student_id, job_id, status, cover_note, applied_at) VALUES
(1, 1, 1, 'ACCEPTED', 'I have a strong math background from NIT Calicut and experience tutoring high school students.', NOW()),
(2, 1, 2, 'PENDING', '5th semester CS student with deep Java OOP foundation.', NOW()),
(3, 2, 4, 'PENDING', 'Experienced in MS Excel data entry with 50 WPM typing speed.', NOW());

-- 12. Insert Saved Jobs
INSERT INTO saved_jobs (id, student_id, job_id) VALUES
(1, 1, 3);

-- 13. Insert Notifications
INSERT INTO notifications (id, user_id, title, message, is_read, type) VALUES
(1, 1, 'Application Accepted! 🎉', 'Bright Academy accepted your application for Online Math Tutor.', FALSE, 'APPLICATION'),
(2, 1, 'New Job Match Available', 'A new Java Lab Assistant position matching your skills was posted by TechWorks Kerala.', TRUE, 'JOB_MATCH'),
(3, 2, 'Welcome to CampusFlex!', 'Complete your employer profile to post jobs and find student talent.', TRUE, 'SYSTEM');

-- 14. Insert Messages
INSERT INTO messages (id, sender_id, receiver_id, job_id, content, is_read, sent_at) VALUES
(1, 5, 1, 1, 'Hello Ananya! We reviewed your profile and math skills. Are you available starting next Monday at 5 PM?', TRUE, NOW()),
(2, 1, 5, 1, 'Thank you! Yes, Mon/Wed/Fri 5 PM to 7 PM works perfectly with my NIT lecture schedule.', TRUE, NOW());

-- 15. Insert Employer Verifications
INSERT INTO employer_verifications (id, employer_id, document_type, document_url, status, review_notes) VALUES
(1, 1, 'GST Certificate', 'https://campusflex.com/docs/gst_techworks.pdf', 'APPROVED', 'Verified business entity in Calicut.'),
(2, 2, 'Coaching License', 'https://campusflex.com/docs/license_bright.pdf', 'APPROVED', 'Educational institution registration verified.');

-- 16. Insert Sample Ratings
INSERT INTO ratings (id, evaluator_id, evaluatee_id, job_id, rating, review_text) VALUES
(1, 5, 1, 1, 5, 'Ananya is punctual, highly knowledgeable in mathematics, and very engaging with the students!');
