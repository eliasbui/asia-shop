package product.asia.shop.entities;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "SHOPS")
public class ShopsEntity extends BaseEntity {

    @Column(name = "NAME", nullable = false, length = 100)
    private String name;

    @Column(name = "DESCRIPTION", nullable = false, length = 500)
    private String description;

    @Column(name = "ADDRESS", nullable = false, length = 500)
    private String address;

    @Column(name = "PHONE", nullable = false, length = 20)
    private String phone;

    @Column(name = "EMAIL", nullable = false, length = 100)
    private String email;

    @Column(name = "WEBSITE", nullable = false, length = 100)
    private String website;

    @Column(name = "LOGO", nullable = false, length = 100)
    private String logo;

    // getter and setter
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    // toString
    @Override
    public String toString() {
        return "ShopsEntity{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", address='" + address + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                ", website='" + website + '\'' +
                ", logo='" + logo + '\'' +
                '}';
    }

    // equals
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        ShopsEntity that = (ShopsEntity) o;
        return Objects.equals(super.getId(), that.getId()) && Objects.equals(name, that.name)
                && Objects.equals(description, that.description) && Objects.equals(address, that.address)
                && Objects.equals(phone, that.phone) && Objects.equals(email, that.email)
                && Objects.equals(website, that.website) && Objects.equals(logo, that.logo);
    }

    // hashCode
    @Override
    public int hashCode() {
        return Objects.hash(super.getId(), name, description, address, phone, email, website, logo);
    }

}
