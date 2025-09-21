package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type File struct {
	ID           uuid.UUID      `gorm:"primaryKey;size:36" json:"id"`
	UserID       uuid.UUID      `gorm:"size:36;not null;index:idx_user_id" json:"user_id"`
	OriginalName string         `gorm:"size:255;not null" json:"original_name"`
	StoredName   string         `gorm:"size:255;not null;index:idx_stored_name" json:"stored_name"`
	FilePath     string         `gorm:"size:500;not null" json:"file_path"`
	FileSize     int64          `gorm:"not null" json:"file_size"`
	MimeType     string         `gorm:"size:100;not null" json:"mime_type"`
	Checksum     string         `gorm:"size:64" json:"checksum"`
	BucketName   string         `gorm:"size:100;not null" json:"bucket_name"`
	IsPublic     bool           `gorm:"default:false" json:"is_public"`
	Metadata     datatypes.JSON `json:"metadata"`
	CreatedAt    time.Time      `gorm:"index:idx_created_at" json:"created_at"`
	CreatedBy    uuid.UUID      `gorm:"size:36;not null" json:"-"`
	UpdatedBy    uuid.UUID      `gorm:"size:36;not null" json:"-"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

// TableName specifies the table name for the File model
func (File) TableName() string {
	return "FILES"
}

// BeforeCreate generates UUID for the file if not provided
func (f *File) BeforeCreate(tx *gorm.DB) error {
	if f.ID == uuid.Nil {
		f.ID = uuid.New()
	}
	return nil
}
