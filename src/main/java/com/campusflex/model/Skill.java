package com.campusflex.model;

public class Skill {
    private Long id;
    private String skillName;
    private String category;

    public Skill() {}

    public Skill(Long id, String skillName, String category) {
        this.id = id;
        this.skillName = skillName;
        this.category = category;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
