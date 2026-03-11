package com.sundayschool.backend.controller;

import com.sundayschool.backend.model.Student;
import com.sundayschool.backend.model.Transaction;
import com.sundayschool.backend.repository.StudentRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private final StudentRepository studentRepo;
    public StudentController(StudentRepository studentRepo) {
        this.studentRepo = studentRepo;
    }

    @GetMapping("/class/{className}")
    public List<Student> getByClass(@PathVariable String className) {
        return studentRepo.findByClassName(className);
    }

    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return studentRepo.save(student);
    }

    @PostMapping("/{id}/award")
    public Student awardPoints(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Student student = studentRepo.findById(id).orElseThrow();
        int points      = (int) body.get("points");
        String desc     = (String) body.get("description");
        String emoji    = (String) body.get("emoji");
        String date     = (String) body.get("date");
        boolean isAttendance = "Attendance".equals(desc);

        if (isAttendance && student.getAttendance().contains(date)) {
            throw new RuntimeException("Already marked present today");
        }

        student.setPoints(student.getPoints() + points);
        student.setLifetimePoints(student.getLifetimePoints() + points);
        if (isAttendance) student.getAttendance().add(date);

        Transaction t = new Transaction();
        t.setDescription(desc);
        t.setEmoji(emoji);
        t.setPoints(points);
        t.setType("EARNED");
        t.setDate(date);
        t.setStudent(student);
        student.getTransactions().add(t);

        return studentRepo.save(student);
    }

    @PostMapping("/{id}/redeem")
    public Student redeemReward(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Student student = studentRepo.findById(id).orElseThrow();
        int cost        = (int) body.get("cost");
        String name     = (String) body.get("name");
        String emoji    = (String) body.get("emoji");
        String date     = (String) body.get("date");

        if (student.getPoints() < cost) throw new RuntimeException("Not enough points");

        student.setPoints(student.getPoints() - cost);

        Transaction t = new Transaction();
        t.setDescription("Redeemed: " + name);
        t.setEmoji(emoji);
        t.setPoints(cost);
        t.setType("REDEEMED");
        t.setDate(date);
        t.setStudent(student);
        student.getTransactions().add(t);

        return studentRepo.save(student);
    }


@DeleteMapping("/{id}")
public void deleteStudent(@PathVariable Long id) {
    studentRepo.deleteById(id);
}
}