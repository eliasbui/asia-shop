# Architecture Documentation

## Generic Repository and Unit of Work Patterns

This project implements the **Generic Repository Pattern** and **Unit of Work Pattern** to provide a more flexible,
testable, and maintainable data access layer.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Controllers                                ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                            │
│  ┌─────────────────────────────────────────────────────────┐│
│  │           Business Logic Services                       ││
│  │  ┌─────────────────────┐  ┌─────────────────────────────┐││
│  │  │  Standard Service   │  │  Unit of Work Service       │││
│  │  │  (Spring @Trans)    │  │  (Manual Transactions)     │││
│  │  └─────────────────────┘  └─────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────┐
│                 Repository Layer                            │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Unit of Work                               ││
│  │  ┌─────────────────────┐  ┌─────────────────────────────┐││
│  │  │  Repository Factory │  │   Transaction Manager      │││
│  │  └─────────────────────┘  └─────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │             Generic Repositories                        ││
│  │  ┌─────────────────────┐  ┌─────────────────────────────┐││
│  │  │   Base Repository   │  │  Specific Repositories      │││
│  │  │   (Generic CRUD)    │  │  (Custom Queries)           │││
│  │  └─────────────────────┘  └─────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                 JPA/Hibernate                           ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   Database                              ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Generic Repository Pattern

### Purpose

- **Abstraction**: Provides a common interface for data access operations
- **Reusability**: Common CRUD operations can be reused across entities
- **Testability**: Easy to mock and unit test
- **Consistency**: Standardized data access patterns

### Components

#### 1. GenericRepository Interface

```java
public interface GenericRepository<T, ID> {
    T save(T entity);

    Optional<T> findById(ID id);

    List<T> findAll();

    Page<T> findAll(Pageable pageable);

    void deleteById(ID id);
    // ... other common operations
}
```

#### 2. BaseRepository Implementation

- Provides concrete implementation using JPA Criteria API
- Uses generics to work with any entity type
- Implements common CRUD operations
- Thread-safe and transaction-aware

#### 3. Specific Repository Interfaces

```java
public interface ProductCategoryRepository extends GenericRepository<ProductCategory, Long> {
    Optional<ProductCategory> findByNameIgnoreCase(String name);

    List<ProductCategory> findByIsActiveTrueOrderBySortOrderAsc();
    // ... domain-specific methods
}
```

### Benefits

1. **Code Reuse**: Common operations implemented once
2. **Type Safety**: Generic types ensure compile-time type checking
3. **Flexibility**: Easy to add new entities with minimal code
4. **Maintainability**: Changes to base operations affect all repositories

## Unit of Work Pattern

### Purpose

- **Transaction Management**: Controls transaction boundaries explicitly
- **Change Tracking**: Tracks all changes within a business operation
- **Batch Operations**: Groups multiple operations into a single transaction
- **Consistency**: Ensures data consistency across multiple repositories

### Components

#### 1. UnitOfWork Interface

```java
public interface UnitOfWork {
    <T, ID> GenericRepository<T, ID> getRepository(Class<T> entityClass);

    void beginTransaction();

    void commit();

    void rollback();

    void executeInTransaction(Runnable action);

    <T> T executeInTransaction(Supplier<T> action);
}
```

#### 2. UnitOfWorkImpl

- Manages EntityManager and transactions
- Provides repository instances through factory
- Handles transaction lifecycle
- Supports nested operations

#### 3. Repository Factory

- Creates appropriate repository instances
- Caches repositories for reuse
- Supports custom repository implementations
- Manages dependency injection

### Benefits

1. **Explicit Transactions**: Fine-grained control over transaction boundaries
2. **Batch Operations**: Multiple operations in single transaction
3. **Consistency**: All-or-nothing semantics for complex operations
4. **Performance**: Reduced database round trips
5. **Testing**: Easy to test transaction scenarios

## Usage Examples

### Standard Service (Spring @Transactional)

```java

@Service
@Transactional
public class ProductCategoryServiceImpl {
    private final ProductCategoryRepository repository;

    public ProductCategoryResponseDto createCategory(ProductCategoryRequestDto dto) {
        // Spring manages transaction automatically
        ProductCategory entity = mapper.toEntity(dto);
        ProductCategory saved = repository.save(entity);
        return mapper.toResponseDto(saved);
    }
}
```

### Unit of Work Service (Manual Transactions)

```java

@Service
public class ProductCategoryServiceUowImpl {
    private final UnitOfWork unitOfWork;

    public ProductCategoryResponseDto createCategory(ProductCategoryRequestDto dto) {
        return unitOfWork.executeInTransaction(() -> {
            ProductCategoryRepository repo = unitOfWork.getRepository(ProductCategory.class);

            // Validation
            if (repo.existsByNameIgnoreCase(dto.getName())) {
                throw new CategoryAlreadyExistsException("Category exists");
            }

            // Business logic
            ProductCategory entity = mapper.toEntity(dto);
            ProductCategory saved = repo.save(entity);
            return mapper.toResponseDto(saved);
        });
    }
}
```

