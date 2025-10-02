package product.asia.shop.service;

import product.asia.shop.dto.*;

import java.util.List;
import java.util.UUID;

public interface TranslationService {
    
    // Translation CRUD
    PageResponseDto<TranslationResponseDto> getAllTranslations(Integer page, Integer size, String entityType, String locale);
    List<TranslationResponseDto> getEntityTranslations(String entityType, UUID entityId, String locale);
    TranslationResponseDto getTranslationById(UUID id);
    TranslationResponseDto createTranslation(TranslationRequestDto request);
    TranslationResponseDto updateTranslation(UUID id, TranslationRequestDto request);
    void deleteTranslation(UUID id);
    
    // Bulk Operations
    List<TranslationResponseDto> createBulkTranslations(List<TranslationRequestDto> requests);
    List<TranslationResponseDto> updateBulkTranslations(List<TranslationUpdateDto> updates);
    
    // Translation Management
    List<MissingTranslationDto> getMissingTranslations(String entityType, String locale);
    List<LocaleInfoDto> getAvailableLocales(String entityType);
    TranslationStatisticsDto getTranslationStatistics();
    TranslationCoverageDto getTranslationCoverage(String entityType);
}
