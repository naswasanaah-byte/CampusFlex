package com.campusflex.model;

import com.campusflex.model.enums.VerificationStatus;

public class EmployerProfile {
    private Long id;
    private Long userId;
    private String companyName;
    private String companyDescription;
    private String industry;
    private String companySize;
    private String website;
    private String logoUrl;
    private String location;
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    public EmployerProfile() {}

    public EmployerProfile(Long id, Long userId, String companyName, String location) {
        this.id = id;
        this.userId = userId;
        this.companyName = companyName;
        this.location = location;
    }

    public boolean isVerified() {
        return verificationStatus == VerificationStatus.VERIFIED;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCompanyDescription() { return companyDescription; }
    public void setCompanyDescription(String companyDescription) { this.companyDescription = companyDescription; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getCompanySize() { return companySize; }
    public void setCompanySize(String companySize) { this.companySize = companySize; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public VerificationStatus getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }
}
