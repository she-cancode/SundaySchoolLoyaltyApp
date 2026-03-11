package com.sundayschool.backend.controller;

import com.sundayschool.backend.model.Teacher;
import com.sundayschool.backend.repository.StudentRepository;
import com.sundayschool.backend.repository.TeacherRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = "http://localhost:5173")
public class TeacherController {

    private final TeacherRepository repo;
    private final PasswordEncoder encoder;
    private final StudentRepository studentRepo;

    public TeacherController(TeacherRepository repo, PasswordEncoder encoder, StudentRepository studentRepo) {
        this.repo        = repo;
        this.encoder     = encoder;
        this.studentRepo = studentRepo;
    }

    @PostMapping("/login")
    public Object login(@RequestBody Map<String, String> body) {
        Optional<Teacher> teacher = repo.findByUsername(body.get("username"));
        if (teacher.isPresent() && encoder.matches(body.get("password"), teacher.get().getPassword())) {
            return teacher.get();
        }
        return Map.of("error", "Invalid username or password");
    }

    @PutMapping("/{id}/password")
    public Object changePassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return repo.findById(id).map(t -> {
            t.setPassword(encoder.encode(body.get("password")));
            return repo.save(t);
        }).orElse(null);
    }

    @GetMapping("/all-students")
    public Object getAllStudents() {
        return studentRepo.findAll();
    }
}