### Complex Operations with Unit of Work

```java
public void bulkCreateCategories(List<ProductCategoryRequestDto> dtos) {
    unitOfWork.executeInTransaction(() -> {
        ProductCategoryRepository repo = unitOfWork.getRepository(ProductCategory.class);

        for (ProductCategoryRequestDto dto : dtos) {
            // Validation for each category
            if (repo.existsByNameIgnoreCase(dto.getName())) {
                throw new CategoryAlreadyExistsException("Category exists: " + dto.getName());
            }

            ProductCategory entity = mapper.toEntity(dto);
            repo.save(entity);
        }

        // All operations committed together
        unitOfWork.flush();
    });
}
```

## Configuration

### Service Selection

The project provides both implementations:

- **ProductCategoryServiceImpl**: Uses Spring's `@Transactional`
- **ProductCategoryServiceUowImpl**: Uses Unit of Work pattern (marked as `@Primary`)

You can switch between implementations by changing the `@Primary` annotation or using `@Qualifier`.

### Repository Factory Configuration

```java

@Component
public class RepositoryFactoryImpl implements RepositoryFactory {

    private GenericRepository createRepository(Class entityClass) {
        // Custom repositories for specific entities
        if (entityClass.equals(ProductCategory.class)) {
            return new ProductCategoryRepositoryImpl();
        }

        // Generic repository for other entities
        return new GenericRepositoryImpl(entityClass);
    }
}
```

## Testing

### Unit Testing with Mocks

```java

@Test
public void testCreateCategory() {
    // Mock Unit of Work
    UnitOfWork mockUoW = mock(UnitOfWork.class);
    ProductCategoryRepository mockRepo = mock(ProductCategoryRepository.class);

    when(mockUoW.getRepository(ProductCategory.class)).thenReturn(mockRepo);
    when(mockUoW.executeInTransaction(any(Supplier.class))).thenAnswer(invocation -> {
        Supplier supplier = invocation.getArgument(0);
        return supplier.get();
    });

    // Test service
    ProductCategoryServiceUowImpl service = new ProductCategoryServiceUowImpl(mockUoW, mapper);
    // ... test implementation
}
```

### Integration Testing

```java

@SpringBootTest
@Transactional
public class RepositoryIntegrationTest {

    @Autowired
    private UnitOfWork unitOfWork;

    @Test
    public void testBulkOperations() {
        unitOfWork.executeInTransaction(() -> {
            ProductCategoryRepository repo = unitOfWork.getRepository(ProductCategory.class);

            // Create multiple categories
            ProductCategory cat1 = new ProductCategory("Electronics", "Electronic devices");
            ProductCategory cat2 = new ProductCategory("Books", "Books and literature");

            repo.save(cat1);
            repo.save(cat2);

            // Verify in same transaction
            List<ProductCategory> categories = repo.findAll();
            assertThat(categories).hasSize(2);
        });
    }
}
```

## Performance Considerations

### Advantages

1. **Reduced Database Calls**: Batch operations in single transaction
2. **Connection Pooling**: Efficient use of database connections
3. **Lazy Loading**: Entities loaded only when needed
4. **Query Optimization**: Criteria API generates optimized queries

### Best Practices

1. **Keep Transactions Short**: Minimize lock time
2. **Batch Operations**: Group related operations
3. **Use Pagination**: For large result sets
4. **Proper Exception Handling**: Ensure rollback on errors
5. **Monitor Performance**: Use database profiling tools

## Migration Guide

### From Spring Data JPA to Generic Repository

1. Replace `JpaRepository` extends with `GenericRepository`
2. Implement custom queries using Criteria API
3. Update service to use repository factory or Unit of Work
4. Add transaction management if needed

### Adding New Entities

1. Create entity class with JPA annotations
2. Create repository interface extending `GenericRepository`
3. Implement custom repository if needed custom queries
4. Register in repository factory
5. Create service using Unit of Work or standard approach

## Troubleshooting

### Common Issues

1. **Transaction Not Active**: Ensure proper transaction management
2. **Repository Not Found**: Check repository factory registration
3. **Entity Manager Issues**: Verify proper injection and lifecycle
4. **Performance Issues**: Review query patterns and indexing

### Debug Tips

1. Enable SQL logging: `spring.jpa.show-sql=true`
2. Use transaction logging: `logging.level.org.springframework.transaction=DEBUG`
3. Monitor connection pools
4. Profile database queries

## Conclusion

The Generic Repository and Unit of Work patterns provide:

- **Flexibility**: Easy to extend and modify
- **Testability**: Clean separation of concerns
- **Performance**: Optimized database operations
- **Maintainability**: Consistent patterns across the application
- **Scalability**: Supports complex business operations

Choose the appropriate pattern based on your use case:

- **Simple CRUD**: Use Generic Repository with Spring @Transactional
- **Complex Operations**: Use Unit of Work for explicit transaction control
- **Mixed Scenarios**: Both patterns can coexist in the same application
