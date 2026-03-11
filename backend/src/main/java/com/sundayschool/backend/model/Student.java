package com.sundayschool.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private int points;
    private int lifetimePoints;
    private String className;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "attendance", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "date")
    private List<String> attendance = new ArrayList<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Transaction> transactions = new ArrayList<>();
}