package product.asia.shop.entities;

import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "TRANSLATIONS") // -- Multi-language support (attribute/option/product/category names)
public class TranslationsEntity extends BaseEntity {

    @Column(name = "ENTITY_TYPE", nullable = false, length = 50)
    private String entityType;

    // -- 'attribute', 'product', etc.
    @Column(name = "ENTITY_ID", nullable = false, length = 36)
    private UUID entityId;

    // locale -- 'en', 'vi', etc.
    @Column(name = "LOCALE", nullable = false, length = 10)
    private String locale;

    @Column(name = "FIELD", nullable = false, length = 50)
    private String field;

    @Column(name = "TRANSLATION", nullable = false, length = 255)
    private String translation;

    // getter and setter
    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public UUID getEntityId() {
        return entityId;
    }

    public void setEntityId(UUID entityId) {
        this.entityId = entityId;
    }

    public String getLocale() {
        return locale;
    }

    public void setLocale(String locale) {
        this.locale = locale;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getTranslation() {
        return translation;
    }

    public void setTranslation(String translation) {
        this.translation = translation;
    }

    // toString
    @Override
    public String toString() {
        return "TranslationsEntity{" +
                "entityType='" + entityType + '\'' +
                ", entityId=" + entityId +
                ", locale='" + locale + '\'' +
                ", field='" + field + '\'' +
                ", translation='" + translation + '\'' +
                '}';
    }

    // equals
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        TranslationsEntity that = (TranslationsEntity) o;
        return Objects.equals(super.getId(), that.getId()) && Objects.equals(entityType, that.entityId)
                && Objects.equals(entityId, that.entityId) && Objects.equals(locale, that.locale)
                && Objects.equals(field, that.field) && Objects.equals(translation, that.translation);
    }

    // hashCode
    @Override
    public int hashCode() {
        return Objects.hash(super.getId(), entityType, entityId, locale, field, translation);
    }
}
