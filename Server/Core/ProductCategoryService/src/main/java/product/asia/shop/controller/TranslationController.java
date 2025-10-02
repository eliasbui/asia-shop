package product.asia.shop.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import product.asia.shop.dto.*;
import product.asia.shop.service.TranslationService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/translations")
@CrossOrigin(origins = "*")
public class TranslationController {

    private final TranslationService translationService;

    @Autowired
    public TranslationController(TranslationService translationService) {
        this.translationService = translationService;
    }

    // Translation CRUD
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponseDto<TranslationResponseDto>>> getAllTranslations(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String locale) {
        
        PageResponseDto<TranslationResponseDto> translations = translationService.getAllTranslations(
            page, size, entityType, locale);
        return ResponseEntity.ok(ApiResponse.success(translations));
    }

    @GetMapping("/{entityType}/{entityId}")
    public ResponseEntity<ApiResponse<List<TranslationResponseDto>>> getEntityTranslations(
            @PathVariable String entityType,
            @PathVariable UUID entityId,
            @RequestParam(required = false) String locale) {
        
        List<TranslationResponseDto> translations = translationService.getEntityTranslations(
            entityType, entityId, locale);
        return ResponseEntity.ok(ApiResponse.success(translations));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TranslationResponseDto>> getTranslationById(@PathVariable UUID id) {
        TranslationResponseDto translation = translationService.getTranslationById(id);
        return ResponseEntity.ok(ApiResponse.success(translation));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TranslationResponseDto>> createTranslation(
            @Valid @RequestBody TranslationRequestDto request) {
        
        TranslationResponseDto createdTranslation = translationService.createTranslation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdTranslation));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TranslationResponseDto>> updateTranslation(
            @PathVariable UUID id,
            @Valid @RequestBody TranslationRequestDto request) {
        
        TranslationResponseDto updatedTranslation = translationService.updateTranslation(id, request);
        return ResponseEntity.ok(ApiResponse.success(updatedTranslation));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTranslation(@PathVariable UUID id) {
        translationService.deleteTranslation(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // Bulk Operations
    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<TranslationResponseDto>>> createBulkTranslations(
            @Valid @RequestBody List<TranslationRequestDto> requests) {
        
        List<TranslationResponseDto> createdTranslations = translationService.createBulkTranslations(requests);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdTranslations));
    }

    @PutMapping("/bulk")
    public ResponseEntity<ApiResponse<List<TranslationResponseDto>>> updateBulkTranslations(
            @Valid @RequestBody List<TranslationUpdateDto> updates) {
        
        List<TranslationResponseDto> updatedTranslations = translationService.updateBulkTranslations(updates);
        return ResponseEntity.ok(ApiResponse.success(updatedTranslations));
    }

    // Missing Translations
    @GetMapping("/missing")
    public ResponseEntity<ApiResponse<List<MissingTranslationDto>>> getMissingTranslations(
            @RequestParam String entityType,
            @RequestParam String locale) {
        
        List<MissingTranslationDto> missingTranslations = translationService.getMissingTranslations(entityType, locale);
        return ResponseEntity.ok(ApiResponse.success(missingTranslations));
    }

    // Available Locales
    @GetMapping("/locales")
    public ResponseEntity<ApiResponse<List<LocaleInfoDto>>> getAvailableLocales(
            @RequestParam(required = false) String entityType) {
        
        List<LocaleInfoDto> locales = translationService.getAvailableLocales(entityType);
        return ResponseEntity.ok(ApiResponse.success(locales));
    }

    // Translation Statistics
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<TranslationStatisticsDto>> getTranslationStatistics() {
        TranslationStatisticsDto statistics = translationService.getTranslationStatistics();
        return ResponseEntity.ok(ApiResponse.success(statistics));
    }

    // Entity Translation Coverage
    @GetMapping("/coverage/{entityType}")
    public ResponseEntity<ApiResponse<TranslationCoverageDto>> getTranslationCoverage(
            @PathVariable String entityType) {
        
        TranslationCoverageDto coverage = translationService.getTranslationCoverage(entityType);
        return ResponseEntity.ok(ApiResponse.success(coverage));
    }
}
