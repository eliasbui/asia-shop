package product.asia.shop.service;

import product.asia.shop.dto.*;

import java.util.List;
import java.util.UUID;

public interface ShopService {
    
    // Shop CRUD
    PageResponseDto<ShopResponseDto> getAllShops(Integer page, Integer size, String locale);
    ShopResponseDto getShopById(UUID id, String locale);
    ShopResponseDto createShop(ShopRequestDto request);
    ShopResponseDto updateShop(UUID id, ShopRequestDto request);
    void deleteShop(UUID id);
    
    // Shop Products and Categories
    PageResponseDto<ProductResponseDto> getShopProducts(UUID shopId, Integer page, Integer size, String status, String locale);
    List<CategoryResponseDto> getShopCategories(UUID shopId, String locale);
    ShopStatisticsDto getShopStatistics(UUID shopId);
    
    // Shop Search
    PageResponseDto<ShopResponseDto> searchShops(String query, Integer page, Integer size, String locale);
}
