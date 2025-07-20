package main

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/cespare/xxhash/v2"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return "Hello " + name
}

// FileNode represents a file or directory in the file tree
type FileNode struct {
	Name     string      `json:"name"`
	Path     string      `json:"path"`
	IsDir    bool        `json:"is_dir"`
	Children []*FileNode `json:"children,omitempty"`
}

// CreateFileTree recursively steps through a given path to create a file tree
func (a *App) CreateFileTree(rootPath string, hideFiles bool) (*FileNode, error) {
	absPath, err := filepath.Abs(rootPath)
	if err != nil {
		return nil, err
	}

	info, err := os.Stat(absPath)
	if err != nil {
		return nil, err
	}

	root := &FileNode{
		Name:  info.Name(),
		Path:  absPath,
		IsDir: info.IsDir(),
	}

	if !info.IsDir() {
		return root, nil
	}

	entries, err := os.ReadDir(absPath)
	if err != nil {
		return nil, err
	}

	for _, entry := range entries {
		if hideFiles && !entry.IsDir() {
			continue
		}

		childPath := filepath.Join(absPath, entry.Name())
		childNode, err := a.CreateFileTree(childPath, hideFiles)
		if err != nil {
			// In a real app, you might want to log this error and continue
			return nil, err
		}
		root.Children = append(root.Children, childNode)
	}

	return root, nil
}

// FileNodeWithDetails represents a file or directory with additional details
type FileNodeWithDetails struct {
	Name     string                 `json:"name"`
	Path     string                 `json:"path"`
	IsDir    bool                   `json:"is_dir"`
	Size     int64                  `json:"size"`
	Hash     string                 `json:"hash,omitempty"`
	Children []*FileNodeWithDetails `json:"children,omitempty"`
}

// CreateFileTreeWithDetails recursively steps through a given path to create a file tree with details
func (a *App) CreateFileTreeWithDetails(rootPath string) (*FileNodeWithDetails, error) {
	absPath, err := filepath.Abs(rootPath)
	if err != nil {
		return nil, err
	}

	info, err := os.Stat(absPath)
	if err != nil {
		return nil, err
	}

	root := &FileNodeWithDetails{
		Name:  info.Name(),
		Path:  absPath,
		IsDir: info.IsDir(),
		Size:  info.Size(),
	}

	if !info.IsDir() {
		file, err := os.Open(absPath)
		if err != nil {
			return nil, err
		}
		defer file.Close()

		hasher := xxhash.New()
		if _, err := io.Copy(hasher, file); err != nil {
			return nil, err
		}
		root.Hash = fmt.Sprintf("%x", hasher.Sum64())
		return root, nil
	}

	entries, err := os.ReadDir(absPath)
	if err != nil {
		return nil, err
	}

	for _, entry := range entries {
		childPath := filepath.Join(absPath, entry.Name())
		childNode, err := a.CreateFileTreeWithDetails(childPath)
		if err != nil {
			// In a real app, you might want to log this error and continue
			return nil, err
		}
		root.Children = append(root.Children, childNode)
	}

	return root, nil
}
