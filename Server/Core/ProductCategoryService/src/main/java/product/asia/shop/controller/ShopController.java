package product.asia.shop.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import product.asia.shop.dto.*;
import product.asia.shop.service.ShopService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/shops")
@CrossOrigin(origins = "*")
public class ShopController {

    private final ShopService shopService;

    @Autowired
    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    // Shop CRUD
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponseDto<ShopResponseDto>>> getAllShops(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) String locale) {
        
        PageResponseDto<ShopResponseDto> shops = shopService.getAllShops(page, size, locale);
        return ResponseEntity.ok(ApiResponse.success(shops));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ShopResponseDto>> getShopById(
            @PathVariable UUID id,
            @RequestParam(required = false) String locale) {
        
        ShopResponseDto shop = shopService.getShopById(id, locale);
        return ResponseEntity.ok(ApiResponse.success(shop));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ShopResponseDto>> createShop(@Valid @RequestBody ShopRequestDto request) {
        ShopResponseDto createdShop = shopService.createShop(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdShop));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ShopResponseDto>> updateShop(
            @PathVariable UUID id,
            @Valid @RequestBody ShopRequestDto request) {
        
        ShopResponseDto updatedShop = shopService.updateShop(id, request);
        return ResponseEntity.ok(ApiResponse.success(updatedShop));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteShop(@PathVariable UUID id) {
        shopService.deleteShop(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // Shop Products
    @GetMapping("/{id}/products")
    public ResponseEntity<ApiResponse<PageResponseDto<ProductResponseDto>>> getShopProducts(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String locale) {
        
        PageResponseDto<ProductResponseDto> products = shopService.getShopProducts(id, page, size, status, locale);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/{id}/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponseDto>>> getShopCategories(
            @PathVariable UUID id,
            @RequestParam(required = false) String locale) {
        
        List<CategoryResponseDto> categories = shopService.getShopCategories(id, locale);
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @GetMapping("/{id}/statistics")
    public ResponseEntity<ApiResponse<ShopStatisticsDto>> getShopStatistics(@PathVariable UUID id) {
        ShopStatisticsDto statistics = shopService.getShopStatistics(id);
        return ResponseEntity.ok(ApiResponse.success(statistics));
    }

    // Shop Search
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponseDto<ShopResponseDto>>> searchShops(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) String locale) {
        
        PageResponseDto<ShopResponseDto> shops = shopService.searchShops(query, page, size, locale);
        return ResponseEntity.ok(ApiResponse.success(shops));
    }
}
