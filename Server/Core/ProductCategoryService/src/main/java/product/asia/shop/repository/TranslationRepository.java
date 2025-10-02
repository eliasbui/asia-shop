package product.asia.shop.repository;

import product.asia.shop.entities.TranslationsEntity;
import product.asia.shop.repository.base.GenericRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TranslationRepository extends GenericRepository<TranslationsEntity, UUID> {
    
    /**
     * Find translation by entity type, entity ID, locale, and field
     */
    Optional<TranslationsEntity> findByEntityTypeAndEntityIdAndLocaleAndFieldAndIsDeletedFalse(
        String entityType, UUID entityId, String locale, String field);
    
    /**
     * Find all translations for an entity
     */
    List<TranslationsEntity> findByEntityTypeAndEntityIdAndIsDeletedFalse(String entityType, UUID entityId);
    
    /**
     * Find all translations for an entity in specific locale
     */
    List<TranslationsEntity> findByEntityTypeAndEntityIdAndLocaleAndIsDeletedFalse(
        String entityType, UUID entityId, String locale);
    
    /**
     * Find all translations by entity type and locale
     */
    List<TranslationsEntity> findByEntityTypeAndLocaleAndIsDeletedFalse(String entityType, String locale);
    
    /**
     * Find all translations by locale
     */
    List<TranslationsEntity> findByLocaleAndIsDeletedFalse(String locale);
    
    /**
     * Check if translation exists
     */
    boolean existsByEntityTypeAndEntityIdAndLocaleAndFieldAndIsDeletedFalse(
        String entityType, UUID entityId, String locale, String field);
    
    /**
     * Delete all translations for an entity
     */
    void deleteByEntityTypeAndEntityIdAndIsDeletedFalse(String entityType, UUID entityId);
    
    /**
     * Delete translations for specific field of an entity
     */
    void deleteByEntityTypeAndEntityIdAndFieldAndIsDeletedFalse(String entityType, UUID entityId, String field);
    
    /**
     * Count translations by entity type
     */
    long countByEntityTypeAndIsDeletedFalse(String entityType);
    
    /**
     * Count translations by locale
     */
    long countByLocaleAndIsDeletedFalse(String locale);
    
    /**
     * Find missing translations (entities without translation in specific locale)
     */
    List<UUID> findEntitiesWithoutTranslation(String entityType, String locale);
    
    /**
     * Find available locales for entity type
     */
    List<String> findDistinctLocalesByEntityTypeAndIsDeletedFalse(String entityType);
    
    /**
     * Find entities with translations in specific locale
     */
    List<UUID> findEntityIdsWithTranslationInLocale(String entityType, String locale);
}
