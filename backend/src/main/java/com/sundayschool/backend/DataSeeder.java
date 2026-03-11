package com.sundayschool.backend;

import com.sundayschool.backend.model.Teacher;
import com.sundayschool.backend.repository.TeacherRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final TeacherRepository repo;
    private final PasswordEncoder encoder;

    public DataSeeder(TeacherRepository repo, PasswordEncoder encoder) {
        this.repo    = repo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (repo.count() == 0) {
            String[][] teachers = {
                {"Teacher Terinique", "Terinique", "Tb#9kL2m", "Bumblebees 🐝"},
                {"Teacher Jame",      "Jame",      "Jx#4nP7q", "Little Lambs 🐑"},
                {"Teacher Mimi",      "Mimi",      "Mm#6wR3v", "Mountain Movers ⛰️"},
                {"Teacher Althea",    "Althea",    "At#8hQ5j", "Lions of Judah 🦁"},
                {"Admin",             "admin",     "Admin#123", "ADMIN"},
            };
            for (String[] t : teachers) {
                Teacher teacher = new Teacher();
                teacher.setName(t[0]);
                teacher.setUsername(t[1]);
                teacher.setPassword(encoder.encode(t[2]));
                teacher.setClassName(t[3]);
                teacher.setRole(t[0].equals("Admin") ? "ADMIN" : "TEACHER");
                repo.save(teacher);
            }
        }
    }
}